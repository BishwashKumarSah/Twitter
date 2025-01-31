import { BookMark, User } from "@prisma/client";
import { redisClient } from "../../clients/redis";
import { GraphqlContext } from "../interface";

export interface BookMarkTweetInput {
  tweetId: string;
}

const formatError = (error: unknown): Error => {
  if (error instanceof Error) {
    return new Error(error.message);
  }
  return new Error("An unexpected error occurred!");
};

const queries = {
  getAllUserBookMarks: async (_: any, __: any, ctx: GraphqlContext) => {
    try {
      if (!ctx?.user?.id) {
        throw new Error("Please login to see all the bookmarks!");
      }
      const cacheKey = `All_BookMarked_Tweets:${ctx.user.id}`;
      const cachedBookmark = await redisClient?.get(cacheKey);

      if (cachedBookmark) return JSON.parse(cachedBookmark);
      const allBookMarks = await prismaClient?.bookMark.findMany({
        where: {
          userId: ctx.user.id,
        },
        include: {
          tweet: true,
          user: true,
        },
      });

      await redisClient?.set(cacheKey, JSON.stringify(allBookMarks));

      return allBookMarks;
    } catch (error: unknown) {
      throw formatError(error);
    }
  },
};

const mutations = {
  BookmarkTweet: async (
    _: any,
    { payload }: { payload: BookMarkTweetInput },
    ctx: GraphqlContext
  ) => {
    try {
      if (!ctx?.user?.id) {
        throw new Error("Please login to manage your bookmarks!");
      }

      const rateLimitKey = `BookMark_Rate_Limit:${ctx.user.id}`;
      const cacheKey = `All_BookMarked_Tweets:${ctx.user.id}`;
      const BookMarkRateLimit = await redisClient?.get(rateLimitKey);

      if (BookMarkRateLimit) {
        const ttl = await redisClient?.ttl(rateLimitKey);
        throw new Error(`Please wait ${ttl} seconds before bookmarking again!`);
      }

      await redisClient?.setex(rateLimitKey, 10, ctx.user.id);

      // Clear relevant cache
      await redisClient?.del(cacheKey);

      const hasAlreadyBookMarked = await prismaClient?.bookMark.findUnique({
        where: {
          tweetId_userId: {
            tweetId: payload.tweetId,
            userId: ctx.user?.id,
          },
        },
      });

      if (hasAlreadyBookMarked) {
        // Delete the bookmark
        const deletedBookmark = await prismaClient?.bookMark.delete({
          where: {
            tweetId_userId: {
              tweetId: payload.tweetId,
              userId: ctx.user?.id,
            },
          },
        });

        return { tweetId: payload.tweetId, userId: ctx.user.id };
      } else {
        // Create a new bookmark
        const newBookMarkTweet = await prismaClient?.bookMark.create({
          data: {
            tweetId: payload.tweetId,
            userId: ctx.user.id,
          },
          include: {
            tweet: true,
            user: true,
          },
        });

        return {
          tweetId: newBookMarkTweet?.tweetId,
          tweet: newBookMarkTweet?.tweet,
          user: newBookMarkTweet?.user,
          userId: newBookMarkTweet?.userId,
        };
      }
    } catch (error: unknown) {
      throw formatError(error);
    }
  },
};

const extraResolver = {
  BookMark: {
    tweet: async (parent: BookMark) => {
      const tweet = await prismaClient?.tweet.findUnique({
        where: {
          id: parent.tweetId,
        },
      });

      return tweet;
    },
    user: async (parent: BookMark) => {
      const user = await prismaClient?.user.findUnique({
        where: {
          id: parent.userId,
        },
      });

      return user;
    },
  },
};

export const resolver = { queries, mutations, extraResolver };
