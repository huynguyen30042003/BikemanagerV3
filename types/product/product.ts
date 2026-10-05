import { CategoryDto } from "./category";
import { brandRes } from "./brand";


export interface ProductSimpleDto {
  id: string;
  categoryId: number;
  brandId: string;
  sku: string;
  barcode?: string | null;
  name: string;
  slug?: string;
  shortDescription?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  isVerhicle: boolean
  isPublished: boolean;
  category?: CategoryDto | null;
  brand?: brandRes | null;
  variants?: Variant[];
}

export interface CreateProductRequest {
  categoryId: number;
  brandId: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  thumbnail?: File | null;
  isPublished: boolean;
  isVerhicle: boolean
}
export interface Variant {
  id?: string;
  sku?: string;
  importPrice?: number;
  sellingPrice?: number;
  stockQuantity?: number;
}
export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
}

export interface ProductQuery {
  search?: string;
  categoryId?: number;
  brandId?: string;
  isPublished?: boolean;
  sortBy?: string;
  sortOrder?: string;
  page: number;
  pageSize: number;
}