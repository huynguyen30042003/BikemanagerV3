import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import api from "..";
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductQuery,
} from "@/types/product/product";

export const getProducts = async (params: ProductQuery) => {
  const queryParams = {
    ...(params.search && { search: params.search }),
    ...(params.categoryId && { categoryId: params.categoryId }),
    ...(params.brandId && { brandId: params.brandId }),
    ...(params.isPublished !== undefined && { isPublished: params.isPublished }),
    ...(params.productType && { productType: params.productType }),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };

  const response = await api.get(`${APP_URL}/products`, {
    params: queryParams,
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

  return response.data;
};

export const getProductById = async (id: string) => {
  const token = getAccessToken();
  const response = await api.get(`${APP_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const createProduct = async (payload: CreateProductRequest) => {
  const token = getAccessToken();
  const formData = new FormData();

  formData.append("categoryId", payload.categoryId);
  formData.append("brandId", payload.brandId);
  formData.append("name", payload.name);
  formData.append("slug", payload.slug);
  formData.append("productType", payload.productType);
  formData.append("isPublished", String(payload.isPublished ?? false));

  if (payload.shortDescription) formData.append("shortDescription", payload.shortDescription);
  if (payload.description) formData.append("description", payload.description);
  if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail);

  const response = await api.post(`${APP_URL}/products`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateProduct = async (payload: UpdateProductRequest) => {
  const token = getAccessToken();
  const formData = new FormData();

  formData.append("categoryId", payload.categoryId);
  formData.append("brandId", payload.brandId);
  formData.append("name", payload.name);
  formData.append("slug", payload.slug);
  formData.append("productType", payload.productType);
  formData.append("isPublished", String(payload.isPublished ?? false));

  if (payload.shortDescription) formData.append("shortDescription", payload.shortDescription);
  if (payload.description) formData.append("description", payload.description);
  if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail);

  const response = await api.put(`${APP_URL}/products/${payload.id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteProduct = async (id: string) => {
  const token = getAccessToken();
  const response = await api.delete(`${APP_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};