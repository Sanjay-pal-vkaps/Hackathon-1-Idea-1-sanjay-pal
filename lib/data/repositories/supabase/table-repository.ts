import type { TableRepository } from "@/lib/domain/repositories/types";
import type { RestaurantTable, TableStatus } from "@/lib/domain/types";
import { mapTableRow, type TableRow } from "@/lib/data/mappers";
import { DEMO_TABLES_SEED } from "@/lib/seed/demo-tables";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export class SupabaseTableRepository implements TableRepository {
  private client = getSupabaseBrowserClient();

  async listFloors() {
    const { data, error } = await this.client.from("floors").select("id, name");
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async listTables(floorId?: string) {
    let query = this.client.from("restaurant_tables").select("*");
    if (floorId) query = query.eq("floor_id", floorId);
    const { data, error } = await query.order("number");
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapTableRow(row as TableRow));
  }

  async getTable(id: string) {
    const { data, error } = await this.client
      .from("restaurant_tables")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapTableRow(data as TableRow) : null;
  }

  async updateTableLayout(tableId: string, layout: RestaurantTable["layout"]) {
    const { data, error } = await this.client
      .from("restaurant_tables")
      .update({
        floor_id: layout.floorId,
        layout_x: layout.x,
        layout_y: layout.y,
        layout_width: layout.width,
        layout_height: layout.height,
        layout_rotation: layout.rotation ?? null,
      })
      .eq("id", tableId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapTableRow(data as TableRow);
  }

  async updateTableStatus(tableId: string, status: TableStatus) {
    const { data, error } = await this.client
      .from("restaurant_tables")
      .update({ status })
      .eq("id", tableId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapTableRow(data as TableRow);
  }

  async resetDemoLayout(floorId: string) {
    const seed = DEMO_TABLES_SEED.filter((t) => t.layout.floorId === floorId);
    for (const table of seed) {
      const { error } = await this.client
        .from("restaurant_tables")
        .update({
          layout_x: table.layout.x,
          layout_y: table.layout.y,
          layout_width: table.layout.width,
          layout_height: table.layout.height,
          layout_rotation: table.layout.rotation ?? null,
        })
        .eq("id", table.id);
      if (error) throw new Error(error.message);
    }
    return this.listTables(floorId);
  }
}
