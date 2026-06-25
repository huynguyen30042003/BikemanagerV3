"use client";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  useGetPurchaseOrderById,
  useReceivedPurchaseOrder,
} from "./usePurchaOrder";
import {
  FullPurchaseOrderRequest,
  PurchaseOrderItemResponse,
  ReceivedSerialRequest,
  subReceivedSerial,
} from "@/types/supplier/purchase-orders";

type SerialFieldKey = keyof Omit<ReceivedSerialRequest, "ProductVariantId">;
type SerialEdits = Partial<Record<SerialFieldKey, string>>;

export function useGoodsReceiptPageState() {
  const params = useParams();  
  const router = useRouter();
  
  const poId = params.id as string;
  const { data: purchaseOrder, isLoading } = useGetPurchaseOrderById(poId);
  const receivePurchaseOrder = useReceivedPurchaseOrder();

  // chỉ lưu phần người dùng SỬA, không lưu lại cả mảng items
  const [edits, setEdits] = useState<Record<string, SerialEdits>>({});

  // tính receivedSerialRequest ngay trong render, không cần effect + state riêng nữa
  const receivedSerialRequest: FullPurchaseOrderRequest[] = useMemo(() => {
    const items = purchaseOrder?.data?.items ?? [];

    return items.flatMap((item: PurchaseOrderItemResponse) => {
      if (!item.trackSerial) {
        return [
          {
            ...item,
            ...edits[item.productVariantId],
          },
        ];
      }

      return Array.from(
        { length: item.quantity },
        (_, index) => ({
          ...item,
          rowKey: `${item.productVariantId}-${index}`,
          indexProductVariant: index+1,
          ...edits[`${item.productVariantId}-${index}`],
        }),
      );
    });
  }, [purchaseOrder, edits]);

  const handleSerialChange = (
    key: string,
    type: SerialFieldKey,
    value: string,
  ) => {
    setEdits((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value,
      },
    }));
  };

  const handleReceive = () => {
    const condition = receivedSerialRequest.filter(
      (item: FullPurchaseOrderRequest) =>
        item.trackSerial &&
        !(
          !!item.batterySerial &&
          !!item.engineNumber &&
          !!item.frameNumber &&
          !!item.motorSerial
        ),
    );
    console.log(condition);
    const request = receivedSerialRequest.map((item: subReceivedSerial) =>
      item.trackSerial
        ? {
            productVariantId: item.productVariantId,
            batterySerial: item.batterySerial,
            engineNumber: item.engineNumber,
            frameNumber: item.frameNumber,
            motorSerial: item.motorSerial,
          }
        : { productVariantId: item.productVariantId },
    );
    console.log(request);

    try {
      receivePurchaseOrder.mutate({
        id: poId,
        serials: request,
      },{onSuccess:()=> {
        alert("receive successfull")
        router.push("/admin/purchase-orders")
      }})
    } catch {
      alert("receive fail")
    }
  };

  return {
    poId,
    isLoading,
    purchaseOrder,
    receivedSerialRequest,
    handleSerialChange,
    handleReceive,
    isReceiving: receivePurchaseOrder.isPending,
  };
}
