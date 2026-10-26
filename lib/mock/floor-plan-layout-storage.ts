import type { RestaurantTable } from "@/lib/domain/types";

const storageKey = (floorId: string) => `iturrieta_floor_layout_${floorId}`;

export type StoredTableLayout = RestaurantTable["layout"];

export function readFloorLayoutFromStorage(
  floorId: string,
): Record<string, StoredTableLayout> | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(storageKey(floorId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, StoredTableLayout>;
  } catch {
    return null;
  }
}

export function writeFloorLayoutToStorage(
  floorId: string,
  tables: RestaurantTable[],
): void {
  if (typeof window === "undefined") return;
  const payload: Record<string, StoredTableLayout> = {};
  for (const table of tables) {
    if (table.layout.floorId === floorId) {
      payload[table.id] = { ...table.layout };
    }
  }
  window.localStorage.setItem(storageKey(floorId), JSON.stringify(payload));
}

export function clearFloorLayoutStorage(floorId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(floorId));
}

export function mergeStoredLayouts(
  tables: RestaurantTable[],
  floorId: string,
): RestaurantTable[] {
  const stored = readFloorLayoutFromStorage(floorId);
  if (!stored) return tables;
  return tables.map((table) => {
    const layout = stored[table.id];
    if (!layout) return table;
    return { ...table, layout: { ...layout } };
  });
}

export function hasStoredFloorLayout(floorId: string): boolean {
  return readFloorLayoutFromStorage(floorId) !== null;
}
