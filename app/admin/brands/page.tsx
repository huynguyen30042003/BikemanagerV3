"use client";

import BrandsPageClient from "@/components/Product/BrandsPageClient";
import { Suspense} from "react";


export default function BrandsPage() {
	
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<BrandsPageClient/>
		</Suspense>
	);
}
