import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import api from "..";
import { brandReq, createBrandRequest, updateBrandRequest } from "@/types/product/brand";

export const getBrands = async (
  params: brandReq
) => {
  const token = getAccessToken();
  const queryParams = {
    ...(params.search && { search: params.search }),
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };

  const response = await api.get(
    `${APP_URL}/brands`,
    {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getBrandById = async (id: string) => {
  const token = getAccessToken();
  const response = await api.get(
    `${APP_URL}/brands/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export const createBrand = async (payload: createBrandRequest) => {
  const token = getAccessToken();
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("slug", payload.slug);
    formData.append("logoUrl", payload.logoUrl);
    formData.append("isActive", String(payload.isActive ?? false));
    formData.append("country", payload.country);
    
  const response = await api.post(
    `${APP_URL}/brands`, formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}


export const updateBrand = async (payload: updateBrandRequest) => {
  const token = getAccessToken();
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("slug", payload.slug);
    formData.append("isActive", String(payload.isActive ?? false));
    formData.append("country", payload.country);
    if (payload.logoUrl){
      formData.append("logoUrl", payload.logoUrl);
    }
  const response = await api.put(
    `${APP_URL}/brands/${payload.id}`, formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export const deleteBrand = async (id: string) => {
  const token = getAccessToken();
  const response = await api.delete(
    `${APP_URL}/brands/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}