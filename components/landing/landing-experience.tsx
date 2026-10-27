import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { LandingLink } from "@/components/landing/landing-link";
import { landingImages } from "@/lib/landing/media";

export function LandingExperience() {
  return (
    <LandingSection
      id="music"
      eyebrow="Music & Atmosphere"
      title="Concerts, Fireside Evenings & Orchard Tours"
      description="Throughout the year, music and laughter echo through Iturrieta. Seasonal settings, always the same warm spirit."
      tone="white"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-7">
          <LandingImage
            src={landingImages.dining}
            alt="Historic wooden cider cellar with long banquet tables and kupelas"
            className="aspect-[4/3] rounded-3xl shadow-xl ring-1 ring-border-muted/80"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-border-muted bg-surface-muted/30 p-6">
            <div className="flex items-center gap-3 text-forest-green font-semibold">
              <span className="text-xl">☀️</span>
              <h3 className="font-serif text-xl">Summer on the Terrace</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
              Live acoustic sets, folk sessions, and accordion melodies on our stone terrace with the panoramic green mountains of the Aramaio valley unfolding before you.
            </p>
          </div>

          <div className="rounded-2xl border border-border-muted bg-surface-muted/30 p-6">
            <div className="flex items-center gap-3 text-apple-copper font-semibold">
              <span className="text-xl">🔥</span>
              <h3 className="font-serif text-xl">Winter by the Fireplace</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
              Inside our rustic tavern cellar, warmed by the blazing hearth, convivial conversation and songs flow freely between sips of cider straight from the wood.
            </p>
          </div>

          <div className="rounded-2xl border border-border-muted bg-surface-muted/30 p-6">
            <div className="flex items-center gap-3 text-forest-green font-semibold">
              <span className="text-xl">🍏</span>
              <h3 className="font-serif text-xl">Guided Tours & Visits</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
              Discover the 500-year-old caserío, walk among 1,400 organic apple trees, and learn the age-old art of natural cider-making from the family.
            </p>
          </div>

          <div className="pt-2">
            <LandingLink href="/book" variant="primary">
              Book your visit & table
            </LandingLink>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
