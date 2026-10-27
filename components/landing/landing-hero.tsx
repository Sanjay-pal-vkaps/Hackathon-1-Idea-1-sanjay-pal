import { LandingLink } from "@/components/landing/landing-link";
import { OrchardAccent } from "@/components/landing/orchard-accent";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-border-muted bg-warm-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-apple-copper">
            Basque orchard hospitality
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl">
            Welcome to the sagardotegia
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-charcoal/75">
            Seasonal cider, shared tables, and the warmth of the Basque countryside — book
            your visit online in a few steps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LandingLink href="/book" size="lg">
              Book a table
            </LandingLink>
            <LandingLink href="/login" variant="secondary" size="lg">
              Team sign in
            </LandingLink>
          </div>
          <p className="mt-6 max-w-lg text-sm text-charcoal/60">
            Large groups may receive a pending request until our team confirms availability.
            Confirmation email sent when notifications are configured.
          </p>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md rounded-2xl border border-border-muted bg-white p-6 shadow-sm">
            <OrchardAccent className="mx-auto h-auto w-full max-w-[280px]" />
            <p className="mt-4 text-center text-sm text-charcoal/65">
              Basque Orchard Contemporary — convivial dining, simple reservations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
