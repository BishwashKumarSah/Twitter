import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../interface";
import { User } from "@prisma/client";
import { UserService } from "../../services/user";
import { redisClient } from "../../clients/redis";

const queries = {
  verifyGoogleToken: async (
    _: any,
    { token, type }: { token: string; type: string }
  ) => UserService.getJWTToken(token, type),

  getCurrentUserDetails: async (_: any, args: any, ctx: GraphqlContext) =>
    UserService.getCurrentUserDetails(ctx),

  getCurrentUserDetailsID: async (_: any, args: any, ctx: GraphqlContext) =>
    UserService.getCurrentUserDetails(ctx),

  getUserDetailsByIdWithoutTweets: async (
    _: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => UserService.getUserDetailsByIdWithoutTweets(id),
};

const mutations = {
  followUser: async (_: any, { to }: { to: string }, ctx: GraphqlContext) => {
    if (!ctx || !ctx.user || !ctx.user.id) {
      throw new Error("Please Login To Follow The User!");
    }
    const Rate_Limit_Check = await redisClient?.get(`Follow:${ctx.user.id}`);

    if (Rate_Limit_Check) {
      throw new Error("Please wait 10 sec to perform this action!");
    }

    await redisClient?.setex(`Follow:${ctx.user.id}`, 10, ctx.user.id);
    const val = await UserService.followUser(ctx.user.id, to);
    await redisClient?.del(`RECOMMENDED_USER:${ctx.user.id}`);
    return val;
  },

  unFollowUser: async (_: any, { to }: { to: string }, ctx: GraphqlContext) => {
    if (!ctx || !ctx.user || !ctx.user.id) {
      throw new Error("Please Login To Follow The User!");
    }

    const Rate_Limit_Check = await redisClient?.get(`UnFollow:${ctx.user.id}`);

    if (Rate_Limit_Check) {
      throw new Error("Please wait 10 sec to perform this action!");
    }

    await redisClient?.setex(`UnFollow:${ctx.user.id}`, 10, ctx.user.id);
    await UserService.unFollowUser(ctx.user.id, to);
    await redisClient?.del(`RECOMMENDED_USER:${ctx.user.id}`);
    return true;
  },
};

const extraResolvers = {
  User: {
    tweet: async (parent: User) => {
      return await prismaClient.tweet.findMany({
        where: { authorId: parent.email },
      });
    },

    // ! here A follows B it means A = follower, B = following (just like twitter if i follow someone it says following in ui).
    // ! so to get all my followers i need to check in follows table where i am the following
    // ! follower following       (follows Table)
    // ! BISWASH  SAHBISHWASH    => here to get all the followers of BISWASH i need to check in following column if its there or not
    // !                            to get following of BISWASH i need to check in followers column here in this case we got one
    // ! so BISHWASH have one following we got it from the follows table.

    follower: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: {
          following: { id: parent.id },
        },
        include: {
          following: true,
          follower: true,
        },
      });
      // console.log("follower -> following",result);
      return result.map((el) => el.follower);
    },
    following: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: {
          follower: { id: parent.id },
        },
        include: {
          follower: true,
          following: true,
        },
      });
      // console.log("element following --> follower",result);
      return result.map((el) => el.following);
    },

    // RESULTTTT [
    //     {
    //       followerId: 'cm2mxvwsr0000jq6hrfklwl3d',
    //       followingId: 'cm2my6k3z0001jq6hdliey4h3',
    //       following: {
    //         id: 'cm2my6k3z0001jq6hdliey4h3',
    //         firstName: 'Bishwash',
    //         lastName: 'Kumar Sah',
    //         email: 'sahkumar.bishwash@gmail.com',
    //         profileImageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKlsxFeIh_qOBqvUNEg8Iqk4eK_XoVRQ0EOleN0FTYFydyobw=s96-c',
    //         createdAt: 2024-10-24T06:54:03.600Z,
    //         updatedAt: 2024-10-24T06:54:03.600Z,
    //         follower: [Array]
    //       }
    //     }
    //   ]
    //   RESULTTTTfollowing [
    //     {
    //       followerId: 'cm2my6k3z0001jq6hdliey4h3',
    //       followingId: 'cm2ltjj2a0000seb13fzq60hu',
    //       following: {
    //         id: 'cm2ltjj2a0000seb13fzq60hu',
    //         firstName: 'Bishwash Kumar',
    //         lastName: 'Sah',
    //         email: 'bishwash.sah2121@gmail.com',
    //         profileImageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJZa0eXBEDXwWehvX-NZaRmEPxSCXIjoY22KJsaIGQOTzWX52Q=s96-c',
    //         createdAt: 2024-10-23T11:56:24.514Z,
    //         updatedAt: 2024-10-23T11:56:24.514Z
    //       }
    //     }
    //   ]
    // recommendedUsers:async(_:any,{}:any,ctx:GraphqlContext) => {
    //     // console.log('ctxzzzzzzzzzzzz',ctx.user?.id);
    //     if (!ctx || !ctx.user?.id) return []
    //     // ! here  i am just getting the ctxUser -> following which is an array of ctxUser following.
    //     // kingfromml (is following)-> sahkuar.bishwah if i had more i would get that too lets says kingfromml (isfollowing) bishw2121
    //     // here i have two followings for ctxUser(kingfromml - current loggedin user) -->  [sahkuar.bishwah,bishw2121 ]
    //     const result = await prismaClient.follows.findMany({
    //         where:{
    //             follower:{id:ctx.user.id}
    //         },
    //     })
    //     // console.log("resultt",result);
    //     // return result.map((el) => el.following)
    //     const recommendedUsers:User[] = []
    //     const seenUserIDs = new Set()
    //     const followingIds = new Set(result.map(r => r.followingId))
    //     // console.log("followingIdssssssssssssssssssssssssss",followingIds)
    //     // !here i am now iterating the followings array of ctx user and getting its following(*) where he is the follower(*) in follows table.
    //     for (const follow of result){
    //         const ctx_ctxfollowing_followingfollowing = await prismaClient.follows.findMany({
    //             where:{
    //                 follower:{id:follow.followingId}
    //             },
    //             include:{
    //                 following:true
    //             }
    //         })
    //         // console.log("ctx_ctxfollowing_followingfollowing",ctx_ctxfollowing_followingfollowing);
    //         ctx_ctxfollowing_followingfollowing.forEach((el) =>
    //             {
    //                 if(!seenUserIDs.has(el.following.id) && el.following.id !== ctx.user?.id && !followingIds.has(el.following.id) ) {
    //                     seenUserIDs.add(el.following.id)
    //                     recommendedUsers.push(el.following)
    //                 }
    //             })
    //         // console.log("rec",recommendedUsers);
    //     }
    //     // console.log("followingUsersA->C",recommendedUsers);
    //     // return recommendedUsers.map((el) => el.following)
    //     return recommendedUsers
    // }
    recommendedUsers: async (_: any, {}: any, ctx: GraphqlContext) => {
      if (!ctx || !ctx.user?.id) return [];
      const cachedRecommendedUsers = await redisClient?.get(
        `RECOMMENDED_USER:${ctx.user.id}`
      );

      if (cachedRecommendedUsers) {
        return JSON.parse(cachedRecommendedUsers);
      }

      const result = await prismaClient.follows.findMany({
        // here this where will give followerId: 'cm2mxvwsr0000jq6hrfklwl3d',
        //       followingId: 'cm2my6k3z0001jq6hdliey4h3',      (1)
        // now we  have the followingId i will include all its fields and get
        // RESULTTTT [
        //     {
        //       followerId: 'cm2mxvwsr0000jq6hrfklwl3d',     --- from (1)
        //       followingId: 'cm2my6k3z0001jq6hdliey4h3',    --- from (1)
        //       following: {
        //         id: 'cm2my6k3z0001jq6hdliey4h3',
        //         firstName: 'Bishwash',
        //         lastName: 'Kumar Sah',
        //         email: 'sahkumar.bishwash@gmail.com',
        //         profileImageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocKlsxFeIh_qOBqvUNEg8Iqk4eK_XoVRQ0EOleN0FTYFydyobw=s96-c',
        //         createdAt: 2024-10-24T06:54:03.600Z,
        //         updatedAt: 2024-10-24T06:54:03.600Z,
        //         follower: [Array]
        //       }
        //     }
        //   ]
        where: {
          follower: { id: ctx.user.id },
        },
        include: {
          following: {
            // (till 1)
            include: {
              // now since i have all the fields included then using the id of that user i will check the follows table to fetch related data
              // since user have relation with follows table but take care here cuz since i am trying to the the following of ctx's following here
              // followerId String
              // follower  Follows[] @relation("UserFollower")
              //   follower   User   @relation(name: "UserFollower", fields: [followerId], references: [id]) i am doing follower in the next line
              // since kingfrom(ctx) follows (sahkumar) follows (2121) now i have the sahkumar id(userId cuz of include in above) so
              // i will check that userId in the followerId and get all its following
              // now here it will also give me something like    followerId: '.....',
              //       followingId: '....',    and again i need to include all the information so i will use the following:true at third include that will give all the user details.
              follower: {
                include: {
                  following: true,
                },
              },
            },
          },
        },
      });
      //   try to check the model first here include will give all the related field info if it has followerId/followingId
      // which will map to user table and get the record but if there is not then the after we got all user field incldue
      // will map to follows table to get the related records.
      //   console.log("RESULTTTT", result);
      //   console.log("RESULTTTTfollowing", result[0].following.follower);
      const myFollowings_Followings = [];
      const isAlreadyInSet = new Set();
      const followingIDs = new Set(result.map((r) => r.followingId));
      for (const myfollowings of result) {
        if (myFollowings_Followings.length >= 5) {
          return myFollowings_Followings;
        }
        for (const followedUsersFollowings of myfollowings.following.follower) {
          if (
            !isAlreadyInSet.has(followedUsersFollowings.following.id) &&
            followedUsersFollowings.following.id !== ctx.user.id &&
            !followingIDs.has(followedUsersFollowings.following.id)
          ) {
            isAlreadyInSet.add(followedUsersFollowings.following.id);
            myFollowings_Followings.push(followedUsersFollowings.following);
          }
        }
      }
      //   console.log(myFollowings_Followings);
      await redisClient?.set(
        `RECOMMENDED_USER:${ctx.user.id}`,
        JSON.stringify(myFollowings_Followings)
      );
      // console.log("usersssss",myFollowings_Followings);
      return myFollowings_Followings;
    },
  },
};

export const resolvers = { queries, extraResolvers, mutations };
