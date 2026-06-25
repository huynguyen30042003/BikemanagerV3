"use client";

import InstallmentProvidersPageClient from "@/components/Order/InstallmentProvidersPageClient";
import { Suspense } from "react";

export default function InstallmentProvidersPage() {

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<InstallmentProvidersPageClient/>
		</Suspense>
	);
}
