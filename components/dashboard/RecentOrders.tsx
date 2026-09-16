"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ShoppingCart,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { RecentOrder } from "@/types/dashboard";

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const statusStyles: Record<
  RecentOrder["orderStatus"],
  string
> = {
  PENDING:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  CONFIRMED:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  PROCESSING:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  SHIPPED:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  DELIVERED:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  CANCELLED:
    "bg-destructive/10 text-destructive",
};

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingCart className="h-4.5 w-4.5" />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Recent Orders
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Latest customer orders
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-80"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Orders */}
        <div className="mt-6">
          {orders.length === 0 ? (
            <div className="flex min-h-70 items-center justify-center rounded-xl border border-dashed bg-muted/20">
              <div className="text-center">
                <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground/50" />

                <p className="mt-3 text-sm font-semibold">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  New orders will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                >
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase">
                    {order.customerId?.name
                      ?.slice(0, 2) || "CU"}
                  </div>

                  {/* Customer */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {order.customerId?.name ||
                        "Unknown Customer"}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {order.orderNumber}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(
                          order.createdAt,
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex ${
                      statusStyles[
                        order.orderStatus
                      ]
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                  {/* Total */}
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}