"use client";

import OrdersPageClient from "@/components/Order/OrdersPageClient";
import { Suspense } from "react";

export default function OrdersPage() {
	
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OrdersPageClient/>
		</Suspense>
	);
}
