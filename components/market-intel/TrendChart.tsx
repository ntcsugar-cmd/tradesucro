import { colors } from "@/lib/theme";
import { formatINR } from "@/lib/utils/format";
import type { TrendPoint } from "@/lib/types/marketIntelligence";

interface TrendChartProps {
  points: TrendPoint[];
  height?: number;
}

/** TrendChart — a readable line+area chart for the Price Movement Graph, built from theme tokens rather than a hardcoded color. */
export function TrendChart({ points, height = 220 }: TrendChartProps) {
  if (points.length < 2) {
    return <p className="text-[13px] text-ink-faint italic">Not enough data to chart yet.</p>;
  }

  const width = 100;
  const values = points.map((p) => p.averagePrice);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p.averagePrice - min) / range) * (height - 20) - 10;
    return { x, y };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  const first = points[0];
  const last = points[points.length - 1];
  const trendingUp = last.averagePrice >= first.averagePrice;
  const stroke = trendingUp ? colors.rise : colors.fall;

  return (
    <div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="font-mono text-2xl text-charcoal">{formatINR(last.averagePrice)}</p>
          <p className="text-xs text-ink-faint mt-0.5">
            {new Date(first.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} –{" "}
            {new Date(last.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
          </p>
        </div>
        <p className={`font-mono text-sm ${trendingUp ? "text-rise" : "text-fall"}`}>
          {trendingUp ? "+" : ""}
          {formatINR(last.averagePrice - first.averagePrice)}
        </p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trend-fill)" stroke="none" />
        <path d={linePath} fill="none" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="flex justify-between text-[11px] font-mono text-ink-faint mt-2">
        <span>{formatINR(min)}</span>
        <span>{formatINR(max)}</span>
      </div>
    </div>
  );
}
