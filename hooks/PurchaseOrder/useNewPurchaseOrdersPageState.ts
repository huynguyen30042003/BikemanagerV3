"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import {
  DEBOUNCE_DELAY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { ProductVariantResponse } from "@/types/product/productVariants";
import { PurchaseOrderItemPreView } from "@/types/supplier/purchase-orders";
export function useNewPurchaseOrdersPageState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || DEFAULT_PAGE,
  );
  const [supplierId, setSupplierId] = useState<string>();
  const [warehouseId, setWarehouseId] = useState<string>();
  const [discount, setDiscount] = useState<number>(0);
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;
  const [listProductVariant, setListProductVariant] = useState<
    PurchaseOrderItemPreView[]
  >([]);

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: searchParams.get("search") || "",
  });

  // Sync state → URL
  useEffect(() => {
    const query = new URLSearchParams();

    if (searchTerm) query.set("search", searchTerm);
    if (status) query.set("orderStatus", status);
    query.set("page", page.toString());
    query.set("pageSize", pageSize.toString());

    router.replace(`${pathname}?${query.toString()}`);
  }, [searchTerm, page, pageSize, pathname, router]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };
  const handleSupplierId = (value: string) => {
    setSupplierId(value);
    setPage(DEFAULT_PAGE);
  };
  const handleWarehouseId = (value: string) => {
    setWarehouseId(value);
    setPage(DEFAULT_PAGE);
  };

  const handleAddProductVariantList = (value: ProductVariantResponse) => {
    setListProductVariant((prev) => {
      const exists = prev.some((x) => x.productVariantId === value.id);

      if (exists) {
        return prev.map((item) =>
          item.productVariantId === value.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          productVariantId: value.id,
          quantity: 1,
          unitPrice: value.importPrice || 0,
          sku: value.sku || "",
          productBrandName: value?.product?.brand?.name || "",
          stockQuantity: value?.stockQuantity || 1,
          productName: value?.product?.name || "",
          productCategoryName: value?.product?.category?.name || "",
          sellingPrice: value?.sellingPrice || 0,
        },
      ];
    });
  };

  const handleRemoveProductVariantList = (productVariantId: string) => {
    setListProductVariant((prev) =>
      prev.filter((x) => x.productVariantId !== productVariantId),
    );
  };

  const handleUnitPriceChange = (
    productVariantId: string,
    unitPrice: number,
  ) => {
    setListProductVariant((prev) =>
      prev.map((item) =>
        item.productVariantId === productVariantId
          ? {
              ...item,
              unitPrice,
            }
          : item,
      ),
    );
  };
  const handleQuantityChange = (productVariantId: string, quantity: number) => {
    setListProductVariant((prev) =>
      prev.map((item) =>
        item.productVariantId === productVariantId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  return {
    page, 
    setPage, 
    pageSize, 
    searchInput, 
    searchTerm, 
    handleSearch, 
    supplierId,
    handleSupplierId,
    warehouseId,
    handleWarehouseId,
    listProductVariant,
    handleAddProductVariantList,
    handleRemoveProductVariantList,
    handleUnitPriceChange,
    handleQuantityChange,
    discount, 
    setDiscount
  };
}
