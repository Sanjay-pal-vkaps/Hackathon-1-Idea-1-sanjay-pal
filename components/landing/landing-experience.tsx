import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  {
    title: "Cider & season",
    description:
      "The sagardotegia ritual — orchard cider poured fresh, best enjoyed with good company and Basque fare.",
  },
  {
    title: "Shared tables",
    description:
      "From intimate pairs to larger gatherings — tell us your party size and we will match the right table.",
  },
  {
    title: "Your reservation",
    description:
      "Instant confirmation when available, or a quick manager review for special requests. View your booking anytime via your link or account.",
  },
] as const;

export function LandingExperience() {
  return (
    <section
      id="experience"
      className="scroll-mt-20 border-b border-border-muted bg-surface-muted/40 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
            The experience
          </h2>
          <p className="mt-2 text-charcoal/70">
            A modern reservation experience rooted in cider-house tradition — demo copy for
            Iturrieta&apos;s digital guest journey.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.title}>
              <Card className="h-full border-border-muted bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-charcoal/70">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
