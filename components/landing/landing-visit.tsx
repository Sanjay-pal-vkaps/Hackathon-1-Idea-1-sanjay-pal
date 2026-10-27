import { LandingImage } from "@/components/landing/landing-image";
import { LandingLink } from "@/components/landing/landing-link";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

export function LandingVisit() {
  return (
    <LandingSection
      id="visit"
      eyebrow="Find Us in Aramaio"
      title="Between the mountains, 30 minutes from Vitoria"
      tone="white"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="landing-fade-in order-2 space-y-6 lg:order-1">
          <p className="text-lg leading-relaxed text-charcoal/80">
            Iturrieta is situated in the breathtaking <strong className="font-semibold text-charcoal">valley of Aramaio (Álava)</strong>. Surrounded by rolling peaks, lush apple trees, and fresh mountain air, it is the perfect Basque countryside escape.
          </p>

          <dl className="space-y-5 rounded-3xl border border-border-muted bg-surface-muted/40 p-7 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                Address
              </dt>
              <dd className="mt-1 font-medium text-charcoal">
                Arraga auzoa, 2 · 01169 Aramaio (Álava), Basque Country
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Iturrieta+Sagardotegia+Arraga+Aramaio"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-green hover:underline"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Open in Google Maps →
                </a>
              </dd>
            </div>

            <div className="border-t border-border-muted/60 pt-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                Direct Contact & WhatsApp
              </dt>
              <dd className="mt-1 flex flex-wrap gap-4 font-medium text-charcoal">
                <a
                  href="tel:+34685721593"
                  className="inline-flex items-center gap-1.5 text-charcoal hover:text-forest-green"
                >
                  <span className="text-apple-copper">📞</span> +34 685 72 15 93
                </a>
                <a
                  href="https://wa.me/34685721593"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline"
                >
                  <span>💬</span> Message via WhatsApp
                </a>
                <a
                  href="mailto:info@iturrieta.eus"
                  className="inline-flex items-center gap-1.5 text-charcoal/70 hover:text-charcoal"
                >
                  <span>✉️</span> info@iturrieta.eus
                </a>
              </dd>
            </div>

            <div className="border-t border-border-muted/60 pt-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                Operating Seasons & Hours
              </dt>
              <dd className="mt-1 text-charcoal/80">
                <p><strong>Txotx Season (Jan – May):</strong> Cider served straight from the kupelas.</p>
                <p className="mt-0.5"><strong>Year-Round:</strong> Bottled organic cider, dining & events.</p>
                <p className="mt-1 text-xs text-charcoal/60">Holiday closure: Dec 24 to Jan 1.</p>
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-3">
            <LandingLink href="/book" variant="primary" large>
              Reserve a table online
            </LandingLink>
            <a
              href="https://wa.me/34685721593"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-forest-green/30 bg-forest-green/10 px-6 py-3.5 text-sm font-medium text-forest-green transition hover:bg-forest-green/20"
            >
              WhatsApp Reservation
            </a>
          </div>
        </div>

        <div className="landing-fade-in order-1 lg:order-2">
          <LandingImage
            src={landingImages.visit}
            alt="The stone caserío of Iturrieta nestled in the verdant Aramaio valley"
            className="aspect-[4/3] rounded-3xl shadow-xl ring-1 ring-border-muted/80 lg:aspect-[5/4]"
            sizes="50vw"
          />
        </div>
      </div>
    </LandingSection>
  );
}
