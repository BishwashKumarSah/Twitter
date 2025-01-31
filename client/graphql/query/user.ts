import { graphql } from "../../gql";

export const verifyUserGoogleLoginToken = graphql(`
  #graphql
  query verifyGoogleToken($token: String!, $type: String!) {
    verifyGoogleToken(token: $token, type: $type)
  }
`);

export const getCurrentUserDetailsId = graphql(`
  query GetCurrentUserDetailsID {
    getCurrentUserDetailsID {
      id
    }
  }
`);

export const getUserDetailsByIdWithoutTweets = graphql(`
  #graphql
  query getUserDetailsByIdWithoutTweets($id: String!) {
    getUserDetailsByIdWithoutTweets(id: $id) {
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
    }
  }
`);

export const getCurrentUserDetailsQuery = graphql(`
  #graphql
  query GetCurrentUserDetails {
    getCurrentUserDetails {
      id
      firstName
      lastName
      email
      profileImageUrl
      recommendedUsers {
        id
        email
        firstName
        lastName
        profileImageUrl
      }
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
      }
    }
  }
`);
