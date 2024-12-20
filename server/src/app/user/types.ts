export const types = `#graphql
    type User{
        id: ID!
        firstName: String!
        lastName: String
        email: String!
        profileImageUrl: String
        recommendedUsers:[User!]
        follower:[User!]
        following:[User!]
        tweet: [Tweet]
        comment:[Comment!]
    }   
`;
