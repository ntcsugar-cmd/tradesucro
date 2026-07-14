import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** PageHeader — the standard title block for any dashboard page's content area. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-2xl sm:text-[28px] font-medium text-charcoal dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-ink-soft dark:text-white/50 max-w-xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
