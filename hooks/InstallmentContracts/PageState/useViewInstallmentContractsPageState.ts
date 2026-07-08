"use client";

import { useParams } from "next/navigation";
import { useGetInstallmentContractById } from "../useInstallmentContracts";

export function useViewInstallmentContractsPageState() {
	const params = useParams();
	const contractId = params.id as string;
	const { data: installmentContract, isLoading } =
		useGetInstallmentContractById(contractId);

	return {
		contract: installmentContract?.data,
		provider: installmentContract?.data?.installmentProvider,
		order: installmentContract?.data?.order,
		isLoading,
	};
}
