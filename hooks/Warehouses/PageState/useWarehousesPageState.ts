"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { useDeleteWarehouse, useGetWarehouse } from "../useWarehouse";
import { WarehouseResponse } from "@/types/inventory/warehouse";
export function useWarehousesPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [selectWarehouse, setSelectWarehouse] = useState<WarehouseResponse>();
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE,
  );
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: searchParams.get("search") || "",
  });

  const { data: warehouseData } = useGetWarehouse({
    Search: searchTerm,
    Page: page,
    PageSize: pageSize,
  });

  const deleteWarehouse = useDeleteWarehouse();

  // Sync state → URL
  useEffect(() => {
    const query = new URLSearchParams();

    if (searchTerm) query.set("search", searchTerm);

    router.replace(`${pathname}?${query.toString()}`);
  }, [searchTerm, pathname, router]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };
  const handleConfirmDelete = () => {
    if (!selectWarehouse?.id){
      return
    }
    deleteWarehouse.mutate(selectWarehouse.id, {
      onSuccess: () => {
        alert("delete successfull");
      },
    });
  };
  const handleDeleteform = (InstallmentProvider: WarehouseResponse) => {
    setIsOpenDelete(true)
    setSelectWarehouse(InstallmentProvider)
  }
  return {
    page,
    setPage,
    pageSize,
    searchInput,
    handleSearch,
    warehouseData,
    handleConfirmDelete,
    isOpenDelete,
    setIsOpenDelete,
    deleteWarehouse,
    handleDeleteform
  };
}
