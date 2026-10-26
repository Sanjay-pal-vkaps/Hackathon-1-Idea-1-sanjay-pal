"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { label: "Floor Plan", href: "/dashboard", match: ["/dashboard", "/floor-plan"] },
  { label: "Reservations", href: "/reservations", match: ["/reservations"] },
  { label: "Today's Schedule", href: "/schedule", match: ["/schedule"] },
  { label: "Live Activity", href: "/activity", match: ["/activity"] },
] as const;

export function OperationsTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-border-muted pb-px"
      aria-label="Operations sections"
    >
      {TABS.map((tab) => {
        const active = tab.match.some(
          (prefix) =>
            pathname === prefix ||
            (prefix !== "/dashboard" && pathname.startsWith(`${prefix}/`)),
        );
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-apple-copper text-charcoal"
                : "border-transparent text-charcoal/55 hover:text-charcoal",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
