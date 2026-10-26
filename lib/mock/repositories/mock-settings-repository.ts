import type { SettingsRepository } from "@/lib/domain/repositories/types";
import type { BookingSettings } from "@/lib/domain/types";
import { DEMO_SERVICE_SHIFTS } from "@/lib/mock/fixtures/settings";
import { getMockStore } from "@/lib/mock/store";

export class MockSettingsRepository implements SettingsRepository {
  async getBookingSettings() {
    return { ...getMockStore().bookingSettings };
  }

  async updateBookingSettings(patch: Partial<BookingSettings>) {
    const store = getMockStore();
    store.bookingSettings = { ...store.bookingSettings, ...patch };
    return { ...store.bookingSettings };
  }

  async listServiceShifts() {
    return [...DEMO_SERVICE_SHIFTS];
  }
}
