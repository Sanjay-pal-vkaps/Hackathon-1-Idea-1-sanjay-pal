"use client";

import { useCallback, useMemo, useRef, type PointerEvent } from "react";
import {
  FLOOR_PLAN_REFERENCE_BG,
  referenceCenterForTable,
} from "@/lib/constants/floor-plan-reference-layout";
import type { FloorMeta, RestaurantTable, TableStatus } from "@/lib/domain/types";

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

// High-contrast, crystal-clear color tokens for every status
const STATUS_CONFIG: Record<
  TableStatus,
  {
    border: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    label: string;
    dot: string;
  }
> = {
  available: {
    border: "#16A34A",
    badgeBg: "#DCFCE7",
    badgeText: "#15803D",
    glow: "rgba(22, 163, 74, 0.4)",
    label: "AVAILABLE",
    dot: "#22C55E",
  },
  reserved: {
    border: "#EA580C",
    badgeBg: "#FFEDD5",
    badgeText: "#C2410C",
    glow: "rgba(234, 88, 12, 0.4)",
    label: "RESERVED",
    dot: "#F97316",
  },
  occupied: {
    border: "#DC2626",
    badgeBg: "#FEE2E2",
    badgeText: "#B91C1C",
    glow: "rgba(220, 38, 38, 0.45)",
    label: "OCCUPIED",
    dot: "#EF4444",
  },
  cleaning: {
    border: "#0284C7",
    badgeBg: "#E0F2FE",
    badgeText: "#0369A1",
    glow: "rgba(2, 132, 199, 0.4)",
    label: "CLEANING",
    dot: "#38BDF8",
  },
  out_of_service: {
    border: "#64748B",
    badgeBg: "#F1F5F9",
    badgeText: "#475569",
    glow: "rgba(100, 116, 139, 0.35)",
    label: "OUT OF SVC",
    dot: "#94A3B8",
  },
};

/**
 * Draws realistic chair silhouettes around the table
 */
