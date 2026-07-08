import { getAccessToken } from "@/lib/auth";
import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { CustomerReq, CustomerVehicleParams } from "@/types/Customer/customer";

export interface GetCustomersParams {
  search?: string;
  searchBy?: string;
  page?: number;
  pageSize?: number;
}

export const getCustomers = async (
  params?: GetCustomersParams,
) => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/customers`,
    {
      params: {
      search: params?.search,
      searchBy: params?.searchBy,
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      },

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    },
  );

  return response.data.data;
};
export const createCustomers = async (formdata: CustomerReq) => {
  const token = getAccessToken();

  const response = await api.post(
    `${APP_URL}/customers`, formdata
    ,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    },
  );

  return response.data.data;
};

export const getCustomersById = async (
  id: string,
) => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/customers/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    },
  );

  return response.data.data;
};
export const getCustomersByPhoneNumber = async (
  phoneNumber: string,
) => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/customers/phoneNumber/${phoneNumber}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    },
  );

  return response.data;
};
export const getCustomersVehicleById = async (
  params: CustomerVehicleParams,
) => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/customer-vehicles`,
    {
      params: {
        Search: params?.Search,
        CustomerId: params?.CustomerId,
        Page: params?.Page || 1,
        PageSize: params?.PageSize || 10,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    },
  );

  return response.data.data;
};