export interface PurchaseOrderResponse {
  id: string;
  code: string;
  supplierName: string;
  discountAmount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: PurchaseOrderItemResponse[];
}

export interface PurchaseOrderItemResponse {
  productVariantId: string;
  productVariantSKU: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  trackSerial: boolean;
}

export interface CreatePurchaseOrderRequest {
  supplierId: string;
  warehouseId: string;
  discountAmount: number;
  items: CreatePurchaseOrderItemRequest[];
}

export interface CreatePurchaseOrderItemRequest {
  productVariantId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderItemPreView {
  productVariantId: string;
  serialNumberId?: string;
  quantity: number;
  unitPrice: number;
  sku: string;
  productBrandName: string;
  stockQuantity: number;
  productName: string;
  productCategoryName: string;
  sellingPrice: number;
  trackSerial?: boolean;
	serialCode?: string;

}
export interface PurchaseOrderQuery {
  Keyword: string; //
  SupplierId?: string;
  WarehouseId?: string;
  Status?: string; //
  FromDate: string; //
  ToDate: string; //
  PageNumber: number; //
  PageSize: number; //
  SortBy?: string;
  Descending?: string;
}
export interface ReceivePurchaseOrderRequest {
  id: string;
  serials: ReceivedSerialRequest[];
}
export interface ReceivedSerialRequest {
  productVariantId: string;
  frameNumber?: string;
  engineNumber?: string;
  batterySerial?: string;
  motorSerial?: string;
}
export interface subReceivedSerial
  extends ReceivedSerialRequest, PurchaseOrderItemResponse {}

export interface FullPurchaseOrderRequest {
  frameNumber?: string;
  engineNumber?: string;
  batterySerial?: string;
  motorSerial?: string;
  productVariantId: string;
  productVariantSKU: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  trackSerial: boolean;
  rowKey: string;
  indexProductVariant?:number;
}