export const queries = `#graphql
    getAllTweets(limit:Int!,offset:Int!):[Tweet!]
    getTweetById(tweetId:String!):Tweet
    getAllUserTweets(userId:String!):User
    getAllUser:[User]
    getAWSPreSignedUrl(imageName:String,imageType:String!):String!    
    getTweetsAndUsersQuery(debouncedSearch:String!):TweetAndUsers
`;
