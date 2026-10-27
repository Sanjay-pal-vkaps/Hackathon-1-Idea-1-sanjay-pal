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
}
