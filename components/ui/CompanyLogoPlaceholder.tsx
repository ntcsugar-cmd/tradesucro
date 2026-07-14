import clsx from "clsx";

interface CompanyLogoPlaceholderProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-9 w-9 text-[11px] rounded-sm",
  md: "h-12 w-12 text-sm rounded-sm",
  lg: "h-16 w-16 text-lg rounded-md",
};

/**
 * Fixed rotation of theme color tokens (gold, gold-dim, navy-800, navy-500,
 * gray-600 — see lib/theme.ts) used to deterministically tint a placeholder
 * tile. Expressed as Tailwind classes rather than inline hex so the palette
 * always tracks lib/theme.ts and nothing here is a hardcoded color.
 */
const TINT_CLASSES = ["bg-gold", "bg-gold-dim", "bg-navy-800", "bg-navy-500", "bg-gray-600"];

function tintClassFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TINT_CLASSES[hash % TINT_CLASSES.length];
}

function getMonogram(name: string) {
  const parts = name.replace(/(Pvt\.?|Ltd\.?|Co\.?|Industries|Mills)/gi, "").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** CompanyLogoPlaceholder — used across mill/buyer cards until a real logo is uploaded. */
export function CompanyLogoPlaceholder({ name, size = "md", className }: CompanyLogoPlaceholderProps) {
  return (
    <span
      className={clsx(
        "flex shrink-0 items-center justify-center font-display font-medium text-white",
        sizeStyles[size],
        tintClassFor(name),
        className
      )}
      aria-label={`${name} logo placeholder`}
    >
      {getMonogram(name)}
    </span>
  );
}
