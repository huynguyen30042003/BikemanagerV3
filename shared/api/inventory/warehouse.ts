import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { CreateWarehouseRequest, ItemResult, PagedResult, WarehouseQuery, WarehouseResponse } from "@/types/inventory/warehouse";

export const getWarehouse = async (
  params: WarehouseQuery,
): Promise<PagedResult<WarehouseResponse>> => {
  const token = getAccessToken();
  const queryParams = {
    ...(params.Search && { Search: params.Search }),
    ...(params.BranchId && { BranchId: params.BranchId }),
    Page: params.Page ?? 1,
    PageSize: params.PageSize ?? 10,
  };

  const response = await api.get(`${APP_URL}/warehouses`, {
    params:queryParams,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const getWarehouseById = async (
  id: string,
): Promise<ItemResult<WarehouseResponse>> => {
  const token = getAccessToken();

  const response = await api.get(`${APP_URL}/warehouses/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const createWarehouse = async (
  formdata: CreateWarehouseRequest,
): Promise<ItemResult<WarehouseResponse>> => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/warehouses`, formdata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const deleteWarehouse = async (
  id: string,
) => {
  const token = getAccessToken();

  const response = await api.delete(`${APP_URL}/warehouses/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
