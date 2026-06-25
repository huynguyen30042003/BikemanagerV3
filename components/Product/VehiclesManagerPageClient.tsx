"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table } from "@/components/ui/Table";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetProductsDashboard,
  useGetProductsListDashboard,
} from "@/hooks/Product/useProductVariants";
import { ProductVariant } from "@/types/product/productVariants";

import { useVehiclesPageState } from "@/hooks/Product/Usevehiclespagestate";
import { getVehicleColumns } from "@/columns/vehicleColumns";
import { VehicleKpiCards } from "@/components/Product/VehicleKpiCards";
import { VehicleFilterBar } from "@/components/Product/VehicleFilterBar";
import { VehicleWarrantyOverview } from "@/components/Product/VehicleWarrantyOverview";
export default function VehiclesManagerPageClient() {
  const router = useRouter();

  const {
    page,
    setPage,
    pageSize,
    searchBy,
    setSearchBy,
    priceRange,
    setPriceRange,
    debouncedPriceRange,
    searchInput,
    searchTerm,
    handleSearch,
  } = useVehiclesPageState();

  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetProductsDashboard();

  const { data: productsListData } = useGetProductsListDashboard({
    search: searchTerm,
    searchBy,
    minPrice: debouncedPriceRange[0],
    maxPrice: debouncedPriceRange[1],
    page,
    pageSize,
  });

  const columns = getVehicleColumns(router);

  return (
      <div className="space-y-8 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Phương tiện</h1>
            <p className="text-muted-foreground">
              Quản lý danh sách phương tiện và bảo hành
            </p>
          </div>
          <Button>
            <Plus size={18} />
            Thêm phương tiện
          </Button>
        </div>

        {/* KPI Cards */}
        <VehicleKpiCards
          totalStock={dashboardData?.data.totalStock}
          totalSellingPrice={dashboardData?.data.totalSellingPrice}
          isLoading={isDashboardLoading}
        />

        {/* Filters */}
        <VehicleFilterBar
          searchInput={searchInput}
          searchBy={searchBy}
          priceRange={priceRange}
          onSearch={handleSearch}
          onSearchByChange={setSearchBy}
          onPriceRangeChange={setPriceRange}
        />

        <Card className="pb-0">
          <CardHeader>
            <CardTitle>Danh sách phương tiện</CardTitle>
            <CardDescription>
              Hiển thị {productsListData?.items?.length ?? 0} phương tiện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table<ProductVariant>
                showIndex
                data={productsListData?.items ?? []}
                columns={columns}
              />
            </div>
            <div className="flex flex-col gap-3 border-t px-4 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                Trang {page} / {productsListData?.totalPages}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>

                {Array.from({ length: productsListData?.totalPages }, (_, index) => index + 1).map((currentPage) => (
                  <Button
                    key={currentPage}
                    type="button"
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setPage(currentPage)}
                  >
                    {currentPage}
                  </Button>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  disabled={page === productsListData?.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty */}
        <VehicleWarrantyOverview />
      </div>
  );
}