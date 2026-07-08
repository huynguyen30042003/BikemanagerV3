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
import { useNewSupplierPageState } from "@/hooks/Supplier/PageState/useNewSupplierPageState";

export default function CreateSupplierPage() {
  const { formData, handleChange, handleSubmit } = useNewSupplierPageState();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/suppliers">
          <Button variant="outline" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Thêm nhà cung cấp
          </h1>
          <p className="text-muted-foreground">
            Tạo thông tin nhà cung cấp mới
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhà cung cấp</CardTitle>
          <CardDescription>Nhập đầy đủ thông tin nhà cung cấp</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tên nhà cung cấp <span className="text-red-500">*</span>
              </label>
              <Input
                name="Name"
                placeholder="Nhập tên nhà cung cấp"
                value={formData.Name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Người liên hệ</label>
              <Input
                name="ContactPerson"
                placeholder="Nhập tên người liên hệ"
                value={formData.ContactPerson}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                name="Phone"
                placeholder="Nhập số điện thoại"
                value={formData.Phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="Email"
                type="email"
                placeholder="Nhập email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input
                name="Address"
                placeholder="Nhập địa chỉ"
                value={formData.Address}
                onChange={handleChange}
              />
            </div>

            {/* Tax Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mã số thuế</label>
              <Input
                name="TaxCode"
                placeholder="Nhập mã số thuế"
                value={formData.TaxCode}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Thêm nhà cung cấp
              </Button>
              <Link href="/admin/suppliers" className="flex-1">
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
