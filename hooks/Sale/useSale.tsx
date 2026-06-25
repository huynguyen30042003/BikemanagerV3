
import { cancelOrder, createInstallmentOrder, createOrder, returnOrder } from "@/shared/api/order/sale";
import { CreateInstallmentOrderRequest, CreateSaleOrderRequest } from "@/types/sale/sale";

import { useMutation } from "@tanstack/react-query";


export const useCreateOrder = () => {
  // const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSaleOrderRequest) => createOrder(body),
    // onSuccess: () => {
    //   qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
    // },
  });
};
export const useCreateInstallmentOrder = () => {
  // const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInstallmentOrderRequest) => createInstallmentOrder(body),
    // onSuccess: () => {
    //   qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
    // },
  });
};
export const useCancelOrder = () => {
  // const qc = useQueryClient();
  return useMutation({
    mutationFn: (id:string) => cancelOrder(id),
    // onSuccess: () => {
    //   qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
    // },
  });
};
export const useReturnOrder = () => {
  // const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => returnOrder(id),
    // onSuccess: () => {
    //   qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
    // },
  });
};