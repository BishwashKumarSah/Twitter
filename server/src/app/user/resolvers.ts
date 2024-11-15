import axios from 'axios'
import { prismaClient } from '../../clients/db';
import JWTService from '../../services/jwt';
import { GraphqlContext } from '../interface';
import { Tweet } from '../tweet';
import { User } from '@prisma/client';
import { UserService } from '../../services/user';

const queries = {
    verifyGoogleToken:async(parent:any,{token}:{token:string}) => UserService.getJWTToken(token),

    getCurrentUserDetails:async(parent:any,args:any,ctx:GraphqlContext) => UserService.getCurrentUserDetails(ctx)
}

const extraResolvers = {
    User:{
        tweet:async(parent:User) => {
            return await prismaClient.tweet.findMany({where:{authorId:parent.email}})
        }
    }
}

export const resolvers = {queries,extraResolvers}