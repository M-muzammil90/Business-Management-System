"use client";

import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/types/dashboard";

interface StatsCardsProps {
  data: DashboardStats["overview"];
}

const stats = [
  {
    key: "totalSales",
    title: "Total Sales",
    description: "Revenue generated",
    icon: DollarSign,
    format: (value: number) =>
      `Rs. ${value.toLocaleString("en-PK")}`,
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    description: "Orders received",
    icon: ShoppingCart,
    format: (value: number) =>
      value.toLocaleString("en-PK"),
  },
  {
    key: "totalProducts",
    title: "Total Products",
    description: "Active products",
    icon: Package,
    format: (value: number) =>
      value.toLocaleString("en-PK"),
  },
  {
    key: "totalCustomers",
    title: "Total Customers",
    description: "Active customers",
    icon: Users,
    format: (value: number) =>
      value.toLocaleString("en-PK"),
  },
] as const;

export default function StatsCards({
    
  data,
}: StatsCardsProps) {
  return (
    
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        const value = data[stat.key];

        return (
          <Card
            key={stat.key}
            className="group relative overflow-hidden border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Decorative glow */}

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-3xl transition-all duration-300 group-hover:bg-primary/10" />

            <div className="relative">
              {/* Top */}

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground/80">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
              </div>

              {/* Value */}

              <div className="mt-5 flex items-end justify-between">
                <h3 className="text-2xl font-bold tracking-tight tabular-nums">
                  {stat.format(value)}
                </h3>

                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />

                  <span>Active</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}