import { NumberInput, TextInput } from "@/components/forms/Input";
import { DispatchTermSelect } from "@/components/master-data";
import type { MillOfferDispatch } from "@/lib/types/millOffer";

interface DispatchSectionProps {
  data: MillOfferDispatch;
  onChange: (patch: Partial<MillOfferDispatch>) => void;
  errors?: Partial<Record<keyof MillOfferDispatch, string>>;
  readOnly?: boolean;
}

export function DispatchSection({ data, onChange, errors = {}, readOnly = false }: DispatchSectionProps) {
  return (
    <div>
      <h2 className="font-display text-lg font-medium text-charcoal">Dispatch</h2>
      <div className="mt-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput
            label="Dispatch Start Date"
            type="date"
            value={data.dispatchStartDate}
            disabled={readOnly}
            onChange={(e) => onChange({ dispatchStartDate: e.target.value })}
            error={errors.dispatchStartDate}
          />
          <TextInput
            label="Dispatch End Date"
            type="date"
            value={data.dispatchEndDate}
            disabled={readOnly}
            onChange={(e) => onChange({ dispatchEndDate: e.target.value })}
            error={errors.dispatchEndDate}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <NumberInput
            label="Lifting Period"
            unit="days"
            value={data.liftingPeriodDays || ""}
            disabled={readOnly}
            onChange={(e) => onChange({ liftingPeriodDays: Number(e.target.value) || 0 })}
          />
          <NumberInput
            label="Minimum Lifting Quantity"
            unit="MT"
            value={data.minimumLiftingQuantity || ""}
            disabled={readOnly}
            onChange={(e) => onChange({ minimumLiftingQuantity: Number(e.target.value) || 0 })}
          />
          <NumberInput
            label="Maximum Daily Lifting"
            unit="MT"
            value={data.maximumDailyLifting || ""}
            disabled={readOnly}
            onChange={(e) => onChange({ maximumDailyLifting: Number(e.target.value) || 0 })}
          />
        </div>

        <DispatchTermSelect
          label="Dispatch Terms"
          defaultValue={data.dispatchTerms}
          disabled={readOnly}
          onChange={(e) => onChange({ dispatchTerms: e.target.value })}
          error={errors.dispatchTerms}
        />
      </div>
    </div>
  );
}
