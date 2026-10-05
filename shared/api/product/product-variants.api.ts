import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import api from "..";
import { CreateProductVariantRequest, ProductParams, ProductVariantQuery, ProductVariantResponse, UpdateProductVariantRequest } from "@/types/product/productVariants";
import { PagedResult } from "@/types";

export const getProductDashboard = async () => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/product-variants/productDashboard`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const getProductListDashboard = async (
  params: ProductParams
) => {
  const token = getAccessToken();

  const queryParams = {
    ...(params.search && { search: params.search }),
    ...(params.searchBy && { searchBy: params.searchBy }),
    ...(params.minPrice != null && { minPrice: params.minPrice }),
    ...(params.maxPrice != null && { maxPrice: params.maxPrice }),
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };

  const response = await api.get(
    `${APP_URL}/product-variants`,
    {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getProductVariants = async (params: ProductVariantQuery):Promise<PagedResult<ProductVariantResponse>> => {
  const token = getAccessToken();
  const queryParams = {
    ...(params.search && { search: params.search }),
    ...({trackSerial: params.trackSerial }),
    ...(params.searchBy && { searchBy: params.searchBy }),
    ...(params.minPrice !== undefined && { minPrice: params.minPrice }),
    ...(params.maxPrice !== undefined && { maxPrice: params.maxPrice }),
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };
 
  const response = await api.get(`${APP_URL}/product-variants`, {
    params: queryParams,
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return response.data;
};
 
export const getProductVariantById = async (id: string) => {
  const token = getAccessToken();
  const response = await api.get(`${APP_URL}/product-variants/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return response.data;
};
 
export const getVariantsByProductId = async (productId: string) => {
  const token = getAccessToken();
  const response = await api.get(
    `${APP_URL}/product-variants/${productId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
 
  return response.data;
};
 
export const createProductVariant = async (
  payload: CreateProductVariantRequest,
) => {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("ProductId", payload.productId);
  formData.append("Color", payload?.color ?? "");
  formData.append("Battery", payload.battery ?? "");
  formData.append("MotorPower", payload.motorPower ?? "");
  formData.append("ImportPrice", payload.importPrice.toString());
  formData.append("SellingPrice", payload.sellingPrice.toString());
  formData.append("WholesalePrice", payload.wholesalePrice.toString());
  formData.append("StockQuantity", payload.stockQuantity.toString());
  formData.append("WarrantyMonths", payload.warrantyMonths.toString());
  if (payload.Image) formData.append("Image", payload.Image);
  const response = await api.post(`${APP_URL}/product-variants`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
   },
  });
 
  return response.data;
};
 
export const updateProductVariant = async (
  payload: UpdateProductVariantRequest,
) => {
  const token = getAccessToken();
  const response = await api.patch(
    `${APP_URL}/product-variants/${payload.id}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
 
  return response.data;
};
 
export const deleteProductVariant = async (id: string) => {
  const token = getAccessToken();
  const response = await api.delete(`${APP_URL}/product-variants/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return response.data;
};