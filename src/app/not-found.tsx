import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-primary">404</h1>
        <p className="mb-6 text-lg text-muted">Page not found</p>
        <Link
          href="/dashboard"
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
