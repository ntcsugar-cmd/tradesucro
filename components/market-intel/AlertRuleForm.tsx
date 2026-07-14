"use client";

import { useState } from "react";
import { BellPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/forms/Select";
import { NumberInput, TextInput } from "@/components/forms/Input";
import { StateSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { AlertType, AlertRule } from "@/lib/types/marketIntelligence";

const ALERT_TYPE_OPTIONS: { value: AlertType; label: string }[] = [
  { value: "price_increase", label: "Price increases" },
  { value: "price_decrease", label: "Price decreases" },
  { value: "mill_price_update", label: "Mill updates price" },
  { value: "new_tender", label: "New tender" },
  { value: "offer_closing", label: "Offer closing" },
  { value: "target_price_reached", label: "Target price reached" },
];

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

interface AlertRuleFormProps {
  onCreate: (rule: Omit<AlertRule, "id" | "createdAt" | "active">) => Promise<void>;
}

export function AlertRuleForm({ onCreate }: AlertRuleFormProps) {
  const [type, setType] = useState<AlertType>("price_decrease");
  const [state, setState] = useState("");
  const [grade, setGrade] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    setSaving(true);
    const label = ALERT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? "Alert";
    await onCreate({
      type,
      label,
      state: state || undefined,
      grade: (grade || undefined) as AlertRule["grade"],
      targetPrice: targetPrice ? Number(targetPrice) : undefined,
    });
    setSaving(false);
    setTargetPrice("");
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Create Alert Rule</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="space-y-5">
          <Select label="Notify when" defaultValue={type} options={ALERT_TYPE_OPTIONS} onChange={(e) => setType(e.target.value as AlertType)} />

          <div className="grid sm:grid-cols-2 gap-5">
            <StateSelect label="State (optional)" onChange={(e) => setState(e.target.value)} />
            <Select label="Grade (optional)" placeholder="Any grade" options={GRADE_OPTIONS} onChange={(e) => setGrade(e.target.value)} />
          </div>

          {type === "target_price_reached" && (
            <NumberInput label="Target Price" unit="₹" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} />
          )}

          {type !== "target_price_reached" && (
            <TextInput label="Target Price" disabled placeholder="Not applicable for this alert type" />
          )}
        </div>

        <Button variant="primary" size="md" className="mt-6" loading={saving} onClick={handleCreate}>
          <BellPlus size={15} /> Create Alert
        </Button>
      </CardBody>
    </Card>
  );
}
