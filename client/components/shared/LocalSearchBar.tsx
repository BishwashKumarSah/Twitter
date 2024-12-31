"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { useDebounce } from "@/hooks/useDebounce";
import { createGraphQLClient } from "@/clients/api";
import { useCookie } from "@/utils/CookieProvider";
import { getTweetsAndUsersQuery } from "@/graphql/query/tweet";
import {
  GetTweetsAndUsersQueryQuery,
  GetTweetsAndUsersQueryQueryVariables,
} from "@/gql/graphql";
import toast from "react-hot-toast";
import { ClientError } from "graphql-request";

interface CustomLocalSearchProps {
  placeholder: string;
  onDataFetched: (
    data: GetTweetsAndUsersQueryQuery["getTweetsAndUsersQuery"]
  ) => void;
  query: boolean;
}

const LocalSearchBar = ({
  placeholder,
  onDataFetched,
  query,
}: CustomLocalSearchProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { cookie } = useCookie();

  const graphQLClient = useMemo(() => createGraphQLClient(cookie), [cookie]);

  useEffect(() => {
    const getTweetsAndUsers = async () => {
      if (debouncedSearch) {
        try {
          const result = await graphQLClient.request<
            GetTweetsAndUsersQueryQuery,
            GetTweetsAndUsersQueryQueryVariables
          >(getTweetsAndUsersQuery, { debouncedSearch });

          if (result.getTweetsAndUsersQuery) {
            onDataFetched(result.getTweetsAndUsersQuery);
          } else {
            onDataFetched({ tweet: [], user: [] });
          }
        } catch (error) {
          if (error instanceof ClientError) {
            toast.error(error.message);
          } else {
            toast.error("Something went wrong!");
          }
          onDataFetched({ tweet: [], user: [] });
        }
      }
    };

    getTweetsAndUsers();
  }, [debouncedSearch, graphQLClient, onDataFetched, query]); // Only run this effect when debouncedSearch changes

  const handleBackButton = () => {
    router.back();
  };

  return (
    <div>
      <nav className="w-full flex items-center gap-6 p-3">
        <div
          className="hover:bg-slate-800 p-2 rounded-full transition-all cursor-pointer"
          onClick={handleBackButton}
        >
          <FiArrowLeft className="text-2xl" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Search For Users</h1>
        </div>
      </nav>
      <div className="border flex gap-2 max-w-[80%] mx-auto h-10 items-center px-4 rounded-md">
        <div>
          <CiSearch size={30} />
        </div>
        <div className="w-full h-full">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            type="text"
            name="local__searchBtn"
            id="searchBtn"
            className="w-full h-full bg-transparent outline-none focus:outline-none shadow-none"
          />
        </div>
      </div>
    </div>
  );
};

export default LocalSearchBar;
