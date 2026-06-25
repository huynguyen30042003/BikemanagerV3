import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";

import {
  CreateInstallmentOrderRequest,
  CreateSaleOrderRequest,
} from "@/types/sale/sale";

export const createOrder = async (formdata: CreateSaleOrderRequest) => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/sales/create-order`, formdata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const createInstallmentOrder = async (
  formdata: CreateInstallmentOrderRequest,
) => {
  const token = getAccessToken();

  const response = await api.post(
    `${APP_URL}/sales/create-installment-order`,
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

export const cancelOrder = async (id: string) => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/sales/${id}/cancel`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const returnOrder = async (id: string) => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/sales/${id}/return`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};
