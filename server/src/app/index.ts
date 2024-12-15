import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import express from 'express'
import {User} from './user'
import cors from "cors"
import JWTService from '../services/jwt';
import { GraphqlContext } from './interface';
import { Tweet } from './tweet';

export async function initServer(){
    const app = express()
    
    app.use(cors())
    app.use(bodyParser.json())

   
    const graphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs:`
            ${User.types}
            ${Tweet.types}
            type Query{
                ${User.queries}     
                ${Tweet.queries}         
            }        
            type Mutation{
                ${Tweet.mutations}
                ${User.mutations}
            }
        `,
        resolvers:{            
            Query:{
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries
            },
            Mutation:{
                ...Tweet.resolvers.mutations,
                ...User.resolvers.mutations
          },
          ...Tweet.resolvers.extraResolvers,
          ...User.resolvers.extraResolvers
        },
      });

    await graphqlServer.start()

    app.use('/graphql',expressMiddleware(graphqlServer,{
        context:async({req,res}) =>({         
            user : req.headers.authorization ? 
             JWTService.decodeJWTToken(req.headers.authorization.split('Bearer ')[1]) : 
            undefined
        })
    }))
    return app
}