import { LandingImage } from "@/components/landing/landing-image";
import { LandingSection } from "@/components/landing/landing-section";
import { LandingLink } from "@/components/landing/landing-link";
import { landingImages } from "@/lib/landing/media";

const ritualSteps = [
  {
    step: "01",
    title: "Listen for the cry: «Txotx!»",
    description:
      "When the cider maker or host shouts «Txotx!», conversation pauses and everyone rises from the long wooden tables with empty glasses in hand.",
  },
  {
    step: "02",
    title: "Gather at the Kupela",
    description:
      "Guests gather in front of the giant chestnut and oak barrels (kupelas). The spigot opens, releasing a high-pressure stream of golden natural cider.",
  },
  {
    step: "03",
    title: "Catch the Stream Low (Txinparta)",
    description:
      "Hold your glass low and tilt it so the stream hits the glass wall. This dynamic aeration creates the «txinparta» — fine, fleeting natural effervescence.",
  },
  {
    step: "04",
    title: "Drink While It’s Alive",
    description:
      "Only pour two fingers worth at a time and drink immediately while the natural sparkle and fresh apple aromas are at their peak. Then return to feast!",
  },
];

export function LandingTxotx() {
  return (
    <LandingSection
      id="txotx"
      eyebrow="The Basque Tradition"
      title="An insider’s guide to the «Txotx!» ritual"
      description="The soul of the sagardotegia — a convivial ceremony of friendship, standing barrels, and unpasteurized natural cider."
      tone="muted"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="space-y-6 lg:col-span-5">
          <p className="text-base leading-relaxed text-charcoal/80 sm:text-lg">
            In the Basque Country, visiting a cider house is unlike any ordinary restaurant experience. During the traditional season (January to May), dining is communal, relaxed, and active — you freely wander into the cellar to taste from different barrels all evening.
          </p>

          <div className="space-y-4">
            {ritualSteps.map((item) => (
              <div
                key={item.step}
                className="landing-fade-in rounded-2xl border border-border-muted/80 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-green font-serif text-sm font-semibold text-warm-ivory">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-forest-green">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <LandingLink href="/book" variant="primary">
              Book your Txotx experience
            </LandingLink>
          </div>
        </div>

        <div className="relative space-y-6 lg:col-span-7">
          <LandingImage
            src={landingImages.txotx}
            alt="The Txotx ritual — natural cider streaming into glass from massive oak kupela"
            className="aspect-[4/3] rounded-3xl shadow-xl ring-1 ring-border-muted/80"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
          <div className="rounded-2xl border border-forest-green/20 bg-forest-green/5 p-6 text-charcoal">
            <div className="flex items-center gap-2 text-forest-green font-semibold text-sm uppercase tracking-wider">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Insider’s Tip from Aramaio
            </div>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
              Year-round dining: While the official Txotx season runs from January through May straight from the barrels, our cellar serves our organic bottled natural cider and traditional menu all 12 months.
            </p>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
