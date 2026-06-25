"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useWarehousesPageState } from "@/hooks/Warehouses/PageState/useWarehousesPageState";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import { WarehouseResponse } from "@/types/inventory/warehouse";
import { Column, Table } from "@/components/ui/Table";

export default function WarehousesPage() {
  const {
    page,
    setPage,
    searchInput,
    handleSearch,
    warehouseData,
    handleConfirmDelete,
    isOpenDelete,
    setIsOpenDelete,
    deleteWarehouse,
    handleDeleteform,
  } = useWarehousesPageState();
  const columns: Column<WarehouseResponse>[] = [
    {
      key: "name",
      title: "Nhà phân phối",
      classNameHeader: "text-left",
    },
    {
      key: "code",
      title: "Mã",
      classNameHeader: "text-left",
      classNameItem: "text-left",
    },
    {
      key: "address",
      title: "Địa chỉ",
      classNameHeader: "text-left",
    },
    {
      key: "actions",
      title: "Hành động",
      classNameHeader: "text-center",
      classNameItem: "text-center",
      render: (_value, row) => (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/warehouses/${row.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit2 size={16} />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteform(row)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kho hàng</h1>
          <p className="text-muted-foreground">
            Quản lý kho hàng và hàng tồn kho
          </p>
        </div>
        <Link href="/admin/warehouses/new">
          <Button>
            <Plus size={18} className="mr-2" />
            Thêm kho hàng
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng kho hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {warehouseData?.totalItems}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm kho hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Tìm theo tên hoặc mã kho..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách kho hàng</CardTitle>
          <CardDescription>
            {warehouseData?.totalItems} kho hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <div className="">
              {(warehouseData?.items?.length ?? 0) > 0 ? (
                <div className="overflow-x-auto">
                  <Table<WarehouseResponse>
                    showIndex
                    data={warehouseData?.items ?? []}
                    columns={columns}
                  />
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Không tìm thấy nhà cung cấp nào
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
              <div>
                Trang {page} / {warehouseData?.totalPages}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>

                {Array.from(
                  { length: warehouseData?.totalPages ?? 1 },
                  (_, index) => index + 1,
                ).map((currentPage) => (
                  <Button
                    key={currentPage}
                    type="button"
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setPage(currentPage)}
                  >
                    {currentPage}
                  </Button>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  disabled={page === warehouseData?.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={isOpenDelete}
        onOpenChange={setIsOpenDelete}
        variant="delete"
        title="Xóa purchase-order"
        description={`Bạn có chắc muốn xóa ngân hàng này không?`}
        confirmText="Xóa"
        loading={deleteWarehouse.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
