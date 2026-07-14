import clsx from "clsx";
import { getPasswordStrength } from "@/lib/utils/validation";

interface PasswordStrengthMeterProps {
  password: string;
}

/** PasswordStrengthMeter — 4-segment bar + label, driven by getPasswordStrength(). */
export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, label, colorClass } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={clsx("h-1 flex-1 rounded-full transition-colors", i < score ? colorClass : "bg-charcoal/10")}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-faint">{label}</p>
    </div>
  );
}
