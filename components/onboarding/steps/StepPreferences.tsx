import { Checkbox } from "@/components/forms/Checkbox";
import type { OnboardingFormData } from "@/lib/types/onboarding";

interface StepProps {
  data: OnboardingFormData;
  onChange: (patch: Partial<OnboardingFormData>) => void;
  error?: string;
}

const PREFERENCE_OPTIONS: {
  key: keyof OnboardingFormData["preferences"];
  label: string;
  description: string;
}[] = [
  { key: "buySugar", label: "Buy Sugar", description: "Post buy requirements and respond to sell offers" },
  { key: "sellSugar", label: "Sell Sugar", description: "Post sell offers and respond to buy requirements" },
  { key: "bothBuyAndSell", label: "Both Buy & Sell", description: "Trade on both sides of the market" },
  { key: "transportServices", label: "Transport Services", description: "Offer or request logistics between mills, warehouses, and ports" },
];

export function StepPreferences({ data, onChange, error }: StepProps) {
  function toggle(key: keyof OnboardingFormData["preferences"]) {
    onChange({ preferences: { ...data.preferences, [key]: !data.preferences[key] } });
  }

  return (
    <div>
      <h2 className="font-display text-xl font-medium text-charcoal">Business preference</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">Select everything that applies — you can change this later.</p>

      <div className="mt-6 space-y-3">
        {PREFERENCE_OPTIONS.map((opt) => (
          <div
            key={opt.key}
            className="rounded-sm border border-line p-4 hover:border-gold/40 transition-colors"
          >
            <Checkbox
              checked={data.preferences[opt.key]}
              onChange={() => toggle(opt.key)}
              label={opt.label}
              description={opt.description}
            />
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-xs text-danger">{error}</p>}
    </div>
  );
}
