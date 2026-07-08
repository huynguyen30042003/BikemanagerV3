"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
	DEBOUNCE_DELAY,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { useGetCustomersStatic } from "./useCustomerStatic";
export function useCustomerStaticPageState() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [page, setPage] = useState(
		Number(searchParams.get("page")) || DEFAULT_PAGE,
	);
	const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

	const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
		delay: DEBOUNCE_DELAY,
		initialValue: searchParams.get("search") || "",
	});

	const { data: customersStaticData, isLoading } = useGetCustomersStatic({
		Search: searchTerm,
		Page: page,
		PageSize: pageSize,
	});

	useEffect(() => {
		const query = new URLSearchParams();

		if (searchTerm) query.set("search", searchTerm);

		router.replace(`${pathname}?${query.toString()}`);
	}, [searchTerm, pathname, router]);

	const handleSearch = (value: string) => {
		setSearchInput(value);
		setPage(DEFAULT_PAGE);
	};
	return {
		page,
		setPage,
		pageSize,
		searchInput,
		handleSearch,
		customersStaticData,
		isLoading,
	};
}
