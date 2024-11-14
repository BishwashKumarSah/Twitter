import axios from 'axios'
import { prismaClient } from '../../clients/db';
import JWTService from '../../services/jwt';
import { GraphqlContext } from '../interface';
import { Tweet } from '../tweet';
import { User } from '@prisma/client';
interface GoogleAuthResponse {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: string;
    nbf: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: string;
    exp: string;
    jti: string;
    alg: string;
    kid: string;
    typ: string;
  }
const queries = {
    verifyGoogleToken:async(parent:any,{token}:{token:string}) =>{
        
        // 1. here first i am taking to the google api to send the details regarding this particular user.
        // 2. if the user doesnot exists then create that user
        // 3. now that i have created the user i will check the db for that user again even though we can skip this part but for safe side if it is not created in db that why we are again checking that user
        // 4. i have created a utility class that will generate the token for me i will pass the user obj to that utility function.

        const googleOAuthURL = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
        const {data} = await axios.get<GoogleAuthResponse>(googleOAuthURL,{
            responseType:'json'
        })
        
        const user  = await prismaClient.user.findUnique({
            where:{email:data.email}
        })

        if(!user){
            await prismaClient.user.create({
                data:{
                    firstName:data.given_name,
                    lastName:data.family_name,
                    email:data.email,
                    profileImageUrl:data.picture
                }
            })
        }

        const dbUser = await prismaClient.user.findUnique({
            where:{
                email:data.email
            }
        })

        if(!dbUser){
            throw new Error("Email doesnot exists");
        }

        const jwtToken = await JWTService.generateJWTTokenForUser(dbUser)


        return jwtToken
    },

    getCurrentUserDetails:async(parent:any,args:any,ctx:GraphqlContext) =>{
       
        const id =  ctx.user?.id
       
        if(!id) return null

        const user = await prismaClient.user.findUnique({
            where:{id}
        })
        return user
    }
}

const extraResolvers = {
    User:{
        tweet:async(parent:User) => {
            return await prismaClient.tweet.findMany({where:{authorId:parent.email}})
        }
    }
}

export const resolvers = {queries,extraResolvers}