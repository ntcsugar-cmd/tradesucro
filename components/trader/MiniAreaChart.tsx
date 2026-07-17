import { colors } from "@/lib/theme";

interface MiniAreaChartProps {
  points: { label: string; value: number }[];
  height?: number;
}

/** MiniAreaChart — a lightweight SVG area/line chart, built from the same theme tokens as the rest of the app. Presentational only: it renders whatever points it's given, it doesn't fetch or compute anything. */
export function MiniAreaChart({ points, height = 140 }: MiniAreaChartProps) {
  if (points.length < 2) {
    return <p className="text-[13px] text-ink-faint dark:text-white/40 italic">Not enough data to chart yet.</p>;
  }

  const width = 100;
  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(0, ...values);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p.value - min) / range) * (height - 16) - 8;
    return { x, y };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="trader-trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.gold.DEFAULT} stopOpacity="0.22" />
            <stop offset="100%" stopColor={colors.gold.DEFAULT} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trader-trend-fill)" stroke="none" />
        <path d={linePath} fill="none" stroke={colors.gold.DEFAULT} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="1.4" fill={colors.gold.DEFAULT} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {points.map((p) => (
          <span key={p.label} className="font-mono text-[10px] text-ink-faint dark:text-white/40">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
