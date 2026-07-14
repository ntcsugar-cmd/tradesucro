import { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { IconButton } from "@/components/ui/IconButton";

interface DashboardWidgetProps {
  title: string;
  description?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** DashboardWidget — the shell every dashboard module (charts, lists, feeds) should render inside. */
export function DashboardWidget({ title, description, action, footer, children, className }: DashboardWidgetProps) {
  return (
    <div className={clsx("bg-white border border-line flex flex-col", className)}>
      <div className="flex items-start justify-between gap-4 p-5 border-b border-line">
        <div>
          <h3 className="font-body font-semibold text-[14.5px] text-charcoal">{title}</h3>
          {description && <p className="text-xs text-ink-faint mt-0.5">{description}</p>}
        </div>
        {action ?? <IconButton variant="ghost" size="sm" aria-label="Widget options"><MoreHorizontal size={16} /></IconButton>}
      </div>

      <div className="p-5 flex-1">{children}</div>

      {footer && <div className="px-5 py-3.5 border-t border-line bg-charcoal/[0.02]">{footer}</div>}
    </div>
  );
}
