import { createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  mapBookingSettingsRow,
  mapReservationRow,
  mapServiceShiftRow,
  mapTableRow,
  type ReservationRow,
  type TableRow,
} from "@/lib/data/mappers";
import type {
  BookingSettings,
  Reservation,
  RestaurantTable,
  ServiceShift,
} from "@/lib/domain/types";

export async function loadBookingContext() {
  const supabase = createSupabaseServiceClient();

  const [tablesRes, reservationsRes, settingsRes, shiftsRes] = await Promise.all([
    supabase.from("restaurant_tables").select("*"),
    supabase
      .from("reservations")
      .select("*, reservation_tables(table_id)"),
    supabase.from("booking_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("service_shifts").select("*"),
  ]);

  if (tablesRes.error) throw tablesRes.error;
  if (reservationsRes.error) throw reservationsRes.error;
  if (settingsRes.error) throw settingsRes.error;
  if (shiftsRes.error) throw shiftsRes.error;
  if (!settingsRes.data) throw new Error("booking_settings not configured");

  const tables = (tablesRes.data as TableRow[]).map(mapTableRow);
  const reservations = (reservationsRes.data as ReservationRow[]).map(
    mapReservationRow,
  );
  const settings = mapBookingSettingsRow(settingsRes.data);
  const shifts = shiftsRes.data.map(mapServiceShiftRow);

  return { tables, reservations, settings, shifts };
}

export type BookingContext = {
  tables: RestaurantTable[];
  reservations: Reservation[];
  settings: BookingSettings;
  shifts: ServiceShift[];
};
