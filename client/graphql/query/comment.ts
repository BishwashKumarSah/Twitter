import { graphql } from "@/gql";

export const GetAllCommentsByTweetId = graphql(`
  #graphql
  query GetAllCommentsByTweetId($tweetId: String!) {
    getAllCommentsByTweetId(tweetId: $tweetId) {
      tweetId
      user {
        id
        email
        firstName
        lastName
        profileImageUrl
      }
      userId
    }
  }
`);
