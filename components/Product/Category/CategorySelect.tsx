"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CategoryDto } from "@/types/product/category";

// ─── Types ────────────────────────────────────────────────────────────────────
type CategoryNode = Omit<CategoryDto, "children"> & {
  children: CategoryNode[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const filterNodes = (nodes: CategoryDto[], keyword: string): CategoryNode[] => {
  const kw = keyword.trim().toLowerCase();

  const toNode = (c: CategoryDto): CategoryNode => ({
    ...c,
    children: filterNodes(c.children ?? [], keyword),
  });

  if (!kw) return nodes.map(toNode);

  return nodes.flatMap((c) => {
    const filteredChildren = filterNodes(c.children ?? [], keyword);
    const matches =
      c.name.toLowerCase().includes(kw) ||
      c.slug.toLowerCase().includes(kw);

    if (matches) return [{ ...c, children: filteredChildren }];
    if (filteredChildren.length > 0) return [{ ...c, children: filteredChildren }];
    return [];
  });
};

// ─── CategoryNode Row ─────────────────────────────────────────────────────────
function CategoryOption({
  node,
  level,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
}: {
  node: CategoryNode;
  level: number;
  selectedId?: string;
  expandedIds: string[];
  onToggle: (id: string) => void;
  onSelect: (node: CategoryNode) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected = node.id === selectedId;

  return (
    <div>
      <div
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
          isSelected && "bg-accent font-medium text-accent-foreground",
        )}
        style={{ paddingLeft: `${8 + level * 16}px` }}
      >
        {/* expand toggle */}
        <button
          type="button"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
        >
          {hasChildren ? (
            <ChevronRight
              size={14}
              className={cn(
                "transition-transform text-muted-foreground",
                isExpanded && "rotate-90",
              )}
            />
          ) : (
            <span className="h-4 w-4" /> // spacer
          )}
        </button>

        {/* label */}
        <span
          className="flex-1 truncate"
          onClick={() => onSelect(node)}
        >
          {node.name}
        </span>

        {/* check mark */}
        {isSelected && (
          <Check size={14} className="shrink-0 text-primary" />
        )}
      </div>

      {/* children */}
      {hasChildren && isExpanded && (
        <div className="border-l border-border ml-4.5">
          {node.children.map((child) => (
            <CategoryOption
              key={child.id}
              node={child ?? undefined}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface CategorySelectProps {
  categories: CategoryDto[];
  value?: string;
  onChange: (id: string) => void;
  placeholder?: string;
  error?: string;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  placeholder = "Chọn danh mục",
  error,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Flatten all categories to find selected name
  const flatAll = useMemo(() => {
    const flatten = (nodes: CategoryDto[]): CategoryDto[] =>
      nodes.flatMap((n) => [n, ...flatten(n.children ?? [])]);
    return flatten(categories);
  }, [categories]);

  const selectedName = flatAll.find((c) => c.id === value)?.name;

  const visibleNodes = useMemo(
    () => filterNodes(categories, search),
    [categories, search],
  );

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSelect = (node: CategoryNode) => {
    onChange(node.id);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between font-normal",
              !selectedName && "text-muted-foreground",
            )}
          >
            <span className="truncate">{selectedName ?? placeholder}</span>
            <ChevronDown size={16} className="ml-2 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          {/* Search */}
          <div className="border-b p-2">
            <Input
              placeholder="Tìm danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
              autoFocus
            />
          </div>

          {/* Tree */}
          <div className="max-h-64 overflow-y-auto p-1">
            {visibleNodes.length > 0 ? (
              visibleNodes.map((node) => (
                <CategoryOption
                  key={node.id}
                  node={node}
                  level={0}
                  selectedId={value}
                  expandedIds={
                    search
                      ? flatAll.map((c) => c.id) // auto-expand khi search
                      : expandedIds
                  }
                  onToggle={toggleExpand}
                  onSelect={handleSelect}
                />
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy danh mục
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}