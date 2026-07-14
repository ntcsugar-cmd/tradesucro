import Link from "next/link";

/**
 * Auth layout — deliberately lighter than the dashboard shell in
 * app/(dashboard)/layout.tsx: just the TradeSucro wordmark linking home,
 * centered content, and the same paper/grain surface as the homepage
 * hero. No Sidebar/TopNav — the person isn't authenticated yet.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper grain-surface flex flex-col">
      <header className="py-6">
        <div className="container-page">
          <Link href="/" className="inline-flex items-baseline gap-2">
            <span className="font-display text-[20px] font-semibold tracking-tight text-charcoal">
              TradeSucro
            </span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest2 text-gold-dim">
              Sugar Exchange
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">{children}</main>

      <footer className="py-6 text-center">
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} TradeSucro Technologies Pvt. Ltd.
        </p>
      </footer>
    </div>
  );
}
