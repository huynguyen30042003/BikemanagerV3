import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import api from "..";
import {
	CreateSerialNumberRequest,
	UpdateSerialNumberRequest,
	SerialNumberQuery,
	SerialNumberResponse,
} from "@/types/product/serialNumber";
import { PagedResult } from "@/types";

export const getSerialNumbers = async (
	params: SerialNumberQuery,
): Promise<PagedResult<SerialNumberResponse>> => {
	const token = getAccessToken();
	const queryParams = {
		...(params.search && { search: params.search }),
		...(params.searchBy && { searchBy: params.searchBy }),
		...(params.productVariantId && {
			productVariantId: params.productVariantId,
		}),
		...(params.serialCode && { serialCode: params.serialCode }),
		...(params.currentStatus && { currentStatus: params.currentStatus }),
		...(params.warehouseId && { warehouseId: params.warehouseId }),
		...(params.trackSerial && { trackSerial: params.trackSerial }),
		...(params.page && { page: params.page }),
		...(params.pageSize && { pageSize: params.pageSize }),
	};

	const response = await api.get(`${APP_URL}/serial-numbers`, {
		params: queryParams,
		headers: { Authorization: `Bearer ${token}` },
	});

	return response.data;
};

export const getSerialNumberById = async (id: string) => {
	const token = getAccessToken();
	const response = await api.get(`${APP_URL}/serial-numbers/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return response.data;
};

export const createSerialNumber = async (
	payload: CreateSerialNumberRequest,
) => {
	const statusMap = {
		IN_STOCK: 2,
		SOLD: 1,
	};

	const normalizedPayload = Object.fromEntries(
		Object.entries(payload).map(([key, value]) => {
			if (key === "currentStatus") {
				return [
					key,
					value ? statusMap[value as keyof typeof statusMap] : null,
				];
			}

			return [key, value === undefined || value === "" ? null : value];
		}),
	);

	const token = getAccessToken();
	const response = await api.post(
		`${APP_URL}/serial-numbers`,
		normalizedPayload,
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

	return response.data;
};

export const updateSerialNumber = async (
	payload: UpdateSerialNumberRequest,
) => {
	const token = getAccessToken();
	const statusMap = {
		IN_STOCK: 2,
		SOLD: 1,
	};

	const normalizedPayload = Object.fromEntries(
		Object.entries(payload).map(([key, value]) => {
			if (key === "currentStatus") {
				return [
					key,
					value ? statusMap[value as keyof typeof statusMap] : null,
				];
			}

			return [key, value === undefined || value === "" ? null : value];
		}),
	);
	const response = await api.put(
		`${APP_URL}/serial-numbers/${payload.id}`,
		normalizedPayload,
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

	return response.data;
};

export const deleteSerialNumber = async (id: string) => {
	const token = getAccessToken();
	const response = await api.delete(`${APP_URL}/serial-numbers/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return response.data;
};
