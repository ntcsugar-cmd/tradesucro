import { Check } from "lucide-react";

const STAGES = ["Ordered", "Confirmed", "Payment", "Dispatch", "Transit", "Delivered"] as const;

interface MobileOrderTimelineProps {
  currentStageIndex: number;
  cancelled?: boolean;
  stageDates?: Partial<Record<(typeof STAGES)[number], string>>;
}

/** MobileOrderTimeline — the vertical Ordered→Delivered timeline for a customer order, sized for a phone screen (one column, generous touch/read spacing). */
export function MobileOrderTimeline({ currentStageIndex, cancelled = false, stageDates }: MobileOrderTimelineProps) {
  if (cancelled) {
    return (
      <div className="rounded-sm border border-fall/30 bg-fall/[0.05] p-4 text-center">
        <p className="text-[13px] font-medium text-fall">This order was cancelled</p>
      </div>
    );
  }

  return (
    <ol className="relative ml-2 border-l-2 border-line dark:border-white/10 space-y-6">
      {STAGES.map((stage, i) => {
        const done = i <= currentStageIndex;
        const isCurrent = i === currentStageIndex;
        return (
          <li key={stage} className="pl-6 relative">
            <span
              className={`absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                done ? "border-rise bg-rise text-white" : "border-line dark:border-white/15 bg-white dark:bg-charcoal-soft text-ink-faint dark:text-white/40"
              }`}
            >
              {done ? <Check size={13} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            <p className={`text-[14px] ${isCurrent ? "font-semibold text-charcoal dark:text-white" : done ? "font-medium text-charcoal dark:text-white" : "text-ink-faint dark:text-white/40"}`}>{stage}</p>
            {stageDates?.[stage] && <p className="text-[11px] text-ink-faint dark:text-white/40 mt-0.5">{stageDates[stage]}</p>}
          </li>
        );
      })}
    </ol>
  );
}
