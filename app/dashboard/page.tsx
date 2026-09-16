"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bot,
  CircleHelp,
  Ellipsis,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats, SalesAnalytics } from "@/types/dashboard";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ---------------------------------------------------------------------------
// Design tokens — single source of truth so colors stay consistent
// ---------------------------------------------------------------------------
const palette = {
  bg: "#f4f7f1",
  ink: "#153d36",
  inkSoft: "#204940",
  inkMuted: "#77908a",
  inkFaint: "#8ca19a",
  border: "#e1eae0",
  card: "#ffffff",
  primary: "#17463c", // deep forest — main brand
  primaryHover: "#285b4d",
  accent: "#a8e96b", // lime — secondary data series
  accentSoft: "#b9f268", // hero surface
  tileA: "#dff8bc",
  tileB: "#e1f0e9",
  tileC: "#eef1df",
  danger: "#b3261e",
  dangerBg: "#fdecea",
} as const;

const cardShadow = "shadow-[0_8px_25px_rgba(35,76,57,0.04)]";
const cardBase = `rounded-2xl border border-[${palette.border}] bg-white p-5 ${cardShadow}`;

function money(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
}

// ---------------------------------------------------------------------------
// Small presentational subcomponents
// ---------------------------------------------------------------------------

function SnapshotTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: color }}>
      <p className="text-[11px] text-[#66847a]">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#204940]">{value.toLocaleString("en-PK")}</p>
      <p className="mt-1 text-[10px] text-[#7da08e]">Updated live</p>
    </div>
  );
}