function TableChairs({
  cx,
  cy,
  w,
  h,
  isCircle,
  capacity,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
  isCircle: boolean;
  capacity: number;
}) {
  const chairColor = "#665747";
  const chairOpacity = 0.78;

  if (isCircle) {
    const r = w / 2;
    const chairR = 4.5;
    // 4 chairs around the circle
    return (
      <g opacity={chairOpacity} pointerEvents="none">
        <circle cx={cx} cy={cy - r - 4} r={chairR} fill={chairColor} />
        <circle cx={cx} cy={cy + r + 4} r={chairR} fill={chairColor} />
        <circle cx={cx - r - 4} cy={cy} r={chairR} fill={chairColor} />
        <circle cx={cx + r + 4} cy={cy} r={chairR} fill={chairColor} />
      </g>
    );
  }

  // Rectangular Table Chairs
  const chairW = 16;
  const chairH = 5;
  const isLarge = capacity >= 6;

  return (
    <g opacity={chairOpacity} pointerEvents="none">
      {/* Top Chairs */}
      {isLarge ? (
        <>
          <rect
            x={cx - w / 3 - chairW / 2}
            y={cy - h / 2 - chairH - 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
          <rect
            x={cx - chairW / 2}
            y={cy - h / 2 - chairH - 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
          <rect
            x={cx + w / 3 - chairW / 2}
            y={cy - h / 2 - chairH - 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
        </>
      ) : (
        <>
          <rect
            x={cx - w / 4 - chairW / 2}
            y={cy - h / 2 - chairH - 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
          <rect
            x={cx + w / 4 - chairW / 2}
            y={cy - h / 2 - chairH - 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
        </>
      )}

      {/* Bottom Chairs */}
      {isLarge ? (
        <>
          <rect
            x={cx - w / 3 - chairW / 2}
            y={cy + h / 2 + 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
          <rect
            x={cx - chairW / 2}
            y={cy + h / 2 + 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
          <rect
            x={cx + w / 3 - chairW / 2}
            y={cy + h / 2 + 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
        </>
      ) : (
        <>
          <rect
            x={cx - w / 4 - chairW / 2}
            y={cy + h / 2 + 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
          <rect
            x={cx + w / 4 - chairW / 2}
            y={cy + h / 2 + 1.5}
            width={chairW}
            height={chairH}
            rx={2}
            fill={chairColor}
          />
        </>
      )}

      {/* Side chairs for large banquet tables */}
      {isLarge ? (
        <>
          <rect
            x={cx - w / 2 - chairH - 1.5}
            y={cy - chairW / 2}
            width={chairH}
            height={chairW}
            rx={2}
            fill={chairColor}
          />
          <rect
            x={cx + w / 2 + 1.5}
            y={cy - chairW / 2}
            width={chairH}
            height={chairW}
            rx={2}
            fill={chairColor}
          />
        </>
      ) : null}
    </g>
  );
}

/**
 * Interactive Table Node rendered with full clarity
 */
function TableNode({
  table,
  selected,
  editMode,
  onPointerDown,
}: {
  table: RestaurantTable;
  selected: boolean;
  editMode: boolean;
  onPointerDown: (e: PointerEvent) => void;
}) {
  const ref = referenceCenterForTable(table);
  const hasLayout = table.layout && (table.layout.x > 0 || table.layout.y > 0);
  const cx = hasLayout ? table.layout.x + table.layout.width / 2 : ref.cx;
  const cy = hasLayout ? table.layout.y + table.layout.height / 2 : ref.cy;
  const isCircle = table.shape === "circle" || ref.shape === "circle";
  const w = (hasLayout && table.layout.width) ? table.layout.width : ref.width || (isCircle ? 54 : 70);
  const h = (hasLayout && table.layout.height) ? table.layout.height : ref.height || (isCircle ? 54 : 52);

  const config = STATUS_CONFIG[table.status] || STATUS_CONFIG.available;

  return (
    <g
      className={editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}
      onPointerDown={onPointerDown}
      role="button"
      aria-label={`Table ${table.number}, status ${table.status}, capacity ${table.capacityMin} to ${table.capacityMax}`}
      tabIndex={0}
    >
      {/* Selection Glow & Outer Outline */}
      {selected ? (
        isCircle ? (
          <g pointerEvents="none">
            <circle
              cx={cx}
              cy={cy}
              r={w / 2 + 8}
              fill="none"
              stroke="white"
              strokeWidth={4}
              filter="url(#selection-glow)"
            />
            <circle
              cx={cx}
              cy={cy}
              r={w / 2 + 8}
              fill="none"
              stroke="#19241C"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          </g>
        ) : (
          <g pointerEvents="none">
            <rect
              x={cx - w / 2 - 8}
              y={cy - h / 2 - 8}
              width={w + 16}
              height={h + 16}
              rx={16}
              fill="none"
              stroke="white"
              strokeWidth={4}
              filter="url(#selection-glow)"
            />
            <rect
              x={cx - w / 2 - 8}
              y={cy - h / 2 - 8}
              width={w + 16}
              height={h + 16}
              rx={16}
              fill="none"
              stroke="#19241C"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          </g>
        )
      ) : null}

      {/* Chairs around table */}
      <TableChairs
        cx={cx}
        cy={cy}
        w={w}
        h={h}
        isCircle={isCircle}
        capacity={table.capacityMax}
      />

      {/* Main Table Surface */}
      {isCircle ? (
        <circle
          cx={cx}
          cy={cy}
          r={w / 2}
          fill="#FFFDF8"
          stroke={config.border}
          strokeWidth={selected ? 3.5 : 2.5}
          filter="url(#table-shadow)"
        />
      ) : (
        <rect
          x={cx - w / 2}
          y={cy - h / 2}
          width={w}
          height={h}
          rx={10}
          fill="#FFFDF8"
          stroke={config.border}
          strokeWidth={selected ? 3.5 : 2.5}
          filter="url(#table-shadow)"
        />
      )}

      {/* Table Content: Number, Status & Capacity */}
      {isCircle ? (
        <g pointerEvents="none">
          {/* Status Dot */}
          <circle cx={cx} cy={cy - 14} r={3.5} fill={config.dot} />

          {/* Table Number */}
          <text
            x={cx}
            y={cy + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={13.5}
            fontWeight={800}
            fill="#19241C"
          >
            T-{table.number}
          </text>

          {/* Capacity */}
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8}
            fontWeight={700}
            fill="#5A655C"
          >
            {table.capacityMin}-{table.capacityMax}p
          </text>
        </g>
      ) : (
        <g pointerEvents="none">
          {/* Top Status Pill */}
          <rect
            x={cx - 24}
            y={cy - h / 2 + 4.5}
            width={48}
            height={11}
            rx={5.5}
            fill={config.badgeBg}
          />
          <circle cx={cx - 17} cy={cy - h / 2 + 10} r={2.5} fill={config.dot} />
          <text
            x={cx + 3}
            y={cy - h / 2 + 10.5}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={7}
            fontWeight={800}
            fill={config.badgeText}
            letterSpacing="0.04em"
          >
            {config.label}
          </text>

          {/* Table Number */}
          <text
            x={cx}
            y={cy + 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={14}
            fontWeight={800}
            fill="#19241C"
          >
            Table {table.number}
          </text>

          {/* Capacity */}
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8}
            fontWeight={700}
            fill="#5A655C"
          >
            {table.capacityMin}-{table.capacityMax} seats
          </text>
        </g>
      )}

      {/* Edit Mode Handle Indicator */}
      {editMode ? (
        <circle
          cx={cx + w / 2 - 6}
          cy={cy - h / 2 + 6}
          r={5}
          fill="#3B82F6"
          stroke="white"
          strokeWidth={1.5}
        />
      ) : null}
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
      const w = table.layout.width || 56;
      const h = table.layout.height || 56;
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

  // Live status counts
  const counts = useMemo(() => {
    const c = {
      available: 0,
      reserved: 0,
      occupied: 0,
      cleaning: 0,
      out_of_service: 0,
    };
    for (const t of tables) {
      if (c[t.status] !== undefined) c[t.status]++;
    }
    return c;
  }, [tables]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#D4C8B8] shadow-md">
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
            <defs>
              {/* Table Drop Shadow Filter */}
              <filter id="table-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="2.5"
                  floodColor="#1B140B"
                  floodOpacity="0.32"
                />
              </filter>

              {/* Glowing Selection Filter */}
              <filter id="selection-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="4"
                  floodColor="#FFFFFF"
                  floodOpacity="0.9"
                />
              </filter>
            </defs>

            {/* Background Image: High-res architectural layout from UI_REFERENCES/tables */}
            <image
              href={FLOOR_BG_SRC}
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              preserveAspectRatio="none"
            />

            {/* Architectural Blueprint Zone Annotations */}
            <g pointerEvents="none" opacity={0.65}>
              {/* Kupela Bar & Cellar (Top) */}
              <text
                x={380}
                y={46}
                textAnchor="middle"
                fill="#54483B"
                fontSize={10.5}
                fontWeight={800}
                letterSpacing="0.12em"
              >
                KUPELA & TXOTX BARREL ROOM
              </text>

              {/* Window Corridor (Left) */}
              <text
                x={95}
                y={120}
                textAnchor="middle"
                fill="#54483B"
                fontSize={9.5}
                fontWeight={800}
                letterSpacing="0.08em"
              >
                LORATEGIA (TERRACE)
              </text>

              {/* Main Dining Hall (Center) */}
              <text
                x={395}
                y={305}
                textAnchor="middle"
                fill="#54483B"
                fontSize={11}
                fontWeight={800}
                letterSpacing="0.15em"
                opacity={0.5}
              >
                JANGELA NAGUSIA (MAIN HALL)
              </text>

              {/* Service Pass (Right) */}
              <text
                x={710}
                y={160}
                textAnchor="middle"
                fill="#54483B"
                fontSize={9.5}
                fontWeight={800}
                letterSpacing="0.08em"
              >
                SUKALDEA (PASS)
              </text>
            </g>

            {/* Interactive Vector Tables */}
            <g>
              {tables.map((table) => {
                const selected = selectedId === table.id;
                return (
                  <TableNode
                    key={table.id}
                    table={table}
                    selected={selected}
                    editMode={editMode}
                    onPointerDown={(e) => handlePointerDown(table, e)}
                  />
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Left Vertical Floating Zoom Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white/95 shadow-md backdrop-blur-xs">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center text-charcoal hover:bg-surface-muted text-base font-bold transition cursor-pointer"
          onClick={onZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center border-t border-black/8 text-charcoal hover:bg-surface-muted text-base font-bold transition cursor-pointer"
          onClick={onZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center border-t border-black/8 text-charcoal/70 hover:bg-surface-muted transition cursor-pointer"
          onClick={() => {
            onZoomIn();
            onZoomOut();
          }}
          aria-label="Reset view"
          title="Reset view"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" />
            <line x1="12" y1="22" x2="12" y2="18" />
          </svg>
        </button>
      </div>

      {/* Bottom Left: Ground Floor Pill */}
      <div className="absolute bottom-3.5 left-4 z-10">
        <div className="relative">
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-black/10 bg-white/95 px-3 text-xs font-semibold text-charcoal shadow-md hover:bg-white transition backdrop-blur-xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-charcoal/70"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="9" y1="22" x2="9" y2="18" />
              <line x1="15" y1="22" x2="15" y2="18" />
              <line x1="9" y1="6" x2="9" y2="6.01" />
              <line x1="15" y1="6" x2="15" y2="6.01" />
              <line x1="9" y1="10" x2="9" y2="10.01" />
              <line x1="15" y1="10" x2="15" y2="10.01" />
              <line x1="9" y1="14" x2="9" y2="14.01" />
              <line x1="15" y1="14" x2="15" y2="14.01" />
            </svg>
            <span>Ground Floor</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-charcoal/50"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <select
              id="floor-map-select"
              value={floorId}
              onChange={(e) => onFloorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              {floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name.replace(" (demo)", "")}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Bottom Center: Main Entrance Badge */}
      <div className="pointer-events-none absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10">
        <div className="rounded-xl bg-[#232E25]/85 px-3.5 py-1 text-[11px] font-bold tracking-wider text-white shadow-md backdrop-blur-xs border border-white/20 uppercase">
          Main Entrance
        </div>
      </div>

      {/* Bottom Right: Status Legend Pill with Live Counts */}
      <div className="absolute bottom-3.5 right-4 z-10 hidden sm:flex items-center gap-3 rounded-xl border border-black/10 bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-xs text-[11px] font-semibold text-charcoal">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A] ring-2 ring-[#DCFCE7]" />
          Available ({counts.available})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EA580C] ring-2 ring-[#FFEDD5]" />
          Reserved ({counts.reserved})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626] ring-2 ring-[#FEE2E2]" />
          Occupied ({counts.occupied})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0284C7] ring-2 ring-[#E0F2FE]" />
          Cleaning ({counts.cleaning})
        </span>
        {counts.out_of_service > 0 ? (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#64748B] ring-2 ring-[#F1F5F9]" />
            OOS ({counts.out_of_service})
          </span>
        ) : null}
      </div>
    </div>
  );
}
