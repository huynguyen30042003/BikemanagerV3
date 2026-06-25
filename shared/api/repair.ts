import { getAccessToken } from "@/lib/auth";
import api from ".";
import { APP_URL } from "../constants/apiConstants";
import { repairOrderParams } from "@/types/repair";

export const getRepairOrder = async (
  params: repairOrderParams,
) => {
  const token = getAccessToken();

  const response = await api.get(
    `${APP_URL}/repair-orders`,
    {
      params: {
        CustomerId: params?.CustomerId,
        Status: params?.Status,
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