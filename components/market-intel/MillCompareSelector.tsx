"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Select } from "@/components/forms/Select";
import { Badge } from "@/components/common/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { marketIntelligenceService } from "@/services/marketIntelligence.service";
import type { Mill } from "@/types/master-data";

const MAX_COMPARE = 10;

interface MillCompareSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function MillCompareSelector({ selectedIds, onChange }: MillCompareSelectorProps) {
  const [mills, setMills] = useState<Mill[]>([]);

  useEffect(() => {
    marketIntelligenceService.getAllMills().then(setMills);
  }, []);

  function addMill(id: string) {
    if (!id || selectedIds.includes(id) || selectedIds.length >= MAX_COMPARE) return;
    onChange([...selectedIds, id]);
  }

  function removeMill(id: string) {
    onChange(selectedIds.filter((m) => m !== id));
  }

  const available = mills.filter((m) => !selectedIds.includes(m.id));

  return (
    <div>
      <Select
        label={`Add a mill to compare (${selectedIds.length}/${MAX_COMPARE})`}
        placeholder="Select a mill"
        disabled={selectedIds.length >= MAX_COMPARE}
        options={available.map((m) => ({ value: m.id, label: m.name }))}
        onChange={(e) => addMill(e.target.value)}
      />

      {selectedIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const mill = mills.find((m) => m.id === id);
            if (!mill) return null;
            return (
              <span key={id} className="inline-flex items-center gap-1.5">
                <Badge tone="gold">{mill.name}</Badge>
                <IconButton variant="ghost" size="sm" aria-label={`Remove ${mill.name}`} onClick={() => removeMill(id)}>
                  <X size={12} />
                </IconButton>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
