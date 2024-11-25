"use server";
import { createGraphQLClient } from "@/clients/api";
import { getCurrentUserDetailsQuery } from "@/graphql/query/user";
import { getCookies } from "@/lib/actions/getToken.action";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import RightSideBar from "../sidebar/RightSideBar";

const RightSideBarServer = async () => {
  const queryClient = new QueryClient();
  const token = await getCookies();
  const graphQLClient = createGraphQLClient(token);
  await queryClient.prefetchQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      return await graphQLClient.request(getCurrentUserDetailsQuery);
    },
  });
  const dehydrateState = dehydrate(queryClient);

  return (
    <>
      <HydrationBoundary state={dehydrateState}>
        <RightSideBar />
      </HydrationBoundary>
    </>
  );
};

export default RightSideBarServer;
