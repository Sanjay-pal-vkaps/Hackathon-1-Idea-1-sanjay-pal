import type { MockRepositories } from "@/lib/domain/repositories/types";
import { MockActivityRepository } from "@/lib/mock/repositories/mock-activity-repository";
import { MockCustomerRepository } from "@/lib/mock/repositories/mock-customer-repository";
import { MockDashboardRepository } from "@/lib/mock/repositories/mock-dashboard-repository";
import { MockPublicBookingRepository } from "@/lib/mock/repositories/mock-public-booking-repository";
import { MockReservationRepository } from "@/lib/mock/repositories/mock-reservation-repository";
import { MockSettingsRepository } from "@/lib/mock/repositories/mock-settings-repository";
import { MockTableRepository } from "@/lib/mock/repositories/mock-table-repository";

let instance: MockRepositories | null = null;

export function getMockRepositories(): MockRepositories {
  if (!instance) {
    instance = {
      tables: new MockTableRepository(),
      reservations: new MockReservationRepository(),
      customers: new MockCustomerRepository(),
      settings: new MockSettingsRepository(),
      activity: new MockActivityRepository(),
      dashboard: new MockDashboardRepository(),
      publicBooking: new MockPublicBookingRepository(),
    };
  }
  return instance;
}
