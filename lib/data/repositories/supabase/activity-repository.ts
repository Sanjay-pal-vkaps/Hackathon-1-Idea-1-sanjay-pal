import type { ActivityRepository } from "@/lib/domain/repositories/types";
import { mapActivityRow } from "@/lib/data/mappers";
import { newId } from "@/lib/booking/engine";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export class SupabaseActivityRepository implements ActivityRepository {
  private client = getSupabaseBrowserClient();

  async listRecent(limit = 20) {
    const { data, error } = await this.client
      .from("activity_events")
      .select("*")
      .order("occurred_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapActivityRow);
  }

  async append(event: Parameters<ActivityRepository["append"]>[0]) {
    const row = {
      id: newId("act"),
      type: event.type,
      message: event.message,
      occurred_at: new Date().toISOString(),
      reservation_id: event.reservationId ?? null,
      table_id: event.tableId ?? null,
    };
    const { data, error } = await this.client
      .from("activity_events")
      .insert(row)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapActivityRow(data);
  }
}
