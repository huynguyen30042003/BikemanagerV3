import { createBrand, deleteBrand, getBrandById, getBrands, updateBrand } from "@/shared/api/product/brand.api";
import { brandReq, createBrandRequest, updateBrandRequest } from "@/types/product/brand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetBrands = (params: brandReq) => {
  return useQuery({
    queryKey: ["admin-brand", params.search, params.page, params.pageSize],
    queryFn: () => getBrands(params),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export const useGetBrandById = (id?: string) => {
  return useQuery({
    queryKey: ["admin-brand", id],
    queryFn: () => getBrandById(id as string),
    enabled: !!id,
  });
};
export const useDeleteBrands = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand"] });
    },
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: createBrandRequest) => createBrand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand"] });
    },
  });
};
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: updateBrandRequest) => updateBrand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brand"] });
    },
  });
};