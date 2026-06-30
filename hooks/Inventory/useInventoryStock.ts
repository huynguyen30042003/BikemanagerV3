import { getInventoryStockDetail } from "@/shared/api/inventory/inventoryStock";
import { InventoryStockQuery } from "@/types/inventory/inventory-stock";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const INVENTORYSTOCKS_KEYS = {
	all: ["inventory-stocks"] as const,
	list: (params?: object) =>
		[...INVENTORYSTOCKS_KEYS.all, "list", params] as const,
	detail: (id: string) =>
		[...INVENTORYSTOCKS_KEYS.all, "detail", id] as const,
};

export const useGetInventoryStockDetail = (params: InventoryStockQuery) =>
	useQuery({
		queryKey: INVENTORYSTOCKS_KEYS.list(params),
		queryFn: () => getInventoryStockDetail(params),
    	refetchOnWindowFocus: false,
    	staleTime: 1000 * 60 * 5,

	});
