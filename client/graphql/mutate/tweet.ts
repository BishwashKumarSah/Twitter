import { graphql } from "@/gql";



export const createNewTweet = graphql(`#graphql
    mutation Mutation($payload: CreateTweetData!) {
        createTweet(payload: $payload) {
            id
            content
            imageUrl
            author{
                firstName
                lastName
                profileImageUrl
                email
            }
        }
    }  
`)