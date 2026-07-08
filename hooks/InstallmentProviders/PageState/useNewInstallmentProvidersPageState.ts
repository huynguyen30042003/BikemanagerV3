"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateInstallmentProvider } from "../useInstallmentProviders";
export function useNewInstallmentProvidersPageState() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		apiEndpoint: "",
		isActive: false,
	});

	const createInstallmentProvider = useCreateInstallmentProvider();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name.trim() || !formData.phone.trim()) {
			alert("Vui lòng điền tất cả thông tin bắt buộc");
			return;
		}
		createInstallmentProvider.mutate(
			{
				Name: formData.name,
				Phone: formData.phone,
				ApiEndpoint: formData.apiEndpoint,
				IsActive: formData.isActive,
			},
			{
				onSuccess: () => {
					router.push("/admin/installment-providers");
				},
			},
		);
	};

	return {
		formData,
		handleChange,
		handleSubmit,
	};
}
