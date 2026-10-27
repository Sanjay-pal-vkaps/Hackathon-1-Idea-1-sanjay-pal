"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FloorPlanCanvas } from "@/components/floor-plan/floor-plan-canvas";
import { FloorPlanMobileList } from "@/components/floor-plan/floor-plan-mobile-list";
import { TableDetailPanel } from "@/components/floor-plan/table-detail-panel";
import { useStaffPermissions } from "@/components/staff/use-staff-permissions";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ALL_TABLE_STATUSES,
  TABLE_STATUS_LABELS,
} from "@/lib/constants/table-status";
import type { FloorMeta, RestaurantTable, TableStatus } from "@/lib/domain/types";
import { applyReferenceLayoutToTables } from "@/lib/constants/floor-plan-reference-layout";
import { getRepositories } from "@/lib/repositories";
import { cn } from "@/lib/utils/cn";

type WorkspaceNotice = { message: string; variant: "info" | "success" } | null;

const ZOOM_MIN = 0.85;
const ZOOM_MAX = 1.35;
const ZOOM_STEP = 0.1;

type StatusFilter = "all" | TableStatus;

export function FloorPlanWorkspace({
  defaultTableId = "table-003",
}: {
  defaultTableId?: string;
}) {
  const { can: staffCan } = useStaffPermissions();
  const [floors, setFloors] = useState<FloorMeta[]>([]);
  const [floorId, setFloorId] = useState<string>("");
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(defaultTableId);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editMode, setEditMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [notice, setNotice] = useState<WorkspaceNotice>(null);
  const [savingLayout, setSavingLayout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const canEditLayout = staffCan("edit_floor_layout");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const loadFloor = useCallback(
    async (id: string, selectId?: string) => {
      const repos = getRepositories();
      const [floorList, floorTables] = await Promise.all([
        repos.tables.listFloors(),
        repos.tables.listTables(id),
      ]);
      setFloors(floorList);
      setFloorId(id);
      const positionedTables = applyReferenceLayoutToTables(floorTables);
      setTables(positionedTables);
      const pick =
        selectId && positionedTables.some((t) => t.id === selectId)
          ? selectId
          : (positionedTables.find((t) => t.id === defaultTableId)?.id ??
            positionedTables[0]?.id ??
            null);
      setSelectedId(pick);
      setSheetOpen(false);
    },
    [defaultTableId],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const repos = getRepositories();
      const floorList = await repos.tables.listFloors();
      if (cancelled || floorList.length === 0) return;
      await loadFloor(floorList[0].id, defaultTableId);
    })();
    return () => {
      cancelled = true;
    };
  }, [defaultTableId, loadFloor]);

  const visibleTables = useMemo(() => {
    if (statusFilter === "all") return tables;
    return tables.filter((t) => t.status === statusFilter);
  }, [tables, statusFilter]);

  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedId) ?? null,
    [tables, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isMobile) setSheetOpen(true);
  };

  const handleLayoutChange = (id: string, layout: RestaurantTable["layout"]) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, layout: { ...layout } } : t)),
    );
  };

  const showNotice = (message: string, variant: "info" | "success" = "info") => {
    setNotice({ message, variant });
    window.setTimeout(() => setNotice(null), 5000);
  };

  const handleSaveLayout = async () => {
    if (!floorId || savingLayout) return;
    setSavingLayout(true);
    try {
      const repos = getRepositories();
      await Promise.all(
        tables.map((t) => repos.tables.updateTableLayout(t.id, t.layout)),
      );
      await repos.activity.append({
        type: "table_status_changed",
        message: `Floor layout saved (${tables.length} tables)`,
      });
      showNotice("Layout saved to Supabase. Refresh to confirm positions.", "success");
      setEditMode(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save layout";
      showNotice(message);
    } finally {
      setSavingLayout(false);
    }
  };

  const handleResetLayout = async () => {
    if (!floorId || savingLayout) return;
    setSavingLayout(true);
    try {
      const repos = getRepositories();
      await repos.tables.resetDemoLayout(floorId);
      const floorTables = await repos.tables.listTables(floorId);
      const aligned = applyReferenceLayoutToTables(floorTables, true);
      await Promise.all(
        aligned.map((t) => repos.tables.updateTableLayout(t.id, t.layout)),
      );
      setTables(aligned);
      setSelectedId(defaultTableId);
      showNotice("Reference layout restored and saved.", "success");
      setEditMode(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not reset layout";
      showNotice(message);
    } finally {
      setSavingLayout(false);
    }
  };

  const filterPills: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    ...ALL_TABLE_STATUSES.map((status) => ({
      key: status as StatusFilter,
      label: TABLE_STATUS_LABELS[status],
    })),
  ];

  return (
    <div className="space-y-3.5">
      {notice ? (
        <Alert variant={notice.variant === "success" ? "success" : "info"}>
          {notice.message}
        </Alert>
      ) : null}

      {editMode ? (
        <Alert variant="info">
          Drag table markers to reposition. Save writes layout to Supabase for all staff.
        </Alert>
      ) : null}

      {/* Operations Toolbar Matching Reference Image */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Shift Dropdown */}
          <div className="relative">
            <select
              id="service-shift"
              className="h-9 appearance-none rounded-xl border border-black/10 bg-white pl-3.5 pr-8 text-xs font-semibold text-charcoal shadow-2xs hover:bg-[#FDFCF9] focus:outline-none"
              defaultValue="lunch"
            >
              <option value="lunch">Lunch (13:00 - 16:00)</option>
              <option value="dinner">Dinner (19:00 - 23:00)</option>
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/50"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {filterPills.map((pill) => {
              const active = statusFilter === pill.key;
              return (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setStatusFilter(pill.key)}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-xs font-medium transition",
                    active
                      ? "bg-[#232E25] text-white shadow-xs font-semibold"
                      : "border border-black/8 bg-white/70 text-charcoal/70 hover:bg-white hover:text-charcoal shadow-2xs",
                  )}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: View toggles & Admin Edit layout */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal/50 font-medium">View</span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/8 bg-white text-charcoal/70 shadow-2xs hover:bg-surface-muted"
            title="Grid View"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/8 bg-white text-charcoal/70 shadow-2xs hover:bg-surface-muted"
            title="Fullscreen"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
          {canEditLayout ? (
            editMode ? (
              <div className="flex items-center gap-1.5 ml-1">
                <Button variant="secondary" size="sm" onClick={() => void handleSaveLayout()}>
                  {savingLayout ? "Saving…" : "Save"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleResetLayout()}>
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                  Done
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="text-xs font-medium text-charcoal/60 hover:text-charcoal px-2.5 py-1.5 rounded-lg border border-black/5 bg-white/60 hover:bg-white"
              >
                Edit layout
              </button>
            )
          ) : null}
        </div>
      </div>

      {visibleTables.length === 0 ? (
        <EmptyState
          title="No tables match this filter"
          description="Try another status or reset filters to see the floor."
          action={
            <Button variant="outline" size="sm" onClick={() => setStatusFilter("all")}>
              Show all tables
            </Button>
          }
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_minmax(300px,340px)]">
        <div className="min-w-0">
          {visibleTables.length === 0 ? null : isMobile ? (
            <FloorPlanMobileList
              tables={visibleTables}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          ) : (
            <FloorPlanCanvas
              tables={visibleTables}
              selectedId={selectedId}
              editMode={editMode && canEditLayout}
              zoom={zoom}
              floors={floors}
              floorId={floorId}
              onFloorChange={(id) => void loadFloor(id, selectedId ?? undefined)}
              onZoomIn={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
              onZoomOut={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
              onSelect={handleSelect}
              onLayoutChange={handleLayoutChange}
            />
          )}
        </div>

        {!isMobile ? (
          <div className="hidden xl:block">
            <TableDetailPanel
              table={selectedTable}
              canUpdateStatus={staffCan("update_table_status")}
              onTableStatusChange={(updated) => {
                setTables((prev) =>
                  prev.map((t) => (t.id === updated.id ? updated : t)),
                );
              }}
            />
          </div>
        ) : null}
      </div>

      {isMobile && sheetOpen && selectedTable ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 bg-charcoal/40"
            aria-label="Close table details"
            onClick={() => setSheetOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-auto rounded-t-xl border-t border-border-muted bg-white shadow-lg">
            <TableDetailPanel
              table={selectedTable}
              compact
              canUpdateStatus={staffCan("update_table_status")}
              onTableStatusChange={(updated) => {
                setTables((prev) =>
                  prev.map((t) => (t.id === updated.id ? updated : t)),
                );
              }}
              onClose={() => setSheetOpen(false)}
            />
          </div>
        </>
      ) : null}

      {!isMobile ? (
        <div className="xl:hidden">
          {selectedTable ? (
            <TableDetailPanel
              table={selectedTable}
              canUpdateStatus={staffCan("update_table_status")}
              onTableStatusChange={(updated) => {
                setTables((prev) =>
                  prev.map((t) => (t.id === updated.id ? updated : t)),
                );
              }}
              onClose={() => setSelectedId(null)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
