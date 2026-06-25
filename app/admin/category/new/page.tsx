"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import {
  useCreateCategory,
  useGetCategories,
} from "@/hooks/Product/useCategory";
import { CategoryDto } from "@/types/product/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Image } from "@/components/ui/image";
const schema = z.object({
  parentId: z.string().uuid("Vui lòng chọn thương hiệu"),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc").max(255),
  slug: z.string().min(1, "Slug là bắt buộc").max(255),
  description: z.string().optional(),
  Image: z.instanceof(File).optional().nullable(),
});
type FormValues = z.infer<typeof schema>;

export default function CreateCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    },
  });
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

  const { data: dataCategory, isLoading } = useGetCategories();
  console.log(dataCategory);
  const createCategory = useCreateCategory();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("Image", file);
    setImagePreview(URL.createObjectURL(file));
  };  
  const clearThumbnail = () => {
    setValue("Image", null);
    setImagePreview(null);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("Vui lòng điền tất cả thông tin bắt buộc");
      return;
    }
    createCategory.mutateAsync(formData);
    router.push("/admin/category");
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
          Thêm danh mục mới
        </h1>
        <p className="text-muted-foreground">
          Tạo một danh mục mới trong hệ thống
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin danh mục</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin để tạo danh mục mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
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

            {/* Parent Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Danh mục chính (tùy chọn)
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Danh mục chính mới</option>
                {!isLoading &&
                  dataCategory.items.map((cat: CategoryDto) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Chọn danh mục chính nếu đây là danh mục con, để trống nếu là
                danh mục chính mới
              </p>
            </div>
               <Card>
              <CardContent className="pt-6">
                <h2 className="mb-4 font-semibold text-base">Ảnh thumbnail</h2>
                {imagePreview ? (
                  <div className="relative w-full max-w-xs">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-full rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearThumbnail}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-48 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition hover:border-primary hover:text-primary">
                    <ImagePlus size={28} />
                    <span className="text-sm">Chọn ảnh thumbnail</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                )}
              </CardContent>
            </Card>
            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium cursor-pointer"
              >
                Kích hoạt thương hiệu
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit">Tạo danh mục</Button>
              <Link href="/categories">
                <Button variant="outline">Hủy</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
