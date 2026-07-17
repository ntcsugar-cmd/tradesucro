"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Handshake,
  Factory,
  TrendingUp,
  FileText,
  Users,
  Settings,
  Building2,
  ShoppingCart,
  Tag,
  LayoutList,
  PlusCircle,
  History,
  Gavel,
  Boxes,
  CalendarClock,
  LineChart,
  ScrollText,
  Activity,
  Map,
  Columns3,
  BellRing,
  Newspaper,
  Sparkles,
  Lightbulb,
  Star,
  Calculator,
  Scale,
  Trophy,
  Tags,
  Truck,
  Route,
  Flag,
  BarChart3,
  Globe2,
  Ship,
  User,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { TopNav } from "@/components/layout/TopNav";
import { Sidebar, type SidebarSection } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Grid";
import { ToastProvider } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import { WorkspaceSwitcher } from "@/components/workspace";
import { BottomNav, MobileSearchOverlay, BottomSheet, NotificationCenter } from "@/components/mobile";
import { InstallPrompt } from "@/components/pwa";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useTheme } from "@/hooks/useTheme";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { DASHBOARD_NAV } from "@/lib/constants/navigation";
import { WORKSPACE_ROLE_META, hasMenuPermission, hasRoutePermission } from "@/lib/constants/workspaceRoles";
import { authService } from "@/services/auth.service";
import { notificationService } from "@/services/notification.service";
import { workspaceService } from "@/services/workspace.service";
import type { Workspace } from "@/lib/types/workspace";

/**
 * Icon name (string, from lib/constants/navigation.ts) → component.
 * Keeping the constants file icon-agnostic (see its header comment) means
 * this is the one place that has to know lucide-react exists.
 */
const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  ClipboardList,
  Handshake,
  Factory,
  TrendingUp,
  FileText,
  Users,
  Settings,
  Building2,
  ShoppingCart,
  Tag,
  LayoutList,
  PlusCircle,
  History,
  Gavel,
  Boxes,
  CalendarClock,
  LineChart,
  ScrollText,
  Activity,
  Map,
  Columns3,
  BellRing,
  Newspaper,
  Sparkles,
  Lightbulb,
  Star,
  Calculator,
  Scale,
  Trophy,
  Tags,
  Truck,
  Route,
  Flag,
  BarChart3,
  Globe2,
  Ship,
};

/**
 * Builds the sidebar, filtered to the sections the active workspace's
 * role may see (lib/constants/workspaceRoles.ts). The "Dashboard" link
 * always points at the active workspace's own default landing page,
 * not a hardcoded /dashboard — otherwise a non-Mill workspace's sidebar
 * would link somewhere its own role isn't permitted to view.
 */
function buildSidebarSections(activeHref: string, workspace: Workspace | null): SidebarSection[] {
  const visibleSections = workspace ? DASHBOARD_NAV.filter((s) => hasMenuPermission(workspace.role, s.title)) : DASHBOARD_NAV;

  return visibleSections.map((section) => ({
    title: section.title,
    items: section.items.map((item) => {
      const Icon = ICONS[item.icon] ?? LayoutDashboard;
      const href = item.href === "/dashboard" && workspace ? workspace.defaultLandingPage : item.href;
      return {
        label: item.label,
        href,
        icon: <Icon size={16} />,
        active: href === activeHref,
      };
    }),
  }));
}

