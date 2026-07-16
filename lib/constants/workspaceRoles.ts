import type { WorkspaceRole } from "@/lib/types/workspace";

/**
 * Workspace Role Permissions
 * ------------------------------------------------------------------
 * Deliberately separate from lib/constants/permissions.ts, which
 * governs team-member capability *within* one company (owner/admin/
 * trader/analyst/viewer). This file governs which *workspace* — Mill,
 * Trader, Broker, Buyer, Transporter, Warehouse, Admin — a menu,
 * route, dashboard widget, or action belongs to.
 *
 * menus / routePrefixes are live-enforced today (sidebar filtering and
 * route access in app/(dashboard)/layout.tsx). dashboardWidgets and
 * actions are fully modeled here — the data every future dashboard/
 * action-gate needs already exists — but are not deeply wired into
 * every existing widget component in this pass, since that would mean
 * editing the protected Mill Portal module files.
 */

export interface WorkspaceRoleMeta {
  label: string;
  emoji: string;
  /** lucide-react icon name — resolved by the component that renders it, matching the icon-agnostic pattern in lib/constants/navigation.ts. */
  icon: string;
  description: string;
}

export const WORKSPACE_ROLE_META: Record<WorkspaceRole, WorkspaceRoleMeta> = {
  mill: { label: "Mill Workspace", emoji: "🏭", icon: "Factory", description: "Publish offers and tenders, manage inventory and dispatch." },
  trader: { label: "Trader Workspace", emoji: "📈", icon: "TrendingUp", description: "Buy from mills, resell across the marketplace." },
  broker: { label: "Broker Workspace", emoji: "🤝", icon: "Handshake", description: "Facilitate deals between mills, traders, and buyers." },
  buyer: { label: "Buyer Workspace", emoji: "🛒", icon: "ShoppingCart", description: "Source sugar from mills and traders." },
  transporter: { label: "Transport Workspace", emoji: "🚚", icon: "Truck", description: "Quote and fulfill freight requests." },
  warehouse: { label: "Warehouse Workspace", emoji: "🏬", icon: "Warehouse", description: "Manage storage and warehouse receipts." },
  admin: { label: "Admin Workspace", emoji: "⚙️", icon: "ShieldCheck", description: "Platform oversight, verification, and governance." },
};

export interface WorkspacePermissionSet {
  /** DASHBOARD_NAV section titles (lib/constants/navigation.ts) visible to this role. */
  menus: string[];
  /** Route path prefixes this role may access. */
  routePrefixes: string[];
  /** Dashboard widget keys this role's dashboard may render (modeled for future dashboards). */
  dashboardWidgets: string[];
  /** Action keys this role may perform (modeled for future action-gating). */
  actions: string[];
}

// "/market" and "Market Intelligence" are additive here for v1.0 — added
// to the *common* set (not just mill) since live market data is relevant
// to every workspace role, not just mills. No permission-checking logic
// changed, only the shared data every role's menus/routePrefixes spread in.
const COMMON_ROUTES = ["/workspaces", "/company-profile", "/settings", "/marketplace", "/market", "/commercial", "/contacts"];
const COMMON_MENUS = ["Marketplace", "Market Intelligence", "Commercial Decision Engine", "Contact Network", "Account"];

export const WORKSPACE_ROLE_PERMISSIONS: Record<WorkspaceRole, WorkspacePermissionSet> = {
  mill: {
    // "Advanced Tenders" is additive here for v0.9 (Tender Management for the
    // Mill Workspace) — no permission-checking logic changed, only the data
    // that lists mill's own allowed menu/route. Without it, the route guard
    // in app/(dashboard)/layout.tsx would block the very module this adds.
    menus: ["Workspace", "Mill Offers", "Tender Management", "Advanced Tenders", "Mill Operations", "Insights", ...COMMON_MENUS],
    routePrefixes: [
      "/dashboard",
      "/mill-offers",
      "/tenders",
      "/mill/tenders",
      "/mill-profile",
      "/inventory",
      "/dispatch-calendar",
      "/price-board",
      "/reports",
      ...COMMON_ROUTES,
    ],
    dashboardWidgets: ["millStats", "millQuickActions", "todaysPrices", "upcomingLifting", "notifications", "recentActivity", "marketSnapshot"],
    actions: ["offers.create", "offers.publish", "offers.withdraw", "tenders.create", "tenders.publish", "tenders.award", "prices.update", "reports.generate"],
  },
  trader: {
    // "/trader" is additive here for v1.3 (Trader Workspace) — no
    // permission-checking logic changed, only the trader role's own
    // route data, per this task's explicit "Use existing Workspace
    // Architecture" requirement. "/trader-dashboard" (the old
    // placeholder route) now just redirects into "/trader".
    menus: ["Workspace", ...COMMON_MENUS],
    routePrefixes: ["/trader-dashboard", "/trader", ...COMMON_ROUTES],
    dashboardWidgets: ["quickActions", "recentActivity", "marketSnapshot", "notifications"],
    actions: ["requirements.create", "offers.create", "interest.express"],
  },
  broker: {
    menus: ["Workspace", ...COMMON_MENUS],
    routePrefixes: ["/broker-dashboard", ...COMMON_ROUTES],
    dashboardWidgets: ["quickActions", "recentActivity", "marketSnapshot", "notifications"],
    actions: ["requirements.create", "offers.create", "interest.express", "deals.facilitate"],
  },
  buyer: {
    menus: ["Workspace", ...COMMON_MENUS],
    routePrefixes: ["/buyer-dashboard", ...COMMON_ROUTES],
    dashboardWidgets: ["quickActions", "recentActivity", "marketSnapshot", "notifications"],
    actions: ["requirements.create", "interest.express"],
  },
  transporter: {
    menus: ["Workspace", ...COMMON_MENUS],
    routePrefixes: ["/transport-dashboard", ...COMMON_ROUTES],
    dashboardWidgets: ["quickActions", "notifications"],
    actions: ["transport.quote", "transport.accept", "dispatch.update"],
  },
  warehouse: {
    menus: ["Workspace", ...COMMON_MENUS],
    routePrefixes: ["/warehouse-dashboard", ...COMMON_ROUTES],
    dashboardWidgets: ["quickActions", "notifications"],
    actions: ["inventory.manage", "receipts.issue"],
  },
  admin: {
    menus: ["Workspace", "Master Data", "Mill Offers", "Tender Management", "Mill Operations", "Insights", ...COMMON_MENUS],
    routePrefixes: ["/admin-dashboard", "/admin", ...COMMON_ROUTES, "/mill-offers", "/tenders", "/mill-profile", "/inventory", "/dispatch-calendar", "/price-board", "/reports", "/dashboard"],
    dashboardWidgets: ["adminStats", "verificationQueue", "disputeQueue", "notifications"],
    actions: ["organizations.approve", "listings.moderate", "disputes.resolve", "platform.configure"],
  },
};

export function hasMenuPermission(role: WorkspaceRole, menuTitle: string): boolean {
  return WORKSPACE_ROLE_PERMISSIONS[role].menus.includes(menuTitle);
}

export function hasRoutePermission(role: WorkspaceRole, path: string): boolean {
  return WORKSPACE_ROLE_PERMISSIONS[role].routePrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function hasWidgetPermission(role: WorkspaceRole, widgetKey: string): boolean {
  return WORKSPACE_ROLE_PERMISSIONS[role].dashboardWidgets.includes(widgetKey);
}

export function hasActionPermission(role: WorkspaceRole, actionKey: string): boolean {
  return WORKSPACE_ROLE_PERMISSIONS[role].actions.includes(actionKey);
}
