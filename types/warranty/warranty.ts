export interface CreateWarrantyDto {
	SerialNumberId: string;
	CustomerId: string;
	OrderId: string;
	StartDate: Date;
	EndDate: Date;
	Status: string;
}

export interface UpdateWarrantyDto {
	StartDate: Date;
	EndDate: Date;
	Status: string;
}

export interface WarrantyResponse {
	id: string;
	serialNumberId: string;
	customerId: string;
	orderId: string;
	startDate: Date;
	endDate: Date;
	status: string;
}

export interface WarrantyQuery {
	Page?: number;
	PageSize?: number;
	CustomerId?: string;
	OrderId?: string;
	SerialNumberId?: string;
	Status?: string;
	StartDate?: Date;
	EndDate?: Date;
}
