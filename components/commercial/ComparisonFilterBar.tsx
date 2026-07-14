"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/forms/Select";
import { NumberInput } from "@/components/forms/Input";
import { QUALITY_GRADES } from "@/lib/types/marketplace";

const GRADE_OPTIONS = QUALITY_GRADES.map((g) => ({ value: g, label: g }));

interface ComparisonFilterBarProps {
  onApply: (grade: string | undefined, quantity: number) => void;
}

export function ComparisonFilterBar({ onApply }: ComparisonFilterBarProps) {
  const [grade, setGrade] = useState("");
  const [quantity, setQuantity] = useState(100);

  return (
    <Card padding="lg">
      <CardBody>
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-48">
            <Select label="Grade" size="sm" placeholder="All grades" options={GRADE_OPTIONS} onChange={(e) => setGrade(e.target.value)} />
          </div>
          <div className="w-40">
            <NumberInput label="Required Quantity" unit="MT" size="sm" value={quantity || ""} onChange={(e) => setQuantity(Number(e.target.value) || 0)} />
          </div>
          <Button variant="primary" size="md" onClick={() => onApply(grade || undefined, quantity || 100)}>
            <SlidersHorizontal size={14} /> Rank Suppliers
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
