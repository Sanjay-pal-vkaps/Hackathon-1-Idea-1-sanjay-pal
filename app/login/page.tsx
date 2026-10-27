import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { LoginForm } from "@/components/staff/login-form";
import { StaffAuthProvider } from "@/components/staff/staff-auth-provider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-landing-serif",
  display: "swap",
});

export const metadata = {
  title: "Staff & Management Workspace · Iturrieta",
  description: "Operations and table management sign in for Iturrieta Sagardotegia staff.",
};

export default function LoginPage() {
  return (
    <StaffAuthProvider>
      <div className={`landing-page ${cormorant.variable} flex min-h-screen flex-col bg-warm-ivory text-charcoal`}>
        {/* Navigation Bar */}
        <header className="border-b border-border-muted/70 bg-warm-ivory/95 px-4 py-4 sm:px-6 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-xl font-medium tracking-tight text-forest-green group-hover:text-apple-copper transition">
                Iturrieta
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-apple-copper">
                Sagardotegia
              </span>
            </Link>

            <div className="flex items-center gap-4 text-xs font-medium">
              <Link
                href="/"
                className="text-charcoal/60 hover:text-forest-green transition flex items-center gap-1"
              >
                <span>←</span> Back to Website
              </Link>
              <Link
                href="/book"
                className="rounded-full bg-forest-green/10 text-forest-green px-3 py-1 hover:bg-forest-green/20 transition"
              >
                Guest Booking
              </Link>
            </div>
          </div>
        </header>

        {/* Workspace Login Main Section */}
        <main className="flex-1 py-10 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Visual & Operations Info (5 cols) */}
              <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:space-y-6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border-muted shadow-sm">
                  <Image
                    src="/images/landing/cellar.jpg"
                    alt="Iturrieta cider house barrel cellar"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-warm-ivory">
                    <span className="text-xs font-semibold uppercase tracking-widest text-apple-copper">
                      Restaurant OS
                    </span>
                    <h3 className="mt-1 font-serif text-2xl font-medium">
                      Operational Management
                    </h3>
                    <p className="mt-1 text-xs text-warm-ivory/80 leading-relaxed">
                      Interactive floor plan, live table statuses, service shifts, and reservation approvals.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-border-muted/80 bg-white/70 p-5 text-xs text-charcoal/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2 font-semibold text-forest-green">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    <span>Row Level Security (RLS) Active</span>
                  </div>
                  <p className="leading-relaxed text-charcoal/70">
                    Access is strictly scoped by staff role (Owner, Manager, Waiter). All operations actions and status modifications are audited.
                  </p>
                </div>
              </div>

              {/* Right Column: Login Card (7 cols) */}
              <div className="lg:col-span-7 flex justify-center">
                <Suspense fallback={
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-green border-t-transparent" />
                    <p className="mt-3 text-sm text-charcoal/60">Loading staff workspace…</p>
                  </div>
                }>
                  <LoginForm />
                </Suspense>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border-muted/70 bg-surface-muted/40 py-6 text-center text-xs text-charcoal/50">
          <p>© {new Date().getFullYear()} Iturrieta Sagardotegia · Authorized Staff & Operations Personnel Only</p>
        </footer>
      </div>
    </StaffAuthProvider>
  );
}
