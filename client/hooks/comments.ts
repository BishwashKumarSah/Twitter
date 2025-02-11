import { createGraphQLClient } from "@/clients/api";
import {
  BookMark,
  MutationPostCommentByTweetIdArgs,
  Tweet,
} from "@/gql/graphql";
import { PostCommentByTweetId } from "@/graphql/mutate/comment";

import { useCookie } from "@/utils/CookieProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostCommentByTweetId = ({ userId }: { userId: string }) => {
  const { cookie } = useCookie();
  const graphqlClient = createGraphQLClient(cookie);
  const queryClient = useQueryClient();
  const postCommentByTweetIdMutation = useMutation({
    mutationFn: async (payload: MutationPostCommentByTweetIdArgs) => {
      return await graphqlClient.request(PostCommentByTweetId, payload);
    },
    onSuccess: (newData, variables) => {
      queryClient.refetchQueries({
        queryKey: [`tweet:${variables.payload?.tweetId}:comment`],
      });

      queryClient.setQueryData<{
        pages: Array<{ getAllTweets: Tweet[] }> | undefined;
        pageParams: number[] | undefined;
      }>(["get-all-tweets"], (oldData) => {
        // console.log({ oldData });
        if (!oldData) {
          return undefined;
        }

        return {
          ...oldData,
          pageParams: oldData.pageParams,
          pages: oldData.pages?.map((page: { getAllTweets: Tweet[] }) => {
            return {
              ...page,
              getAllTweets: page.getAllTweets.map((tweet: Tweet) => {
                if (tweet.id === variables.payload?.tweetId) {
                  return {
                    ...tweet,
                    commentCount: tweet.commentCount + 1,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      });

      queryClient.setQueryData<{ getAllUserBookMarks: BookMark[] }>(
        ["All_BookMarked_Tweets", userId],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }
          return {
            ...oldData,
            getAllUserBookMarks: oldData.getAllUserBookMarks.map(
              (bookmark: BookMark) => {
                if (bookmark.tweetId === variables.payload?.tweetId) {
                  return {
                    ...bookmark,
                    tweet: {
                      ...bookmark.tweet,
                      commentCount: bookmark.tweet.commentCount + 1,
                    },
                  };
                }
                return bookmark;
              }
            ),
          };
        }
      );
    },
  });
  return postCommentByTweetIdMutation;
};
