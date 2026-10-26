"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { TABLE_STATUS_CANVAS } from "@/lib/constants/table-status";
import {
  FLOOR_PLAN_REFERENCE_BG,
  referenceCenterForTable,
} from "@/lib/constants/floor-plan-reference-layout";
import type { FloorMeta, RestaurantTable } from "@/lib/domain/types";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, src: FLOOR_BG_SRC } =
  FLOOR_PLAN_REFERENCE_BG;

type FloorPlanCanvasProps = {
  tables: RestaurantTable[];
  selectedId: string | null;
  editMode: boolean;
  zoom: number;
  floors: FloorMeta[];
  floorId: string;
  onFloorChange: (floorId: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSelect: (id: string) => void;
  onLayoutChange: (id: string, layout: RestaurantTable["layout"]) => void;
};

function selectionOutline(
  ref: ReturnType<typeof referenceCenterForTable>,
  selected: boolean,
) {
  if (!selected) return null;
  if (ref.shape === "rect") {
    const w = 62;
    const h = 62;
    return (
      <rect
        x={ref.cx - w / 2 - 5}
        y={ref.cy - h / 2 - 5}
        width={w + 10}
        height={h + 10}
        rx={14}
        fill="none"
        stroke="white"
        strokeWidth={4}
        pointerEvents="none"
      />
    );
  }
  return (
    <circle
      cx={ref.cx}
      cy={ref.cy}
      r={ref.hitR + 8}
      fill="none"
      stroke="white"
      strokeWidth={4}
      pointerEvents="none"
    />
  );
}

function EditModeMarker({
  table,
  selected,
  onPointerDown,
}: {
  table: RestaurantTable;
  selected: boolean;
  onPointerDown: (e: PointerEvent) => void;
}) {
  const styles = TABLE_STATUS_CANVAS[table.status];
  const centerX = table.layout.x + table.layout.width / 2;
  const centerY = table.layout.y + table.layout.height / 2;
  const w = 56;
  const h = 56;
  const x = centerX - w / 2;
  const y = centerY - h / 2;
  const capacity = `${table.capacityMin}-${table.capacityMax}`;

  return (
    <g
      className="cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
    >
      {selected ? (
        <rect
          x={x - 8}
          y={y - 8}
          width={w + 16}
          height={h + 16}
          rx={16}
          fill="none"
          stroke="white"
          strokeWidth={4}
        />
      ) : null}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={styles.ring}
        fillOpacity={0.82}
        stroke={styles.ring}
        strokeWidth={2}
      />
      <circle cx={centerX} cy={centerY - 2} r={15} fill="white" />
      <text
        x={centerX}
        y={centerY - 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#252B25"
        fontSize={14}
        fontWeight={700}
        pointerEvents="none"
      >
        {table.number}
      </text>
      <text
        x={centerX}
        y={centerY + 20}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={10}
        fontWeight={600}
        pointerEvents="none"
      >
        {capacity}
      </text>
    </g>
  );
}

export function FloorPlanCanvas({
  tables,
  selectedId,
  editMode,
  zoom,
  floors,
  floorId,
  onFloorChange,
  onZoomIn,
  onZoomOut,
  onSelect,
  onLayoutChange,
}: FloorPlanCanvasProps) {
  const dragRef = useRef<{
    tableId: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const handlePointerDown = useCallback(
    (table: RestaurantTable, event: PointerEvent) => {
      if (!editMode) {
        onSelect(table.id);
        return;
      }
      event.preventDefault();
      (event.target as Element).setPointerCapture(event.pointerId);
      dragRef.current = {
        tableId: table.id,
        startX: event.clientX,
        startY: event.clientY,
        originX: table.layout.x,
        originY: table.layout.y,
      };
      onSelect(table.id);
    },
    [editMode, onSelect],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !editMode) return;
      const table = tables.find((t) => t.id === drag.tableId);
      if (!table) return;

      const svg = (event.currentTarget as SVGSVGElement).getScreenCTM();
      if (!svg) return;
      const scale = svg.a * zoom;
      const dx = (event.clientX - drag.startX) / scale;
      const dy = (event.clientY - drag.startY) / scale;
      const w = 56;
      const h = 56;
      const x = Math.min(CANVAS_WIDTH - w, Math.max(0, drag.originX + dx));
      const y = Math.min(CANVAS_HEIGHT - h, Math.max(0, drag.originY + dy));
      onLayoutChange(drag.tableId, { ...table.layout, x, y, width: w, height: h });
    },
    [editMode, onLayoutChange, tables, zoom],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const scaledW = CANVAS_WIDTH * zoom;
  const scaledH = CANVAS_HEIGHT * zoom;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-muted bg-[#c9bcaa] shadow-sm">
      <div className="overflow-auto">
        <div style={{ width: scaledW, height: scaledH }}>
          <svg
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            width={scaledW}
            height={scaledH}
            className="block touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            role="img"
            aria-label="Restaurant floor plan"
          >
            <g>
              <image
                href={FLOOR_BG_SRC}
                x={0}
                y={0}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                preserveAspectRatio="none"
              />

              {tables.map((table) => {
                const selected = selectedId === table.id;
                const ref = referenceCenterForTable(table);

                if (editMode) {
                  return (
                    <EditModeMarker
                      key={table.id}
                      table={table}
                      selected={selected}
                      onPointerDown={(e) => handlePointerDown(table, e)}
                    />
                  );
                }

                return (
                  <g
                    key={table.id}
                    className="cursor-pointer"
                    onPointerDown={(e) => handlePointerDown(table, e)}
                  >
                    <circle cx={ref.cx} cy={ref.cy} r={ref.hitR} fill="transparent" />
                    {selectionOutline(ref, selected)}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-lg border border-border-muted bg-white shadow-md">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-charcoal hover:bg-surface-muted"
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border-t border-border-muted text-charcoal hover:bg-surface-muted"
            onClick={onZoomOut}
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      </div>

      <div className="absolute bottom-3 right-3">
        <label className="sr-only" htmlFor="floor-map-select">
          Floor
        </label>
        <select
          id="floor-map-select"
          value={floorId}
          onChange={(e) => onFloorChange(e.target.value)}
          className="h-9 max-w-[160px] truncate rounded-lg border border-border-muted bg-white px-2 text-xs font-medium text-charcoal shadow-md"
        >
          {floors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.name.replace(" (demo)", "")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
