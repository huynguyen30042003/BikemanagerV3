import { CategoryDto } from "./category";
import { brandRes } from "./brand";

export type ProductType = "Bicycle" | "ElectricBike" | "Scooter" | "Other";

export interface ProductSimpleDto {
  id: string;
  categoryId: string;
  brandId: string;
  sku: string;
  barcode?: string | null;
  name: string;
  slug?: string;
  shortDescription?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  productType: ProductType;
  isPublished: boolean;
  category?: CategoryDto | null;
  brand?: brandRes | null;
  variants?: Variant[];
}

export interface CreateProductRequest {
  categoryId: string;
  brandId: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  thumbnail?: File | null;
  productType: string;
  isPublished: boolean;
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
  categoryId?: string;
  brandId?: string;
  isPublished?: boolean;
  productType?: ProductType;
  sortBy?: string;
  sortOrder?: string;
  page: number;
  pageSize: number;
}

export const PRODUCT_TYPES = [
  { value: "Bicycle", label: "Xe đạp", number: 1 },
  { value: "ElectricBicycle", label: "Xe đạp điện", number: 2 },
  { value: "Motorcycle", label: "Xe máy" , number: 3},
  { value: "ElectricMotorcycle", label: "Xe máy điện", number: 4 },
  { value: "Part", label: "Phụ Tùng" , number: 5},
  { value: "Accessory", label: "Phụ Kiện", number: 6},
] as const;