import Link from "next/link";
import { Package, Tags, ArrowRight, Truck, Building2, Database } from "lucide-react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/cards/Card";

const MASTER_DATA_LINKS = [
  { label: "Product Master", description: "The sugar product categories every offer, requirement, and filter draws from.", href: "/admin/products", icon: Package },
  { label: "Grade Master", description: "Every sugar grade traded on TradeSucro, with market classification and product applicability.", href: "/admin/grades", icon: Tags },
  { label: "Freight Coordination", description: "All freight requests, quote comparison, and quote approval — TradeSucro's transport coordination desk.", href: "/admin/freight", icon: Truck },
  { label: "Transporter Directory", description: "Every transporter company in TradeSucro's network, their coverage, fleet types, and verification status.", href: "/admin/transporters", icon: Building2 },
];

const SYSTEM_LINKS = [
  { label: "Market Data Providers", description: "Connection health, sync history, and diagnostics for every Market Intelligence data source.", href: "/admin/system/market-data-providers", icon: Database },
];

export default function AdminDashboardPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Admin" }]} className="mb-5" />
      <PageHeader title="Admin Workspace" description="Platform oversight, verification, and governance — starting with the Master Data every module depends on." />

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {MASTER_DATA_LINKS.map(({ label, description, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card padding="lg" interactive className="h-full">
              <CardBody className="flex h-full flex-col">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold/10 text-gold-dim">
                  <Icon size={17} />
                </span>
                <p className="mt-3 text-[14px] font-semibold text-charcoal dark:text-white">{label}</p>
                <p className="mt-1 text-[13px] text-ink-soft dark:text-white/50 leading-relaxed flex-1">{description}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-medium text-gold-dim">
                  Manage <ArrowRight size={12} />
                </span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="text-[13px] font-semibold text-charcoal dark:text-white mb-3">System</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {SYSTEM_LINKS.map(({ label, description, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card padding="lg" interactive className="h-full">
              <CardBody className="flex h-full flex-col">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold/10 text-gold-dim">
                  <Icon size={17} />
                </span>
                <p className="mt-3 text-[14px] font-semibold text-charcoal dark:text-white">{label}</p>
                <p className="mt-1 text-[13px] text-ink-soft dark:text-white/50 leading-relaxed flex-1">{description}</p>
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
