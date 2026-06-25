import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { CreateInstallmentContractRequest, installmentContractsParams, InstallmentContractsRes, installmentProviderByOrderIdResponse, UpdateInstallmentContractRequest } from "@/types/order/installment-contracts";
import { ItemResult, PagedResult } from "@/types";

export const getInstallmentContracts = async (
  params: installmentContractsParams,
): Promise<PagedResult<InstallmentContractsRes>> => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/installment-contracts`,
    {
      params: {
        ProviderId: params?.ProviderId,
        CustomerId: params?.CustomerId,
        OrderId: params?.OrderId,
        ContractStatus: params?.ContractStatus,
        Page: params?.Page || 1,
        PageSize: params?.PageSize || 10,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    },
  );

  return response.data;
};

export const getInstallmentContractByOrderId = async (
  orderId: string,
):Promise<ItemResult<installmentProviderByOrderIdResponse>> => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/installment-contracts/orderId/${orderId}`,
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
export const getInstallmentContractById = async (
  id: string,
):Promise<ItemResult<InstallmentContractsRes>> => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/installment-contracts/${id}`,
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

export const createInstallmentContract = async (
  formdata: CreateInstallmentContractRequest,
) => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/installment-contracts`, formdata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
export const updateInstallmentContract = async (
  formdata: UpdateInstallmentContractRequest,
) => {
  const token = getAccessToken();

  const response = await api.put(
    `${APP_URL}/installment-contracts/${formdata.id}`,
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

export const deleteInstallmentContract = async (id: string) => {
  const token = getAccessToken();

  const response = await api.delete(`${APP_URL}/installment-contracts/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
