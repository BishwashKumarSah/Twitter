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

const queries = {
  getAllTweets: async () => {
    const cachedAllTweets = await redisClient?.get("ALL_TWEETS");
    if (cachedAllTweets) {
      return JSON.parse(cachedAllTweets);
    }
    const allTweets = await TweetService.getAllTweets();
    await redisClient?.set("ALL_TWEETS", JSON.stringify(allTweets));
    return allTweets;
  },

  getAllUser: async () => UserService.getAllUsers(),

  getAllUserTweets: async (_: any, { userId }: { userId: string }) => {
    // const cachedAllUserTweetsById = await redisClient?.get(
    //   `allUserTweetsById:${userId}`
    // );
    // if (cachedAllUserTweetsById) return cachedAllUserTweetsById;
    const getAllUserTweetsById = await UserService.getAllUserTweets(userId);
    console.log("getAllUserTweetsById",getAllUserTweetsById);
    // await redisClient?.set(
    //   `allUserTweetsById:${userId}`,
    //   JSON.stringify(getAllUserTweetsById)
    // );
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
    await redisClient?.del("ALL_TWEETS");
    return newTweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: async (parent: Tweet) => {
      return await prismaClient.user.findUnique({
        where: { email: parent.authorId },
      });
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };
