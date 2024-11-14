import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`#graphql
    query getAllTweets{
        getAllTweets{
            id
            content
            imageUrl
            author{
                id
                firstName
                lastName
                profileImageUrl
                email
            }
        }    
    }
`)

export const getAllTweetsByUserId = graphql(`#graphql
    query GetAllUserTweets($userId: String!) {
        getAllUserTweets(userId: $userId) {
            id
            firstName
            lastName
            email
            profileImageUrl    
            tweet {
                id
                content
                imageUrl
                author {
                    id
                    firstName
                    lastName
                    email
                    profileImageUrl
                }            
            }
        }
    }  
`)

export const getPreSignedUrl = graphql(`#graphql
    query GetAWSPreSignedUrl($imageName: String, $imageType: String!) {
        getAWSPreSignedUrl(imageName: $imageName, imageType: $imageType)
    }
`)