import {
	getWarranties,
	getWarrantyById,
} from "@/shared/api/warranty/warranty.api";
import { WarrantyQuery } from "@/types/warranty/warranty";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SUPPLIER_KEYS = {
	all: ["Warranty"] as const,
	list: (params?: object) => [...SUPPLIER_KEYS.all, "list", params] as const,
	detail: (id: string) => [...SUPPLIER_KEYS.all, "detail", id] as const,
};
type UseGetOrderOptions = {
  enabled?: boolean;
};

export const useGetWarranties = (params: WarrantyQuery, options?: UseGetOrderOptions) =>
	useQuery({
		queryKey: SUPPLIER_KEYS.list(params),
		queryFn: () => getWarranties(params),
		enabled: options?.enabled ?? true,
		refetchOnWindowFocus: false,
	});

export const useGetWarrantyById = (id: string) =>
	useQuery({
		queryKey: SUPPLIER_KEYS.detail(id),
		queryFn: () => getWarrantyById(id),
		enabled: !!id,
	});
