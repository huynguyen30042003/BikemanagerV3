"use client";

import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { useGetCustomers } from "@/hooks/Customer/useCustomer";
import { Customer } from "@/types/customer";
import { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";

function CustomerPageClient() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const searchFromUrl = searchParams.get("search") || "";
	const searchByFromUrl = searchParams.get("searchBy") || "all";

	const pageFromUrl = Number(searchParams.get("page")) || 1;
	const pageSizeFromUrl = Number(searchParams.get("pageSize")) || 10;

	const [page, setPage] = useState(pageFromUrl);
	const pageSize = pageSizeFromUrl;
	const [searchBy, setSearchBy] = useState(searchByFromUrl);

	const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
		delay: 500,
		initialValue: searchFromUrl,
	});

	const { data: dataCustomer, isLoading } = useGetCustomers({
		search: searchTerm,
		searchBy,
		page,
		pageSize,
	});

	// Đồng bộ URL
	useEffect(() => {
		const query = new URLSearchParams();

		if (searchTerm) {
			query.set("search", searchTerm);
		}

		if (searchBy !== "all") {
			query.set("searchBy", searchBy);
		}

		query.set("page", page.toString());
		query.set("pageSize", pageSize.toString());

		router.replace(`${pathname}?${query.toString()}`);
	}, [searchTerm, searchBy, page, pageSize, pathname, router]);

	const columns: Column<Customer>[] = [
		{
			key: "fullName",
			title: "Full Name",
		},
		{
			key: "phoneNumber",
			title: "Số Điện thoại",
			classNameItem: "text-right",
		},
		{
			key: "email",
			title: "Email",
		},
		{
			key: "gender",
			title: "Giới tính",
		},
		{
			key: "address",
			title: "Địa chỉ",
		},
		{
			key: "totalSpent",
			title: "Chi tiêu",
			classNameItem: "text-right",
		},
		{
			key: "totalOrders",
			title: "Số hóa đơn",
			classNameItem: "text-right",
		},
		{
			key: "customerLevel",
			title: "Level",
		},
		{
			key: "actions",
			title: "Action",
			classNameItem: "text-center",
			render: (_value, row: Customer) => (
				<div className="flex gap-2 justify-center">
					<Button
						size="sm"
						variant="outline"
						onClick={() => router.push(`/admin/customer/${row.id}`)}
					>
						View
					</Button>
				</div>
			),
		},
	];

	const totalPages = dataCustomer?.totalPages ?? 1;
	const handleSearch = (value: string) => {
		setSearchInput(value);
		setPage(1);
	};
	return (
			<div className="flex-1 min-h-screen">
				<div className="px-8 h-16 border-b text-[24px] flex items-center justify-between">
					<p>Customer</p>

					<Link href="/admin/customers/new">
						<Button>
							<Plus size={18} />
							Thêm khách hàng
						</Button>
					</Link>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg mx-8 mt-8">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Tổng khách hàng
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{dataCustomer?.totalItems ?? 0}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Doanh thu
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xs text-muted-foreground mt-1">
								Tổng cộng
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Doanh thu trung bình
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xs text-muted-foreground mt-1">
								Mỗi khách hàng
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Tỷ lệ chuyển đổi
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xs text-muted-foreground mt-1">
								Khách hàng hoạt động
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Search */}
				<div className="rounded-xl mx-8 border flex my-4 gap-4 p-4">
					<Input
						value={searchInput}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="Search..."
						className="flex-1"
					/>

					<Select value={searchBy} onValueChange={setSearchBy}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Search by" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="name">Tên khách hàng</SelectItem>
							<SelectItem value="phone">SĐT</SelectItem>
							<SelectItem value="email">Email</SelectItem>
							<SelectItem value="plate">Biển số</SelectItem>
							<SelectItem value="frame">Số khung</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Table */}
				<div className="px-8">
					{!isLoading && (
						<Table<Customer>
							showIndex
							data={dataCustomer?.items ?? []}
							columns={columns}
						/>
					)}
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between px-8 py-6">
					<div>
						Trang {page} / {totalPages}
					</div>

					<div className="flex gap-2">
						<Button
							variant="outline"
							disabled={page === 1}
							onClick={() => setPage((prev) => prev - 1)}
						>
							Previous
						</Button>

						{Array.from(
							{ length: totalPages },
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
							variant="outline"
							disabled={page === totalPages}
							onClick={() => setPage((prev) => prev + 1)}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
	);
}

export default CustomerPageClient;
