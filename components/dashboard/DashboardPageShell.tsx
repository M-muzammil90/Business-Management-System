import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

interface DashboardPageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function DashboardPageShell({
  eyebrow = "Overview",
  title,
  description,
  actions,
  children,
  className,
}: DashboardPageShellProps) {
  return (
    <div className={cn("dashboard-page mx-auto w-full max-w-[1600px] space-y-8 p-4 md:p-6 lg:p-8", className)}>
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78a86e]">
            {eyebrow}
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.055em] text-[#173f37] md:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#78928a]">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3">
            {actions}
          </div>
        )}
      </section>

      {children}
    </div>
  );
}

export function PageActionButton({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "outline" | "secondary";
}) {
  return (
    <Button variant={variant} className="h-10 rounded-lg px-4">
      {children}
    </Button>
  );
}
