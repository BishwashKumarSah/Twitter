
export const queries = `#graphql   
    verifyGoogleToken(token:String!,type:String!):String
    getCurrentUserDetails: User
    getCurrentUserDetailsID:User
    getUserDetailsByIdWithoutTweets(id:String!):User
`