'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCreateBrand } from '@/hooks/Product/useBrand';
import { createBrandRequest } from '@/types/product/brand';

export default function CreateBrandPage() {
  const createBrand = useCreateBrand()
  const router = useRouter();
  const [formData, setFormData] = useState<createBrandRequest>({
    name: '',
    slug: '',
    country: '',
    isActive: true,
    logoUrl: null as unknown as File,
  });

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
      createBrand.mutateAsync(formData,
        {
          onSuccess: (res) => {
            console.log("updateSuccess", res);
            
          }
        }
      )
    router.push('/admin/brands');
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <Link href="/brands">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Thêm thương hiệu mới</h1>
        <p className="text-muted-foreground">Tạo một thương hiệu mới trong hệ thống</p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin thương hiệu</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin để tạo thương hiệu mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tên thương hiệu *
              </label>
              <Input
                name="name"
                placeholder="Nhập tên thương hiệu"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Slug *
              </label>
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

            {/* Country */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Quốc gia *
              </label>
              <Input
                name="country"
                placeholder="Nhập tên quốc gia"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

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
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                Kích hoạt thương hiệu
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit">
                Tạo thương hiệu
              </Button>
              <Link href="/brands">
                <Button variant="outline">
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
