import { graphql } from "@/gql";

export const bookMarkTweetMutation = graphql(`
  #graphql
  mutation BookmarkTweet($bookMarkTweetPayload: BookMarkData) {
    BookmarkTweet(BookMarkTweetPayload: $bookMarkTweetPayload)
  }
`);
