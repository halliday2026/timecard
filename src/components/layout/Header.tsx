"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Header({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-primary">Timecard</h1>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:inline">
            {userEmail}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
