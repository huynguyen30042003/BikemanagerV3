"use client";

import CreatePOPageClient from "@/components/Suppliers/CreatePOPageClient";
import { Suspense } from "react";

export default function CreatePOPage() {
	
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CreatePOPageClient/>
		</Suspense>
	);
}
