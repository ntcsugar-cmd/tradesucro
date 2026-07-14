import { Check } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/cards/Card";
import { COMPANY_TYPES } from "@/lib/constants/company-types";
import type { OnboardingFormData } from "@/lib/types/onboarding";

interface StepProps {
  data: OnboardingFormData;
  onChange: (patch: Partial<OnboardingFormData>) => void;
  error?: string;
}

export function StepBusinessType({ data, onChange, error }: StepProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-medium text-charcoal">What best describes your business?</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">This helps us tailor your marketplace experience.</p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {COMPANY_TYPES.map((type) => {
          const selected = data.businessType === type.value;
          return (
            <Card
              key={type.value}
              interactive
              padding="sm"
              onClick={() => onChange({ businessType: type.value })}
              className={clsx("relative cursor-pointer", selected && "ring-2 ring-gold ring-inset")}
            >
              {selected && (
                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
              <p className="text-[13.5px] font-semibold text-charcoal pr-6">{type.label}</p>
              <p className="mt-1 text-xs text-ink-faint leading-relaxed">{type.description}</p>
            </Card>
          );
        })}
      </div>
      {error && <p className="mt-3 text-xs text-danger">{error}</p>}
    </div>
  );
}
