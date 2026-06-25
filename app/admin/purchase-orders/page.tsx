"use client";

import PurchaseOrdersPageClient from "@/components/Suppliers/PurchaseOrdersPageClient";
import { Suspense } from "react";

export default function PurchaseOrdersPage() {
	
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PurchaseOrdersPageClient/>
		</Suspense>
	);
}
