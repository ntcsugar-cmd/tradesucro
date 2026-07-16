import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

/**
 * Button — the base action control for the design system.
 *
 * "gold", "charcoal", "ghost", "outline" are the original homepage-era
 * variant names and are kept as-is for backward compatibility.
 * "primary", "secondary", "danger", "success" are their design-system
 * aliases/additions — use these for all new work.
 * "subtle" and "outline-dark" were added in v0.2.1 to let previously
 * one-off, hand-styled controls (e.g. the navbar search trigger, the
 * dark-section quick-filter pills) standardize on <Button /> without
 * any visual change.
 */
type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "outline-dark"
  | "ghost"
  | "ghost-dark"
  | "subtle"
  | "danger"
  | "success"
  | "gold"
  | "charcoal";
type Size = "sm" | "md" | "lg";
type Rounded = "sm" | "full";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Corner radius token. Defaults to "sm" — every existing call site is unaffected. */
  rounded?: Rounded;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-gold text-white hover:bg-gold-bright active:bg-gold-dim shadow-button",
  gold: "bg-gold text-white hover:bg-gold-bright active:bg-gold-dim shadow-button",
  secondary: "bg-charcoal text-white hover:bg-charcoal-soft",
  charcoal: "bg-charcoal text-white hover:bg-charcoal-soft",
  outline: "bg-transparent text-charcoal border border-charcoal/20 hover:border-charcoal/40 dark:text-white dark:border-white/20 dark:hover:border-white/40",
  ghost: "bg-transparent text-charcoal hover:bg-charcoal/5 dark:text-white dark:hover:bg-white/5",
  danger: "bg-danger text-white hover:bg-danger-600 active:bg-danger-700",
  success: "bg-success text-white hover:bg-success-600 active:bg-success-700",
  /** Bordered, muted-label control — for secondary chrome like a nav search trigger. */
  subtle: "bg-transparent text-ink-soft border border-line hover:border-charcoal/30 hover:text-charcoal dark:text-white/60 dark:border-white/15 dark:hover:border-white/30 dark:hover:text-white",
  /** Same role as "outline", tuned for placement on a dark (charcoal) surface. */
  "outline-dark": "bg-transparent text-white/60 border border-white/15 hover:border-gold/50 hover:text-gold-bright",
  /** Same role as "ghost", tuned for placement on a dark (charcoal) surface — e.g. the sidebar collapse toggle. */
  "ghost-dark": "bg-transparent text-white/50 hover:bg-white/5 hover:text-white",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-xs px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-sm px-7 py-3.5",
};

const roundedStyles: Record<Rounded, string> = {
  sm: "rounded-sm",
  full: "rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "charcoal",
      size = "md",
      rounded = "sm",
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-body font-medium tracking-[0.01em] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          roundedStyles[rounded],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
