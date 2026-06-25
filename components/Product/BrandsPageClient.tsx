"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, Edit2, Plus, Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/Common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, type Column } from "@/components/ui/Table";
import { useDeleteBrands, useGetBrands } from "@/hooks/Product/useBrand";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { brandRes } from "@/types/product/brand";
import { Image } from "@/components/ui/image";

type BrandStatusFilter = "all" | "active" | "inactive";

const formatStatusLabel = (isActive: boolean) =>
	isActive ? "Hoạt động" : "Ngừng hoạt động";

export default function BrandsPageClient () {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const searchFromUrl = searchParams.get("search") || "";
	const pageFromUrl = Number(searchParams.get("page")) || 1;
	const pageSizeFromUrl = Number(searchParams.get("pageSize")) || 10;

	const [page, setPage] = useState(pageFromUrl);
	const pageSize = pageSizeFromUrl;
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState<brandRes | null>(null);
	const [statusFilter, setStatusFilter] = useState<BrandStatusFilter>("all");

	const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
		delay: 500,
		initialValue: searchFromUrl,
	});

	const { data: dataBrand, isLoading: isLoadingBrand } = useGetBrands({
		search: searchTerm,
		page,
		pageSize,
	});

	const deleteBrand = useDeleteBrands();

	useEffect(() => {
		const query = new URLSearchParams();

		if (searchTerm) {
			query.set("search", searchTerm);
		}

		query.set("page", page.toString());
		query.set("pageSize", pageSize.toString());

		router.replace(`${pathname}?${query.toString()}`);
	}, [searchTerm, page, pageSize, pathname, router]);

	const handleSearchChange = (value: string) => {
		setSearchInput(value);
		setPage(1);
	};

	const handleDeleteBrand = (brand: brandRes) => {
		setSelectedBrand(brand);
		setDeleteOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedBrand) return;

		try {
			await deleteBrand.mutateAsync(selectedBrand.id);
			setDeleteOpen(false);
			setSelectedBrand(null);
		} catch (error) {
			console.error("Failed to delete brand:", error);
		}
	};

	const totalPages: number = dataBrand?.data?.totalPages ?? 1;

	const visibleBrands = useMemo(() => {
		const brands: brandRes[] = dataBrand?.data?.items ?? [];

		if (statusFilter === "all") return brands;
		if (statusFilter === "active")
			return brands.filter((brand: brandRes) => brand.isActive);
		return brands.filter((brand: brandRes) => !brand.isActive);
	}, [dataBrand?.data?.items, statusFilter]);

	const columns: Column<brandRes>[] = [
		{
			key: "name",
			title: "Tên thương hiệu",
			classNameHeader: "text-left",
		},
		{
			key: "slug",
			title: "Slug",
			classNameHeader: "text-left",
		},
		{
			key: "logoUrl",
			title: "Logo",
			classNameHeader: "text-left",
			render: (value) =>
				value ? (
					<Image
						src={String(value)}
						alt="Brand logo"
						className="h-10 w-10 rounded-md object-contain"
					/>
				) : (
					<span className="text-sm text-muted-foreground">
						Không có logo
					</span>
				),
		},
		{
			key: "country",
			title: "Quốc gia",
			classNameHeader: "text-left",
		},
		{
			key: "isActive",
			title: "Trạng thái",
			classNameHeader: "text-left",
			render: (_value, row) => (
				<span
					className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
						row.isActive
							? "bg-green-100 text-green-800"
							: "bg-gray-100 text-gray-800"
					}`}
				>
					{formatStatusLabel(row.isActive)}
				</span>
			),
		},
		{
			key: "createdAt",
			title: "Ngày tạo",
			classNameHeader: "text-left",
			render: (value) => {
				if (!value)
					return (
						<span className="text-sm text-muted-foreground">—</span>
					);

				const date = new Date(String(value));
				return (
					<span>
						{Number.isNaN(date.getTime())
							? String(value)
							: date.toLocaleDateString("vi-VN")}
					</span>
				);
			},
		},
		{
			key: "actions",
			title: "Hành động",
			classNameHeader: "text-center",
			classNameItem: "text-center",
			render: (_value, row) => (
				<div className="flex justify-center gap-2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => router.push(`/admin/brands/${row.id}`)}
						aria-label={`Xem thương hiệu ${row.name}`}
					>
						<Eye size={16} />
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							router.push(`/admin/brands/${row.id}/edit`)
						}
						aria-label={`Chỉnh sửa thương hiệu ${row.name}`}
					>
						<Edit2 size={16} />
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => handleDeleteBrand(row)}
						aria-label={`Xóa thương hiệu ${row.name}`}
					>
						<Trash2 size={16} />
					</Button>
				</div>
			),
		},
	];

	if (isLoadingBrand) {
		return <div className="p-8">Đang tải...</div>;
	}

	return (
			<div className="space-y-6 p-4 py-2">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							Thương hiệu
						</h1>
						<p className="text-muted-foreground">
							Quản lý các thương hiệu xe
						</p>
					</div>

					<Link href="/admin/brands/new">
						<Button>
							<Plus size={18} />
							<span>Thêm thương hiệu</span>
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Tổng thương hiệu
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{dataBrand?.data?.totalItems ?? 0}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Đang hoạt động
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									visibleBrands.filter(
										(brand: brandRes) => brand.isActive,
									).length
								}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Ngừng hoạt động
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									visibleBrands.filter(
										(brand: brandRes) => !brand.isActive,
									).length
								}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Tìm kiếm và lọc</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col gap-4 md:flex-row">
							<Input
								placeholder="Tìm theo tên, slug, hoặc quốc gia..."
								value={searchInput}
								onChange={(e) =>
									handleSearchChange(e.target.value)
								}
								className="flex-1"
							/>

							<div className="flex flex-wrap gap-2">
								{(["all", "active", "inactive"] as const).map(
									(status) => (
										<Button
											key={status}
											type="button"
											variant={
												statusFilter === status
													? "default"
													: "outline"
											}
											onClick={() =>
												setStatusFilter(status)
											}
										>
											{status === "all"
												? "Tất cả"
												: status === "active"
													? "Hoạt động"
													: "Ngừng hoạt động"}
										</Button>
									),
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="pb-0">
					<CardHeader>
						<CardTitle>Danh sách thương hiệu</CardTitle>
					</CardHeader>
					<CardContent>
						{visibleBrands.length > 0 ? (
							<div className="overflow-x-auto">
								<Table<brandRes>
									showIndex
									data={visibleBrands}
									columns={columns}
								/>
							</div>
						) : (
							<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
								Không có thương hiệu nào phù hợp với bộ lọc hiện
								tại.
							</div>
						)}

						<div className="flex flex-col gap-3 border-t px-4 py-6 md:flex-row md:items-center md:justify-between">
							<div>
								Trang {page} / {totalPages}
							</div>

							<div className="flex flex-wrap gap-2">
								<Button
									type="button"
									variant="outline"
									disabled={page === 1}
									onClick={() => setPage((prev) => prev - 1)}
								>
									Previous
								</Button>

								{Array.from(
									{ length: totalPages },
									(_, index) => index + 1,
								).map((currentPage) => (
									<Button
										key={currentPage}
										type="button"
										variant={
											page === currentPage
												? "default"
												: "outline"
										}
										onClick={() => setPage(currentPage)}
									>
										{currentPage}
									</Button>
								))}

								<Button
									type="button"
									variant="outline"
									disabled={page === totalPages}
									onClick={() => setPage((prev) => prev + 1)}
								>
									Next
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				<ConfirmDialog
					open={deleteOpen}
					onOpenChange={setDeleteOpen}
					variant="delete"
					title="Xóa thương hiệu"
					description={`Bạn có chắc muốn xóa "${selectedBrand?.name ?? ""}" không?`}
					confirmText="Xóa"
					loading={deleteBrand.isPending}
					onConfirm={handleConfirmDelete}
				/>
			</div>
	);
}
