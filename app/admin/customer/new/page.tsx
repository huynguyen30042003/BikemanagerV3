'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useCreateCustomer } from '@/hooks/Customer/useCustomer';

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    PhoneNumber: '',
    Address: '',
    Birthday: '',
    Gender: ''
  });
  const createCustomer = useCreateCustomer()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (value: string) => {
    setFormData((prev)=> ({...prev, Gender: value as 'male' | 'female'}))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to an API
    createCustomer.mutate(formData)
    console.log('Form submitted:', formData);
    // router.push('/customers');
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/customers">
            <ArrowLeft size={18} />
            Quay lại
          </Link>
        </Button>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Thêm khách hàng mới</CardTitle>
          <CardDescription>
            Nhập thông tin khách hàng mới vào hệ thống CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FullName */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên *</label>
              <Input
                type="text"
                name="FullName"
                placeholder="Nhập họ và tên"
                value={formData.FullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                name="Email"
                placeholder="example@email.com"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PhoneNumber */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại *</label>
              <Input
                type="tel"
                name="PhoneNumber"
                placeholder="0123456789"
                value={formData.PhoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ *</label>
              <Input
                type="text"
                name="Address"
                placeholder="Nhập địa chỉ"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Birthday *</label>
              <Input
                type="date"
                name="Birthday"
                placeholder="Nhập địa chỉ"
                value={formData.Birthday}
                onChange={handleChange}
                required
              />
            </div>

             {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái *</label>
              <Select value={formData.Gender} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính"/>
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>


            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Thêm khách hàng
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/admin/customers">Hủy</Link>
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
