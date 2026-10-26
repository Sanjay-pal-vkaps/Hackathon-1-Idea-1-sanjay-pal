import { cn } from "@/lib/utils/cn";
import type { TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-lg border border-border-muted bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-copper/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
