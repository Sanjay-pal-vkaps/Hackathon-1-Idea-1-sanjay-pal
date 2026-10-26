import type { ActivityEvent, ActivityEventType } from "@/lib/domain/types";

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diffMs / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
}

function activityMeta(type: ActivityEventType): { title: string; icon: string } {
  switch (type) {
    case "reservation_created":
      return { title: "New reservation", icon: "✨" };
    case "reservation_updated":
      return { title: "Reservation updated", icon: "✏️" };
    case "check_in":
      return { title: "Check-in", icon: "✓" };
    case "cancellation":
      return { title: "Cancellation", icon: "✕" };
    case "table_status_changed":
      return { title: "Table status", icon: "◎" };
  }
}

function activitySubtitle(message: string) {
  const cleaned = message
    .replace(/^New reservation — /i, "")
    .replace(/^Reservation updated — /i, "")
    .replace(/^Check-in — /i, "")
    .replace(/^Cancellation — /i, "")
    .replace(/ \(demo\)/gi, "");
  return cleaned;
}

export function RecentActivityStrip({ events }: { events: ActivityEvent[] }) {
  return (
    <section aria-labelledby="recent-activity-heading">
      <h2
        id="recent-activity-heading"
        className="mb-3 text-base font-semibold text-charcoal"
      >
        Recent activity
      </h2>
      <ul className="flex gap-3 overflow-x-auto pb-1">
        {events.map((event) => {
          const meta = activityMeta(event.type);
          return (
            <li
              key={event.id}
              className="min-w-[200px] max-w-[240px] shrink-0 rounded-xl border border-border-muted bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-sm"
                  aria-hidden
                >
                  {meta.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-charcoal">{meta.title}</p>
                  <p className="truncate text-sm text-charcoal/70">
                    {activitySubtitle(event.message)}
                  </p>
                  <p className="mt-1 text-xs text-charcoal/50">
                    {relativeTime(event.occurredAt)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
