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
        },

        recommendedUsers:async(_:any,{}:any,ctx:GraphqlContext) => {
            // console.log('ctxzzzzzzzzzzzz',ctx.user?.id);
            if (!ctx || !ctx.user?.id) return []
            // ! here  i am just getting the ctxUser -> following which is an array of ctxUser following.
            // kingfromml (is following)-> sahkuar.bishwah if i had more i would get that too lets says kingfromml (isfollowing) bishw2121
            // here i have two followings for ctxUser(kingfromml - current loggedin user) -->  [sahkuar.bishwah,bishw2121 ]
            const result = await prismaClient.follows.findMany({
                where:{
                    follower:{id:ctx.user.id}
                },                
            })
            // console.log("resultt",result);
            // return result.map((el) => el.following)
            const recommendedUsers:User[] = []
            const seenUserIDs = new Set()
            const followingIds = new Set(result.map(r => r.followingId))
            // console.log("followingIdssssssssssssssssssssssssss",followingIds)
            // !here i am now iterating the followings array of ctx user and getting its following(*) where he is the follower(*) in follows table.
            for (const follow of result){
                const ctx_ctxfollowing_followingfollowing = await prismaClient.follows.findMany({
                    where:{
                        follower:{id:follow.followingId}
                    },
                    include:{
                        following:true
                    }
                })
                // console.log("ctx_ctxfollowing_followingfollowing",ctx_ctxfollowing_followingfollowing);
                ctx_ctxfollowing_followingfollowing.forEach((el) => 
                    {    
                        if(!seenUserIDs.has(el.following.id) && el.following.id !== ctx.user?.id && !followingIds.has(el.following.id) ) {
                            seenUserIDs.add(el.following.id)
                            recommendedUsers.push(el.following)
                        }                   
                    })
                // console.log("rec",recommendedUsers);
            }
            // console.log("followingUsersA->C",recommendedUsers);
            // return recommendedUsers.map((el) => el.following)
            return recommendedUsers
        }   
    }
}

export const resolvers = {queries,extraResolvers,mutations}