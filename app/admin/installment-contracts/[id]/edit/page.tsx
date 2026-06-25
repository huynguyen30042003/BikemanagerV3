// 'use client';

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import Link from 'next/link';
// import { ArrowLeft } from 'lucide-react';
// import { useEditInstallmentProviderPageState } from '@/hooks/InstallmentContracts/PageState/useEditInstallmentContractsPageState';

// export default function EditInstallmentProviderPage() {
//   const { form, isLoading, handleSubmit } =
//     useEditInstallmentProviderPageState();
// const {
//   register,
// } = form;

//   if (isLoading) {
//     return <div className="p-8">Đang tải...</div>;
//   }

//   if (!form) {
//     return (
//       <div className="p-8">
//         <p className="text-red-500">Không tìm thấy nhà cung cấp</p>
//         <Link href="/installment-providers">
//           <Button className="mt-4">Quay lại</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8 space-y-8">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Link href="/installment-providers">
//           <Button variant="outline" size="icon">
//             <ArrowLeft size={20} />
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Cập nhật nhà cung cấp</h1>
//           <p className="text-muted-foreground">Chỉnh sửa thông tin nhà cung cấp trả góp</p>
//         </div>
//       </div>

//       {/* Form */}
//       <Card>
//         <CardHeader>
//           <CardTitle>{formData.name}</CardTitle>
//           <CardDescription>Cập nhật thông tin chi tiết của nhà cung cấp</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">
//                 Tên nhà cung cấp <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="name"
//                 placeholder="VD: FE Credit, Home Credit"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//               <p className="text-xs text-muted-foreground">
//                 Nhập tên nhà cung cấp dịch vụ trả góp
//               </p>
//             </div>

//             {/* Phone */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">
//                 Số điện thoại <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="phone"
//                 placeholder="VD: 1900-1900"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//               <p className="text-xs text-muted-foreground">
//                 Số điện thoại liên hệ của nhà cung cấp
//               </p>
//             </div>

//             {/* API Endpoint */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">
//                 API Endpoint <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="apiEndpoint"
//                 type="url"
//                 placeholder="https://api.example.com"
//                 value={formData.apiEndpoint}
//                 onChange={handleChange}
//                 required
//               />
//               <p className="text-xs text-muted-foreground">
//                 URL endpoint API của nhà cung cấp
//               </p>
//             </div>

//             {/* Active Status */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={handleChange}
//                   className="w-4 h-4 rounded border-input"
//                 />
//                 <span className="text-sm font-medium">Kích hoạt nhà cung cấp này</span>
//               </label>
//               <p className="text-xs text-muted-foreground">
//                 Chỉ những nhà cung cấp kích hoạt mới có thể sử dụng được
//               </p>
//             </div>

//             {/* Info */}
//             <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
//               <p>ID: {formData.id}</p>
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-4 pt-4">
//               <Button type="submit" className="flex-1">
//                 Cập nhật nhà cung cấp
//               </Button>
//               <Link href="/installment-providers" className="flex-1">
//                 <Button type="button" variant="outline" className="w-full">
//                   Hủy
//                 </Button>
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

export default function Page() {
  return <div>Edit</div>;
}