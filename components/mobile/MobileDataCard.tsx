"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardBody } from "@/components/cards/Card";

export interface MobileDataCardField {
  label: string;
  value: ReactNode;
  secondary?: boolean;
}

interface MobileDataCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  fields: MobileDataCardField[];
  footer?: ReactNode;
  onClick?: () => void;
}

/**
 * MobileDataCard — one row of a desktop DataTable, reshaped as an
 * accordion card: title + badge always visible, primary fields always
 * visible, secondary fields behind "Show more". This is the pattern
 * table-heavy pages convert to on mobile instead of horizontal scroll.
 */
export function MobileDataCard({ title, subtitle, badge, fields, footer, onClick }: MobileDataCardProps) {
  const [expanded, setExpanded] = useState(false);
  const primary = fields.filter((f) => !f.secondary);
  const secondary = fields.filter((f) => f.secondary);

  return (
    <Card padding="none" interactive={!!onClick} onClick={onClick}>
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-charcoal dark:text-white truncate">{title}</p>
            {subtitle && <p className="text-[12px] text-ink-faint dark:text-white/40 mt-0.5 truncate">{subtitle}</p>}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {primary.map((f) => (
            <div key={f.label}>
              <dt className="text-[11px] text-ink-faint dark:text-white/40">{f.label}</dt>
              <dd className="text-[13px] font-medium text-charcoal dark:text-white mt-0.5">{f.value}</dd>
            </div>
          ))}
        </dl>

        {secondary.length > 0 && (
          <>
            {expanded && (
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-line dark:border-white/10">
                {secondary.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[11px] text-ink-faint dark:text-white/40">{f.label}</dt>
                    <dd className="text-[13px] font-medium text-charcoal dark:text-white mt-0.5">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
              className="mt-2.5 flex items-center gap-1 text-[12px] font-medium text-gold-dim"
            >
              {expanded ? "Show less" : "Show more"} <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </>
        )}

        {footer && <div className="mt-3 pt-3 border-t border-line dark:border-white/10">{footer}</div>}
      </CardBody>
    </Card>
  );
}
