import type { VerificationStatus } from "./company-profile";

/**
 * Workspace Types
 * ------------------------------------------------------------------
 * A Workspace is one (User + Organization + Role) context. A single
 * login can hold multiple Workspaces — e.g. the same person acting as
 * a Mill Admin for their mill and a Trader Admin for a trading arm of
 * the same group. This is deliberately a separate concept from the
 * team-member Role in lib/constants/roles.ts (owner/admin/trader/
 * analyst/viewer within one company) — that axis is "what can this
 * person do inside their company," this one is "which business the
 * person is currently acting as."
 */

export type WorkspaceRole = "mill" | "trader" | "broker" | "buyer" | "transporter" | "warehouse" | "admin";

export type WorkspaceStatus = "active" | "pending" | "suspended";

export interface Workspace {
  id: string;
  name: string;
  role: WorkspaceRole;
  companyId: string;
  companyName: string;
  status: WorkspaceStatus;
  verificationStatus: VerificationStatus;
  lastLogin: string | null;
  /** Future support — not yet applied anywhere visually. */
  themeColor: string;
  defaultLandingPage: string;
}
