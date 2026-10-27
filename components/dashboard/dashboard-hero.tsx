"use client";

import { useStaffAuth } from "@/components/staff/staff-auth-provider";
import { useStaffDate } from "@/components/staff/staff-workspace";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatHeroDate(isoDate: string) {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function DashboardHero() {
  const { session } = useStaffAuth();
  const { selectedDate, setSelectedDate, openMobileNav } = useStaffDate();

  const rawName =
    session?.displayName && !session.displayName.includes("Demo")
      ? session.displayName
      : "Sanju Pal";
  const firstName = rawName.split(" ")[0] || "Sanju";
  const greeting = greetingForHour(new Date().getHours());

  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Greeting & Subtitle */}
      <div className="flex items-center gap-3">
        {openMobileNav ? (
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-charcoal shadow-2xs lg:hidden"
            onClick={openMobileNav}
            aria-label="Open navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#19241C] sm:text-[1.75rem]">
            {greeting}, {firstName}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#19241C]/65">
            Here&apos;s what&apos;s happening at Iturrieta today.
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Date, Bell, Scenic Graphic */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 sm:w-64 md:w-72 sm:flex-none">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/45"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search reservation, customer..."
            readOnly
            className="h-10 w-full rounded-xl border border-black/8 bg-white pl-9 pr-14 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/45 shadow-2xs focus:outline-none"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-black/10 bg-[#F4F1EA] px-1.5 py-0.5 text-[10px] font-medium text-charcoal/60">
            ⌘ K
          </span>
        </div>

        {/* Date Selector Pill */}
        <div className="relative">
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-black/8 bg-white px-3.5 text-xs sm:text-sm font-medium text-charcoal shadow-2xs hover:bg-[#FDFCF9] transition">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal/70">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Today, {formatHeroDate(selectedDate)}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-charcoal/50">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Change dashboard operations date"
            />
          </label>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/8 bg-white text-charcoal shadow-2xs hover:bg-[#FDFCF9] transition"
          aria-label="Notifications"
          title="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal/80">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-apple-copper ring-2 ring-white" />
        </button>

        {/* Scenic Aramaio Hills Crop with Cursive Script */}
        <div className="relative hidden xl:flex h-11 w-64 items-center overflow-hidden rounded-xl border border-black/8 shadow-2xs ml-1 bg-[#4A5D4E]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/landing/hero.jpg"
            alt="Basque orchard hills"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/50" />
          <div className="relative z-10 w-full px-3 text-right">
            <p className="font-serif italic text-white drop-shadow-sm text-xs font-semibold leading-tight tracking-wide">
              Cider, people<br />and our land
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
