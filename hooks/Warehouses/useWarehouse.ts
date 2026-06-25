import { createWarehouse, deleteWarehouse, getWarehouse, getWarehouseById } from "@/shared/api/inventory/warehouse";
import { CreateWarehouseRequest, WarehouseQuery } from "@/types/inventory/warehouse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const WAREHOUSE_KEYS = {
  all: ["Warehouse"] as const,
  list: (params?: object) => [...WAREHOUSE_KEYS.all, "list", params] as const,
  detail: (id: string) => [...WAREHOUSE_KEYS.all, "detail", id] as const,
};
export const useGetWarehouse = (params: WarehouseQuery) =>
  useQuery({
    queryKey: WAREHOUSE_KEYS.list(params),
    queryFn: () => getWarehouse(params),
    refetchOnWindowFocus: false,
  });

export const useGetWarehouseById = (id: string) =>
  useQuery({
    queryKey: WAREHOUSE_KEYS.detail(id),
    queryFn: () => getWarehouseById(id),
    enabled: !!id,
  });

export const useCreateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateWarehouseRequest) =>
      createWarehouse(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WAREHOUSE_KEYS.all });
    },
  });
};

export const useDeleteWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WAREHOUSE_KEYS.all });
    },
  });
};