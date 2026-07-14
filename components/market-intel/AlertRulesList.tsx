import { Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { ToggleSwitch } from "@/components/forms/Switch";
import { IconButton } from "@/components/ui/IconButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import { formatINR } from "@/lib/utils/format";
import type { AlertRule } from "@/lib/types/marketIntelligence";

interface AlertRulesListProps {
  rules: AlertRule[];
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

export function AlertRulesList({ rules, onToggle, onDelete }: AlertRulesListProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Your Alert Rules</CardTitle>
      </CardHeader>
      <CardBody>
        {rules.length === 0 ? (
          <EmptyState title="No alert rules yet" description="Create your first rule to get notified about price moves, tenders, and offers." />
        ) : (
          <ul className="divide-y divide-line">
            {rules.map((rule) => (
              <li key={rule.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-charcoal">{rule.label}</p>
                  <p className="text-xs text-ink-faint mt-0.5">
                    {[rule.state && getMasterStateLabel(rule.state), rule.grade, rule.targetPrice && formatINR(rule.targetPrice)].filter(Boolean).join(" · ") || "All states, all grades"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ToggleSwitch checked={rule.active} onChange={(checked) => onToggle(rule.id, checked)} size="sm" />
                  <IconButton variant="ghost" size="sm" aria-label={`Delete ${rule.label}`} onClick={() => onDelete(rule.id)}>
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
