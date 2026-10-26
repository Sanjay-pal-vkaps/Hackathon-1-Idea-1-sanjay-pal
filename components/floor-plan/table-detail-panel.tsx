"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ALL_TABLE_STATUSES,
  TABLE_STATUS_LABELS,
} from "@/lib/constants/table-status";
import type {
  Customer,
  Reservation,
  RestaurantTable,
  TableStatus,
} from "@/lib/domain/types";
import { useStaffDate } from "@/components/staff/staff-workspace";
import { Select } from "@/components/ui/select";
import { getMockRepositories } from "@/lib/mock/repositories";

type TableDetailPanelProps = {
  table: RestaurantTable | null;
  onClose?: () => void;
  compact?: boolean;
  canUpdateStatus?: boolean;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatSlot(startAt: string, endAt: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${fmt.format(new Date(startAt))} - ${fmt.format(new Date(endAt))}`;
}

function upcomingStatusLabel(status: Reservation["status"]) {
  if (status === "arrived") return "Arriving";
  if (status === "confirmed") return "Confirmed";
  if (status === "pending") return "Pending";
  return status.replaceAll("_", " ");
}

export function TableDetailPanel({
  table,
  onClose,
  compact = false,
  canUpdateStatus = false,
}: TableDetailPanelProps) {
  const router = useRouter();
  const { selectedDate } = useStaffDate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Map<string, Customer>>(new Map());
  const tableId = table?.id;

  useEffect(() => {
    if (!tableId) return;
    let cancelled = false;
    (async () => {
      const repos = getMockRepositories();
      const [rows, guestList] = await Promise.all([
        repos.reservations.listForTable(tableId, selectedDate),
        repos.customers.list(),
      ]);
      if (cancelled) return;
      setReservations(rows.sort((a, b) => a.startAt.localeCompare(b.startAt)));
      setCustomers(new Map(guestList.map((c) => [c.id, c])));
    })();
    return () => {
      cancelled = true;
    };
  }, [tableId, selectedDate]);

  const { current, upcoming } = useMemo(() => {
    if (reservations.length === 0) {
      return { current: null as Reservation | null, upcoming: [] as Reservation[] };
    }
    const active =
      reservations.find((r) => ["confirmed", "arrived"].includes(r.status)) ??
      reservations[0];
    const rest = reservations.filter((r) => r.id !== active?.id);
    return { current: active, upcoming: rest };
  }, [reservations]);

  if (!table) {
    return (
      <Card className="h-full border-dashed bg-white">
        <CardContent className="flex h-full min-h-[20rem] flex-col items-center justify-center p-6 text-center text-sm text-charcoal/60">
          Select a table on the floor plan to view details and reservations.
        </CardContent>
      </Card>
    );
  }

  const currentGuest = current ? customers.get(current.customerId) : undefined;

  return (
    <Card
      className={
        compact ? "border-0 bg-white shadow-none" : "h-full overflow-hidden bg-white"
      }
    >
      <CardContent className="space-y-4 p-0">
        <div className="flex items-start justify-between gap-2 border-b border-border-muted px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-charcoal">Table {table.number}</h2>
            <Badge variant="table" tableStatus={table.status} />
          </div>
          <div className="flex items-center gap-1">
            {onClose ? (
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
                ✕
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-[88px_1fr] gap-3 px-5">
          <div
            className="aspect-square rounded-xl bg-gradient-to-br from-surface-muted to-[#c9bcaa] shadow-inner"
            aria-hidden
          />
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-charcoal/55">Guest capacity</dt>
              <dd className="font-medium text-charcoal">
                {table.capacityMin}–{table.capacityMax} guests
              </dd>
            </div>
            <div>
              <dt className="text-charcoal/55">Indoor · {table.zone}</dt>
              <dd className="font-medium text-charcoal">Standard table</dd>
            </div>
            {canUpdateStatus ? (
              <div className="col-span-2">
                <dt className="text-charcoal/55">Operational status</dt>
                <dd className="mt-1">
                  <Select
                    key={table.id}
                    defaultValue={table.status}
                    onChange={async (e) => {
                      const next = e.target.value as TableStatus;
                      await getMockRepositories().tables.updateTableStatus(
                        table.id,
                        next,
                      );
                      await getMockRepositories().activity.append({
                        type: "table_status_changed",
                        message: `Table ${table.number} → ${TABLE_STATUS_LABELS[next]} (demo)`,
                        tableId: table.id,
                      });
                    }}
                    className="max-w-[200px]"
                  >
                    {ALL_TABLE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {TABLE_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </Select>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {current && currentGuest ? (
          <div className="mx-5 rounded-xl border border-border-muted bg-surface-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">
              Current reservation
            </p>
            <div className="mt-3 flex gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-green/15 text-sm font-semibold text-forest-green">
                {initials(currentGuest.fullName)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-charcoal">{currentGuest.fullName}</p>
                <p className="text-sm text-charcoal/65">{currentGuest.phone}</p>
                <p className="mt-1 text-sm font-medium text-charcoal">
                  {formatSlot(current.startAt, current.endAt)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => router.push(`/reservations/${current.id}`)}
              >
                View details
              </Button>
            </div>
          </div>
        ) : (
          <p className="px-5 text-sm text-charcoal/60">No current reservation (demo).</p>
        )}

        <div className="border-t border-border-muted px-5 pb-5 pt-2">
          <p className="py-2 text-sm font-semibold text-charcoal">Upcoming reservations</p>
          <ul className="divide-y divide-border-muted">
            {upcoming.length === 0 ? (
              <li className="py-3 text-sm text-charcoal/55">None for this date.</li>
            ) : (
              upcoming.map((res) => {
                const guest = customers.get(res.customerId);
                const time = formatSlot(res.startAt, res.endAt).split(" - ")[0];
                return (
                  <li key={res.id} className="flex items-center gap-3 py-3">
                    <span className="w-12 shrink-0 text-sm font-medium text-charcoal">
                      {time}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-charcoal">
                      {guest ? initials(guest.fullName) : "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">
                        {guest?.fullName ?? "Guest"}
                      </p>
                      <p className="text-xs text-charcoal/55">{res.guestCount} guests</p>
                    </div>
                    <Badge variant="reservation" reservationStatus={res.status}>
                      {upcomingStatusLabel(res.status)}
                    </Badge>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
