"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { UpdateInstallmentContractRequest } from "@/types/order/installment-contracts";
import { useGetInstallmentContractById, useUpdateInstallmentContract } from "../useInstallmentContracts";

export function useEditInstallmentProviderPageState() {
  const router = useRouter();
  const params = useParams();
  const installmentProviderId = params.id as string;
  const updateInstallmentProvider = useUpdateInstallmentContract();
  const { data: installmentProvider, isLoading } =
    useGetInstallmentContractById(installmentProviderId);

  const form = useForm<UpdateInstallmentContractRequest>({
    defaultValues: {
      id: installmentProviderId,
      ProviderId: "",
      ContractNumber: "",
      LoanAmount: 0,
      DownPayment: 0,
      InstallmentMonths: 0,
      MonthlyPayment: 0,
      InterestRate: 0,
      ContractStatus: "",
    },
  });

  useEffect(() => {
    if (!installmentProvider?.data) return;

    form.reset({
      id: installmentProviderId,
      ProviderId: installmentProvider.data.providerId ?? "",
      ContractNumber: installmentProvider.data.contractNumber ?? "",
      LoanAmount: installmentProvider.data.loanAmount ?? 0,
      DownPayment: installmentProvider.data.downPayment ?? 0,
      InstallmentMonths:installmentProvider.data.installmentMonths ?? 0,
      MonthlyPayment:installmentProvider.data.monthlyPayment ?? 0,
      InterestRate:installmentProvider.data.interestRate ?? 0,
      ContractStatus: installmentProvider.data.contractStatus ?? "",
    });
  }, [installmentProvider, form, installmentProviderId]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!data.ProviderId || !data.LoanAmount || !data.DownPayment || !data.InstallmentMonths || !data.MonthlyPayment || !data.InterestRate)  {
      alert("Vui lòng điền tất cả thông tin bắt buộc");
      return;
    }
    console.log(data);
    updateInstallmentProvider.mutate(data,{
      onSuccess:()=>{
         router.push("/admin/installment-contracts")
      }
    })
  });

  return {
    form,
    isLoading,
    handleSubmit,
  };
}