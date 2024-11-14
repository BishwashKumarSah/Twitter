export const queries = `#graphql
    getAllTweets:[Tweet]
    getAllUserTweets(userId:String!):User
    getAllUser:[User]
    getAWSPreSignedUrl(imageName:String,imageType:String!):String!    
`