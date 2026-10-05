"use client";

import React, { useState } from "react";
import { Column, Table } from "@/components/ui/Table";
import Image from "next/image";
import {
	CreateCategoryRequest,
	DanhMucChungResponse,
	UpdateCategoryRequest,
} from "@/types/product/category";
import {
	useCreateCategory,
	useDeleteCategory,
	useGetDanhMucChung,
	useUpdateCategory,
} from "@/hooks/Product/useCategory";
import {
	DEBOUNCE_DELAY,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, ImagePlus, SquarePen, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import IntegerInput from "@/components/ui/integerInput";
const schema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên danh mục"),
	slug: z.string().min(1, "Vui lòng nhập slug"),
});
const Page = () => {
	const [page, setPage] = useState(DEFAULT_PAGE);
	const pageSize = DEFAULT_PAGE_SIZE;
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
	const [dataAdd, setDataAdd] = useState<CreateCategoryRequest>({
		parentId: 0,
		name: "",
		slug: "",
		description: "",
		isActive: true,
		sortOrder: 1
	});
	const [dataUpdate, setDataUpdate] = useState<UpdateCategoryRequest>({
		id: 0,
		parentId: 0,
		name: "",
		slug: "",
		description: "",
		isActive: true,
		xoa: false,
		sortOrder: 1
	});
	const { data: dataDanhMucChung, isLoading } = useGetDanhMucChung({
		search: searchTerm,
		parentId: 0,
		page: page,
		pageSize: pageSize,
	});
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();
	const deleteCategory = useDeleteCategory();

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
  			sortOrder: 1

		});
		setErrors({});
		setImagePreview(null);
	};
	const handleSubmit = async () => {
		const result = schema.safeParse({
			name: dataAdd?.name,
			slug: dataAdd?.slug,
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
	const danhMucChungColumns: Column<DanhMucChungResponse>[] = [
		{
			key: "info",
			title: "Tên danh mục",
			classNameItem: "w-[500px]",
			classNameHeader: "text-center text-secondary",
			render: (_v, row) => {
				const linkImage = !!row?.imageUrl
					? `https://localhost:5001${row?.imageUrl}`
					: "";
				return !!linkImage ? (
					<div className="flex items-center gap-2">
						<Image
							src={linkImage}
							alt="thumb"
							className="h-10 w-10 rounded object-cover"
							width={40}
							height={40}
						/>
						<div className="flex flex-col justify-center">
							<p className="text-primary font-bold">
								{row?.name ?? "—"}
							</p>
							<p className="text-secondary">{row?.slug ?? "—"}</p>
						</div>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<div className="flex flex-col justify-center">
							<p className="text-primary font-bold">
								{row?.name ?? "—"}
							</p>
							<p className="text-secondary">{row?.slug ?? "—"}</p>
						</div>
					</div>
				);
			},
		},
		{
			key: "trangThai",
			title: "Trạng thái",
			classNameHeader: "text-center text-secondary",
			classNameItem: "text-center w-[100px]",
			render: (_v, row) =>
				row.isActive ? (
					<div className="flex justify-center">
						<Check size={18} color="#2b7750" />
					</div>
				) : (
					""
				),
		},
		{
			key: "function",
			title: "Sản phẩm",
			classNameItem: "text-center w-[100px]",
			classNameHeader: "text-center text-secondary",
			render: (_v, row) => (
				<div className="flex gap-2 justify-center">
					<SquarePen
						size={18}
						color="#ffee00"
						onClick={() => {
							setDataUpdate({
								id: row.id,
								parentId: row.parentId,
								name: row.name,
								slug: row.slug,
								description: row.description || "",
								isActive: row.isActive,
								imageUrl: row.imageUrl,
								xoa: false,
								sortOrder: row.sortOrder

							});
							setOpenUpdate(true);
							setErrors({});
							setImageUpdatePreview(
								!!row?.imageUrl
									? `https://localhost:5001${row?.imageUrl}`
									: "",
							);
						}}
					/>
					<Trash
						size={18}
						color="#ff0000"
						onClick={() => {
							setSelectDanhMuc(row.id);
							setOpenDelete(true);
						}}
					/>
				</div>
			),
		},
	];
	return (
		<div className={`p-4 md:p-8 h-screen overflow-auto `}>
			{isLoading ? (
				<div className="flex gap-3 flex-col">
					<Skeleton className="h-5 w-36" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-8 w-52" />
						<Skeleton className="h-4 w-80" />
					</div>
				</div>
			) : (
				<div className="flex gap-3 flex-col">
					<div className="flex justify-between items-center">
						<h1 className="text-[28px] font-bold text-header-primary">
							Danh mục chung
						</h1>
						<Button className="h-10 px-4" onClick={handleModalAdd}>
							Thêm mới
						</Button>
					</div>
				</div>
			)}
			<Card className="overflow-visible mt-4">
				<CardHeader>
					<div className="text-primary font-bold text-base">
						Tìm kiếm và lọc
					</div>
				</CardHeader>
				<CardContent className="space-y-4 flex gap-4">
					<Input
						placeholder="Tìm theo tên, email hoặc số điện thoại..."
						value={searchInput}
						onChange={(e) => handleSearch(e.target.value)}
						className="flex-1"
					/>
				</CardContent>
			</Card>
			{isLoading ? (
				<Skeleton className="h-10 w-full" />
			) : (
				<Card className="mt-4">
					<CardHeader className="flex justify-between items-center">
						<div className="text-primary font-bold text-base">
							Thông tin đơn hàng
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-4 w-full">
						<Table<DanhMucChungResponse>
							data={dataDanhMucChung?.items}
							columns={danhMucChungColumns}
							showIndex
						/>
						{/* Pagination */}
						<div className="flex items-center justify-between">
							<div>
								Trang {page} / {dataDanhMucChung.totalPages}
							</div>

							<div className="flex gap-2">
								<Button
									variant="outline"
									disabled={page === 1}
									onClick={() => setPage((prev) => prev - 1)}
								>
									Previous
								</Button>

								{Array.from(
									{ length: dataDanhMucChung.totalPages },
									(_, index) => index + 1,
								).map((p) => (
									<Button
										key={p}
										variant={
											page === p ? "default" : "outline"
										}
									 	onClick={() => setPage(p)}
									>
										{p}
									</Button>
								))}

								<Button
									variant="outline"
									disabled={
										page === dataDanhMucChung.totalPages
									}
									onClick={() => setPage((prev) => prev + 1)}
								>
									Next
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
			{open && (
				<>
					<div
						className="fixed inset-0 z-40 bg-black/40"
						onClick={() => setOpen(false)}
					/>
					<div className="fixed inset-y-0 right-0 z-50 flex w-screen max-w-160 flex-col bg-background shadow-xl">
						<div className="shrink-0 border-b p-4">
							<h2 className="text-lg font-semibold">
								Thêm mới danh mục
							</h2>
						</div>
						<div className="flex-1 overflow-y-auto p-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-2 flex flex-col gap-1">
									<label>
										Tên danh mục
										<span className="text-red-600"> *</span>
									</label>

									<Input
										type="text"
										value={dataAdd.name}
										className="rounded-lg"
										placeholder="Nhập..."
										onChange={(e) =>
											setDataAdd((prev) => ({
												...prev,
												name: e.target.value,
											}))
										}
									/>

									{errors.name && (
										<p className="text-sm text-red-600">
											{errors.name}
										</p>
									)}
								</div>
								<div className="col-span-2 flex flex-col gap-1">
									<label>
										Slug
										<span className="text-red-600"> *</span>
									</label>

									<div className="flex gap-4">
										<Input
											type="text"
											value={dataAdd.slug}
											placeholder="Nhập..."
											className="flex-1 rounded-lg"
											onChange={(e) =>
												setDataAdd((prev) => ({
													...prev,
													slug: e.target.value,
												}))
											}
										/>

										<Button
											type="button"
											onClick={handleGenerateSlug}
											className="h-10"
										>
											Tạo từ tên
										</Button>
									</div>

									{errors.slug && (
										<p className="text-sm text-red-600">
											{errors.slug}
										</p>
									)}
								</div>
								<div className="col-span-1 flex flex-col gap-1 ">
									<label>
										Thứ tự
										<span className="text-red-600"> *</span>
									</label>

									<IntegerInput
										min={1}	
										max={256}
										value={dataAdd?.sortOrder || 1}
										className="rounded-lg"
										placeholder="Nhập..."
										onChange={(e) =>
											setDataAdd((prev) => ({
												...prev,
												sortOrder: +e
											}))
										}
									/>

									{errors.sortOrder && (
										<p className="text-sm text-red-600">
											{errors.sortOrder}
										</p>
									)}
								</div>
								<div className="col-span-1 flex h-10 items-center gap-2 self-end">
									<input
										type="checkbox"
										name="isActiveAdd"
										id="isActiveAdd"
										checked={dataAdd.isActive}
										onChange={(e) =>
											setDataAdd((prev) => ({
												...prev,
												isActive: e.target.checked,
											}))
										}
									/>

									<label htmlFor="isActiveAdd">
										Sử dụng
									</label>
								</div>
								<div className="col-span-1 flex flex-col gap-1">
									<label>Ảnh danh mục</label>

									{imagePreview ? (
										<div className="relative w-full max-w-xs">
											<Image
												src={imagePreview}
												alt="Preview"
												width={1}
												height={1}
												className="h-48 w-full rounded-lg border object-cover"
											/>

											<button
												type="button"
												onClick={clearImageAdd}
												className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
											>
												<X size={14} />
											</button>
										</div>
									) : (
										<label className="flex h-48 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition hover:border-primary hover:text-primary">
											<ImagePlus size={28} />

											<span className="text-sm">
												{" "}
												Chọn ảnh danh mục{" "}
											</span>

											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={handleImageAddChange}
											/>
										</label>
									)}
								</div>

								

								<div className="col-span-2 flex flex-col gap-1">
									<label>Mô tả</label>

									<Textarea
										value={dataAdd.description}
										onChange={(e) =>
											setDataAdd((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
										placeholder="Nhập..."
										className="h-30 resize-none rounded-lg"
									/>
								</div>
							</div>
						</div>

						<div className="flex shrink-0 gap-4 border-t p-4">
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => setOpen(false)}
							>
								Hủy
							</Button>

							<Button className="flex-1" onClick={handleSubmit}>
								Lưu
							</Button>
						</div>
					</div>
				</>
			)}

			{openUpdate && (
				<>
					<div
						className="fixed inset-0 z-40 bg-black/40"
						onClick={() => setOpenUpdate(false)}
					/>

					<div className="fixed inset-y-0 right-0 z-50 flex w-screen max-w-160 flex-col bg-background shadow-xl">
						<div className="shrink-0 border-b p-4">
							<h2 className="text-lg font-semibold">
								Cập nhật danh mục
							</h2>
						</div>

						<div className="flex-1 overflow-y-auto p-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-2 flex flex-col gap-1">
									<label>
										Tên danh mục
										<span className="text-red-600"> *</span>
									</label>

									<Input
										type="text"
										value={dataUpdate.name}
										className="rounded-lg"
										placeholder="Nhập..."
										onChange={(e) =>
											setDataUpdate((prev) => ({
												...prev,
												name: e.target.value,
											}))
										}
									/>

									{errors.name && (
										<p className="text-sm text-red-600">
											{errors.name}
										</p>
									)}
								</div>

								<div className="col-span-2 flex flex-col gap-1">
									<label>
										Slug
										<span className="text-red-600"> *</span>
									</label>

									<div className="flex gap-4">
										<Input
											type="text"
											value={dataUpdate.slug}
											placeholder="Nhập..."
											className="flex-1 rounded-lg"
											onChange={(e) =>
												setDataUpdate((prev) => ({
													...prev,
													slug: e.target.value,
												}))
											}
										/>

										<Button
											type="button"
											onClick={handleGenerateSlugUpdate}
											className="h-10"
										>
											Tạo từ tên
										</Button>
									</div>

									{errors.slug && (
										<p className="text-sm text-red-600">
											{errors.slug}
										</p>
									)}
								</div>
								<div className="col-span-1 flex flex-col gap-1 ">
									<label>
										Thứ tự
										<span className="text-red-600"> *</span>
									</label>

									<IntegerInput
										min={1}	
										max={256}
										value={dataUpdate?.sortOrder || 1}
										className="rounded-lg"
										placeholder="Nhập..."
										onChange={(e) =>
											setDataUpdate((prev) => ({
												...prev,
												sortOrder: +e
											}))
										}
									/>

									{errors.sortOrder && (
										<p className="text-sm text-red-600">
											{errors.sortOrder}
										</p>
									)}
								</div>
								<div className="col-span-1 flex h-16 items-center gap-2">
									<input
										type="checkbox"
										name="isActiveUpdate"
										id="isActiveUpdate"
										checked={dataUpdate.isActive}
										onChange={(e) =>
											setDataUpdate((prev) => ({
												...prev,
												isActive: e.target.checked,
											}))
										}
									/>

									<label htmlFor="isActiveUpdate">
										Sử dụng
									</label>
								</div>
								<div className="col-span-1 flex flex-col gap-1">
									<label>Ảnh danh mục</label>

									{imageUpdatePreview ? (
										<div className="relative w-full max-w-xs">
											<Image
												src={imageUpdatePreview}
												alt="Preview"
												width={2000}
												height={2000}
												className="h-48 w-full rounded-lg border object-cover"
											/>

											<button
												type="button"
												onClick={clearImageUpdate}
												className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
											>
												<X size={14} />
											</button>
										</div>
									) : (
										<label className="flex h-48 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition hover:border-primary hover:text-primary">
											<ImagePlus size={28} />

											<span className="text-sm">
												Chọn ảnh danh mục
											</span>

											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={
													handleImageUpdateChange
												}
											/>
										</label>
									)}
								</div>
								<div className="col-span-2 flex flex-col gap-1">
									<label>Mô tả</label>

									<Textarea
										value={dataUpdate.description}
										onChange={(e) =>
											setDataUpdate((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
										placeholder="Nhập..."
										className="h-30 resize-none rounded-lg"
									/>
								</div>
							</div>
						</div>

						<div className="flex shrink-0 gap-4 border-t p-4">
							<Button
								variant="outline"
								className="flex-1"
								onClick={() => setOpenUpdate(false)}
							>
								Hủy
							</Button>

							<Button
								className="flex-1"
								onClick={handleSubmitUpdate}
							>
								Lưu
							</Button>
						</div>
					</div>
				</>
			)}
			{openDelete && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
					onClick={() => setOpenDelete(false)}
				>
					<div
						className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-lg font-semibold">Xác nhận xóa</h2>

						<p className="mt-2 text-sm text-muted-foreground">
							Bạn có chắc chắn muốn xóa danh mục này không? Hành
							động này không thể hoàn tác.
						</p>

						<div className="mt-6 flex justify-end gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpenDelete(false)}
							>
								Hủy
							</Button>

							<Button
								type="button"
								variant="destructive"
								onClick={handleSubmitDelete}
							>
								Xóa
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Page;
