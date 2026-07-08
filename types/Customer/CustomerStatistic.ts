import { Customer } from "./customer";

export interface CreateCustomerStatisticRequest {
	CustomerId: string;
	TotalOrders: number;
	TotalSpent: number;
	TotalRepairs: number;
	CustomerLevel: string;
	DiscountRate: number;
}

export interface UpdateCustomerStatisticRequest {
	TotalOrders: number;
	TotalSpent: number;
	TotalRepairs: number;
	CustomerLevel?: string;
	DiscountRate: number;
}

export interface CustomerStatisticResponse {
	customerId: string;
	totalOrders: number;
	totalSpent: number;
	totalRepairs: number;
	lastPurchaseAt: Date;
	customerLevel: string;
	discountRate: number;
	customer?: Customer
}

export interface CustomerStatisticQuery
 {
	Search?: string;
	CustomerLevel?: string;
	CustomerName?: string;
	Page?: number;
	PageSize?: number;
}
