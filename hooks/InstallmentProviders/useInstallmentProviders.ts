import { createInstallmentProvider, deleteInstallmentProvider, getInstallmentProvider, getInstallmentProvidersByOrderId, updateInstallmentProvider } from "@/shared/api/order/installment-provider";
import { CreateInstallmentProviderRequest, InstallmentProviderQuery, UpdateInstallmentProviderRequest } from "@/types/order/installment-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const INSTALLMENTPROVIDER_KEYS = {
  all: ["InstallmentProvider"] as const,
  list: (params?: object) => [...INSTALLMENTPROVIDER_KEYS.all, "list", params] as const,
  detail: (id: string) => [...INSTALLMENTPROVIDER_KEYS.all, "detail", id] as const,
};
export const useGetInstallmentProvider = (params: InstallmentProviderQuery) =>
  useQuery({
    queryKey: INSTALLMENTPROVIDER_KEYS.list(params),
    queryFn: () => getInstallmentProvider(params),
    refetchOnWindowFocus: false,
  });

export const useGetInstallmentProviderById = (id: string) =>
  useQuery({
    queryKey: INSTALLMENTPROVIDER_KEYS.detail(id),
    queryFn: () => getInstallmentProvidersByOrderId(id),
    refetchOnWindowFocus: false,
  });

export const useCreateInstallmentProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInstallmentProviderRequest) => createInstallmentProvider(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTALLMENTPROVIDER_KEYS.all });
    },
  });
};
export const useUpdateInstallmentProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateInstallmentProviderRequest) => updateInstallmentProvider(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: INSTALLMENTPROVIDER_KEYS.all });
      qc.invalidateQueries({ queryKey: INSTALLMENTPROVIDER_KEYS.detail(vars.id) });
    },
  });
};

export const useDeleteInstallmentProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInstallmentProvider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTALLMENTPROVIDER_KEYS.all });
    },
  });
};
