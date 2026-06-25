"use client";

import { useRouter, useParams } from "next/navigation";
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
import {
  useApprovePurchaseOrder,
  useCancelPurchaseOrder,
  useGetPurchaseOrderById,
} from "@/hooks/PurchaseOrder/usePurchaOrder";
import { PurchaseOrderItemResponse } from "@/types/supplier/purchase-orders";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function EditPOPage() {
  const router = useRouter();
  const params = useParams();
  const poId = params.id as string;

  const { data: PurchaseOrder, isLoading: isLoadingPurchaseOrder } =
    useGetPurchaseOrderById(poId);
  const cancelPurchaseOrder = useCancelPurchaseOrder();
  const approvePurchaseOrder = useApprovePurchaseOrder();
  const handleCancelPurchaseOrder = () => {
    try {
      cancelPurchaseOrder.mutateAsync(poId, {
        onSuccess: (data) => {
          if (data.success) {
            router.push("/admin/purchase-orders");
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleApprovePurchaseOrder = () => {
    try {
      approvePurchaseOrder.mutateAsync(poId, {
        onSuccess: (data) => {
          if (data.success) {
            router.push("/admin/purchase-orders");
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoadingPurchaseOrder) {
    return <div className="p-8">Đang tải...</div>;
  }

  if (!PurchaseOrder) {
    return <div className="p-8">Không tìm thấy đơn mua hàng</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/purchase-orders">
          <Button variant="outline" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Chỉnh sửa đơn mua hàng
          </h1>
          <p className="text-muted-foreground">{PurchaseOrder?.data?.code}</p>
        </div>
      </div>

      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Mã đơn</label>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="font-medium">{PurchaseOrder?.data?.code}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Nhà cung cấp</label>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="font-medium">
                  {PurchaseOrder?.data?.supplierName}
                </p>
                {/* <p className="text-xs text-muted-foreground">{supplier?.email}</p> */}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Ngày tạo</label>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="font-medium">
                  {new Date(PurchaseOrder?.data?.createdAt).toLocaleDateString(
                    "vi-VN",
                  )}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Trạng thái</label>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="font-medium">{PurchaseOrder?.data?.status}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết sản phẩm</CardTitle>
          <CardDescription>
            {PurchaseOrder?.data?.items.length} sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Sản phẩm</th>
                  <th className="text-right py-3 px-4 font-medium">Số lượng</th>
                  <th className="text-right py-3 px-4 font-medium">Đơn giá</th>
                  <th className="text-right py-3 px-4 font-medium">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {PurchaseOrder?.data?.items.map(
                  (item: PurchaseOrderItemResponse, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.productVariantSKU}
                          </p>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">{item.quantity}</td>
                      <td className="text-right py-3 px-4">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(item.totalAmount)}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="max-w-md ml-auto">
        <CardContent className="space-y-4">
          <div className="flex justify-between text-md font-bold">
            <span>Giảm Giá</span>
            <span className="w-25 text-right">
              {formatCurrency(PurchaseOrder?.data?.discountAmount)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng giá trị</span>
            <span className="text-primary">
              {formatCurrency(PurchaseOrder?.data?.totalAmount)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        {PurchaseOrder?.data?.status == "Draft" && (
          <Button className="flex-1" onClick={handleApprovePurchaseOrder}>
            Chấp nhận đơn mua hàng
          </Button>
        )}
        {PurchaseOrder?.data?.status == "Approved" && (
          <Button className="flex-1"
          onClick={() => router.push(`/admin/purchase-orders/${poId}/goods-receipt`)}
          >
            Nhập hàng
          </Button>
        )}
        {!["Completed", "Cancelled"].includes(
          PurchaseOrder?.data?.status ?? "",
        ) && (
          <Button
            onClick={handleCancelPurchaseOrder}
            variant="outline"
            className="flex-1"
          >
            Hủy đơn mua hàng
          </Button>
        )}
      </div>
    </div>
  );
}
