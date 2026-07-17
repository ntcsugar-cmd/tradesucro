"use client";

import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerificationBadge } from "@/components/profile/VerificationBadge";
import { WORKSPACE_ROLE_META } from "@/lib/constants/workspaceRoles";
import type { Workspace } from "@/lib/types/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
  onEnter: (workspace: Workspace) => void;
  entering?: boolean;
}

const STATUS_META: Record<Workspace["status"], { label: string; badgeStatus: "success" | "pending" | "danger" }> = {
  active: { label: "Active", badgeStatus: "success" },
  pending: { label: "Pending", badgeStatus: "pending" },
  suspended: { label: "Suspended", badgeStatus: "danger" },
};

export function WorkspaceCard({ workspace, onEnter, entering = false }: WorkspaceCardProps) {
  const meta = WORKSPACE_ROLE_META[workspace.role];
  const statusMeta = STATUS_META[workspace.status];

  return (
    <Card padding="lg" interactive className="h-full flex flex-col">
      <CardBody className="flex flex-col flex-1">
        <div className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-gold/10 text-2xl">{meta.emoji}</span>
          <StatusBadge status={statusMeta.badgeStatus}>{statusMeta.label}</StatusBadge>
        </div>

        <p className="mt-4 font-display text-lg text-charcoal dark:text-white">{meta.label}</p>
        <p className="text-[13px] text-ink-soft dark:text-white/50 mt-0.5">{workspace.companyName}</p>

        <div className="mt-4 pt-4 border-t border-line dark:border-white/10 space-y-2.5 flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-faint dark:text-white/40">Role</span>
            <span className="text-charcoal dark:text-white font-medium capitalize">{workspace.role}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-faint dark:text-white/40">Verification</span>
            <VerificationBadge status={workspace.verificationStatus} />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-faint dark:text-white/40">Last login</span>
            <span className="text-charcoal dark:text-white">
              {workspace.lastLogin ? new Date(workspace.lastLogin).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Never"}
            </span>
          </div>
        </div>

        <Button variant="primary" size="md" fullWidth className="mt-5" loading={entering} onClick={() => onEnter(workspace)}>
          Enter Workspace
        </Button>
      </CardBody>
    </Card>
  );
}
