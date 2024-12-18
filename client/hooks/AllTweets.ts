"use client";

import { createGraphQLClient } from "@/clients/api";
import { CreateTweetData, LikeUnlikeTweetData, Tweet } from "@/gql/graphql";

import { createNewTweet, likeTweets } from "@/graphql/mutate/tweet";
import { getAllTweetsByUserId, getAllTweetsQuery } from "@/graphql/query/tweet";
import { useCookie } from "@/utils/CookieProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// mutation to create a tweet
export const useCreateNewTweet = () => {
  const queryClient = useQueryClient();
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphQLClient.request<{ createTweet: Tweet }>(createNewTweet, {
        payload,
      }),
    onSuccess: (newTweetData) => {
      queryClient.setQueryData<{ getAllTweets: Tweet[] } | undefined>(
        ["get-all-tweets"],
        (oldData) => {
          // console.log("oldData",oldData);
          const oldTweets = oldData?.getAllTweets || [];
          const newTweet = newTweetData.createTweet;
          return { getAllTweets: [newTweet, ...oldTweets] };
        }
      );
    },
  });
  // console.log("mutationaaaaaaaaaaaaaaaaaaa",mutation);
  return mutation;
};

export const useLikeTweets = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const queryKeysToInvalidate = [
    ["get-all-tweets"],
    ["All_BookMarked_Tweets", userId],
  ];
  const likeTweetMutation = useMutation({
    mutationFn: async (payload: LikeUnlikeTweetData) =>
      await graphQLClient.request(likeTweets, { payload }),
    onSuccess: async () =>
      await Promise.all(
        queryKeysToInvalidate.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: key,
          });
        })
      ),
  });
  return likeTweetMutation;
};

// query to get all the tweets
export const useGetAllTweets = () => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
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

  const allTweetsByUserIdQuery = useQuery({
    queryKey: ["all-user-tweets-byId", userId],
    queryFn: async () => {
      try {
        return await graphQLClient.request(getAllTweetsByUserId, {
          userId: userId,
        });
      } catch (error) {
        console.log("Error in useGetAllTweetsByUserId hooks allTweets", error);
        return null;
      }
    },
    enabled: !!userId, // Ensures the query only runs if userId is available
  });
  return {
    ...allTweetsByUserIdQuery,
    userInfo: allTweetsByUserIdQuery.data?.getAllUserTweets,
    allTweetsData: allTweetsByUserIdQuery.data?.getAllUserTweets?.tweet,
  };
};
