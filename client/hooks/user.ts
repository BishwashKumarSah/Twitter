"use client"

import { createGraphQLClient } from "@/clients/api"
import { getCurrentUserDetailsQuery } from "@/graphql/query/user"
import { useCookie } from "@/utils/CookieProvider"
import { useQuery } from "@tanstack/react-query"

// ! How to fetch cookie at the client side.


export const useCurrentUser = () => {   
    const {cookie} = useCookie()
    const graphQLClient = createGraphQLClient(cookie)
    const query = useQuery({
        queryKey:['current-user'],
        queryFn:async() =>{
             return await graphQLClient.request(getCurrentUserDetailsQuery)
        },      
        refetchOnWindowFocus: false,        
        refetchOnReconnect: false,
    });
//    console.log("clientData",query.data);
    return {
        user: query.data?.getCurrentUserDetails,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
      };
}



