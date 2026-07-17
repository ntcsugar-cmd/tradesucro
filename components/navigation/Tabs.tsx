"use client";

import { useState, ReactNode } from "react";
import clsx from "clsx";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: (activeTab: string) => ReactNode;
}

/** Tabs — controlled or uncontrolled; pass render-prop `children` for the active panel. */
export function Tabs({ tabs, defaultValue, value, onChange, children }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.value);
  const active = value ?? internal;

  const select = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  return (
    <div>
      <div role="tablist" className="flex items-center gap-1 border-b border-line dark:border-white/10 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active === tab.value}
            disabled={tab.disabled}
            onClick={() => select(tab.value)}
            className={clsx(
              "relative flex items-center gap-1.5 px-4 py-3 text-[13.5px] font-medium whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
              active === tab.value ? "text-charcoal dark:text-white" : "text-ink-faint dark:text-white/40 hover:text-charcoal dark:hover:text-white"
            )}
          >
            {tab.icon}
            {tab.label}
            {active === tab.value && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-gold" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">{children(active)}</div>
    </div>
  );
}
