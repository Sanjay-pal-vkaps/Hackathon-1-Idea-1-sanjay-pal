import Image from "next/image";
import { landingImages } from "@/lib/landing/media";
import { LandingLink } from "@/components/landing/landing-link";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[95vh] items-end overflow-hidden pb-12 pt-32 sm:min-h-[90vh] sm:pb-20">
      <Image
        src={landingImages.hero}
        alt="Historic Basque caserío and apple orchard in Aramaio mountains"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-charcoal/30"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="landing-fade-in max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-apple-copper/40 bg-charcoal/40 px-3.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-apple-copper animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-warm-ivory/90">
              Aramaio · Álava · Basque Country
            </p>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-warm-ivory sm:text-6xl lg:text-7xl">
            Where the Basque orchard meets the table
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-warm-ivory/90 sm:text-xl">
            An authentic <span className="text-apple-copper font-medium">sagardotegia</span> of family tradition and convivial warmth.
            Taste our 100% organic natural cider, feel the rush of the <span className="italic font-serif">«Txotx!»</span> from giant oak kupelas, and savour wood-fired charcoal gastronomy.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingLink href="/book" large variant="primary">
              Reserve a table online
            </LandingLink>
            <LandingLink href="#txotx" large variant="outline-light">
              The Txotx Experience
            </LandingLink>
            <a
              href="tel:+34685721593"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-warm-ivory/30 bg-white/10 px-6 py-3.5 text-sm font-medium text-warm-ivory backdrop-blur-sm transition hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              +34 685 72 15 93
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 border-t border-warm-ivory/15 pt-6 sm:grid-cols-4 sm:gap-4">
            <div>
              <p className="font-serif text-2xl font-semibold text-warm-ivory">1,400</p>
              <p className="text-xs uppercase tracking-wider text-warm-ivory/60">Organic apple trees</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-warm-ivory">100% EKO</p>
              <p className="text-xs uppercase tracking-wider text-warm-ivory/60">Natural cider craft</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-warm-ivory">Txotx!</p>
              <p className="text-xs uppercase tracking-wider text-warm-ivory/60">Direct from kupelas</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-warm-ivory">Est. 1998</p>
              <p className="text-xs uppercase tracking-wider text-warm-ivory/60">Family caserío</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
