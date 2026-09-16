"use client";

import {
  Boxes,
  CircleCheck,
  TriangleAlert,
  PackageX,
} from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

const stats = [
  {
    key: "total",
    title: "Total Products",
    icon: Boxes,
    getValue: (props: ProductStatsProps) =>
      props.totalProducts,
  },
  {
    key: "active",
    title: "Active Products",
    icon: CircleCheck,
    getValue: (props: ProductStatsProps) =>
      props.activeProducts,
  },
  {
    key: "low",
    title: "Low Stock",
    icon: TriangleAlert,
    getValue: (props: ProductStatsProps) =>
      props.lowStockProducts,
  },
  {
    key: "out",
    title: "Out of Stock",
    icon: PackageX,
    getValue: (props: ProductStatsProps) =>
      props.outOfStockProducts,
  },
];

export default function ProductStats(
  props: ProductStatsProps,
) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const value = Number(stat.getValue(props) ?? 0);

        return (
          <div
            key={stat.key}
            className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
                  {value.toLocaleString("en-PK")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}