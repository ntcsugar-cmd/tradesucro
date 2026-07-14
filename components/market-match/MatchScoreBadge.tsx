import { Badge } from "@/components/common/Badge";

interface MatchScoreBadgeProps {
  score: number;
}

function scoreTone(score: number): { bg: string; text: string; label: string } {
  if (score >= 80) return { bg: "bg-rise/10", text: "text-rise", label: "Excellent" };
  if (score >= 60) return { bg: "bg-gold/10", text: "text-gold-dim", label: "Good" };
  if (score >= 40) return { bg: "bg-warning-100", text: "text-warning-600", label: "Fair" };
  return { bg: "bg-fall/10", text: "text-fall", label: "Weak" };
}

export function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  const tone = scoreTone(score);
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-[13px] font-semibold ${tone.bg} ${tone.text}`}>{score}</span>
      <span className={`text-[11px] font-medium ${tone.text}`}>{tone.label}</span>
    </div>
  );
}

export function MatchReasonsList({ reasons }: { reasons: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {reasons.slice(0, 3).map((reason) => (
        <Badge key={reason} tone="charcoal">
          {reason}
        </Badge>
      ))}
      {reasons.length > 3 && <span className="text-[11px] text-ink-faint">+{reasons.length - 3} more</span>}
    </div>
  );
}
