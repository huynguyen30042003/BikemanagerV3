import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import {
	CustomerStatisticQuery,
	CustomerStatisticResponse,
} from "@/types/Customer/CustomerStatistic";
import { PagedResult } from "@/types";

export const getCustomerStatistic = async (
	params: CustomerStatisticQuery,
): Promise<PagedResult<CustomerStatisticResponse>> => {
	const token = getAccessToken();

	const response = await api.get(`${APP_URL}/customer-statistics`, {
		params: {
			Search: params?.Search,
			CustomerLevel: params?.CustomerLevel,
			CustomerName: params?.CustomerName,
			Page: params?.Page || 1,
			PageSize: params?.PageSize || 10,
		},
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},

		withCredentials: true,
	});

	return response.data;
};
