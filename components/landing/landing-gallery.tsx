import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/lib/landing/media";

const alts = [
  "Fresh bread and morning light",
  "Coffee and pastry on a table",
  "Kitchen preparation",
  "Restaurant interior ambience",
  "Cider and orchard produce",
  "Dining detail",
] as const;

export function LandingGallery() {
  return (
    <LandingSection
      id="gallery"
      eyebrow="Gallery"
      title="Orchard, cellar, and table"
      description="A glimpse of the sagardotegia atmosphere — stock photography for layout demo."
      tone="muted"
    >
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {landingImages.gallery.map((src, i) => (
          <li
            key={src}
            className={`landing-fade-in overflow-hidden rounded-xl ${
              i === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-1" : ""
            } ${i === 4 ? "md:col-span-2" : ""}`}
          >
            <LandingImage
              src={src}
              alt={alts[i] ?? "Iturrieta gallery image"}
              className={`aspect-square ${i === 0 ? "md:aspect-square min-h-[200px]" : ""} ${i === 4 ? "md:aspect-[2/1]" : ""}`}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
