import { NextResponse } from "next/server";

import { resolveReservationIdByLinkToken } from "@/lib/booking/reservation-link-token";
import { mapReservationRow, type ReservationRow } from "@/lib/data/mappers";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const RESERVATION_SELECT = "*, reservation_tables(table_id)";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;
    const supabase = createSupabaseServiceClient();
    const reservationId = await resolveReservationIdByLinkToken(supabase, token);

    if (!reservationId) {
      return NextResponse.json({ error: "Link not valid or expired" }, { status: 404 });
    }

    const { data: reservationRow, error: resError } = await supabase
      .from("reservations")
      .select(RESERVATION_SELECT)
      .eq("id", reservationId)
      .maybeSingle();

    if (resError) {
      return NextResponse.json({ error: resError.message }, { status: 500 });
    }
    if (!reservationRow) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    const reservation = mapReservationRow(reservationRow as ReservationRow);

    const { data: customerRow, error: custError } = await supabase
      .from("customers")
      .select("id, full_name")
      .eq("id", reservation.customerId)
      .maybeSingle();

    if (custError) {
      return NextResponse.json({ error: custError.message }, { status: 500 });
    }

    const guestName =
      (customerRow?.full_name as string | undefined)?.trim() || "Guest";

    return NextResponse.json({
      reservation,
      guestName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
