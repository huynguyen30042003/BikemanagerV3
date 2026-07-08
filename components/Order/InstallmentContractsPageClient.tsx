"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash2, Plus, Edit2, Eye } from "lucide-react";
import { useInstallmentContractsPageState } from "@/hooks/InstallmentContracts/PageState/useInstallmentContractsPageState";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import { InstallmentContractsRes } from "@/types/order/installment-contracts";
import { Column, Table } from "@/components/ui/Table";

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
	}).format(value);
};

export default function InstallmentContractsPageClient() {
	const {
		page,
		setPage,
		searchInput,
		handleSearch,
		installmentContractData,
		handleConfirmDelete,
		isOpenDelete,
		setIsOpenDelete,
		deleteInstallmentContract,
		handleDeleteform,
	} = useInstallmentContractsPageState();

	const stats = {
		total: installmentContractData?.totalItems,
		active: installmentContractData?.items?.filter(
			(c) => c.contractStatus === "active",
		).length,
		completed: installmentContractData?.items?.filter(
			(c) => c.contractStatus === "completed",
		).length,
		totalLoan: installmentContractData?.items?.reduce(
			(sum, c) => sum + c.loanAmount,
			0,
		),
	};

	const columns: Column<InstallmentContractsRes>[] = [
		{
			key: "name",
			title: "Nhà phân phối",
			classNameHeader: "text-left",
			accessor: (row) => row.installmentProvider?.name ?? "—",
		},
		{
			key: "phone",
			title: "SĐT",
			classNameHeader: "text-left",
			classNameItem: "text-left",
			accessor: (row) => row.installmentProvider?.phone ?? "—",
		},
		{
			key: "loanAmount",
			title: "Số tiền vay",
			classNameHeader: "text-left",
		},
		{
			key: "downPayment",
			title: "Số tiền đặt cọc",
			classNameHeader: "text-left",
		},
		{
			key: "installmentMonths",
			title: "Số tháng trả góp",
			classNameHeader: "text-left",
		},
		{
			key: "contractStatus",
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
					<Link href={`/admin/installment-contracts/${row.id}`}>
						<Button variant="outline" size="sm">
							<Eye size={16} />
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
							Hợp đồng trả góp
						</h1>
						<p className="text-muted-foreground">
							Quản lý tất cả hợp đồng trả góp
						</p>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Tổng hợp đồng
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats.total}
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
							<div className="text-2xl font-bold text-green-600">
								{stats.active}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Hoàn thành
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{stats.completed}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Tổng tiền vay
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									formatCurrency(stats.totalLoan || 0).split(
										" ",
									)[0]
								}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardHeader>
						<CardTitle>Bộ lọc</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium mb-2 block">
									Số hợp đồng
								</label>
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

				{/* Contracts Table */}
				<Card>
					<CardHeader>
						<CardTitle>Danh sách nhà cung cấp</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="">
							<div className="">
								{(installmentContractData?.items?.length ?? 0) >
								0 ? (
									<div className="overflow-x-auto">
										<Table<InstallmentContractsRes>
											showIndex
											data={
												installmentContractData?.items ??
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
									{installmentContractData?.totalPages}
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
												installmentContractData?.totalPages ??
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
											installmentContractData?.totalPages
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
					loading={deleteInstallmentContract.isPending}
					onConfirm={handleConfirmDelete}
				/>
			</div>
	);
}
