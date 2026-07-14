import { ReactNode } from "react";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  logo: ReactNode;
  description?: string;
  columns: FooterColumn[];
  bottomText?: string;
  /**
   * "compact" collapses the footer to a single slim bar (logo mark +
   * copyright only) — for authenticated app shells where the footer is
   * always-visible chrome (not a scroll-end marketing block) and every
   * pixel of height is content area the user doesn't get back. Defaults
   * to "full" so every existing caller (the Design System showcase
   * page) is visually unchanged unless it opts in.
   */
  variant?: "full" | "compact";
}

/** Footer — a configurable footer for internal tools/sub-apps. The homepage keeps its own bespoke Footer (components/market/Footer.tsx). */
export function Footer({ logo, description, columns, bottomText, variant = "full" }: FooterProps) {
  if (variant === "compact") {
    return (
      <footer className="shrink-0 border-t border-white/10 bg-charcoal dark:bg-charcoal-soft">
        <div className="mx-auto flex w-full max-w-page items-center justify-between gap-4 px-6 py-2.5 md:px-10">
          <div className="text-[13px] leading-none text-white/60">{logo}</div>
          {bottomText && <p className="text-[11px] leading-none text-white/35">{bottomText}</p>}
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-charcoal text-white/70">
      <div className="mx-auto w-full max-w-page px-6 md:px-10 py-14">
        <div className="grid lg:grid-cols-[1.3fr_2fr] gap-12">
          <div>
            {logo}
            {description && <p className="mt-4 text-sm leading-relaxed text-white/45 max-w-xs">{description}</p>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-mono uppercase tracking-widest2 text-white/40 mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-white/60 hover:text-gold-bright transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {bottomText && (
          <div className="mt-12 pt-6 border-t border-white/10">
            <p className="text-xs text-white/35">{bottomText}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
