import Link from "next/link";

/**
 * Onboarding layout — same lightweight chrome as app/(auth)/layout.tsx
 * (no dashboard Sidebar/TopNav; the business isn't fully set up yet),
 * but content isn't forced into a narrow centered card since the wizard
 * needs more horizontal room.
 */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper grain-surface flex flex-col">
      <header className="py-6 border-b border-line dark:border-white/10">
        <div className="container-page">
          <Link href="/" className="inline-flex items-baseline gap-2">
            <span className="font-display text-[20px] font-semibold tracking-tight text-charcoal dark:text-white">
              TradeSucro
            </span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest2 text-gold-dim">
              Sugar Exchange
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-10 sm:py-14">{children}</main>
    </div>
  );
}
