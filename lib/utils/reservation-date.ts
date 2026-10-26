const RESTAURANT_TZ = "Europe/Madrid";

/** Demo / display date key for a reservation instant in restaurant timezone */
export function reservationDateKey(isoInstant: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TZ,
  }).format(new Date(isoInstant));
}
