import { ArrowRight } from "lucide-react";
import { Input } from "@/components/forms/Input";
import { IconButton } from "@/components/ui/IconButton";

const COLUMNS = [
  {
    title: "Marketplace",
    links: ["Sell offers", "Buy requirements", "Market dashboard", "Post an offer"],
  },
  {
    title: "Company",
    links: ["About TradeSucro", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Industry insights", "Mills directory", "API for traders", "Help center"],
  },
  {
    title: "Legal",
    links: ["Terms of service", "Privacy policy", "Escrow & settlement", "Compliance"],
  },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/70">
      <div className="container-page py-16">
        <div className="grid lg:grid-cols-[1.3fr_2fr] gap-12">
          <div>
            <span className="font-display text-2xl font-semibold text-white">TradeSucro</span>
            <p className="mt-4 text-sm leading-relaxed text-white/45 max-w-xs">
              India&rsquo;s digital marketplace for sugar mills, traders, and buyers —
              verified counterparties, live pricing, escrow-backed settlement.
            </p>

            <form className="mt-6 flex items-center gap-2 max-w-sm">
              <Input
                type="email"
                variant="dark"
                size="md"
                placeholder="you@company.com"
                className="flex-1"
              />
              <IconButton
                type="submit"
                variant="primary"
                size="md"
                aria-label="Subscribe to market updates"
              >
                <ArrowRight size={16} />
              </IconButton>
            </form>
            <p className="mt-2 text-[11px] text-white/30">
              Weekly market prices, no spam.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-mono uppercase tracking-widest2 text-white/40 mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-white/60 hover:text-gold-bright transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} TradeSucro Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/35 font-mono">
            Registered with the Ministry of Commerce &amp; Industry, Govt. of India
          </p>
        </div>
      </div>
    </footer>
  );
}
