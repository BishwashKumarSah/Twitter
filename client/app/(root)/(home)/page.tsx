import CreateTweet from "@/components/shared/CreateTweet";

import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

// import FeedCard from "./feedcard/FeedCard";
// import { Tweet } from "@/gql/graphql";

import { getAllTweetsQuery } from "@/graphql/query/tweet";
import AllTweets from "@/components/shared/ShowAllTweets";
import { getCurrentUserDetailsQuery } from "@/graphql/query/user";
import { getCookies } from "@/lib/actions/getToken.action";
import { createGraphQLClient } from "@/clients/api";

const Home = async () => {
  const queryClient = new QueryClient();
  const token = await getCookies();
  const graphQLClient = createGraphQLClient(token);
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-all-tweets"],
    queryFn: async ({ pageParam = 1 }) => {
      console.log({pageParam});
      const offset = (pageParam - 1) * 10; // Calculate offset based on pageParam
      return await graphQLClient.request(getAllTweetsQuery, {
        offset,
        limit: 10,
      });
    },

    initialPageParam: 1,
  });

  await queryClient.prefetchQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      return await graphQLClient.request(getCurrentUserDetailsQuery);
    },
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <>
      <HydrationBoundary state={dehydratedState}>
        <CreateTweet />
        <AllTweets />
      </HydrationBoundary>
    </>
  );
};

export default Home;
