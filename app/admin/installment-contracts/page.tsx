"use client";

import { Suspense } from "react";
import InstallmentContractsPageClient from "@/components/Order/InstallmentContractsPageClient";


export default function InstallmentContractsPage() {

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<InstallmentContractsPageClient/>
		</Suspense>
	);
}
