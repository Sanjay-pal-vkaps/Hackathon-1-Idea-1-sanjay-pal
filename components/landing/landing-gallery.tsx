import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

const galleryItems = [
  {
    src: landingImages.gallery[0],
    title: "The Txotx! Pour",
    subtitle: "Aerating cider straight from the kupela",
  },
  {
    src: landingImages.gallery[1],
    title: "Txuletoia a la Parrilla",
    subtitle: "Charcoal embers & sea salt crystals",
  },
  {
    src: landingImages.gallery[2],
    title: "Tortilla de Bacalao & Chorizo",
    subtitle: "The classic cider house starters",
  },
  {
    src: landingImages.gallery[3],
    title: "Historic Cellar",
    subtitle: "Giant chestnut kupelas and communal tables",
  },
  {
    src: landingImages.gallery[4],
    title: "The Apple Harvest",
    subtitle: "1,400 organic trees across Aramaio",
  },
  {
    src: landingImages.gallery[5],
    title: "Bakailaoa Piper Erretan",
    subtitle: "Fried cod with sweet cider onions & roasted peppers",
  },
];

export function LandingGallery() {
  return (
    <LandingSection
      id="gallery"
      eyebrow="Visual Journey"
      title="Life at the Sagardotegia"
      description="Glimpses of the fire, the barrels, the orchard, and the joy of shared plates."
      tone="muted"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className="landing-fade-in group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-border-muted/80"
          >
            <LandingImage
              src={item.src}
              alt={item.title}
              className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-80 transition duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-0 inset-x-0 p-6 text-warm-ivory">
              <h3 className="font-serif text-xl font-medium">{item.title}</h3>
              <p className="mt-1 text-xs text-warm-ivory/80">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}
