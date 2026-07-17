import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

/**
 * IconButton — the icon-only counterpart to Button, same variant
 * philosophy: "ghost"/"outline"/"primary"/"secondary"/"danger" adapt
 * automatically to system dark mode via dark: classes; "ghost-dark"/
 * "outline-dark" are for controls placed on an always-dark surface
 * (the mobile drawer's close button, TopNav icons) regardless of the
 * system theme — mirrors components/ui/Button.tsx's variant set so
 * the two controls never drift out of sync again.
 */
type Variant = "primary" | "secondary" | "outline" | "outline-dark" | "ghost" | "ghost-dark" | "danger";
type Size = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Required — icon buttons must be labeled for assistive tech. */
  "aria-label": string;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-gold text-white hover:bg-gold-bright",
  secondary: "bg-charcoal text-white hover:bg-charcoal-soft",
  outline: "bg-transparent text-charcoal border border-charcoal/20 hover:border-charcoal/40 dark:text-white dark:border-white/20 dark:hover:border-white/40",
  /** Same role as "outline", tuned for placement on a dark (charcoal) surface regardless of system theme. */
  "outline-dark": "bg-transparent text-white/60 border border-white/15 hover:border-gold/50 hover:text-gold-bright",
  ghost: "bg-transparent text-charcoal hover:bg-charcoal/5 dark:text-white dark:hover:bg-white/5",
  /** Same role as "ghost", tuned for placement on a dark (charcoal) surface regardless of system theme — e.g. the mobile drawer's close button. */
  "ghost-dark": "bg-transparent text-white/50 hover:bg-white/5 hover:text-white",
  danger: "bg-danger text-white hover:bg-danger-600",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "outline", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex shrink-0 items-center justify-center rounded-sm transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
