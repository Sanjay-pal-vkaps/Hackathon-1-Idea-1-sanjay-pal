import Link from "next/link";
import { LandingLink } from "@/components/landing/landing-link";

const nav = [
  { href: "#experience", label: "Experience" },
  { href: "#visit", label: "Visit" },
  { href: "#get-started", label: "Book" },
] as const;

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-forest-green/20 bg-forest-green text-warm-ivory shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="min-w-0 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-copper focus-visible:ring-offset-2 focus-visible:ring-offset-forest-green">
          <p className="text-base font-semibold leading-tight tracking-wide">Iturrieta</p>
          <p className="text-xs font-normal text-warm-ivory/75">Sagardotegia · Aramaio</p>
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm md:flex"
          aria-label="On this page"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-warm-ivory/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-copper rounded"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LandingLink
            href="/book/login"
            variant="ghost-light"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Guest
          </LandingLink>
          <LandingLink href="/login" variant="outline-light" size="sm" className="hidden sm:inline-flex">
            Team
          </LandingLink>
          <LandingLink href="/book" size="sm">
            Book
          </LandingLink>
        </div>
      </div>
    </header>
  );
}
