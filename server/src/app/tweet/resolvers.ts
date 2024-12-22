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
  getAllTweets: async () => {
    const cachedAllTweets = await redisClient?.get("ALL_TWEETS");
    if (cachedAllTweets) {
      return JSON.parse(cachedAllTweets);
    }
    const allTweets = await TweetService.getAllTweets();
    await redisClient?.setex("ALL_TWEETS", 2000, JSON.stringify(allTweets));
    return allTweets;
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

  getAllUserTweets: async (
    _: any,
    { userId }: { userId: string },
    ctx: GraphqlContext
  ) => {
    if (!userId || userId === "favicon.ico") {
      throw new Error("Please provide a valid userId to getAllUserTweets");
    }
    if (!ctx || !ctx.user?.id) {
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
    const newTweet = TweetService.createTweet(payload, ctx);
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
    const RATE_LIMIT_LIKES = await redisClient?.get(
      `RATE_LIMIT:LIKE:${ctx.user.id}`
    );
    if (RATE_LIMIT_LIKES) {
      throw new Error("Please wait for 10 seconds to post again!");
    }
    // 1. Check if the user has already liked the tweet
    const hasAlreadyLiked = await prismaClient.likes.findUnique({
      where: {
        tweetId_userId: {
          tweetId: payload.tweetId,
          userId: ctx.user.id,
        },
      },
    });

    // 2. If the user has already liked, remove the like
    if (hasAlreadyLiked) {
      // Remove the like from the Likes table
      await prismaClient.likes.delete({
        where: {
          tweetId_userId: {
            tweetId: payload.tweetId,
            userId: ctx.user.id,
          },
        },
      });

      // Decrement the like count in the database
      await prismaClient.tweet.update({
        where: {
          id: payload.tweetId,
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });
      await redisClient?.del("ALL_TWEETS");
      await redisClient?.del(`All_BookMarked_Tweets/${ctx.user.id}`);
      await redisClient?.setex(
        `RATE_LIMIT:LIKE:${ctx.user.id}`,
        10,
        ctx.user.id
      );
      return false; // Tweet unliked
    } else {
      // Add the like to the Likes table
      await prismaClient.likes.create({
        data: {
          tweetId: payload.tweetId,
          userId: ctx.user.id,
        },
      });

      // Increment the like count in the database
      await prismaClient.tweet.update({
        where: {
          id: payload.tweetId,
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });
      await redisClient?.setex(
        `RATE_LIMIT:LIKE:${ctx.user.id}`,
        10,
        ctx.user.id
      );
      await redisClient?.del("ALL_TWEETS");
      await redisClient?.del(`All_BookMarked_Tweets/${ctx.user.id}`);
      return true; // Tweet liked
    }
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

    likesCount: async (parent: Tweet) => {
      try {
        const val = parent.likesCount; // Return the likesCount stored in the Tweet model
        return val;
      } catch (error) {
        console.error("Error fetching like count:", error);
        throw new Error("Unable to fetch like count");
      }
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
