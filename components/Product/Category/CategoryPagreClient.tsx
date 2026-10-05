"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { useDanhMucChiTiet } from "@/hooks/DanhMuc/useDanhMucChiTiet";
import { DanhMucChungResponse } from "@/types/product/category";
import Image from "next/image";
import { Check, ImagePlus, SquarePen, Trash, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/ui/selectSearch";

function CategoryPagreClient() {
	const {
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
	} = useDanhMucChiTiet();
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
							Danh mục chi tiết
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

					{isLoading ? (
						<Skeleton className="h-10 flex-1" />
					) : (
						<SearchSelect
							className="flex-1"
							value={parentId}
							options={dataDanhMucChung.items.map(
								(prev: DanhMucChungResponse) => {
									return { value: prev.id, label: prev.name };
								},
							)}
							onChange={(e) => setParentId(+e)}
						/>
					)}
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
							data={dataDanhMucChungChiTiet?.items}
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
								Thêm mới danh mục chi tiết
							</h2>
						</div>
						<div className="flex-1 overflow-y-auto p-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-2 flex flex-col gap-1">
									<label>
										Danh mục chung
										<span className="text-red-600"> *</span>
									</label>

									{isLoading ? (
										<Skeleton className="h-10 flex-1" />
									) : (
										<SearchSelect
											className="flex-1"
											value={dataAdd.parentId || ""}
											options={dataDanhMucChung.items.map(
												(
													prev: DanhMucChungResponse,
												) => {
													return {
														value: prev.id,
														label: prev.name,
													};
												},
											)}
											onChange={(e) =>
												setDataAdd((prev) => ({
													...prev,
													parentId: +e | 0,
												}))
											}
										/>
									)}

									{errors.parentId && (
										<p className="text-sm text-red-600">
											{errors.parentId}
										</p>
									)}
								</div>
								<div className="col-span-2 flex flex-col gap-1">
									<label>
										Tên danh mục chi tiết
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

								<div className="col-span-1 flex h-16 items-center gap-2">
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
										{" "}
										Sử dụng{" "}
									</label>
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
										Danh mục chung
										<span className="text-red-600"> *</span>
									</label>

									{isLoading ? (
										<Skeleton className="h-10 flex-1" />
									) : (
										<SearchSelect
											className="flex-1"
											value={dataUpdate.parentId || 0}
											options={dataDanhMucChung.items.map(
												(
													prev: DanhMucChungResponse,
												) => {
													return {
														value: prev.id,
														label: prev.name,
													};
												},
											)}
											onChange={(e) =>
												setDataUpdate((prev) => ({
													...prev,
													parentId: +e | 0,
												}))
											}
										/>
									)}

									{errors.parentId && (
										<p className="text-sm text-red-600">
											{errors.parentId}
										</p>
									)}
								</div>
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
}

export default CategoryPagreClient;
