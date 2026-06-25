"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { useGetCategoryById, useUpdateCategory } from "@/hooks/Product/useCategory";
import { UpdateCategoryRequest } from "@/types/product/category";

function CategoryEditForm({
  initialValues,
}: {
  initialValues: UpdateCategoryRequest;
}) {
  const router = useRouter();
  const updateCategory = useUpdateCategory()
  const [formData, setFormData] = useState<UpdateCategoryRequest>(
    () => initialValues,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleGenerateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug ) {
      alert("Vui lòng điền tất cả thông tin bắt buộc");
      return;
    }
    updateCategory.mutateAsync(formData, {
      onSuccess() {
        router.push("/admin/category");
      },
    });
  };
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/category">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          Chỉnh sửa danh mục
        </h1>
        <p className="text-muted-foreground">Cập nhật thông tin danh mục</p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin danh mục</CardTitle>
          <CardDescription>
            Chỉnh sửa thông tin danh mục hiện tại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên danh mục *</label>
              <Input
                name="name"
                placeholder="Nhập tên danh mục"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <div className="flex gap-2">
                <Input
                  name="slug"
                  placeholder="Nhập slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSlug}
                >
                  Tạo từ tên
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Slug là phiên bản URL-friendly của tên
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit">Lưu thay đổi</Button>
              <Link href="/admin/category">
                <Button variant="outline">Hủy</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const { data: categoryData, isLoading } = useGetCategoryById(categoryId);
  console.log(categoryData);

  if (isLoading) {
    return <div className="p-8">Đang tải...</div>;
  }
  if (!categoryId || !categoryData) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Link href="/admin/brands">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </Button>
        </Link>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Không tìm thấy thương hiệu cần chỉnh sửa.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <CategoryEditForm
      key={categoryId}
      initialValues={{
        id: categoryId,
        name: categoryData.data.name ?? '',
        slug: categoryData.data.slug ?? '',
      }}
    />
  );
}
