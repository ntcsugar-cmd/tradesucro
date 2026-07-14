import { Card } from "@/components/cards/Card";
import { Avatar } from "@/components/ui/Avatar";

interface WelcomeCardProps {
  userName: string;
  companyName: string;
  businessTypeLabel: string;
}

/**
 * WelcomeCard — the dashboard's greeting header card.
 *
 * Uses Card with padding="none" and an inner full-bleed panel for the dark
 * treatment, rather than overriding Card's own bg-white via className —
 * Card's utility classes and a className override can conflict depending
 * on Tailwind's generated stylesheet order, so we add a new element
 * instead of fighting Card's defaults (same approach already used in the
 * design-system Card demo).
 */
export function WelcomeCard({ userName, companyName, businessTypeLabel }: WelcomeCardProps) {
  const firstName = userName.split(" ")[0];

  return (
    <Card padding="none">
      <div className="flex items-center gap-4 bg-charcoal p-8 rounded-sm">
        <Avatar name={userName} size="lg" />
        <div>
          <p className="font-display text-xl font-medium text-white">Welcome back, {firstName}</p>
          <p className="mt-1 text-[13px] text-white/50">
            {companyName} · <span className="font-mono">{businessTypeLabel}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
