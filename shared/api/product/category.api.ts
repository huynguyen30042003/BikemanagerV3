import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import api from "..";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/product/category";

export const getCategories = async (params?: { search?: string }) => {
  const token = getAccessToken();
  const queryParams = { ...(params?.search && { search: params?.search }) };

  const response = await api.get(`${APP_URL}/categories/tree`, {
    params: queryParams,
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
};

export const getCategoryById = async (id: string) => {
  const token = getAccessToken();
  const response = await api.get(`${APP_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createCategory = async (payload: CreateCategoryRequest) => {
  const token = getAccessToken();
  const formData = new FormData();
  if (payload.parentId) formData.append("ParentId", payload.parentId);
  formData.append("Name", payload.name);
  formData.append("Slug", payload.slug);
  formData.append("IsActive", String(payload.isActive ?? false));

  const response = await api.post(`${APP_URL}/categories`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateCategory = async (payload: UpdateCategoryRequest) => {
  const token = getAccessToken();
  const formData = new FormData();
  if (payload.parentId) formData.append("ParentId", payload.parentId);
  formData.append("Name", payload.name);
  formData.append("Slug", payload.slug);
  formData.append("IsActive", String(payload.isActive ?? false));
  const response = await api.put(
    `${APP_URL}/categories/${payload.id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const deleteCategory = async (id: string) => {
  const token = getAccessToken();
  const response = await api.delete(`${APP_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
