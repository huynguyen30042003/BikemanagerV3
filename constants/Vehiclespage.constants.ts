export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_MIN_PRICE = 500_000;
export const DEFAULT_MAX_PRICE = 50_000_000;
export const PRICE_STEP = 500_000;
export const DEBOUNCE_DELAY = 500;
 
export const SEARCH_BY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "SKU", label: "Mã sản phẩm" },
  { value: "Brand", label: "Thương hiệu" },
  { value: "Name", label: "Tên sản phẩm" },
  { value: "Color", label: "Màu sắc" },
  { value: "frame", label: "Số khung" },
] as const;
 