import { createReservationLinkToken } from "@/lib/booking/reservation-link-token";
import { getAppBaseUrl } from "@/lib/notifications/app-url";
import { sendEmail } from "@/lib/notifications/send-email";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

export type ReservationEmailEvent =
  | "booking_confirmed"
  | "booking_pending"
  | "approved"
  | "rejected";

type ReservationEmailContext = {
  to: string;
  guestName: string;
  reservationId: string;
  guestCount: number;
  startAt: string;
  endAt: string;
  linkUrl: string;
};

async function loadGuestContext(
  reservationId: string,
): Promise<ReservationEmailContext | null> {
  const supabase = createSupabaseServiceClient();
  const { data: row, error } = await supabase
    .from("reservations")
    .select("id, start_at, end_at, guest_count, customers(full_name, email)")
    .eq("id", reservationId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!row) return null;

  const customer = row.customers as
    | { full_name: string; email: string }
    | { full_name: string; email: string }[]
    | null;
  const guest = Array.isArray(customer) ? customer[0] : customer;
  if (!guest?.email) return null;

  const { data: tokenRow } = await supabase
    .from("reservation_link_tokens")
    .select("token")
    .eq("reservation_id", reservationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let token = tokenRow?.token as string | undefined;
  if (!token) {
    token = await createReservationLinkToken(supabase, reservationId);
  }

  const base = getAppBaseUrl();
  return {
    to: guest.email.trim().toLowerCase(),
    guestName: guest.full_name.trim() || "Guest",
    reservationId,
    guestCount: row.guest_count as number,
    startAt: row.start_at as string,
    endAt: row.end_at as string,
    linkUrl: `${base}/book/link/${token}`,
  };
}

function subjectFor(event: ReservationEmailEvent, ctx: ReservationEmailContext) {
  const when = formatReservationDate(ctx.startAt);
  switch (event) {
    case "booking_confirmed":
      return `Iturrieta — reservation confirmed (${when})`;
    case "booking_pending":
      return `Iturrieta — booking request received (${when})`;
    case "approved":
      return `Iturrieta — your booking is confirmed (${when})`;
    case "rejected":
      return `Iturrieta — update on your booking request (${when})`;
  }
}

function bodyFor(event: ReservationEmailEvent, ctx: ReservationEmailContext) {
  const time = formatReservationTimeRange(ctx.startAt, ctx.endAt);
  const date = formatReservationDate(ctx.startAt);
  const detail = `${ctx.guestCount} guests · ${date}, ${time}`;

  const message =
    event === "booking_confirmed" || event === "approved"
      ? `Your table is confirmed (${detail}).`
      : event === "booking_pending"
        ? `We received your booking request (${detail}). A manager will review it shortly.`
        : `We could not confirm your request (${detail}). Please choose another time or contact the restaurant.`;

  const text = `Hi ${ctx.guestName},\n\n${message}\n\nReference: ${ctx.reservationId}\nView booking: ${ctx.linkUrl}\n\n— Iturrieta`;

  const statusLine =
    event === "booking_pending"
      ? "Pending approval"
      : event === "rejected"
        ? "Not confirmed"
        : "Confirmed";

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a">
<p>Hi ${escapeHtml(ctx.guestName)},</p>
<p>${escapeHtml(message)}</p>
<p><strong>Status:</strong> ${escapeHtml(statusLine)}</p>
<p><strong>Reference:</strong> ${escapeHtml(ctx.reservationId)}</p>
<p><a href="${escapeHtml(ctx.linkUrl)}">View your booking</a></p>
<p style="color:#666;font-size:14px">— Iturrieta</p>
</body></html>`;

  return { text, html };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Best-effort guest email; never throws (logs on failure). */
export async function sendReservationEmail(
  reservationId: string,
  event: ReservationEmailEvent,
): Promise<void> {
  try {
    const ctx = await loadGuestContext(reservationId);
    if (!ctx) return;

    const { text, html } = bodyFor(event, ctx);
    const result = await sendEmail({
      to: ctx.to,
      subject: subjectFor(event, ctx),
      html,
      text,
    });

    if (!result.ok) {
      console.error("[email] reservation notify failed:", result.error);
    }
  } catch (err) {
    console.error("[email] reservation notify error:", err);
  }
}
