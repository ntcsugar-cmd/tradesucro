import { Checkbox } from "@/components/forms/Checkbox";
import { NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import type { BidConditions, TenderVisibility } from "@/lib/types/millTender";

const VISIBILITY_OPTIONS: { value: TenderVisibility; label: string }[] = [
  { value: "public", label: "Public — visible to all verified traders/brokers" },
  { value: "invited_only", label: "Invited Only — limited participant list" },
  { value: "private", label: "Private — direct negotiation only" },
];

interface BidConditionsSectionProps {
  data: BidConditions;
  onChange: (patch: Partial<BidConditions>) => void;
  readOnly?: boolean;
}

export function BidConditionsSection({ data, onChange, readOnly = false }: BidConditionsSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal dark:text-white">Bid Conditions</h2>
      <div className="mt-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <NumberInput label="Minimum Quantity" unit="MT" value={data.minimumQuantity || ""} disabled={readOnly} onChange={(e) => onChange({ minimumQuantity: Number(e.target.value) || 0 })} />
          <NumberInput label="Maximum Quantity" unit="MT" value={data.maximumQuantity || ""} disabled={readOnly} onChange={(e) => onChange({ maximumQuantity: Number(e.target.value) || 0 })} />
        </div>

        <NumberInput label="Bid Increment" unit="₹" value={data.bidIncrement || ""} disabled={readOnly} onChange={(e) => onChange({ bidIncrement: Number(e.target.value) || 0 })} />

        <div className="grid sm:grid-cols-2 gap-5 items-end">
          <Checkbox label="Bid revisions allowed" checked={data.bidRevisionAllowed} disabled={readOnly} onChange={(e) => onChange({ bidRevisionAllowed: e.target.checked })} />
          {data.bidRevisionAllowed && (
            <NumberInput label="Number of Revisions" value={data.numberOfRevisions || ""} disabled={readOnly} onChange={(e) => onChange({ numberOfRevisions: Number(e.target.value) || 0 })} />
          )}
        </div>

        <Checkbox label="Auto extension on last-minute bids" description="Extends closing time if a bid arrives in the final minutes" checked={data.autoExtension} disabled={readOnly} onChange={(e) => onChange({ autoExtension: e.target.checked })} />

        <Select label="Tender Visibility" defaultValue={data.visibility} disabled={readOnly} options={VISIBILITY_OPTIONS} onChange={(e) => onChange({ visibility: e.target.value as TenderVisibility })} />
      </div>
    </div>
  );
}
