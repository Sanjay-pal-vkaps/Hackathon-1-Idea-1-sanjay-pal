import type { PublicBookingRepository } from "@/lib/domain/repositories/types";

type SubmitInput = Parameters<
  PublicBookingRepository["submitGuestBooking"]
>[0];

export class SupabasePublicBookingRepository implements PublicBookingRepository {
  async listAvailableDates(from: string, to: string) {
    const params = new URLSearchParams({ from, to });
    const res = await fetch(`/api/booking/dates?${params}`);
    if (!res.ok) throw new Error("Failed to load dates");
    return (await res.json()) as string[];
  }

  async listTimeSlots(date: string, serviceShiftId: string, guestCount = 2) {
    const params = new URLSearchParams({
      date,
      shiftId: serviceShiftId,
      guestCount: String(guestCount),
    });
    const res = await fetch(`/api/booking/slots?${params}`);
    if (!res.ok) throw new Error("Failed to load time slots");
    return (await res.json()) as Awaited<
      ReturnType<PublicBookingRepository["listTimeSlots"]>
    >;
  }

  async suggestTable(guestCount: number, startAt: string, endAt: string) {
    const res = await fetch("/api/booking/suggest-table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestCount, startAt, endAt }),
    });
    if (!res.ok) throw new Error("Failed to suggest table");
    const body = (await res.json()) as { tableId: string | null };
    return body.tableId;
  }

  async submitGuestBooking(input: SubmitInput) {
    const res = await fetch("/api/booking/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? "Booking failed");
    }
    return (await res.json()) as Awaited<
      ReturnType<PublicBookingRepository["submitGuestBooking"]>
    >;
  }
}
