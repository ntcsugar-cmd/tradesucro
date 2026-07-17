"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const autoId = useId();
    const radioId = id ?? autoId;

    return (
      <label htmlFor={radioId} className="flex items-start gap-2.5 cursor-pointer select-none">
        <span className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className={clsx(
              "peer h-[18px] w-[18px] appearance-none rounded-full border border-charcoal/25 bg-white transition-colors",
              "dark:border-white/25 dark:bg-white/5",
              "checked:border-[5.5px] checked:border-gold",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
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
Radio.displayName = "Radio";

interface RadioGroupOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name?: string;
  legend?: string;
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
}

/** RadioGroup — wires a fieldset of Radio controls to a single selected value. */
export function RadioGroup({
  name,
  legend,
  options,
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;

  return (
    <fieldset>
      {legend && <legend className="text-[13px] font-medium text-charcoal dark:text-white mb-2.5">{legend}</legend>}
      <div className={clsx("flex gap-4", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap")}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={groupName}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
            checked={value !== undefined ? value === opt.value : undefined}
            defaultChecked={value === undefined ? defaultValue === opt.value : undefined}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}