/**
 * Dashboard shell. Renders chrome only (nav, sidebar, footer) — every
 * route under this group supplies its own Breadcrumb/PageHeader/content.
 *
 * v0.8 adds workspace resolution: on first load, if no workspace is
 * active yet, a single workspace auto-selects; multiple workspaces send
 * the person to /workspaces. Once a workspace is active, the sidebar is
 * filtered to its permitted menus and the route itself is guarded by
 * hasRoutePermission — visiting a route outside the active workspace's
 * role redirects to that workspace's own default landing page.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { checked } = useRequireAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [notificationCount, setNotificationCount] = useState(0);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaceReady, setWorkspaceReady] = useState(false);

  const mobileDrawer = useDisclosure(false);
  const desktopCollapse = useDisclosure(false);
  const mobileSearch = useDisclosure(false);
  const mobileNotifications = useDisclosure(false);
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    notificationService.getUnreadCount().then(setNotificationCount);
  }, []);

  // Resolve (or auto-select) the active workspace once auth is confirmed.
  useEffect(() => {
    if (!checked) return;
    let cancelled = false;

    (async () => {
      let active = workspaceService.getActiveWorkspace();
      if (!active) {
        const workspaces = await workspaceService.getWorkspaces();
        if (workspaces.length === 1) {
          active = (await workspaceService.setActiveWorkspace(workspaces[0].id)) ?? null;
        } else if (workspaces.length > 1) {
          router.replace("/workspaces");
          return;
        }
      }
      if (!cancelled) {
        setWorkspace(active);
        setWorkspaceReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  // Route guard: once a workspace is active, keep every navigation inside its permitted routes.
  useEffect(() => {
    if (!workspaceReady || !workspace) return;
    if (!hasRoutePermission(workspace.role, pathname)) {
      router.replace(workspace.defaultLandingPage);
    }
  }, [workspaceReady, workspace, pathname, router]);

  const sections = buildSidebarSections(pathname, workspace);

  function handleLogout() {
    workspaceService.clearActiveWorkspace();
    authService.logout();
    router.push("/login");
  }

  if (!checked || !workspaceReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <Spinner size="lg" label="Loading your workspace…" />
      </div>
    );
  }

  const roleLabel = workspace ? WORKSPACE_ROLE_META[workspace.role].label : "Workspace";

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-paper dark:bg-charcoal">
        {/* Desktop persistent sidebar */}
        {!isMobile && (
          <Sidebar
            sections={sections}
            collapsed={desktopCollapse.isOpen}
            onToggleCollapsed={desktopCollapse.toggle}
            header={
              !desktopCollapse.isOpen ? (
                <span className="font-display text-lg font-semibold text-white">TradeSucro</span>
              ) : (
                <span className="font-display text-lg font-semibold text-white">T</span>
              )
            }
          />
        )}

        {/* Mobile drawer sidebar */}
        {isMobile && mobileDrawer.isOpen && (
          <div className="fixed inset-0 z-drawer flex">
            <div
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
              onClick={mobileDrawer.close}
              aria-hidden
            />
            <div className="relative">
              <Sidebar
                sections={sections}
                variant="drawer"
                onCloseDrawer={mobileDrawer.close}
                header={<span className="font-display text-lg font-semibold text-white">TradeSucro</span>}
              />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col min-w-0">
          <TopNav
            logo={<span className="font-display text-lg font-semibold text-charcoal dark:text-white">TradeSucro</span>}
            userName="Priya Nair"
            userRole={workspace ? `${roleLabel} · ${workspace.companyName}` : undefined}
            notificationCount={notificationCount}
            onMenuClick={isMobile ? mobileDrawer.open : undefined}
            onSearchClick={mobileSearch.open}
            onNotificationClick={mobileNotifications.open}
            theme={theme}
            onToggleTheme={toggleTheme}
            rightSlot={<WorkspaceSwitcher />}
            profileItems={[
              { label: "Your profile", icon: <User size={15} /> },
              { label: "Settings", icon: <Settings size={15} /> },
              { label: "Log out", icon: <LogOut size={15} />, destructive: true, onClick: handleLogout },
            ]}
          />

          <main className="flex-1 overflow-y-auto">
            <Container className={isMobile ? "py-6 pb-24" : "py-8"}>{children}</Container>
          </main>

          {!isMobile && (
            <Footer
              variant="compact"
              logo={<span className="font-display text-[13px] font-semibold text-white/70">TradeSucro</span>}
              columns={[]}
              bottomText={`© ${new Date().getFullYear()} TradeSucro Technologies Pvt. Ltd.`}
            />
          )}
        </div>

        {/* Mobile bottom navigation — replaces the persistent sidebar on small screens; the drawer above remains the "everything else" overflow */}
        {isMobile && <BottomNav homeHref={workspace?.defaultLandingPage ?? "/dashboard"} alertCount={notificationCount} role={workspace?.role} />}

        <MobileSearchOverlay open={mobileSearch.isOpen} onClose={mobileSearch.close} onSearch={() => router.push("/market")} />

        <BottomSheet open={mobileNotifications.isOpen} onClose={mobileNotifications.close} title="Notifications">
          <NotificationCenter onClose={mobileNotifications.close} />
        </BottomSheet>

        <InstallPrompt />
      </div>
    </ToastProvider>
  );
}
