import { BookMark, User } from "@prisma/client";
import { redisClient } from "../../clients/redis";
import { GraphqlContext } from "../interface";

export interface BookMarkTweetInterface {
  tweetId: string;
}

const queries = {
  getAllUserBookMarks: async (_: any, payload: any, ctx: GraphqlContext) => {
    try {
      if (!ctx || !ctx?.user?.id) {
        throw new Error("Please Login To See All The BookMarks!");
      }
      const allBookMarksCache = await redisClient?.get(
        `All_BookMarked_Tweets/${ctx.user.id}`
      );
      if (allBookMarksCache) return JSON.parse(allBookMarksCache);
      const allBookMarks = await prismaClient?.bookMark.findMany({
        where: {
          userId: ctx.user.id,
        },
        include: {
          tweet: true,
          user: true,
        },
      });
      await redisClient?.set(
        `All_BookMarked_Tweets/${ctx.user.id}`,
        JSON.stringify(allBookMarks)
      );
      // console.log("ALLBOOKMARKS", allBookMarks);
      return allBookMarks;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "An unknown error occurred while fetching bookmarked tweets!"
        );
      }
    }
  },
};

const mutations = {
  BookmarkTweet: async (
    _: any,
    { payload }: { payload: BookMarkTweetInterface },
    ctx: GraphqlContext
  ) => {
    try {
      if (!ctx || !ctx.user?.id) {
        throw new Error("Please Login To View Your BookMark!");
      }

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

        // Clear cache
        await redisClient?.del(`All_BookMarked_Tweets/${ctx.user.id}`);

        return { tweetId: payload.tweetId, userId: ctx.user.id }; // Return the deleted bookmark info
      } else {
        // Fetch the existing bookmarks from cache
        const allBookMarksCache = await redisClient?.get(
          `All_BookMarked_Tweets/${ctx.user.id}`
        );

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

        // Check if the new bookmark creation was successful
        if (!newBookMarkTweet) {
          throw new Error("Failed to create bookmark.");
        }

        // Log the new bookmark creation
        console.log("NewBookMarkCache", newBookMarkTweet);

        // Update cache
        if (allBookMarksCache) {
          const newBookMarksCache = [
            newBookMarkTweet,
            ...JSON.parse(allBookMarksCache),
          ];
          await redisClient?.set(
            `All_BookMarked_Tweets/${ctx.user.id}`,
            JSON.stringify(newBookMarksCache)
          );
        } else {
          await redisClient?.set(
            `All_BookMarked_Tweets/${ctx.user.id}`,
            JSON.stringify([newBookMarkTweet]) // Store the new bookmark as an array
          );
        }

        return {
          tweetId: newBookMarkTweet.tweetId,
          tweet: newBookMarkTweet.tweet,
          user: newBookMarkTweet.user,
          userId: newBookMarkTweet.userId,
        }; // Return the created bookmark info
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("BookmarkError", error);
        throw new Error(error.message || "An unexpected error occurred!");
      } else {
        console.error("BookmarkError An unknown error occurred");
        throw new Error("An unexpected error occurred While BookMarking!");
      }
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
      console.log("bookMarkTweet", tweet);
      return tweet;
    },
    user: async (parent: BookMark) => {
      const user = await prismaClient?.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
      console.log("bookmarkUser", user);
      return user;
    },
  },
};

export const resolver = { queries, mutations, extraResolver };
