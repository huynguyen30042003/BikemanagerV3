"use client";

import { useParams, useRouter } from "next/navigation";
import {
	useGetWarehouseById,
	useUpdateWarehouse,
} from "@/hooks/Warehouses/useWarehouse";
import { useState } from "react";
export function useEditWarehousePageState() {
	const router = useRouter();
	const params = useParams();
	const warehouseId = params.id as string;
	const { data: warehouseData, isLoading: isLoadingWarehouse } =
		useGetWarehouseById(warehouseId);

	const updateWarehouse = useUpdateWarehouse();

	const [formData, setFormData] = useState({
		id: warehouseId,
		name: "",
		address: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name) {
			alert("Vui lòng điền tất cả thông tin bắt buộc");
			return;
		}
		updateWarehouse.mutateAsync(formData)
		alert("Kho hàng đã được cập nhật thành công");
		router.push("/admin/warehouses");
	};
	return {
		formData,
		handleSubmit,
		setFormData,
		warehouseId,
		handleChange,
		warehouseData: warehouseData?.data,
		isLoadingWarehouse,
	};
}
