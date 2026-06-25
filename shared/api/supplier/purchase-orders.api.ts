import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import {
  CreatePurchaseOrderRequest,
  PurchaseOrderQuery,
  PurchaseOrderResponse,
  ReceivePurchaseOrderRequest,
} from "@/types/supplier/purchase-orders";
import { ItemResult, PagedResult } from "@/types";

export const getPurchaseOrders = async (
  params: PurchaseOrderQuery,
): Promise<PagedResult<PurchaseOrderResponse>> => {
  const token = getAccessToken();
  const queryParams = {
    ...(params.Keyword && { Keyword: params?.Keyword }),
    ...(params.SupplierId && { SupplierId: params?.SupplierId }),
    ...(params.WarehouseId && { WarehouseId: params?.WarehouseId }),
    ...(params.Status && { Status: params?.Status }),
    ...(params.FromDate && { FromDate: params?.FromDate }),
    ...(params.ToDate && { ToDate: params?.ToDate }),
    ...(params.SortBy && { SortBy: params?.SortBy }),
    ...(params.Descending && { Descending: params.Descending }),
    PageNumber: params.PageNumber ?? 1,
    PageSize: params.PageSize ?? 10,
  };
  const response = await api.get(`${APP_URL}/purchase-orders`, {
    params:queryParams,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const getPurchaseOrderById = async (
  id: string,
): Promise<ItemResult<PurchaseOrderResponse>> => {
  const token = getAccessToken();

  const response = await api.get(`${APP_URL}/purchase-orders/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const createPurchaseOrder = async (
  formdata: CreatePurchaseOrderRequest,
): Promise<ItemResult<PurchaseOrderResponse>> => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/purchase-orders`, formdata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const cancelPurchaseOrder = async (id: string) => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/purchase-orders/${id}/cancel`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

export const approvePurchaseOrder = async (id: string) => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/purchase-orders/${id}/approve`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};

//receive

export const receivePurchaseOrder = async (req: ReceivePurchaseOrderRequest) => {
  const token = getAccessToken();

  const response = await api.post(`${APP_URL}/purchase-orders/${req.id}/receive`, {serials: req.serials} ,{
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });

  return response.data;
};