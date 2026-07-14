import { tickerItems } from "@/lib/data";
import { PriceDelta } from "@/components/common/PriceDelta";
import { formatINR } from "@/lib/utils/format";

export function TickerTape() {
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="relative overflow-hidden bg-charcoal border-b border-charcoal-faint">
      <div className="flex w-max animate-marquee py-2.5 motion-reduce:animate-none">
        {doubled.map((item, i) => (
          <div
            key={`${item.symbol}-${i}`}
            className="flex items-center gap-2.5 px-6 whitespace-nowrap border-r border-white/[0.07]"
          >
            <span className="font-mono text-[11px] text-gold-bright tracking-wide">
              {item.symbol}
            </span>
            <span className="font-mono text-[11px] text-white/50">{item.label}</span>
            <span className="font-mono text-[13px] text-white">
              {formatINR(item.price)}
            </span>
            <PriceDelta change={item.change} direction={item.direction} />
          </div>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-charcoal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-charcoal to-transparent" />
    </div>
  );
}
