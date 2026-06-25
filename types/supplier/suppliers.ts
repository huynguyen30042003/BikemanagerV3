export interface CreateSupplierRequest {
  Name: string,
  Phone: string,
  Email?: string,
  Address?: string,
  TaxCode?: string,
  ContactPerson?: string,
}
export interface SupplierQuery {
  Keyword?: string,
  IsActive?: boolean,
  PageNumber?: number,
  PageSize?: number,
  SortBy?: string,
  Descending?: boolean,
}
export interface SupplierResponse {
  id: string,
  code: string,
  name: string,
  phone: string,
  email?: string,
  taxCode?: string,
  address?: string,
  isActive?: string,
  contactPerson?: string
}
export interface UpdateSupplierRequest {
  id: string,
  Name: string,
  Phone: string,
  Email?: string,
  Address?: string,
  TaxCode?: string,
  ContactPerson?: string,
}
export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface ItemResult<T> {
  success: string;
  message: string;
  errors: string | null;
  data: T;
}