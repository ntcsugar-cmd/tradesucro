"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/forms/Select";
import { CATEGORY_OPTIONS } from "./ContactBadges";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import { contactService } from "@/services/contact.service";
import type { ContactFilters, ContactCategory, ContactVerificationStatus } from "@/lib/types/contact";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));
const VERIFICATION_OPTIONS: { value: ContactVerificationStatus; label: string }[] = [
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "unverified", label: "Unverified" },
];

interface ContactFilterPanelProps {
  onApply: (filters: ContactFilters) => void;
}

export function ContactFilterPanel({ onApply }: ContactFilterPanelProps) {
  const [draft, setDraft] = useState<ContactFilters>({});
  const [resetKey, setResetKey] = useState(0);
  const [parties, setParties] = useState<{ states: string[]; cities: string[] }>({ states: [], cities: [] });

  useEffect(() => {
    setParties(contactService.getPartyOptions());
  }, []);

  function set<K extends keyof ContactFilters>(key: K, value: ContactFilters[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    setDraft({});
    setResetKey((k) => k + 1);
    onApply({});
  }

  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-semibold text-charcoal">Filters</p>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <RotateCcw size={13} /> Clear
          </Button>
        </div>

        <div key={resetKey} className="space-y-4">
          <Select label="Category" size="sm" placeholder="Any category" options={CATEGORY_OPTIONS} onChange={(e) => set("category", (e.target.value || undefined) as ContactCategory)} />
          <Select label="State" size="sm" placeholder="Any state" options={parties.states.map((s) => ({ value: s, label: s }))} onChange={(e) => set("state", e.target.value || undefined)} />
          <Select label="Grade" size="sm" placeholder="Any grade" options={GRADE_OPTIONS} onChange={(e) => set("grade", (e.target.value || undefined) as ContactFilters["grade"])} />
          <Select
            label="Verification"
            size="sm"
            placeholder="Any status"
            options={VERIFICATION_OPTIONS}
            onChange={(e) => set("verification", (e.target.value || undefined) as ContactVerificationStatus)}
          />
        </div>

        <Button variant="primary" size="md" fullWidth className="mt-5" onClick={() => onApply(draft)}>
          Apply filters
        </Button>
      </CardBody>
    </Card>
  );
}
