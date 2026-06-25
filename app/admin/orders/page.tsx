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
import { Trash2, Eye, Plus, Pencil } from "lucide-react";
import { useGetOrder } from "@/hooks/Order/useOrder";
import { useOrderPageState } from "@/hooks/Order/useOrderPageState";
import { Column, Table } from "@/components/ui/Table";
import { orderRes } from "@/types/order/order";
import { useRouter } from "next/navigation";
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function OrdersPage() {  
  const router = useRouter();

  const {
    page,
    setPage,
    pageSize,
    searchInput,
    searchTerm,
    handleSearch,
    paymentStatus,
    handlePaymentStatus,
    orderStatus,
    handleOrderStatus,
    toDate,
    handleToDate,
    fromDate,
    handleFromDate,
  } = useOrderPageState();
  const { data: orders, isLoading: isLoadingOrder } = useGetOrder({
    Search: searchTerm,
    PaymentStatus: paymentStatus,
    OrderStatus: orderStatus,
    FromDate: fromDate,
    ToDate: toDate,
    Page: page,
    PageSize: pageSize,
  });
  const stats = {
    totalOrders: orders?.totalItems,
    completedOrders: (orders?.items ?? []).filter(
      (o: orderRes) => o.orderStatus === "Completed",
    ).length,
    totalRevenue: (orders?.items ?? []).reduce(
      (sum: number, o: orderRes) => sum + Number(o.totalAmount ?? 0),
      0,
    ),
    pendingOrders: (orders?.items ?? []).filter(
      (o: orderRes) => (o as orderRes).orderStatus === "Pending",
    ).length,
  };
  const today = new Date().toISOString().split("T")[0];
  const paymentStatusMap: Record<string, string> = {
    Completed: "Hoàn thành",
    Refunded: "Hoàn tiền",
    Paid: "Đã thanh toán",
    Partial: "Thanh toán một phần",
  };
   const paymentMethodMap: Record<string, string> = {
    Cash: "Tiền mặt",
    Installment: "Trả góp",
  };
  
  const columnsOrder: Column<orderRes>[] = [
    {
      key: "orderCode",
      title: "Code",
      classNameHeader: "text-left",
    },
    {
      key: "orderStatus",
      title: "Trạng thái",
      classNameHeader: "text-left",
      render: (_value, row) => (
        <p>{row?.orderStatus === "Completed" ? "Hoàn thành" : ""}</p>
      ),
    },
    {
      key: "totalAmount",
      title: "Tổng thanh toán",
      classNameHeader: "text-left",
    },
    {
      key: "paymentMethod",
      title: "Phương thức thanh toán",
      classNameHeader: "text-left",
      render: (_value, row) => (
        <p>{paymentMethodMap[row.paymentMethod] ?? row.paymentMethod}</p>
      )
    },
    {
      key: "paymentStatus",
      title: "Thanh toán",
      classNameHeader: "text-left",
      render: (_value, row) => (
        <p>{paymentStatusMap[row.paymentStatus] ?? row.paymentStatus}</p>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày mua",
      classNameHeader: "text-left",
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
            onClick={() => router.push(`/admin/orders/${row.id}`)}
          >
            <Eye size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/admin/orders/${row.id}/edit`)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            // onClick={() => setToDelete(row)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];
  if (isLoadingOrder) return <>loading...</>;
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Đơn hàng</h1>
          <p className="text-muted-foreground">Quản lý tất cả đơn hàng</p>
        </div>
        <Link href="/orders/new">
          <Button className="gap-2">
            <Plus size={18} />
            Tạo đơn hàng
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chờ xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue).split(" ")[0]}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Mã đơn hàng
              </label>
              <Input
                placeholder="Tìm kiếm..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Từ ngày</label>

              <div className="relative ">
                <Input
                  max={toDate || today}
                  type="date"
                  value={fromDate}
                  onChange={(e) => handleFromDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Đến ngày</label>

              <div className="relative">
                <Input
                  max={today}
                  type="date"
                  value={toDate}
                  onChange={(e) => handleToDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Trạng thái đơn
              </label>
              <select
                value={orderStatus}
                onChange={(e) => handleOrderStatus(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Tất cả</option>
                <option value="Pending">Chờ xử lý</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Trạng thái thanh toán
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => handlePaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Tất cả</option>
                <option value="Paid">Đã thanh toán</option>
                <option value="Partial">Một phần</option>
                <option value="Unpaid">Chưa thanh toán</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>{orders?.totalItems} đơn hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table<orderRes>
              showIndex
              data={orders?.items ?? []}
              columns={columnsOrder}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3 border-t px-4 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          Trang {page} / {orders?.totalPages}
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
            { length: orders?.totalPages },
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
            disabled={page === orders?.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
