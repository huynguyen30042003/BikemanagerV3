"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { useDeleteInstallmentContract, useGetInstallmentContracts } from "../useInstallmentContracts";
import { InstallmentContractsRes } from "@/types/order/installment-contracts";
export function useInstallmentContractsPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [selectInstallmentContract, setSelectInstallmentContract] = useState<InstallmentContractsRes>();
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE,
  );
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: searchParams.get("search") || "",
  });

  const { data: installmentContractData } = useGetInstallmentContracts({
    Page: page,
    PageSize: pageSize,
  });

  const deleteInstallmentContract = useDeleteInstallmentContract();

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
    if (!selectInstallmentContract?.id){
      return
    }
    deleteInstallmentContract.mutate(selectInstallmentContract.id, {
      onSuccess: () => {
        alert("delete successfull");
      },
    });
  };
  const handleDeleteform = (InstallmentContract: InstallmentContractsRes) => {
    setIsOpenDelete(true)
    setSelectInstallmentContract(InstallmentContract)
  }
  return {
    page,
    setPage,
    pageSize,
    searchInput,
    searchTerm,
    handleSearch,
    installmentContractData,
    handleConfirmDelete,
    isOpenDelete,
    setIsOpenDelete,
    deleteInstallmentContract,
    handleDeleteform
  };
}
