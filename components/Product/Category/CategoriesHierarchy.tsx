"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Edit2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryDto } from "@/types/product/category";
import { useDeleteCategory } from "@/hooks/Product/useCategory";
import ConfirmDialog from "@/components/Common/ConfirmDialog";

type CategoryNode = Omit<CategoryDto, "children"> & {
  children: CategoryNode[];
};

interface CategoriesHierarchyProps {
  searchTerm: string;
  categories?: CategoryDto[];
}

const filterCategories = (
  categories: CategoryDto[],
  searchTerm: string,
): CategoryNode[] => {
  const keyword = searchTerm.trim().toLowerCase();

  const toNode = (category: CategoryDto): CategoryNode => ({
    ...category,
    children: (category.children ?? []).flatMap((child) =>
      filterCategories([child], searchTerm),
    ),
  });

  if (!keyword) {
    return categories.map((category) => toNode(category));
  }

  const matchesCategory = (category: CategoryDto) =>
    category.name.toLowerCase().includes(keyword) ||
    category.slug.toLowerCase().includes(keyword) ||
    (category.description?.toLowerCase().includes(keyword) ?? false);

  return categories.flatMap((category) => {
    const filteredChildren = filterCategories(category.children ?? [], searchTerm);

    if (matchesCategory(category)) {
      return [
        {
          ...category,
          children: filteredChildren,
        },
      ];
    }

    if (filteredChildren.length > 0) {
      return [
        {
          ...category,
          children: filteredChildren,
        },
      ];
    }

    return [];
  });
};

function CategoryRow({
  category,
  level,
  expandedIds,
  onToggleExpand,
  handleDelete,
  setSelectedCategory
}: {
  category: CategoryNode;
  level: number;
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
  handleDelete: (category: CategoryDto) => void
  setSelectedCategory: (category: CategoryDto) => void
}) {
  const hasChildren = category.children.length > 0;
  const isExpanded = expandedIds.includes(category.id);

  return (
    <div className="space-y-2">
      <div
        className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex flex-1 items-center gap-2">
          <div className="w-7">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => onToggleExpand(category.id)}
                className="rounded p-1 transition-colors hover:bg-accent"
                aria-label={isExpanded ? "Thu gọn danh mục" : "Mở rộng danh mục"}
              >
                <ChevronRight
                  size={18}
                  className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>
            ) : null}
          </div>

          <div>
            <p className="font-medium">{category.name}</p>
            <p className="text-sm text-muted-foreground">{category.slug}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link href={`/admin/category/${category.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit2 size={16} />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            type="button"
            aria-label="Xóa danh mục"
            onClick={() => handleDelete(category)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {hasChildren && isExpanded ? (
        <div className="space-y-2 border-l-2 border-border pl-3">
          {category.children.map((child) => (
            <CategoryRow
              key={child.id}
              category={child}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              handleDelete={handleDelete}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function CategoriesHierarchy({
  searchTerm,
  categories = [],
}: CategoriesHierarchyProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const deleteCategory = useDeleteCategory()
  const visibleCategories = useMemo(
    () => filterCategories(categories, searchTerm),
    [categories, searchTerm],
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto>();
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((currentId) => currentId !== id)
        : [...prev, id],
    );
  };

  const handleDelete = (id: string) => {
    console.log(id);
    
    if(!!id === false) {
      alert("id faild")
      return
    }
      deleteCategory.mutateAsync(id)
  }
  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      setDeleteOpen(false);
      setSelectedCategory(undefined);
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  const handleDeleteBrand = (category: CategoryDto) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách danh mục</CardTitle>
        <CardDescription>Cấu trúc phân cấp của các danh mục</CardDescription>
      </CardHeader>
      <CardContent>
        {visibleCategories.length > 0 ? (
          <div className="space-y-2">
            {visibleCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                level={0}
                expandedIds={expandedIds}
                onToggleExpand={toggleExpand}
                handleDelete={handleDeleteBrand}
                setSelectedCategory={setSelectedCategory}
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">Không có danh mục nào</p>
        )}
      </CardContent>
      <ConfirmDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              variant="delete"
              title="Xóa thương hiệu"
              description={`Bạn có chắc muốn xóa "${selectedCategory?.name ?? ""}" không?`}
              confirmText="Xóa"
              loading={deleteCategory.isPending}
              onConfirm={handleConfirmDelete}
            />
    </Card>
  );
}
