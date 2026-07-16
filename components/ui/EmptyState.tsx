import { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-line dark:border-white/15 rounded-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal/[0.04] dark:bg-white/10 text-ink-faint dark:text-white/40">
        {icon ?? <Inbox size={20} />}
      </div>
      <h3 className="mt-5 font-body font-semibold text-[15px] text-charcoal dark:text-white">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-[13.5px] text-ink-soft dark:text-white/50 leading-relaxed">{description}</p>}
      {action && (
        <Button variant="outline" size="sm" className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
