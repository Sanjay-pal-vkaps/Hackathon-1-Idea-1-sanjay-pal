import { createDemoReservations } from "@/lib/mock/fixtures/reservations";
import { createDemoTables } from "@/lib/mock/fixtures/tables";
import { DEMO_ACTIVITY_SEED } from "@/lib/mock/fixtures/activity";
import { DEMO_BOOKING_SETTINGS } from "@/lib/mock/fixtures/settings";
import type {
  ActivityEvent,
  BookingSettings,
  Reservation,
  RestaurantTable,
} from "@/lib/domain/types";

/** In-memory mutable store for Phase 1 mock repositories */
class MockStore {
  tables: RestaurantTable[] = createDemoTables();
  tablesSeed = createDemoTables();
  reservations: Reservation[] = createDemoReservations();
  activity: ActivityEvent[] = [...DEMO_ACTIVITY_SEED];
  bookingSettings: BookingSettings = { ...DEMO_BOOKING_SETTINGS };
}

const globalForMock = globalThis as unknown as { __iturrietaMockStore?: MockStore };

export function getMockStore(): MockStore {
  if (!globalForMock.__iturrietaMockStore) {
    globalForMock.__iturrietaMockStore = new MockStore();
  }
  return globalForMock.__iturrietaMockStore;
}

export function cloneTableLayoutSeed(floorId: string): RestaurantTable[] {
  return getMockStore().tablesSeed.filter((t) => t.layout.floorId === floorId);
}
