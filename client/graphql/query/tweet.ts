import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
  #graphql
  query GetAllTweets($limit: Int!, $offset: Int!) {
    getAllTweets(limit: $limit, offset: $offset) {
      id
      content
      imageUrl
      author {
        id
        firstName
        lastName
        profileImageUrl
        email
      }
      commentCount
      likesCount
      isLikedByUser
      hasBookMarked
    }
  }
`);

export const getAllTweetsByUserId = graphql(`
  #graphql
  query GetAllUserTweets($userId: String!) {
    getAllUserTweets(userId: $userId) {
      id
      firstName
      lastName
      email
      profileImageUrl
      following {
        id
        firstName
        lastName
        email
        profileImageUrl
      }
      follower {
        id
        firstName
        lastName
        email
        profileImageUrl
      }
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
        commentCount
        likesCount
        isLikedByUser
        hasBookMarked
      }
    }
  }
`);

export const getTweetById = graphql(`
  #graphql
  query GetTweetById($tweetId: String!) {
    getTweetById(tweetId: $tweetId) {
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
      isLikedByUser
      likesCount
      commentCount
      hasBookMarked
      comment {
        content
        tweetId
        user {
          id
          email
          firstName
          lastName
          profileImageUrl
        }
      }
    }
  }
`);

export const getPreSignedUrl = graphql(`
  #graphql
  query GetAWSPreSignedUrl($imageName: String, $imageType: String!) {
    getAWSPreSignedUrl(imageName: $imageName, imageType: $imageType)
  }
`);

export const getTweetsAndUsersQuery = graphql(`
  #graphql
  query GetTweetsAndUsersQuery($debouncedSearch: String!) {
    getTweetsAndUsersQuery(debouncedSearch: $debouncedSearch) {
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
      user {
        id
        firstName
        lastName
        email
        follower {
          id
          email
        }
        profileImageUrl
      }
    }
  }
`);
