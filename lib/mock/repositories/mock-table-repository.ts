import type { TableRepository } from "@/lib/domain/repositories/types";
import type { RestaurantTable, TableStatus } from "@/lib/domain/types";
import { DEMO_FLOORS } from "@/lib/mock/fixtures/floors";
import { cloneTableLayoutSeed, getMockStore } from "@/lib/mock/store";

export class MockTableRepository implements TableRepository {
  async listFloors() {
    return DEMO_FLOORS;
  }

  async listTables(floorId?: string) {
    const store = getMockStore();
    if (!floorId) return [...store.tables];
    return store.tables.filter((t) => t.layout.floorId === floorId);
  }

  async getTable(id: string) {
    return getMockStore().tables.find((t) => t.id === id) ?? null;
  }

  async updateTableLayout(tableId: string, layout: RestaurantTable["layout"]) {
    const store = getMockStore();
    const index = store.tables.findIndex((t) => t.id === tableId);
    if (index === -1) throw new Error(`Demo table not found: ${tableId}`);
    store.tables[index] = { ...store.tables[index], layout: { ...layout } };
    return store.tables[index];
  }

  async updateTableStatus(tableId: string, status: TableStatus) {
    const store = getMockStore();
    const index = store.tables.findIndex((t) => t.id === tableId);
    if (index === -1) throw new Error(`Demo table not found: ${tableId}`);
    store.tables[index] = { ...store.tables[index], status };
    return store.tables[index];
  }

  async resetDemoLayout(floorId: string) {
    const store = getMockStore();
    const seed = cloneTableLayoutSeed(floorId);
    store.tables = store.tables.map((table) => {
      const match = seed.find((s) => s.id === table.id);
      if (!match) return table;
      return { ...table, layout: { ...match.layout } };
    });
    return store.tables.filter((t) => t.layout.floorId === floorId);
  }
}
