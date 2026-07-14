import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Direction } from "@/lib/types";
import { formatPercent } from "@/lib/utils/format";

interface PriceDeltaProps {
  change: number;
  direction: Direction;
  className?: string;
}

export function PriceDelta({ change, direction, className }: PriceDeltaProps) {
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const color =
    direction === "up" ? "text-rise" : direction === "down" ? "text-fall" : "text-ink-faint";

  return (
    <span className={clsx("inline-flex items-center gap-0.5 font-mono text-xs", color, className)}>
      <Icon size={13} strokeWidth={2.25} />
      {formatPercent(change)}
    </span>
  );
}
