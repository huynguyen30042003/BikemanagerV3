"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash2, Edit2, Plus } from "lucide-react";
import { useInstallmentProvidersPageState } from "@/hooks/InstallmentProviders/PageState/useInstallmentProvidersPageState";
import { Column, Table } from "@/components/ui/Table";
import { InstallmentProviderResponse } from "@/types/order/installment-provider";
import ConfirmDialog from "@/components/Common/ConfirmDialog";

export default function InstallmentProvidersPageClient() {
	const {
		page,
		setPage,
		searchInput,
		handleSearch,
		installmentProviderData,
		handleConfirmDelete,
		isOpenDelete,
		setIsOpenDelete,
		deleteInstallmentProvider,
		handleDeleteform,
	} = useInstallmentProvidersPageState();
	const columns: Column<InstallmentProviderResponse>[] = [
		{
			key: "name",
			title: "Nhà phân phối",
			classNameHeader: "text-left",
		},
		{
			key: "phone",
			title: "SĐT",
			classNameHeader: "text-left",
			classNameItem: "text-left",
		},
		{
			key: "isActive",
			title: "Trạng Thái",
			classNameHeader: "text-left",
		},
		{
			key: "actions",
			title: "Hành động",
			classNameHeader: "text-center",
			classNameItem: "text-center",
			render: (_value, row) => (
				<div className="flex justify-end gap-2">
					<Link href={`/admin/installment-providers/${row.id}/edit`}>
						<Button variant="outline" size="sm">
							<Edit2 size={16} />
						</Button>
					</Link>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleDeleteform(row)}
					>
						<Trash2 size={16} />
					</Button>
				</div>
			),
		},
	];
	return (
			<div className="p-4 md:p-8 space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							Nhà cung cấp trả góp
						</h1>
						<p className="text-muted-foreground">
							Quản lý các nhà cung cấp dịch vụ trả góp
						</p>
					</div>
					<Link href="/installment-providers/new">
						<Button className="gap-2">
							<Plus size={18} />
							Thêm nhà cung cấp
						</Button>
					</Link>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Tổng cộng
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{installmentProviderData?.totalItems}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card className="gap-2">
					<CardHeader>
						<CardTitle>Bộ lọc</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Input
									placeholder="Tìm kiếm..."
									value={searchInput}
									onChange={(e) =>
										handleSearch(e.target.value)
									}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Providers Grid */}
				<Card>
					<CardHeader>
						<CardTitle>Danh sách nhà cung cấp</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="">
							<div className="">
								{(installmentProviderData?.items?.length ?? 0) >
								0 ? (
									<div className="overflow-x-auto">
										<Table<InstallmentProviderResponse>
											showIndex
											data={
												installmentProviderData?.items ??
												[]
											}
											columns={columns}
										/>
									</div>
								) : (
									<p className="text-center text-muted-foreground py-8">
										Không tìm thấy nhà cung cấp nào
									</p>
								)}
							</div>
							<div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
								<div>
									Trang {page} /{" "}
									{installmentProviderData?.totalPages}
								</div>

								<div className="flex flex-wrap gap-2">
									<Button
										type="button"
										variant="outline"
										disabled={page === 1}
										onClick={() =>
											setPage((prev) => prev - 1)
										}
									>
										Previous
									</Button>

									{Array.from(
										{
											length:
												installmentProviderData?.totalPages ??
												1,
										},
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
										disabled={
											page ===
											installmentProviderData?.totalPages
										}
										onClick={() =>
											setPage((prev) => prev + 1)
										}
									>
										Next
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<ConfirmDialog
					open={isOpenDelete}
					onOpenChange={setIsOpenDelete}
					variant="delete"
					title="Xóa purchase-order"
					description={`Bạn có chắc muốn xóa ngân hàng này không?`}
					confirmText="Xóa"
					loading={deleteInstallmentProvider.isPending}
					onConfirm={handleConfirmDelete}
				/>
			</div>
	);
}
