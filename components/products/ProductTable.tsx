"use client";

import {
  MoreHorizontal,
  Package,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Product } from "@/types/product.ts";


interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStockStatus(stock: number) {
  if (stock === 0) {
    return {
      label: "Out of stock",
      className:
        "bg-destructive/10 text-destructive",
    };
  }

  if (stock <= 5) {
    return {
      label: "Low stock",
      className:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }

  return {
    label: "In stock",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
}

export default function ProductTable({
  products,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="space-y-4 p-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-lg font-semibold">
          No products found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Product
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                SKU
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Category
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Price
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => {
              const stockStatus = getStockStatus(
                product.stock,
              );

              return (
                <tr
                  key={product._id}
                  className="transition-colors hover:bg-muted/20"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {product.name}
                        </p>

                        <p className="mt-0.5 max-w-[220px] truncate text-xs text-muted-foreground">
                          {product.description ||
                            "No description"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                      {product.sku}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-sm">
                    {product.categoryId?.name || "Uncategorized"}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(product.price)}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold tabular-nums">
                      {product.stock.toLocaleString("en-PK")}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stockStatus.className}`}
                    >
                      {stockStatus.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onDelete(product)} className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y lg:hidden">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock);

          return (
            <div
              key={product._id}
              className="space-y-4 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>

                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {product.sku}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/30 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Price
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Stock
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {product.stock}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Category
                  </p>

                  <p className="mt-1 truncate text-sm font-medium">
                    {product.categoryId?.name ||
                      "Uncategorized"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stockStatus.className}`}
                  >
                    {stockStatus.label}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border text-xs font-semibold transition hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/20 text-xs font-semibold text-destructive transition hover:bg-destructive/5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-semibold text-foreground">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {pagination.totalPages}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() =>
                onPageChange(pagination.page - 1)
              }
              className="inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              disabled={
                pagination.page >= pagination.totalPages
              }
              onClick={() =>
                onPageChange(pagination.page + 1)
              }
              className="inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}