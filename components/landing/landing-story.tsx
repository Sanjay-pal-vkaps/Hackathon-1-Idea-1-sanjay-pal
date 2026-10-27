import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

export function LandingStory() {
  return (
    <LandingSection
      id="story"
      eyebrow="Our roots"
      title="A family project in the mountains of Aramaio"
      description="From an ancient stone caserío to 1,400 organic apple trees — our journey of Basque cider hospitality."
      tone="ivory"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <LandingImage
            src={landingImages.story}
            alt="Organic apple harvest in Aramaio valley with mountain backdrop"
            className="aspect-[4/3] rounded-3xl shadow-xl ring-1 ring-border-muted/80 lg:aspect-[5/4]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute -bottom-5 -right-5 hidden rounded-2xl border border-border-muted bg-white p-5 shadow-lg sm:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
              «Sagarretik txotxera»
            </p>
            <p className="font-serif text-lg font-medium text-forest-green">
              From apple to barrel
            </p>
          </div>
        </div>

        <div className="landing-fade-in space-y-6 text-base leading-relaxed text-charcoal/80 sm:text-lg">
          <p className="font-serif text-2xl font-normal leading-snug text-forest-green">
            “In 1997, we arrived from Vitoria to this beautiful caserío in Aramaio. We converted the historic stables into our cider house, opening our doors on Santiago Day in 1998.”
          </p>

          <p>
            Surrounded by the dramatic green peaks often called the <strong className="font-medium text-charcoal">“Little Basque Switzerland”</strong>, Iturrieta is first and foremost an agricultural family home. Today we tend nearly <strong className="font-medium text-charcoal">1,400 organic apple trees</strong> across our orchards.
          </p>

          <p>
            Here, cider is not merely a drink — it is a living ritual. We harvest local varieties at peak maturity, press them on-site, and let natural indigenous yeasts do their work. No added sugars, no artificial gas, no shortcuts. Just pure Basque nature in your glass.
          </p>

          <div className="grid grid-cols-2 gap-4 border-t border-border-muted pt-6 text-sm">
            <div>
              <p className="font-semibold text-charcoal">Location</p>
              <p className="text-charcoal/70">Arraga auzoa, 2 · Aramaio</p>
            </div>
            <div>
              <p className="font-semibold text-charcoal">Cider Philosophy</p>
              <p className="text-charcoal/70">100% Organic & Ecological (EKO)</p>
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
