"use client";

import SuppliersPageClient from "@/components/Suppliers/SuppliersPageClient";
import { Suspense } from "react";

export default function SuppliersPage() {

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SuppliersPageClient/>
		</Suspense>
	);
}
