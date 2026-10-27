import type { SupabaseClient } from "@supabase/supabase-js";

import type { Customer } from "@/lib/domain/types";
import {
  mapCustomerProfileRow,
  type CustomerProfileRow,
} from "@/lib/customer/map-customer-profile";

export async function loadCustomerProfileForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, email, phone, auth_user_id")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapCustomerProfileRow(data as CustomerProfileRow);
}
