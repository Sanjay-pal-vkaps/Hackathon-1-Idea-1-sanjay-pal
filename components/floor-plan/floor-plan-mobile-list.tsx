"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { TABLE_STATUS_LABELS } from "@/lib/constants/table-status";
import type { RestaurantTable } from "@/lib/domain/types";

type FloorPlanMobileListProps = {
  tables: RestaurantTable[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function FloorPlanMobileList({
  tables,
  selectedId,
  onSelect,
}: FloorPlanMobileListProps) {
  const sorted = [...tables].sort((a, b) => a.number - b.number);

  return (
    <ul className="divide-y divide-border-muted rounded-xl border border-border-muted bg-white">
      {sorted.map((table) => (
        <li key={table.id}>
          <button
            type="button"
            onClick={() => onSelect(table.id)}
            className={cn(
              "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted/60",
              selectedId === table.id && "bg-forest-green/5 ring-1 ring-inset ring-forest-green/30",
            )}
          >
            <div>
              <p className="font-medium text-charcoal">Table {table.number}</p>
              <p className="text-xs text-charcoal/60">
                {table.zone} · {table.capacityMin}–{table.capacityMax} guests
              </p>
            </div>
            <Badge variant="table" tableStatus={table.status}>
              {TABLE_STATUS_LABELS[table.status]}
            </Badge>
          </button>
        </li>
      ))}
    </ul>
  );
}
