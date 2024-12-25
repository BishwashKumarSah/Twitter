"use server";
import { createGraphQLClient } from "@/clients/api";
import { getCookies } from "@/lib/actions/getToken.action";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import BookMarksClientSide from "../client/BookMarksClientSide";
import { getAllBookMarkedTweets } from "@/graphql/query/bookmark";

const BookMarksServerSide = async ({ userId }: { userId: string }) => {
  if (!userId) return [];
  const queryClient = new QueryClient();
  const cookie = await getCookies();
  const graphqlClient = createGraphQLClient(cookie);
  queryClient.prefetchQuery({
    queryKey: ["All_BookMarked_Tweets", userId],
    queryFn: async () => {
      return await graphqlClient.request(getAllBookMarkedTweets);
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookMarksClientSide />
    </HydrationBoundary>
  );
};

export default BookMarksServerSide;
