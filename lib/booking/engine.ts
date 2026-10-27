import type {
  PublicTimeSlot,
  Reservation,
  RestaurantTable,
  ServiceShift,
} from "@/lib/domain/types";

const ACTIVE_RESERVATION_STATUSES = new Set<Reservation["status"]>([
  "pending",
  "confirmed",
  "arrived",
]);

export function reservationBlocksTable(
  reservation: Reservation,
  tableId: string,
): boolean {
  if (!ACTIVE_RESERVATION_STATUSES.has(reservation.status)) return false;
  return reservation.tableIds.includes(tableId);
}

export function intervalsOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  const a0 = new Date(aStart).getTime();
  const a1 = new Date(aEnd).getTime();
  const b0 = new Date(bStart).getTime();
  const b1 = new Date(bEnd).getTime();
  return a0 < b1 && b0 < a1;
}

export function blockedEndWithBuffer(endAt: string, bufferMinutes: number): string {
  const end = new Date(endAt);
  end.setMinutes(end.getMinutes() + bufferMinutes);
  return end.toISOString();
}

export function isTableFreeForInterval(
  tableId: string,
  startAt: string,
  endAt: string,
  bufferMinutes: number,
  reservations: Reservation[],
): boolean {
  const blockUntil = blockedEndWithBuffer(endAt, bufferMinutes);
  return !reservations.some((reservation) => {
    if (!reservationBlocksTable(reservation, tableId)) return false;
    const resBlockUntil = blockedEndWithBuffer(
      reservation.endAt,
      bufferMinutes,
    );
    return intervalsOverlap(startAt, blockUntil, reservation.startAt, resBlockUntil);
  });
}

export function suggestTableId(
  guestCount: number,
  startAt: string,
  endAt: string,
  tables: RestaurantTable[],
  reservations: Reservation[],
  bufferMinutes: number,
): string | null {
  const candidates = tables
    .filter(
      (t) =>
        t.active &&
        t.status !== "out_of_service" &&
        guestCount >= t.capacityMin &&
        guestCount <= t.capacityMax,
    )
    .sort((a, b) => a.capacityMax - b.capacityMax);

  for (const table of candidates) {
    if (
      isTableFreeForInterval(
        table.id,
        startAt,
        endAt,
        bufferMinutes,
        reservations,
      )
    ) {
      return table.id;
    }
  }
  return null;
}

export function listAvailableDates(from: string, to: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 1) dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function shiftSlotTimes(shift: ServiceShift): string[] {
  const [sh, sm] = shift.startTime.split(":").map(Number);
  const [eh, em] = shift.endTime.split(":").map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  const duration = shift.defaultDurationMinutes;
  const times: string[] = [];
  for (let m = startMinutes; m + duration <= endMinutes; m += 30) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    times.push(`${hh}:${mm}`);
  }
  return times;
}

export function buildPublicTimeSlots(
  date: string,
  shift: ServiceShift,
  tables: RestaurantTable[],
  reservations: Reservation[],
  bufferMinutes: number,
  guestCount = 2,
): PublicTimeSlot[] {
  const times = shiftSlotTimes(shift);
  return times.map((time, index) => {
    const startAt = new Date(`${date}T${time}:00+02:00`).toISOString();
    const end = new Date(`${date}T${time}:00+02:00`);
    end.setMinutes(end.getMinutes() + shift.defaultDurationMinutes);
    const endAt = end.toISOString();

    const tableId = suggestTableId(
      guestCount,
      startAt,
      endAt,
      tables,
      reservations,
      bufferMinutes,
    );
    const available = tableId !== null;

    return {
      id: `slot-${shift.id}-${index}`,
      startAt,
      endAt,
      available,
      reason: available ? undefined : "No table available for this time",
    };
  });
}

export function newId(prefix: string): string {
  const part = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return `${prefix}-${part}`;
}
