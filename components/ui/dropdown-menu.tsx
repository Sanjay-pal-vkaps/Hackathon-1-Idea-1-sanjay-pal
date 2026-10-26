"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function DropdownMenu({
  trigger,
  children,
  align = "start",
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={rootRef}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open ? (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-40 rounded-lg border border-border-muted bg-white py-1 shadow-md",
            align === "end" ? "right-0" : "left-0",
          )}
          role="menu"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "flex w-full items-center px-3 py-2 text-left text-sm text-charcoal hover:bg-surface-muted",
        className,
      )}
      {...props}
    />
  );
}
