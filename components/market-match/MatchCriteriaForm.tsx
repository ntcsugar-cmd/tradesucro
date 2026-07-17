"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { StateSelect } from "@/components/master-data";
import { QUALITY_GRADES } from "@/lib/types/marketplace";
import type { MatchCriteria } from "@/lib/types/smartMatch";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

interface MatchCriteriaFormProps {
  onRun: (criteria: MatchCriteria) => void;
  running?: boolean;
}

export function MatchCriteriaForm({ onRun, running = false }: MatchCriteriaFormProps) {
  const [grade, setGrade] = useState("");
  const [state, setState] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [maxPrice, setMaxPrice] = useState(0);
  const [targetSellPrice, setTargetSellPrice] = useState(0);

  function handleRun() {
    onRun({
      grade: grade || undefined,
      state: state || undefined,
      quantity: quantity || 100,
      maxPrice: maxPrice || undefined,
      targetSellPrice: targetSellPrice || undefined,
    });
  }

  return (
    <Card padding="lg">
      <CardBody>
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 mb-4">Match Criteria</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Select label="Grade" size="sm" placeholder="Any grade" options={GRADE_OPTIONS} onChange={(e) => setGrade(e.target.value)} />
          <StateSelect label="State" size="sm" onChange={(e) => setState(e.target.value)} />
          <NumberInput label="Quantity" unit="MT" size="sm" value={quantity || ""} onChange={(e) => setQuantity(Number(e.target.value) || 0)} />
          <NumberInput label="Max Price" unit="₹" size="sm" value={maxPrice || ""} onChange={(e) => setMaxPrice(Number(e.target.value) || 0)} />
          <NumberInput label="Target Sell Price" unit="₹" size="sm" value={targetSellPrice || ""} onChange={(e) => setTargetSellPrice(Number(e.target.value) || 0)} />
        </div>
        <Button variant="primary" size="md" className="mt-5" loading={running} onClick={handleRun}>
          <Sparkles size={15} /> Find Matches
        </Button>
      </CardBody>
    </Card>
  );
}
