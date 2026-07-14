/**
 * User roles within a TradeSucro organization account.
 * Paired with permissions.ts to gate UI and actions.
 */
export interface Role {
  value: string;
  label: string;
  description: string;
}

export const ROLES: Role[] = [
  { value: "owner", label: "Owner", description: "Full control, including billing and team management" },
  { value: "admin", label: "Admin", description: "Manages offers, mills/buyers, and team members" },
  { value: "trader", label: "Trader", description: "Posts and manages offers and requirements" },
  { value: "analyst", label: "Analyst", description: "Read-only access to market data and reports" },
  { value: "viewer", label: "Viewer", description: "Read-only access to the organization's activity" },
];

export function getRoleLabel(value: string): string {
  return ROLES.find((r) => r.value === value)?.label ?? value;
}
