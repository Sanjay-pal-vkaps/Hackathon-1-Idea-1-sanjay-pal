import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-lg border border-border-muted bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-copper/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
