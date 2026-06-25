export interface CreateWarehouseRequest {
  BranchId: string,
  Name: string,
  Address?: string,
}
export interface WarehouseQuery {
  Search?: string,
  BranchId?: boolean,
  Page: number,
  PageSize: number,
}
export interface WarehouseResponse {
  id: string,
  branchId: string,
  branch?: brandRes,/////////////////////////////
  name: string,
  code: string,
  address?: string,
  createdAt: string,
}
export interface brandRes {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;}
export interface UpdateWarehouseRequest {
  Name: string,
  Address?: string,
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