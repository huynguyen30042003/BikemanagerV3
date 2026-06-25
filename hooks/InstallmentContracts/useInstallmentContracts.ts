import { createInstallmentContract, deleteInstallmentContract, getInstallmentContractById, getInstallmentContracts, updateInstallmentContract } from "@/shared/api/order/installment-contracts.api";
import { CreateInstallmentContractRequest, installmentContractsParams, UpdateInstallmentContractRequest } from "@/types/order/installment-contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const INSTALLMENTCONTRACT_KEYS = {
  all: ["InstallmentContract"] as const,
  list: (params?: object) => [...INSTALLMENTCONTRACT_KEYS.all, "list", params] as const,
  detail: (id: string) => [...INSTALLMENTCONTRACT_KEYS.all, "detail", id] as const,
};
export const useGetInstallmentContracts = (params: installmentContractsParams) =>
  useQuery({
    queryKey: INSTALLMENTCONTRACT_KEYS.list(params),
    queryFn: () => getInstallmentContracts(params),
    refetchOnWindowFocus: false,
  });

export const useGetInstallmentContractById = (id: string) =>
  useQuery({
    queryKey: INSTALLMENTCONTRACT_KEYS.detail(id),
    queryFn: () => getInstallmentContractById(id),
    refetchOnWindowFocus: false,
  });

export const useCreateInstallmentContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInstallmentContractRequest) => createInstallmentContract(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTALLMENTCONTRACT_KEYS.all });
    },
  });
};
export const useUpdateInstallmentContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateInstallmentContractRequest) => updateInstallmentContract(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: INSTALLMENTCONTRACT_KEYS.all });
      qc.invalidateQueries({ queryKey: INSTALLMENTCONTRACT_KEYS.detail(vars.id) });
    },
  });
};

export const useDeleteInstallmentContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInstallmentContract(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTALLMENTCONTRACT_KEYS.all });
    },
  });
};
