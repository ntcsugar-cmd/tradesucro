import { authService } from "./auth.service";
import { WORKSPACE_ROLE_META } from "@/lib/constants/workspaceRoles";
import type { Workspace, WorkspaceRole } from "@/lib/types/workspace";

const WORKSPACES_KEY = "tradesucro-workspaces";
const ACTIVE_WORKSPACE_KEY = "tradesucro-active-workspace";
const NETWORK_DELAY_MS = 300;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const DEFAULT_LANDING: Record<WorkspaceRole, string> = {
  mill: "/dashboard",
  trader: "/trader-dashboard",
  broker: "/broker-dashboard",
  buyer: "/buyer-dashboard",
  transporter: "/transport-dashboard",
  warehouse: "/warehouse-dashboard",
  admin: "/admin-dashboard",
};

function seedWorkspaces(): Workspace[] {
  const session = authService.getSession();
  const primaryCompany = session?.companyName ?? "Kaveri Sugar Mills Ltd.";

  const seeds: { role: WorkspaceRole; companyName: string; status: Workspace["status"]; verificationStatus: Workspace["verificationStatus"] }[] = [
    { role: "mill", companyName: primaryCompany, status: "active", verificationStatus: "verified" },
    { role: "trader", companyName: `${primaryCompany.replace(/ Mills| Ltd\.?/g, "")} Trading Co.`, status: "active", verificationStatus: "verified" },
    { role: "buyer", companyName: `${primaryCompany.replace(/ Mills| Ltd\.?/g, "")} Procurement Desk`, status: "pending", verificationStatus: "pending" },
  ];

  return seeds.map((s, i) => ({
    id: `ws-${s.role}-${i}`,
    name: WORKSPACE_ROLE_META[s.role].label,
    role: s.role,
    companyId: `co-${s.role}-${i}`,
    companyName: s.companyName,
    status: s.status,
    verificationStatus: s.verificationStatus,
    lastLogin: i === 0 ? new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() : null,
    themeColor: "#B8933D",
    defaultLandingPage: DEFAULT_LANDING[s.role],
  }));
}

function readWorkspaces(): Workspace[] {
  if (typeof window === "undefined") return seedWorkspaces();
  try {
    const raw = window.localStorage.getItem(WORKSPACES_KEY);
    if (raw) return JSON.parse(raw) as Workspace[];
  } catch {
    // fall through
  }
  const seeded = seedWorkspaces();
  window.localStorage.setItem(WORKSPACES_KEY, JSON.stringify(seeded));
  return seeded;
}

function writeWorkspaces(workspaces: Workspace[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
}

/**
 * Workspace Service (mock)
 * ------------------------------------------------------------------
 * No backend. Every logged-in mock session gets the same 3 seeded
 * workspaces (Mill/Trader/Buyer) — enough to demonstrate the selector
 * and switcher meaningfully — rather than deriving membership from
 * registration data, which this demo doesn't model end-to-end.
 */
export const workspaceService = {
  async getWorkspaces(): Promise<Workspace[]> {
    return delay(readWorkspaces());
  },

  async getWorkspaceById(id: string): Promise<Workspace | undefined> {
    return delay(readWorkspaces().find((w) => w.id === id));
  },

  /** Sync — the active workspace is read synchronously wherever layout/route-guard logic needs it before first paint. */
  getActiveWorkspace(): Workspace | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(ACTIVE_WORKSPACE_KEY);
      return raw ? (JSON.parse(raw) as Workspace) : null;
    } catch {
      return null;
    }
  },

  async setActiveWorkspace(workspaceId: string): Promise<Workspace | undefined> {
    const workspaces = readWorkspaces();
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (!workspace) return delay(undefined);

    const updated: Workspace = { ...workspace, lastLogin: new Date().toISOString() };
    writeWorkspaces(workspaces.map((w) => (w.id === workspaceId ? updated : w)));
    if (typeof window !== "undefined") window.localStorage.setItem(ACTIVE_WORKSPACE_KEY, JSON.stringify(updated));

    return delay(updated, 400);
  },

  clearActiveWorkspace() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACTIVE_WORKSPACE_KEY);
  },

  /**
   * Business Rule: "If ONE workspace → auto-open it. If MULTIPLE → show
   * the Workspace Selector." One implementation, reused by both the
   * login page and onboarding completion rather than duplicated in each.
   */
  async resolvePostLoginDestination(): Promise<string> {
    const workspaces = readWorkspaces();
    if (workspaces.length === 1) {
      const updated = await workspaceService.setActiveWorkspace(workspaces[0].id);
      return updated?.defaultLandingPage ?? "/dashboard";
    }
    return "/workspaces";
  },
};
