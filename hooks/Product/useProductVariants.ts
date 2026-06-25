import {
  getProductDashboard,
  getProductListDashboard,
  getProductVariants,
  getProductVariantById,
  getVariantsByProductId,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "@/shared/api/product/product-variants.api";
import {
  ProductParams,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  ProductVariantQuery,
} from "@/types/product/productVariants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetProductsDashboard = () => {
  return useQuery({
    queryKey: ["ProductsDashboard"],
    queryFn: getProductDashboard,
  });
};
export const useGetProductsListDashboard = (params: ProductParams) => {
  return useQuery({
    queryKey: ["ProductsListDashboard", params],
    queryFn: () => getProductListDashboard(params),
    staleTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
  });
};
export const VARIANT_KEYS = {
  all: ["product-variants"] as const,
  list: (params?: object) => [...VARIANT_KEYS.all, "list", params] as const,
  byProduct: (productId: string) =>
    [...VARIANT_KEYS.all, "by-product", productId] as const,
  detail: (id: string) => [...VARIANT_KEYS.all, "detail", id] as const,
};
export const PRODUCT_KEYS = {
  all: ["products"] as const,
  list: (params?: object) => [...PRODUCT_KEYS.all, "list", params] as const,
  detail: (id: string) => [...PRODUCT_KEYS.all, "detail", id] as const,
};
export const useGetProductVariants = (params: ProductVariantQuery) =>
  useQuery({
    queryKey: VARIANT_KEYS.list(params),
    queryFn: () => getProductVariants(params),
  });

export const useGetVariantsByProductId = (productId: string) =>
  useQuery({
    queryKey: VARIANT_KEYS.byProduct(productId),
    queryFn: () => getVariantsByProductId(productId),
    enabled: !!productId,
  });

export const useGetProductVariantById = (id: string) =>
  useQuery({
    queryKey: VARIANT_KEYS.detail(id),
    queryFn: () => getProductVariantById(id),
    enabled: !!id,
  });

export const useCreateProductVariant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductVariantRequest) =>
      createProductVariant(body),
    onSuccess: (_data) => {
      qc.invalidateQueries({ queryKey: VARIANT_KEYS.all });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
};

export const useUpdateProductVariant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProductVariantRequest) =>
      updateProductVariant(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: VARIANT_KEYS.all });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(vars.productId) });
      qc.invalidateQueries({ queryKey: VARIANT_KEYS.detail(vars.id) });
    },
  });
};

export const useDeleteProductVariant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductVariant(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: VARIANT_KEYS.all });
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    }
  });
};
