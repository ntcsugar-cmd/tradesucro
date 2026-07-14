import { NumberInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Checkbox } from "@/components/forms/Checkbox";
import { ANNUAL_TURNOVER_RANGES, MONTHLY_TRADING_VOLUME_RANGES } from "@/lib/constants/business-info";
import { STATES } from "@/lib/constants/states";
import type { OnboardingFormData } from "@/lib/types/onboarding";

interface StepProps {
  data: OnboardingFormData;
  onChange: (patch: Partial<OnboardingFormData>) => void;
  errors?: Partial<Record<"yearsInBusiness" | "annualTurnover" | "statesServed" | "monthlyTradingVolume", string>>;
}

export function StepBusinessInfo({ data, onChange, errors = {} }: StepProps) {
  function toggleState(value: string) {
    const set = new Set(data.statesServed);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    onChange({ statesServed: Array.from(set) });
  }

  return (
    <div>
      <h2 className="font-display text-xl font-medium text-charcoal">Business information</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">Helps us match you with the right offers and buyers.</p>

      <div className="mt-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <NumberInput
            label="Years in business"
            placeholder="10"
            value={data.yearsInBusiness}
            onChange={(e) => onChange({ yearsInBusiness: e.target.value })}
            error={errors.yearsInBusiness}
            min={0}
          />
          <Select
            label="Annual turnover"
            placeholder="Select a range"
            defaultValue={data.annualTurnover}
            onChange={(e) => onChange({ annualTurnover: e.target.value })}
            options={ANNUAL_TURNOVER_RANGES}
            error={errors.annualTurnover}
          />
        </div>

        <Select
          label="Monthly trading volume"
          placeholder="Select a range"
          defaultValue={data.monthlyTradingVolume}
          onChange={(e) => onChange({ monthlyTradingVolume: e.target.value })}
          options={MONTHLY_TRADING_VOLUME_RANGES}
          error={errors.monthlyTradingVolume}
        />

        <div>
          <p className="block text-[13px] font-medium text-charcoal mb-2">States served</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 rounded-sm border border-line p-4">
            {STATES.map((state) => (
              <Checkbox
                key={state.value}
                label={state.label}
                checked={data.statesServed.includes(state.value)}
                onChange={() => toggleState(state.value)}
              />
            ))}
          </div>
          {errors.statesServed && <p className="mt-1.5 text-xs text-danger">{errors.statesServed}</p>}
        </div>
      </div>
    </div>
  );
}
