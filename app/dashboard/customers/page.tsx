"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, UserPlus, X } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Customer { _id: string; name: string; email?: string; phone?: string; city?: string; isActive: boolean; createdAt: string; }
interface Pagination { page: number; limit: number; totalCustomers: number; totalPages: number; }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, totalCustomers: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "" });

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please login again.");
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (search.trim()) params.set("search", search.trim());
      const response = await fetch(`/api/customers?${params}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to fetch customers.");
      setCustomers(result.data.customers || []);
      setPagination(result.data.pagination);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load customers.");
    } finally { setLoading(false); }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  async function createCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/customers", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to create customer.");
      setForm({ name: "", email: "", phone: "", city: "" });
      setShowForm(false);
      await fetchCustomers();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Unable to create customer."); }
    finally { setSaving(false); }
  }

  const activeCount = customers.filter((customer) => customer.isActive).length;

  return <DashboardPageShell eyebrow="CRM" title="Customers" description="Live customer records, search and relationship management from one place." actions={<Button onClick={() => setShowForm(true)} className="h-10 rounded-lg"><UserPlus className="mr-2 h-4 w-4" />Add customer</Button>}>
    <div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">All customers</p><p className="mt-2 text-3xl font-bold">{pagination.totalCustomers}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Active on this page</p><p className="mt-2 text-3xl font-bold">{activeCount}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Page</p><p className="mt-2 text-3xl font-bold">{pagination.page} <span className="text-base font-normal text-muted-foreground">/ {Math.max(pagination.totalPages, 1)}</span></p></CardContent></Card></div>
    {showForm && <Card><CardContent className="p-5"><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">Add customer</h2><button aria-label="Close form" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button></div><form onSubmit={createCustomer} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><input required placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" /><input type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" /><input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" /><input placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="h-10 rounded-lg border bg-background px-3 text-sm" /><Button disabled={saving} type="submit" className="sm:col-span-2 lg:col-span-4">{saving ? "Saving..." : "Save customer"}</Button></form></CardContent></Card>}
    <Card><CardContent className="p-0"><div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between"><div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPagination((current) => ({ ...current, page: 1 })); }} placeholder="Search name, email or phone" className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm" /></div><Button variant="outline" onClick={fetchCustomers}>Refresh</Button></div>{error && <div className="m-5 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}<Button variant="outline" size="sm" className="ml-3" onClick={fetchCustomers}>Retry</Button></div>}<div className="overflow-x-auto"><table className="w-full text-left"><thead className="border-b bg-muted/30"><tr>{["Customer", "Contact", "City", "Status", "Joined"].map((heading) => <th key={heading} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{heading}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">Loading customers...</td></tr> : customers.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">No customers found.</td></tr> : customers.map((customer) => <tr key={customer._id} className="border-b last:border-0"><td className="px-5 py-4 font-medium">{customer.name}</td><td className="px-5 py-4 text-sm text-muted-foreground">{customer.email || customer.phone || "No contact"}</td><td className="px-5 py-4 text-sm text-muted-foreground">{customer.city || "-"}</td><td className="px-5 py-4"><Badge variant={customer.isActive ? "secondary" : "outline"}>{customer.isActive ? "Active" : "Inactive"}</Badge></td><td className="px-5 py-4 text-sm text-muted-foreground">{new Date(customer.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t p-4 text-sm"><span className="text-muted-foreground">Showing {customers.length} of {pagination.totalCustomers}</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}>Previous</Button><Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}>Next</Button></div></div></CardContent></Card>
  </DashboardPageShell>;
}
