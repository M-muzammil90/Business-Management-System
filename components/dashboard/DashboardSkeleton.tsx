export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-38.75 animate-pulse rounded-xl border bg-muted/40"
            />
          ),
        )}
      </div>

      {/* Sales */}
      <div className="rounded-xl border bg-card p-6">
        <div className="h-5 w-36 animate-pulse rounded bg-muted" />

        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />

        <div className="mt-6 h-75 animate-pulse rounded-xl bg-muted/50" />
      </div>

      {/* Lower section */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-95 animate-pulse rounded-xl border bg-muted/40" />

        <div className="h-95 animate-pulse rounded-xl border bg-muted/40" />
      </div>
    </div>
  );
}