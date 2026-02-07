"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-bold">Reset Password</h1>
      <p className="mb-6 text-center text-sm text-muted">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Check your email for a password reset link.
          </div>
          <Link
            href="/login"
            className="block text-center text-sm text-primary hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-muted"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted">
            <Link href="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
