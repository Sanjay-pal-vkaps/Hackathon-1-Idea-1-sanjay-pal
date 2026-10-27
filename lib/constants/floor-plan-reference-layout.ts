import type { RestaurantTable } from "@/lib/domain/types";

/** Architectural restaurant floor background from UI_REFERENCES/tables */
export const FLOOR_PLAN_REFERENCE_BG = {
  src: "/floor-plan-background.png",
  width: 800,
  height: 615,
} as const;

/**
 * Natural dining table centers and dimensions on the 800×615 floor plan.
 * Spaced out with clear corridors, window tables, and central dining rows.
 */
export const REFERENCE_MARKER_BY_NUMBER: Record<
  number,
  {
    cx: number;
    cy: number;
    hitR: number;
    shape: "circle" | "rect";
    width: number;
    height: number;
  }
> = {
  // Top Row (near bar/top counter)
  14: { cx: 235, cy: 130, hitR: 28, shape: "circle", width: 50, height: 50 },
  1: { cx: 345, cy: 130, hitR: 30, shape: "circle", width: 54, height: 54 },
  2: { cx: 455, cy: 130, hitR: 30, shape: "circle", width: 54, height: 54 },
  10: { cx: 565, cy: 130, hitR: 34, shape: "rect", width: 68, height: 50 },

  // Left Window Hallway Tables
  4: { cx: 95, cy: 185, hitR: 28, shape: "circle", width: 48, height: 48 },
  5: { cx: 95, cy: 305, hitR: 32, shape: "rect", width: 60, height: 50 },
  9: { cx: 95, cy: 430, hitR: 28, shape: "circle", width: 50, height: 50 },

  // Middle Dining Row 1 (Central Hall)
  6: { cx: 245, cy: 250, hitR: 42, shape: "rect", width: 84, height: 54 },
  3: { cx: 395, cy: 250, hitR: 36, shape: "rect", width: 74, height: 52 },
  7: { cx: 540, cy: 250, hitR: 30, shape: "circle", width: 56, height: 56 },

  // Middle Dining Row 2
  11: { cx: 245, cy: 365, hitR: 30, shape: "circle", width: 54, height: 54 },
  8: { cx: 350, cy: 365, hitR: 36, shape: "rect", width: 72, height: 52 },
  12: { cx: 460, cy: 365, hitR: 36, shape: "rect", width: 72, height: 52 },

  // Lower Row (near bottom & alcove)
  15: { cx: 360, cy: 465, hitR: 36, shape: "rect", width: 76, height: 52 },
  13: { cx: 550, cy: 465, hitR: 42, shape: "rect", width: 88, height: 54 },
};

export function referenceCenterForTable(table: RestaurantTable) {
  const ref = REFERENCE_MARKER_BY_NUMBER[table.number];
  if (ref) {
    return {
      cx: ref.cx,
      cy: ref.cy,
      hitR: ref.hitR,
      shape: ref.shape,
      width: ref.width,
      height: ref.height,
    };
  }
  const cx = table.layout.x + table.layout.width / 2;
  const cy = table.layout.y + table.layout.height / 2;
  const hitR = Math.max(table.layout.width, table.layout.height) / 2 + 6;
  return {
    cx,
    cy,
    hitR,
    shape: table.shape === "circle" ? ("circle" as const) : ("rect" as const),
    width: table.layout.width,
    height: table.layout.height,
  };
}

export function applyReferenceLayoutToTables(
  tables: RestaurantTable[],
  force = false,
): RestaurantTable[] {
  return tables.map((table) => {
    // If not forcing reset and table already has valid saved coordinates, preserve them!
    if (!force && table.layout && (table.layout.x > 0 || table.layout.y > 0)) {
      return table;
    }
    const ref = REFERENCE_MARKER_BY_NUMBER[table.number];
    if (!ref) return table;
    return {
      ...table,
      layout: {
        ...table.layout,
        x: ref.cx - ref.width / 2,
        y: ref.cy - ref.height / 2,
        width: ref.width,
        height: ref.height,
      },
    };
  });
}
