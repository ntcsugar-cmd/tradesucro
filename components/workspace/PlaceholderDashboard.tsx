import { Construction } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { WORKSPACE_ROLE_META } from "@/lib/constants/workspaceRoles";
import type { WorkspaceRole } from "@/lib/types/workspace";

interface PlaceholderDashboardProps {
  role: WorkspaceRole;
}

/** PlaceholderDashboard — Trader/Buyer/Transport/Warehouse/Admin dashboards are placeholders per the v0.8 brief (only the Mill dashboard is fully built, in the protected Mill Portal module). */
export function PlaceholderDashboard({ role }: PlaceholderDashboardProps) {
  const meta = WORKSPACE_ROLE_META[role];

  return (
    <>
      <Breadcrumb items={[{ label: meta.label }]} className="mb-5" />
      <PageHeader title={meta.label} description={meta.description} />
      <EmptyState
        icon={<Construction size={20} />}
        title={`${meta.label} is coming soon`}
        description="This workspace is wired up for login, switching, and routing — its dashboard content is a future build."
      />
    </>
  );
}
