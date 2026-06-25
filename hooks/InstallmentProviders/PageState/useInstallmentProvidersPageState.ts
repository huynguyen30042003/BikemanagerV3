"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { useDeleteInstallmentProvider, useGetInstallmentProvider } from "../useInstallmentProviders";
import { InstallmentProviderResponse } from "@/types/order/installment-provider";
export function useInstallmentProvidersPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [selectInstallmentProvider, setSelectInstallmentProvider] = useState<InstallmentProviderResponse>();
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE,
  );
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: searchParams.get("search") || "",
  });

  const { data: installmentProviderData } = useGetInstallmentProvider({
    Search: searchTerm,
    IsActive: true,
    Page: page,
    PageSize: pageSize,
  });

  const deleteInstallmentProvider = useDeleteInstallmentProvider();

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
    if (!selectInstallmentProvider?.id){
      return
    }
    deleteInstallmentProvider.mutate(selectInstallmentProvider.id, {
      onSuccess: () => {
        alert("delete successfull");
      },
    });
  };
  const handleDeleteform = (InstallmentProvider: InstallmentProviderResponse) => {
    setIsOpenDelete(true)
    setSelectInstallmentProvider(InstallmentProvider)
  }
  return {
    page,
    setPage,
    pageSize,
    searchInput,
    searchTerm,
    handleSearch,
    installmentProviderData,
    handleConfirmDelete,
    isOpenDelete,
    setIsOpenDelete,
    deleteInstallmentProvider,
    handleDeleteform
  };
}
