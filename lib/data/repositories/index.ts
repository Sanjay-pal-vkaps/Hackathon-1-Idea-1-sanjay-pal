import type { AppRepositories } from "@/lib/domain/repositories/types";
import { SupabaseActivityRepository } from "@/lib/data/repositories/supabase/activity-repository";
import { SupabaseCustomerRepository } from "@/lib/data/repositories/supabase/customer-repository";
import { SupabaseDashboardRepository } from "@/lib/data/repositories/supabase/dashboard-repository";
import { SupabasePublicBookingRepository } from "@/lib/data/repositories/supabase/public-booking-repository";
import { SupabaseReservationRepository } from "@/lib/data/repositories/supabase/reservation-repository";
import { SupabaseSettingsRepository } from "@/lib/data/repositories/supabase/settings-repository";
import { SupabaseTableRepository } from "@/lib/data/repositories/supabase/table-repository";

let instance: AppRepositories | null = null;

export function getRepositories(): AppRepositories {
  if (!instance) {
    instance = {
      tables: new SupabaseTableRepository(),
      reservations: new SupabaseReservationRepository(),
      customers: new SupabaseCustomerRepository(),
      settings: new SupabaseSettingsRepository(),
      activity: new SupabaseActivityRepository(),
      dashboard: new SupabaseDashboardRepository(),
      publicBooking: new SupabasePublicBookingRepository(),
    };
  }
  return instance;
}
