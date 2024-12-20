export const types = `#graphql
input CreateTweetComment{
    content:String!
    tweetId:String!
}

type Comment{
    id:ID!
    content:String!
    tweetId:String!
    tweet:Tweet
    userId:String!
    user:User
}

`;
