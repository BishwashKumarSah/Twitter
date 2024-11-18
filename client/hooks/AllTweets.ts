"use client";

import { createGraphQLClient } from "@/clients/api";
import { CreateTweetData, Tweet } from "@/gql/graphql";

import { createNewTweet } from "@/graphql/mutate/tweet";
import { getAllTweetsByUserId, getAllTweetsQuery } from "@/graphql/query/tweet";
import { useCookie } from "@/utils/CookieProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// mutation to create a tweet
export const useCreateNewTweet = () => {
  const queryClient = useQueryClient()
  const {cookie} = useCookie()
  const graphQLClient = createGraphQLClient(cookie)
  const mutation = useMutation({
    mutationFn :   (payload:CreateTweetData) =>  graphQLClient.request<{ createTweet: Tweet }>(createNewTweet, {payload}),   
    onSuccess: (newTweetData) => {
      queryClient.setQueryData<{getAllTweets:Tweet[]} | undefined>(['get-all-tweets'],(oldData) => {
        // console.log("oldData",oldData);
        const oldTweets = oldData?.getAllTweets || []
        const newTweet = newTweetData.createTweet;
        return {getAllTweets:[...oldTweets,newTweet]}
      })
    } 
  })
  return mutation
}


// query to get all the tweets
export const useGetAllTweets = () => {
  const {cookie} = useCookie()
  const graphQLClient = createGraphQLClient(cookie)
  const allTweetsQuery = useQuery({
    queryKey: ["get-all-tweets"],
    queryFn: async () => await graphQLClient.request(getAllTweetsQuery),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    ...allTweetsQuery,
    allTweets: allTweetsQuery.data?.getAllTweets,
  };
};

export const useGetAllTweetsByUserId = (userId: string) => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  // console.log("userIIIIID",userId);

  const allTweetsByUserIdQuery =  useQuery({
    queryKey: ["all-user-tweets-byId", userId],
    queryFn: async () => {
      try {        
        return await graphQLClient.request(getAllTweetsByUserId, { userId:userId });
      } catch (error) {
        console.log("Error in useGetAllTweetsByUserId hooks allTweets",error);
        return null        
      }
    },
    enabled: !!userId, // Ensures the query only runs if userId is available
  });
  return {
    ...allTweetsByUserIdQuery,
    userInfo:allTweetsByUserIdQuery.data?.getAllUserTweets,
    allTweetsData:allTweetsByUserIdQuery.data?.getAllUserTweets?.tweet
  }
};
