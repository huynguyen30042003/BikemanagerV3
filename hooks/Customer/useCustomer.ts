import { createCustomers, getCustomers, getCustomersById, getCustomersByPhoneNumber, GetCustomersParams, getCustomersVehicleById } from "@/shared/api/customer.api";
import { CustomerReq, CustomerVehicleParams } from "@/types/customer";
import { useMutation, useQuery } from "@tanstack/react-query";
type UseGetOrderOptions = {
  enabled?: boolean;
};
export const useGetCustomers = (
  params?: GetCustomersParams,
) => {
  return useQuery({
    queryKey: ["Customers", params],

    queryFn: () => getCustomers(params),

    staleTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
  });
};

export const useCreateCustomer = () => {
    return useMutation({
    mutationFn: (formdata: CustomerReq) => createCustomers(formdata),
  });
}
export const useGetCustomersById = (
  id: string
) => {
  return useQuery({
    queryKey: ["Customers", id],
    queryFn: () => getCustomersById(id),
    staleTime: 1000 * 60 * 10,
    enabled: !!id,        
    refetchOnWindowFocus: false,
  });
};
export const useGetCustomersByPhoneNumber = () => {
    return useMutation({
    mutationFn: (phoneNumber: string) => getCustomersByPhoneNumber(phoneNumber),
  });
}
export const useGetCustomersVehicle = (
  params: CustomerVehicleParams,
  options?: UseGetOrderOptions

) => {
  return useQuery({
    queryKey: ["Customers-vehicle", params.CustomerId,
  params.Search,
  params.Page,
  params.PageSize,],
    queryFn: () => getCustomersVehicleById(params),
     enabled: !!params.CustomerId && (options?.enabled ?? true),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
};