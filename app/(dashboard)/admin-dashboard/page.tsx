import Link from "next/link";
import { Package, Tags, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";

const MASTER_DATA_LINKS = [
  { label: "Product Master", description: "The sugar product categories every offer, requirement, and filter draws from.", href: "/admin/products", icon: Package },
  { label: "Grade Master", description: "Every sugar grade traded on TradeSucro, with market classification and product applicability.", href: "/admin/grades", icon: Tags },
];

export default function AdminDashboardPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Admin" }]} className="mb-5" />
      <PageHeader title="Admin Workspace" description="Platform oversight, verification, and governance — starting with the Master Data every module depends on." />

      <div className="grid sm:grid-cols-2 gap-4">
        {MASTER_DATA_LINKS.map(({ label, description, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card padding="lg" interactive className="h-full">
              <CardBody className="flex h-full flex-col">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold/10 text-gold-dim">
                  <Icon size={17} />
                </span>
                <p className="mt-3 text-[14px] font-semibold text-charcoal">{label}</p>
                <p className="mt-1 text-[13px] text-ink-soft leading-relaxed flex-1">{description}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-medium text-gold-dim">
                  Manage <ArrowRight size={12} />
                </span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
