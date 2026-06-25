import { ProductVariantResponse } from "./productVariants";

export type CurrentStatus = "SOLD" | "IN_STOCK";

export interface SerialNumberResponse {
	id: string;
	productVariantId: string;
	serialCode: string;
	frameNumber?: string;
	engineNumber?: string;
	batterySerial?: string;
	motorSerial?: string;
	qrCode?: string;
	manufacturingDate?: string;
	importDate?: string;
	warrantyStart?: string;
	warrantyEnd?: string;
	currentStatus: number;
	warehouseId?: string;
	productVariant?: ProductVariantResponse;
}

export interface CreateSerialNumberRequest {
	productVariantId: string;
	engineNumber?: string | null;
	batterySerial?: string | null;
	motorSerial?: string | null;
	qrCode?: string | null;
	manufacturingDate?: string | null;
	importDate?: string | null;
	warrantyStart?: string | null;
	warrantyEnd?: string | null;
	currentStatus?: CurrentStatus | null;
	warehouseId?: string | null;
}

export interface UpdateSerialNumberRequest extends CreateSerialNumberRequest {
	id: string;
}

export interface SerialNumberQuery {
	search?: string;
	searchBy?: string;
	productVariantId?: string;
	serialCode?: string;
	currentStatus?: CurrentStatus;
	warehouseId?: string;
	trackSerial?: boolean;
	page?: number;
	pageSize?: number;
}
