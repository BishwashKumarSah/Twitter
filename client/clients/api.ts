import { GraphQLClient } from "graphql-request";

export const createGraphQLClient = (token: string) => {
  const localhostUri = "http://localhost:8000/graphql";
  // const AWSHostURL = "https://d9uq3x3zwuy4x.cloudfront.net/";
  return new GraphQLClient(`${localhostUri}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
