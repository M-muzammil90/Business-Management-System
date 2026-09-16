"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import ProductTable from "@/components/products/ProductTable";
import ProductFilters from "@/components/products/ProductFilters";
import ProductStats from "@/components/products/ProductStats";
import AddProductForm from "@/components/products/AddProductForm";
import type { Product } from "@/types/product";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data?: {
    products: Product[];
    pagination: Pagination;
  };
}

const SEARCH_DEBOUNCE_MS = 400;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Raw input updates instantly for a responsive feel; `search` (debounced)
  // is what actually drives the API call, so fast typing doesn't spam requests.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  // Prevents a double-fire if someone clicks delete twice before the request resolves.
  const deletingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/categories", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch categories.");
      }

      setCategories(result.data?.categories || []);
    } catch (fetchError) {
      console.error("CATEGORY FETCH ERROR:", fetchError);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (search.trim()) params.set("search", search.trim());
      if (stockStatus !== "ALL") params.set("stockStatus", stockStatus);

      const response = await fetch(`/api/products?${params.toString()}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result: ProductsResponse = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch products.");
      }

      setProducts(result.data?.products || []);
      if (result.data?.pagination) {
        setPagination(result.data.pagination);
      }
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, stockStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleStockStatusChange = (value: string) => {
    setStockStatus(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleDelete = async (product: Product) => {
    if (deletingRef.current.has(product._id)) return;
    if (!window.confirm(`Delete ${product.name}? This can't be undone.`)) return;

    deletingRef.current.add(product._id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete product.");
      }
      await fetchProducts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product.");
    } finally {
      deletingRef.current.delete(product._id);
    }
  };

  // NOTE: these are derived from the current page of `products` only (10 items by
  // default), so "Active" / "Low stock" / "Out of stock" reflect this page, not the
  // whole catalog. `totalProducts` is accurate since it comes from `pagination.total`.
  // If accurate store-wide counts are needed here, these should come from a stats
  // endpoint (the dashboard's /api/dashboard/stats already returns global low/out-of-
  // stock counts) rather than being computed from a paginated slice.
  const totalProducts = pagination.total;
  const activeProducts = products.filter((product) => product.isActive).length;
  const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
  const outOfStockProducts = products.filter((product) => product.stock === 0).length;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Management</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.025em] md:text-4xl">Products</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage your products, pricing, inventory and product information from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddProduct(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </section>

      {/* Stats */}
      <ProductStats
        totalProducts={totalProducts}
        activeProducts={activeProducts}
        lowStockProducts={lowStockProducts}
        outOfStockProducts={outOfStockProducts}
      />

      {/* Filters */}
      <ProductFilters
        search={searchInput}
        stockStatus={stockStatus}
        onSearchChange={handleSearchChange}
        onStockStatusChange={handleStockStatusChange}
      />

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <button type="button" onClick={fetchProducts} className="mt-3 text-sm font-semibold text-primary hover:underline">
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      {!error && (
        <ProductTable
          products={products}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
        />
      )}

      {showAddProduct && (
        <AddProductForm categories={categories} onClose={() => setShowAddProduct(false)} onSuccess={fetchProducts} />
      )}

      {editingProduct && (
        <AddProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}