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
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useSalePageState } from "@/hooks/Sale/PageState/useSalePageState";
import {
	ProductVariantResponse,
	vehicleColorMap,
} from "@/types/product/productVariants";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SerialNumberResponse } from "@/types/product/serialNumber";
const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
	}).format(value);
};
export default function CreateSalePage() {
	const {
		tab,
		setTab,
		searchInput,
		searchInputSerial,
		handleSearch,
		handleSearchSerial,
		ProductVariantsData,
		isLoadingProductVariant,
		page,
		setPage,
		form,
		onSubmit,
		discount,
		setDiscount,
		totalAmount,
		handleSearchCustomer,
		listProductVariant,
		handleAddProductVariantList,
		handleUnitPriceChange,
		handleQuantityChange,
		handleRemoveProductVariantList,
		warehouseId,
		handleWarehouseId,
		warehouseData,
		isLoadingWarehouse,
		serialsData,
		isLoadingSerial,
		isLoadingInstallmentProvider,
		installmentProviderData,
	} = useSalePageState();

	const {
		register,
		watch,
		setValue,
		handleSubmit,
		formState: { errors },
	} = form;
	useEffect(() => console.log(listProductVariant), [listProductVariant]);
	return (
		<div className="p-4 md:p-8 space-y-8">
			<div className="flex items-center gap-4  mb-2">
				<Link href="/admin/purchase-orders">
					<Button variant="outline" size="icon">
						<ArrowLeft size={20} />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Tạo đơn bán
					</h1>
					<p className="text-muted-foreground">
						Tạo một đơn bán hàng mới với thông tin khách hàng
					</p>
				</div>
			</div>
			<div className="grid grid-cols-10 gap-8">
				<Card className="w-full max-h-[calc(100vh-156px)] grid-row-start  gap-0 col-span-6 pt-4 pb-0 space-y-4">
					<CardContent className="space-y-4 px-0">
						<div className="flex mx-4 gap-4 mb-0">
							<Tabs
								defaultValue="Vehicle"
								value={tab}
								onValueChange={(value) =>
									setTab(value as "true" | "false")
								}
								className="w-full"
							>
								<div className="flex gap-4 items-centers">
									{tab == "Part" ? (
										<Input
											className="col-span-full  mb-0 "
											placeholder="Tìm kiếm..."
											value={searchInput}
											onChange={(e) =>
												handleSearch(e.target.value)
											}
										/>
									) : (
										<Input
											className="col-span-full  mb-0 "
											placeholder="Tìm kiếm..."
											value={searchInputSerial}
											onChange={(e) =>
												handleSearchSerial(
													e.target.value,
												)
											}
										/>
									)}
									<TabsList>
										<TabsTrigger value="Vehicle">
											Phương tiện
										</TabsTrigger>
										<TabsTrigger value="Part">
											Phụ tùng/ Phụ Kiện
										</TabsTrigger>
									</TabsList>
									<div className="flex-1">
										<CardContent className="space-y-4">
											<div>
												<Select
													value={warehouseId}
													onValueChange={
														handleWarehouseId
													}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Nhà Kho" />
													</SelectTrigger>
													<SelectContent>
														{!isLoadingWarehouse &&
															warehouseData?.items?.map(
																(warehouse) => (
																	<SelectItem
																		key={
																			warehouse.id
																		}
																		value={
																			warehouse.id
																		}
																	>
																		{
																			warehouse.name
																		}
																	</SelectItem>
																),
															)}
													</SelectContent>
												</Select>
											</div>
										</CardContent>
									</div>
								</div>
								<TabsContent value="Part">
									<div className="max-h-[calc(100vh-268px)] overflow-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4 mb-0">
										{!isLoadingProductVariant &&
											ProductVariantsData?.items?.map(
												(
													productVariant: ProductVariantResponse,
												) => (
													<Card
														key={productVariant?.id}
														className=" py-0 cursor-pointer group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ring-1 ring-gray-200 rounded-xl"
														onClick={() =>
															handleAddProductVariantList(
																productVariant,
															)
														}
													>
														<CardContent className="p-0 rounded-xl overflow-visible">
															{/* Header strip with brand + stock badge */}
															<div className="px-4 pt-4 flex items-start justify-between gap-2">
																<span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full truncate max-w-[60%]">
																	{productVariant
																		?.product
																		?.brand
																		?.name ||
																		"Không rõ thương hiệu"}
																</span>

																<span
																	className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
																		(productVariant?.stockQuantity ??
																			0) >
																		0
																			? "bg-green-50 text-green-600"
																			: "bg-red-50 text-red-500"
																	}`}
																>
																	{(productVariant?.stockQuantity ??
																		0) > 0
																		? `Còn ${productVariant?.stockQuantity}`
																		: "Hết hàng"}
																</span>
															</div>

															<div className="p-4 py-2 space-y-2.5">
																{/* Product name */}
																<h3 className="mb-2 font-semibold text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors ">
																	{
																		productVariant
																			?.product
																			?.name
																	}
																</h3>

																{/* Category + Color */}
																<div className="flex flex-wrap gap-2">
																	{productVariant
																		?.product
																		?.category
																		?.name && (
																		<span className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-100">
																			{
																				productVariant
																					?.product
																					?.category
																					?.name
																			}
																		</span>
																	)}

																	{productVariant?.color && (
																		<span className="text-xs px-2 py-1 rounded-md bg-purple-50 text-purple-600 border border-purple-100 flex items-center gap-1">
																			<span
																				className="w-2.5 h-2.5 rounded-full border border-purple-200"
																				style={{
																					backgroundColor:
																						productVariant.color,
																				}}
																			/>
																			{
																				productVariant?.color
																			}
																		</span>
																	)}
																</div>

																{/* Price */}
																<div className="flex items-center justify-between border-t border-gray-100 mt-2">
																	<span className="font-bold text-lg text-pink-600">
																		{productVariant?.importPrice.toLocaleString()}
																		đ
																	</span>
																</div>
															</div>
														</CardContent>
													</Card>
												),
											)}
									</div>
								</TabsContent>
								<TabsContent value="Vehicle">
									<div className="max-h-[calc(100vh-268px)] overflow-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4 mb-0">
										{!isLoadingSerial &&
											serialsData?.items?.map(
												(
													serials: SerialNumberResponse,
												) => (
													<Card
														key={serials?.id}
														className=" py-0 cursor-pointer group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ring-1 ring-gray-200 rounded-xl"
														onClick={() =>
															!!serials.productVariant &&
															handleAddProductVariantList(
																serials.productVariant,
																serials,
															)
														}
													>
														<CardContent className="p-0 rounded-xl overflow-visible">
															{/* Header strip with brand + stock badge */}
															<div className="p-4 py-2 space-y-2.5">
																{/* Product name */}
																<h3 className="mb-2 font-semibold text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors ">
																	{
																		serials
																			?.productVariant
																			?.product
																			?.name
																	}
																</h3>

																{/* Category + Color */}
																<div className="flex flex-wrap gap-2">
																	{serials?.frameNumber && (
																		<span className="text-xs px-2 py-1 rounded-md flex items-center gap-1">
																			Số
																			Khung:{" "}
																			{
																				serials?.frameNumber
																			}
																		</span>
																	)}
																	{serials?.engineNumber && (
																		<span className="text-xs px-2 py-1 rounded-md flex items-center gap-1">
																			Số
																			động
																			cơ:{" "}
																			{
																				serials?.engineNumber
																			}
																		</span>
																	)}
																	{serials
																		?.productVariant
																		?.color && (
																		<span className="text-xs px-2 py-1 rounded-md  border flex items-center gap-1">
																			<span
																				className={`text-xs px-2 py-1 rounded-md  border flex items-center gap-1 ${
																					vehicleColorMap[
																						serials?.productVariant?.color?.toLowerCase()
																					] ??
																					"bg-gray-300"
																				}`}
																			/>
																			{
																				serials
																					?.productVariant
																					?.color
																			}
																		</span>
																	)}
																</div>

																{/* Price */}
																<div className="flex items-center justify-between border-t border-gray-100 mt-2">
																	<span className="font-bold text-lg text-pink-600">
																		{serials?.productVariant?.sellingPrice.toLocaleString()}
																		đ
																	</span>
																</div>
															</div>
														</CardContent>
													</Card>
												),
											)}
									</div>
								</TabsContent>
							</Tabs>
						</div>

						<div className="col-span-full flex flex-col gap-3 px-4 pb-4 md:flex-row md:items-center md:justify-between">
							<div>
								Trang {page} / {ProductVariantsData?.totalPages}{" "}
								( Tổng sản phẩm:{" "}
								{ProductVariantsData?.totalItems} )
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
									{
										length:
											ProductVariantsData?.totalPages ??
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
										page === ProductVariantsData?.totalPages
									}
									onClick={() => setPage((prev) => prev + 1)}
								>
									Next
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6 col-span-4"
				>
					{/* Customer Info */}
					<Card>
						<CardHeader>
							<CardTitle>Thông tin khách hàng</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Tên khách hàng *
									</label>
									<Input
										{...register("customerName")}
									/>
									
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Số điện thoại *
									</label>
									<Input
										{...register("customerPhone")}
									/>
									{errors.customerPhone && (
										<p className="text-red-600 text-xs mt-1">
											{errors.customerPhone.message}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Email *
									</label>
									<Input
										{...register("customerEmail")}
									/>
									{errors.customerEmail && (
										<p className="text-red-600 text-xs mt-1">
											{errors.customerEmail.message}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Địa chỉ *
									</label>
									<Input
										{...register("customerAddress")}
									/>
									{errors.customerAddress && (
										<p className="text-red-600 text-xs mt-1">
											{errors.customerAddress.message}
										</p>
									)}
								</div>
							</div>
							<Button onClick={handleSearchCustomer}>
								Tìm kiếm
							</Button>
						</CardContent>
					</Card>
					{listProductVariant.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Danh sách sản phẩm</CardTitle>
								<CardDescription>
									{listProductVariant.length} sản phẩm
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="text-left py-1 px-2 font-medium">
													Sản phẩm
												</th>
												<th className="text-left  w-15 py-1 px-2 font-medium">
													Số lượng
												</th>
												<th className="text-left  w-25 py-1 px-2 font-medium">
													Đơn giá
												</th>
												<th className="text-right py-1 px-2 font-medium">
													Tổng
												</th>
												<th className="text-center py-1 px-2 font-medium">
													Hành động
												</th>
											</tr>
										</thead>
										<tbody>
											{listProductVariant.map(
												(item, index) => (
													<tr
														key={index}
														className="border-b"
													>
														<td className="py-1 px-2">
															<div>
																<p className="font-medium">
																	{
																		item.productName
																	}
																</p>
																<p className="text-xs text-muted-foreground">
																	{item.sku}
																</p>
															</div>
														</td>
														<td className="text-right py-1 px-2">
															<Input
																className="col-span-full text-right w-15"
																type="number"
																disabled={
																	item.trackSerial
																}
																max={
																	item.stockQuantity
																}
																min={1}
																value={
																	item.quantity
																}
																onChange={(e) =>
																	handleQuantityChange(
																		item.productVariantId,
																		+e
																			.target
																			.value,
																		item?.serialCode,
																	)
																}
															/>
														</td>
														<td className="text-right py-1 px-2">
															<Input
																className="col-span-full text-right w-25"
																type="number"
																value={
																	item.unitPrice
																}
																min={0}
																onChange={(e) =>
																	handleUnitPriceChange(
																		item.productVariantId,
																		+e
																			.target
																			.value,
																		item.serialCode,
																	)
																}
															/>
														</td>
														<td className="text-right py-1 px-2 font-medium">
															{formatCurrency(
																item.quantity *
																	item.unitPrice,
															)}
														</td>
														<td className="text-center py-1 px-2">
															<Button
																type="button"
																variant="outline"
																size="sm"
																onClick={() =>
																	handleRemoveProductVariantList(
																		item.productVariantId,
																	)
																}
															>
																<Trash2
																	size={16}
																/>
															</Button>
														</td>
													</tr>
												),
											)}
										</tbody>
									</table>
									{/* Summary */}
									{listProductVariant.length > 0 && (
										<div className="pt-6 space-y-4">
											<div className="flex justify-between text-md font-bold">
												<span>Giảm Giá</span>
												<Input
													className="w-25 text-right"
													type="number"
													min={0}
													value={discount}
													onChange={(e) =>
														setDiscount(
															+e.target.value,
														)
													}
												/>
											</div>
											<div className="flex justify-between text-md font-bold">
												<span>
													Phương thức thanh toán
												</span>

												<Tabs
													value={watch(
														"PaymentMethod",
													)}
													onValueChange={(value) =>
														setValue(
															"PaymentMethod",
															value,
															{
																shouldValidate: true,
															},
														)
													}
												>
													<TabsList>
														<TabsTrigger value="Cash">
															Tiền mặt
														</TabsTrigger>
														<TabsTrigger value="Installment">
															Trả góp
														</TabsTrigger>
													</TabsList>
													<TabsContent value="Installment">
														<Card>
															<CardHeader>
																<CardTitle>
																	Thông tin
																	trả góp
																</CardTitle>
															</CardHeader>
															<CardContent className="space-y-4">
																<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																	<div className="space-y-2">
																		<label className="text-sm font-medium">
																			Nhà
																			cung
																			cấp
																			trả
																			góp
																			*
																		</label>
																		<Select
																			value={watch(
																				"ProviderId",
																			)}
																			onValueChange={(
																				value,
																			) =>
																				setValue(
																					"ProviderId",
																					value,
																					{
																						shouldValidate: true,
																					},
																				)
																			}
																			required
																		>
																			<SelectTrigger className="w-full">
																				<SelectValue placeholder="Trả góp" />
																			</SelectTrigger>
																			<SelectContent>
																				{!isLoadingInstallmentProvider &&
																					installmentProviderData?.items?.map(
																						(
																							Provider,
																						) => (
																							<SelectItem
																								key={
																									Provider.id
																								}
																								value={
																									Provider.id
																								}
																							>
																								{Provider.name }
																							</SelectItem>
																						),
																					)}
																			</SelectContent>
																		</Select>
																		{errors.ProviderId && (
																			<p className="text-red-600 text-xs mt-1">
																				{
																					errors
																						.ProviderId
																						.message
																				}
																			</p>
																		)}
																	</div>
																	<div className="space-y-2">
																		<label className="text-sm font-medium">
																			Tổng
																			tiền
																			hàng
																		</label>
																		<div className="px-3 py-2 border border-muted rounded-md bg-muted text-sm font-medium">
																			{totalAmount.toLocaleString(
																				"vi-VN",
																			)}
																			đ
																		</div>
																	</div>
																	<div className="space-y-2">
																		<label className="text-sm font-medium">
																			Số
																			tiền
																			trả
																			trước
																		</label>
																		<Input
																			type="number"
																			{...register(
																				"downPayment",
																				{
																					valueAsNumber: true,
																				},
																			)}
																		/>
																	</div>
																	<div className="space-y-2">
																		<label className="text-sm font-medium">
																			Số
																			tiền
																			vay
																		</label>
																		<Input
																			type="number"
																			{...register(
																				"loanAmount",
																			)}
																		/>
																	</div>
																	<div className="space-y-2">
																		<label className="text-sm font-medium">
																			Số
																			tháng
																			trả
																			góp
																		</label>
																		<select
																			{...register(
																				"installmentMonths",
																				{
																					valueAsNumber: true,
																				},
																			)}
																			className="w-full px-3 py-2 border border-input rounded-md text-sm"
																		>
																			<option value="6">
																				6
																				tháng
																			</option>
																			<option value="12">
																				12
																				tháng
																			</option>
																			<option value="24">
																				24
																				tháng
																			</option>
																			<option value="36">
																				36
																				tháng
																			</option>
																		</select>
																	</div>
																	<div className="space-y-2">
																		<label className="text-sm font-medium">
																			Lãi
																			suất
																			(%)
																		</label>
																		<Input
																			type="number"
																			step="0.1"
																			min={
																				0
																			}
																			{...register(
																				"interestRate",
																				{
																					valueAsNumber: true,
																				},
																			)}
																		/>
																	</div>
																</div>
															</CardContent>
														</Card>
													</TabsContent>
												</Tabs>
											</div>
											<div className="flex justify-between text-lg font-bold">
												<span>Tổng giá trị</span>
												<span className="text-primary">
													{formatCurrency(
														totalAmount - discount,
													)}
												</span>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					<div className="flex gap-4 pt-4">
						<button type="submit">Tạo đơn bán</button>
						<Link href="/admin/sales">
							<Button variant="outline">Hủy</Button>
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
