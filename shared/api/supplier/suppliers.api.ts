import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import {
  CreateSupplierRequest,
  ItemResult,
  PagedResult,
  SupplierQuery,
  SupplierResponse,
  UpdateSupplierRequest,
} from "@/types/supplier/suppliers";

export const getSuppliers = async (
  params: SupplierQuery,
): Promise<PagedResult<SupplierResponse>> => {
  const token = getAccessToken();
  const queryParams = {
    ...(params.Keyword && { Keyword: params.Keyword }),
    ...(params.IsActive && { IsActive: params.IsActive }),
    ...(params.SortBy && { SortBy: params.SortBy }),
    ...(params.Descending && { Descending: params.Descending }),
    PageNumber: params.PageNumber ?? 1,
    PageSize: params.PageSize ?? 10,
  };
  const response = await api.get(`${APP_URL}/suppliers`, {
    params: queryParams,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const getSupplierById = async (
  id: string,
): Promise<ItemResult<SupplierResponse>> => {
  const token = getAccessToken();

  const response = await api.get(`${APP_URL}/suppliers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const createSupplier = async (
  formdata: CreateSupplierRequest,
): Promise<ItemResult<SupplierResponse>> => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/suppliers`, formdata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
export const updateSupplier = async (formdata: UpdateSupplierRequest) => {
  const token = getAccessToken();

  const response = await api.put(
    `${APP_URL}/suppliers/${formdata.id}`,
    formdata,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    },
  );

  return response.data;
};

export const deleteSupplier = async (id: string) => {
  const token = getAccessToken();

  const response = await api.delete(`${APP_URL}/suppliers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
