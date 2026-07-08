"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Users, CreditCard } from "lucide-react";
import { useCustomerStaticPageState } from "@/hooks/Customer/CustomerStatic/useCustomerStaticPageState";
import { Column, Table } from "@/components/ui/Table";
import { CustomerStatisticResponse } from "@/types/Customer/CustomerStatistic";
const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
	}).format(value);
};
export default function CustomerStatisticsPage() {
	const {
		page,
		setPage,
		searchInput,
		handleSearch,
		customersStaticData,
		isLoading,
	} = useCustomerStaticPageState();
	const totalCustomers = customersStaticData?.totalItems;
	const totalRevenue = customersStaticData?.items?.reduce(
		(sum, s) => sum + s.totalSpent,
		0,
	);
	const totalOrders = customersStaticData?.items?.reduce(
		(sum, s) => sum + s.totalOrders,
		0,
	);
	const vipCount = customersStaticData?.items?.filter(
		(s) => s.customerLevel === "VIP",
	).length;
	const premiumCount = customersStaticData?.items?.filter(
		(s) => s.customerLevel === "Premium",
	).length;
	const columnsTableCustomersStatic: Column<CustomerStatisticResponse>[] = [
		{
			key: "fullName",
			title: "Họ tên",
			accessor: (row) => row.customer?.fullName ?? "—",
		},
		{
			key: "phoneNumber",
			title: "SĐT",
			accessor: (row) => row.customer?.phoneNumber ?? "—",
		},
		{
			key: "totalOrders",
			title: "Số lần mua",
			classNameItem: "text-right",
		},
		{
			key: "totalSpent",
			title: "Tổng chi",
			classNameItem: "text-right",
		},
		{
			key: "totalRepairs",
			title: "Tổng lần sửa",
			classNameItem: "text-right",
		},
		{
			key: "lastPurchaseAt",
			title: "Lần cuối",
			classNameItem: "text-right",
			render: (value) =>
				value
					? new Date(value as string).toLocaleDateString("vi-VN")
					: "-",
		},
		{
			key: "customerLevel",
			title: "Level",
		},
	];
	if (isLoading) {
		return <div className="p-8">Đang tải...</div>;
	}
	return (
		<div className="p-4 md:p-8 space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground">
					Thống kê khách hàng
				</h1>
				<p className="text-muted-foreground">
					Xem phân tích chi tiết về khách hàng
				</p>
			</div>
			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Users size={16} />
							Tổng khách hàng
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{customersStaticData?.totalItems}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{vipCount} VIP, {premiumCount} Premium
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<CreditCard size={16} />
							Tổng doanh thu
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(totalRevenue || 0).split(" ")[0]}B
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Từ tất cả khách hàng
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<TrendingUp size={16} />
							Tổng đơn hàng
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalOrders}</div>
					</CardContent>
				</Card>
			</div>
			{/* Search */}
			<Card>
				<CardHeader>
					<CardTitle>Tìm kiếm</CardTitle>
				</CardHeader>
				<CardContent>
					<Input
						placeholder="Tìm theo tên, số điện thoại hoặc email..."
						value={searchInput}
						onChange={(e) => handleSearch(e.target.value)}
					/>
				</CardContent>
			</Card>
			{/* Statistics Table */}
			<Card>
				<CardHeader>
					<CardTitle>Danh sách khách hàng</CardTitle>
					<CardDescription>
						{totalCustomers} khách hàng
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						{(customersStaticData?.totalItems ?? 0) > 0 ? (
							<div className="overflow-x-auto">
								<Table<CustomerStatisticResponse>
									showIndex
									data={customersStaticData?.items ?? []}
									columns={columnsTableCustomersStatic}
								/>
							</div>
						) : (
							<p className="text-center text-muted-foreground py-8">
								Không tìm thấy nhà cung cấp nào
							</p>
						)}
					</div>
				</CardContent>
			</Card>
			{(customersStaticData?.totalItems ?? 0) > 0 ? (
				<div className="flex flex-col gap-3 border-t px-4 py-6 md:flex-row md:items-center md:justify-between">
					<div>
						Trang {page} / {customersStaticData?.totalPages}
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
							{ length: customersStaticData?.totalPages || 1 },
							(_, index) => index + 1,
						).map((p) => (
							<Button
								key={p}
								variant={page === p ? "default" : "outline"}
								onClick={() => setPage(p)}
							>
								{p}
							</Button>
						))}
						<Button
							type="button"
							variant="outline"
							disabled={page === customersStaticData?.totalPages}
							onClick={() => setPage((prev) => prev + 1)}
						>
							Next
						</Button>
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
}
