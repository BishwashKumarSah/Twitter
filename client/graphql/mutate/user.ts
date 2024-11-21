import { graphql } from "@/gql";

export const handleFollowUserMutation = graphql(`
  #graphql
  mutation FollowUser($to: String!) {
    followUser(to: $to)
  }
`);

export const handleUnFollowUserMutation = graphql(`
  #graphql
  mutation unFollowUser($to: String!) {
    unFollowUser(to: $to)
  }
`);
