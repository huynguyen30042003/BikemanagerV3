"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrderDetailPageState } from "@/hooks/Order/Page/useOrderDetailPageState";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    completed: "Hoàn thành",
    pending: "Chờ xử lý",
    cancelled: "Đã hủy",
    paid: "Đã thanh toán",
    partial: "Thanh toán một phần",
    unpaid: "Chưa thanh toán",
    cash: "Tiền mặt",
    card: "Thẻ tín dụng",
    bank_transfer: "Chuyển khoản",
    installment: "Trả góp",
  };
  return labels[status] || status;
};

export default function OrderDetailPage() {
  const {
    orderData,
    isLoadingGetOrderByIdData,
    orderDetailData,
    isLoadingGetOrderDetailData,
    customer,
    contract,
    isLoadingContracts,
    isContract
  } = useOrderDetailPageState();
  console.log(contract);
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex gap-4 items-center">
        <Link href="/admin/orders" className="inline-block">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Chi tiết đơn hàng
          </h1>
          <p className="text-muted-foreground">Quản lý chi tiết đơn hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          {!isLoadingGetOrderByIdData && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Trạng thái đơn
                    </p>
                    <p className="font-medium capitalize">
                      {getStatusLabel(orderData?.orderStatus || "")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Trạng thái thanh toán
                    </p>
                    <p className="font-medium">
                      {getStatusLabel(orderData?.paymentStatus || "")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Phương thức thanh toán
                    </p>
                    <p className="font-medium">
                      {getStatusLabel(orderData?.paymentMethod || "")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày tạo</p>
                    <p className="font-medium">
                      {new Date(orderData?.createdAt || "").toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          {!isLoadingGetOrderDetailData && (
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết sản phẩm</CardTitle>
                <CardDescription>
                  {orderDetailData?.length || 0} mặt hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetailData && orderDetailData.length > 0 ? (
                    orderDetailData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {item.productVariant.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} ×{" "}
                            {formatCurrency(item.unitPrice || 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          {item?.discountAmount ||
                            (0 > 0 && (
                              <p className="text-xs text-red-600 line-through">
                                {formatCurrency(item?.discountAmount || 0)}
                              </p>
                            ))}
                          <p className="font-medium">
                            {formatCurrency(item?.totalPrice || 0)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Không có sản phẩm
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Installment Info */}
          {!isLoadingContracts && isContract && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin trả góp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  key={contract?.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Nhà cung cấp
                    </p>
                    <p className="font-medium">
                      {contract?.installmentProvider?.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Số hợp đồng
                      </p>
                      <p className="font-medium">{contract?.contractNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Trạng thái
                      </p>
                      <p className="font-medium capitalize">
                        {contract?.contractStatus}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Số tiền vay</p>
                      <p className="font-medium">
                        {formatCurrency(contract?.loanAmount || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trả trước</p>
                      <p className="font-medium">
                        {formatCurrency(contract?.downPayment || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lãi suất</p>
                      <p className="font-medium">{contract?.interestRate}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Số tháng</p>
                      <p className="font-medium">
                        {contract?.installmentMonths} tháng
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trả/tháng</p>
                      <p className="font-medium">
                        {formatCurrency(contract?.monthlyPayment || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Tên khách</p>
                    <p className="font-medium">{customer.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Điện thoại</p>
                    <p className="font-medium">{customer.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium text-sm">{customer.address}</p>
                  </div>
                  <Link
                    href={`/admin/customer/${customer.id}`}
                    className="mt-2 block"
                  >
                    <Button variant="outline" className="w-full">
                      Xem chi tiết
                    </Button>
                  </Link>
                </>
              ) : (
                <p>Không có thông tin</p>
              )}
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt giá</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Tiền hàng</p>
                <p className="font-medium">
                  {formatCurrency(orderData?.subTotal || 0)}
                </p>
              </div>
              {orderData?.discountAmount ||
                (0 > 0 && (
                  <div className="flex justify-between text-red-600">
                    <p>Giảm giá</p>
                    <p className="font-medium">
                      -{formatCurrency(orderData?.discountAmount || 0)}
                    </p>
                  </div>
                ))}
              <div className="flex justify-between">
                <p className="text-muted-foreground">Thuế VAT</p>
                <p className="font-medium">
                  {formatCurrency(orderData?.taxAmount || 0)}
                </p>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <p className="font-semibold">Tổng cộng</p>
                <p className="font-bold text-lg">
                  {formatCurrency(orderData?.totalAmount || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
