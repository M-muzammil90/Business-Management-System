"use client";

import {
  AlertTriangle,
  Boxes,
  PackageX,
  WalletCards,
} from "lucide-react";

import { Card } from "@/components/ui/card";

interface InventoryHealthProps {
  lowStockProducts: number;
  outOfStockProducts: number;
  inventoryValue: number;
}

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default function InventoryHealth({
  lowStockProducts,
  outOfStockProducts,
  inventoryValue,
}: InventoryHealthProps) {
  const totalIssues =
    lowStockProducts + outOfStockProducts;

  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Boxes className="h-4.5 w-4.5" />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Inventory Health
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Current stock overview
              </p>
            </div>
          </div>
        </div>

        {/* Inventory value */}
        <div className="mt-6 rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-sm">
              <WalletCards className="h-4.5 w-4.5 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Inventory Value
              </p>

              <p className="mt-1 text-xl font-bold tracking-tight tabular-nums">
                {formatCurrency(inventoryValue)}
              </p>
            </div>
          </div>
        </div>

        {/* Issues */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {/* Low stock */}
          <div className="rounded-xl border p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                Low stock
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold tracking-tight tabular-nums">
              {lowStockProducts}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Products need attention
            </p>
          </div>

          {/* Out of stock */}
          <div className="rounded-xl border p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <PackageX className="h-4 w-4" />
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                Out of stock
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold tracking-tight tabular-nums">
              {outOfStockProducts}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Products unavailable
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                totalIssues === 0
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />

            <span className="text-xs font-medium">
              {totalIssues === 0
                ? "Inventory looks healthy"
                : `${totalIssues} products need attention`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}