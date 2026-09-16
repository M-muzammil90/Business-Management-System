"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SalesAnalytics } from "@/types/dashboard";

interface ApiResponse {
  success: boolean;
  message: string;
  data: SalesAnalytics;
}

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

function formatShortCurrency(value: number) {
  if (value >= 10000000) {
    return `Rs. ${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `Rs. ${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `Rs. ${(value / 1000).toFixed(0)}K`;
  }

  return `Rs. ${value}`;
}

export default function SalesOverview() {
  const [data, setData] =
    useState<SalesAnalytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found",
          );
        }

        const response = await fetch(
          "/api/dashboard/analytics",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const result: ApiResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch analytics",
          );
        }

        setData(result.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const chartData = useMemo(() => {
    if (!data?.dailySales) return [];

    return data.dailySales.map((item) => ({
      date: item._id,
      sales: item.sales,
      orders: item.orders,
      label: new Date(
        `${item._id}T00:00:00`,
      ).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
      }),
    }));
  }, [data]);

  const totalSales = useMemo(() => {
    return (
      data?.dailySales.reduce(
        (total, item) => total + item.sales,
        0,
      ) || 0
    );
  }, [data]);

  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-[18px] w-[18px]" />
              </div>

              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  Sales Overview
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Revenue performance over the last 7 days
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />

            <span className="text-xs font-medium text-muted-foreground">
              Last 7 days
            </span>
          </div>
        </div>

        {/* Summary */}
        {!loading && !error && data && (
          <div className="mt-6">
            <p className="text-xs font-medium text-muted-foreground">
              Total revenue
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">
              {formatCurrency(totalSales)}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6">
            <div className="mb-5 h-8 w-40 animate-pulse rounded-md bg-muted" />

            <div className="h-[300px] animate-pulse rounded-xl bg-muted/50" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 flex min-h-[300px] items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <div>
              <p className="text-sm font-semibold text-destructive">
                Unable to load sales data
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          chartData.length === 0 && (
            <div className="mt-6 flex min-h-[300px] items-center justify-center rounded-xl border border-dashed bg-muted/20">
              <div className="text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground/50" />

                <p className="mt-3 text-sm font-semibold">
                  No sales data yet
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Sales activity will appear here once
                  orders are created.
                </p>
              </div>
            </div>
          )}

        {/* Chart */}
        {!loading &&
          !error &&
          chartData.length > 0 && (
            <div className="mt-6 h-[300px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity={0.22}
                      />

                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeDasharray="4 4"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "var(--muted-foreground)",
                      fontSize: 11,
                    }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "var(--muted-foreground)",
                      fontSize: 11,
                    }}
                    tickFormatter={
                      formatShortCurrency
                    }
                    width={65}
                  />

                  <Tooltip
                    cursor={{
                      stroke: "var(--border)",
                      strokeWidth: 1,
                    }}
                    contentStyle={{
                      background:
                        "var(--card)",
                      border:
                        "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                      padding: "10px 12px",
                    }}
                    labelStyle={{
                      color:
                        "var(--foreground)",
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                    formatter={(
                      value,
                    ) => [
                      formatCurrency(
                        Number(value),
                      ),
                      "Sales",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: "var(--card)",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
      </div>
    </Card>
  );
}