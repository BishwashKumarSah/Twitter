"use server";
import { createGraphQLClient } from "@/clients/api";
import { BookMarkData } from "@/gql/graphql";
import { bookMarkTweetMutation } from "@/graphql/mutate/bookmark";
import { getCookies } from "@/lib/actions/getToken.action";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import BookMarksClientSide from "../client/BookMarksClientSide";

const BookMarksServerSide = async ({ userId }: { userId: string }) => {
  if (!userId) return [];
  const queryClient = new QueryClient();
  const cookie = await getCookies();
  const graphqlClient = createGraphQLClient(cookie);
  queryClient.prefetchQuery({
    queryKey: ["BOOKMARKED_TWEETS", userId],
    queryFn: async () => {
      await graphqlClient.request<BookMarkData>(bookMarkTweetMutation);
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookMarksClientSide />
    </HydrationBoundary>
  );
};

export default BookMarksServerSide;
