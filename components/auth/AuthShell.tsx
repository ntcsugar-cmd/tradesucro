import { ReactNode } from "react";
import { Card, CardBody } from "@/components/cards/Card";

interface AuthShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Widen the card for forms with more fields (e.g. register). */
  wide?: boolean;
}

/**
 * AuthShell — the shared frame for /login, /register, /forgot-password,
 * /reset-password, /verify-email, /verify-mobile. Built entirely from the
 * existing Card primitive and design tokens — no new visual language.
 */
export function AuthShell({ eyebrow, title, description, children, footer, wide = false }: AuthShellProps) {
  return (
    <div className={wide ? "w-full max-w-md" : "w-full max-w-sm"}>
      <Card padding="lg" className="shadow-card">
        <CardBody>
          {eyebrow && <p className="text-eyebrow mb-3">{eyebrow}</p>}
          <h1 className="font-display text-2xl font-medium text-charcoal">{title}</h1>
          {description && <p className="mt-2 text-[13.5px] text-ink-soft leading-relaxed">{description}</p>}
          <div className="mt-7">{children}</div>
        </CardBody>
      </Card>
      {footer && <div className="mt-6 text-center text-[13px] text-ink-soft">{footer}</div>}
    </div>
  );
}
