"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-danger/20 bg-danger/5 px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-danger">
        Something went wrong
      </h2>
      <p className="text-sm text-muted">
        {error.message || "Failed to load dashboard data."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Try again
      </button>
    </div>
  );
}
