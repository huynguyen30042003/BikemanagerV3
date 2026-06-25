"use client";

import CategoriesPageClient from "@/components/Category/CategoriesPageClient";
import { Suspense } from "react";

export default function CategoriesPage() {
	

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CategoriesPageClient/>
		</Suspense>
	);
}
