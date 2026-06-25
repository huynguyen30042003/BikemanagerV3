"use client";

import { useParams } from "next/navigation";
import { useGetOrderById, useGetOrderDetail } from "../useOrder";
import { useGetInstallmentContractByOrderId } from "../useInstallmentContracts";

export function useOrderDetailPageState() {
  const params = useParams();
  const orderId = params.id as string;

  const { data: orderDetailData, isLoading: isLoadingGetOrderDetailData } =
    useGetOrderDetail(orderId);
  const { data: orderByIdData, isLoading: isLoadingGetOrderByIdData } =
    useGetOrderById(orderId);
  const {
    data: installmentContractsRes,
    isLoading: isLoadinginstallmentContracts,
  } = useGetInstallmentContractByOrderId(orderId);
  return {
    orderData: orderByIdData?.data,
    isLoadingGetOrderByIdData,
    orderDetailData: orderDetailData?.items,
    isLoadingGetOrderDetailData,
    customer: orderByIdData?.data?.customer,
    contract: installmentContractsRes?.data,
    isContract: installmentContractsRes?.success,
    isLoadingContracts: isLoadinginstallmentContracts,
  };
}
