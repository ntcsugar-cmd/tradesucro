"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutGrid, Plus, Kanban, CalendarDays, FileStack } from "lucide-react";

import { authService } from "@/services/auth.service";
import { workspaceService } from "@/services/workspace.service";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Spinner } from "@/components/ui/Spinner";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Grid";

const SUB_NAV = [
  { label: "Deals", href: "/deals", icon: LayoutGrid },
  { label: "Create Deal", href: "/deals/create", icon: Plus },
  { label: "Pipeline", href: "/deals/pipeline", icon: Kanban },
  { label: "Calendar", href: "/deals/calendar", icon: CalendarDays },
  { label: "Documents", href: "/deals/documents", icon: FileStack },
];

/**
 * Deal Management layout — a standalone route group (app/deals/...) with
 * its own chrome, deliberately outside app/(dashboard)/. That layout's
 * workspace route-guard and lib/constants/navigation.ts sidebar are both
 * protected in this brief ("do not modify Navigation" / "Workspace
 * Management") — rather than making an exception in either, Deal
 * Management supplies its own auth-gated shell and in-module sub-nav, so
 * neither protected file needs to change for these routes to work.
 * Reads the active workspace (read-only, via workspaceService) only to
 * know where "Exit to Workspace" should go — it does not modify that
 * service or its permission data.
 */
export default function DealsLayout({ children }: { children: React.ReactNode }) {
  const { checked } = useRequireAuth();
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    authService.logout();
    router.push("/login");
  }

  function handleExit() {
    const workspace = workspaceService.getActiveWorkspace();
    router.push(workspace?.defaultLandingPage ?? "/dashboard");
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Spinner size="lg" label="Loading Deal Management…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper grain-surface flex flex-col">
      <header className="border-b border-line">
        <div className="container-page flex items-center justify-between py-5">
          <Link href="/" className="inline-flex items-baseline gap-2">
            <span className="font-display text-[20px] font-semibold tracking-tight text-charcoal">TradeSucro</span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest2 text-gold-dim">Deal Management</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleExit}>
              Exit to Workspace
            </Button>
            <IconButton variant="ghost" size="md" aria-label="Log out" onClick={handleLogout}>
              <LogOut size={17} />
            </IconButton>
          </div>
        </div>

        <div className="container-page">
          <nav className="flex items-center gap-1 -mb-px overflow-x-auto">
            {SUB_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors ${
                    active ? "border-gold text-charcoal" : "border-transparent text-ink-faint hover:text-charcoal"
                  }`}
                >
                  <Icon size={14} /> {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  );
}
