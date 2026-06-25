/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Column, Table } from "@/components/ui/Table";

import { PRODUCT_KEYS, useGetProductById } from "@/hooks/Product/useProduct";
import {
  useCreateProductVariant,
  useUpdateProductVariant,
  useDeleteProductVariant,
} from "@/hooks/Product/useProductVariants";
import {
  useGetSerialNumbers,
  useCreateSerialNumber,
  useUpdateSerialNumber,
  useDeleteSerialNumber,
} from "@/hooks/Product/useSerialNumber";
import { ProductVariantResponse } from "@/types/product/productVariants";
import { SerialNumberResponse } from "@/types/product/serialNumber";
import {
  productVariantSchema,
  ProductVariantFormValues,
  serialNumberSchema,
  SerialNumberFormValues,
} from "@/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCT_TYPES } from "@/types/product/product";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  // ── Product ──────────────────────────────────────────
  const { data: product, isLoading } = useGetProductById(id);

  // ── Variants ─────────────────────────────────────────
  const [variantDialog, setVariantDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantResponse | null>(null);
  const [deleteVariant, setDeleteVariant] =
    useState<ProductVariantResponse | null>(null);

  const { mutateAsync: createVariant, isPending: isCreatingVariant } =
    useCreateProductVariant();
  const { mutateAsync: updateVariant, isPending: isUpdatingVariant } =
    useUpdateProductVariant();
  const { mutateAsync: removeVariant, isPending: isDeletingVariant } =
    useDeleteProductVariant();

  const variantForm = useForm({
    resolver: zodResolver(productVariantSchema),
    defaultValues: {
      importPrice: 0,
      sellingPrice: 0,
      wholesalePrice: 0,
      stockQuantity: 0,
      warrantyMonths: 12,
    },
  });

  const openCreateVariant = () => {
    setSelectedVariant(null);
    variantForm.reset({
      importPrice: 0,
      sellingPrice: 0,
      wholesalePrice: 0,
      stockQuantity: 0,
      warrantyMonths: 12,
    });
    setVariantDialog(true);
  };

  const openEditVariant = (v: ProductVariantResponse) => {
    setSelectedVariant(v);
    variantForm.reset({
      importPrice: v.importPrice,
      color: v.color,
      battery: v.battery,
      motorPower: v.motorPower,
      sellingPrice: v.sellingPrice,
      wholesalePrice: v.wholesalePrice,
      stockQuantity: v.stockQuantity,
      warrantyMonths: v.warrantyMonths,
    });
    setVariantDialog(true);
  };

  const onSubmitVariant = async (values: ProductVariantFormValues) => {
    console.log("VALUES:", values);

    try {
      if (selectedVariant) {
        await updateVariant({
          id: selectedVariant.id,
          ...values,
          productId: id,
        });

        toast.success("Cập nhật biến thể thành công");
      } else {
        await createVariant({
          ...values,
          productId: id,
        });
        toast.success("Thêm biến thể thành công");
      }

      setVariantDialog(false);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const onDeleteVariant = async () => {
    if (!deleteVariant) return;
    try {
      await removeVariant(deleteVariant.id);
      toast.success("Xóa biến thể thành công");
      setDeleteVariant(null);
     
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  // ── Serials ───────────────────────────────────────────
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const { data: serials, isLoading: isLoadingSerial } = useGetSerialNumbers({
    productVariantId: activeVariantId ?? undefined,
  });

  const [serialDialog, setSerialDialog] = useState(false);
  const [selectedSerial, setSelectedSerial] =
    useState<SerialNumberResponse | null>(null);
  const [deleteSerial, setDeleteSerial] = useState<SerialNumberResponse | null>(
    null,
  );

  const { mutateAsync: createSerial, isPending: isCreatingSerial } =
    useCreateSerialNumber();
  const { mutateAsync: updateSerial, isPending: isUpdatingSerial } =
    useUpdateSerialNumber();
  const { mutateAsync: removeSerial, isPending: isDeletingSerial } =
    useDeleteSerialNumber();

  const serialForm = useForm<SerialNumberFormValues>({
    resolver: zodResolver(serialNumberSchema),
    defaultValues: { currentStatus: "IN_STOCK" },
  });

  const openCreateSerial = () => {
    setSelectedSerial(null);
    serialForm.reset({ currentStatus: "SOLD" });
    setSerialDialog(true);
  };

  const openEditSerial = (s: SerialNumberResponse) => {
    setSelectedSerial(s);
    serialForm.reset({
      ...s,
      manufacturingDate: s.manufacturingDate?.split("T")[0] ?? null,
      importDate: s.importDate?.split("T")[0] ?? null,
      warrantyStart: s.warrantyStart?.split("T")[0] ?? null,
      warrantyEnd: s.warrantyEnd?.split("T")[0] ?? null,
      currentStatus: s.currentStatus === 2 ? "IN_STOCK" : "SOLD",
    });
    setSerialDialog(true);
  };

  const onSubmitSerial = async (values: SerialNumberFormValues) => {
    if (!activeVariantId) return;
    try {
      if (selectedSerial) {
        await updateSerial({
          id: selectedSerial.id,
          ...values,
          productVariantId: activeVariantId,
        });
        toast.success("Cập nhật serial thành công");
      } else {
        await createSerial(
          { ...values, productVariantId: activeVariantId },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: PRODUCT_KEYS.detail(id),
              });
            },
          },
        );
      }
      serialForm.reset();
      setSerialDialog(false);
     
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const onDeleteSerial = async () => {
    if (!deleteSerial) return;
    try {
      await removeSerial(deleteSerial.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: PRODUCT_KEYS.detail(id),
          });
        },
      });

      toast.success("Xóa serial thành công");
      setDeleteSerial(null);
     
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  // ── Columns ───────────────────────────────────────────
  const variantColumns: Column<ProductVariantResponse>[] = [
    { key: "sku", title: "SKU", classNameHeader: "text-left" },
    {
      key: "color",
      title: "Màu",
      classNameHeader: "text-left",
      accessor: (r) => r.color ?? "—",
    },
    {
      key: "battery",
      title: "Pin",
      classNameHeader: "text-left",
      accessor: (r) => r.battery ?? "—",
    },
    {
      key: "motorPower",
      title: "Động cơ",
      classNameHeader: "text-left",
      accessor: (r) => r.motorPower ?? "—",
    },
    {
      key: "sellingPrice",
      title: "Giá bán",
      classNameHeader: "text-right",
      classNameItem: "text-right",
      render: (v) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(v),
    },
    {
      key: "stockQuantity",
      title: "Tồn kho",
      classNameHeader: "text-right",
      classNameItem: "text-right",
    },
    {
      key: "warrantyMonths",
      title: "BH (tháng)",
      classNameHeader: "text-right",
      classNameItem: "text-right",
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex justify-center gap-2">
          {row.trackSerial && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveVariantId(row.id);
              }}
            >
              Serials
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditVariant(row)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteVariant(row)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const serialColumns: Column<SerialNumberResponse>[] = [
    { key: "serialCode", title: "Serial Code", classNameHeader: "text-left" },
    {
      key: "frameNumber",
      title: "Số khung",
      classNameHeader: "text-left",
      accessor: (r) => r.frameNumber ?? "—",
    },
    {
      key: "batterySerial",
      title: "Serial pin",
      classNameHeader: "text-left",
      accessor: (r) => r.batterySerial ?? "—",
    },
    {
      key: "warrantyStart",
      title: "BH từ",
      accessor: (r) => r.warrantyStart?.split("T")[0] ?? "—",
    },
    {
      key: "warrantyEnd",
      title: "BH đến",
      accessor: (r) => r.warrantyEnd?.split("T")[0] ?? "—",
    },
    {
      key: "currentStatus",
      title: "Trạng thái",
      render: (v) => {
        return (
          <Badge variant={v === "IN_STOCK" ? "default" : "secondary"}>
            {v === 2 ? "IN_STOCK" : "SOLD"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditSerial(row)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteSerial(row)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="p-8">Đang tải...</div>;
  if (!product) return <div className="p-8">Không tìm thấy sản phẩm</div>;
  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} className="mr-1" /> Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">SKU: {product.sku}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/products/${id}/edit`)}
        >
          <Pencil size={16} className="mr-1" /> Chỉnh sửa
        </Button>
      </div>

      {/* Product Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Danh mục</p>
            <p className="font-medium">{product.category?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Thương hiệu</p>
            <p className="font-medium">{product.brand?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Loại</p>
            <p className="font-medium">
              {" "}
              {PRODUCT_TYPES.find((t) => t.number === product.productType)
                ?.label ?? product.productType}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trạng thái</p>
            <Badge variant={product.isPublished ? "default" : "secondary"}>
              {product.isPublished ? "Đã đăng" : "Nháp"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Biến thể ({product?.variants.length})</CardTitle>
          <Button size="sm" onClick={openCreateVariant}>
            <Plus size={14} className="mr-1" /> Thêm biến thể
          </Button>
        </CardHeader>
        {!isLoading && (
          <CardContent>
            <Table<ProductVariantResponse>
              showIndex
              data={product?.variants}
              columns={variantColumns}
            />
          </CardContent>
        )}
      </Card>

      {/* Serials (hiển thị khi chọn variant) */}
      {activeVariantId && serials && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Serial Numbers —{" "}
              {product?.variants?.find((v: ProductVariantResponse) => v.id === activeVariantId)?.sku}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveVariantId(null)}
              >
                Đóng
              </Button>
              <Button size="sm" onClick={openCreateSerial}>
                <Plus size={14} className="mr-1" /> Thêm serial
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardContent>
              {isLoadingSerial ? (
                <p>Đang tải...</p>
              ) : serials?.items?.length > 0 ? (
                <Table<SerialNumberResponse>
                  showIndex
                  data={serials.items}
                  columns={serialColumns}
                />
              ) : (
                <p>Không có dữ liệu</p>
              )}
            </CardContent>
          </CardContent>
        </Card>
      )}

      {/* ── Variant Dialog ─────────────────────────────── */}
      <Dialog open={variantDialog} onOpenChange={setVariantDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedVariant ? "Sửa biến thể" : "Thêm biến thể"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={variantForm.handleSubmit(onSubmitVariant)}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "color", label: "Màu sắc", type: "text" },
                { name: "battery", label: "Pin", type: "text" },
                { name: "motorPower", label: "Động cơ", type: "text" },
                { name: "importPrice", label: "Giá nhập *", type: "number" },
                { name: "sellingPrice", label: "Giá bán *", type: "number" },
                { name: "wholesalePrice", label: "Giá sỉ *", type: "number" },
                ...(product.productType >= 4
                  ? [
                      {
                        name: "stockQuantity",
                        label: "Số lượng *",
                        type: "number",
                      },
                    ]
                  : []),

                {
                  name: "warrantyMonths",
                  label: "Bảo hành (tháng) *",
                  type: "number",
                },
              ].map(({ name, label, type }) => (
                <div key={name} className="space-y-1">
                  <Label>{label}</Label>

                  <Input
                    type={type}
                    {...variantForm.register(name as any, {
                      valueAsNumber: type === "number",
                    })}
                  />

                  {(variantForm.formState.errors as any)[name] && (
                    <p className="text-xs text-destructive">
                      {(variantForm.formState.errors as any)[name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setVariantDialog(false)}
              >
                Hủy
              </Button>

              <Button
                type="submit"
                disabled={isCreatingVariant || isUpdatingVariant}
              >
                {selectedVariant ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Serial Dialog ──────────────────────────────── */}
      <Dialog open={serialDialog} onOpenChange={setSerialDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedSerial ? "Sửa serial" : "Thêm serial"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={serialForm.handleSubmit(onSubmitSerial)}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "frameNumber", label: "Số khung", type: "text" },
                { name: "engineNumber", label: "Số máy", type: "text" },
                { name: "batterySerial", label: "Serial pin", type: "text" },
                { name: "motorSerial", label: "Serial động cơ", type: "text" },
                { name: "qrCode", label: "QR Code", type: "text" },
                {
                  name: "manufacturingDate",
                  label: "Ngày sản xuất",
                  type: "date",
                },
                { name: "importDate", label: "Ngày nhập kho", type: "date" },
                { name: "warrantyStart", label: "BH từ", type: "date" },
                { name: "warrantyEnd", label: "BH đến", type: "date" },
              ].map(({ name, label, type }) => (
                <div key={name} className="space-y-1">
                  <Label>{label}</Label>
                  <Input type={type} {...serialForm.register(name as any)} />
                </div>
              ))}
              <div className="space-y-1">
                <Label>Trạng thái</Label>
                <Select
                  value={serialForm.watch("currentStatus") ?? "IN_STOCK"}
                  onValueChange={(v) =>
                    serialForm.setValue("currentStatus", v as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      ["IN_STOCK", "Trong kho"],
                      ["SOLD", "Đã bán"],
                    ].map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSerialDialog(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isCreatingSerial || isUpdatingSerial}
              >
                {selectedSerial ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Variant */}
      <AlertDialog
        open={!!deleteVariant}
        onOpenChange={() => setDeleteVariant(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa biến thể</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa biến thể <strong>{deleteVariant?.sku}</strong>? Tất cả serial
              của biến thể này cũng bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteVariant}
              disabled={isDeletingVariant}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Serial */}
      <AlertDialog
        open={!!deleteSerial}
        onOpenChange={() => setDeleteSerial(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa serial</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa serial <strong>{deleteSerial?.serialCode}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteSerial}
              disabled={isDeletingSerial}
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
