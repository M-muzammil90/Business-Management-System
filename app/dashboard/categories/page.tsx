"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  totalCategories: number;
  totalPages: number;
}

const SEARCH_DEBOUNCE_MS = 400;

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCategories: 0,
    totalPages: 0,
  });

  // Instant-typing input, debounced value drives the request.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const deletingRef = useRef<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPagination((current) => ({ ...current, page: 1 }));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login again.");

      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (search.trim()) params.set("search", search.trim());

      const response = await fetch(`/api/categories?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load categories.");
      }

      setItems(result.data.categories || []);
      setPagination(result.data.pagination);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create category.");
      }

      setName("");
      setDescription("");
      // A new category should be visible immediately — jump back to page 1
      // rather than leaving the user on whatever page they were viewing.
      if (pagination.page !== 1) {
        setPagination((current) => ({ ...current, page: 1 }));
      } else {
        await fetchCategories();
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to create category.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(item: Category) {
    if (deletingRef.current.has(item._id)) return;
    if (!window.confirm(`Delete ${item.name}? This can't be undone.`)) return;

    deletingRef.current.add(item._id);
    setDeletingId(item._id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/categories/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete category.");
      }

      // If this was the last row on a page beyond the first, step back a
      // page rather than landing on a page that no longer has any rows.
      const isLastRowOnPage = items.length === 1 && pagination.page > 1;
      if (isLastRowOnPage) {
        setPagination((current) => ({ ...current, page: current.page - 1 }));
      } else {
        await fetchCategories();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete category.");
    } finally {
      deletingRef.current.delete(item._id);
      setDeletingId(null);
    }
  }

  const activeCount = items.filter((item) => item.isActive).length;
  const canGoPrev = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  return (
    <DashboardPageShell
      eyebrow="Catalog"
      title="Categories"
      description="Manage the live product categories used across your organization."
      actions={
        <Button onClick={fetchCategories} variant="outline">
          Refresh
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total categories</p>
            {loading ? (
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <p className="mt-2 text-3xl font-bold">{pagination.totalCategories}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Active on this page</p>
            {loading ? (
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <p className="mt-2 text-3xl font-bold">
                {activeCount} <span className="text-base font-normal text-muted-foreground">/ {items.length}</span>
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Current page</p>
            <p className="mt-2 text-3xl font-bold">
              {pagination.page} <span className="text-base font-normal text-muted-foreground">/ {Math.max(pagination.totalPages, 1)}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create form */}
      <Card>
        <CardContent className="p-5">
          <form onSubmit={createCategory} className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <input
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Category name"
              aria-label="Category name"
              className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description (optional)"
              aria-label="Category description"
              className="h-10 flex-[1.4] rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button disabled={saving} type="submit" className="sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Add category"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b p-5">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search categories"
                aria-label="Search categories"
                className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {error && (
            <div className="m-5 flex items-center justify-between rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <span>{error}</span>
              <button onClick={fetchCategories} className="font-semibold underline underline-offset-2">
                Retry
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-5 py-3 text-xs uppercase text-muted-foreground">Category</th>
                  <th className="px-5 py-3 text-xs uppercase text-muted-foreground">Description</th>
                  <th className="px-5 py-3 text-xs uppercase text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-xs uppercase text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="px-5 py-4">
                        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                      </td>
                    </tr>
                  ))
                ) : items.length ? (
                  items.map((item) => (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="px-5 py-4 font-medium">{item.name}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{item.description || "—"}</td>
                      <td className="px-5 py-4">
                        <Badge variant={item.isActive ? "secondary" : "outline"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          aria-label={`Delete ${item.name}`}
                          onClick={() => deleteCategory(item)}
                          disabled={deletingId === item._id}
                          className="text-destructive transition-opacity hover:opacity-70 disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                      {search ? `No categories match "${search}".` : "No categories yet — add your first one above."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t p-4">
              <p className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} · {pagination.totalCategories} total
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canGoPrev}
                  onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canGoNext}
                  onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}