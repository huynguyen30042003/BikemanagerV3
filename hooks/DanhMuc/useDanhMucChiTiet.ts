"use client";

import {
	DEBOUNCE_DELAY,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { useEffect, useState } from "react";
import {
	useCreateCategory,
	useDeleteCategory,
	useGetDanhMucChung,
	useUpdateCategory,
} from "../Product/useCategory";
import { useDebounceSearch } from "../useDebounceSearch";
import { z } from "zod";
import { toast } from "sonner";
import {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "@/types/product/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const schema = z.object({
	parentId: z.number().min(1, "Vui lòng chọn danh mục chung"),
	name: z.string().min(1, "Vui lòng nhập tên danh mục"),
	slug: z.string().min(1, "Vui lòng nhập slug"),
});
export function useDanhMucChiTiet() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [page, setPage] = useState(DEFAULT_PAGE);
	const pageSize = DEFAULT_PAGE_SIZE;
	const [parentId, setParentId] = useState<number>( Number(searchParams?.get("parentId") ?? 0) );
	const [open, setOpen] = useState<boolean>(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [openUpdate, setOpenUpdate] = useState<boolean>(false);
	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageUpdatePreview, setImageUpdatePreview] = useState<string | null>(
		null,
	);
	const [selectDanhMuc, setSelectDanhMuc] = useState<number>(0);
	const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
		delay: DEBOUNCE_DELAY,
		initialValue: "",
	});
	const { data: dataDanhMucChung, isLoading } = useGetDanhMucChung({
		search: "",
		parentId: 0,
		page: 0,
		pageSize: 1000
	});
	const { data: dataDanhMucChungChiTiet, isLoading: isLoadingDanhMucChiTiet } = useGetDanhMucChung(
		{
			search: searchTerm,
			parentId: parentId,
			page: page,
			pageSize: pageSize,
		},
		true,
	);
	const [dataAdd, setDataAdd] = useState<CreateCategoryRequest>({
		parentId: 0,
		name: "",
		slug: "",
		description: "",
		isActive: true,
	});
	const [dataUpdate, setDataUpdate] = useState<UpdateCategoryRequest>({
		id: 0,
		parentId: 0,
		name: "",
		slug: "",
		description: "",
		isActive: true,
		xoa: false,
	});
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();
	const deleteCategory = useDeleteCategory();
	useEffect(() => {
		const query = new URLSearchParams();
		query.set("parentId", parentId.toString());
		router.replace(`${pathname}?${query.toString()}`);
	}, [parentId, pathname, router]);
	const handleGenerateSlug = () => {
		const slug = dataAdd.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/đ/g, "d")
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");

		setDataAdd((prev) => ({
			...prev,
			slug,
		}));
	};
	const handleGenerateSlugUpdate = () => {
		const slug = dataUpdate.name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/đ/g, "d")
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");

		setDataUpdate((prev) => ({
			...prev,
			slug,
		}));
	};
	const handleImageAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		if (imagePreview) {
			URL.revokeObjectURL(imagePreview);
		}

		const previewUrl = URL.createObjectURL(file);

		setDataAdd((prev) => ({
			...prev,
			image: file,
		}));

		setImagePreview(previewUrl);
	};
	const clearImageAdd = () => {
		if (imagePreview) {
			URL.revokeObjectURL(imagePreview);
		}

		setDataAdd((prev) => ({
			...prev,
			image: undefined,
		}));

		setImagePreview(null);
	};
	const handleImageUpdateChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];

		if (!file) return;

		if (imageUpdatePreview) {
			URL.revokeObjectURL(imageUpdatePreview);
		}

		const previewUrl = URL.createObjectURL(file);

		setDataUpdate((prev) => ({
			...prev,
			image: file,
		}));

		setImageUpdatePreview(previewUrl);
	};
	const clearImageUpdate = () => {
		if (imageUpdatePreview) {
			URL.revokeObjectURL(imageUpdatePreview);
		}

		setDataUpdate((prev) => ({
			...prev,
			image: undefined,
			xoa: !!prev.imageUrl ? true : false,
		}));

		setImageUpdatePreview(null);
	};
	const handleModalAdd = () => {
		resetModalAdd();
		setOpen(true);
	};
	const resetModalAdd = () => {
		setDataAdd({
			parentId: 0,
			name: "",
			slug: "",
			description: "",
			image: undefined,
			isActive: true,
		});
		setErrors({});
		setImagePreview(null);
	};
	const handleSubmit = async () => {
		console.log("dataAdd,",dataAdd);
		
		const result = schema.safeParse({
			parentId: dataAdd?.parentId,
			name: dataAdd?.name,
			slug: dataAdd?.slug,
		});
		console.log("handleSubmit");
		console.log("result,",result);

		if (!result.success) {
			const newErrors: Record<string, string> = {};

			result.error.issues.forEach((issue) => {
				const field = issue.path[0];

				if (field) {
					newErrors[String(field)] = issue.message;
				}
			});

			setErrors(newErrors);
			return;
		} else {
			setErrors({});
			try {
				const response = await createCategory.mutateAsync(dataAdd);
				if (response?.id) {
					toast.success("Thêm danh mục thành công");
				}
				setOpen(false);
			} catch (error: any) {
				toast.error(
					error.response?.data?.message || "Đã có lỗi sảy ra",
				);
			}
		}
	};
	const handleSubmitUpdate = async () => {
		const result = schema.safeParse({
			id: dataUpdate?.id,
			parentId: dataAdd?.parentId,
			name: dataUpdate?.name,
			slug: dataUpdate?.slug,
		});
		if (!result.success) {
			const newErrors: Record<string, string> = {};

			result.error.issues.forEach((issue) => {
				const field = issue.path[0];

				if (field) {
					newErrors[String(field)] = issue.message;
				}
			});

			setErrors(newErrors);
			return;
		} else {
			setErrors({});
			try {
				const response = await updateCategory.mutateAsync(dataUpdate);
				if (response?.id) {
					toast.success("Cập nhật danh mục thành công");
					setOpenUpdate(false);
				}
			} catch (error: any) {
				toast.error(
					error.response?.data?.message || "Đã có lỗi sảy ra",
				);
			}
		}
	};
	const handleSubmitDelete = async () => {
		if (!selectDanhMuc) return;
		try {
			const response = await deleteCategory.mutateAsync(selectDanhMuc);
			if (response?.success) {
				toast.success("Xóa danh mục thành công");
				setOpenDelete(false);
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Đã có lỗi sảy ra");
		}
	};
	const handleSearch = (value: string) => {
		setSearchInput(value);
		setPage(DEFAULT_PAGE);
	};
	return {
		page,
		setPage,
		pageSize,
		searchInput,
		parentId,
		setParentId,
		handleSearch,
		dataDanhMucChung,
		dataDanhMucChungChiTiet,
		isLoading,
		isLoadingDanhMucChiTiet,
		setDataUpdate,
		setOpenUpdate,
		setErrors,
		setImageUpdatePreview,
		setSelectDanhMuc,
		setOpenDelete,
		handleModalAdd,
		open,
		setOpen,
		dataAdd,
		setDataAdd,
		errors,
		handleGenerateSlug,
		imagePreview,
		clearImageAdd,
		handleImageAddChange,
		handleSubmit,
		openUpdate,
		dataUpdate,
		handleGenerateSlugUpdate,
		imageUpdatePreview,
		clearImageUpdate,
		handleImageUpdateChange,
		handleSubmitUpdate,
		openDelete,
		handleSubmitDelete,
	};
}
