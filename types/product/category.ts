export interface CategoryParentDto {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryDto {
  id: number;
  children?: CategoryDto[];
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
  isActive: boolean;
}

export interface CreateCategoryRequest {
  parentId?: number ;
  name: string;
  slug: string;
  imageUrl?: string | null;
  image?: File;
  description?: string;
  isActive?: boolean;
  sortOrder?: number
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: number;
  xoa: boolean
}
export interface DanhMucChungResponse {
  id: number;
  parentId: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sortOrder?: number
}
export interface CategoryQuery {
  search: string,
  parentId: number,
  page: number,
  pageSize: number
}