import { colors } from "@/lib/theme";

export type SparklineDirection = "up" | "down" | "flat";

interface SparklineProps {
  data: number[];
  direction: SparklineDirection;
  className?: string;
}

const STROKE_BY_DIRECTION: Record<SparklineDirection, string> = {
  up: colors.rise,
  down: colors.fall,
  flat: colors.gold.DEFAULT,
};

/**
 * Sparkline — a minimal inline trend line for a series of price points.
 * Used by the market dashboard cards and the reusable MarketPriceCard.
 */
export function Sparkline({ data, direction, className }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 32 - ((v - min) / (max - min || 1)) * 32;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className ?? "h-8 w-full"}>
      <polyline
        points={points}
        fill="none"
        stroke={STROKE_BY_DIRECTION[direction]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
