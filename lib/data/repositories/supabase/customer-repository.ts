import type { CustomerRepository } from "@/lib/domain/repositories/types";
import { mapCustomerRow } from "@/lib/data/mappers";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export class SupabaseCustomerRepository implements CustomerRepository {
  private client = getSupabaseBrowserClient();

  async list() {
    const { data, error } = await this.client
      .from("customers")
      .select("*")
      .order("full_name");
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapCustomerRow);
  }

  async get(id: string) {
    const { data, error } = await this.client
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapCustomerRow(data) : null;
  }

  async create(input: {
    fullName: string;
    email: string;
    phone: string;
  }) {
    const trimmedEmail = input.email.trim().toLowerCase();
    const { data: existing } = await this.client
      .from("customers")
      .select("*")
      .eq("email", trimmedEmail)
      .maybeSingle();

    if (existing) {
      return mapCustomerRow(existing);
    }

    const { newId } = await import("@/lib/booking/engine");
    const id = newId("cust");
    const { data, error } = await this.client
      .from("customers")
      .insert({
        id,
        full_name: input.fullName.trim(),
        email: trimmedEmail,
        phone: input.phone.trim(),
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapCustomerRow(data);
  }
}
