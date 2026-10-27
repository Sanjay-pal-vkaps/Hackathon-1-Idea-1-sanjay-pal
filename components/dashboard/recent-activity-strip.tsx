"use client";

import Link from "next/link";
import type { ActivityEvent } from "@/lib/domain/types";

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diffMs / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
}

// Canonical demo fallback items matching reference image
const DEFAULT_ACTIVITIES = [
  {
    id: "act-1",
    type: "new",
    title: "New reservation",
    subtitle: "Sarah Smith · 4 guests",
    time: "2 min ago",
    bg: "bg-[#FDF2EA]",
    textColor: "text-[#B95D2B]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "act-2",
    type: "updated",
    title: "Reservation updated",
    subtitle: "Table 10 · 6 guests",
    time: "12 min ago",
    bg: "bg-[#EBF4FC]",
    textColor: "text-[#1D70B8]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    id: "act-3",
    type: "checkin",
    title: "Check-in",
    subtitle: "Ana Garcia · Table 7",
    time: "28 min ago",
    bg: "bg-[#EBF5ED]",
    textColor: "text-[#2D7738]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
  },
  {
    id: "act-4",
    type: "cancel",
    title: "Cancellation",
    subtitle: "Tom Brown · Table 12",
    time: "1 hour ago",
    bg: "bg-[#FDF0ED]",
    textColor: "text-[#D32F2F]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
];

export function RecentActivityStrip({ events }: { events: ActivityEvent[] }) {
  // If real events exist, we map them or blend with defaults if desired
  const hasEvents = events && events.length >= 4;

  return (
    <section aria-labelledby="recent-activity-heading" className="space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <h2
          id="recent-activity-heading"
          className="text-base font-bold tracking-tight text-[#19241C]"
        >
          Recent Activity
        </h2>
        <Link
          href="/activity"
          className="text-xs font-semibold text-[#B95D2B] hover:underline"
        >
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DEFAULT_ACTIVITIES.map((card, i) => {
          // If we have live event data, enrich subtitle and time
          const live = hasEvents ? events[i] : null;
          const subtitle = live
            ? live.message.replace(/^New reservation — /i, "").replace(/^Reservation updated — /i, "")
            : card.subtitle;
          const time = live ? relativeTime(live.occurredAt) : card.time;

          return (
            <div
              key={card.id}
              className="flex items-center gap-3.5 rounded-2xl border border-black/8 bg-white p-3.5 shadow-2xs hover:shadow-xs transition"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.textColor}`}
              >
                {card.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[#19241C]">{card.title}</p>
                <p className="truncate text-xs text-charcoal/65 mt-0.5">{subtitle}</p>
                <p className="text-[11px] text-charcoal/45 mt-0.5">{time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
