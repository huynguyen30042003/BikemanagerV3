import { getPurchaseOrders,createPurchaseOrder, getPurchaseOrderById, cancelPurchaseOrder, approvePurchaseOrder, receivePurchaseOrder} from "@/shared/api/supplier/purchase-orders.api";
import { CreatePurchaseOrderRequest, PurchaseOrderQuery, ReceivePurchaseOrderRequest } from "@/types/supplier/purchase-orders";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

export const PURCHASEORDER_KEYS = {
  all: ["PurchaseOrder"] as const,
  list: (params?: object) => [...PURCHASEORDER_KEYS.all, "list", params] as const,
  detail: (id: string) => [...PURCHASEORDER_KEYS.all, "detail", id] as const,
};
export const useGetPurchaseOrder = (params: PurchaseOrderQuery) =>
  useQuery({
    queryKey: PURCHASEORDER_KEYS.list(params),
    queryFn: () => getPurchaseOrders(params),
    staleTime: 1000 * 60 * 10,
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGetPurchaseOrderById = (id: string,options?: UseQueryOptions<any>) =>
  useQuery({
    queryKey: PURCHASEORDER_KEYS.detail(id),
    queryFn: () => getPurchaseOrderById(id),
    enabled: !!id,
    ...options,
  });

export const useCreatePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePurchaseOrderRequest) =>
      createPurchaseOrder(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PURCHASEORDER_KEYS.all });
    },
  });
};

export const useCancelPurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      cancelPurchaseOrder(id),
    onSuccess: (_,vars) => {
      qc.invalidateQueries({ queryKey: PURCHASEORDER_KEYS.all });
      qc.invalidateQueries({ queryKey: PURCHASEORDER_KEYS.detail(vars) });
    },
  });
};

export const useApprovePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      approvePurchaseOrder(id),
    onSuccess: (_,vars) => {
      qc.invalidateQueries({ queryKey: PURCHASEORDER_KEYS.all });
      qc.invalidateQueries({ queryKey: PURCHASEORDER_KEYS.detail(vars) });
    },
  });
};
export const useReceivedPurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: ReceivePurchaseOrderRequest) =>
      receivePurchaseOrder(req),
    onSuccess: (_,vars) => {
      qc.invalidateQueries({ queryKey: PURCHASEORDER_KEYS.all });
      qc.invalidateQueries({ queryKey: PURCHASEORDER_KEYS.detail(vars.id) });
    },
  });
};