import type { DashboardRepository } from "@/lib/domain/repositories/types";
import { getMockStore } from "@/lib/mock/store";
import { reservationDateKey } from "@/lib/utils/reservation-date";

export class MockDashboardRepository implements DashboardRepository {
  async getStats(forDate: string) {
    if (forDate === "2026-10-16") {
      return {
        reservationsCount: 28,
        reservationsTrendPercent: 12,
        totalGuests: 112,
        guestsTrendPercent: 18,
        occupancyPercent: 78,
        walkInsCount: 5,
      };
    }

    const reservations = getMockStore().reservations.filter(
      (r) => reservationDateKey(r.startAt) === forDate,
    );
    const active = reservations.filter((r) =>
      ["confirmed", "arrived", "pending"].includes(r.status),
    );
    const guests = active.reduce((sum, r) => sum + r.guestCount, 0);
    const dayOffset = forDate.split("-").reduce((sum, part) => sum + Number(part), 0);
    const occupancyPercent = Math.min(95, 62 + (dayOffset % 20));
    return {
      reservationsCount: active.length,
      reservationsTrendPercent: 8 + (dayOffset % 7),
      totalGuests: guests,
      guestsTrendPercent: 10 + (dayOffset % 9),
      occupancyPercent,
      walkInsCount: reservations.filter((r) => r.source === "walk_in").length,
    };
  }
}
