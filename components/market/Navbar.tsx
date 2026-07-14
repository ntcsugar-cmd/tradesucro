"use client";

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { MARKETING_NAV_LINKS } from "@/lib/constants/navigation";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md">
      <div className="hairline" />
      <div className="container-page flex h-[72px] items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display text-[22px] font-semibold tracking-tight text-charcoal">
            TradeSucro
          </span>
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest2 text-gold-dim">
            Sugar Exchange
          </span>
        </a>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center gap-9">
          {MARKETING_NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13.5px] font-medium text-charcoal/75 hover:text-charcoal transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="hidden lg:flex items-center gap-5">
          <Button variant="subtle" size="sm" aria-label="Search TradeSucro">
            <Search size={15} />
            <span className="text-xs font-mono text-ink-faint">Search offers…</span>
          </Button>
          <a href="#login" className="text-[13.5px] font-medium text-charcoal/75 hover:text-charcoal transition-colors">
            Log in
          </a>
          <a href="#register" className="text-[13.5px] font-medium text-charcoal/75 hover:text-charcoal transition-colors">
            Register
          </a>
          <Button variant="gold" size="sm">
            Post Offer
          </Button>
        </div>

        {/* Mobile toggle */}
        <IconButton
          variant="ghost"
          size="sm"
          className="lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </IconButton>
      </div>
      <div className="hairline" />

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-paper border-b border-line">
          <div className="container-page flex flex-col gap-1 py-4">
            {MARKETING_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-2.5 text-sm font-medium text-charcoal/80"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-3 mt-2 border-t border-line">
              <a href="#login" className="text-sm font-medium text-charcoal/75">
                Log in
              </a>
              <a href="#register" className="text-sm font-medium text-charcoal/75">
                Register
              </a>
            </div>
            <Button variant="gold" size="md" className="mt-3 w-full">
              Post Offer
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
