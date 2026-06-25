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
import { CheckCircle2 } from "lucide-react";
import { useGoodsReceiptPageState } from "@/hooks/PurchaseOrder/useGoodsReceiptPageState";
import { FullPurchaseOrderRequest } from "@/types/supplier/purchase-orders";

export default function GoodsReceiptPage() {
  const {
    isLoading,
    purchaseOrder,
    receivedSerialRequest,
    handleSerialChange,
    handleReceive,
    isReceiving
  }= useGoodsReceiptPageState()
  console.log(receivedSerialRequest);
  
  if (isLoading) {
    return <div className="p-8">Đang tải...</div>;
  }

  if (!purchaseOrder) {
    return <div className="p-8">Không tìm thấy đơn mua hàng</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nhập hàng</h1>
        <p className="text-muted-foreground">
          Xác nhận nhận hàng từ đơn mua hàng
        </p>
      </div>

      {/* Serial Entry Form */}
      {receivedSerialRequest && purchaseOrder?.data?.items?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết nhập hàng</CardTitle>
            <CardDescription>
              Mã đơn: {purchaseOrder?.data?.code} • Nhà cung cấp:{" "}
              {purchaseOrder?.data?.supplierName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {receivedSerialRequest?.map((item: FullPurchaseOrderRequest, entryIndex: number) => (
              <div key={entryIndex} className="border rounded-lg p-4 space-y-4">
                {/* Item Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      SKU: {item.productVariantSKU}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  {item.trackSerial && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded">
                      Theo dõi Serial
                    </span>
                  )}
                </div>

                {/* Serial Fields */}
                {item.trackSerial ? (
                  <div className="space-y-4">
                      <div
                        key={item.productVariantId}
                        className="bg-gray-50 p-4 rounded-lg space-y-3"
                      >
                        <h4 className="font-medium text-sm text-foreground">
                          Sản phẩm {item?.indexProductVariant} / {item.quantity}
                        </h4>

                        {item.trackSerial && (<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">
                              Số khung (Frame Number)
                            </label>
                            <Input
                              placeholder="VD: GX56-11111-00031"
                              value={item.frameNumber || ""}
                              onChange={(e)=>
                                handleSerialChange(
                                item.rowKey,
                                "frameNumber",
                                e.target.value
                                )}

                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">
                              Số động cơ (Engine Number)
                            </label>
                            <Input
                              placeholder="VD: GX56-11111-00301"
                              value={item.engineNumber || ""}
                              onChange={(e)=>
                                handleSerialChange(
                                item.rowKey,
                                "engineNumber",
                                e.target.value
                                )}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">
                              Số pin (Battery Serial)
                            </label>
                            <Input
                              placeholder="VD: GX56-11111-03001"
                              value={item.batterySerial || ""}
                              onChange={(e)=>
                                handleSerialChange(
                                item.rowKey,
                                "batterySerial",
                                e.target.value
                                )}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">
                              Số motor (Motor Serial)
                            </label>
                            <Input
                              placeholder="VD: GX56-11111-00301"
                              value={item.motorSerial || ""}
                              onChange={(e)=>
                                handleSerialChange(
                                item.rowKey,
                                "motorSerial",
                                e.target.value
                                )}
                            />
                          </div>
                        </div>)}
                      </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-green-600" />
                    <p className="text-sm text-green-800">
                      Không cần theo dõi serial, sẽ nhập {item.quantity} sản
                      phẩm
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleReceive}
            disabled={isReceiving || purchaseOrder?.data?.status === "Completed"}
            className="flex-1"
            size="lg"
          >
            {isReceiving ? "Đang xử lý..." : purchaseOrder?.data?.status === "Completed" ? "Đơn hàng đã được chấp nhận": "Xác nhận nhập hàng"}
          </Button>
        </div>

      {/* Empty State */}
    </div>
  );
}
