"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes, PackageCheck, RefreshCw, Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product { _id: string; name: string; sku: string; stock: number; costPrice?: number; price: number; }
interface Movement { _id: string; quantity: number; type: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT"; reason?: string; createdAt: string; productId?: { name?: string; sku?: string; }; }
interface ApiResult<T> { success: boolean; message?: string; data?: T; }

const money = (value: number) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [action, setAction] = useState<"STOCK_IN" | "STOCK_OUT" | null>(null);
  const [form, setForm] = useState({ productId: "", quantity: "", reason: "" });

  const fetchInventory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { setError("Please login again."); setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [productsResponse, historyResponse] = await Promise.all([
        fetch("/api/products?page=1&limit=100", { headers, cache: "no-store" }),
        fetch(`/api/inventory?page=1&limit=50${type !== "ALL" ? `&type=${type}` : ""}`, { headers, cache: "no-store" }),
      ]);
      const productsResult: ApiResult<{ products: Product[] }> = await productsResponse.json();
      const historyResult: ApiResult<{ inventory: Movement[] }> = await historyResponse.json();
      if (!productsResponse.ok || !productsResult.success) throw new Error(productsResult.message || "Unable to load products");
      if (!historyResponse.ok || !historyResult.success) throw new Error(historyResult.message || "Unable to load inventory history");
      setProducts(productsResult.data?.products || []);
      setMovements(historyResult.data?.inventory || []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load inventory.");
    } finally { setLoading(false); }
  }, [type]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const visibleProducts = useMemo(() => products.filter((product) => `${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const inventoryValue = products.reduce((sum, product) => sum + product.stock * (product.costPrice || 0), 0);

  async function submitMovement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action || !form.productId || Number(form.quantity) < 1) return;
    const token = localStorage.getItem("token");
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/inventory/${action === "STOCK_IN" ? "stock-in" : "stock-out"}`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: form.productId, quantity: Number(form.quantity), reason: form.reason || undefined }) });
      const result: ApiResult<unknown> = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to update stock");
      setAction(null);
      setForm({ productId: "", quantity: "", reason: "" });
      await fetchInventory();
    } catch (movementError) { setError(movementError instanceof Error ? movementError.message : "Unable to update stock."); }
    finally { setSaving(false); }
  }

  return <DashboardPageShell eyebrow="Operations" title="Inventory control" description="Live stock levels, warehouse value and recent movement in one view." actions={<><Button variant="outline" className="h-10 rounded-lg" onClick={fetchInventory}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button><Button className="h-10 rounded-lg" onClick={() => setAction("STOCK_IN")}><ArrowDownToLine className="mr-2 h-4 w-4" />Add stock</Button></>}>
    {error && <div role="alert" className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span>{error}</span><button className="font-semibold underline" onClick={fetchInventory}>Retry</button></div>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[{ label: "Total units", value: totalUnits.toLocaleString("en-PK"), detail: `${products.length} active products`, icon: Boxes }, { label: "Healthy stock", value: `${Math.max(products.length - lowStock - outOfStock, 0)}`, detail: "Above reorder level", icon: PackageCheck }, { label: "Needs attention", value: String(lowStock + outOfStock), detail: `${outOfStock} out of stock`, icon: AlertTriangle }, { label: "Inventory value", value: money(inventoryValue), detail: "At cost price", icon: TrendingUp }].map(({ label, value, detail, icon: Icon }) => <Card key={label} className="border-border/60 shadow-sm"><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-bold tracking-tight">{loading ? "..." : value}</p></div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div></div><p className="mt-4 text-sm text-muted-foreground">{detail}</p></CardContent></Card>)}
    </div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <Card className="border-border/60 shadow-sm"><CardHeader><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><CardTitle>Product stock</CardTitle><p className="mt-1 text-sm text-muted-foreground">Search and review current availability.</p></div><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SKU or product" className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none sm:w-52" /></div><SlidersHorizontal className="mt-2 h-4 w-4 text-muted-foreground" /></div></div></CardHeader><CardContent className="p-5 pt-0"><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="pb-3 font-medium">Product</th><th className="pb-3 font-medium">SKU</th><th className="pb-3 font-medium">Stock</th><th className="pb-3 text-right font-medium">Value</th><th className="pb-3 text-right font-medium">Action</th></tr></thead><tbody>{visibleProducts.map((product) => <tr key={product._id} className="border-b last:border-0"><td className="py-4 font-medium">{product.name}</td><td className="py-4 text-muted-foreground">{product.sku}</td><td className="py-4">{product.stock === 0 ? <Badge variant="destructive">Out</Badge> : product.stock <= 5 ? <Badge variant="secondary">{product.stock} low</Badge> : <span className="text-emerald-600">{product.stock}</span>}</td><td className="py-4 text-right">{money(product.stock * (product.costPrice || 0))}</td><td className="py-4 text-right"><Button variant="ghost" size="sm" onClick={() => { setAction("STOCK_IN"); setForm((current) => ({ ...current, productId: product._id })); }}>Adjust</Button></td></tr>)}{!loading && !visibleProducts.length && <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No products found.</td></tr>}</tbody></table></div></CardContent></Card>
      <Card className="border-border/60 shadow-sm"><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Movement history</CardTitle><p className="mt-1 text-sm text-muted-foreground">Latest stock activity.</p></div><select value={type} onChange={(event) => setType(event.target.value)} className="h-9 rounded-lg border bg-background px-2 text-xs"><option value="ALL">All</option><option value="STOCK_IN">Stock in</option><option value="STOCK_OUT">Stock out</option><option value="ADJUSTMENT">Adjustments</option></select></div></CardHeader><CardContent className="space-y-3 p-5 pt-0">{movements.slice(0, 8).map((movement) => <div key={movement._id} className="flex items-center justify-between rounded-xl border p-3"><div className="min-w-0"><p className="truncate font-medium">{movement.productId?.name || "Product"}</p><p className="text-xs text-muted-foreground">{new Date(movement.createdAt).toLocaleDateString("en-PK")} · {movement.reason || "Stock update"}</p></div><div className="ml-3 text-right"><p className={`text-sm font-semibold ${movement.type === "STOCK_OUT" ? "text-red-600" : "text-emerald-600"}`}>{movement.type === "STOCK_OUT" ? "-" : "+"}{movement.quantity}</p><p className="text-[10px] uppercase text-muted-foreground">{movement.type.replace("_", " ")}</p></div></div>)}{!loading && !movements.length && <p className="py-12 text-center text-sm text-muted-foreground">No movement history yet.</p>}</CardContent></Card>
    </div>
    {action && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={submitMovement} className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inventory action</p><h2 className="mt-1 text-2xl font-semibold">{action === "STOCK_IN" ? "Add stock" : "Remove stock"}</h2></div><button type="button" onClick={() => setAction(null)} className="text-sm text-muted-foreground">Close</button></div><label className="mt-6 block text-sm font-medium">Product<select required value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })} className="mt-2 h-11 w-full rounded-lg border bg-background px-3"><option value="">Select product</option>{products.map((product) => <option key={product._id} value={product._id}>{product.name} · {product.stock} available</option>)}</select></label><label className="mt-4 block text-sm font-medium">Quantity<input required min="1" type="number" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} className="mt-2 h-11 w-full rounded-lg border bg-background px-3" /></label><label className="mt-4 block text-sm font-medium">Reason<input value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="Optional note" className="mt-2 h-11 w-full rounded-lg border bg-background px-3" /></label><Button disabled={saving} className="mt-6 w-full">{saving ? "Saving..." : "Confirm update"}</Button></form></div>}
  </DashboardPageShell>;
}
