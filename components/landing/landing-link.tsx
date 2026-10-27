import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-apple-copper text-white shadow-lg shadow-apple-copper/20 hover:bg-apple-copper/92",
  secondary: "bg-forest-green text-warm-ivory hover:bg-forest-green/90",
  outline:
    "border border-charcoal/15 bg-transparent text-charcoal hover:border-apple-copper/50 hover:bg-white/80",
  "outline-light":
    "border border-warm-ivory/30 text-warm-ivory hover:bg-warm-ivory/10",
  ghost: "text-charcoal/80 hover:text-charcoal",
} as const;

type LandingLinkProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  large?: boolean;
};

export function LandingLink({
  href,
  children,
  variant = "primary",
  className,
  large = false,
}: LandingLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-copper focus-visible:ring-offset-2 focus-visible:ring-offset-warm-ivory",
        large ? "h-12 px-8 text-base" : "h-11 px-6 text-sm",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
