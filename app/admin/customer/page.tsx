"use client";

import { Suspense } from "react";
import CustomerPageClient from "@/components/Customer/CustomerPageClient";

function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CustomerPageClient />
		</Suspense>
	);
}

export default Page;
