"use client";

import { ButtonHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

interface ToggleSwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: "sm" | "md";
}

const trackSize = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
};

const thumbSize = {
  sm: "h-3.5 w-3.5",
  md: "h-4.5 w-4.5",
};

export const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  ({ checked, onChange, label, description, size = "md", disabled, id, className, ...props }, ref) => {
    const autoId = useId();
    const toggleId = id ?? autoId;

    const switchEl = (
      <button
        ref={ref}
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          checked ? "bg-gold" : "bg-charcoal/20 dark:bg-white/20",
          trackSize[size],
          className
        )}
        {...props}
      >
        <span
          className={clsx(
            "inline-block transform rounded-full bg-white shadow-sm transition-transform duration-200",
            thumbSize[size],
            checked ? (size === "sm" ? "translate-x-[18px]" : "translate-x-[22px]") : "translate-x-[3px]"
          )}
        />
      </button>
    );

    if (!label && !description) return switchEl;

    return (
      <div className="flex items-start justify-between gap-4">
        <label htmlFor={toggleId} className="cursor-pointer">
          {label && <span className="block text-[13.5px] font-medium text-charcoal dark:text-white">{label}</span>}
          {description && <span className="block text-xs text-ink-faint dark:text-white/40 mt-0.5">{description}</span>}
        </label>
        {switchEl}
      </div>
    );
  }
);

ToggleSwitch.displayName = "ToggleSwitch";
