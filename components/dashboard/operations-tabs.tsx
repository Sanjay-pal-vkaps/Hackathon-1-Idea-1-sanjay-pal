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
      className="flex gap-7 overflow-x-auto border-b border-[#E2DBD0] pb-px text-sm font-medium"
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
              "shrink-0 pb-3 text-sm transition-colors relative",
              active
                ? "font-bold text-[#19241C]"
                : "text-[#19241C]/55 hover:text-[#19241C]",
            )}
          >
            {tab.label}
            {active ? (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#B95D2B] rounded-full" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