function TransactionRow({
  orderNumber,
  customerName,
  total,
  status,
}: {
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-[#f5f8f3]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f4e6] text-[#5b9661]">
          <WalletCards className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#31584f]">{orderNumber}</p>
          <p className="text-[10px] text-[#9aada5]">{customerName}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-semibold text-[#31584f]">{money(total)}</p>
        <span className="text-[10px] font-medium text-[#78a970]">{status}</span>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="py-12 text-center text-sm text-[#8ca19a]">{label}</p>;
}

function DashboardSkeleton() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f7f1] p-5 md:p-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-white" />
        <div className="grid gap-4 xl:grid-cols-[1.05fr_1.7fr_0.9fr]">
          <div className="h-48 animate-pulse rounded-2xl bg-[#d9f6a2]" />
          <div className="h-48 animate-pulse rounded-2xl bg-white" />
          <div className="h-48 animate-pulse rounded-2xl bg-white" />
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-white" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please login again.");

      const headers = { Authorization: `Bearer ${token}` };
      const [statsResponse, analyticsResponse] = await Promise.all([
        fetch("/api/dashboard/stats", { headers, cache: "no-store" }),
        fetch("/api/dashboard/analytics", { headers, cache: "no-store" }),
      ]);

      const statsResult: ApiResponse<DashboardStats> = await statsResponse.json();
      const analyticsResult: ApiResponse<SalesAnalytics> = await analyticsResponse.json();

      if (!statsResponse.ok || !statsResult.success) {
        throw new Error(statsResult.message || "Failed to load dashboard data.");
      }
      if (!analyticsResponse.ok || !analyticsResult.success) {
        throw new Error(analyticsResult.message || "Failed to load analytics.");
      }

      setData(statsResult.data);
      setAnalytics(analyticsResult.data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const dailySales = analytics?.dailySales ?? [];
  const topProducts = analytics?.topProducts ?? [];
  const monthlySales = analytics?.monthlySales ?? [];

  const dailyChartData = useMemo(
    () => dailySales.map((item) => ({ day: item._id.slice(5), sales: item.sales, orders: item.orders })),
    [dailySales],
  );
  const topProductsChartData = useMemo(
    () =>
      [...topProducts]
        .sort((left, right) => right.revenue - left.revenue)
        .slice(0, 5)
        .map((product) => ({
          name: product.productName.length > 14 ? `${product.productName.slice(0, 14)}...` : product.productName,
          revenue: product.revenue,
        })),
    [topProducts],
  );
  const monthlyChartData = useMemo(
    () =>
      monthlySales.map((item) => ({
        month: `${item._id.month}/${String(item._id.year).slice(2)}`,
        sales: item.sales,
      })),
    [monthlySales],
  );

  const balance = data?.overview.totalSales ?? 0;
  const totalOrders = data?.overview.totalOrders ?? 0;
  const averageOrder = totalOrders ? balance / totalOrders : 0;

  const totalProducts = data?.overview.totalProducts ?? 0;
  const outOfStock = data?.inventory.outOfStockProducts ?? 0;
  const lowStock = data?.inventory.lowStockProducts ?? 0;
  const healthyPercent = totalProducts ? Math.round(((totalProducts - outOfStock) / totalProducts) * 100) : 0;

  const dateLabel = useMemo(
    () => new Intl.DateTimeFormat("en-PK", { month: "short", day: "numeric", year: "numeric" }).format(new Date()),
    []
  );

  const snapshotTiles: { label: string; value: number; color: string }[] = [
    { label: "Products", value: totalProducts, color: palette.tileA },
    { label: "Customers", value: data?.overview.totalCustomers ?? 0, color: palette.tileB },
    { label: "Suppliers", value: data?.overview.totalSuppliers ?? 0, color: palette.tileC },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-[calc(100vh-64px)] text-[#193b35]" style={{ backgroundColor: palette.bg }}>
      <div className="mx-auto max-w-[1500px] space-y-5 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#75a967]">{dateLabel}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-[-0.02em] text-[#153d36]">Good morning, Muhammad</h1>
            <p className="mt-1 text-sm text-[#77908a]">Here&apos;s what&apos;s happening with your business today.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboard}
              className="flex h-9 items-center gap-2 rounded-lg border border-[#dce7dc] bg-white px-3 text-xs font-semibold text-[#55736d] transition-colors hover:bg-[#edf5ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17463c]"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh
            </button>
            <Link
              href="/dashboard/products"
              className="flex h-9 items-center gap-2 rounded-lg bg-[#173f37] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#285b4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17463c]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add product
            </Link>
          </div>
        </section>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between rounded-xl border p-4 text-sm"
            style={{ borderColor: "#f3c7c3", backgroundColor: palette.dangerBg, color: palette.danger }}
          >
            <span>{error}</span>
            <button onClick={fetchDashboard} className="font-semibold underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {/* Top row: balance / snapshot / finance score */}
        <section className="grid gap-4 xl:grid-cols-[1.05fr_1.75fr_0.9fr]">
          <div
            className="relative min-h-[208px] overflow-hidden rounded-2xl p-6 shadow-[0_10px_30px_rgba(116,169,82,0.13)]"
            style={{ backgroundColor: palette.accentSoft }}
          >
            <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border-[22px] border-white/20" />
            <div className="absolute -bottom-20 right-10 h-44 w-44 rounded-full border-[18px] border-white/20" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#517b45]">Total balance</p>
                  <p className="mt-2 text-3xl font-bold tracking-[-0.02em] text-[#164338]">{money(balance)}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#18483b]">
                  <WalletCards className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/orders" className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#17463b] transition-colors hover:bg-white/90">
                  View orders <ArrowDownLeft className="ml-1 inline h-3 w-3" aria-hidden="true" />
                </Link>
                <Link href="/dashboard/products" className="rounded-lg bg-[#17463b] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#285b4d]">
                  Manage stock <ArrowUpRight className="ml-1 inline h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div className={cardBase}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#204940]">Business snapshot</p>
                <p className="mt-1 text-xs text-[#8ca19a]">Live database overview</p>
              </div>
              <Sparkles className="h-5 w-5 text-[#9acf72]" aria-hidden="true" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {snapshotTiles.map((tile) => (
                <SnapshotTile key={tile.label} {...tile} />
              ))}
            </div>
          </div>

          <div className={cardBase}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#8ca19a]">Finance score</p>
                <p className="mt-1 text-2xl font-bold text-[#204940]">{healthyPercent}%</p>
                <p className="mt-1 text-xs font-semibold text-[#76a66e]">
                  {healthyPercent >= 70 ? "Healthy position" : healthyPercent >= 40 ? "Needs attention" : "Restock urgently"}
                </p>
              </div>
              <button aria-label="More finance options" className="rounded-md p-1 hover:bg-[#f5f8f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#17463c]">
                <Ellipsis className="h-5 w-5 text-[#8ca19a]" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-7 h-2 rounded-full bg-[#e5eee3]">
              <div
                className="h-full rounded-full bg-[#173f37] transition-[width]"
                style={{ width: `${Math.max(healthyPercent, 4)}%` }}
                role="progressbar"
                aria-valuenow={healthyPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-[#8ca19a]">
              <span>Stock health</span>
              <span>{lowStock} low stock</span>
            </div>
          </div>
        </section>

        {/* Cashflow + AI assistant */}
        <section className="grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
          <div className={`${cardBase} md:p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#79a86e]">Cashflow</p>
                <div className="mt-1 flex items-end gap-3">
                  <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#204940]">{money(balance)}</h2>
                  <span className="mb-1 rounded-full bg-[#e4f7d2] px-2 py-1 text-[10px] font-semibold text-[#6ea35e]">This week</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#78928a]">
                <span>
                  <i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#17463c]" />
                  Revenue
                </span>
                <span>
                  <i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#a8e96b]" />
                  Orders
                </span>
              </div>
            </div>

            <div className="mt-8 h-64">
              {dailyChartData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashboardSalesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#17463c" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="#17463c" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#e1eae0" strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#8ca19a" }} />
                    <YAxis hide />
                    <Tooltip formatter={(value, name) => [name === "sales" ? money(Number(value)) : value, name === "sales" ? "Revenue" : "Orders"]} />
                    <Area type="monotone" dataKey="sales" stroke="#17463c" strokeWidth={2.5} fill="url(#dashboardSalesGradient)" />
                    <Area type="monotone" dataKey="orders" stroke="#a8e96b" strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#8ca19a]">No sales activity yet</div>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl p-5" style={{ backgroundColor: "#dff7c4" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#214d40]">AI Assistant</p>
                <p className="mt-1 text-xs text-[#719675]">Your business co-pilot</p>
              </div>
              <Bot className="h-5 w-5 text-[#568c5b]" aria-hidden="true" />
            </div>
            <div className="flex min-h-[218px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#e9ffb8,#77bc68_45%,#17463c)] shadow-[0_8px_20px_rgba(57,120,74,0.25)]">
                <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-semibold text-[#245244]">What can I help with?</p>
              <p className="mt-1 max-w-[220px] text-xs leading-5 text-[#719675]">
                Ask about sales, stock health or your latest orders.
              </p>
            </div>
            <form
              className="flex items-center gap-2 rounded-xl bg-white/80 p-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search className="h-4 w-4 text-[#8ca19a]" aria-hidden="true" />
              <input
                type="text"
                placeholder="Ask anything..."
                aria-label="Ask the AI assistant"
                className="flex-1 bg-transparent text-xs text-[#31584f] outline-none placeholder:text-[#9aada5]"
              />
              <button
                type="submit"
                aria-label="Send question"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#17463c] text-white transition-colors hover:bg-[#285b4d]"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div className={cardBase}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#204940]">Top products</p>
                <p className="mt-1 text-xs text-[#8ca19a]">Revenue by best-selling product</p>
              </div>
              <Link href="/dashboard/analytics" className="text-xs font-semibold text-[#6da265] hover:underline">View analytics</Link>
            </div>
            {topProductsChartData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topProductsChartData} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="#e1eae0" strokeDasharray="3 3" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#78928a" }} />
                  <Tooltip formatter={(value) => [money(Number(value)), "Revenue"]} />
                  <Bar dataKey="revenue" fill="#17463c" radius={[0, 5, 5, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState label="No product sales yet." />
            )}
          </div>

          <div className={cardBase}>
            <div className="mb-4">
              <p className="text-sm font-bold text-[#204940]">Monthly performance</p>
              <p className="mt-1 text-xs text-[#8ca19a]">Revenue trend across the last 12 months</p>
            </div>
            {monthlyChartData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#e1eae0" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#78928a" }} />
                  <YAxis hide />
                  <Tooltip formatter={(value) => [money(Number(value)), "Revenue"]} />
                  <Line type="monotone" dataKey="sales" stroke="#a8e96b" strokeWidth={3} dot={{ r: 3, fill: "#17463c" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState label="No monthly sales data yet." />
            )}
          </div>
        </section>

        {/* Transactions / stock / average order */}
        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr_0.85fr]">
          <div className={cardBase}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#204940]">Recent transactions</p>
                <p className="mt-1 text-xs text-[#8ca19a]">Latest activity from your business</p>
              </div>
              <Link href="/dashboard/orders" className="text-xs font-semibold text-[#6da265] hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-1">
              {data?.recentOrders?.length ? (
                data.recentOrders
                  .slice(0, 5)
                  .map((order) => (
                    <TransactionRow
                      key={order._id}
                      orderNumber={order.orderNumber}
                      customerName={order.customerId?.name || "Customer"}
                      total={order.total}
                      status={order.orderStatus}
                    />
                  ))
              ) : (
                <EmptyState label="No transactions yet." />
              )}
            </div>
          </div>

          <div className={cardBase}>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-bold text-[#204940]">Stock statistic</p>
                <p className="mt-1 text-xs text-[#8ca19a]">Inventory health</p>
              </div>
              <CircleHelp className="h-4 w-4 text-[#8ca19a]" aria-hidden="true" />
            </div>
            <div className="mt-7 flex items-center gap-5">
              <div
                className="relative flex h-28 w-28 items-center justify-center rounded-full"
                style={{ background: `conic-gradient(#17463c ${healthyPercent}%, #a8e96b ${healthyPercent}% 100%)` }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-lg font-bold text-[#204940]">{healthyPercent}%</p>
                    <p className="text-[9px] text-[#8ca19a]">healthy</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-xs">
                <p>
                  <i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#17463c]" />
                  Available <b>{totalProducts}</b>
                </p>
                <p>
                  <i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#a8e96b]" />
                  Low stock <b>{lowStock}</b>
                </p>
                <p>
                  <i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#dce5df]" />
                  Out <b>{outOfStock}</b>
                </p>
              </div>
            </div>
          </div>

          <div className={cardBase}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-[#204940]">Average order</p>
                <p className="mt-1 text-xs text-[#8ca19a]">Per transaction</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-[#79a86e]" aria-hidden="true" />
            </div>
            <p className="mt-8 text-3xl font-bold tracking-[-0.02em] text-[#204940]">{money(averageOrder)}</p>
            <div className="mt-5 h-2 rounded-full bg-[#e7efe5]">
              <div className="h-full w-[68%] rounded-full bg-[#a8e96b]" />
            </div>
            <p className="mt-3 text-xs text-[#8ca19a]">Based on {totalOrders} total orders</p>
          </div>
        </section>
      </div>
    </div>
  );
}