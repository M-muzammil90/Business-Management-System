"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    try {
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!token || user?.role !== "SUPER_ADMIN") {
        router.replace("/auth/login");
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/auth/login");
    }
  }, [router]);

  // Escape key se mobile sidebar close
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  // Mobile open hone par body scroll lock
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#f4f7f1]">
      <DashboardSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() =>
          setCollapsed((value) => !value)
        }
        onMobileClose={() =>
          setMobileOpen(false)
        }
      />

      <div
        className={
          collapsed
            ? "lg:pl-[76px]"
            : "lg:pl-[260px]"
        }
      >
        <DashboardHeader
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        <main>{children}</main>
      </div>
    </div>
  );
}