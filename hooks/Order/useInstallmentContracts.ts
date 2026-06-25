import { getInstallmentContractByOrderId, getInstallmentContracts } from "@/shared/api/order/installment-contracts.api";
import { installmentContractsParams } from "@/types/order/installment-contracts";
import { useQuery } from "@tanstack/react-query";
type UseGetOrderOptions = {
  enabled?: boolean;
};
export const useGetInstallmentContracts = (
  params: installmentContractsParams,
  options?: UseGetOrderOptions
) => {
  return useQuery({
    queryKey: ["installmentContracts", params.CustomerId,
  params.ProviderId,
  params.OrderId,
  params.ContractStatus,
  params.Page,
  params.PageSize,],
    queryFn: () => getInstallmentContracts(params),
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5  
  });
};

export const useGetInstallmentContractByOrderId = (
  orderId: string,
) => {
  return useQuery({
    queryKey: ["installmentContracts", orderId],
    queryFn: () => getInstallmentContractByOrderId(orderId),
    refetchOnWindowFocus: false,
    enabled: !!orderId,
  });
};