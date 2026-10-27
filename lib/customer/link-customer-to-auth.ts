import type { SupabaseClient } from "@supabase/supabase-js";

import { newId } from "@/lib/booking/engine";
import {
  mapCustomerProfileRow,
  type CustomerProfileRow,
} from "@/lib/customer/map-customer-profile";

/** Links auth.users row to customers by auth id or existing guest email. */
export async function linkCustomerToAuthUser(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  profile?: { fullName?: string; phone?: string },
) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: byAuth } = await supabase
    .from("customers")
    .select("id, full_name, email, phone, auth_user_id")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (byAuth) {
    return mapCustomerProfileRow(byAuth as CustomerProfileRow);
  }

  const { data: byEmail } = await supabase
    .from("customers")
    .select("id, full_name, email, phone, auth_user_id")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (byEmail) {
    const { data: updated, error } = await supabase
      .from("customers")
      .update({
        auth_user_id: userId,
        ...(profile?.fullName ? { full_name: profile.fullName.trim() } : {}),
        ...(profile?.phone ? { phone: profile.phone.trim() } : {}),
      })
      .eq("id", byEmail.id)
      .select("id, full_name, email, phone, auth_user_id")
      .single();

    if (error) throw new Error(error.message);
    return mapCustomerProfileRow(updated as CustomerProfileRow);
  }

  const id = newId("cust");
  const { data: created, error: insertError } = await supabase
    .from("customers")
    .insert({
      id,
      auth_user_id: userId,
      full_name: profile?.fullName?.trim() || email.split("@")[0] || "Guest",
      email: normalizedEmail,
      phone: profile?.phone?.trim() || "",
    })
    .select("id, full_name, email, phone, auth_user_id")
    .single();

  if (insertError) throw new Error(insertError.message);
  return mapCustomerProfileRow(created as CustomerProfileRow);
}
