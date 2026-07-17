import { Textarea } from "@/components/forms/Textarea";
import type { MillOfferConditions } from "@/lib/types/millOffer";

interface ConditionsSectionProps {
  data: MillOfferConditions;
  onChange: (patch: Partial<MillOfferConditions>) => void;
  readOnly?: boolean;
}

export function ConditionsSection({ data, onChange, readOnly = false }: ConditionsSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Conditions</h2>
      <div className="mt-5 space-y-5">
        <Textarea
          label="Special Terms"
          rows={2}
          value={data.specialTerms}
          disabled={readOnly}
          onChange={(e) => onChange({ specialTerms: e.target.value })}
        />
        <Textarea
          label="Quality Conditions"
          rows={2}
          value={data.qualityConditions}
          disabled={readOnly}
          onChange={(e) => onChange({ qualityConditions: e.target.value })}
        />
        <Textarea
          label="Penalty Clause"
          rows={2}
          value={data.penaltyClause}
          disabled={readOnly}
          onChange={(e) => onChange({ penaltyClause: e.target.value })}
        />
        <Textarea
          label="Cancellation Policy"
          rows={2}
          value={data.cancellationPolicy}
          disabled={readOnly}
          onChange={(e) => onChange({ cancellationPolicy: e.target.value })}
        />
        <Textarea
          label="Remarks"
          rows={2}
          value={data.remarks}
          disabled={readOnly}
          onChange={(e) => onChange({ remarks: e.target.value })}
        />
      </div>
    </div>
  );
}
