import type { SupabaseClient } from "@supabase/supabase-js";

import type { GuestBookingResultKind } from "@/lib/domain/repositories/types";
import { newId, suggestTableId } from "@/lib/booking/engine";
import { createReservationLinkToken } from "@/lib/booking/reservation-link-token";
import { sendReservationEmail } from "@/lib/notifications/reservation-email";
import {
  mapBookingSettingsRow,
  mapReservationRow,
  mapTableRow,
  type ReservationRow,
  type TableRow,
} from "@/lib/data/mappers";

export async function submitGuestBooking(
  supabase: SupabaseClient,
  input: {
    fullName: string;
    email: string;
    phone: string;
    notes?: string;
    guestCount: number;
    startAt: string;
    endAt: string;
  },
): Promise<{
  kind: GuestBookingResultKind;
  reservationId?: string;
  linkToken?: string;
}> {
  const { data: settingsRow } = await supabase
    .from("booking_settings")
    .select("online_guest_limit, cleaning_buffer_minutes, timezone")
    .eq("id", 1)
    .single();

  if (!settingsRow) {
    return { kind: "unavailable" };
  }

  const settings = mapBookingSettingsRow(settingsRow);

  const [{ data: tableRows }, { data: reservationRows }] = await Promise.all([
    supabase.from("restaurant_tables").select("*"),
    supabase
      .from("reservations")
      .select("*, reservation_tables(table_id)"),
  ]);

  const tables = (tableRows ?? []).map((r) => mapTableRow(r as TableRow));
  const reservations = (reservationRows ?? []).map((r) =>
    mapReservationRow(r as ReservationRow),
  );

  const tableId = suggestTableId(
    input.guestCount,
    input.startAt,
    input.endAt,
    tables,
    reservations,
    settings.cleaningBufferMinutes,
  );

  if (!tableId) {
    return { kind: "unavailable" };
  }

  const overLimit = input.guestCount > settings.onlineGuestLimit;
  const status = overLimit ? "pending" : "confirmed";
  const kind: GuestBookingResultKind = overLimit ? "pending" : "confirmed";

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", input.email.trim().toLowerCase())
    .maybeSingle();

  let customerId = existingCustomer?.id as string | undefined;

  if (!customerId) {
    customerId = newId("cust");
    const { error: customerError } = await supabase.from("customers").insert({
      id: customerId,
      full_name: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
    });
    if (customerError) {
      throw new Error(customerError.message);
    }
  }

  const reservationId = newId("res");
  const now = new Date().toISOString();

  const { error: resError } = await supabase.from("reservations").insert({
    id: reservationId,
    customer_id: customerId,
    start_at: input.startAt,
    end_at: input.endAt,
    guest_count: input.guestCount,
    status,
    source: "online",
    notes: input.notes?.trim() || null,
    created_at: now,
    updated_at: now,
  });

  if (resError) {
    throw new Error(resError.message);
  }

  if (status === "confirmed") {
    const { error: linkError } = await supabase.from("reservation_tables").insert({
      reservation_id: reservationId,
      table_id: tableId,
    });
    if (linkError) {
      throw new Error(linkError.message);
    }
  }

  await supabase.from("activity_events").insert({
    id: newId("act"),
    type: "reservation_created",
    message: input.fullName.trim(),
    occurred_at: now,
    reservation_id: reservationId,
    table_id: status === "confirmed" ? tableId : null,
  });

  const linkToken = await createReservationLinkToken(supabase, reservationId);

  void sendReservationEmail(
    reservationId,
    kind === "pending" ? "booking_pending" : "booking_confirmed",
  );

  return { kind, reservationId, linkToken };
}
