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
  const token = await getCookies()
  const graphQLClient = createGraphQLClient(token)
  await queryClient.prefetchQuery({
    queryKey: ["get-all-tweets"],
    queryFn: async () => {
      return await graphQLClient.request(getAllTweetsQuery);
    },
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
