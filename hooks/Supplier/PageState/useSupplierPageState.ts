"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { useDeleteSupplier, useGetSupplier } from "../useSupplier";
import { SupplierResponse } from "@/types/supplier/suppliers";
export function useSupplierPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [selectSupplier, setSelectSupplier] = useState<SupplierResponse>();
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE,
  );
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: searchParams.get("search") || "",
  });

  const { data: supplierData } = useGetSupplier({
    Keyword: searchTerm,
    PageNumber: page,
    PageSize: pageSize,
  });

  const deleteSupplier = useDeleteSupplier();

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
    if (!selectSupplier?.id){
      return
    }
    deleteSupplier.mutate(selectSupplier.id, {
      onSuccess: () => {
        alert("delete successfull");
      },
    });
  };
  const handleDeleteform = (supplier: SupplierResponse) => {
    setIsOpenDelete(true)
    setSelectSupplier(supplier)
  }
  return {
    page,
    setPage,
    pageSize,
    searchInput,
    searchTerm,
    handleSearch,
    supplierData,
    handleConfirmDelete,
    isOpenDelete,
    setIsOpenDelete,
    deleteSupplier,
    handleDeleteform
  };
}
