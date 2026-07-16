"use client";

import { InputHTMLAttributes, forwardRef, useEffect, useId, useImperativeHandle, useRef } from "react";
import { Check, Minus } from "lucide-react";
import clsx from "clsx";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate = false, className, id, ...props }, forwardedRef) => {
    const autoId = useId();
    const checkboxId = id ?? autoId;
    const innerRef = useRef<HTMLInputElement>(null);

    // Exposes the same DOM node to the forwarded ref, without ever writing
    // to forwardedRef.current directly — RefObject's .current is readonly
    // from the consumer's side; useImperativeHandle is the hook React
    // provides specifically for this "forward a ref while also keeping an
    // internal ref" case, so it always handles both the callback-ref and
    // object-ref forms correctly.
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement, []);

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label htmlFor={checkboxId} className="flex items-start gap-2.5 cursor-pointer select-none group">
        <span className="relative flex items-center justify-center mt-0.5">
          <input
            ref={innerRef}
            type="checkbox"
            id={checkboxId}
            className={clsx(
              "peer h-[18px] w-[18px] appearance-none rounded-[3px] border border-charcoal/25 bg-white transition-colors",
              "dark:border-white/25 dark:bg-white/5",
              "checked:bg-gold checked:border-gold",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          <Check
            size={13}
            strokeWidth={3}
            className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity"
          />
          {indeterminate && (
            <Minus size={11} strokeWidth={3} className="pointer-events-none absolute text-white" />
          )}
        </span>
        {(label || description) && (
          <span>
            {label && <span className="block text-[13.5px] font-medium text-charcoal dark:text-white">{label}</span>}
            {description && <span className="block text-xs text-ink-faint dark:text-white/40 mt-0.5">{description}</span>}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
