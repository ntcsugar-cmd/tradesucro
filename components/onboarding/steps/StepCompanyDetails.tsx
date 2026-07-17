import { TextInput } from "@/components/forms/Input";
import type { OnboardingFormData } from "@/lib/types/onboarding";

interface StepProps {
  data: OnboardingFormData;
  onChange: (patch: Partial<OnboardingFormData>) => void;
  errors?: Partial<Record<"companyName" | "gstin" | "pan" | "cin" | "iec", string>>;
}

export function StepCompanyDetails({ data, onChange, errors = {} }: StepProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-medium text-charcoal dark:text-white">Company details</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft dark:text-white/50">Your registered business identifiers.</p>

      <div className="mt-6 space-y-5">
        <TextInput
          label="Company name"
          placeholder="Kaveri Sugar Mills Ltd."
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          error={errors.companyName}
        />

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput
            label="GSTIN"
            placeholder="27AAAAA0000A1Z5"
            value={data.gstin}
            onChange={(e) => onChange({ gstin: e.target.value.toUpperCase() })}
            error={errors.gstin}
            maxLength={15}
            className="uppercase"
          />
          <TextInput
            label="PAN"
            placeholder="AAAAA0000A"
            value={data.pan}
            onChange={(e) => onChange({ pan: e.target.value.toUpperCase() })}
            error={errors.pan}
            maxLength={10}
            className="uppercase"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <TextInput
            label="CIN"
            helperText="Optional — for registered companies"
            placeholder="L15122MH1974PLC123456"
            value={data.cin}
            onChange={(e) => onChange({ cin: e.target.value.toUpperCase() })}
            error={errors.cin}
            className="uppercase"
          />
          <TextInput
            label="IEC"
            helperText="Optional — for import/export"
            placeholder="AAAAA0000A"
            value={data.iec}
            onChange={(e) => onChange({ iec: e.target.value.toUpperCase() })}
            error={errors.iec}
            className="uppercase"
          />
        </div>
      </div>
    </div>
  );
}
