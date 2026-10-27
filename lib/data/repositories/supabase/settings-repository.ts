import type { SettingsRepository } from "@/lib/domain/repositories/types";
import type { BookingSettings } from "@/lib/domain/types";
import {
  mapBookingSettingsRow,
  mapServiceShiftRow,
} from "@/lib/data/mappers";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export class SupabaseSettingsRepository implements SettingsRepository {
  private client = getSupabaseBrowserClient();

  async getBookingSettings() {
    const { data, error } = await this.client
      .from("booking_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (error) throw new Error(error.message);
    return mapBookingSettingsRow(data);
  }

  async updateBookingSettings(patch: Partial<BookingSettings>) {
    const { data, error } = await this.client
      .from("booking_settings")
      .update({
        ...("onlineGuestLimit" in patch
          ? { online_guest_limit: patch.onlineGuestLimit }
          : {}),
        ...("cleaningBufferMinutes" in patch
          ? { cleaning_buffer_minutes: patch.cleaningBufferMinutes }
          : {}),
        ...("timezone" in patch ? { timezone: patch.timezone } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapBookingSettingsRow(data);
  }

  async listServiceShifts() {
    const { data, error } = await this.client
      .from("service_shifts")
      .select("*")
      .order("start_time");
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapServiceShiftRow);
  }
}
