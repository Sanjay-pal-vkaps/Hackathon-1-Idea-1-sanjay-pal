import type { RestaurantTable } from "@/lib/domain/types";

/** Cropped floor map from UI_REFERENCES dashboard PNG (no duplicate toolbar) */
export const FLOOR_PLAN_REFERENCE_BG = {
  src: "/floor-plan-bg.png",
  width: 769,
  height: 420,
} as const;

/**
 * Hit / selection centers in floor-plan-bg pixel space (769×420).
 * Calibrated to baked markers in the reference image.
 */
export const REFERENCE_MARKER_BY_NUMBER: Record<
  number,
  { cx: number; cy: number; hitR: number; shape: "circle" | "rect" }
> = {
  1: { cx: 62, cy: 58, hitR: 32, shape: "rect" },
  2: { cx: 152, cy: 58, hitR: 32, shape: "rect" },
  3: { cx: 432, cy: 84, hitR: 34, shape: "rect" },
  4: { cx: 268, cy: 144, hitR: 28, shape: "rect" },
  5: { cx: 72, cy: 204, hitR: 32, shape: "rect" },
  6: { cx: 186, cy: 224, hitR: 40, shape: "rect" },
  7: { cx: 328, cy: 44, hitR: 28, shape: "circle" },
  8: { cx: 342, cy: 238, hitR: 30, shape: "circle" },
  9: { cx: 402, cy: 44, hitR: 28, shape: "circle" },
  10: { cx: 518, cy: 54, hitR: 34, shape: "rect" },
  11: { cx: 92, cy: 334, hitR: 38, shape: "rect" },
  12: { cx: 198, cy: 340, hitR: 28, shape: "circle" },
  13: { cx: 584, cy: 62, hitR: 28, shape: "circle" },
  14: { cx: 360, cy: 354, hitR: 40, shape: "rect" },
  15: { cx: 478, cy: 334, hitR: 32, shape: "rect" },
};

export function referenceCenterForTable(table: RestaurantTable) {
  const cx = table.layout.x + table.layout.width / 2;
  const cy = table.layout.y + table.layout.height / 2;
  const hitR = Math.max(table.layout.width, table.layout.height) / 2 + 6;
  return {
    cx,
    cy,
    hitR,
    shape: table.shape === "circle" ? ("circle" as const) : ("rect" as const),
  };
}

export function applyReferenceLayoutToTables(
  tables: RestaurantTable[],
): RestaurantTable[] {
  return tables.map((table) => {
    const ref = REFERENCE_MARKER_BY_NUMBER[table.number];
    if (!ref) return table;
    const size = ref.shape === "rect" ? 56 : 52;
    return {
      ...table,
      layout: {
        ...table.layout,
        x: ref.cx - size / 2,
        y: ref.cy - size / 2,
        width: size,
        height: size,
      },
    };
  });
}
