export interface DashboardProduct {
  TotalStock: number;
  TotalSellingPrice: number;
}

export interface ProductParams {
  search?: string;
  searchBy?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface CategoryParent {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  parent: CategoryParent | null;
}

export interface Product {
  id: string;
  categoryId: string;
  brandId: string;
  sku: string;
  barcode: string;
  name: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string | null;
  productType: number;
  category: Category;
  brand: Brand;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color: string;
  battery: string;
  motorPower: string;
  importPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  stockQuantity: number;
  warrantyMonths: number;
  product: Product;
}
import { ProductSimpleDto } from "./product";

export interface ProductVariantResponse {
  id: string;
  productId: string;
  sku: string;
  color?: string | null;
  battery?: string | null;
  motorPower?: string | null;
  importPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  stockQuantity: number;
  warrantyMonths: number;
  trackSerial: boolean;
  product?: ProductSimpleDto | null;
}

export interface CreateProductVariantRequest {
  productId: string;
  color?: string | null;
  battery?: string | null;
  motorPower?: string | null;
  importPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  stockQuantity: number;
  warrantyMonths: number;
}

export interface UpdateProductVariantRequest extends CreateProductVariantRequest {
  id: string;
}

export interface ProductVariantQuery {
  trackSerial?: boolean;
  search?: string;
  searchBy?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  pageSize: number;
}
export const vehicleColorMap: Record<string, string> = {
  // Đen
  "đen": "bg-black",
  "đen bóng": "bg-black",
  "đen nhám": "bg-zinc-800",

  // Trắng
  "trắng": "bg-white border",

  // Xám
  "xám": "bg-gray-500",
  "xám bạc": "bg-slate-400",
  "xám xanh": "bg-slate-500",

  // Xanh
  "xanh": "bg-blue-500",
  "xanh dương": "bg-blue-600",
  "xanh navy": "bg-blue-900",
  "xanh lá": "bg-green-600",
  "xanh rêu": "bg-emerald-700",

  // Đỏ
  "đỏ": "bg-red-600",
  "đỏ đô": "bg-red-900",

  // Vàng
  "vàng": "bg-yellow-400",
  "vàng đồng": "bg-amber-700",

  // Cam
  "cam": "bg-orange-500",

  // Tím
  "tím": "bg-purple-600",

  // Hồng
  "hồng": "bg-pink-500",

  // Nâu
  "nâu": "bg-amber-900",

  // Bạc
  "bạc": "bg-zinc-300",
};