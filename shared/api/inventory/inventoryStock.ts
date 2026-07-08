import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import {
	InventoryStockQuery,
	InventoryStockResponse,
} from "@/types/inventory/inventory-stock";
import { PagedResult } from "@/types";

export const getInventoryStockDetail = async (
	params: InventoryStockQuery,
): Promise<PagedResult<InventoryStockResponse>> => {
	const token = getAccessToken();
	const queryParams = {
		...(params.InStockOnly && { InStockOnly: params.InStockOnly }),
		...(params.WarehouseId && { WarehouseId: params.WarehouseId }),
		...(params.ProductVariantId && { BranchId: params.ProductVariantId }),
		Page: params.Page ?? 1,
		PageSize: params.PageSize ?? 10,
		TrackSerial: params.TrackSerial,
	};

	const response = await api.get(`${APP_URL}/inventory-stocks/detail`, {
		params: queryParams,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},

		withCredentials: true,
	});

	return response.data;
};
