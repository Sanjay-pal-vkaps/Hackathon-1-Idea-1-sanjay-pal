"use client";

import Link from "next/link";
import { useStaffAuth } from "@/components/staff/staff-auth-provider";
import { useStaffDate } from "@/components/staff/staff-workspace";
import { Input } from "@/components/ui/input";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatHeroDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}

export function DashboardHero() {
  const { session } = useStaffAuth();
  const { selectedDate } = useStaffDate();
  const firstName = session?.displayName.split(" ")[0] ?? "Team";
  const greeting = greetingForHour(new Date().getHours());

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border-muted shadow-sm">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(53,72,58,0.92) 0%, rgba(53,72,58,0.55) 42%, rgba(185,109,67,0.25) 100%), radial-gradient(ellipse 80% 120% at 85% 20%, rgba(245,210,160,0.45), transparent 55%), linear-gradient(180deg, #8fa88a 0%, #c4b59a 40%, #a8927a 100%)",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col gap-5 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-7">
        <div className="min-w-0 text-white">
          <h1 className="text-2xl font-semibold tracking-tight md:text-[1.75rem]">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 max-w-md text-sm text-white/85">
            Here&apos;s what&apos;s happening at Iturrieta today.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Input
              placeholder="Search reservations, guests…"
              disabled
              className="border-white/20 bg-white/95 pr-14 text-charcoal placeholder:text-charcoal/50"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border-muted bg-surface-muted px-1.5 py-0.5 text-[10px] text-charcoal/60">
              ⌘ K
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-10 items-center rounded-lg border border-white/25 bg-white/15 px-3 text-sm font-medium text-white backdrop-blur-sm">
              {formatHeroDate(selectedDate)}
            </span>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/15 text-lg text-white backdrop-blur-sm"
              aria-label="Sample notifications"
            >
              🔔
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-apple-copper px-1 text-[10px] font-semibold text-white">
                3
              </span>
            </button>
            <Link
              href="/reservations/new"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-apple-copper px-4 text-sm font-medium text-white shadow-md transition-colors hover:bg-apple-copper/90"
            >
              + New Reservation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
