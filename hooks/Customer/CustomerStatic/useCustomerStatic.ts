import { getCustomerStatistic } from "@/shared/api/customer/customerStatic.api";
import { CustomerStatisticQuery } from "@/types/Customer/CustomerStatistic";
import { useQuery } from "@tanstack/react-query";

export const CUSTOMERSTATIC_KEYS = {
  all: ["CustomerStatic"] as const,
  list: (params?: object) => [...CUSTOMERSTATIC_KEYS.all, "list", params] as const,
  detail: (id: string) => [...CUSTOMERSTATIC_KEYS.all, "detail", id] as const,
};

export const useGetCustomersStatic = (
  params: CustomerStatisticQuery,
) => {
  return useQuery({
    queryKey:  CUSTOMERSTATIC_KEYS.list(params),
    queryFn: () => getCustomerStatistic(params),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
