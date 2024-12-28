"use client";

import { createGraphQLClient } from "@/clients/api";
import { GetCurrentUserDetailsIdQuery } from "@/gql/graphql";
import {
  getCurrentUserDetailsId,
  getCurrentUserDetailsQuery,
  getUserDetailsByIdWithoutTweets,
} from "@/graphql/query/user";
import { useCookie } from "@/utils/CookieProvider";
import { useQuery } from "@tanstack/react-query";

// ! How to fetch cookie at the client side.

export const useCurrentUser = () => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      return await graphQLClient.request(getCurrentUserDetailsQuery);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  //    console.log("clientData",query.data);
  return {
    user: query.data?.getCurrentUserDetails,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useCurrentUserDetailsId = () => {
  const { cookie } = useCookie();
  const graphqlClient = createGraphQLClient(cookie);
  const query = useQuery({
    queryKey: ["current-user-id"],
    queryFn: async () => {
      return await graphqlClient.request<GetCurrentUserDetailsIdQuery>(
        getCurrentUserDetailsId
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    userId: query.data?.getCurrentUserDetailsID?.id,
    ...query,
  };
};

export const useGetUserDetailsByIdWithoutTweets = (id: string) => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const query = useQuery({
    queryKey: ["user-details-by-id-without-tweets", id],
    queryFn: async () => {
      return await graphQLClient.request(getUserDetailsByIdWithoutTweets, {
        id: id,
      });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return {
    user: query.data?.getUserDetailsByIdWithoutTweets,
    isFetched: query.isFetched,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
