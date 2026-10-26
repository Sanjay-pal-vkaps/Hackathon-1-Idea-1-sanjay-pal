"use client";

import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type SheetProps = HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  side?: "right" | "bottom";
  title?: string;
  children: ReactNode;
};

export function Sheet({
  open = true,
  side = "right",
  title,
  className,
  children,
  ...props
}: SheetProps) {
  if (!open) return null;
  return (
    <div
      className={cn(
        "border-border-muted bg-white shadow-lg",
        side === "right" &&
          "fixed inset-y-0 right-0 z-40 w-full max-w-md border-l",
        side === "bottom" &&
          "fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-auto rounded-t-xl border-t",
        className,
      )}
      {...props}
    >
      {title ? (
        <div className="border-b border-border-muted px-4 py-3">
          <h2 className="text-base font-semibold text-charcoal">{title}</h2>
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  );
}
