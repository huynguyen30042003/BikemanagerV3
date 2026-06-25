import { getAccessToken } from "@/lib/auth";
import { OrderItemResponse, orderParams, orderRes } from "@/types/order/order";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { ItemResult, PagedResult } from "@/types";

export const getOrder = async (
  params: orderParams,
) => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/orders`,
    {
      params: {
        Search: params?.Search,
        CustomerId: params?.CustomerId,
        FromDate: params?.FromDate,
        ToDate: params?.ToDate,
        PaymentStatus: params?.PaymentStatus,
        OrderStatus: params?.OrderStatus,
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

  return response.data.data;
};

export const getOrderDetail = async (
  id: string,
): Promise<PagedResult<OrderItemResponse>> => {
  const token = getAccessToken();

  const response = await api.get(`${APP_URL}/order-items`, {
    params:{OrderId: id},headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const getOrderById = async (
  id: string,
): Promise<ItemResult<orderRes>> => {
  const token = getAccessToken();

  const response = await api.get(`${APP_URL}/orders/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};