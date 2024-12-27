"use client";
import { useEffect, useState } from "react";

export const useDebounce = <T>(searchQuery: T, delay = 500) => {
  const [debouncedSearchedQuery, setDebouncedSearchedQuery] =
    useState<T>(searchQuery);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchedQuery(searchQuery);
    }, delay);

    return () => clearTimeout(timeout);
  }, [searchQuery, delay]);

  return debouncedSearchedQuery;
};
