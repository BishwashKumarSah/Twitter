import { GraphQLClient } from "graphql-request";

export const createGraphQLClient = (token:string) => {
  
  return new GraphQLClient("http://localhost:8000/graphql", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
