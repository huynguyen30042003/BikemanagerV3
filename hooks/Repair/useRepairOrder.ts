import { getRepairOrder } from "@/shared/api/repair";
import { repairOrderParams } from "@/types/repair";
import { useQuery } from "@tanstack/react-query";
type UseGetOrderOptions = {
  enabled?: boolean;
};
export const useGetRepairOrder = (
  params: repairOrderParams,
  options?: UseGetOrderOptions
) => {
  return useQuery({
    queryKey: ["order", params.CustomerId,
  params.Status,
  params.Page,
  params.PageSize,],
    queryFn: () => getRepairOrder(params),
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5  
  });
};