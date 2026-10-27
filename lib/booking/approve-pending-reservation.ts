import type { SupabaseClient } from "@supabase/supabase-js";

import { newId, suggestTableId } from "@/lib/booking/engine";
import { mapReservationRow, type ReservationRow } from "@/lib/data/mappers";
import { loadBookingEngineContext } from "@/lib/booking/server-context";
import { sendReservationEmail } from "@/lib/notifications/reservation-email";

export type ApprovePendingResult =
  | { ok: true; reservationId: string; tableId: string }
  | { ok: false; reason: "not_found" | "not_pending" | "no_table" };

export async function approvePendingReservation(
  supabase: SupabaseClient,
  reservationId: string,
): Promise<ApprovePendingResult> {
  const { data: row, error } = await supabase
    .from("reservations")
    .select("*, reservation_tables(table_id)")
    .eq("id", reservationId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!row) return { ok: false, reason: "not_found" };

  const reservation = mapReservationRow(row as ReservationRow);
  if (reservation.status !== "pending") {
    return { ok: false, reason: "not_pending" };
  }

  const ctx = await loadBookingEngineContext(supabase);
  const tableId = suggestTableId(
    reservation.guestCount,
    reservation.startAt,
    reservation.endAt,
    ctx.tables,
    ctx.reservations.filter((r) => r.id !== reservationId),
    ctx.settings.cleaningBufferMinutes,
  );

  if (!tableId) {
    return { ok: false, reason: "no_table" };
  }

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("reservations")
    .update({ status: "confirmed", updated_at: now })
    .eq("id", reservationId);

  if (updateError) throw new Error(updateError.message);

  await supabase
    .from("reservation_tables")
    .delete()
    .eq("reservation_id", reservationId);

  const { error: linkError } = await supabase.from("reservation_tables").insert({
    reservation_id: reservationId,
    table_id: tableId,
  });
  if (linkError) throw new Error(linkError.message);

  await supabase.from("activity_events").insert({
    id: newId("act"),
    type: "reservation_updated",
    message: `Approved ${reservationId} → table ${tableId}`,
    occurred_at: now,
    reservation_id: reservationId,
    table_id: tableId,
  });

  void sendReservationEmail(reservationId, "approved");

  return { ok: true, reservationId, tableId };
}
