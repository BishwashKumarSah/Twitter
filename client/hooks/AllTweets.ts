"use client";

import { createGraphQLClient } from "@/clients/api";
import {
  BookMark,
  CreateTweetData,
  GetAllCommentsByTweetIdQueryVariables,
  GetTweetByIdQuery,
  LikeUnlikeTweetData,
  Tweet,
  User,
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

// Helper to update cached tweet data
const updateTweetCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: string[],
  tweetId: string,
  updateFn: (tweet: Tweet) => Tweet
) => {
  queryClient.setQueryData<{
    pages: Array<{ getAllTweets: Tweet[] }> | undefined;
    pageParams: number[] | undefined;
  }>(queryKey, (oldData) => {
    if (!oldData) return undefined;
    return {
      ...oldData,
      pages: oldData.pages?.map((page: { getAllTweets: Tweet[] }) => {
        return {
          ...page,
          getAllTweets: page.getAllTweets.map((tweet: Tweet) =>
            tweet.id === tweetId ? updateFn(tweet) : tweet
          ),
        };
      }),
    };
  });
};

// Mutation to create a tweet
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
        pageParams: number[];
      }>(["get-all-tweets"], (oldData) => {
        if (!oldData) {
          return {
            pageParams: [1],
            pages: [{ getAllTweets: [newTweet] }],
          };
        }
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

// Mutation to like/unlike a tweet
export const useLikeTweets = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);

  const likeTweetMutation = useMutation({
    mutationFn: async (payload: LikeUnlikeTweetData) => {
      return await graphQLClient.request(likeTweets, { payload });
    },
    onSuccess: (_, { tweetId }) => {
      // Update "get-all-tweets"
      updateTweetCache(queryClient, ["get-all-tweets"], tweetId, (tweet) => ({
        ...tweet,
        isLikedByUser: !tweet.isLikedByUser,
        likesCount: tweet.isLikedByUser
          ? tweet.likesCount - 1
          : tweet.likesCount + 1,
      }));

      // Update "All_BookMarked_Tweets" cache directly without refetching
      queryClient.setQueryData<{ getAllUserBookMarks: BookMark[] }>(
        ["All_BookMarked_Tweets", userId],
        (oldData) => {
          // console.log("oldData", oldData);
          if (!oldData || !oldData.getAllUserBookMarks) return oldData;

          return {
            ...oldData,
            getAllUserBookMarks: oldData.getAllUserBookMarks.map(
              (bookmarkedTweet: BookMark) => {
                // Check if the tweet is in the bookmarked list
                if (bookmarkedTweet.tweetId === tweetId) {
                  return {
                    ...bookmarkedTweet,
                    tweet: {
                      ...bookmarkedTweet.tweet,
                      isLikedByUser: !bookmarkedTweet.tweet.isLikedByUser,
                      likesCount: bookmarkedTweet.tweet.isLikedByUser
                        ? bookmarkedTweet.tweet.likesCount - 1
                        : bookmarkedTweet.tweet.likesCount + 1,
                    },
                  };
                }
                return bookmarkedTweet;
              }
            ),
          };
        }
      );

      queryClient.setQueryData<{ getAllUserTweets: User }>(
        ["all-user-tweets-byId", userId],
        (oldData) => {
          if (!oldData) return oldData;
          // console.log("oldData", oldData.getAllUserTweets);
          return {
            getAllUserTweets: {
              ...oldData.getAllUserTweets,
              tweet: oldData.getAllUserTweets.tweet?.map((tweet: Tweet) => {
                if (tweet.id === tweetId) {
                  return {
                    ...tweet,
                    isLikedByUser: !tweet.isLikedByUser,
                    likesCount: tweet.isLikedByUser
                      ? tweet.likesCount - 1
                      : tweet.likesCount + 1,
                  };
                }
                return tweet;
              }),
            },
          };
        }
      );
    },
  });

  return likeTweetMutation;
};

// Query to get all tweets with pagination
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
      if (lastPage?.getAllTweets?.length) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    ...allTweetsQuery,
  };
};

// Query to get all tweets by a specific user
export const useGetAllTweetsByUserId = (userId: string) => {
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);

  const allTweetsByUserIdQuery = useQuery({
    queryKey: ["all-user-tweets-byId", userId],
    queryFn: async () => {
      try {
        return await graphQLClient.request(getAllTweetsByUserId, { userId });
      } catch (error) {
        console.error("Error fetching tweets by user:", error);
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!userId,
  });

  return {
    ...allTweetsByUserIdQuery,
    userInfo: allTweetsByUserIdQuery.data?.getAllUserTweets,
    allTweetsData: allTweetsByUserIdQuery.data?.getAllUserTweets?.tweet,
  };
};

// Query to get a specific tweet by ID
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
