"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  Boxes,
  Tags,
  BarChart3,
  Settings,
  ChevronLeft,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Tags,
      },
      {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
      },
      {
        title: "Suppliers",
        href: "/dashboard/suppliers",
        icon: Truck,
      },
      {
        title: "Inventory",
        href: "/dashboard/inventory",
        icon: Boxes,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export default function DashboardSidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#28564b] bg-[#173f37] text-white shadow-xl transition-all duration-300 ease-in-out",
          "w-[270px]",
          "lg:translate-x-0 lg:shadow-none",
          collapsed
            ? "lg:w-[76px]"
            : "lg:w-[260px]",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo Header */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b px-4",
            collapsed
              ? "justify-center"
              : "justify-between",
          )}
        >
          {!collapsed && (
            <Link
              href="/dashboard"
              onClick={onMobileClose}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b9f268] text-[#173f37] shadow-sm">
                <Boxes className="h-5 w-5" />
              </div>

              <div className="leading-none">
                <p className="text-sm font-bold tracking-tight text-white">
                  BusinessOS
                </p>

                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#9bc0ad]">
                  Management
                </p>
              </div>
            </Link>
          )}

          {collapsed && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b9f268] text-[#173f37]">
              <Boxes className="h-5 w-5" />
            </div>
          )}

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#b5d0c3] transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-7">
            {navigation.map((section) => (
              <div key={section.title}>
                {!collapsed && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#80a99a]">
                    {section.title}
                  </p>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(
                        `${item.href}/`,
                      );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={
                          collapsed
                            ? item.title
                            : undefined
                        }
                        onClick={onMobileClose}
                        className={cn(
                          "group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200",
                          collapsed &&
                            "justify-center px-0",
                          isActive
                            ? "bg-[#b9f268] text-[#173f37] shadow-sm"
                            : "text-[#c0d6ca] hover:bg-white/10 hover:text-white",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
                            !isActive &&
                              "group-hover:scale-105",
                          )}
                        />

                        {!collapsed && (
                          <span>
                            {item.title}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="border-t border-[#28564b] p-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex h-9 w-full items-center justify-center rounded-lg text-[#b5d0c3] transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                collapsed &&
                  "rotate-180",
              )}
            />
          </button>
        </div>
      </aside>
    </>
  );
}