"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useViewInstallmentContractsPageState } from "@/hooks/InstallmentContracts/PageState/useViewInstallmentContractsPageState";

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
	}).format(value);
};

const getStatusLabel = (status: string) => {
	const labels: Record<string, string> = {
		active: "Đang hoạt động",
		completed: "Hoàn thành",
		cancelled: "Đã hủy",
	};
	return labels[status] || status;
};

export default function ContractDetailPage() {
	const { contract, provider, order } = useViewInstallmentContractsPageState();
	if (!contract) {
		return (
			<div className="p-8 text-center">
				<p>Không tìm thấy hợp đồng</p>
				<Link
					href="/admin/installment-contracts"
					className="mt-4 inline-block"
				>
					<Button>Quay lại</Button>
				</Link>
			</div>
		);
	}

	const totalPayment = contract.monthlyPayment * contract.installmentMonths;
	const totalInterest = totalPayment - contract.loanAmount;

	return (
		<div className="p-4 md:p-8 space-y-8">
			{/* Header */}
			<div>
				<Link
					href="/admin/installment-contracts"
					className="inline-block mb-4"
				>
					<Button variant="outline" size="sm" className="gap-2">
						<ArrowLeft size={16} />
						Quay lại
					</Button>
				</Link>
				<h1 className="text-3xl font-bold text-foreground">
					{contract.contractNumber}
				</h1>
				<p className="text-muted-foreground">
					Chi tiết hợp đồng trả góp
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Contract Status */}
					<Card>
						<CardHeader>
							<CardTitle>Thông tin hợp đồng</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">
										Trạng thái
									</p>
									<p className="font-medium capitalize">
										{getStatusLabel(
											contract.contractStatus,
										)}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Ngày tạo
									</p>
									<p className="font-medium">
										{new Date(
											contract.createdAt,
										).toLocaleDateString("vi-VN")}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Loan Details */}
					<Card>
						<CardHeader>
							<CardTitle>Chi tiết khoản vay</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
									<p className="text-sm text-muted-foreground mb-1">
										Số tiền vay
									</p>
									<p className="font-bold text-lg">
										{formatCurrency(contract.loanAmount)}
									</p>
								</div>
								<div className="p-3 bg-green-50 rounded-lg border border-green-200">
									<p className="text-sm text-muted-foreground mb-1">
										Trả trước
									</p>
									<p className="font-bold text-lg">
										{formatCurrency(contract.downPayment)}
									</p>
								</div>
							</div>
							<div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
								<p className="text-sm text-muted-foreground mb-1">
									Lãi suất năm
								</p>
								<p className="font-bold text-lg">
									{contract.interestRate}%
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Payment Schedule */}
					<Card>
						<CardHeader>
							<CardTitle>Lịch thanh toán</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">
										Số tháng
									</p>
									<p className="font-medium text-lg">
										{contract.installmentMonths} tháng
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Trả/tháng
									</p>
									<p className="font-medium text-lg">
										{formatCurrency(
											contract.monthlyPayment,
										)}
									</p>
								</div>
							</div>
							<div className="space-y-2 pt-2 border-t border-border">
								<div className="flex justify-between">
									<p className="text-muted-foreground">
										Tổng thanh toán
									</p>
									<p className="font-medium">
										{formatCurrency(totalPayment)}
									</p>
								</div>
								<div className="flex justify-between text-red-600">
									<p>Lãi phải trả</p>
									<p className="font-medium">
										{formatCurrency(totalInterest)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Provider Info */}
					<Card>
						<CardHeader>
							<CardTitle>Nhà cung cấp</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{provider ? (
								<>
									<div>
										<p className="text-sm text-muted-foreground">
											Tên
										</p>
										<p className="font-medium">
											{provider.name}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Hotline
										</p>
										<p className="font-medium">
											{provider.phone}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											API Endpoint
										</p>
										<p className="font-medium text-xs break-all">
											{provider.apiEndpoint}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Trạng thái
										</p>
										<p className="font-medium">
											{provider.isActive ? (
												<span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
													Đang hoạt động
												</span>
											) : (
												<span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
													Không hoạt động
												</span>
											)}
										</p>
									</div>
								</>
							) : (
								<p>Không có thông tin</p>
							)}
						</CardContent>
					</Card>

					{/* Order Info */}
					<Card>
						<CardHeader>
							<CardTitle>Đơn hàng liên quan</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{order ? (
								<>
									<div>
										<p className="text-sm text-muted-foreground">
											Mã đơn
										</p>
										<p className="font-medium">
											{order.orderCode}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Tổng tiền
										</p>
										<p className="font-medium">
											{formatCurrency(order.totalAmount)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Trạng thái
										</p>
										<p className="font-medium capitalize">
											{order.orderStatus === "completed"
												? "Hoàn thành"
												: order.orderStatus ===
													  "pending"
													? "Chờ xử lý"
													: "Đã hủy"}
										</p>
									</div>
									<Link
										href={`/admin/orders/${order.id}`}
										className="mt-2 block"
									>
										<Button
											variant="outline"
											className="w-full"
										>
											Xem chi tiết
										</Button>
									</Link>
								</>
							) : (
								<p>Không có thông tin</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
