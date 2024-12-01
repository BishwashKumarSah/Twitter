
import axios from 'axios'
import {prismaClient} from '../clients/db/index'
import JWTService from './jwt';
import { GraphqlContext } from '../app/interface';

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

export class UserService{

    public static async getAllUserTweets(userId:string){
        if (!userId) throw new Error("User ID is required");
        return await prismaClient.user.findUnique({
          where: {
            id:userId, // matches the unique `id` field of `User`
          },          
        });        
    }

    public static async getAllUsers(){
        return await prismaClient.user.findMany({})
    }

    public static async getJWTToken(token:string){
        
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
    }

    public static async getCurrentUserDetails(ctx:GraphqlContext){
       
        const id =  ctx.user?.id
       
        if(!id) return null

        const user = await prismaClient.user.findUnique({
            where:{id}
        })
        return user
    }

    public static async getUserDetailsByIdWithoutTweets(id:string){
        if(!id) throw new Error("Id is required")
        return await prismaClient.user.findFirst({
            where:{
                id:id
            },            
        })
    }
   

    public static async followUser(ctx:string,from:string){
        
        try {
            await prismaClient.follows.create({
                data:{
                    follower:{connect:{id:ctx}},
                    following:{connect:{id:from}}
                }
            })
            return true
        } catch (error) {
            return false            
        }
    }

    public static async unFollowUser(ctx:string,from:string){        
        try {
            // console.log("iddd",ctx);
            await prismaClient.follows.delete({where:{
                followerId_followingId:{
                    followerId:ctx,
                    followingId:from
                }
            }})
            return true
        } catch (error) {
            return false
        }
    }
    
}