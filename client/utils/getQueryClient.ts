import { cache } from "react";
import { QueryClient } from "@tanstack/react-query";

export const getQueryClient = cache(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnMount:false,
            refetchOnReconnect:false,
            gcTime: 120 * 1000,
          },
        },
      })
  );