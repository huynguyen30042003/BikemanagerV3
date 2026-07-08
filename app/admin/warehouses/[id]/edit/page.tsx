"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEditWarehousePageState } from "@/hooks/Warehouses/PageState/useEditWarehousePageState";
import { useEffect } from "react";

export default function EditWarehousePage() {
	const {
		formData,
		setFormData,
		warehouseId,
		handleSubmit,
		handleChange,
		warehouseData,
		isLoadingWarehouse,
	} = useEditWarehousePageState();
	useEffect(() => {
		if (warehouseData) {
			setFormData((prev) => ({...prev,
				name: warehouseData.name,
				address: warehouseData.address || "",
			}));
		}
	}, [setFormData, warehouseData, warehouseId]);

	if (isLoadingWarehouse) {
		return <div className="p-8">Đang tải...</div>;
	}

	return (
		<div className="p-4 md:p-8 space-y-8">
			<Link
				href="/warehouses"
				className="inline-flex items-center gap-2 text-primary hover:underline"
			>
				<ArrowLeft size={18} />
				Quay lại
			</Link>

			<div>
				<h1 className="text-3xl font-bold text-foreground">
					Chỉnh sửa kho hàng
				</h1>
				<p className="text-muted-foreground">
					Cập nhật thông tin kho hàng
				</p>
			</div>

			<Card className="max-w-2xl">
				<CardHeader>
					<CardTitle>Thông tin kho hàng</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Tên kho hàng *
							</label>
							<Input
								name="name"
								placeholder="VD: Kho TP.HCM - Quận 1"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Mã kho *
							</label>
							<Input
								name="code"
								placeholder="VD: WH-HCM-01"
								value={warehouseData?.code}
								disabled={true}
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Địa chỉ
							</label>
							<Input
								name="address"
								placeholder="Số 123, Đường Lê Lợi, Q.1, TP.HCM"
								value={formData.address}
								onChange={handleChange}
							/>
						</div>

						<div className="flex gap-4 pt-4">
							<Button type="submit">Cập nhật</Button>
							<Link href="/admin/warehouses">
								<Button variant="outline">Hủy</Button>
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
