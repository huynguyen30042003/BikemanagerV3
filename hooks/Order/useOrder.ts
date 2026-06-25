import { getOrder, getOrderById, getOrderDetail } from "@/shared/api/order/order.api";
import { orderParams } from "@/types/order/order";
import { useQuery } from "@tanstack/react-query";
type UseGetOrderOptions = {
  enabled?: boolean;
};
export const ORDER_KEYS = {
  all: ["order"] as const,
  list: (params?: object) => [...ORDER_KEYS.all, "list", params] as const,
  detail: (id: string) => [...ORDER_KEYS.all, "detail", id] as const,
};export const ORDERDETAIL_KEYS = {
  all: ["order-detail"] as const,
  list: (params?: object) => [...ORDERDETAIL_KEYS.all, "list", params] as const,
  detail: (id: string) => [...ORDERDETAIL_KEYS.all, "detail", id] as const,
};
export const useGetOrder = (
  params: orderParams,
  options?: UseGetOrderOptions
) => {
  return useQuery({
    queryKey: ["order", params.CustomerId,
  params.Search,
  params.PaymentStatus,
  params.FromDate,
  params.ToDate,
  params.OrderStatus,
  params.Page,
  params.PageSize,],
    queryFn: () => getOrder(params),
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5  
  });
};

export const useGetOrderDetail = (id: string) =>
  useQuery({
    queryKey: ORDERDETAIL_KEYS.detail(id),
    queryFn: () => getOrderDetail(id),
    enabled: !!id,
    refetchOnWindowFocus: false,


  });

  export const useGetOrderById = (id: string) =>
  useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => getOrderById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });