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
      const allBookMarks = await prismaClient?.bookMark.findMany({
        where: {
          userId: ctx.user.id,
        },
        include: {
          tweet: true,
          user: true,
        },
      });
      console.log("ALLBOOKMARKS", allBookMarks);
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
    { BookMarkTweetPayload }: { BookMarkTweetPayload: BookMarkTweetInterface },
    ctx: GraphqlContext
  ) => {
    try {
      if (!ctx || !ctx.user?.id) {
        throw new Error("Please Login To View Your BookMark!");
      }
      const hasAlreadyBookMarked = await prismaClient?.bookMark.findUnique({
        where: {
          tweetId_userId: {
            tweetId: BookMarkTweetPayload.tweetId,
            userId: ctx.user?.id,
          },
        },
      });
      if (hasAlreadyBookMarked) {
        await prismaClient?.bookMark.delete({
          where: {
            tweetId_userId: {
              tweetId: BookMarkTweetPayload.tweetId,
              userId: ctx.user?.id,
            },
          },
        });
        return true;
      } else {
        await prismaClient?.bookMark.create({
          data: {
            tweetId: BookMarkTweetPayload.tweetId,
            userId: ctx.user.id,
          },
        });
        return true;
      }
    } catch (error: unknown) {
      // Type narrowing: check if error is an instance of Error
      if (error instanceof Error) {
        // Now we can safely access error.message and other properties
        console.error("BookmarkError", error);
        throw new Error(error.message || "An unexpected error occurred!");
      } else {
        // If it's not an instance of Error, handle accordingly
        console.error("BookmarkError An unknown error occurred");
        throw new Error("An unexpected error occurred While BookMarking !");
      }
    }
  },
};

const extraResolver = {};

export const resolver = { queries, mutations, extraResolver };
