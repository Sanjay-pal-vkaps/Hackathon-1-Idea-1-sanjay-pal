import type { PublicBookingRepository } from "@/lib/domain/repositories/types";
import { DEMO_BOOKING_SETTINGS } from "@/lib/mock/fixtures/settings";
import { getMockStore } from "@/lib/mock/store";

export class MockPublicBookingRepository implements PublicBookingRepository {
  async listAvailableDates(from: string, to: string) {
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

  async listTimeSlots(date: string, serviceShiftId: string) {
    const base =
      serviceShiftId === "shift-lunch"
        ? ["13:00", "13:30", "14:00", "14:30"]
        : ["19:00", "19:30", "20:00", "20:30"];
    return base.map((time, index) => {
      const startAt = new Date(`${date}T${time}:00+02:00`).toISOString();
      const end = new Date(`${date}T${time}:00+02:00`);
      end.setMinutes(end.getMinutes() + 120);
      return {
        id: `slot-${serviceShiftId}-${index}`,
        startAt,
        endAt: end.toISOString(),
        available: index !== 2,
        reason: index === 2 ? "Demo: slot fully booked" : undefined,
      };
    });
  }

  async suggestTable(guestCount: number, startAt: string, endAt: string) {
    void startAt;
    void endAt;
    const table = getMockStore().tables.find(
      (t) =>
        t.active &&
        t.status === "available" &&
        guestCount >= t.capacityMin &&
        guestCount <= t.capacityMax,
    );
    return table?.id ?? null;
  }

  getGuestLimit() {
    return DEMO_BOOKING_SETTINGS.onlineGuestLimit;
  }
}
