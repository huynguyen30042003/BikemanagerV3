import { InstallmentProviderResponse } from "./installment-provider";

export type installmentContractsParams = {
	ProviderId?: string;
	CustomerId?: string;
	OrderId?: string;
	ContractStatus?: string;
	Page?: number;
	PageSize?: number;
};
export interface InstallmentContractsRes {
	id: string;
	orderId: string;
	providerId: string;
	contractNumber: string;
	loanAmount: number;
	downPayment: number;
	installmentMonths: number;
	monthlyPayment: number;
	interestRate: number;
	contractStatus: string;
	installmentProvider: InstallmentProviderResponse;
}
export interface installmentProviderResponse {
	id: string;
	name: string;
	phone: string;
	apiEndpoint: string;
	isActive: boolean;
}
export interface installmentProviderByOrderIdResponse extends InstallmentContractsRes {
	installmentProvider: installmentProviderResponse;
}

interface BaseInstallmentContractRequest {
	ProviderId: string;
	ContractNumber: string;
	LoanAmount: number;
	DownPayment: number;
	InstallmentMonths: number;
	MonthlyPayment: number;
	InterestRate: number;
	ContractStatus: string;
}

export interface CreateInstallmentContractRequest extends BaseInstallmentContractRequest {
	OrderId: string;
}

export interface UpdateInstallmentContractRequest extends BaseInstallmentContractRequest {
	id: string;
}
