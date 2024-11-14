import { User } from "@prisma/client";
import { TokenKind } from "graphql";
import jwt from 'jsonwebtoken';
import { JWTUser } from "../app/interface";

const secretKey = process.env.JWT_SECRET as string


class JWTService{
    public static async generateJWTTokenForUser(user:User){
        const payload = {
            id:user?.id,
            email:user?.email
        }

        const token = jwt.sign(payload,secretKey)
    return token
    }

    public static decodeJWTToken(token:string){
        // console.log("token",token);
        // Type Assertion (as)
        // Type Annotation (:)
        // here i am using as JWTUser instead of data : JWTUser cuz i am confident that jwt.verify will return {id,email} also
        // if i use data : JWTUser 
        //  jwt.verify() typically returns an object of type any, unknown, or a generic Payload type, depending on the library configuration. In this case:
        // TypeScript cannot guarantee that the returned object matches the JWTUser interface.
        // Using as JWTUser allows you to manually assert that the type is correct.
       
        try {
            const data  = jwt.verify(token,secretKey) as JWTUser
            // console.log("data",data);
            return data
        } catch (error) {          
            return null
        }
    }

}

export default JWTService;