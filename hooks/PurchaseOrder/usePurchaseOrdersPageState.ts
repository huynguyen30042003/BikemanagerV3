"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { PurchaseOrderResponse } from "@/types/supplier/purchase-orders";
export function usePurchaseOrdersPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE,
  );
  const [supplierId, setSupplierId] = useState<string>("all");
  const [warehouseId, setWarehouseId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderResponse | null>(null);

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
    if (!!status) query.set("orderStatus", status);
    if (!!fromDate) query.set("fromDate", fromDate);
    if (!!toDate) query.set("toDate", toDate);
    query.set("page", page.toString());
    query.set("pageSize", pageSize.toString());

    router.replace(`${pathname}?${query.toString()}`);
  }, [
    searchTerm,
    page,
    pageSize,
    pathname,
    router,
    status,
    toDate,
    fromDate,
  ]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };
  const handleStatus = (value: string) => {
    setStatus(value);
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
    const handleSupplierId = (value: string) => {
    setSupplierId(value);
    setPage(DEFAULT_PAGE);
  };
    const handleWarehouseId = (value: string) => {
    setWarehouseId(value);
    setPage(DEFAULT_PAGE);
  };


  return {
    page,///
    setPage,//
    pageSize,//
    searchInput,//
    searchTerm,//
    handleSearch,//
    status,//
    handleStatus,//
    toDate,//
    handleToDate,//
    fromDate,//
    handleFromDate,//
    supplierId,
    handleSupplierId,
    warehouseId,
    handleWarehouseId,
    cancelOpen,
    setCancelOpen,
    selectedPO,
    setSelectedPO
  };
}
