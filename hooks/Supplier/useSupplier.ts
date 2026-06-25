import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from "@/shared/api/supplier/suppliers.api";
import {
  CreateSupplierRequest,
  SupplierQuery,
  UpdateSupplierRequest,
} from "@/types/supplier/suppliers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SUPPLIER_KEYS = {
  all: ["Supplier"] as const,
  list: (params?: object) => [...SUPPLIER_KEYS.all, "list", params] as const,
  detail: (id: string) => [...SUPPLIER_KEYS.all, "detail", id] as const,
};
export const useGetSupplier = (params: SupplierQuery) =>
  useQuery({
    queryKey: SUPPLIER_KEYS.list(params),
    queryFn: () => getSuppliers(params),
    refetchOnWindowFocus: false,
  });

export const useGetSupplierById = (id: string) =>
  useQuery({
    queryKey: SUPPLIER_KEYS.detail(id),
    queryFn: () => getSupplierById(id),
    enabled: !!id,
  });

export const useCreateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSupplierRequest) => createSupplier(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
    },
  });
};
export const useUpdateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSupplierRequest) => updateSupplier(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.detail(vars.id) });
    },
  });
};

export const useDeleteSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
    },
  });
};
