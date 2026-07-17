"use client";

import { useEffect, useState } from "react";
import { Select } from "@/components/forms/Select";
import { millOfferService } from "@/services/millOffer.service";
import { getMasterStateLabel } from "@/lib/utils/marketplaceLabels";
import type { Mill } from "@/types/master-data";

interface MillInformationSectionProps {
  millId: string;
  state: string;
  city: string;
  factoryCode: string;
  onSelectMill: (mill: Mill, factoryCode: string) => void;
  error?: string;
  readOnly?: boolean;
}

/** Deterministic factory code, matching the derivation in millOffer.service.ts (kept in sync there — this is a display-only mirror, the service is the source of truth for saved offers). */
function factoryCodeFor(mill: Mill): string {
  const digits = mill.id.replace(/\D/g, "").padStart(3, "0").slice(-3);
  return `FC-${mill.state.slice(0, 2).toUpperCase()}-${digits}`;
}

/**
 * Mill Information section. The Sugar Mill dropdown is intentionally
 * scoped to the 10 mills participating in this module's mock program
 * (millOfferService.getParticipatingMills()) rather than the full
 * Master Data mill list of 50 — a mill offer belongs to one of the
 * mills actually running offers here. State, City, and Factory Code
 * are derived read-only once a mill is chosen, not independently entered.
 */
export function MillInformationSection({ millId, state, city, factoryCode, onSelectMill, error, readOnly = false }: MillInformationSectionProps) {
  const [mills, setMills] = useState<Mill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    millOfferService.getParticipatingMills().then((result) => {
      setMills(result);
      setLoading(false);
    });
  }, []);

  function handleSelect(id: string) {
    const mill = mills.find((m) => m.id === id);
    if (mill) onSelectMill(mill, factoryCodeFor(mill));
  }

  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Mill Information</h2>
      <div className="mt-5 grid sm:grid-cols-2 gap-5">
        <Select
          label="Sugar Mill"
          placeholder={loading ? "Loading mills…" : "Select a mill"}
          disabled={loading || readOnly}
          defaultValue={millId}
          onChange={(e) => handleSelect(e.target.value)}
          options={mills.map((m) => ({ value: m.id, label: m.name }))}
          error={error}
        />
        <div>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">Factory Code</p>
          <p className="h-11 flex items-center px-3.5 rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02] font-mono text-sm text-ink-soft dark:text-white/50">
            {factoryCode || "—"}
          </p>
        </div>
        <div>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">State</p>
          <p className="h-11 flex items-center px-3.5 rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02] text-sm text-ink-soft dark:text-white/50">
            {state ? getMasterStateLabel(state) : "—"}
          </p>
        </div>
        <div>
          <p className="text-[13px] font-medium text-charcoal dark:text-white mb-1.5">City</p>
          <p className="h-11 flex items-center px-3.5 rounded-sm border border-line dark:border-white/10 bg-charcoal/[0.02] text-sm text-ink-soft dark:text-white/50">
            {city || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
