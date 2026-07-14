import { Check } from "lucide-react";
import clsx from "clsx";

interface OnboardingStepperProps {
  steps: string[];
  currentStep: number;
}

/** OnboardingStepper — horizontal on desktop, condensed to "Step X of N" + bar on mobile. */
export function OnboardingStepper({ steps, currentStep }: OnboardingStepperProps) {
  return (
    <div>
      {/* Desktop */}
      <ol className="hidden md:flex items-start">
        {steps.map((label, i) => {
          const stepNumber = i + 1;
          const isComplete = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <li key={label} className="flex-1 flex items-center last:flex-none">
              <div className="flex flex-col items-center gap-2 min-w-[88px]">
                <span
                  className={clsx(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-colors",
                    isComplete && "bg-gold text-white",
                    isActive && "bg-charcoal text-white",
                    !isComplete && !isActive && "bg-charcoal/[0.06] text-ink-faint"
                  )}
                >
                  {isComplete ? <Check size={14} /> : stepNumber}
                </span>
                <span
                  className={clsx(
                    "text-[11px] text-center font-medium leading-tight",
                    isActive ? "text-charcoal" : "text-ink-faint"
                  )}
                >
                  {label}
                </span>
              </div>
              {stepNumber < steps.length && (
                <div className={clsx("h-px flex-1 mx-2 mt-[-20px]", isComplete ? "bg-gold" : "bg-line")} />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] font-medium text-charcoal">{steps[currentStep - 1]}</p>
          <p className="font-mono text-xs text-ink-faint">
            Step {currentStep} of {steps.length}
          </p>
        </div>
        <div className="h-1.5 rounded-full bg-charcoal/[0.06] overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
