import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { LandingLink } from "@/components/landing/landing-link";
import { landingImages } from "@/lib/landing/media";

const menuCourses = [
  {
    course: "Course 1 & 2",
    title: "Txorizoa Sagardotan & Bakailao Nahaskia",
    description:
      "Spicy Basque artisan chorizo gently simmered in house cider, followed by a moist, fluffy salt cod and caramelized onion omelette.",
    image: landingImages.menuCodOmelette,
    alt: "Basque salt cod omelette, chorizo in cider, and rustic bread",
    badge: "Starters",
  },
  {
    course: "Course 3",
    title: "Bakailaoa Piper Erretan",
    description:
      "Thick Atlantic salt cod fillets pan-fried to a golden crust, served over sweet roasted red piquillo peppers and cider-braised onions.",
    image: landingImages.menuCodPeppers,
    alt: "Fried salt cod on roasted red peppers and sweet cider onions",
    badge: "Fish",
  },
  {
    course: "Course 4 · The Main",
    title: "Txuletoia Parrillan (Chuletón)",
    description:
      "The legendary centerpiece — 1kg+ bone-in grass-fed beef ribeye seared over blazing charcoal embers, tender inside, with flaky sea salt crystals.",
    image: landingImages.menuTxuleton,
    alt: "Thick Basque bone-in txuleton ribeye steak sizzling over charcoal grill",
    badge: "Charcoal Grill",
  },
  {
    course: "Course 5 · Dessert",
    title: "Idiazabal Gazta, Irasagarra eta Intxaurrak",
    description:
      "Smoked raw sheep’s milk Idiazabal cheese paired with dark amber quince paste (membrillo / irasagarra) and fresh local walnuts.",
    image: landingImages.menuIdiazabal,
    alt: "Idiazabal cheese wedges, quince paste, walnuts, and cider glass",
    badge: "Tradition",
  },
];

export function LandingMenu() {
  return (
    <LandingSection
      id="menu"
      eyebrow="Traditional Basque Gastronomy"
      title="The Sagardotegi Menu"
      description="A timeless multi-course feast served around communal tables, accompanied by unlimited organic natural cider."
      tone="ivory"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {menuCourses.map((item) => (
          <div
            key={item.title}
            className="landing-fade-in group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-border-muted/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative">
              <LandingImage
                src={item.image}
                alt={item.alt}
                className="aspect-[4/3] w-full"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <span className="absolute left-4 top-4 rounded-full bg-charcoal/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-warm-ivory backdrop-blur-sm">
                {item.badge}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                  {item.course}
                </p>
                <h3 className="mt-1 font-serif text-xl font-medium leading-snug text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-border-muted bg-surface-muted/50 p-8 sm:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-apple-copper" />
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/60">
                All-Inclusive Sagardotegi Menu
              </p>
            </div>
            <h4 className="mt-2 font-serif text-2xl font-medium text-forest-green">
              Includes unlimited organic cider directly from the kupelas
            </h4>
            <p className="mt-1 text-sm text-charcoal/70">
              Also offering seasonal menu, children’s menu (16 €), and options for dietary requirements upon advance notice.
            </p>
          </div>
          <LandingLink href="/book" variant="primary" large className="shrink-0">
            Check availability & book
          </LandingLink>
        </div>
      </div>
    </LandingSection>
  );
}
