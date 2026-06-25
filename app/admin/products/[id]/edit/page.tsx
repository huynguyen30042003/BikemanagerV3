"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
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
import { CategorySelect } from "@/components/Product/Category/CategorySelect";

import { useGetCategories } from "@/hooks/Product/useCategory";
import { useGetBrands } from "@/hooks/Product/useBrand";
import {
  useGetProductById,
  useUpdateProduct,
} from "@/hooks/Product/useProduct";
import { Image } from "@/components/ui/image";
import { CategoryDto } from "@/types/product/category";
import { brandRes } from "@/types/product/brand";
import { PRODUCT_TYPES, ProductType } from "@/types/product/product";
import { BE_URL } from "@/shared/constants/apiConstants";

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  categoryId: z.string().uuid("Vui lòng chọn danh mục"),
  brandId: z.string().uuid("Vui lòng chọn thương hiệu"),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc").max(255),
  slug: z.string().min(1, "Slug là bắt buộc").max(255),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.instanceof(File).optional().nullable(),
  productType: z.string().min(1, "Vui lòng chọn loại sản phẩm"),
  isPublished: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

type ProductForEdit = {
  id: string;
  categoryId: string;
  brandId?: string | null;
  brand?: { id: string; name?: string } | null;
  sku: string;
  barcode?: string | null;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  productType: ProductType;
  isPublished: boolean;
};

function resolveProductType(productType: unknown): string {
  if (typeof productType === "number") {
    return (
      PRODUCT_TYPES.find((t) => t.number === productType)?.value ?? "Bicycle"
    );
  }
  if (typeof productType === "string") {
    const byValue = PRODUCT_TYPES.find((t) => t.value === productType);
    if (byValue) return byValue.value;
    const byLabel = PRODUCT_TYPES.find(
      (t) => t.label.toLowerCase() === productType.toLowerCase(),
    );
    if (byLabel) return byLabel.value;
    return productType;
  }
  return "Bicycle";
}

function buildDefaultValues(product: ProductForEdit): FormValues {
  return {
    categoryId: product.categoryId,
    brandId: product.brandId ?? product.brand?.id ?? "",
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    productType: resolveProductType(product.productType),
    isPublished: product.isPublished,
    thumbnail: null,
  };
}

function ensureBrandInList(
  brands: brandRes[],
  product: ProductForEdit,
): brandRes[] {
  const selectedId = product.brandId ?? product.brand?.id;
  if (!selectedId) return brands;
  if (brands.some((b) => b.id === selectedId)) return brands;
  if (!product.brand?.name) return brands;

  return [
    {
      id: selectedId,
      name: product.brand.name,
      slug: "",
      logoUrl: "",
      country: "",
      isActive: true,
      createdAt: "",
    },
    ...brands,
  ];
}

// ─── Form (only mounts when product + options are ready) ─────────────────────
function EditProductForm({
  product,
  categories,
  brands,
}: {
  product: ProductForEdit;
  categories: CategoryDto[];
  brands: brandRes[];
}) {
  const router = useRouter();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    `${BE_URL}/${product.thumbnailUrl}`,
  );

  const { mutateAsync: updateProduct, isPending } = useUpdateProduct();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(product),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("name", e.target.value);
  };

  const handleGenerateSlug = () => {
    const name = watch("name");
    setValue(
      "slug",
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
      { shouldValidate: true },
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
    setThumbnailPreview(product.thumbnailUrl ?? null);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProduct({ id: product.id, ...values },{
        onSuccess: (data) =>{
          if(data.success){
              toast.success("Cập nhật sản phẩm thành công");

          }else {
              toast.error(data?.message);

          }
        }
      });
      toast.success("Cập nhật sản phẩm thành công");
      router.push(`/admin/products/${product.id}`);
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
    }
  };

  const isNewFile = watch("thumbnail") instanceof File;
  const hasPreview = !!thumbnailPreview;
  const isOriginalImage = hasPreview && !isNewFile;
  const brandId = watch("brandId");
  const productType = watch("productType");
  const categoryId = watch("categoryId");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <h2 className="text-base font-semibold">Thông tin cơ bản</h2>

              <div className="space-y-1.5">
                <Label>Tên sản phẩm *</Label>
                <Input
                  {...register("name")}
                  onChange={(e) => {
                    register("name").onChange(e);
                    handleNameChange(e);
                  }}
                  placeholder="VD: VinFast Evo 200 Lite"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    {...register("slug")}
                    placeholder="vinfast-evo-200-lite"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateSlug}
                    className="shrink-0"
                  >
                    Tạo từ tên
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-xs text-destructive">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Mô tả ngắn</Label>
                <Input
                  {...register("shortDescription")}
                  placeholder="Mô tả ngắn gọn về sản phẩm..."
                />
              </div>

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

          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-base font-semibold">Ảnh thumbnail</h2>

              {hasPreview ? (
                <div className="relative w-full max-w-xs">
                  <Image
                    src={thumbnailPreview}
                    alt="Preview"
                    className="h-48 w-full rounded-lg border object-cover"
                  />
                  {isOriginalImage && (
                    <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
                      Ảnh hiện tại
                    </span>
                  )}
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
                  <span className="text-sm">Chọn ảnh mới</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                </label>
              )}

              {hasPreview && (
                <label className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
                  <ImagePlus size={14} />
                  Đổi ảnh khác
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

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <h2 className="text-base font-semibold">Phân loại</h2>

              <div className="space-y-1.5">
                <Label>Danh mục *</Label>
                <CategorySelect
                  categories={categories}
                  value={categoryId}
                  onChange={(value) =>
                    setValue("categoryId", value, { shouldValidate: true })
                  }
                  placeholder="Chọn danh mục"
                  error={errors.categoryId?.message}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Thương hiệu *</Label>
                <Select
                  value={brandId}
                  onValueChange={(value) =>
                    setValue("brandId", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full">
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
                  <p className="text-xs text-destructive">
                    {errors.brandId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Loại sản phẩm *</Label>
                <Select
                  // key={`product-type-${field.value}`}
                  value={productType}
                  onValueChange={(value) =>
                    setValue("productType", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full">
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
                  <p className="text-xs text-destructive">
                    {errors.productType.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-base font-semibold">Trạng thái</h2>
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

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
            <Link href={`/admin/products/${product.id}`}>
              <Button type="button" variant="outline" className="w-full">
                Hủy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

// ─── Page (data loading) ─────────────────────────────────────────────────────
export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading: isLoadingProduct } =
    useGetProductById(id);
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategories();
  const { data: brandsData, isLoading: isLoadingBrands } = useGetBrands({
    pageSize: 100,
  });

  const categories = useMemo(
    () => categoriesData?.items ?? [],
    [categoriesData],
  );

  const brands = useMemo(() => {
    const items = brandsData?.data?.items ?? [];
    if (!product) return items;
    return ensureBrandInList(items, product as ProductForEdit);
  }, [brandsData, product]);

  const isReady =
    !!product &&
    !isLoadingProduct &&
    !isLoadingCategories &&
    !isLoadingBrands &&
    categories.length > 0 &&
    brands.length > 0;

  if (isLoadingProduct || isLoadingCategories || isLoadingBrands) {
    return <div className="p-8">Đang tải...</div>;
  }

  if (!product) {
    return <div className="p-8">Không tìm thấy sản phẩm</div>;
  }

  if (!isReady) {
    return <div className="p-8">Đang tải dữ liệu phân loại...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mb-8">
        <Link href={`/admin/products/${id}`}>
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          Chỉnh sửa sản phẩm
        </h1>
        <p className="text-muted-foreground">Cập nhật thông tin sản phẩm</p>
      </div>

      <EditProductForm
        key={product.id}
        product={product as ProductForEdit}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
