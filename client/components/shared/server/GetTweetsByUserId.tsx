"use server";
import { createGraphQLClient } from "@/clients/api";
import { getAllTweetsByUserId } from "@/graphql/query/tweet";
import { getCookies } from "@/lib/actions/getToken.action";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import Profile from "../client/GetTweetsByUserId";
import toast from "react-hot-toast";
import { ClientError } from "graphql-request";

const GetTweetsByUserId = async ({ userId }: { userId: string }) => {
  // we always need to make a new queryClient instance for server side but for client on global instance check docs once.
  const queryClient = new QueryClient();

  const token = await getCookies();
  const graphQLClient = createGraphQLClient(token);

  // const allTweetsByUserIdQuery =
  await queryClient.prefetchQuery({
    queryKey: ["all-user-tweets-byId", userId],
    queryFn: async () => {
      try {
        if (!userId) {
          return null;
        }
        return await graphQLClient.request(getAllTweetsByUserId, {
          userId: userId,
        });
      } catch (error) {
        // console.log("Error in useGetAllTweetsByUserId hooks allTweets", error);
        if (error instanceof ClientError) {
          console.log("useGetAllTweetsByUserId", error);
          toast.error(error.message);
        }
      }
    },
  });

  // console.log(
  //   "prefetchQueryAllTweetsByUserIdQuery server GetTweetsByUserId",
  //   allTweetsByUserIdQuery
  // );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile />
    </HydrationBoundary>
  );
};

export default GetTweetsByUserId;
