import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizeMap = { sm: 16, md: 22, lg: 32 };

export function Spinner({ size = "md", label, className }: SpinnerProps) {
  return (
    <div role="status" className={clsx("inline-flex items-center gap-2.5 text-gold-dim", className)}>
      <Loader2 size={sizeMap[size]} className="animate-spin" />
      {label && <span className="text-[13px] text-ink-soft">{label}</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
