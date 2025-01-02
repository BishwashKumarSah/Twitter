import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../interface";
import { TweetService } from "../../services/tweet";
import { UserService } from "../../services/user";
import { redisClient } from "../../clients/redis";

export interface CreateTweetData {
  content: string;
  imageUrl?: string[];
}

export interface LikeUnlikeTweetData {
  tweetId: string;
}

const queries = {
  getAllTweets: async (
    _: any,
    { limit, offset }: { limit: number; offset: number }
  ) => {
    const cacheKey = `ALL_TWEETS_${offset}_${limit}`;
    const cachedTweets = await redisClient?.get(cacheKey);

    if (cachedTweets) {
      return JSON.parse(cachedTweets);
    }

    const tweets = await TweetService.getAllTweets({ limit, offset });

    // Cache the paginated result with an expiration time (e.g., 3600 seconds)
    await redisClient?.setex(cacheKey, 3600, JSON.stringify(tweets));

    return tweets;
  },

  getTweetById: async (
    _: any,
    { tweetId }: { tweetId: string },
    ctx: GraphqlContext
  ) => {
    const tweetByIdCache = await redisClient?.get(`tweet:${tweetId}:comment`);
    if (tweetByIdCache) {
      return JSON.parse(tweetByIdCache);
    }
    const tweet = await TweetService.getTweetById(tweetId);
    await redisClient?.set(`tweet:${tweetId}:comment`, JSON.stringify(tweet));
    return tweet;
  },

  getAllUser: async () => UserService.getAllUsers(),

  // getTweetsAndUsersQuery(debouncedSearch:String!):TweetAndUsers
  getTweetsAndUsersQuery: async (
    _: any,
    { debouncedSearch }: { debouncedSearch: string },
    ctx: GraphqlContext
  ) => {
    const users = await prismaClient.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: debouncedSearch,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: debouncedSearch,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: debouncedSearch,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const tweets = await prismaClient.tweet.findMany({
      where: {
        content: {
          contains: debouncedSearch,
          mode: "insensitive",
        },
      },
    });

    return {
      tweet: tweets,
      user: users,
    };
  },

  getAllUserTweets: async (
    _: any,
    { userId }: { userId: string },
    ctx: GraphqlContext
  ) => {
    if (!userId || userId === "favicon.ico") {
      throw new Error("Please provide a valid userId to getAllUserTweets");
    }

    const cachedAllUserTweetsById = await redisClient?.get(
      `allUserTweetsByIddd:${userId}`
    );
    if (cachedAllUserTweetsById) return JSON.parse(cachedAllUserTweetsById);
    const getAllUserTweetsById = await UserService.getAllUserTweets(userId);
    // console.log("getAllUserTweetsById",getAllUserTweetsById?.tweets);
    await redisClient?.set(
      `allUserTweetsByIddd:${userId}`,
      JSON.stringify(getAllUserTweetsById)
    );
    return getAllUserTweetsById;
  },

  getAWSPreSignedUrl: async (
    _: any,
    { imageName, imageType }: { imageName?: string; imageType: string },
    ctx: GraphqlContext
  ) => TweetService.getAWSPreSignedUrl(imageType, ctx, imageName),
};

const mutations = {
  createTweet: async (
    _: any,
    { payload }: { payload: CreateTweetData },
    ctx: GraphqlContext
  ) => {
    const firstPage = 0;
    const limit = 10;
    const cachedTweets = await redisClient?.get(
      `ALL_TWEETS${firstPage}_${limit}`
    );
    const newTweet = await TweetService.createTweet(payload, ctx);
    if (!cachedTweets) {
      return await redisClient?.set(
        `ALL_TWEETS${firstPage}_${limit}`,
        JSON.stringify(newTweet)
      );
    }
    const newCacheData = [newTweet, ...JSON.parse(cachedTweets)];
    await redisClient?.set(
      `ALL_TWEETS${firstPage}_${limit}`,
      JSON.stringify(newCacheData)
    );
    // await redisClient?.del("ALL_TWEETS");
    return newTweet;
  },

  likeTweet: async (
    _: any,
    { payload }: { payload: LikeUnlikeTweetData },
    ctx: GraphqlContext
  ) => {
    if (!ctx || !ctx.user?.id)
      throw new Error("Please Login To Perform This Action!");

    const { tweetId } = payload;
    const userId = ctx.user.id;

    // Rate limiting: check if the user is allowed to like/unlike
    const rateLimitKey = `RATE_LIMIT:LIKE:${userId}`;
    const isRateLimited = await redisClient?.get(rateLimitKey);

    if (isRateLimited) {
      throw new Error("Please wait for 10 seconds!");
    }

    // Set the rate limit key with a 10-second expiration
    await redisClient?.setex(rateLimitKey, 10, "true");

    // Check if the user has already liked the tweet
    const hasLiked = await prismaClient.likes.findUnique({
      where: { tweetId_userId: { tweetId, userId } },
    });

    if (hasLiked) {
      // Unlike the tweet
      await prismaClient.likes.delete({
        where: { tweetId_userId: { tweetId, userId } },
      });
      await prismaClient.tweet.update({
        where: { id: tweetId },
        data: { likesCount: { decrement: 1 } },
      });
    } else {
      // Like the tweet
      await prismaClient.likes.create({
        data: { tweetId, userId },
      });
      await prismaClient.tweet.update({
        where: { id: tweetId },
        data: { likesCount: { increment: 1 } },
      });
    }

    // Invalidate affected cache
    const keysToInvalidate = await redisClient?.keys("ALL_TWEETS_*");
    if (keysToInvalidate?.length) {
      await redisClient?.del(keysToInvalidate);
    }
    await redisClient?.del(`All_BookMarked_Tweets:${userId}`);
    await redisClient?.del(`allUserTweetsByIddd:${userId}`);

    return true;
  },
};

const extraResolvers = {
  Tweet: {
    author: async (parent: Tweet) => {
      return await prismaClient.user.findUnique({
        where: { email: parent.authorId },
      });
    },

    comment: async (parent: Tweet) => {
      return await prismaClient.comment.findMany({
        where: {
          tweetId: parent.id,
        },
      });
    },
    commentCount: async (parent: Tweet) => {
      return await prismaClient.comment.count({
        where: {
          tweetId: parent.id,
        },
      });
    },

    likesCount: async (parent: Tweet) => {
      const latestTweet = await prismaClient.tweet.findUnique({
        where: { id: parent.id },
        select: { likesCount: true },
      });
      return latestTweet?.likesCount || 0; // Return the latest like count from DB
    },
    hasBookMarked: async (parent: Tweet, _: any, ctx: GraphqlContext) => {
      if (!ctx || !ctx.user?.id) return false;

      const hasBookmarkedTweets = await prismaClient.bookMark.findUnique({
        where: {
          tweetId_userId: {
            tweetId: parent.id,
            userId: ctx.user.id,
          },
        },
      });

      return hasBookmarkedTweets !== null;
    },

    isLikedByUser: async (parent: Tweet, args: any, ctx: GraphqlContext) => {
      if (!ctx || !ctx.user?.id) return false;
      const res = await prismaClient.likes.findUnique({
        where: {
          tweetId_userId: {
            tweetId: parent.id,
            userId: ctx.user?.id,
          },
        },
      });
      return res !== null;
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };
