"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import { toast } from "sonner";

import { useGetProducts, useDeleteProduct } from "@/hooks/Product/useProduct";
import { useGetCategories } from "@/hooks/Product/useCategory";
import { PRODUCT_TYPES, ProductSimpleDto, ProductType } from "@/types/product/product";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { Column, Table } from "@/components/ui/Table";
import { Image } from "@/components/ui/image";
import { CategoryDto } from "@/types/product/category";
import { BE_URL } from "@/shared/constants/apiConstants";

export default function ProductsPage() {
  const router = useRouter();
  const [page] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [productType, setProductType] = useState<ProductType | "all">("all");
  const [toDelete, setToDelete] = useState<ProductSimpleDto | null>(null);

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: 400,
  });

  const { data: productsData } = useGetProducts({
    search: searchTerm,
    categoryId: categoryId === "all" ? undefined : categoryId,
    productType: productType === "all" ? undefined : productType,
    page,
    pageSize: 20,
  });

  const { data: categoriesData } = useGetCategories();
  const categories = categoriesData?.items ?? [];
  const products = productsData?.items ?? [];

  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();

  const onDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteProduct(toDelete.id);
      toast.success("Xóa sản phẩm thành công");
      setToDelete(null);
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const columns: Column<ProductSimpleDto>[] = [
    {
      key: "thumbnailUrl",
      title: "Ảnh",
      render: (val) =>
        val ? (
          <Image src={`${BE_URL}/${val}`} alt="thumb" className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="h-10 w-10 rounded bg-muted" />
        ),
    },
    { key: "name", title: "Tên sản phẩm", classNameHeader: "text-left" },
    { key: "sku", title: "SKU", classNameHeader: "text-left" },
    {
      key: "category",
      title: "Danh mục",
      classNameHeader: "text-left",
      accessor: (row) => row.category?.name ?? "—",
    },
    {
      key: "brand",
      title: "Thương hiệu",
      classNameHeader: "text-left",
      accessor: (row) => row.brand?.name ?? "—",
    },
    {
      key: "productType",
      title: "Loại",
      render: (val) => (
        <Badge variant="outline">
          {PRODUCT_TYPES.find((t) => t.number === val)?.label ?? val}
        </Badge>
      ),
    },
    {
      key: "isPublished",
      title: "Trạng thái",
      classNameItem: "text-center",
      render: (val) => (
        <Badge variant={val ? "default" : "secondary"}>
          {val ? "Đã đăng" : "Nháp"}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameItem: "text-center",
      render: (_val, row) => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/admin/products/${row.id}`)}
          >
            <Eye size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/admin/products/${row.id}/edit`)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setToDelete(row)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý danh sách sản phẩm</p>
        </div>
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus size={16} className="mr-1" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-4">
          <div className="relative flex-1 min-w-50">
            <Search
              className="absolute left-3 top-2.5 text-muted-foreground"
              size={16}
            />
            <Input
              className="pl-9"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((c: CategoryDto) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table<ProductSimpleDto>
            showIndex
            data={products}
            columns={columns}
          />
        </CardContent>
      </Card>

      {/* Delete Confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa sản phẩm <strong>{toDelete?.name}</strong>? Tất cả variant và
              serial liên quan cũng sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}