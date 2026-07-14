import clsx from "clsx";
import { PriceDelta } from "@/components/common/PriceDelta";
import { Sparkline } from "@/components/charts/Sparkline";
import { formatINR } from "@/lib/utils/format";

interface MarketPriceCardProps {
  grade: string;
  region: string;
  price: number;
  unit?: string;
  change: number;
  direction: "up" | "down" | "flat";
  sparkline?: number[];
  className?: string;
}

/** MarketPriceCard — the standard price tile used on the market dashboard and anywhere prices are surfaced. */
export function MarketPriceCard({
  grade,
  region,
  price,
  unit = "per quintal",
  change,
  direction,
  sparkline,
  className,
}: MarketPriceCardProps) {
  return (
    <div className={clsx("bg-white border border-line p-6 hover:border-gold/40 transition-colors", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-body font-medium text-[15px] text-charcoal">{grade}</p>
          <p className="text-xs text-ink-faint mt-0.5">{region}</p>
        </div>
        <PriceDelta change={change} direction={direction} />
      </div>

      <p className="mt-5 font-mono text-[28px] leading-none text-charcoal">
        {formatINR(price)}
      </p>
      <p className="text-[11px] text-ink-faint mt-1">{unit}</p>

      {sparkline && (
        <div className="mt-5">
          <Sparkline data={sparkline} direction={direction} />
        </div>
      )}
    </div>
  );
}
