import { graphql } from "@/gql";

export const PostCommentByTweetId = graphql(`
  #graphql
  mutation PostCommentByTweetId($payload: CreateTweetComment) {
    postCommentByTweetId(payload: $payload) {
      content
      tweetId
      userId
      user {
        id
        firstName
        lastName
        email
        profileImageUrl
      }
    }
  }
`);
