"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/constants/Vehiclespage.constants'
export function useVehiclesPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE,
  );
  const [searchBy, setSearchBy] = useState(
    searchParams.get("searchBy") || "all",
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || DEFAULT_MIN_PRICE,
    Number(searchParams.get("maxPrice")) || DEFAULT_MAX_PRICE,
  ]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);

  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: searchParams.get("search") || "",
  });

  // Debounce price range
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedPriceRange(priceRange),
      DEBOUNCE_DELAY,
    );
    return () => clearTimeout(timer);
  }, [priceRange]);

  // Sync state → URL
  useEffect(() => {
    const query = new URLSearchParams();

    if (searchTerm) query.set("search", searchTerm);
    if (searchBy !== "all") query.set("searchBy", searchBy);
    query.set("minPrice", debouncedPriceRange[0].toString());
    query.set("maxPrice", debouncedPriceRange[1].toString());
    query.set("page", page.toString());
    query.set("pageSize", pageSize.toString());

    router.replace(`${pathname}?${query.toString()}`);
  }, [searchTerm, searchBy, page, pageSize, pathname, router, debouncedPriceRange]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };

  return {
    page,
    setPage,
    pageSize,
    searchBy,
    setSearchBy,
    priceRange,
    setPriceRange,
    debouncedPriceRange,
    searchInput,
    searchTerm,
    handleSearch,
  };
}