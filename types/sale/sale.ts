export interface CreateSaleOrderRequest {
  PaymentMethod: string;
  Customer: CustomerInfoRequest;
  Items: CreateSaleOrderItemRequest[];
}

export interface CreateSaleOrderItemRequest {
  ProductVariantId: string;
  SerialNumberId?: string;
  Quantity: number;
  UnitPrice: number;
  DiscountAmount: number;
}

export interface CustomerInfoRequest {
  PhoneNumber: string;
  FullName: string;
  Email: string;
  Address: string;
}
export interface CreateInstallmentOrderRequest extends CreateSaleOrderRequest {
  ProviderId: string;
  downPayment: number;
  loanAmount: number;
  installmentMonths: number;
  interestRate: number;
}
