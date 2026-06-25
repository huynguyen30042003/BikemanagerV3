"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Edit2, Plus, Eye, X } from "lucide-react";
import {
	useCancelPurchaseOrder,
	useGetPurchaseOrder,
} from "@/hooks/PurchaseOrder/usePurchaOrder";
import { usePurchaseOrdersPageState } from "@/hooks/PurchaseOrder/usePurchaseOrdersPageState";
import { Column, Table } from "@/components/ui/Table";
import { PurchaseOrderResponse } from "@/types/supplier/purchase-orders";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetWarehouse } from "@/hooks/Warehouses/useWarehouse";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useGetSupplier } from "@/hooks/Supplier/useSupplier";
const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
	}).format(value);
};
const statusConfig: Record<string, string> = {
	Draft: "bg-gray-100 text-gray-800",
	Approved: "bg-blue-100 text-blue-800",
	Receiving: "bg-yellow-100 text-yellow-800",
	Completed: "bg-green-100 text-green-800",
	Cancelled: "bg-red-100 text-red-800",
};
export default function PurchaseOrdersPageClient() {
	const router = useRouter();
	const {
		page,
		setPage,
		pageSize,
		searchInput,
		searchTerm,
		handleSearch,
		status,
		handleStatus,
		toDate,
		handleToDate,
		fromDate,
		handleFromDate,
		supplierId,
		handleSupplierId,
		warehouseId,
		handleWarehouseId,
		cancelOpen,
		setCancelOpen,
		selectedPO,
		setSelectedPO,
	} = usePurchaseOrdersPageState();
	const { data: purchaseOrders } = useGetPurchaseOrder({
		Keyword: searchTerm,
		SupplierId: supplierId === "all" ? undefined : supplierId,
		WarehouseId: warehouseId === "all" ? undefined : warehouseId,
		FromDate: fromDate,
		Status: status === "all" ? undefined : status,
		ToDate: toDate,
		PageNumber: page,
		PageSize: pageSize,
	});
	const { data: supplierData, isLoading: isLoadingSupplier } = useGetSupplier(
		{
			IsActive: true,
			PageNumber: 1,
			PageSize: 100,
		},
	);
	const { data: warehouseData, isLoading: isLoadingWarehouse } =
		useGetWarehouse({
			Page: 1,
			PageSize: 100,
		});
	const cancelPurchaseOrder = useCancelPurchaseOrder();
	const handleConfirmCancel = async () => {
		if (!selectedPO) return;
		if (selectedPO.status === "Cancelled") {
			alert("Purchase order has been Canceled");
			setCancelOpen(false);
			return;
		}

		try {
			await cancelPurchaseOrder.mutateAsync(selectedPO.id);
			setCancelOpen(false);
			setSelectedPO(null);
		} catch (error) {
			console.error("Failed to delete brand:", error);
		}
	};

	const today = new Date().toISOString().split("T")[0];
	const handleCancelPurchaseOrder = (
		purchaseOrder: PurchaseOrderResponse,
	) => {
		setSelectedPO(purchaseOrder);
		setCancelOpen(true);
	};
	const totalAmount = purchaseOrders?.items
		?.filter((e) => e.status === "Completed")
		.reduce((sum, po) => sum + po.totalAmount, 0);
	const columns: Column<PurchaseOrderResponse>[] = [
		{
			key: "code",
			title: "code",
			classNameHeader: "text-left",
		},
		{
			key: "supplierName",
			title: "Nhà phân phối",
			classNameHeader: "text-left",
		},
		{
			key: "totalAmount",
			title: "Tổng giá trị",
			classNameHeader: "text-left",
			classNameItem: "text-right",
			render: (_value, row) => (
				<>{formatCurrency(row.totalAmount ?? 0).split(" ")[0]}</>
			),
		},
		{
			key: "discountAmount",
			title: "Giảm giá",
			classNameHeader: "text-left",
		},
		{
			key: "status",
			title: "Trạng thái",
			classNameHeader: "text-left",
			render: (_value, row) => (
				<span
					className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
						statusConfig[row.status] ?? "bg-gray-100 text-gray-800"
					}`}
				>
					{row.status}
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
						onClick={() =>
							router.push(`/admin/purchase-orders/${row.id}`)
						}
						aria-label={`Xem thương hiệu ${row.code}`}
					>
						<Eye size={16} />
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							router.push(`/admin/purchase-orders/${row.id}/edit`)
						}
						aria-label={`Chỉnh sửa thương hiệu ${row.code}`}
					>
						<Edit2 size={16} />
					</Button>
					<Button
						size="sm"
						variant="outline"
						disabled={row.status === "Cancelled"}
						onClick={() => handleCancelPurchaseOrder(row)}
						aria-label={`Hủy đơn đặt hàng ${row.code}`}
					>
						<X size={16} />
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
							Đơn mua hàng
						</h1>
						<p className="text-muted-foreground">
							Quản lý đơn mua hàng từ nhà cung cấp
						</p>
					</div>
					<Link href="/admin/purchase-orders/new">
						<Button>
							<Plus size={18} />
							<span>Tạo đơn mua</span>
						</Button>
					</Link>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card className="gap-0">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Tổng đơn mua
							</CardTitle>
						</CardHeader>
						<CardContent>
							{
								<div className="text-2xl font-bold">
									{purchaseOrders?.totalItems}
								</div>
							}
						</CardContent>
					</Card>
					<Card className="gap-0">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Bản nháp
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									purchaseOrders?.items?.filter(
										(p) => p.status === "Draft",
									).length
								}
							</div>
						</CardContent>
					</Card>
					<Card className="gap-0">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Chờ duyệt
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									purchaseOrders?.items?.filter(
										(p) => p.status === "Submitted",
									).length
								}
							</div>
						</CardContent>
					</Card>
					<Card className="gap-0">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Tổng giá trị
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-xl font-bold">
								{formatCurrency(totalAmount ?? 0).split(" ")[0]}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Search and Filter */}
				<Card>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-6 gap-4">
							<div>
								<label className="text-sm font-medium mb-2 block">
									Mã đơn hàng
								</label>
								<Input
									placeholder="Tìm kiếm..."
									value={searchInput}
									onChange={(e) =>
										handleSearch(e.target.value)
									}
								/>
							</div>
							<div>
								<label className="text-sm font-medium mb-2 block">
									Từ ngày
								</label>

								<div className="relative ">
									<Input
										max={toDate || today}
										type="date"
										value={fromDate}
										onChange={(e) =>
											handleFromDate(e.target.value)
										}
									/>
								</div>
							</div>

							<div>
								<label className="text-sm font-medium mb-2 block">
									Đến ngày
								</label>

								<div className="relative">
									<Input
										max={today}
										type="date"
										value={toDate}
										onChange={(e) =>
											handleToDate(e.target.value)
										}
									/>
								</div>
							</div>
							<div>
								<label className="text-sm font-medium mb-2 block">
									Nhà Phân Phối
								</label>
								<Select
									value={supplierId}
									onValueChange={handleSupplierId}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Nhà Phân Phối" />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="all">All</SelectItem>

										{!isLoadingSupplier &&
											supplierData?.items?.map(
												(supplier) => (
													<SelectItem
														key={supplier.id}
														value={supplier.id}
													>
														{supplier.name}
													</SelectItem>
												),
											)}
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm font-medium mb-2 block">
									Nhà kho
								</label>
								<Select
									value={warehouseId}
									onValueChange={handleWarehouseId}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Nhà kho" />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="all">All</SelectItem>

										{!isLoadingWarehouse &&
											warehouseData?.items?.map(
												(warehouse) => (
													<SelectItem
														key={warehouse.id}
														value={warehouse.id}
													>
														{warehouse.name}
													</SelectItem>
												),
											)}
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm font-medium mb-2 block">
									Trạng thái đơn
								</label>
								<Select
									value={status}
									onValueChange={handleStatus}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Trạng thái đơn" />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										<SelectItem value="Draft">
											Draft
										</SelectItem>
										<SelectItem value="Approved">
											Approved
										</SelectItem>
										<SelectItem value="Receiving">
											Receiving
										</SelectItem>
										<SelectItem value="Completed">
											Completed
										</SelectItem>
										<SelectItem value="Cancelled">
											Cancelled
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Purchase Orders List */}
				<div className="">
					<div className="">
						{(purchaseOrders?.items?.length ?? 0) > 0 ? (
							<div className="overflow-x-auto">
								<Table<PurchaseOrderResponse>
									showIndex
									data={purchaseOrders?.items ?? []}
									columns={columns}
								/>
							</div>
						) : (
							<p className="text-center text-muted-foreground py-8">
								Không tìm thấy đơn mua hàng nào
							</p>
						)}
					</div>
					<div className="flex flex-col gap-3 px-4 py-6 md:flex-row md:items-center md:justify-between">
						<div>
							Trang {page} / {purchaseOrders?.totalPages}
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
								{ length: purchaseOrders?.totalPages ?? 1 },
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
								disabled={page === purchaseOrders?.totalPages}
								onClick={() => setPage((prev) => prev + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				</div>
				<ConfirmDialog
					open={cancelOpen}
					onOpenChange={setCancelOpen}
					variant="delete"
					title="Xóa purchase-order"
					description={`Bạn có chắc muốn hủy bỏ đơn "${selectedPO?.code ?? ""}" không?`}
					confirmText="Xóa"
					loading={cancelPurchaseOrder.isPending}
					onConfirm={handleConfirmCancel}
				/>
			</div>
	);
}
