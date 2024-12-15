export const mutations = `#graphql
    createTweet(payload:CreateTweetData!):Tweet
    likeTweet(payload:LikeUnlikeTweetData!):Boolean!
    unLikeTweet(payload:LikeUnlikeTweetData!):Boolean!
`