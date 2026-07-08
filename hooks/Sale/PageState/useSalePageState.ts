"use client";
import { useCreateInstallmentOrder, useCreateOrder } from "../useSale";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
	CreateInstallmentOrderRequest,
	CreateSaleOrderRequest,
} from "@/types/sale/sale";
import {
	DEBOUNCE_DELAY,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
} from "@/constants/Vehiclespage.constants";
import { useEffect, useState } from "react";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { useGetCustomersByPhoneNumber } from "@/hooks/Customer/useCustomer";
import { PurchaseOrderItemPreView } from "@/types/supplier/purchase-orders";
import { ProductVariantResponse } from "@/types/product/productVariants";
import { useGetWarehouse } from "@/hooks/Warehouses/useWarehouse";
import { useGetSerialNumbers } from "@/hooks/Product/useSerialNumber";
import { SerialNumberResponse } from "@/types/product/serialNumber";
import { useGetInstallmentProvider } from "@/hooks/InstallmentProviders/useInstallmentProviders";
import { useRouter } from "next/navigation";
import { useGetInventoryStockDetail } from "@/hooks/Inventory/useInventoryStock";
const schema = z.object({
	customerName: z.string().min(1, "Vui lòng nhập tên khách hàng"),
	customerPhone: z.string().min(1, "Vui lòng nhập số điện thoại"),
	customerEmail: z
		.string()
		.min(1, "Vui lòng nhập email")
		.email("Email không hợp lệ")
		.optional()
		.or(z.literal("")),
	customerAddress: z.string().optional(),
	PaymentMethod: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
	Items: z.array(
		z.object({
			ProductVariantId: z.string(),
			SerialNumberId: z.string().optional(),
			Quantity: z.number(),
			UnitPrice: z.number(),
			DiscountAmount: z.number(),
		}),
	),
	ProviderId: z.string().optional(),
	downPayment: z.number().default(0),
	loanAmount: z.number().default(0),
	installmentMonths: z.number().default(12),
	interestRate: z.number().default(1.5),
});
export type FormValues = z.infer<typeof schema>;
export function useSalePageState() {
	const router = useRouter();
	const [page, setPage] = useState(DEFAULT_PAGE);
	const [pageSerial, setPageSerial] = useState(DEFAULT_PAGE);
	const pageSize = DEFAULT_PAGE_SIZE;
	const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
		delay: DEBOUNCE_DELAY,
	});
	const {
		searchInput: searchInputSerial,
		searchTerm: searchTermSerial,
		setSearchInput: setSearchInputSerial,
	} = useDebounceSearch({
		delay: DEBOUNCE_DELAY,
	});
	const [tab, setTab] = useState<string>("Vehicle");
	// const [paymentMethod, setPaymentMethod] = useState<string>("Cash");//Cash //Installment
	const [warehouseId, setWarehouseId] = useState<string>("all");
	const {
		data: InventoryStockDetailData,
		isLoading: isLoadingInventoryStockDetail,
	} = useGetInventoryStockDetail({
		WarehouseId: warehouseId === "all" ? undefined : warehouseId,
		InStockOnly: true,
		TrackSerial: false,
		Page: page,
		PageSize: pageSize,
	});

	const { data: warehouseData, isLoading: isLoadingWarehouse } =
		useGetWarehouse({
			Page: 1,
			PageSize: 100,
		});
	const { data: serialsData, isLoading: isLoadingSerial } =
		useGetSerialNumbers({
			warehouseId: warehouseId === "all" ? undefined : warehouseId,
			search: searchTermSerial,
			page: pageSerial,
			pageSize: pageSize,
			currentStatus: "IN_STOCK",
		});
	const {
		data: installmentProviderData,
		isLoading: isLoadingInstallmentProvider,
	} = useGetInstallmentProvider({
		IsActive: true,
		Page: 1,
		PageSize: 10,
	});
	const [discount, setDiscount] = useState<number>(0);
	const getCustomersByPhoneNumber = useGetCustomersByPhoneNumber();
	const [listProductVariant, setListProductVariant] = useState<
		PurchaseOrderItemPreView[]
	>([]);
	const handleAddProductVariantList = (
		value: ProductVariantResponse,
		serialValue?: SerialNumberResponse,
	) => {
		if (value.stockQuantity < 1) return;
		setListProductVariant((prev) => {
			const existsSerialCode = prev.some(
				(x) => x.serialCode === serialValue?.serialCode,
			);
			if (serialValue && existsSerialCode) return prev;
			const exists = prev.some((x) => x.productVariantId === value.id);
			if (exists && !serialValue) {
				return prev.map((item) =>
					item.productVariantId === value.id &&
					item.quantity < item.stockQuantity
						? {
								...item,
								quantity: item.quantity + 1,
							}
						: item,
				);
			}
			return [
				...prev,
				{
					productVariantId: value.id,
					quantity: 1,
					unitPrice: value.sellingPrice || 0,
					sku: value.sku || "",
					productBrandName: value?.product?.brand?.name || "",
					stockQuantity: value?.stockQuantity || 1,
					productName: value?.product?.name || "",
					productCategoryName: value?.product?.category?.name || "",
					sellingPrice: value?.sellingPrice || 0,
					trackSerial: value?.trackSerial,
					serialCode: serialValue?.serialCode,
					serialNumberId: serialValue?.id || undefined,
				},
			];
		});
	};
	const handleRemoveProductVariantList = (productVariantId: string) => {
		setListProductVariant((prev) =>
			prev.filter((x) => x.productVariantId !== productVariantId),
		);
	};
	const handleUnitPriceChange = (
		productVariantId: string,
		unitPrice: number,
		serialCode?: string,
	) => {
		if (!!serialCode) {
			setListProductVariant((prev) =>
				prev.map((item) =>
					item.serialCode === serialCode
						? {
								...item,
								unitPrice,
							}
						: item,
				),
			);
		} else {
			setListProductVariant((prev) =>
				prev.map((item) =>
					item.productVariantId === productVariantId
						? {
								...item,
								unitPrice,
							}
						: item,
				),
			);
		}
	};
	const handleQuantityChange = (
		productVariantId: string,
		quantity: number,
		serialCode?: string,
	) => {
		if (!!serialCode) {
			setListProductVariant((prev) =>
				prev.map((item) =>
					item.serialCode === serialCode
						? {
								...item,
								quantity,
							}
						: item,
				),
			);
		} else {
			setListProductVariant((prev) =>
				prev.map((item) =>
					item.productVariantId === productVariantId
						? {
								...item,
								quantity,
							}
						: item,
				),
			);
		}
	};
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			customerName: "",
			customerPhone: "",
			customerEmail: "",
			customerAddress: "",
			PaymentMethod: "Cash",
			Items: [
				{
					ProductVariantId: "",
					SerialNumberId: "",
					Quantity: 1,
					UnitPrice: 0,
					DiscountAmount: 0,
				},
			],
			ProviderId: "",
			downPayment: 0,
			loanAmount: 0,
			installmentMonths: 12,
			interestRate: 1.5,
		},
	});
	const { watch, setValue, control } = form;
	const fieldArray = useFieldArray({
		control,
		name: "Items",
	});
	const createOrder = useCreateOrder();
	const createInstallmentOrder = useCreateInstallmentOrder();
	const onSubmit = (data: FormValues) => {
		console.log(data);
		const request: CreateSaleOrderRequest = {
			PaymentMethod: data.PaymentMethod,
			Customer: {
				FullName: data.customerName,
				PhoneNumber: data.customerPhone,
				Email: data.customerEmail ?? "",
				Address: data.customerAddress ?? "",
			},
			Items: listProductVariant.map((item) => ({
				ProductVariantId: item.productVariantId,
				SerialNumberId: item.serialNumberId ?? undefined,
				Quantity: item.quantity,
				UnitPrice: item.unitPrice,
				DiscountAmount: discount,
			})),
		};
		if (data.PaymentMethod === "Installment") {
			const installmentRequest: CreateInstallmentOrderRequest = {
				...request,
				ProviderId: data.ProviderId!,
				downPayment: +data.downPayment,
				loanAmount: data.loanAmount,
				installmentMonths: data.installmentMonths,
				interestRate: data.interestRate,
			};
			console.log(installmentRequest);
			createInstallmentOrder.mutate(installmentRequest, {
				onSuccess: () => {
					alert("Bán hàng thành công")
				},
				onSettled: () => {
					router.push("admin/orders")	
				},
			});
			return;
		}
		console.log(request);
		createOrder.mutate(request, {
			onSuccess: () => {
				alert("Bán hàng thành công")
			},
			onSettled: () => {
				router.push("/admin/orders");
			},
		});
	};
	const handleSearch = (value: string) => {
		setSearchInput(value);
		setPage(DEFAULT_PAGE);
	};
	const handleSearchSerial = (value: string) => {
		setSearchInputSerial(value);
		setPageSerial(DEFAULT_PAGE);
	};
	const handleSearchCustomer = () => {
		// eslint-disable-next-line react-hooks/incompatible-library
		const customerPhone = watch("customerPhone");
		getCustomersByPhoneNumber.mutate(customerPhone, {
			onSuccess: (data) => {
				console.log(data);
				const customer = data?.data;
				if (!customer) return;
				setValue("customerName", customer.fullName);
				setValue("customerEmail", customer.email ?? "");
				setValue("customerAddress", customer.address ?? "");
			},
		});
	};
	const totalAmount = listProductVariant.reduce(
		(sum, item) => sum + item.quantity * item.unitPrice,
		0,
	);
	const downPayment = watch("downPayment") ?? 0;
	useEffect(() => {
		setValue(
			"loanAmount",
			Math.max(0, totalAmount - discount - +downPayment),
		);
	}, [downPayment, totalAmount, discount, setValue]);
	const handleWarehouseId = (value: string) => {
		setWarehouseId(value);
		setPage(DEFAULT_PAGE);
	};
	return {
		tab,
		setTab,
		form,
		page,
		setPage,
		pageSerial,
		setPageSerial,
		pageSize,
		onSubmit,
		searchTerm,
		searchTermSerial,
		searchInput,
		searchInputSerial,
		handleSearch,
		handleSearchSerial,
		discount,
		setDiscount,
		totalAmount,
		listProductVariant,
		handleAddProductVariantList,
		handleRemoveProductVariantList,
		handleUnitPriceChange,
		handleQuantityChange,
		InventoryStockDetailData,
		handleSearchCustomer,
		isLoadingInventoryStockDetail,
		fields: fieldArray.fields,
		append: fieldArray.append,
		remove: fieldArray.remove,
		isCreating: createOrder.isPending || createInstallmentOrder.isPending,
		warehouseId,
		handleWarehouseId,
		warehouseData,
		isLoadingWarehouse,
		serialsData,
		isLoadingSerial,
		isLoadingInstallmentProvider,
		installmentProviderData,
	};
}
