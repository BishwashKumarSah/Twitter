import { createGraphQLClient } from "@/clients/api";
import {
  Comment,
  GetAllCommentsByTweetIdQuery,
  GetAllCommentsByTweetIdQueryVariables,
  MutationPostCommentByTweetIdArgs,
  PostCommentByTweetIdMutation,
  PostCommentByTweetIdMutationVariables,
} from "@/gql/graphql";
import { PostCommentByTweetId } from "@/graphql/mutate/comment";
import { GetAllCommentsByTweetId } from "@/graphql/query/comment";
import { useCookie } from "@/utils/CookieProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllCommentsByTweetId = (tweetId: string) => {
  const { cookie } = useCookie();
  const graphqlClient = createGraphQLClient(cookie);

  const getAllCommentsByTweetIdQuery = useQuery<
    GetAllCommentsByTweetIdQuery,
    Error,
    GetAllCommentsByTweetIdQueryVariables
  >({
    queryKey: ["comments", tweetId],
    queryFn: async () => {
      return graphqlClient.request(GetAllCommentsByTweetId, { tweetId });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return {
    allComments: getAllCommentsByTweetIdQuery.data,
    ...getAllCommentsByTweetIdQuery,
  };
};

export const usePostCommentByTweetId = () => {
  const { cookie } = useCookie();
  const graphqlClient = createGraphQLClient(cookie);
  const queryClient = useQueryClient();
  const postCommentByTweetIdMutation = useMutation<
    PostCommentByTweetIdMutation,
    Error,
    PostCommentByTweetIdMutationVariables
  >({
    mutationFn: async (payload: MutationPostCommentByTweetIdArgs) => {
      console.log("payload", payload);
      return await graphqlClient.request(PostCommentByTweetId, payload);
    },
    onSuccess: (newData, variables) => {
      queryClient.setQueryData(
        ["comments", `${variables.payload?.tweetId}`],
        (oldComments: Comment[] | undefined) => {
          if (oldComments) {
            const res = [...oldComments, newData];
            console.log({ res });
            return [...oldComments, newData];
          }
          const newRes = [newData];
          console.log({ newRes });
          return [newData];
        }
      );
    },
  });
  return postCommentByTweetIdMutation;
};
