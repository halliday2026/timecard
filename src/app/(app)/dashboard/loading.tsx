export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Chart skeleton */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 h-6 w-32 animate-pulse rounded bg-border" />
        <div className="h-[250px] animate-pulse rounded-lg bg-border/50" />
      </div>

      {/* Button skeleton */}
      <div className="h-14 animate-pulse rounded-xl bg-border" />
    </div>
  );
}
