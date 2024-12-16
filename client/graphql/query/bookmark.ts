import { graphql } from "@/gql";

export const getAllBookMarkedTweets = graphql(`
  #graphql
  query Query {
    getAllUserBookMarks {
      tweetId
      tweet {
        id
        content
        imageUrl
        author {
          firstName
          lastName
          email
        }
        likesCount
        isLikedByUser
      }
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
