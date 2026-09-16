"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export default function DashboardError({
  message,
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className="flex min-h-105 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>

        <h2 className="mt-4 text-base font-semibold">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {message}
        </p>

        <Button
          type="button"
          onClick={onRetry}
          className="mt-5 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}