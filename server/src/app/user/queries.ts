
export const queries = `#graphql   
    verifyGoogleToken(token:String!):String
    getCurrentUserDetails: User
    getUserDetailsByIdWithoutTweets(id:String!):User
`