import { graphql } from "@/gql";

export const getAllBookMarkedTweets = graphql(`
  query GetAllUserBookMarks {
    getAllUserBookMarks {
      tweetId
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
        likesCount
        isLikedByUser
      }
      userId
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`);
