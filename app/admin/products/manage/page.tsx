"use client";

import { Suspense } from "react";
import VehiclesManagerPageClient from "@/components/Product/VehiclesManagerPageClient";
export default function VehiclesPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehiclesManagerPageClient/>
    </Suspense>
  );
}