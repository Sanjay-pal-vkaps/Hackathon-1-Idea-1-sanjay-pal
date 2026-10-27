import { LandingLink } from "@/components/landing/landing-link";

export function LandingFinalCta() {
  return (
    <section className="relative overflow-hidden bg-forest-green py-20 text-warm-ivory sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgb(185 109 67 / 0.35), transparent 45%)",
        }}
        aria-hidden
      />
      <div className="landing-fade-in relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Your table among the apple trees awaits
        </h2>
        <p className="mt-4 text-base leading-relaxed text-warm-ivory/75 sm:text-lg">
          Book online in minutes. Prefer an account? Sign in to manage upcoming visits.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LandingLink href="/book" large>
            Reserve a table
          </LandingLink>
          <LandingLink href="/book/login" large variant="outline-light">
            Customer sign in
          </LandingLink>
        </div>
        <p className="mt-8 text-xs text-warm-ivory/45">
          Restaurant team:{" "}
          <a href="/login" className="underline underline-offset-2 hover:text-warm-ivory">
            staff sign in
          </a>
        </p>
      </div>
    </section>
  );
}
