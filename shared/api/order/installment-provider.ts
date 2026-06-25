import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { ItemResult, PagedResult } from "@/types";
import {
  CreateInstallmentProviderRequest,
  InstallmentProviderQuery,
  InstallmentProviderResponse,
  UpdateInstallmentProviderRequest,
} from "@/types/order/installment-provider";

export const getInstallmentProvider = async (
  params: InstallmentProviderQuery,
): Promise<PagedResult<InstallmentProviderResponse>> => {
  const token = getAccessToken();

  const response = await api.get(`${APP_URL}/installment-providers`, {
    params: {
      Search: params?.Search,
      IsActive: params?.IsActive,
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

export const getInstallmentProvidersByOrderId = async (
  orderId: string,
): Promise<ItemResult<InstallmentProviderResponse>> => {
  const token = getAccessToken();

  const response = await api.get(`${APP_URL}/installment-providers/${orderId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const createInstallmentProvider = async (
  formdata: CreateInstallmentProviderRequest,
) => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/installment-providers`, formdata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
export const updateInstallmentProvider = async (
  formdata: UpdateInstallmentProviderRequest,
) => {
  const token = getAccessToken();

  const response = await api.put(
    `${APP_URL}/installment-providers/${formdata.id}`,
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

export const deleteInstallmentProvider = async (id: string) => {
  const token = getAccessToken();

  const response = await api.delete(`${APP_URL}/installment-providers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
