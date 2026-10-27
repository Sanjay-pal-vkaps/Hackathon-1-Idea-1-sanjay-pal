import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

const steps = [
  {
    step: "01",
    title: "1,400 Organic Trees",
    body: "Cultivated with ecological care in Aramaio. We harvest traditional Basque apple varieties at full autumn ripeness.",
    image: landingImages.orchard,
    alt: "Autumn apple harvest in Aramaio orchard with green mountains",
  },
  {
    step: "02",
    title: "Artisanal Kupelas",
    body: "Spontaneous fermentation in historic oak and chestnut barrels. Natural wild yeasts create genuine, unadulterated Basque cider.",
    image: landingImages.barrel,
    alt: "Rows of massive antique wooden cider barrels in the stone cellar",
  },
  {
    step: "03",
    title: "«Sagarretik Txotxera»",
    body: "From the tree straight to your glass. Served unpasteurized from the barrel in season and in bottles year-round.",
    image: landingImages.txotx,
    alt: "Golden natural cider pouring into glass at high speed",
  },
] as const;

export function LandingCider() {
  return (
    <LandingSection
      id="cider"
      eyebrow="Ecological Craft"
      title="Pure Basque Cider — «Sagarretik Txotxera»"
      description="100% natural, certified organic cider made right here in our Aramaio farmhouse."
      tone="muted"
    >
      <ul className="grid gap-8 md:grid-cols-3 md:gap-6">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="landing-fade-in group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-border-muted/80 transition duration-300 hover:shadow-lg"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <LandingImage
              src={step.image}
              alt={step.alt}
              className="aspect-[4/3] w-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="p-7">
              <span className="inline-block rounded-md bg-forest-green/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-forest-green">
                Step {step.step}
              </span>
              <h3 className="mt-3 font-serif text-2xl font-medium text-charcoal">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
