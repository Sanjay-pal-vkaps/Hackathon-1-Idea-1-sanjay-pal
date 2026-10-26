const RESTAURANT_TZ = "Europe/Madrid";

export function formatReservationTimeRange(startAt: string, endAt: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: RESTAURANT_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${fmt.format(new Date(startAt))} – ${fmt.format(new Date(endAt))}`;
}

export function formatReservationDate(startAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: RESTAURANT_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(startAt));
}

export function formatReservationTime(startAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: RESTAURANT_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(startAt));
}
