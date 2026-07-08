"use client";

import CustomerStatisticsPage from "@/components/Customer/CustomerStatisticsPage";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CustomerStatisticsPage />
		</Suspense>
	);
}
