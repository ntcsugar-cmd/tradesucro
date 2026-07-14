"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/forms/Select";
import { TextInput } from "@/components/forms/Input";
import { watchlistService } from "@/services/watchlist.service";
import { MILLS } from "@/lib/master-data/mills";
import { STATES } from "@/lib/master-data/states";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { WatchTargetType } from "@/lib/types/smartMatch";

const TYPE_OPTIONS: { value: WatchTargetType; label: string }[] = [
  { value: "mill", label: "Sugar Mill" },
  { value: "trader", label: "Trader" },
  { value: "grade", label: "Grade" },
  { value: "state", label: "State" },
  { value: "region", label: "Region" },
];

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));
const TRADER_NAMES = ["Triveni Agro Industries", "Godavari Sugarcane Co.", "Shree Renuka Exports", "Bajaj Refineries Pvt. Ltd."];
const MILL_OPTIONS = MILLS.slice(0, 20).map((m) => ({ value: m.id, label: m.name }));
const STATE_OPTIONS = STATES.map((s) => ({ value: s.value, label: s.label }));

interface AddWatchFormProps {
  onAdded: () => void;
}

export function AddWatchForm({ onAdded }: AddWatchFormProps) {
  const [type, setType] = useState<WatchTargetType>("mill");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue("");
    setLabel("");
  }, [type]);

  function pick(newValue: string, newLabel: string) {
    setValue(newValue);
    setLabel(newLabel);
  }

  async function handleAdd() {
    if (!value) return;
    setSaving(true);
    await watchlistService.addToWatchlist(type, value, label || value);
    setSaving(false);
    setValue("");
    setLabel("");
    onAdded();
  }

  return (
    <Card padding="lg">
      <CardBody>
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint mb-4">Follow Something New</p>
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <Select label="Type" defaultValue={type} options={TYPE_OPTIONS} onChange={(e) => setType(e.target.value as WatchTargetType)} />

          {type === "mill" && (
            <Select label="Mill" placeholder="Select a mill" options={MILL_OPTIONS} onChange={(e) => pick(e.target.value, MILL_OPTIONS.find((m) => m.value === e.target.value)?.label ?? "")} />
          )}
          {type === "trader" && (
            <Select label="Trader" placeholder="Select a trader" options={TRADER_NAMES.map((t) => ({ value: t, label: t }))} onChange={(e) => pick(e.target.value, e.target.value)} />
          )}
          {type === "grade" && <Select label="Grade" placeholder="Select a grade" options={GRADE_OPTIONS} onChange={(e) => pick(e.target.value, e.target.value)} />}
          {(type === "state" || type === "region") && (
            <Select
              label={type === "state" ? "State" : "Region (state)"}
              placeholder="Select a state"
              options={STATE_OPTIONS}
              onChange={(e) => pick(e.target.value, STATE_OPTIONS.find((s) => s.value === e.target.value)?.label ?? "")}
            />
          )}

          <TextInput label="Display Label (optional)" placeholder="Overrides the default label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>

        <Button variant="primary" size="md" className="mt-5" loading={saving} disabled={!value} onClick={handleAdd}>
          <Plus size={15} /> Add to Watchlist
        </Button>
      </CardBody>
    </Card>
  );
}
