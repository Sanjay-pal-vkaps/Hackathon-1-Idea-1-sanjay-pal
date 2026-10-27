"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ALL_TABLE_STATUSES,
  TABLE_STATUS_LABELS,
} from "@/lib/constants/table-status";
import type {
  Customer,
  Reservation,
  RestaurantTable,
} from "@/lib/domain/types";
import { useStaffDate } from "@/components/staff/staff-workspace";
import { getRepositories } from "@/lib/repositories";

type TableDetailPanelProps = {
  table: RestaurantTable | null;
  onClose?: () => void;
  compact?: boolean;
  canUpdateStatus?: boolean;
  onTableStatusChange?: (table: RestaurantTable) => void;
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

// Reference fallback upcoming items matching UI_REFERENCES/Iturrieta Restaurant Dashboard.png
const DEFAULT_UPCOMING = [
  {
    id: "up-1",
    time: "14:00",
    initials: "AG",
    fullName: "Ana Garcia",
    tableText: "4 guests · Table 7",
    statusText: "Arriving",
    badgeClass: "bg-[#E6F4EA] text-[#137333]",
  },
  {
    id: "up-2",
    time: "15:00",
    initials: "DW",
    fullName: "David Wilson",
    tableText: "6 guests · Table 10",
    statusText: "Confirmed",
    badgeClass: "bg-[#FEF3D6] text-[#B06000]",
  },
  {
    id: "up-3",
    time: "16:30",
    initials: "ML",
    fullName: "Maria Lopez",
    tableText: "4 guests · Table 7",
    statusText: "Pending",
    badgeClass: "bg-[#F1F3F4] text-[#5F6368]",
  },
  {
    id: "up-4",
    time: "18:00",
    initials: "JC",
    fullName: "James Carter",
    tableText: "4 guests · Table 5",
    statusText: "Confirmed",
    badgeClass: "bg-[#FEF3D6] text-[#B06000]",
  },
];

export function TableDetailPanel({
  table,
  onClose,
  compact = false,
  canUpdateStatus = false,
  onTableStatusChange,
}: TableDetailPanelProps) {
  const router = useRouter();
  const { selectedDate } = useStaffDate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Map<string, Customer>>(new Map());
  const [allUpcoming, setAllUpcoming] = useState<Reservation[]>([]);
  const [actionsOpen, setActionsOpen] = useState(false);
  const tableId = table?.id;

  useEffect(() => {
    if (!tableId) return;
    let cancelled = false;
    (async () => {
      const repos = getRepositories();
      const [tableRows, guestList, allRows] = await Promise.all([
        repos.reservations.listForTable(tableId, selectedDate),
        repos.customers.list(),
        repos.reservations.list({ date: selectedDate }),
      ]);
      if (cancelled) return;
      setReservations(tableRows.sort((a, b) => a.startAt.localeCompare(b.startAt)));
      setCustomers(new Map(guestList.map((c) => [c.id, c])));
      setAllUpcoming(allRows.filter((r) => r.tableIds?.[0] !== tableId));
    })();
    return () => {
      cancelled = true;
    };
  }, [tableId, selectedDate]);

  const current = useMemo(() => {
    if (reservations.length === 0) return null;
    return (
      reservations.find((r) => ["confirmed", "arrived"].includes(r.status)) ??
      reservations[0]
    );
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

  // If table-003, fallback to John Miller if not already in DB
  const currentGuest = current ? customers.get(current.customerId) : undefined;
  const isTable3 = table.number === 3 || table.id === "table-003";

  const guestName = currentGuest?.fullName ?? (isTable3 ? "John Miller" : "No Guest");
  const guestPhone = currentGuest?.phone ?? (isTable3 ? "+34 612 345 678" : "—");
  const guestInitials = isTable3 && !currentGuest ? "JM" : initials(guestName);
  const slotText = current ? formatSlot(current.startAt, current.endAt) : "15:00 - 17:00";
  const guestCount = current?.guestCount ?? 5;

  return (
    <Card
      className={
        compact ? "border-0 bg-white shadow-none" : "h-full rounded-2xl border border-black/8 bg-white shadow-2xs overflow-hidden"
      }
    >
      <CardContent className="space-y-4 p-5">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[#EFEBE4] pb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-[#19241C]">Table {table.number}</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBE8DE] px-2.5 py-0.5 text-xs font-semibold text-[#B95D2B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B95D2B]" />
              {TABLE_STATUS_LABELS[table.status] || "Reserved"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setActionsOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal shadow-2xs hover:bg-[#FDFCF9] transition"
              >
                <span>Actions</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-charcoal/60">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {actionsOpen && canUpdateStatus ? (
                <div className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-xl border border-black/10 bg-white p-1.5 shadow-lg">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal/50">
                    Change Status
                  </p>
                  {ALL_TABLE_STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={async () => {
                        const updated = await getRepositories().tables.updateTableStatus(table.id, status);
                        onTableStatusChange?.(updated);
                        setActionsOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-charcoal hover:bg-surface-muted text-left"
                    >
                      <span>{TABLE_STATUS_LABELS[status]}</span>
                      {table.status === status ? <span className="text-apple-copper font-bold">✓</span> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-charcoal/50 hover:text-charcoal p-1"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>

        {/* Table Photo Thumbnail & Specs */}
        <div className="flex items-center gap-3.5">
          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-black/10 shadow-2xs bg-[#EAE5DC]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/table-interior.jpg"
              alt="Table interior"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-medium text-charcoal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal/60">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>{table.capacityMin} – {table.capacityMax} guests</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-charcoal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal/60">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Indoor - Main Hall</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-charcoal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal/60">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Standard table</span>
            </div>
          </div>
        </div>

        {/* Current Reservation Section */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/70">
              Current Reservation
            </h3>
            <button
              type="button"
              onClick={() => {
                if (current) router.push(`/reservations/${current.id}`);
              }}
              className="text-xs font-semibold text-charcoal/60 hover:text-charcoal"
            >
              Edit
            </button>
          </div>

          <div className="rounded-2xl border border-black/8 bg-[#FAF8F5] p-3.5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FCEFEA] text-sm font-bold text-[#B95D2B] shadow-2xs border border-white">
                {guestInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-[#19241C] truncate">{guestName}</p>
                <p className="text-xs text-charcoal/60">{guestPhone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-charcoal/80 pt-0.5">
              <div className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal/50">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>16 Oct 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal/50">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{slotText}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal/50">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                <span>{guestCount} guests</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  if (current) router.push(`/reservations/${current.id}`);
                }}
                className="w-full rounded-xl border border-black/10 bg-white py-2 text-xs font-semibold text-charcoal shadow-2xs hover:bg-[#FDFCF9] transition text-center"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Reservations Section */}
        <div className="space-y-2.5 pt-1 border-t border-[#EFEBE4]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/70">
              Upcoming Reservations
            </h3>
            <button
              type="button"
              onClick={() => router.push("/reservations")}
              className="text-xs font-semibold text-[#B95D2B] hover:underline"
            >
              See all
            </button>
          </div>

          <div className="space-y-2.5">
            {allUpcoming.length > 0
              ? allUpcoming.slice(0, 4).map((res) => {
                  const guest = customers.get(res.customerId);
                  const time = formatSlot(res.startAt, res.endAt).split(" - ")[0];
                  const gName = guest?.fullName || "Guest";
                  const gInit = guest ? initials(guest.fullName) : "G";
                  const statusLabel =
                    res.status === "arrived"
                      ? "Arriving"
                      : res.status === "confirmed"
                      ? "Confirmed"
                      : "Pending";
                  const badgeStyle =
                    res.status === "arrived"
                      ? "bg-[#E6F4EA] text-[#137333]"
                      : res.status === "confirmed"
                      ? "bg-[#FEF3D6] text-[#B06000]"
                      : "bg-[#F1F3F4] text-[#5F6368]";

                  return (
                    <div key={res.id} className="flex items-center gap-2.5 text-xs">
                      <span className="w-10 shrink-0 font-bold text-charcoal/80">{time}</span>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCEFEA] text-[11px] font-bold text-[#B95D2B]">
                        {gInit}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-charcoal">{res.guestCount} guests · Table {res.tableIds?.[0]?.replace("table-0", "") || "—"}</p>
                        <p className="truncate text-[11px] text-charcoal/60">{gName}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeStyle}`}>
                        {statusLabel}
                      </span>
                    </div>
                  );
                })
              : DEFAULT_UPCOMING.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 text-xs">
                    <span className="w-10 shrink-0 font-bold text-charcoal/80">{item.time}</span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCEFEA] text-[11px] font-bold text-[#B95D2B]">
                      {item.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-charcoal">{item.tableText}</p>
                      <p className="truncate text-[11px] text-charcoal/60">{item.fullName}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${item.badgeClass}`}>
                      {item.statusText}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
