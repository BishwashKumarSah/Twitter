"use client";

import { createGraphQLClient } from "@/clients/api";
import {
  CreateTweetData,
  GetAllCommentsByTweetIdQueryVariables,
  GetTweetByIdQuery,
  LikeUnlikeTweetData,
  Tweet,
} from "@/gql/graphql";

import { createNewTweet, likeTweets } from "@/graphql/mutate/tweet";
import {
  getAllTweetsByUserId,
  getAllTweetsQuery,
  getTweetById,
} from "@/graphql/query/tweet";
import { useCookie } from "@/utils/CookieProvider";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// mutation to create a tweet
export const useCreateNewTweet = () => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphQLClient.request<{ createTweet: Tweet }>(createNewTweet, {
        payload,
      }),
    onSuccess: (newTweetData) => {
      const newTweet = newTweetData.createTweet;

      queryClient.setQueryData<{
        pages: Array<{ getAllTweets: Tweet[] }>;
        pageParams: unknown[];
      }>(["get-all-tweets"], (oldData) => {
        if (!oldData) return undefined;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                getAllTweets: [newTweet, ...page.getAllTweets],
              };
            }
            return page;
          }),
        };
      });
    },
  });

  return mutation;
};

export const useLikeTweets = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const queryKeysToInvalidate = [
    ["get-all-tweets"],
    ["All_BookMarked_Tweets", userId],
  ];
  const likeTweetMutation = useMutation({
    mutationFn: async (payload: LikeUnlikeTweetData) => {
      return await graphQLClient.request(likeTweets, { payload });
    },
    onSuccess: async () => {
      await Promise.all(
        queryKeysToInvalidate.map(async (key) => {
          await queryClient.refetchQueries({
            queryKey: key,
          });
        })
      );
    },
  });
  return likeTweetMutation;
};

// query to get all the tweets
export const useGetAllTweets = () => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const allTweetsQuery = useInfiniteQuery({
    queryKey: ["get-all-tweets"],
    queryFn: async ({ pageParam = 1 }) =>
      await graphQLClient.request(getAllTweetsQuery, {
        limit: 10,
        offset: (pageParam - 1) * 10,
      }),
    getNextPageParam: (lastPage, pages) => {
      console.log({ lastPage, pages });
      if (lastPage?.getAllTweets?.length) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,

    staleTime: Infinity, // Keeps data fresh indefinitely
    gcTime: 1000 * 60 * 60, // Keeps data in cache for 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    ...allTweetsQuery,
  };
};

export const useGetAllTweetsByUserId = (userId: string) => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  // console.log("userIIIIID",userId);

  const allTweetsByUserIdQuery = useQuery({
    queryKey: ["all-user-tweets-byId", userId],
    queryFn: async () => {
      try {
        return await graphQLClient.request(getAllTweetsByUserId, {
          userId: userId,
        });
      } catch (error) {
        console.log("Error in useGetAllTweetsByUserId hooks allTweets", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!userId, // Ensures the query only runs if userId is available
  });
  return {
    ...allTweetsByUserIdQuery,
    userInfo: allTweetsByUserIdQuery.data?.getAllUserTweets,
    allTweetsData: allTweetsByUserIdQuery.data?.getAllUserTweets?.tweet,
  };
};

export const useGetTweetById = ({ tweetId }: { tweetId: string }) => {
  const { cookie } = useCookie();
  const graphqlClient = createGraphQLClient(cookie);
  const getTweetByIdQuery = useQuery({
    queryKey: [`tweet:${tweetId}:comment`],
    queryFn: async () => {
      return await graphqlClient.request<
        GetTweetByIdQuery,
        GetAllCommentsByTweetIdQueryVariables
      >(getTweetById, { tweetId });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return {
    tweetData: getTweetByIdQuery.data?.getTweetById,
    ...getTweetByIdQuery,
  };
};
