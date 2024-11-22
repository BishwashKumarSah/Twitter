import { prismaClient } from '../../clients/db';
import { GraphqlContext } from '../interface';
import { User } from '@prisma/client';
import { UserService } from '../../services/user';

const queries = {
    verifyGoogleToken:async(_:any,{token}:{token:string}) => UserService.getJWTToken(token),

    getCurrentUserDetails:async(_:any,args:any,ctx:GraphqlContext) => UserService.getCurrentUserDetails(ctx),

    getUserDetailsByIdWithoutTweets:async(_:any,{id}:{id:string},ctx:GraphqlContext) => UserService.getUserDetailsByIdWithoutTweets(id)

}

const mutations = {
    followUser:async(_:any,{to}:{to:string},ctx:GraphqlContext) => UserService.followUser(ctx,to),
    unFollowUser:async(_:any,{to}:{to:string},ctx:GraphqlContext) => UserService.unFollowUser(ctx,to)
}

const extraResolvers = {
    User:{
        tweet:async(parent:User) => {
            return await prismaClient.tweet.findMany({where:{authorId:parent.email}})
        },

        // ! here A follows B it means A = follower, B = following (just like twitter if i follow someone it says following in ui).
        // ! so to get all my followers i need to check in follows table where i am the following
        // ! follower following       (follows Table)
        // ! BISWASH  SAHBISHWASH    => here to get all the followers of BISWASH i need to check in following column if its there or not
        // !                            to get following of BISWASH i need to check in followers column here in this case we got one
        // ! so BISHWASH have one following we got it from the follows table.

        follower:async(parent:User) => {
            const result =  await prismaClient.follows.findMany({
                where:{
                    following:{id:parent.id}
                },
                include:{
                    following:true,
                    follower:true
                }
            })
            // console.log("follower -> following",result);
            return result.map((el) => el.follower)
        },
        following:async(parent:User) => {
            const result = await prismaClient.follows.findMany({
                where:{
                    follower:{id:parent.id}
                },
                include:{
                    follower:true,
                    following:true
                }
            })
            // console.log("element following --> follower",result);
            return result.map((el) => el.following)
        }
    }
}

export const resolvers = {queries,extraResolvers,mutations}