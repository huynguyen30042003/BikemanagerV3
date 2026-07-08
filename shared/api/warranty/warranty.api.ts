import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { ItemResult, PagedResult } from "@/types";
import { WarrantyQuery, WarrantyResponse } from "@/types/warranty/warranty";


export const getWarranties = async (
  params: WarrantyQuery,
): Promise<ItemResult<PagedResult<WarrantyResponse>>> => {
  const token = getAccessToken();
  const queryParams = {
    ...(params.CustomerId && { CustomerId: params.CustomerId }),
    ...(params.OrderId && { OrderId: params.OrderId }),
    ...(params.SerialNumberId && { SerialNumberId: params.SerialNumberId }),
    ...(params.Status && { Status: params.Status }),
    ...(params.StartDate && { StartDate: params.StartDate }),
    ...(params.EndDate && { EndDate: params.EndDate }),
    Page: params.Page ?? 1,
    PageSize: params.PageSize ?? 10,
  };
  const response = await api.get(`${APP_URL}/warranties`, {
    params: queryParams,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const getWarrantyById = async (
  id: string,
): Promise<ItemResult<WarrantyResponse>> => {
  const token = getAccessToken();

  const response = await api.get(`${APP_URL}/warranties/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
