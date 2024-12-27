"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

interface CustomLocalSearchProps {
  placeholder: string;
  onDataFetched: (
    data: GetTweetsAndUsersQueryQuery["getTweetsAndUsersQuery"]
  ) => void;
}

const LocalSearchBar = ({
  placeholder,
  onDataFetched,
}: CustomLocalSearchProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  console.log("debouncedSearch", debouncedSearch);
  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);

  useEffect(() => {
    const getTweetsAndUsers = async () => {
      if (debouncedSearch) {
        const result = await graphQLClient.request<
          GetTweetsAndUsersQueryQuery,
          GetTweetsAndUsersQueryQueryVariables
        >(getTweetsAndUsersQuery, { debouncedSearch });
      }
    };
    getTweetsAndUsers();
  }, [debouncedSearch]);

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
            className="w-full h-full bg-transparent outline-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default LocalSearchBar;
