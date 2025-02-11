"use client";

import { createGraphQLClient } from "@/clients/api";
import {  BookMarkData, Tweet, User } from "@/gql/graphql";
import { bookMarkTweetMutation } from "@/graphql/mutate/bookmark";
import { getAllBookMarkedTweets } from "@/graphql/query/bookmark";
import { useCookie } from "@/utils/CookieProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllBookMarkedTweets = ({ userId }: { userId: string }) => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const getAllBookMarkedTweetsQuery = useQuery({
    queryKey: ["All_BookMarked_Tweets", userId],
    queryFn: async () => {
      return await graphQLClient.request(getAllBookMarkedTweets);
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return {
    bookMarkedTweets: getAllBookMarkedTweetsQuery.data?.getAllUserBookMarks,
    ...getAllBookMarkedTweetsQuery,
  };
};

export const useCreateBookMarkedTweets = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);

  const createBookMarkedTweetsMutation = useMutation({
    mutationFn: async (payload: BookMarkData) => {
      return await graphQLClient.request(bookMarkTweetMutation, {
        payload,
      });
    },
    onSuccess: async (_, { tweetId }) => {
      queryClient.refetchQueries({
        queryKey: ["All_BookMarked_Tweets", userId],
      });

      queryClient.setQueryData<{ getAllUserTweets: User }>(
        ["all-user-tweets-byId", userId],
        (oldData) => {
          
          if (!oldData) {
            return undefined;
          }

          return {
            ...oldData,
            getAllUserTweets: {
              ...oldData.getAllUserTweets,
              tweet: oldData.getAllUserTweets.tweet?.map((tweet: Tweet) => {
                if (tweet.id === tweetId) {
                  return {
                    ...tweet,
                    hasBookMarked: !tweet.hasBookMarked,
                  };
                }
                return tweet;
              }),
            },
          };
        }
      );

      queryClient.setQueryData<{
        pages: Array<{ getAllTweets: Tweet[] }>;
        pageParams: number[];
      }>(["get-all-tweets"], (oldData) => {
      
        if (!oldData) return undefined;

        return {
          ...oldData,
          pages: oldData.pages.map((allTweets: { getAllTweets: Tweet[] }) => {
            return {
              ...allTweets,
              getAllTweets: allTweets.getAllTweets.map((tweet: Tweet) => {
                if (tweet.id === tweetId) {
                  return {
                    ...tweet,
                    hasBookMarked: !tweet.hasBookMarked,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      });

      queryClient.refetchQueries({
        queryKey: [`tweet:${tweetId}:comment`],
      });
    },
  });
  return createBookMarkedTweetsMutation;
};
