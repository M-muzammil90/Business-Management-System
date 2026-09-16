"use client";

import {
  ArrowUpRight,
  Package,
  Trophy,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { TopProduct } from "@/types/dashboard";

interface TopProductsProps {
  products: TopProduct[];
}

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default function TopProducts({
  products,
}: TopProductsProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="h-[18px] w-[18px]" />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Top Products
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Best selling products
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-80"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Products */}
        <div className="mt-6">
          {products.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed bg-muted/20">
              <div className="text-center">
                <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />

                <p className="mt-3 text-sm font-semibold">
                  No product sales yet
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Top selling products will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {products.slice(0, 5).map(
                (product, index) => (
                  <div
                    key={product._id}
                    className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                  >
                    {/* Rank */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Product icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-background">
                      <Package className="h-[18px] w-[18px] text-muted-foreground" />
                    </div>

                    {/* Product info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {product.productName}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {product.quantitySold.toLocaleString(
                          "en-PK",
                        )}{" "}
                        units sold
                      </p>
                    </div>

                    {/* Revenue */}
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatCurrency(
                          product.revenue,
                        )}
                      </p>

                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Revenue
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}