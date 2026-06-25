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
import { ArrowLeft } from "lucide-react";
import { useEditSupplierPageState } from "@/hooks/Supplier/PageState/useEditSupplierPageState";

export default function EditSupplierPage() {
  const { form, isLoading, handleSubmit } = useEditSupplierPageState();
  const { register } = form;

  if (isLoading) {
    return <div className="p-8">Đang tải...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/suppliers">
          <Button variant="outline" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Chỉnh sửa nhà cung cấp
          </h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin nhà cung cấp
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhà cung cấp</CardTitle>
          <CardDescription>Chỉnh sửa thông tin nhà cung cấp</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tên nhà cung cấp <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nhập tên nhà cung cấp"
                {...register("Name", {
                  required: "Bắt buộc",
                })}
                required
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Người liên hệ</label>
              <Input {...register("ContactPerson")} />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("Phone", {
                  required: "Bắt buộc",
                })}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("Email", {
                  required: "Bắt buộc",
                })}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input {...register("Address")} />
            </div>

            {/* Tax Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mã số thuế</label>
              <Input {...register("TaxCode")} />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Cập nhật nhà cung cấp
              </Button>
              <Link href="/suppliers" className="flex-1">
                <Button variant="outline" className="w-full">
                  Hủy
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
