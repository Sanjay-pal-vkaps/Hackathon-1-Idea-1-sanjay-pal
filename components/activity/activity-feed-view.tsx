"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { RecentActivityStrip } from "@/components/dashboard/recent-activity-strip";
import type { ActivityEvent } from "@/lib/domain/types";
import { getMockRepositories } from "@/lib/mock/repositories";

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diffMs / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
}

export function ActivityFeedView() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const rows = await getMockRepositories().activity.listRecent(50);
      if (!cancelled) setEvents(rows);
    };
    void run();
    const timer = window.setInterval(() => void run(), 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live activity"
        description="Reservation and floor events · mock feed refreshes every 15s"
      />
      <RecentActivityStrip events={events.slice(0, 8)} />
      <ul className="divide-y divide-border-muted rounded-xl border border-border-muted bg-white">
        {events.map((event) => (
          <li key={event.id} className="px-4 py-3 text-sm">
            <p className="font-medium text-charcoal">{event.message}</p>
            <p className="text-xs capitalize text-charcoal/55">
              {event.type.replaceAll("_", " ")} · {relativeTime(event.occurredAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
