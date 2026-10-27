import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

export function LandingStory() {
  return (
    <LandingSection
      id="story"
      eyebrow="Our story"
      title="Family roots in the Basque orchard"
      description="Inspired by the spirit of Iturrieta sagardotegia — generations of cider culture, local apples, and hospitality in the heart of Aramaio."
      tone="ivory"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <LandingImage
          src={landingImages.story}
          alt="Apple trees in countryside orchard"
          className="aspect-[4/5] rounded-2xl shadow-xl lg:aspect-[5/6]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="landing-fade-in space-y-5 text-base leading-relaxed text-charcoal/75 sm:text-lg">
          <p>
            In the Basque Country, the sagardotegia is more than a restaurant — it is a gathering
            place where cider is poured from the barrel, seasons turn with the apple harvest, and
            long tables fill with conversation.
          </p>
          <p>
            Iturrieta carries that tradition forward: respect for local fruit, natural
            fermentation, and food that speaks of the land — txistorra, salt cod, wood-fired grills,
            and the convivial ritual of the txotx.
          </p>
          <p className="border-l-2 border-apple-copper/60 pl-4 text-sm text-charcoal/60">
            Narrative for this demo site — verify historical details with the Iturrieta team before
            go-live.
          </p>
        </div>
      </div>
    </LandingSection>
  );
}
