"use client";

import { InputHTMLAttributes, forwardRef, useId, useState } from "react";
import { Eye, EyeOff, Search as SearchIcon, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  /**
   * Visual treatment. "default" is the standard bordered white field used in
   * forms. "ghost" strips border/background entirely (for embedding inside a
   * toolbar that already provides its own chrome). "dark" is a translucent
   * bordered field for placement on a charcoal surface.
   */
  variant?: "default" | "ghost" | "dark";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const sizeStyles = {
  sm: "h-9 text-[13px] px-3",
  md: "h-11 text-sm px-3.5",
  lg: "h-12 text-[15px] px-4",
};

const variantStyles = {
  default:
    "border bg-white text-charcoal placeholder:text-ink-faint focus:border-gold/60 focus:ring-2 focus:ring-gold/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus:border-gold/50 dark:focus:ring-gold/10",
  ghost: "border-none focus:ring-0 text-charcoal dark:text-white",
  dark: "border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-gold/50 focus:ring-2 focus:ring-gold/10",
};

/**
 * Input — the base control every typed field variant below builds on.
 * Exposed directly for any input type not covered by a named variant.
 */
export const Input = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    { label, helperText, error, size = "md", variant = "default", leadingIcon, trailingIcon, className, id, ...props },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-medium text-charcoal dark:text-white mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className={clsx("absolute left-3.5 pointer-events-none", variant === "default" ? "text-ink-faint dark:text-white/40" : "text-current opacity-60")}>
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={clsx(
              "w-full rounded-sm font-body outline-none transition-colors",
              variantStyles[variant],
              variant === "default" && (error ? "border-danger/60" : "border-line dark:border-white/15"),
              leadingIcon && "pl-10",
              trailingIcon && "pr-10",
              sizeStyles[size],
              className
            )}
            {...props}
          />
          {trailingIcon && (
            <span className={clsx("absolute right-3.5", variant === "default" ? "text-ink-faint dark:text-white/40" : "text-current")}>
              {trailingIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-danger dark:text-danger-300">
            <AlertCircle size={12} /> {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-ink-faint dark:text-white/40">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

/** TextInput — plain single-line text field. */
export const TextInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => (
  <Input ref={ref} type="text" {...props} />
));
TextInput.displayName = "TextInput";

/** EmailInput — text field constrained to email input mode/validation. */
export const EmailInput = forwardRef<HTMLInputElement, BaseInputProps>(({ placeholder, ...props }, ref) => (
  <Input ref={ref} type="email" inputMode="email" autoComplete="email" placeholder={placeholder ?? "you@company.com"} {...props} />
));
EmailInput.displayName = "EmailInput";

/** PasswordInput — masked field with a visibility toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      trailingIcon={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="pointer-events-auto text-ink-faint hover:text-charcoal transition-colors"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

/** SearchInput — leading search glyph, rounded for use in search bars/toolbars. */
export const SearchInput = forwardRef<HTMLInputElement, BaseInputProps>(({ placeholder, ...props }, ref) => (
  <Input
    ref={ref}
    type="search"
    placeholder={placeholder ?? "Search…"}
    leadingIcon={<SearchIcon size={16} />}
    {...props}
  />
));
SearchInput.displayName = "SearchInput";

/** NumberInput — numeric field, optionally with a unit suffix (e.g. "MT", "₹"). */
interface NumberInputProps extends BaseInputProps {
  unit?: string;
}
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ unit, ...props }, ref) => (
    <Input
      ref={ref}
      type="number"
      inputMode="numeric"
      trailingIcon={unit ? <span className="font-mono text-xs text-ink-faint">{unit}</span> : undefined}
      {...props}
    />
  )
);
NumberInput.displayName = "NumberInput";
