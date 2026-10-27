/** Matches demo booking_settings.timezone (Europe/Madrid). */
export const DEMO_RESTAURANT_TZ = "Europe/Madrid";

/** Local calendar date (YYYY-MM-DD) for “today” in the restaurant timezone. */
export function getDemoServiceDate(reference = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DEMO_RESTAURANT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(reference);
}

/** ISO timestamp for seed `created_at` / `updated_at` on the demo service day. */
export function getDemoSeedMetadataAt(reference = new Date()): string {
  const date = getDemoServiceDate(reference);
  return new Date(`${date}T08:00:00+02:00`).toISOString();
}
