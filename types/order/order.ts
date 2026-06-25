import { Customer } from "../customer";
import { ProductVariant } from "../product/productVariants";
import { SerialNumberResponse } from "../product/serialNumber";

export type orderParams = {
  Search?: string;
  CustomerId?: string;
  PaymentStatus?: string;
  OrderStatus?: string;
  FromDate?: string;
  ToDate?: string;
  Page?: number;
  PageSize?: number;
};
export interface orderRes {
  id: string;
  customerId: string;
  orderCode: string;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdBy: string;
  createdAt: string;
  customer: Customer
}

export type OrderItemResponse = {
  id?: string;
  orderId?: string;
  productVariantId?: string;
  serialNumberId?: string;
  quantity?: number;
  unitPrice?: number;
  discountAmount?: number;
  totalPrice?: number;
  order: orderRes;
  productVariant: ProductVariant;
  serialNumber?: SerialNumberResponse;
};
