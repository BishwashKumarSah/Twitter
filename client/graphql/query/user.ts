import { graphql } from "../../gql";

export const verifyUserGoogleLoginToken = graphql(`#graphql
    query verifyGoogleToken($token: String!) {
        verifyGoogleToken(token: $token)
    }    
`)

export const getCurrentUserDetailsQuery = graphql(`#graphql
    query GetCurrentUserDetails {
        getCurrentUserDetails {
            id
            firstName
            lastName
            email
            profileImageUrl
            tweet {
                id
                content
            }
        }
    }
`)