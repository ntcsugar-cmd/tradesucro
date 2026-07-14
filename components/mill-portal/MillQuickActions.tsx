import Link from "next/link";
import { PackagePlus, Gavel, DollarSign, CalendarClock, Boxes } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";

const ACTIONS = [
  { label: "Create Offer", href: "/mill-offers/create", icon: PackagePlus, variant: "primary" as const },
  { label: "Create Tender", href: "/tenders/create", icon: Gavel, variant: "outline" as const },
  { label: "Update Today's Prices", href: "/price-board", icon: DollarSign, variant: "outline" as const },
  { label: "View Dispatch Calendar", href: "/dispatch-calendar", icon: CalendarClock, variant: "outline" as const },
  { label: "Inventory Summary", href: "/inventory", icon: Boxes, variant: "outline" as const },
];

export function MillQuickActions() {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
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
