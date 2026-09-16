"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Order { _id: string; orderNumber: string; total: number; orderStatus: string; paymentStatus: string; createdAt: string; customerId?: { name?: string; email?: string } | null; }
interface Pagination { page: number; limit: number; totalOrders: number; totalPages: number; }
const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, totalOrders: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please login again.");
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("orderStatus", status);
      const response = await fetch(`/api/orders?${params}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to fetch orders.");
      setOrders(result.data.orders || []);
      setPagination(result.data.pagination);
    } catch (fetchError) { setError(fetchError instanceof Error ? fetchError.message : "Unable to load orders."); }
    finally { setLoading(false); }
  }, [pagination.page, pagination.limit, search, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(orderId: string, orderStatus: string) {
    try {
      setUpdating(orderId);
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/orders/${orderId}`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ orderStatus }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to update order.");
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, orderStatus } : order));
    } catch (updateError) { setError(updateError instanceof Error ? updateError.message : "Unable to update order."); }
    finally { setUpdating(null); }
  }

  const pending = orders.filter((order) => ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.orderStatus)).length;
  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return <DashboardPageShell eyebrow="Sales" title="Orders" description="Live order lifecycle, payment visibility and fulfillment control." actions={<Button variant="outline" onClick={fetchOrders} className="h-10 rounded-lg"><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>}>
    <div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">All orders</p><p className="mt-2 text-3xl font-bold">{pagination.totalOrders}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Open on this page</p><p className="mt-2 text-3xl font-bold">{pending}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Visible revenue</p><p className="mt-2 text-3xl font-bold tabular-nums">Rs. {revenue.toLocaleString("en-PK")}</p></CardContent></Card></div>
    <Card><CardContent className="p-0"><div className="flex flex-col gap-3 border-b p-5 lg:flex-row lg:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPagination((current) => ({ ...current, page: 1 })); }} placeholder="Search order number" className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm" /></div><select value={status} onChange={(event) => { setStatus(event.target.value); setPagination((current) => ({ ...current, page: 1 })); }} className="h-10 rounded-lg border bg-background px-3 text-sm"><option value="">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>{error && <div className="m-5 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}<Button variant="outline" size="sm" className="ml-3" onClick={fetchOrders}>Retry</Button></div>}<div className="overflow-x-auto"><table className="w-full text-left"><thead className="border-b bg-muted/30"><tr>{["Order", "Customer", "Total", "Payment", "Status", "Date"].map((heading) => <th key={heading} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{heading}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">Loading orders...</td></tr> : orders.length === 0 ? <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">No orders found.</td></tr> : orders.map((order) => <tr key={order._id} className="border-b last:border-0"><td className="px-5 py-4 font-medium">{order.orderNumber}</td><td className="px-5 py-4 text-sm text-muted-foreground">{order.customerId?.name || "Walk-in customer"}</td><td className="px-5 py-4 text-sm font-semibold tabular-nums">Rs. {(order.total || 0).toLocaleString("en-PK")}</td><td className="px-5 py-4"><Badge variant={order.paymentStatus === "PAID" ? "secondary" : "outline"}>{order.paymentStatus}</Badge></td><td className="px-5 py-4"><select disabled={updating === order._id || ["DELIVERED", "CANCELLED"].includes(order.orderStatus)} value={order.orderStatus} onChange={(event) => updateStatus(order._id, event.target.value)} className="rounded-md border bg-background px-2 py-1 text-xs"><option>{order.orderStatus}</option>{statuses.filter((item) => item !== order.orderStatus).map((item) => <option key={item} value={item}>{item}</option>)}</select></td><td className="px-5 py-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t p-4 text-sm"><span className="text-muted-foreground">Showing {orders.length} of {pagination.totalOrders}</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}>Previous</Button><Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}>Next</Button></div></div></CardContent></Card>
  </DashboardPageShell>;
}
