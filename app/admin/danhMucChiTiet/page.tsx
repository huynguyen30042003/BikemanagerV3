"use client";

import CategoryPagreClient from "@/components/Product/Category/CategoryPagreClient";
import { Suspense } from "react";

function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CategoryPagreClient />
		</Suspense>
	);
}

export default Page;
