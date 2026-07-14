import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
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
  outline: "bg-transparent text-charcoal border border-charcoal/20 hover:border-charcoal/40",
  ghost: "bg-transparent text-charcoal hover:bg-charcoal/5",
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
