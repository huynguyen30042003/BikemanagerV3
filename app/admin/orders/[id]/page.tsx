"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	ArrowLeft,
	Check,
	ClipboardList,
	MapPin,
	Pencil,
	Phone,
	Truck,
	User,
	WalletCards,
} from "lucide-react";
import { useOrderDetailPageState } from "@/hooks/Order/Page/useOrderDetailPageState";
import Image from "next/image";
import { format } from "date-fns";
import { OrderItemResponse } from "@/types/order/order";
import { Column, Table } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/functionSetup";

const getStatusLabel = (status: string) => {
	const labels: Record<string, string> = {
		completed: "Hoàn thành",
		pending: "Chờ xử lý",
		cancelled: "Đã hủy",
		paid: "Đã thanh toán",
		partial: "Thanh toán một phần",
		unpaid: "Chưa thanh toán",
		cash: "Tiền mặt",
		card: "Thẻ tín dụng",
		bank_transfer: "Chuyển khoản",
		installment: "Trả góp",
	};
	return labels[status] || status;
};
const orderDetailColumns: Column<OrderItemResponse>[] = [
	{
		key: "info",
		title: "Sản phẩm",
		classNameHeader: "text-center text-secondary",
		render: (_v, row) => {
			const linkImage = !!row?.productVariant?.product?.thumbnailUrl
				? `https://localhost:5001${row?.productVariant?.product?.thumbnailUrl}`
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
							{row?.productVariant?.product?.name ?? "—"}
						</p>
						<p className="text-secondary">
							{row?.productVariant?.color ?? "—"}
						</p>
					</div>
				</div>
			) : (
				<div className="flex items-center gap-2">
					<div className="h-10 w-10 flex justify-center items-center bg-highlight rounded-lg">
						<p className="text-secondary font-semibold">
							{row?.productVariant?.product?.category?.name ??
								"—"}
						</p>
					</div>
					<div className="flex flex-col justify-center">
						<p className="text-primary font-bold">
							{row?.productVariant?.product?.name ?? "—"}
						</p>
						<p className="text-secondary">
							{row?.productVariant?.color ?? "—"}
						</p>
					</div>
				</div>
			);
		},
	},
	{
		key: "quantity",
		title: "Số lượng",
		classNameHeader: "text-center text-secondary",
		classNameItem: "text-right",
		accessor: (r) => r?.quantity ?? "—",
	},
	{
		key: "unitPrice",
		title: "Đơn giá",
		classNameItem: "text-right font-bold",
		classNameHeader: "text-center text-secondary",
		accessor: (r) => formatCurrency(r?.unitPrice || 0),
	},
	{
		key: "totalPrice",
		title: "Thành tiền",
		classNameItem: "text-right font-bold",
		classNameHeader: "text-center text-secondary font-bold",
		accessor: (r) => formatCurrency(r?.totalPrice || 0),
	},
];
export default function OrderDetailPage() {
	const {
		orderData,
		isLoadingGetOrderByIdData,
		orderDetailData,
		isLoadingGetOrderDetailData,
		customer,
		contract,
		isLoadingContracts,
		isContract,
	} = useOrderDetailPageState();
	console.log("orderDetailData", orderDetailData);
	return (
		<div className="p-4 md:p-8 space-y-8">
			{!orderData ? (
				<div className="flex gap-3 flex-col">
					{/* Link quay lại */}
					<Skeleton className="h-5 w-36" />

					{/* Tiêu đề + mã đơn */}
					<div className="flex flex-col gap-2">
						<Skeleton className="h-8 w-52" />
						<Skeleton className="h-4 w-80" />
					</div>
				</div>
			) : (
				<div className="flex gap-3 flex-col">
					<Link
						href="/admin/orders"
						className="flex items-center gap-2 text-header-secondary font-bold text-[14px]"
					>
						<ArrowLeft size={14} />
						Danh sách đơn hàng
					</Link>

					<div>
						<h1 className="text-[28px] font-bold text-header-primary">
							Chi tiết đơn hàng
						</h1>

						<p className="text-header-secondary text-[14px]">
							Mã đơn{" "}
							<span className="font-semibold text-[#5f574e]">
								#{orderData?.orderCode}
							</span>{" "}
							tạo lúc{" "}
							{orderData?.createdAt
								? format(
										orderData.createdAt,
										"dd/MM/yyyy, HH:mm",
									)
								: ""}
						</p>
					</div>
				</div>
			)}

			{!orderData ? (
				<div className="grid grid-cols-3 gap-4 mb-5">
					{Array.from({ length: 3 }).map((_, index) => (
						<Card key={index} className="flex-1 gap-1">
							<CardHeader>
								<Skeleton className="h-4 w-28" />
							</CardHeader>

							<CardContent>
								<Skeleton className="h-6 w-36" />
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="grid grid-cols-3 gap-4 mb-5">
					<Card className="flex-1 gap-1">
						<CardHeader>
							<CardTitle className="text-xs font-medium text-header-secondary pb-0">
								Giá trị đơn hàng
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-lg font-bold">
								{formatCurrency(orderData?.totalAmount || 0) ??
									"—"}
							</div>
						</CardContent>
					</Card>

					<Card className="flex-1 gap-1">
						<CardHeader>
							<CardTitle className="text-xs font-medium text-header-secondary pb-0">
								Khách hàng
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-lg font-bold">
								{customer?.fullName}
							</div>
						</CardContent>
					</Card>

					<Card className="flex-1 gap-1">
						<CardHeader>
							<CardTitle className="text-xs font-medium text-header-secondary pb-0">
								Dự kiến giao
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-lg font-bold">-</div>
						</CardContent>
					</Card>
				</div>
			)}

			<div className="grid grid-col-1 lg:grid-cols-3 gap-4">
				<div className="flex flex-col col-span-1 lg:col-span-2 gap-4">
					{!orderDetailData ? (
						<Card>
							<CardHeader className="flex justify-between items-center">
								<div className="flex flex-col gap-2">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-3 w-32" />
								</div>

								<Skeleton className="h-3 w-32" />
							</CardHeader>

							<CardContent className="flex flex-col gap-4 w-full">
								{Array.from({ length: 2 }).map((_, index) => (
									<div key={index} className="flex gap-4">
										<Skeleton className="w-25 h-25 rounded-lg shrink-0" />

										<div className="flex justify-between flex-1">
											<div className="flex flex-col gap-3">
												<Skeleton className="h-3 w-20" />
												<Skeleton className="h-6 w-52" />
												<Skeleton className="h-4 w-32" />
											</div>

											<Skeleton className="w-4 h-4 rounded" />
										</div>
									</div>
								))}

								<div className="flex flex-col gap-3 mt-2">
									{Array.from({ length: 4 }).map(
										(_, index) => (
											<div
												key={index}
												className="flex items-center justify-between py-2"
											>
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-4 w-20" />
												<Skeleton className="h-4 w-24" />
												<Skeleton className="h-4 w-20" />
											</div>
										),
									)}
								</div>

								<div className="flex justify-between items-center bg-highlight px-4 py-3 rounded-lg">
									<Skeleton className="h-4 w-28" />
									<Skeleton className="h-5 w-28" />
								</div>
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardHeader className="flex justify-between items-center">
								<div className="flex flex-col">
									<p className="text-primary font-bold text-base">
										Thông tin đơn hàng
									</p>
									<p className="text-secondary text-xs">
										1 sản phẩm · Kho Quận 1
									</p>
								</div>

								<p className="text-secondary text-xs">
									3 sản phẩm · Kho Quận 1
								</p>
							</CardHeader>

							<CardContent className="flex flex-col gap-4 w-full">
								{orderDetailData
									?.filter(
										(prev) =>
											prev.productVariant.trackSerial ===
											true,
									)
									.map((orderDetail: OrderItemResponse) => {
										const linkImg =
											`https://localhost:5001${orderDetail?.productVariant?.image}` ||
											"";

										return (
											<div
												key={orderDetail.id}
												className="flex gap-4"
											>
												<div className="imageVehicle">
													<Image
														src={linkImg}
														width={200}
														height={200}
														alt=""
													/>
												</div>

												<div className="flex flex-1 flex-col">
													<div className="flex justify-between">
														<div className="flex flex-col gap-2 mb-5">
															<p className="uppercase text-xs font-bold text-secondary">
																{ orderDetail ?.productVariant ?.product ?.category ?.name }
															</p>

															<p className="text-xl font-bold text-primary ">
																{ orderDetail ?.productVariant ?.product ?.name }
															</p>
														</div>
														<Pencil className="w-4 h-4" />
													</div>
													<div className="border-b border-solid h-0"></div>
													<div className="flex justify-between gap-4 py-4">
														<div className="flex flex-col gap-1 ">
															<p className=" text-xs text-secondary">Màu sắc</p>
															<p className="font-bold text-md	text-primary">Xám than</p>
														</div>
														<div className="flex flex-col gap-1 ">
															<p className=" text-xs text-secondary">Pin</p>
															<p className="font-bold text-md	text-primary">Xám than</p>
														</div>
													</div>
													<div className="border-b border-solid h-0"></div>
												</div>
											</div>
										);
									})}

								<Table<OrderItemResponse>
									data={orderDetailData}
									columns={orderDetailColumns}
								/>

								<div className="flex justify-between items-center bg-highlight px-4 py-2 rounded-lg">
									<p className="text-xs text-secondary">
										Tổng {orderDetailData?.length} sản phẩm
									</p>

									<p className="text-sm text-primary font-bold">
										{formatCurrency(
											orderData?.totalAmount || 0,
										) ?? "—"}
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{!orderData ? (
						<Card>
							<CardHeader className="flex justify-between items-center">
								<div className="flex flex-col gap-2">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-3 w-48" />
								</div>

								<Skeleton className="h-3 w-32" />
							</CardHeader>

							<CardContent>
								<div className="flex flex-col gap-4">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6" />
									<Skeleton className="h-4 w-4/6" />
								</div>
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardHeader className="flex justify-between items-center">
								<div className="flex flex-col">
									<p className="text-primary font-bold text-base">
										Thông tin đơn hàng
									</p>

									{orderData?.updatedAt && (
										<p className="text-secondary text-xs">
											Cập nhật lúc ·{" "}
											{format(
												orderData.updatedAt,
												"dd/MM/yyyy, HH:mm",
											)}
										</p>
									)}
								</div>

								<p className="text-secondary text-xs">
									3 sản phẩm · Kho Quận 1
								</p>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-1 mb-20 px-[calc(12.5%-18px)]">
									<div className="relative">
										<div className="flex h-9 w-9 bg-highlight rounded-[18px] items-center justify-center">
											<Check size={16} color="#aaa197" />
										</div>
										<div className="absolute mt-3 flex flex-col w-max items-center left-1/2 -translate-x-1/2">
											<p className="text-sm font-bold"> Đặt hàng </p>
											<p className="text-xs mt-1 text-secondary"> Đơn hàng được tạo </p>
											<p className="text-[11px] mt-2 text-secondary"> 12/06/2024 · 09:42 </p>
										</div>
									</div>
									<div className="h-1 flex-1 bg-highlight"></div>
									<div className="relative">
										<div className="flex h-9 w-9 bg-highlight rounded-[18px] items-center justify-center">
											<Check size={16} color="#aaa197" />
										</div>
										<div className="absolute mt-3 flex flex-col w-max items-center left-1/2 -translate-x-1/2">
											<p className="text-sm font-bold"> Đã xác nhận </p>
											<p className="text-xs mt-1 text-secondary"> Đã duyệt đơn hàng </p>
											<p className="text-[11px] mt-2 text-secondary"> 12/06/2024 · 09:42 </p>
										</div>
									</div>
									<div className="h-1 flex-1 bg-highlight"></div>
									<div className="relative">
										<div className="flex h-9 w-9 bg-highlight rounded-[18px] items-center justify-center">
											<Check size={16} color="#aaa197" />
										</div>
										<div className="absolute mt-3 flex flex-col w-max items-center left-1/2 -translate-x-1/2">
											<p className="text-sm font-bold"> Đang giao </p>
											<p className="text-xs mt-1 text-secondary"> EcoRide Express </p>
											<p className="text-[11px] mt-2 text-secondary"> 12/06/2024 · 09:42 </p>
										</div>
									</div>
									<div className="h-1 flex-1 bg-highlight"></div>
									<div className="relative">
										<div className="flex h-9 w-9 bg-highlight rounded-[18px] items-center justify-center">
											<Check size={16} color="#aaa197" />
										</div>
										<div className="absolute mt-3 flex flex-col w-max items-center left-1/2 -translate-x-1/2">
											<p className="text-sm font-bold"> Hoàn tất </p>
											<p className="text-xs mt-1 text-secondary"> Chưa hoàn tất </p>
											<p className="text-[11px] mt-2 text-secondary"> 12/06/2024 · 09:42 </p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				<div className="flex flex-col gap-4">
					{!customer ? (
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<Skeleton className="h-5 w-36" />
									<Skeleton className="h-3 w-28" />
								</div>

								<Skeleton className="h-3 w-40 mt-2" />
							</CardHeader>

							<CardContent className="flex flex-col gap-4">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-4 w-4/6" />
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardHeader className="flex justify-between items-center">
								<div className="flex flex-col">
									<p className="text-primary font-bold text-base">
										Thông tin khách hàng
									</p>
								</div>
								<p className="text-secondary text-xs">
									Xem hồ sơ
								</p>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-4">
									<div className="flex gap-3">
										<div className="flex h-11 w-11 bg-highlight rounded-full items-center justify-center">
											<User size={17} color="#aaa197" />
										</div>
										<div className="flex flex-col gap-0.5 justify-center">
											<p className="text-sm font-bold text-primary">
												{customer?.fullName}
											</p>
											<p className="text-xs text-secondary ">
												Khách hàng từ{" "}
												{format(
													customer?.createdAt,
													"MM/yyyy",
												)}
											</p>
										</div>
									</div>
									<div className="border-b border-dashed h-0"></div>
									<div className="flex gap-3">
										<div className="flex h-9 w-9 bg-highlight rounded-lg items-center justify-center">
											<Phone size={17} color="#aaa197" />
										</div>
										<div className="flex flex-col justify-center gap-0.5">
											<p className="font-bold text-secondary text-xs">
												Số điện thoại
											</p>
											<p className="text-sm font-bold text-primary">
												{customer?.phoneNumber}
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<div className="flex h-9 w-9 bg-highlight rounded-lg items-center justify-center">
											<ClipboardList
												size={17}
												color="#aaa197"
											/>
										</div>
										<div className="flex flex-col justify-center gap-0.5">
											<p className="font-bold text-secondary text-xs">
												Đơn hàng trước đó
											</p>
											<p className="text-sm font-bold text-primary">
												{customer?.totalOrders || 0} đơn
												hàng
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
					{!orderData ? (
						<Card className="col-span-1">
							<CardHeader className="flex justify-between items-center">
								<div className="flex flex-col gap-2">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-3 w-48" />
								</div>

								<Skeleton className="h-3 w-32" />
							</CardHeader>

							<CardContent>
								<div className="flex flex-col gap-4">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6" />
									<Skeleton className="h-4 w-4/6" />
								</div>
							</CardContent>
						</Card>
					) : (
						<Card className="col-span-1">
							<CardHeader className="flex justify-between items-center">
								<div className="flex flex-col">
									<p className="text-primary font-bold text-base">
										Thanh toán
									</p>
								</div>
								<p className="text-secondary text-xs">
									<WalletCards size={16} color="#aaa197" />
								</p>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-4">
									<div className="flex justify-between">
										<p className="text-sm text-secondary">
											Tạm tính
										</p>
										<p className="text-sm text-primary font-semibold">
											{formatCurrency(
												orderData?.totalAmount,
											)}
										</p>
									</div>
									<div className="flex justify-between">
										<p className="text-sm text-secondary">
											Phí vận chuyển
										</p>
										<p className="text-sm text-primary font-semibold">
											Miễn phí
										</p>
									</div>
									<div className="flex justify-between">
										<p className="text-sm text-secondary">
											Khuyến mãi
										</p>
										<p className="text-sm text-primary font-semibold">
											{formatCurrency(
												orderData?.discountAmount,
											)}
										</p>
									</div>
									<div className="border-b border-solid h-0"></div>
									<div className="flex justify-between items-end">
										<p className="text-sm text-secondary">
											Tổng thanh toán
										</p>
										<p className="text-xl text-primary font-bold">
											{formatCurrency(
												orderData?.subTotal,
											)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
