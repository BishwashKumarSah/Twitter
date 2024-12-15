export const types = `#graphql
    input CreateTweetData{
        content: String!
        imageUrl: [String]
    }

    input LikeUnlikeTweetData{
        tweetId:String!        
    }

    type Likes{        
        user:User!
        tweet:Tweet!
        tweetId:String!
        userId:String!          
    }

    type Tweet{
        id: ID!
        content: String!
        imageUrl: [String]
        author: User!
        likes:[Likes]
        likesCount:Int!
        isLikedByUser:Boolean!
    }

`