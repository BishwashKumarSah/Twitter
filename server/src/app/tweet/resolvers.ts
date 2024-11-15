import { Tweet } from "@prisma/client"
import { prismaClient } from "../../clients/db"
import { GraphqlContext } from "../interface"
import { TweetService } from "../../services/tweet"
import { UserService } from "../../services/user"

export interface CreateTweetData{
    content: string
    imageUrl?: string[]
}


const queries = {

    getAllTweets:async() => TweetService.getAllTweets(),

    getAllUser:async() => UserService.getAllUsers(),

    getAllUserTweets: async (parent:any,{userId}:{userId:string}) => UserService.getAllUserTweets(userId),  

    getAWSPreSignedUrl:async(parent:any,{imageName,imageType}:{imageName?:string,imageType:string},ctx:GraphqlContext) => TweetService.getAWSPreSignedUrl(imageType,ctx,imageName)
   
}

const mutations = {
    createTweet:async(parent:any,{payload}:{payload:CreateTweetData},ctx:GraphqlContext) => TweetService.createTweet(payload,ctx)
}

const extraResolvers = {
    Tweet:{
        author: async(parent:Tweet) => {
            return await prismaClient.user.findUnique({where:{email:parent.authorId}})

        }
    }
}

export const resolvers = {queries,mutations,extraResolvers}