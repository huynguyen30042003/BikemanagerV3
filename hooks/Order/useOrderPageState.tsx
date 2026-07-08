"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
export function useOrderPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE,
  );
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });

  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: searchParams.get("search") || "",
  });

  // Sync state → URL
  useEffect(() => {
    const query = new URLSearchParams();

    if (searchTerm) query.set("search", searchTerm);
    if (paymentStatus) query.set("paymentStatus", paymentStatus);
    if (orderStatus) query.set("orderStatus", orderStatus);
    if (fromDate) query.set("fromDate", fromDate);
    if (toDate) query.set("toDate", toDate);
    query.set("page", page.toString());
    query.set("pageSize", pageSize.toString());

    router.replace(`${pathname}?${query.toString()}`);
  }, [
    searchTerm,
    page,
    pageSize,
    pathname,
    router,
    paymentStatus,
    orderStatus,
    toDate,
    fromDate,
  ]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };
  const handlePaymentStatus = (value: string) => {
    setPaymentStatus(value);
    setPage(DEFAULT_PAGE);
  };
  const handleOrderStatus = (value: string) => {
    setOrderStatus(value);
    setPage(DEFAULT_PAGE);
  };
  const handleFromDate = (value: string) => {
    setFromDate(value);
    setPage(DEFAULT_PAGE);
  };
  const handleToDate = (value: string) => {
    setToDate(value);
    setPage(DEFAULT_PAGE);
  };

  return {
    page,
    setPage,
    pageSize,
    searchInput,
    searchTerm,
    handleSearch,
    paymentStatus,
    handlePaymentStatus,
    orderStatus,
    handleOrderStatus,
    toDate,
    handleToDate,
    fromDate,
    handleFromDate,
  };
}
