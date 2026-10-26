import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

const variants = {
  info: "border-border-muted bg-surface-muted text-charcoal",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-red-200 bg-red-50 text-red-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
} as const;

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof variants;
};

export function Alert({
  className,
  variant = "info",
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-lg border px-4 py-3 text-sm", variants[variant], className)}
      {...props}
    />
  );
}
