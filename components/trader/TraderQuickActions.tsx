import Link from "next/link";
import { ShoppingCart, Store, Gavel, Handshake, PhoneCall } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";

const ACTIONS = [
  { label: "Buy Sugar", href: "/trader/purchases/create", icon: ShoppingCart, variant: "primary" as const },
  { label: "View Marketplace", href: "/marketplace", icon: Store, variant: "outline" as const },
  { label: "Join Tender", href: "/market/live", icon: Gavel, variant: "outline" as const },
  { label: "Create Deal", href: "/deals/create", icon: Handshake, variant: "outline" as const },
  { label: "Contact Supplier", href: "/trader/suppliers", icon: PhoneCall, variant: "outline" as const },
];

export function TraderQuickActions() {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <span className="text-xs text-ink-faint">Jump straight into the next step</span>
      </CardHeader>
      <CardBody className="flex flex-wrap gap-2.5">
        {ACTIONS.map(({ label, href, icon: Icon, variant }) => (
          <Link key={href} href={href}>
            <Button variant={variant} size="sm">
              <Icon size={14} /> {label}
            </Button>
          </Link>
        ))}
      </CardBody>
    </Card>
  );
}
