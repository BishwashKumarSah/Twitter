"use server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import SingleTweetClientComponent from "../client/SingleTweetClientComponent";
import { createGraphQLClient } from "@/clients/api";
import { getCookies } from "@/lib/actions/getToken.action";
import { getTweetById } from "@/graphql/query/tweet";

const SingleTweetServerComponent = async ({ tweetId }: { tweetId: string }) => {
  const queryClient = new QueryClient();
  const cookies = await getCookies();
  const graphqlClient = createGraphQLClient(cookies);

  await queryClient.prefetchQuery({
    queryKey: [`tweet:${tweetId}:comment`],
    queryFn: async () => {
      return graphqlClient.request(getTweetById, { tweetId });
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleTweetClientComponent tweetId={tweetId} />
    </HydrationBoundary>
  );
};

export default SingleTweetServerComponent;
