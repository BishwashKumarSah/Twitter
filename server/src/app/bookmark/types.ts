export const types = `#graphql
        input BookMarkData{
            tweetId:String!
        }

        type BookMark{
            tweetId:String!
            tweet:Tweet!
            userId:String!
            user:User!
        }
`;
