import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-apple-copper text-white hover:bg-apple-copper/90 focus-visible:ring-apple-copper",
  secondary:
    "bg-forest-green text-white hover:bg-forest-green/90 focus-visible:ring-forest-green",
  outline:
    "border border-border-muted bg-warm-ivory text-charcoal hover:bg-surface-muted",
  ghost: "text-charcoal hover:bg-surface-muted",
  destructive: "bg-red-700 text-white hover:bg-red-800",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-ivory disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
