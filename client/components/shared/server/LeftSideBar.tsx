import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import LeftSideBar from "../sidebar/LeftSideBar";
import { createGraphQLClient } from "@/clients/api";
import { getCurrentUserDetailsQuery } from "@/graphql/query/user";
import { getCookies } from "@/lib/actions/getToken.action";

export default async function LeftSideBarServerComponent() {
  const queryClient = new QueryClient();

  const token = await getCookies();
  const graphQLClient = createGraphQLClient(token);

  await queryClient.prefetchQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const data = await graphQLClient.request(getCurrentUserDetailsQuery);
      // console.log("prefectchdata",data);
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LeftSideBar />
    </HydrationBoundary>
  );
}
