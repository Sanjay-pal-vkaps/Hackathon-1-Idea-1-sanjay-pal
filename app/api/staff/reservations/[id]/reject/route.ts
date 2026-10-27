import { NextResponse } from "next/server";

import { rejectPendingReservation } from "@/lib/booking/reject-pending-reservation";
import { sendReservationEmail } from "@/lib/notifications/reservation-email";
import { requireStaffApi } from "@/lib/staff/require-staff-api";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireStaffApi("approve_pending");
  if ("error" in auth) return auth.error;

  const { id } = await context.params;

  try {
    const result = await rejectPendingReservation(auth.supabase, id);
    if (!result.ok) {
      const status = result.reason === "not_found" ? 404 : 409;
      const message =
        result.reason === "not_pending"
          ? "Reservation is not pending approval."
          : "Reservation not found.";
      return NextResponse.json({ error: message, reason: result.reason }, { status });
    }

    void sendReservationEmail(id, "rejected");

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Reject failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
