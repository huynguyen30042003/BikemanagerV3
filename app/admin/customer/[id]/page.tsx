"use client";

import { Suspense } from "react";
import CustomerDetailPageClient from "@/components/Customer/CustomerDetailPageClient";

function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CustomerDetailPageClient />
		</Suspense>
	);
}

export default Page;
