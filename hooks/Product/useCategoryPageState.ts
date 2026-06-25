"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
} from '@/constants/Vehiclespage.constants'
export function useCategoryPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: searchParams.get("search") || "",
  });

  // Sync state → URL
  useEffect(() => {
    const query = new URLSearchParams();

    if (searchTerm) query.set("search", searchTerm);
    router.replace(`${pathname}?${query.toString()}`);
  }, [searchTerm, pathname, router]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  return {
    searchInput,
    searchTerm,
    handleSearch,
  };
}