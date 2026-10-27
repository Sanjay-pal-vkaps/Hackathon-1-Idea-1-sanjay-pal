import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-apple-copper text-white hover:bg-apple-copper/90 focus-visible:ring-apple-copper",
  secondary:
    "bg-forest-green text-white hover:bg-forest-green/90 focus-visible:ring-forest-green",
  outline:
    "border border-border-muted bg-white text-charcoal hover:bg-surface-muted",
  "outline-light":
    "border border-white/25 bg-transparent text-warm-ivory hover:bg-white/10",
  ghost: "text-charcoal hover:bg-surface-muted",
  "ghost-light": "text-warm-ivory/90 hover:text-white hover:bg-white/10",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
} as const;

type LandingLinkProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function LandingLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: LandingLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-ivory",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
