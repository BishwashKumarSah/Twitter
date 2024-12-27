export const types = `#graphql
    input CreateTweetData{
        content: String!
        imageUrl: [String]
    }

    input LikeUnlikeTweetData{
        tweetId:String!        
    }

    type TweetAndUsers{
        tweet:[Tweet!]
        user:[User!]
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
        bookmark:[BookMark!]
        comment:[Comment!]
        commentCount:Int!
        hasBookMarked:Boolean!
        isLikedByUser:Boolean!
        isSavedByUser:Boolean!
    }

`;
