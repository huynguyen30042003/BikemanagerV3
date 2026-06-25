import WarehousesPageClient from "@/components/Warehouses/WarehousesPageClient";
import { Suspense } from "react";

export default function WarehousesPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<WarehousesPageClient />
		</Suspense>
	);
}
