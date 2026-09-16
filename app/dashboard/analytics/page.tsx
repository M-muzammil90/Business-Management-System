"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Package,
  Crown,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SalesAnalytics } from "@/types/dashboard";

// ---------------------------------------------------------------------------
// Chart palette — matches the app's primary token, with two supporting tints
// ---------------------------------------------------------------------------
const CHART_COLORS = {
  primary: "#17463c",
  primarySoft: "#e7f1e2",
  secondary: "#c9a227", // reserved for the VIP accent (badges, top performer highlight)
  muted: "#78928a",
  grid: "#dce8dc",
};

const rupees = (value: number) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** Compares the second half of a series against the first half to derive a simple trend %. */
function trendFromSeries(values: number[]): number | null {
  if (values.length < 4) return null;
  const mid = Math.floor(values.length / 2);
  const first = values.slice(0, mid);
  const second = values.slice(mid);
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const firstAvg = avg(first);
  const secondAvg = avg(second);
  if (firstAvg === 0) return null;
  return ((secondAvg - firstAvg) / firstAvg) * 100;
}

function TrendChip({ value }: { value: number | null }) {
  if (value === null) return null;
  const isFlat = Math.abs(value) < 0.5;
  const isUp = value > 0;
  const Icon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const tone = isFlat
    ? "text-muted-foreground bg-muted"
    : isUp
    ? "text-emerald-700 bg-emerald-50"
    : "text-red-700 bg-red-50";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>
      <Icon className="h-3 w-3" />
      {isFlat ? "Flat" : `${isUp ? "+" : ""}${value.toFixed(1)}%`}
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: number | null;
  loading: boolean;
}) {
  return (
    <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            {loading ? (
              <div className="mt-3 h-8 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {!loading && trend !== undefined && (
          <div className="mt-3">
            <TrendChip value={trend ?? null} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
  formatter?: (value: number, name: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-muted-foreground">
          <span className="font-medium text-popover-foreground">
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>{" "}
          {entry.name}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnalyticsPage() {
  const [data, setData] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please login again.");
      const response = await fetch("/api/dashboard/analytics", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to fetch analytics.");
      setData(result.data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const dailySales = data?.dailySales ?? [];
  const topProducts = data?.topProducts ?? [];
  const monthlySales = data?.monthlySales ?? [];

  const totalSales = useMemo(() => dailySales.reduce((sum, item) => sum + item.sales, 0), [dailySales]);
  const totalOrders = useMemo(() => dailySales.reduce((sum, item) => sum + item.orders, 0), [dailySales]);
  const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
  const inventoryValue = data?.inventoryValue ?? 0;

  const salesTrend = useMemo(() => trendFromSeries(dailySales.map((d) => d.sales)), [dailySales]);
  const ordersTrend = useMemo(() => trendFromSeries(dailySales.map((d) => d.orders)), [dailySales]);

  const revenueChartData = useMemo(
    () =>
      dailySales.map((item) => ({
        day: item._id.slice(5),
        sales: item.sales,
        orders: item.orders,
      })),
    [dailySales]
  );

  const topProductsChartData = useMemo(
    () =>
      [...topProducts]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6)
        .map((p) => ({
          name: p.productName.length > 18 ? `${p.productName.slice(0, 18)}…` : p.productName,
          revenue: p.revenue,
          units: p.quantitySold,
        })),
    [topProducts]
  );

  const monthlyChartData = useMemo(
    () =>
      monthlySales.map((item) => ({
        month: `${item._id.month}/${String(item._id.year).slice(2)}`,
        sales: item.sales,
        orders: item.orders,
      })),
    [monthlySales]
  );

  const topPerformer = topProductsChartData[0];

  return (
    <DashboardPageShell
      eyebrow="Insights"
      title="Analytics"
      description="Live revenue, orders and product performance from your organization data."
      actions={
        <Button variant="outline" onClick={fetchAnalytics} className="h-10 rounded-lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      }
    >
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            Retry
          </Button>
        </div>
      )}

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Wallet} label="Revenue, last 7 days" value={rupees(totalSales)} trend={salesTrend} loading={loading} />
        <KpiCard icon={ShoppingCart} label="Orders, last 7 days" value={String(totalOrders)} trend={ordersTrend} loading={loading} />
        <KpiCard icon={TrendingUp} label="Average order value" value={rupees(avgOrderValue)} loading={loading} />
        <KpiCard icon={Package} label="Inventory value" value={rupees(inventoryValue)} loading={loading} />
      </div>

      {/* Top performer strip — VIP highlight */}
      {!loading && topPerformer && (
        <Card className="border-none bg-gradient-to-r from-[#1a1a1a] to-[#2b2410] text-white">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(201,162,39,0.18)" }}>
                <Crown className="h-5 w-5" style={{ color: CHART_COLORS.secondary }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">Top performer this period</p>
                <p className="text-lg font-semibold">{topProducts[0]?.productName}</p>
              </div>
            </div>
            <div className="flex gap-8 text-right">
              <div>
                <p className="text-xs text-white/60">Revenue</p>
                <p className="text-lg font-semibold">{rupees(topPerformer.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">Units sold</p>
                <p className="text-lg font-semibold">{topPerformer.units}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue trend + Top products */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue trend</CardTitle>
              <Badge variant="secondary">Live data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 animate-pulse rounded-lg bg-muted" />
            ) : revenueChartData.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: CHART_COLORS.muted }} />
                  <YAxis tickLine={false} axisLine={false} width={0} />
                  <Tooltip
                    content={<ChartTooltip formatter={(v, name) => (name === "sales" ? rupees(v) : String(v))} />}
                    cursor={{ stroke: CHART_COLORS.grid }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Revenue"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-20 text-center text-sm text-muted-foreground">No sales data available yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 animate-pulse rounded-lg bg-muted" />
            ) : topProductsChartData.length ? (
              <ResponsiveContainer width="100%" height={Math.max(topProductsChartData.length * 44, 180)}>
                <BarChart
                  data={topProductsChartData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                  barCategoryGap={12}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
                  />
                  <Tooltip content={<ChartTooltip formatter={(v) => rupees(v)} />} cursor={{ fill: CHART_COLORS.primarySoft }} />
                  <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]} barSize={16}>
                    {topProductsChartData.map((_, index) => (
                      <Cell key={index} fill={index === 0 ? CHART_COLORS.secondary : CHART_COLORS.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">No product sales yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Monthly performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-56 animate-pulse rounded-lg bg-muted" />
          ) : monthlyChartData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyChartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: CHART_COLORS.muted }} />
                <YAxis tickLine={false} axisLine={false} width={0} />
                <Tooltip content={<ChartTooltip formatter={(v, name) => (name === "sales" ? rupees(v) : String(v))} />} />
                <Line type="monotone" dataKey="sales" name="Revenue" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="orders" name="Orders" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No monthly data available yet.</p>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}