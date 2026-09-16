"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

interface ProductFiltersProps {
  search: string;
  stockStatus: string;
  onSearchChange: (value: string) => void;
  onStockStatusChange: (value: string) => void;
}

export default function ProductFilters({
  search,
  stockStatus,
  onSearchChange,
  onStockStatusChange,
}: ProductFiltersProps) {
  const clearFilters = () => {
    onSearchChange("");
    onStockStatusChange("ALL");
  };

  const hasFilters =
    search.trim() !== "" || stockStatus !== "ALL";

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search products by name or SKU..."
            className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Stock Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

          <select
            value={stockStatus}
            onChange={(event) =>
              onStockStatusChange(event.target.value)
            }
            className="h-11 min-w-[170px] rounded-lg border bg-background px-3 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Stock</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">
              Out of Stock
            </option>
          </select>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition hover:bg-muted"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}