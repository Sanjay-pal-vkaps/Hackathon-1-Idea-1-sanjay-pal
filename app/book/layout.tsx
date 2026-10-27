import Link from "next/link";
import type { ReactNode } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { CustomerAuthProvider } from "@/components/booking/customer-auth-provider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-landing-serif",
  display: "swap",
});

export default function PublicBookLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerAuthProvider>
      <div className={`landing-page ${cormorant.variable} flex min-h-screen flex-col bg-warm-ivory text-charcoal`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 border-b border-border-muted/70 bg-warm-ivory/95 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 text-xs font-medium text-charcoal/60 transition hover:text-apple-copper"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Website</span>
              </Link>

              <span className="h-4 w-px bg-border-muted" aria-hidden />

              <Link href="/" className="group flex flex-col">
                <span className="font-serif text-xl font-medium tracking-tight text-forest-green transition group-hover:text-apple-copper">
                  Iturrieta
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-apple-copper">
                  Sagardotegia
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3 sm:gap-5 text-xs font-medium">
              <a
                href="tel:+34685721593"
                className="hidden items-center gap-1.5 text-charcoal/70 hover:text-forest-green md:inline-flex"
              >
                <span className="text-apple-copper">📞</span> +34 685 72 15 93
              </a>

              <Link
                href="/book/my-bookings"
                className="rounded-full border border-border-muted px-3 py-1.5 text-charcoal/80 transition hover:border-forest-green hover:text-forest-green"
              >
                My Bookings
              </Link>

              <Link
                href="/book/login"
                className="rounded-full bg-forest-green px-3.5 py-1.5 text-warm-ivory transition hover:bg-forest-green/90"
              >
                Sign In
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-muted/70 bg-surface-muted/50 py-8 text-center text-xs text-charcoal/60">
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              Iturrieta Sagardotegia · Arraga auzoa, 2 · 01169 Aramaio (Álava) · <a href="tel:+34685721593" className="hover:underline">+34 685 72 15 93</a>
            </p>
            <div className="flex items-center gap-4">
              <Link href="/book/account" className="hover:text-charcoal hover:underline">
                Profile
              </Link>
              <span>·</span>
              <Link href="/book/register" className="hover:text-charcoal hover:underline">
                Create Account
              </Link>
              <span>·</span>
              <Link href="/login" className="hover:text-charcoal hover:underline">
                Staff Login
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </CustomerAuthProvider>
  );
}
