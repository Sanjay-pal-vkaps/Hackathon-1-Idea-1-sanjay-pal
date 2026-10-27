import Link from "next/link";
import { landingNav } from "@/lib/landing/media";

export function LandingFooter() {
  return (
    <footer className="border-t border-border-muted bg-charcoal text-warm-ivory/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl font-medium text-warm-ivory">Iturrieta</p>
            <p className="mt-2 text-sm text-warm-ivory/50">Sagardotegia · Aramaio</p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-warm-ivory/40">
              Demo reservation experience for the Iturrieta project. Not the official iturrieta.eus
              website.
            </p>
          </div>
          <nav aria-label="Explore">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/45">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {landingNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition hover:text-warm-ivory">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Account">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-ivory/45">
              Book & sign in
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/book" className="transition hover:text-warm-ivory">
                  Reserve a table
                </Link>
              </li>
              <li>
                <Link href="/book/login" className="transition hover:text-warm-ivory">
                  Customer sign in
                </Link>
              </li>
              <li>
                <Link href="/book/register" className="transition hover:text-warm-ivory">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-warm-ivory">
                  Staff sign in
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-12 border-t border-warm-ivory/10 pt-8 text-center text-xs text-warm-ivory/35">
          © {new Date().getFullYear()} Iturrieta demo · Basque Orchard Contemporary
        </p>
      </div>
    </footer>
  );
}
