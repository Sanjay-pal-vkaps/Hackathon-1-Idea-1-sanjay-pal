import Link from "next/link";
import { landingNav } from "@/lib/landing/media";

export function LandingFooter() {
  return (
    <footer className="border-t border-border-muted bg-charcoal text-warm-ivory/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-serif text-2xl font-medium text-warm-ivory">Iturrieta</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-apple-copper">
              Sagardotegia · Aramaio
            </p>
            <p className="mt-4 text-xs leading-relaxed text-warm-ivory/60">
              Sidra natural ecológica elaborada con manzana de Aramaio. Entre montes y buena mesa desde 1998.
            </p>
            <div className="mt-4 space-y-1 text-xs text-warm-ivory/70">
              <p>Arraga auzoa, 2 · 01169 Aramaio (Álava)</p>
              <p>Tel: +34 685 72 15 93</p>
              <p>info@iturrieta.eus</p>
            </div>
          </div>

          <nav aria-label="Explore">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/45">
              Experience
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {landingNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition hover:text-warm-ivory">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Reservations & Account">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/45">
              Book & Account
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/book" className="transition hover:text-warm-ivory">
                  Reserve a table online
                </Link>
              </li>
              <li>
                <Link href="/book/my-bookings" className="transition hover:text-warm-ivory">
                  My reservations
                </Link>
              </li>
              <li>
                <Link href="/book/login" className="transition hover:text-warm-ivory">
                  Customer sign in
                </Link>
              </li>
              <li>
                <Link href="/book/register" className="transition hover:text-warm-ivory">
                  Create customer account
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/45">
              Staff Portal
            </p>
            <p className="mt-4 text-xs leading-relaxed text-warm-ivory/60">
              Operations dashboard, live floor plan, shift schedule, and table management for restaurant staff.
            </p>
            <div className="mt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-warm-ivory/20 px-3.5 py-2 text-xs font-medium text-warm-ivory transition hover:bg-white/10"
              >
                Staff sign in →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-warm-ivory/10 pt-8 text-xs text-warm-ivory/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Iturrieta Sagardotegia · Basque Orchard Hospitality</p>
          <div className="flex gap-4">
            <a href="https://www.iturrieta.eus" target="_blank" rel="noreferrer" className="hover:text-warm-ivory">
              iturrieta.eus
            </a>
            <span>·</span>
            <a href="https://instagram.com/iturrietasagardotegia" target="_blank" rel="noreferrer" className="hover:text-warm-ivory">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
