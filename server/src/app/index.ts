import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import express from "express";
import { User } from "./user";
import cors from "cors";
import JWTService from "../services/jwt";
import { GraphqlContext } from "./interface";
import { Tweet } from "./tweet";
import { BookMark } from "./bookmark";
import { Comment } from "./comment";

export async function initServer() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.get("/health", (req, res) =>
    res.status(200).json({ message: "Health is Good!" })
  );

  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
            ${User.types}
            ${Tweet.types}
            ${BookMark.types}
            ${Comment.types}
            type Query{
                ${User.queries}     
                ${Tweet.queries}  
                ${BookMark.queries}   
                ${Comment.queries}    
            }        
            type Mutation{
                ${Tweet.mutations}
                ${User.mutations}
                ${BookMark.mutations}
                ${Comment.mutations}
            }
        `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolvers.queries,
        ...BookMark.resolver.queries,
        ...Comment.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
        ...User.resolvers.mutations,
        ...BookMark.resolver.mutations,
        ...Comment.resolvers.mutations,
      },
      ...Tweet.resolvers.extraResolvers,
      ...User.resolvers.extraResolvers,
      ...BookMark.resolver.extraResolver,
      ...Comment.resolvers.extraResolvers,
    },
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => ({
        user: req.headers.authorization
          ? JWTService.decodeJWTToken(
              req.headers.authorization.split("Bearer ")[1]
            )
          : undefined,
      }),
    })
  );
  return app;
}
