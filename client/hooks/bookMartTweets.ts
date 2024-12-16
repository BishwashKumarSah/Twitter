"use client";

import { createGraphQLClient } from "@/clients/api";
import { getAllBookMarkedTweets } from "@/graphql/query/bookmark";
import { useCookie } from "@/utils/CookieProvider";
import { useQuery } from "@tanstack/react-query";

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
