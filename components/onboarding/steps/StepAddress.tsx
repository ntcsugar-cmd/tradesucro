import { TextInput } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { COUNTRIES } from "@/lib/constants/countries";
import { STATES } from "@/lib/constants/states";
import type { OnboardingFormData } from "@/lib/types/onboarding";

interface StepProps {
  data: OnboardingFormData;
  onChange: (patch: Partial<OnboardingFormData>) => void;
  errors?: Partial<Record<"country" | "state" | "city" | "pinCode" | "fullAddress", string>>;
}

export function StepAddress({ data, onChange, errors = {} }: StepProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-medium text-charcoal dark:text-white">Business address</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft dark:text-white/50">Where your business is registered and operates from.</p>

      <div className="mt-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Select
            label="Country"
            defaultValue={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
            options={COUNTRIES}
            error={errors.country}
          />
          <Select
            label="State"
            placeholder="Select a state"
            defaultValue={data.state}
            onChange={(e) => onChange({ state: e.target.value })}
            options={STATES}
            error={errors.state}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput
            label="City"
            placeholder="Kolhapur"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            error={errors.city}
          />
          <TextInput
            label="PIN code"
            inputMode="numeric"
            placeholder="416003"
            maxLength={6}
            value={data.pinCode}
            onChange={(e) => onChange({ pinCode: e.target.value.replace(/\D/g, "") })}
            error={errors.pinCode}
          />
        </div>

        <Textarea
          label="Full address"
          placeholder="Plot no., street, locality, landmark"
          rows={3}
          value={data.fullAddress}
          onChange={(e) => onChange({ fullAddress: e.target.value })}
          error={errors.fullAddress}
        />
      </div>
    </div>
  );
}
