"use client";

import { createGraphQLClient } from "@/clients/api";
import { BookMarkData } from "@/gql/graphql";
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
  const queryKeysToInvalidate = [
    ["get-all-tweets"],
    ["All_BookMarked_Tweets", userId],
  ];
  const createBookMarkedTweetsMutation = useMutation({
    mutationFn: async (payload: BookMarkData) => {
      return await graphQLClient.request(bookMarkTweetMutation, {
        payload,
      });
    },
    onSuccess: async () => {
      await Promise.all(
        queryKeysToInvalidate.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: key,
          });
        })
      );
    },
  });
  return createBookMarkedTweetsMutation;
};
