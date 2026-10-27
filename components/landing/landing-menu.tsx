import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

const dishes = [
  {
    name: "Seasonal grill",
    note: "Wood fire · local produce",
    image: landingImages.menu1,
    alt: "Colourful plated seasonal dish",
  },
  {
    name: "Basque classics",
    note: "Cod, pepper, sharing plates",
    image: landingImages.menu2,
    alt: "Rustic pizza-style sharing dish",
  },
  {
    name: "Dessert & cheese",
    note: "Pair with natural sagardoa",
    image: landingImages.menu3,
    alt: "Dessert with berries",
  },
] as const;

export function LandingMenu() {
  return (
    <LandingSection
      id="menu"
      eyebrow="Menu preview"
      title="Flavours of the season"
      description="Illustrative dishes only — menus and pricing are confirmed directly with the restaurant."
      tone="ivory"
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <li
            key={dish.name}
            className="landing-fade-in overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border-muted/70"
          >
            <LandingImage src={dish.image} alt={dish.alt} className="aspect-[5/4]" sizes="33vw" />
            <div className="p-5">
              <h3 className="font-serif text-lg font-medium text-charcoal">{dish.name}</h3>
              <p className="mt-1 text-sm text-charcoal/55">{dish.note}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="landing-fade-in mt-8 text-center text-sm text-charcoal/50">
        Full menu available on request — placeholder until verified with Iturrieta.
      </p>
    </LandingSection>
  );
}
