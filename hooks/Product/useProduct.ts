import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/shared/api/product/product.api";
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductQuery,
} from "@/types/product/product";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  list: (params?: object) => [...PRODUCT_KEYS.all, "list", params] as const,
  detail: (id: string) => [...PRODUCT_KEYS.all, "detail", id] as const,
};

export const useGetProducts = (params: ProductQuery) =>
  useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => getProducts(params),
  });

export const useGetProductById = (id: string) =>
  useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductRequest) => createProduct(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProductRequest) => updateProduct(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(vars.id) });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
};