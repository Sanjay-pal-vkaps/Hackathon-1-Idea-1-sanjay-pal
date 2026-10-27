import type { SupabaseClient } from "@supabase/supabase-js";

import type { StaffProfile } from "@/lib/domain/types";
import {
  mapStaffProfileRow,
  type StaffProfileRow,
} from "@/lib/staff/map-profile";

export async function loadStaffProfileForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<StaffProfile | null> {
  const { data, error } = await supabase
    .from("staff_profiles")
    .select("id, user_id, display_name, email, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapStaffProfileRow(data as StaffProfileRow);
}
