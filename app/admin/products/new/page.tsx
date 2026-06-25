"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ImagePlus, X } from "lucide-react";

import { useGetCategories } from "@/hooks/Product/useCategory";
import { useGetBrands } from "@/hooks/Product/useBrand";
import { useCreateProduct } from "@/hooks/Product/useProduct";
import { Image } from "@/components/ui/image";
import { CategorySelect } from "@/components/Product/Category/CategorySelect";
import { PRODUCT_TYPES } from "@/types/product/product";

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  categoryId: z.string().uuid("Vui lòng chọn danh mục"),
  brandId: z.string().uuid("Vui lòng chọn thương hiệu"),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc").max(255),
  slug: z.string().min(1, "Slug là bắt buộc").max(255),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.instanceof(File).optional().nullable(),
  productType: z.string().min(1, "Vui lòng chọn loại sản phẩm").max(50),
  isPublished: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreateProductPage() {
  const router = useRouter();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const { data: categoriesData } = useGetCategories();

  const { data: brandsData } = useGetBrands({ pageSize: 100 });
  const brands = brandsData?.data?.items ?? [];
  const categories = categoriesData?.items ?? [];

  const { mutateAsync: createProduct, isPending } = useCreateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productType: "Bicycle",
      isPublished: false,
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("name", val);
    setValue(
      "slug",
      val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
    );
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("thumbnail", file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const clearThumbnail = () => {
    setValue("thumbnail", null);
    setThumbnailPreview(null);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await createProduct(values);
      toast.success("Tạo sản phẩm thành công");
      router.push("/admin/products");
    } catch {
      toast.error("Có lỗi xảy ra khi tạo sản phẩm");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Thêm sản phẩm</h1>
        <p className="text-muted-foreground">Tạo mới một sản phẩm</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Left col (main info) ── */}
          <div className="space-y-6 lg:col-span-2">

            {/* Basic Info */}
            <Card>
              <CardContent className="space-y-5 pt-6">
                <h2 className="font-semibold text-base">Thông tin cơ bản</h2>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label>Tên sản phẩm *</Label>
                  <Input
                    {...register("name")}
                    onChange={handleNameChange}
                    placeholder="VD: VinFast Evo 200 Lite"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <Label>Slug *</Label>
                  <Input
                    {...register("slug")}
                    placeholder="vinfast-evo-200-lite"
                  />
                  {errors.slug && (
                    <p className="text-xs text-destructive">{errors.slug.message}</p>
                  )}
                </div>


                {/* Short Description */}
                <div className="space-y-1.5">
                  <Label>Mô tả ngắn</Label>
                  <Input
                    {...register("shortDescription")}
                    placeholder="Mô tả ngắn gọn về sản phẩm..."
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label>Mô tả chi tiết</Label>
                  <Textarea
                    {...register("description")}
                    rows={5}
                    placeholder="Mô tả đầy đủ về sản phẩm..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-4 font-semibold text-base">Ảnh thumbnail</h2>
                {thumbnailPreview ? (
                  <div className="relative w-full max-w-xs">
                    <Image
                      src={thumbnailPreview}
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
          </div>

          {/* ── Right col (meta) ── */}
          <div className="space-y-6">

            {/* Category + Brand + Type */}
            <Card>
              <CardContent className="space-y-5 pt-6">
                <h2 className="font-semibold text-base">Phân loại</h2>

                {/* Category */}
                <CategorySelect
                  categories={categories}          // CategoryDto[] từ API (có children lồng nhau)
                  value={watch("categoryId")}
                  onChange={(id) => setValue("categoryId", id, { shouldValidate: true })}
                  error={errors.categoryId?.message}
                />

                {/* Brand */}
                <div className="space-y-1.5">
                  <Label>Thương hiệu *</Label>
                  <Select
                    value={watch("brandId") ?? ""}
                    onValueChange={(v) => setValue("brandId", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brandId && (
                    <p className="text-xs text-destructive">{errors.brandId.message}</p>
                  )}
                </div>

                {/* Product Type */}
                <div className="space-y-1.5">
                  <Label>Loại sản phẩm *</Label>
                  <Select
                    value={watch("productType")}
                    onValueChange={(v) => setValue("productType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.productType && (
                    <p className="text-xs text-destructive">{errors.productType.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Publish */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-4 font-semibold text-base">Trạng thái</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Đăng công khai</p>
                    <p className="text-xs text-muted-foreground">
                      Hiển thị sản phẩm cho khách hàng
                    </p>
                  </div>
                  <Switch
                    checked={watch("isPublished")}
                    onCheckedChange={(v) => setValue("isPublished", v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Đang tạo..." : "Tạo sản phẩm"}
              </Button>
              <Link href="/admin/products">
                <Button type="button" variant="outline" className="w-full">
                  Hủy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}