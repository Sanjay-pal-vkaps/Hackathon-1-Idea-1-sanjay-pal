import type { SupabaseClient } from "@supabase/supabase-js";

import { newId } from "@/lib/booking/engine";
import { mapReservationRow, type ReservationRow } from "@/lib/data/mappers";

export type RejectPendingResult =
  | { ok: true; reservationId: string }
  | { ok: false; reason: "not_found" | "not_pending" };

export async function rejectPendingReservation(
  supabase: SupabaseClient,
  reservationId: string,
): Promise<RejectPendingResult> {
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

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("reservations")
    .update({ status: "rejected", updated_at: now })
    .eq("id", reservationId);

  if (updateError) throw new Error(updateError.message);

  await supabase.from("activity_events").insert({
    id: newId("act"),
    type: "reservation_updated",
    message: `Rejected ${reservationId}`,
    occurred_at: now,
    reservation_id: reservationId,
    table_id: null,
  });

  return { ok: true, reservationId };
}
