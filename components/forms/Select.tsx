"use client";

import { ReactNode, SelectHTMLAttributes, forwardRef, useId } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import clsx from "clsx";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  /** Same visual treatments as Input — see components/ui/Input.tsx for details. */
  variant?: "default" | "ghost" | "dark";
  options: SelectOption[];
  placeholder?: string;
  leadingIcon?: ReactNode;
  /** Applied to each <option> — needed on dark surfaces since native option popups don't inherit page theme. */
  optionClassName?: string;
}

const sizeStyles = {
  sm: "h-9 text-[13px] pl-3 pr-8",
  md: "h-11 text-sm pl-3.5 pr-9",
  lg: "h-12 text-[15px] pl-4 pr-10",
};

const variantStyles = {
  default:
    "border bg-white text-charcoal focus:border-gold/60 focus:ring-2 focus:ring-gold/15 dark:bg-white/5 dark:text-white dark:focus:border-gold/50 dark:focus:ring-gold/10",
  ghost: "border-none focus:ring-0 text-charcoal dark:text-white",
  dark: "border border-white/10 bg-white/5 text-white focus:border-gold/50 focus:ring-2 focus:ring-gold/10",
};

const chevronColor = {
  default: "text-ink-faint dark:text-white/40",
  ghost: "text-current opacity-60",
  dark: "text-white/35",
};

/**
 * Select (Dropdown) — wraps a native <select> for full accessibility and
 * mobile behavior, styled to match the rest of the input family.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      size = "md",
      variant = "default",
      options,
      placeholder,
      leadingIcon,
      optionClassName,
      className,
      id,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-[13px] font-medium text-charcoal dark:text-white mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className={clsx("absolute left-3.5 pointer-events-none z-10", variant === "default" ? "text-ink-faint dark:text-white/40" : "text-current opacity-60")}>
              {leadingIcon}
            </span>
          )}
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            defaultValue={defaultValue ?? ""}
            className={clsx(
              "w-full appearance-none rounded-sm font-body outline-none transition-colors",
              variantStyles[variant],
              variant === "default" && (error ? "border-danger/60" : "border-line dark:border-white/15"),
              leadingIcon && "pl-10",
              sizeStyles[size],
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className={optionClassName}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className={optionClassName}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className={clsx("pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2", chevronColor[variant])}
          />
        </div>
        {error ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger dark:text-danger-300">
            <AlertCircle size={12} /> {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-ink-faint dark:text-white/40">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
