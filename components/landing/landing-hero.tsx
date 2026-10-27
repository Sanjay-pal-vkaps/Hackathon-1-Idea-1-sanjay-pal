import Image from "next/image";
import { landingImages } from "@/lib/landing/media";
import { LandingLink } from "@/components/landing/landing-link";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden sm:min-h-[88vh]">
      <Image
        src={landingImages.hero}
        alt="Apple orchard in soft morning light"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/45 to-charcoal/25"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24 lg:pb-28">
        <div className="landing-fade-in max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-apple-copper">
            Aramaio · Basque Country
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-warm-ivory sm:text-5xl lg:text-6xl">
            Where the orchard meets the table
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-warm-ivory/85 sm:text-xl">
            A sagardotegia of tradition and conviviality — natural cider, Basque flavours, and
            the rhythm of the txotx. Reserve your place among the apple trees.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingLink href="/book" large variant="primary">
              Reserve a table
            </LandingLink>
            <LandingLink href="#story" large variant="outline-light">
              Discover our story
            </LandingLink>
          </div>
          <p className="mt-8 text-xs text-warm-ivory/55">
            Demo reservation site — imagery illustrative; confirm details with Iturrieta before
            publication.
          </p>
        </div>
      </div>
    </section>
  );
}
