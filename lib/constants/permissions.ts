/**
 * Discrete permissions that gate actions across the app.
 * `ROLE_PERMISSIONS` maps each role (see roles.ts) to its default grant set.
 */
export type Permission =
  | "offers.create"
  | "offers.edit"
  | "offers.delete"
  | "deals.view"
  | "deals.manage"
  | "team.manage"
  | "billing.manage"
  | "reports.view";

export const PERMISSIONS: { value: Permission; label: string }[] = [
  { value: "offers.create", label: "Create offers & requirements" },
  { value: "offers.edit", label: "Edit offers & requirements" },
  { value: "offers.delete", label: "Delete offers & requirements" },
  { value: "deals.view", label: "View deals" },
  { value: "deals.manage", label: "Manage deals & settlement" },
  { value: "team.manage", label: "Manage team members" },
  { value: "billing.manage", label: "Manage billing" },
  { value: "reports.view", label: "View reports & analytics" },
];

/** Default permission grants per role value (see roles.ts). */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: ["offers.create", "offers.edit", "offers.delete", "deals.view", "deals.manage", "team.manage", "billing.manage", "reports.view"],
  admin: ["offers.create", "offers.edit", "offers.delete", "deals.view", "deals.manage", "team.manage", "reports.view"],
  trader: ["offers.create", "offers.edit", "deals.view", "reports.view"],
  analyst: ["deals.view", "reports.view"],
  viewer: ["deals.view"],
};

export function roleHasPermission(role: string, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
