import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

const highlights = [
  {
    title: "The restaurant",
    text: "Seasonal Basque cooking — fire, sea, and pasture on every plate.",
  },
  {
    title: "Cider tasting",
    text: "Discover natural sagardoa alongside guided pours from the barrel.",
  },
  {
    title: "The txotx",
    text: "Stand, taste, and return — the social pulse of the cider house.",
  },
] as const;

export function LandingExperience() {
  return (
    <LandingSection
      id="experience"
      eyebrow="The experience"
      title="Dine, taste, and share the txotx"
      description="Restaurant service, cider culture, and the warmth of a true sagardotegia — presented here as demo storytelling."
      tone="white"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <LandingImage
          src={landingImages.dining}
          alt="Elegant restaurant table setting"
          className="landing-fade-in aspect-[4/3] rounded-2xl lg:col-span-7 lg:aspect-auto lg:min-h-[420px]"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className="flex flex-col justify-center lg:col-span-5">
          <ul className="space-y-6">
            {highlights.map((item) => (
              <li
                key={item.title}
                className="landing-fade-in border-b border-border-muted/80 pb-6 last:border-0 last:pb-0"
              >
                <h3 className="font-serif text-xl font-medium text-forest-green">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{item.text}</p>
              </li>
            ))}
          </ul>
          <LandingImage
            src={landingImages.txotx}
            alt="Guests enjoying a meal together"
            className="mt-8 aspect-[16/10] rounded-2xl"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </LandingSection>
  );
}
