import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/domain/types";

function trendLabel(value: number) {
  const sign = value >= 0 ? "↑" : "↓";
  return `${sign} ${Math.abs(value)}% vs yesterday`;
}

const icons = {
  reservations: "📅",
  guests: "👥",
  occupancy: "📊",
  walkins: "🚶",
} as const;

export function KpiCards({ stats }: { stats: DashboardStats }) {
  const items = [
    {
      key: "reservations" as const,
      title: "Reservations",
      value: String(stats.reservationsCount),
      sub: trendLabel(stats.reservationsTrendPercent),
      accent: "bg-emerald-100 text-emerald-800",
    },
    {
      key: "guests" as const,
      title: "Total Guests",
      value: String(stats.totalGuests),
      sub: trendLabel(stats.guestsTrendPercent),
      accent: "bg-sky-100 text-sky-900",
    },
    {
      key: "occupancy" as const,
      title: "Occupancy",
      value: `${stats.occupancyPercent}%`,
      sub: "Demo metric",
      bar: stats.occupancyPercent,
      accent: "bg-orange-100 text-orange-900",
    },
    {
      key: "walkins" as const,
      title: "Walk-ins",
      value: String(stats.walkInsCount),
      sub: "On site now",
      accent: "bg-violet-100 text-violet-900",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
      {items.map((item) => (
        <Card key={item.key} className="border-border-muted/80 shadow-sm">
          <CardContent className="flex gap-3 p-4">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${item.accent}`}
              aria-hidden
            >
              {icons[item.key]}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-charcoal/60">{item.title}</p>
              <p className="text-xl font-semibold tracking-tight text-charcoal">
                {item.value}
              </p>
              <p className="mt-0.5 text-[11px] text-charcoal/55">{item.sub}</p>
              {"bar" in item && item.bar !== undefined ? (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-apple-copper"
                    style={{ width: `${item.bar}%` }}
                  />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
