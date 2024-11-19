
export const types = `#graphql
    type User{
        id: ID!
        firstName: String!
        lastName: String
        email: String!
        profileImageUrl: String
        # followerId:Boolean
        # followingId:Boolean
        tweet: [Tweet]
    }

   
`