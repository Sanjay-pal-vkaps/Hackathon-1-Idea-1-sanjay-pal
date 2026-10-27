import Link from "next/link";
import { LandingLink } from "@/components/landing/landing-link";

export function LandingVisit() {
  return (
    <section id="visit" className="scroll-mt-20 border-b border-border-muted py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border-muted bg-white p-6 shadow-sm sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-charcoal">Plan your visit</h2>
            <ul className="mt-4 space-y-2 text-charcoal/75">
              <li>
                <span className="font-medium text-charcoal">Location:</span> Aramaio, Basque
                Country
              </li>
              <li>
                <span className="font-medium text-charcoal">Hours:</span> Available dates and
                times appear in the booking calendar — always live from our system.
              </li>
              <li>
                <span className="font-medium text-charcoal">Timezone:</span> Europe/Madrid
              </li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <LandingLink href="/book">Check availability</LandingLink>
            <Link
              href="/book/my-bookings"
              className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-apple-copper hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-copper"
            >
              Existing booking
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
