import { LandingImage } from "@/components/landing/landing-image";
import { LandingLink } from "@/components/landing/landing-link";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

export function LandingVisit() {
  return (
    <LandingSection
      id="visit"
      eyebrow="Visit us"
      title="Aramaio, Basque Country"
      tone="white"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="landing-fade-in order-2 space-y-6 lg:order-1">
          <p className="text-lg leading-relaxed text-charcoal/75">
            Iturrieta welcomes guests to the heart of the Basque apple country. Use our online
            reservation system to choose an available date — live times come from the booking
            calendar, not static hours on this page.
          </p>
          <dl className="space-y-4 rounded-2xl border border-border-muted bg-surface-muted/40 p-6 text-sm">
            <div>
              <dt className="font-semibold uppercase tracking-wider text-charcoal/45">Address</dt>
              <dd className="mt-1 text-charcoal/80">
                Aramaio, Araba / Álava, Basque Country, Spain
                <span className="mt-1 block text-charcoal/50">
                  [Street address — confirm with Iturrieta]
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-wider text-charcoal/45">Contact</dt>
              <dd className="mt-1 text-charcoal/80">
                [Phone & email — placeholder until verified]
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-wider text-charcoal/45">Hours</dt>
              <dd className="mt-1 text-charcoal/80">
                See availability when you reserve — Europe/Madrid timezone
              </dd>
            </div>
          </dl>
          <LandingLink href="/book">Reserve a table</LandingLink>
        </div>
        <LandingImage
          src={landingImages.visit}
          alt="Basque village and green hills"
          className="landing-fade-in order-1 aspect-[4/3] rounded-2xl lg:order-2 lg:aspect-[5/4]"
          sizes="50vw"
        />
      </div>
    </LandingSection>
  );
}
