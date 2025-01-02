import { Comment } from "@prisma/client";
import { GraphqlContext } from "../interface";
import { redisClient } from "../../clients/redis";

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

    const RATE_LIMIT_COMMENT = await redisClient?.get(
      `RATE_LIMIT:COMMENT:${ctx.user.id}`
    );

    if (RATE_LIMIT_COMMENT) {
      throw new Error("Please wait for 10 sec to comment again!");
    }

    await redisClient?.setex(
      `RATE_LIMIT:COMMENT:${ctx.user.id}`,
      10,
      ctx.user.id
    );

    const cachedOldComments = await redisClient?.get(
      `Comments:${payload.tweetId}`
    );

    const postCommentByTweetIdData = await prismaClient?.comment.create({
      data: {
        tweetId: payload.tweetId,
        content: payload.content,
        userId: ctx.user.id,
      },
    });

    if (cachedOldComments) {
      const newComments = [
        postCommentByTweetIdData,
        ...JSON.parse(cachedOldComments),
      ];
      await redisClient?.set(
        `Comments:${payload.tweetId}`,
        JSON.stringify(newComments)
      );
    } else {
      await redisClient?.set(
        `Comments:${payload.tweetId}`,
        JSON.stringify([postCommentByTweetIdData])
      );
    }

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
        include: {
          comment: true,
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
