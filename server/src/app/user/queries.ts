
export const queries = `#graphql   
    verifyGoogleToken(token:String!):String
    getCurrentUserDetails: User
    getCurrentUserDetailsID:User
    getUserDetailsByIdWithoutTweets(id:String!):User
`