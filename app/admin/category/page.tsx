"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCategoryPageState } from "@/hooks/Product/useCategoryPageState";
import { useGetCategories } from "@/hooks/Product/useCategory";
import CategoryStats from "@/components/Product/Category/CategoryStats";
import CategoriesHierarchy from "@/components/Product/Category/CategoriesHierarchy";

export default function CategoriesPage() {
  const { searchInput, searchTerm, handleSearch } =
    useCategoryPageState();
  const { data: dataCategory, isLoading } = useGetCategories({search: searchTerm});

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Danh mục</h1>
          <p className="text-muted-foreground">Quản lý danh mục sản phẩm</p>
        </div>
        <Link href="/admin/category/new">
          <Button>
            <Plus size={18} />
            <span>Thêm danh mục</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <CategoryStats
        totalCategory={dataCategory?.totalItems}
        totalMainCategory={dataCategory?.items?.length}
        totalSecondCategory={
          dataCategory?.totalItems - dataCategory?.items?.length
        }
        isLoading={isLoading}
      />
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Tìm theo tên, slug, hoặc mô tả..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {!isLoading && (
        <CategoriesHierarchy
          categories={dataCategory?.items}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}
