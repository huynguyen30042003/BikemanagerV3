import { ProductVariantResponse } from "../product/productVariants";

export interface InventoryStockResponse {
	id: string;
	warehouseId: string;
	productVariantId: string;
	quantity: number;
	reservedQuantity: number;
	updatedAt: string;
	productVariant: ProductVariantResponse;
}

export interface CreateInventoryStockRequest {
	WarehouseId: string;
	ProductVariantId: string;
	Quantity: number;
	ReservedQuantity: number;
}

export interface InventoryStockQuery {
	WarehouseId?: string;
	ProductVariantId?: string;
	InStockOnly?: boolean;
	Page?: number;
	PageSize?: number;
}
