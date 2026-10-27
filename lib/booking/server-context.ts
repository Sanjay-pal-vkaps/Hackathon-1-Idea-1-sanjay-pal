import type { SupabaseClient } from "@supabase/supabase-js";

import { buildPublicTimeSlots } from "@/lib/booking/engine";
import {
  mapBookingSettingsRow,
  mapReservationRow,
  mapServiceShiftRow,
  mapTableRow,
  type ReservationRow,
  type TableRow,
} from "@/lib/data/mappers";

export async function loadBookingEngineContext(supabase: SupabaseClient) {
  const [
    { data: settingsRow },
    { data: shiftRows },
    { data: tableRows },
    { data: reservationRows },
  ] = await Promise.all([
    supabase
      .from("booking_settings")
      .select("online_guest_limit, cleaning_buffer_minutes, timezone")
      .eq("id", 1)
      .single(),
    supabase.from("service_shifts").select("*"),
    supabase.from("restaurant_tables").select("*"),
    supabase
      .from("reservations")
      .select("*, reservation_tables(table_id)"),
  ]);

  if (!settingsRow) {
    throw new Error("Booking settings not configured");
  }

  return {
    settings: mapBookingSettingsRow(settingsRow),
    shifts: (shiftRows ?? []).map(mapServiceShiftRow),
    tables: (tableRows ?? []).map((r) => mapTableRow(r as TableRow)),
    reservations: (reservationRows ?? []).map((r) =>
      mapReservationRow(r as ReservationRow),
    ),
  };
}

export async function getPublicTimeSlots(
  supabase: SupabaseClient,
  date: string,
  serviceShiftId: string,
  guestCount = 2,
) {
  const ctx = await loadBookingEngineContext(supabase);
  const shift = ctx.shifts.find((s) => s.id === serviceShiftId);
  if (!shift) return [];
  return buildPublicTimeSlots(
    date,
    shift,
    ctx.tables,
    ctx.reservations,
    ctx.settings.cleaningBufferMinutes,
    guestCount,
  );
}
