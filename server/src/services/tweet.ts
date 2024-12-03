import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GraphqlContext } from "../app/interface";
import { prismaClient } from "../clients/db/index";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CreateTweetData } from "../app/tweet/resolvers";
import { redisClient } from "../clients/redis";
export class TweetService {
  public static async getAllTweets() {
    return await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  public static async createTweet(
    payload: CreateTweetData,
    ctx: GraphqlContext
  ) {
    if (!ctx.user) throw new Error("Please Login To Post a Tweet!");
    const checkRateLimitUser = await redisClient?.get(`RATE_LIMIT:CREATE_TWEET:${ctx.user.id}`)
    if(checkRateLimitUser){
        throw new Error("Please wait for 10 seconds to post again!")
    }
    const cachedAllTweets = await redisClient?.get("ALL_TWEETS");

    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageUrl: payload.imageUrl,
        author: { connect: { email: ctx.user.email } },
      },
    });
    if (cachedAllTweets) {
      const newTweets = [tweet,...JSON.parse(cachedAllTweets)];
      await redisClient?.set("ALL_TWEETS", JSON.stringify(newTweets));
    }else{
        await redisClient?.set("ALL_TWEETS", JSON.stringify(tweet));
    }
    await redisClient?.setex(`RATE_LIMIT:CREATE_TWEET:${ctx.user.id}`,10,ctx.user.id)
    return tweet;
  }

  public static async getAWSPreSignedUrl(
    imageType: string,
    ctx: GraphqlContext,
    imageName?: string
  ) {
    if (!ctx.user) throw new Error("Please Login To Post a Tweet!");

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS Env Variables Cannot be Null!!!");
    }

    const allowedTypes = [
      "image/jpeg",
      "image/webp",
      "image/png",
      "image/jpg",
      "image/heic",
      "image/gif",
    ];

    if (!allowedTypes.includes(imageType)) {
      throw new Error("Please Provide A Valid Image Type !!!");
    }

    const client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: `uploads/${ctx.user.id}/tweets/${ctx.user.id}-${Date.now()}.${
        imageType.split("/")[1]
      }`,
    });

    const signedUrl = getSignedUrl(client, putCommand, { expiresIn: 1200 });
    return signedUrl;
  }
}
