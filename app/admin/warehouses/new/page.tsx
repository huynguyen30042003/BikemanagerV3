"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useNewWarehousePageState } from "@/hooks/Warehouses/PageState/useNewWarehousePageState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { brandRes } from "@/types/product/brand";

export default function CreateWarehousePage() {
  const { form, brands, onSubmit } = useNewWarehousePageState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;
  return (
    <div className="p-4 md:p-8 space-y-8">
      <Link
        href="/warehouses"
        className="inline-flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft size={18} />
        Quay lại
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Thêm kho hàng</h1>
        <p className="text-muted-foreground">Tạo một kho hàng mới</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Thông tin kho hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên kho hàng *</label>
              <Input {...register("Name")} placeholder="Tên kho" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input {...register("Address")} placeholder="Địa chỉ" />
            </div>

            <div className="space-y-1.5">
              <Label>Thương hiệu *</Label>
              <Select
                value={watch("BranchId") ?? ""}
                onValueChange={(v) => setValue("BranchId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b: brandRes) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.BranchId && (
                <p className="text-xs text-destructive">
                  {errors.BranchId.message}
                </p>
              )}
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit">Tạo kho hàng</Button>
              <Link href="/admin/warehouses">
                <Button variant="outline">Hủy</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
