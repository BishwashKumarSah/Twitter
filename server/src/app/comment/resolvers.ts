import { Comment } from "@prisma/client";
import { GraphqlContext } from "../interface";

export interface CommentPayloadInterface {
  content: string;
  tweetId: string;
}

const queries = {
  // getAllCommentsByTweetId(tweetId:String!):[Comment!]
  getAllCommentsByTweetId: async (
    _: any,
    { tweetId }: { tweetId: string },
    ctx: GraphqlContext
  ) => {
    const allTweetsByTweetIdData = await prismaClient?.comment.findMany({
      where: {
        tweetId: tweetId,
      },
      include: {
        tweet: true,
        user: true,
      },
    });
    // console.log("allTweetsByTweetsIdData", allTweetsByTweetIdData);
    return allTweetsByTweetIdData;
  },
};

const mutations = {
  // postCommentByTweetId(tweetId:String!):Boolean!
  postCommentByTweetId: async (
    _: any,
    { payload }: { payload: CommentPayloadInterface },
    ctx: GraphqlContext
  ) => {
    if (!ctx || !ctx.user?.id) {
      throw new Error("Please login to post a comment.");
    }
    console.log(payload.content, payload.tweetId, ctx.user.id);

    const postCommentByTweetIdData = await prismaClient?.comment.create({
      data: {
        tweetId: payload.tweetId,
        content: payload.content,
        userId: ctx.user.id,
      },
    });

    return postCommentByTweetIdData;
  },
};

const extraResolvers = {
  Comment: {
    tweet: async (parent: Comment) => {
      return await prismaClient?.tweet.findUnique({
        where: {
          id: parent.tweetId,
        },
      });
    },
    user: async (parent: Comment, _: any, ctx: GraphqlContext) => {
      return await prismaClient?.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };
