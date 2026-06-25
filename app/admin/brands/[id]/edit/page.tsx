'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetBrandById, useUpdateBrand } from '@/hooks/Product/useBrand';
import { updateBrandRequest } from '@/types/product/brand';

type BrandFormValue = Pick<updateBrandRequest, 'id' | 'name' | 'slug' | 'country' | 'isActive'>;

function BrandEditForm({
  brandId,
  initialValues,
}: {
  brandId: string;
  initialValues: BrandFormValue;
}) {
  const router = useRouter();
  const updateBrand = useUpdateBrand()
  const [formData, setFormData] = useState<updateBrandRequest>(() => initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleGenerateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.country) {
      alert('Vui lòng điền tất cả thông tin bắt buộc');
      return;
    }
      updateBrand.mutateAsync(formData,{
        onSuccess() {
          router.push('/admin/brands');
        },  
      })
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <Link href="/admin/brands">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Chỉnh sửa thương hiệu</h1>
        <p className="text-muted-foreground">Cập nhật thông tin thương hiệu</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin thương hiệu</CardTitle>
          <CardDescription>Chỉnh sửa thông tin thương hiệu hiện tại</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên thương hiệu *</label>
              <Input
                name="name"
                placeholder="Nhập tên thương hiệu"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                <Button type="button" variant="outline" onClick={handleGenerateSlug}>
                  Tạo từ tên
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Slug là phiên bản URL-friendly của tên
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quốc gia *</label>
              <Input
                name="country"
                placeholder="Nhập tên quốc gia"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                id={`isActive-${brandId}`}
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <label htmlFor={`isActive-${brandId}`} className="text-sm font-medium cursor-pointer">
                Kích hoạt thương hiệu
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit">Lưu thay đổi</Button>
              <Link href="/admin/brands">
                <Button variant="outline">Hủy</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditBrandPage() {
  const params = useParams();
  const brandId = Array.isArray(params.id) ? params.id[0] ?? '' : params.id ?? '';
  const { data: brandData, isLoading: isLoadingBrand } = useGetBrandById(brandId);
  console.log(brandData);
  
  if (isLoadingBrand) {
    return <div className="p-8">Đang tải...</div>;
  }

  if (!brandId || !brandData) {
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
            <p className="text-sm text-muted-foreground">Không tìm thấy thương hiệu cần chỉnh sửa.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <BrandEditForm
      key={brandId}
      brandId={brandId}
      initialValues={{
        id: brandId,
        name: brandData.name ?? '',
        slug: brandData.slug ?? '',
        country: brandData.country ?? '',
        isActive: brandData.isActive ?? true,
      }}
    />
  );
}
