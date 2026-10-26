"use client";

import { RoleSwitcher } from "@/components/staff/role-switcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StaffTopbar({
  selectedDate,
  onDateChange,
  onOpenNav,
}: {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenNav?: () => void;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border-muted bg-warm-ivory px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        {onOpenNav ? (
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-muted bg-white text-charcoal lg:hidden"
            onClick={onOpenNav}
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        ) : null}
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <Label htmlFor="staff-search" className="sr-only">
            Search
          </Label>
          <Input
            id="staff-search"
            placeholder="Search reservations, guests…"
            disabled
            className="bg-white pr-16"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border-muted bg-surface-muted px-1.5 py-0.5 text-[10px] text-charcoal/60">
            ⌘ K
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div>
          <Label htmlFor="ops-date" className="sr-only">
            Operations date
          </Label>
          <Input
            id="ops-date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-auto bg-white"
          />
        </div>
        <div className="hidden md:block">
          <RoleSwitcher />
        </div>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-muted bg-white text-charcoal"
          aria-label="Sample notifications (demo only — not live)"
          title="Sample notifications (demo)"
        >
          🔔
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-apple-copper px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
