"use client";

import { createGraphQLClient } from "@/clients/api";
import {
  BookMark,
  BookMarkData,
  BookmarkTweetMutation,
  BookmarkTweetMutationVariables,
} from "@/gql/graphql";
import { bookMarkTweetMutation } from "@/graphql/mutate/bookmark";
import { getAllBookMarkedTweets } from "@/graphql/query/bookmark";
import { useCookie } from "@/utils/CookieProvider";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllBookMarkedTweets = ({ userId }: { userId: string }) => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const getAllBookMarkedTweetsQuery = useQuery({
    queryKey: ["All_BookMarked_Tweets", userId],
    queryFn: async () => {
      return await graphQLClient.request(getAllBookMarkedTweets);
    },
  });
  return {
    bookMarkedTweets: getAllBookMarkedTweetsQuery.data?.getAllUserBookMarks,
    ...getAllBookMarkedTweetsQuery,
  };
};

export const useCreateBookMarkedTweets = () => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const createBookMarkedTweetsMutation = useMutation({
    mutationFn: async (payload: BookMarkData) => {
      console.log("payload", payload);
      await graphQLClient.request<{ BookmarkTweet: BookMark }>(
        bookMarkTweetMutation,
        {
          payload,
        }
      );
    },
    onSuccess: () => {
      console.log("bookMarkData", createBookMarkedTweetsMutation);
    },
  });
  return createBookMarkedTweetsMutation;
};
