"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Spinner } from "@/components/ui/Spinner";
import { IconButton } from "@/components/ui/IconButton";

/**
 * Workspace selector layout — same lightweight chrome as app/onboarding/layout.tsx
 * (no Sidebar/TopNav dashboard shell — the person hasn't entered a
 * workspace yet, so there's no workspace-specific nav to show).
 */
export default function WorkspacesLayout({ children }: { children: React.ReactNode }) {
  const { checked } = useRequireAuth();
  const router = useRouter();

  function handleLogout() {
    authService.logout();
    router.push("/login");
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Spinner size="lg" label="Loading your workspaces…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper grain-surface flex flex-col">
      <header className="py-6 border-b border-line dark:border-white/10">
        <div className="container-page flex items-center justify-between">
          <Link href="/" className="inline-flex items-baseline gap-2">
            <span className="font-display text-[20px] font-semibold tracking-tight text-charcoal dark:text-white">TradeSucro</span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest2 text-gold-dim">Sugar Exchange</span>
          </Link>
          <IconButton variant="ghost" size="md" aria-label="Log out" onClick={handleLogout}>
            <LogOut size={17} />
          </IconButton>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 sm:py-14">
        <div className="container-page">{children}</div>
      </main>
    </div>
  );
}
