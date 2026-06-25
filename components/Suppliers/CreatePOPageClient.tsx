"use client";

import { useRouter } from "next/navigation";
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
import { useGetWarehouse } from "@/hooks/Warehouses/useWarehouse";
import { useGetProductVariants } from "@/hooks/Product/useProductVariants";
import { useNewPurchaseOrdersPageState } from "@/hooks/PurchaseOrder/useNewPurchaseOrdersPageState";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ProductVariantResponse } from "@/types/product/productVariants";
import { useCreatePurchaseOrder } from "@/hooks/PurchaseOrder/usePurchaOrder";
import { useGetSupplier } from "@/hooks/Supplier/useSupplier";

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
	}).format(value);
};
export default function CreatePOPageClient() {
	const router = useRouter();
	const {
		page,
		setPage,
		pageSize,
		searchInput,
		searchTerm,
		handleSearch,
		supplierId,
		handleSupplierId,
		warehouseId,
		handleWarehouseId,
		listProductVariant,
		handleAddProductVariantList,
		handleRemoveProductVariantList,
		handleUnitPriceChange,
		handleQuantityChange,
		discount,
		setDiscount,
	} = useNewPurchaseOrdersPageState();

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
	const { data: ProductVariantsData, isLoading: isLoadingProductVariant } =
		useGetProductVariants({
			search: searchTerm,
			page: page,
			pageSize: pageSize,
		});
	const createPurchaseOrder = useCreatePurchaseOrder();
	const totalAmount = listProductVariant.reduce(
		(sum, item) => sum + item.quantity * item.unitPrice,
		0,
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!supplierId || !warehouseId || listProductVariant.length === 0) {
			alert("Vui lòng chọn nhà cung cấp và thêm ít nhất một sản phẩm");
			return;
		}
		try {
			createPurchaseOrder.mutateAsync({
				supplierId: supplierId,
				warehouseId: warehouseId,
				discountAmount: discount,
				items: listProductVariant,
			});
		} catch (error) {
			console.log(error);
		}
		router.push("/admin/purchase-orders");
	};

	const selectedSupplier = supplierData?.items?.find(
		(s) => s.id === supplierId,
	);

	const selectedWarehouse = warehouseData?.items?.find(
		(s) => s.id === warehouseId,
	);

	return (
			<div className="p-4 md:p-8 space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Link href="/admin/purchase-orders">
						<Button variant="outline" size="icon">
							<ArrowLeft size={20} />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							Tạo đơn mua hàng
						</h1>
						<p className="text-muted-foreground">
							Tạo đơn mua hàng mới từ nhà cung cấp
						</p>
					</div>
				</div>
				<div className="grid grid-cols-10 gap-8">
					<Card className="w-full max-h-[calc(100vh-156px)] grid-row-start  gap-0 col-span-6 pt-4 pb-0 space-y-4">
						<CardContent className="space-y-4 px-0">
							<Input
								className="col-span-full w-[calc(100%-32px)] mx-4 mb-0 "
								placeholder="Tìm kiếm..."
								value={searchInput}
								onChange={(e) => handleSearch(e.target.value)}
							/>
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
																?.product?.brand
																?.name ||
																"Không rõ thương hiệu"}
														</span>

														<span
															className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
																(productVariant?.stockQuantity ??
																	0) > 0
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

													<div className="p-4 pt-2 space-y-2.5">
														{/* Product name */}
														<h3 className="font-semibold text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors">
															{
																productVariant
																	?.product
																	?.name
															}
														</h3>

														{/* SKU & Barcode */}
														<div className="flex flex-col gap-0.5 text-xs text-gray-400">
															<span className="text-gray-700">
																SKU:{" "}
																{
																	productVariant?.sku
																}
															</span>
															{productVariant
																?.product
																?.barcode && (
																<span>
																	Mã vạch:{" "}
																	{
																		productVariant
																			?.product
																			?.barcode
																	}
																</span>
															)}
														</div>

														{/* Category + Color */}
														<div className="flex flex-wrap gap-2 pt-1">
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

															{productVariant?.trackSerial && (
																<span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
																	Quản lý
																	Serial
																</span>
															)}
														</div>

														{/* Price */}
														<div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
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
							<div className="col-span-full flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
								<div>
									Trang {page} /{" "}
									{ProductVariantsData?.totalPages} ( Tổng sản
									phẩm: {ProductVariantsData?.totalItems} )
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
											page ===
											ProductVariantsData?.totalPages
										}
										onClick={() =>
											setPage((prev) => prev + 1)
										}
									>
										Next
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<form
						onSubmit={handleSubmit}
						className="grid-row-start space-y-6 col-span-4"
					>
						{/* Supplier Selection */}
						<Card className="w-full flex-row gap-0">
							<div className="flex-1">
								<CardHeader>
									<CardTitle>Chọn nhà cung cấp</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<label className="text-sm font-medium">
											Nhà cung cấp{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<Select
											value={supplierId}
											onValueChange={handleSupplierId}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Nhà Phân Phối" />
											</SelectTrigger>
											<SelectContent>
												{!isLoadingSupplier &&
													supplierData?.items?.map(
														(supplier) => (
															<SelectItem
																key={
																	supplier.id
																}
																value={
																	supplier.id
																}
															>
																{supplier.name}
															</SelectItem>
														),
													)}
											</SelectContent>
										</Select>
									</div>
									{supplierId && (
										<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
											<p>
												<span className="font-medium">
													Liên hệ:
												</span>{" "}
												{
													selectedSupplier?.contactPerson
												}
											</p>
											<p>
												<span className="font-medium">
													Điện thoại:
												</span>{" "}
												{selectedSupplier?.phone}
											</p>
										</div>
									)}
								</CardContent>
							</div>
							<div className="flex-1">
								<CardHeader>
									<CardTitle>Chọn nhà Kho</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<label className="text-sm font-medium">
											Nhà Kho{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<Select
											value={warehouseId}
											onValueChange={handleWarehouseId}
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
																{warehouse.name}
															</SelectItem>
														),
													)}
											</SelectContent>
										</Select>
									</div>
									{warehouseId && (
										<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
											<p>
												<span className="font-medium">
													Tên nhà Kho:
												</span>{" "}
												{selectedWarehouse?.name}(
												{selectedWarehouse?.code})
											</p>
											<p>
												<span className="font-medium">
													Địa chỉ:
												</span>{" "}
												{selectedWarehouse?.address}
											</p>
										</div>
									)}
								</CardContent>
							</div>
						</Card>

						{/* Items List */}
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
																		{
																			item.sku
																		}
																	</p>
																</div>
															</td>
															<td className="text-right py-1 px-2">
																<Input
																	className="col-span-full text-right w-15"
																	type="number"
																	value={
																		item.quantity
																	}
																	onChange={(
																		e,
																	) =>
																		handleQuantityChange(
																			item.productVariantId,
																			+e
																				.target
																				.value,
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
																	onChange={(
																		e,
																	) =>
																		handleUnitPriceChange(
																			item.productVariantId,
																			+e
																				.target
																				.value,
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
																		size={
																			16
																		}
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
														value={discount}
														onChange={(e) =>
															setDiscount(
																+e.target.value,
															)
														}
													/>
												</div>
												<div className="flex justify-between text-lg font-bold">
													<span>Tổng giá trị</span>
													<span className="text-primary">
														{formatCurrency(
															totalAmount -
																discount,
														)}
													</span>
												</div>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Buttons */}
						<div className="flex gap-4 pt-4">
							<Button type="submit" className="flex-1">
								Tạo đơn mua hàng
							</Button>
							<Link
								href="/admin/purchase-orders"
								className="flex-1"
							>
								<Button variant="outline" className="w-full">
									Hủy
								</Button>
							</Link>
						</div>
					</form>
				</div>
			</div>
	);
}
