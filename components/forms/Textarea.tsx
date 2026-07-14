import { TextareaHTMLAttributes, forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: "default" | "dark";
}

const variantStyles = {
  default:
    "border bg-white text-charcoal placeholder:text-ink-faint focus:border-gold/60 focus:ring-2 focus:ring-gold/15",
  dark: "border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-gold/50 focus:ring-2 focus:ring-gold/10",
};

/**
 * Textarea — multi-line counterpart to Input, for fields like a full
 * postal address. Same label/error/helperText contract as Input so forms
 * mixing both feel identical.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, variant = "default", className, id, rows = 3, ...props }, ref) => {
    const autoId = useId();
    const textareaId = id ?? autoId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-[13px] font-medium text-charcoal mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          className={clsx(
            "w-full rounded-sm font-body text-sm outline-none transition-colors py-2.5 px-3.5 resize-y",
            variantStyles[variant],
            variant === "default" && (error ? "border-danger/60" : "border-line"),
            className
          )}
          {...props}
        />
        {error ? (
          <p id={`${textareaId}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle size={12} /> {error}
          </p>
        ) : helperText ? (
          <p id={`${textareaId}-helper`} className="mt-1.5 text-xs text-ink-faint">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
