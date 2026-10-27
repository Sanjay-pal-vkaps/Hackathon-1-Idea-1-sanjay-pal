import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

const steps = [
  {
    title: "Orchard",
    body: "Local apple varieties picked at peak ripeness — the foundation of every glass.",
    image: landingImages.orchard,
    alt: "Rolling green hills and orchard landscape",
  },
  {
    title: "Craft",
    body: "Natural fermentation in the Basque cider tradition — no shortcuts, no rush.",
    image: landingImages.barrel,
    alt: "Wooden barrels in a cellar",
  },
  {
    title: "Pour",
    body: "From barrel to glass — the txotx rhythm that defines the sagardotegia experience.",
    image: landingImages.ciderPour,
    alt: "Cider poured into a glass",
  },
] as const;

export function LandingCider() {
  return (
    <LandingSection
      id="cider"
      eyebrow="From apple to cider"
      title="The journey in three moments"
      description="Orchard, cellar, and table — the arc of natural Basque cider."
      tone="muted"
    >
      <ul className="grid gap-8 md:grid-cols-3 md:gap-6">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="landing-fade-in group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border-muted/80"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <LandingImage
              src={step.image}
              alt={step.alt}
              className="aspect-[4/3]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-apple-copper">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-serif text-xl font-medium text-charcoal">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{step.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
