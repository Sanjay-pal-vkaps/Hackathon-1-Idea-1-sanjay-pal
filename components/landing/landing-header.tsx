"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { landingNav } from "@/lib/landing/media";
import { LandingLink } from "@/components/landing/landing-link";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border-muted/60 bg-warm-ivory/95 shadow-sm backdrop-blur-md"
          : "bg-gradient-to-b from-charcoal/50 to-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className={cn(
            "group min-w-0",
            scrolled ? "text-forest-green" : "text-warm-ivory",
          )}
        >
          <p className="font-serif text-xl font-medium tracking-tight transition group-hover:text-apple-copper">
            Iturrieta
          </p>
          <p
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.35em]",
              scrolled ? "text-charcoal/50" : "text-warm-ivory/70",
            )}
          >
            Sagardotegia
          </p>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {landingNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium tracking-wide transition hover:text-apple-copper",
                scrolled ? "text-charcoal/75" : "text-warm-ivory/90",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LandingLink
            href="/book"
            large
            className={cn(
              "hidden sm:inline-flex",
              !scrolled && "shadow-black/25",
            )}
          >
            Reserve a table
          </LandingLink>
          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden",
              scrolled ? "text-charcoal hover:bg-surface-muted" : "text-warm-ivory hover:bg-white/10",
            )}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">Menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="border-t border-border-muted bg-warm-ivory px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {landingNav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal hover:bg-surface-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <LandingLink href="/book" className="w-full">
                Reserve a table
              </LandingLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
