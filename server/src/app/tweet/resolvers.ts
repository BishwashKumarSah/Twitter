import { Tweet } from "@prisma/client"
import { prismaClient } from "../../clients/db"
import { GraphqlContext } from "../interface"
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

interface CreateTweetData{
    content: string
    imageUrl?: string[]
}


const queries = {

    getAllTweets:async() => {       
        return await prismaClient.tweet.findMany({orderBy:{createdAt:'desc'}})
    },

    getAllUser:async() => {
        return await prismaClient.user.findMany({})
    },

    getAllUserTweets: async (parent:any,{userId}:{userId:string}) => {
        if (!userId) throw new Error("User ID is required");
        return await prismaClient.user.findUnique({
          where: {
            id:userId, // matches the unique `id` field of `User`
          },          
        });
    },  

    getAWSPreSignedUrl:async(parent:any,{imageName,imageType}:{imageName?:string,imageType:string},ctx:GraphqlContext) => {

        if (!ctx.user) throw new Error("Please Login To Post a Tweet!")

        if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_ACCESS_KEY){
            throw new Error("AWS Env Variables Cannot be Null!!!")
        }
        
        const allowedTypes = ['image/jpeg','image/webp','image/png','image/jpg','image/heic','image/gif']

        if(!allowedTypes.includes(imageType)){
            throw new Error("Please Provide A Valid Image Type !!!")
        }

        const client = new S3Client({
            region:'ap-south-1',
            credentials:{
                accessKeyId:process.env.AWS_ACCESS_KEY,
                secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
            }
        })

        const putCommand = new PutObjectCommand({
            Bucket:'twitter.bishwash.kumar.sah',
            Key: `uploads/${ctx.user.id}/tweets/${ctx.user.id}-${Date.now()}.${imageType.split('/')[1]}`,
        })

        const signedUrl = getSignedUrl(client,putCommand,{expiresIn:1200})
        return signedUrl
    }
   
}

const mutations = {
    createTweet:async(parent:any,{payload}:{payload:CreateTweetData},ctx:GraphqlContext) =>{

        if(!ctx.user) throw new Error("Please Login To Post a Tweet!")

        const tweet = await prismaClient.tweet.create({
            data:{
                content:payload.content,
                imageUrl:payload.imageUrl,
                author:{connect:{email:ctx.user.email}}
            }
        })
    
        return tweet

    }
}

const extraResolvers = {
    Tweet:{
        author: async(parent:Tweet) => {
            return await prismaClient.user.findUnique({where:{email:parent.authorId}})

        }
    }
}

export const resolvers = {queries,mutations,extraResolvers}