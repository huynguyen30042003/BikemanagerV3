"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
	useGetInstallmentProviderById,
	useUpdateInstallmentProvider,
} from "../useInstallmentProviders";
import { InstallmentProviderResponse } from "@/types/order/installment-provider";
export function useEditInstallmentProvidersPageState() {
	const router = useRouter();
	const params = useParams();
	const providerId = params.id as string;
	const {
		data: installmentProviderData,
		isLoading: isLoadingInstallmentProvider,
	} = useGetInstallmentProviderById(providerId);

	const updateInstallmentProvider = useUpdateInstallmentProvider();
	const [formData, setFormData] = useState<InstallmentProviderResponse>({
		id: providerId,
		name: "",
		phone: "",
		apiEndpoint: "",
		isActive: false,
	});

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
		updateInstallmentProvider.mutate(
			{
				id: formData.id,
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
		installmentProviderData,
		isLoadingInstallmentProvider,
		formData,
		setFormData,
		handleChange,
		handleSubmit,
	};
}
