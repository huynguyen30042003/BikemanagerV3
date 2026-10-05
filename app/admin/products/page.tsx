"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
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
import { useGetDanhMucChung } from "@/hooks/Product/useCategory";
import { ProductSimpleDto } from "@/types/product/product";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { Column, Table } from "@/components/ui/Table";
import { DanhMucChungResponse } from "@/types/product/category";
import { SearchSelect } from "@/components/ui/selectSearch";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const router = useRouter();
  const [page] = useState(1);
  const [categoryId, setCategoryId] = useState<number>();
  const [toDelete, setToDelete] = useState<ProductSimpleDto | null>(null);

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: 400,
  });

  const { data: productsData } = useGetProducts({
    search: searchTerm,
    categoryId: categoryId,
    page,
    pageSize: 20,
  });
const { data: categoriesData, isLoading: isLoadingDanhMucChiTiet } = useGetDanhMucChung(
      {
        search: "",
        parentId: 4,
        page: 0,
        pageSize: 100,
      },
      true,
    );
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
      render: (val) => {
        const linkImage = val
          ? `https://localhost:5001${val}`
          : "";

        return linkImage ? (
          <Image
            src={linkImage}
            alt="thumb"
            className="h-10 w-10 rounded object-cover"
            width={40}
            height={40}
          />
        ) : (
          <div className="h-10 w-10 rounded bg-muted" />
        );
      },
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
          <div className="col-span-2 flex flex-col gap-1">
            <label>
              Loại sản phẩm
              <span className="text-red-600"> *</span>
            </label>
            {isLoadingDanhMucChiTiet ? (
              <Skeleton className="h-10 flex-1" />
            ) : (
              <SearchSelect
                options={categoriesData?.items?.map(
                    (prev: DanhMucChungResponse) => {
                      return { value: prev.id, label: prev.name };
                    },
                  )}
                value={categoryId}
                onChange={(id) => setCategoryId(+id)}
              />
            )}
          </div>
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