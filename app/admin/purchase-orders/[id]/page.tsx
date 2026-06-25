'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useGetPurchaseOrderById } from '@/hooks/PurchaseOrder/usePurchaOrder';
import { PurchaseOrderItemResponse } from '@/types/supplier/purchase-orders';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
};

const statusConfig = {
  Draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
  Approved: { label: 'Đã gửi', color: 'bg-blue-100 text-blue-800' },
  Receiving: { label: 'Đã duyệt', color: 'bg-yellow-100 text-yellow-800' },
  Completed: { label: 'Đã nhận', color: 'bg-green-100 text-green-800' },
  Cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const poId = params.id as string;
    const { data: PurchaseOrder, isLoading: isLoadingPurchaseOrder } = useGetPurchaseOrderById(poId);

  if (isLoadingPurchaseOrder) {
    return <div className="p-8">Đang tải...</div>;
  }

  if (!PurchaseOrder?.success) {
    return <div className="p-8">Không tìm thấy đơn mua hàng</div>;
  }
  // const { data: supplierData, isLoading: isLoadingSupplier } = useGetSupplierById(PurchaseOrder?.data?.);
  // const supplier = mockData.suppliers.find((s) => s.id === po.supplierId);

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/purchase-orders">
            <Button variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{PurchaseOrder?.data?.code}</h1>
              <span
                className={`text-xs px-3 py-1 rounded font-medium ${
                  statusConfig[PurchaseOrder?.data?.status as keyof typeof statusConfig]?.color ||
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {statusConfig[PurchaseOrder?.data?.status as keyof typeof statusConfig]?.label || PurchaseOrder?.data?.status}
              </span>
            </div>
            <p className="text-muted-foreground">Chi tiết đơn mua hàng</p>
          </div>
        </div>
        <Link href={`/admin/purchase-orders/${PurchaseOrder?.data?.id}/edit`}>
          <Button>
            <Edit2 size={18} />
            <span>Chỉnh sửa</span>
          </Button>
        </Link>
      </div>

      {/* PO Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Mã đơn</p>
              <p className="font-medium">{PurchaseOrder?.data?.code}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ngày tạo</p>
              <p className="font-medium">
                {new Date(PurchaseOrder?.data?.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trạng thái</p>
              <p className="font-medium">{statusConfig[PurchaseOrder?.data?.status as keyof typeof statusConfig]?.label || PurchaseOrder?.data?.status}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Thông tin nhà cung cấp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Tên</p>
              <p className="font-medium">{PurchaseOrder?.data?.supplierName}</p>
            </div>
            {/* <div>
              <p className="text-xs text-muted-foreground">Liên hệ</p>
              <p className="font-medium">{supplier?.contactPerson}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{supplier?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Điện thoại</p>
              <p className="font-medium">{supplier?.phone}</p>
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết sản phẩm</CardTitle>
          <CardDescription>
            {PurchaseOrder?.data?.items.length} sản phẩm trong đơn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Sản phẩm</th>
                  <th className="text-left py-3 px-4 font-medium">SKU</th>
                  <th className="text-right py-3 px-4 font-medium">Số lượng</th>
                  <th className="text-right py-3 px-4 font-medium">Đơn giá</th>
                  <th className="text-right py-3 px-4 font-medium">Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                {PurchaseOrder?.data?.items.map((item: PurchaseOrderItemResponse, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{item.productName}</td>
                    <td className="text-left py-3 px-4 text-muted-foreground">
                      {item.productVariantSKU}
                    </td>
                    <td className="text-right py-3 px-4">{item.quantity}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatCurrency(item.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="max-w-md ml-auto">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tóm tắt giá trị
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng cộng</span>
            <span className="font-medium">{formatCurrency(PurchaseOrder?.data?.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="font-medium">{formatCurrency(PurchaseOrder?.data?.discountAmount)}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Cần thanh toán</span>
              <span className="text-primary">{formatCurrency(PurchaseOrder?.data?.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
