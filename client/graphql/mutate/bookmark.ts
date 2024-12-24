import { graphql } from "@/gql";

export const bookMarkTweetMutation = graphql(`
  #graphql
  mutation BookmarkTweet($payload: BookMarkData!) {
    BookmarkTweet(payload: $payload) {
      tweetId
      tweet {
        id
        content
        imageUrl
        likesCount
        isLikedByUser
        author {
          id
          email
          firstName
          lastName
          profileImageUrl
        }
      }
      user {
        id
        email
      }
      userId
    }
  }
`);
