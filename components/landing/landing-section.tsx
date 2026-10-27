import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type LandingSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  tone?: "ivory" | "white" | "green" | "muted";
};

const tones = {
  ivory: "bg-warm-ivory text-charcoal",
  white: "bg-white text-charcoal",
  green: "bg-forest-green text-warm-ivory",
  muted: "bg-surface-muted/50 text-charcoal",
} as const;

export function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  tone = "ivory",
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-16 sm:py-20 lg:py-24", tones[tone], className)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="landing-fade-in mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-apple-copper">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-charcoal/70 sm:text-lg">{description}</p>
          ) : null}
        </header>
        <div className="mt-12 lg:mt-14">{children}</div>
      </div>
    </section>
  );
}
