import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/shared/api/product/category.api"
import { CreateCategoryRequest, UpdateCategoryRequest } from "@/types/product/category";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  list: (params?: object) => [...CATEGORY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...CATEGORY_KEYS.all, "detail", id] as const,
};

export const useGetCategories = (params?: {
  search?: string;
}) =>
  useQuery({
    queryKey: CATEGORY_KEYS.list(params),
    queryFn: () => getCategories(params),
    staleTime: 1000 * 60 * 10,

  });

export const useGetCategoryById = (id: string) =>
  useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => createCategory(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateCategoryRequest) => updateCategory(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.detail(vars.id) });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all }),
  });
};