"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStaffDate } from "@/components/staff/staff-workspace";
import {
  ALL_RESERVATION_SOURCES,
  ALL_RESERVATION_STATUSES,
  RESERVATION_SOURCE_LABELS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/constants/reservation-ui";
import type { Customer, Reservation, ReservationStatus, RestaurantTable } from "@/lib/domain/types";
import { getRepositories } from "@/lib/repositories";
import { useStaffPermissions } from "@/components/staff/use-staff-permissions";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReservationsListView() {
  const router = useRouter();
  const { selectedDate, setSelectedDate } = useStaffDate();
  const { can: staffCan } = useStaffPermissions();

  // "all" shows all bookings across dates (latest first); "single" filters by selectedDate
  const [dateScope, setDateScope] = useState<"all" | "single">("all");

  const [rawRows, setRawRows] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Map<string, Customer>>(new Map());
  const [tables, setTables] = useState<Map<string, RestaurantTable>>(new Map());
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [status, setStatus] = useState<ReservationStatus | "">("");
  const [source, setSource] = useState<Reservation["source"] | "">("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const repos = getRepositories();
      // Fetch full set without restricting by status/source so status counts are 100% accurate
      const [list, guestList, tableList, pendingList] = await Promise.all([
        repos.reservations.list(
          dateScope === "single" ? { date: selectedDate } : undefined,
        ),
        repos.customers.list(),
        repos.tables.listTables(),
        repos.reservations.listPending(),
      ]);

      setRawRows(list);
      setCustomers(new Map(guestList.map((c) => [c.id, c])));
      setTables(new Map(tableList.map((t) => [t.id, t])));
      setPendingCount(pendingList.length);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [dateScope, selectedDate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  // Accurate Status Counts (computed from ALL reservations in current scope, unaffected by active status filter)
  const stats = useMemo(() => {
    const total = rawRows.length;
    const confirmed = rawRows.filter((r) => r.status === "confirmed").length;
    const arrived = rawRows.filter((r) => r.status === "arrived").length;
    const pending = rawRows.filter((r) => r.status === "pending").length;
    const completed = rawRows.filter((r) => r.status === "completed").length;
    const cancelled = rawRows.filter((r) => r.status === "cancelled").length;
    return { total, confirmed, arrived, pending, completed, cancelled };
  }, [rawRows]);

  // Filtered & Sorted Rows: LATEST BOOKINGS ALWAYS AT THE TOP
  const enriched = useMemo(() => {
    let filtered = rawRows;

    // Filter by Status
    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }

    // Filter by Source
    if (source) {
      filtered = filtered.filter((r) => r.source === source);
    }

    // Filter by Search Query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((r) => {
        const guest = customers.get(r.customerId);
        return (
          r.id.toLowerCase().includes(q) ||
          guest?.fullName.toLowerCase().includes(q) ||
          guest?.email.toLowerCase().includes(q) ||
          guest?.phone.toLowerCase().includes(q) ||
          (r.notes?.toLowerCase().includes(q) ?? false)
        );
      });
    }

    // Latest booking at the very top (created_at DESC, fallback start_at DESC)
    return [...filtered].sort((a, b) => {
      const timeB = new Date(b.createdAt || b.startAt).getTime();
      const timeA = new Date(a.createdAt || a.startAt).getTime();
      return timeB - timeA;
    });
  }, [customers, rawRows, search, source, status]);

  const resetFilters = () => {
    setStatus("");
    setSource("");
    setSearch("");
    setDateScope("all");
  };

  const hasActiveFilters = Boolean(status || source || search || dateScope === "single");

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E3DDCF] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#19241C] sm:text-3xl">
              Reservations
            </h1>
            <span className="inline-flex items-center rounded-full bg-[#E8E4DA] px-2.5 py-0.5 text-xs font-semibold text-[#19241C]">
              {enriched.length} {enriched.length === rawRows.length ? "total" : `of ${rawRows.length}`}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-bold">
              ⚡ Latest first
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#19241C]/65">
            {dateScope === "all"
              ? "Showing all guest & staff reservations across all dates (newest bookings at top)"
              : `Filtered for date: ${formatReservationDate(`${selectedDate}T12:00:00+02:00`)}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => router.push("/reservations/pending")}
            className="relative rounded-xl border border-black/10 bg-white hover:bg-surface-muted text-xs sm:text-sm font-semibold shadow-2xs"
          >
            Pending queue
            {pendingCount > 0 ? (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-apple-copper px-1.5 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            ) : null}
          </Button>

          {staffCan("create_reservation") ? (
            <Link
              href="/reservations/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#B95D2B] px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-[#A85124]"
            >
              <span className="text-base leading-none">+</span>
              <span>New Reservation</span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Quick Status Count Chips & Date Scope Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Chips with FIXED ACCURATE COUNTS */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setStatus("")}
            className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
              status === ""
                ? "bg-[#232E25] text-white font-semibold"
                : "bg-surface-muted hover:bg-surface-muted/80 text-charcoal"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setStatus("confirmed")}
            className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
              status === "confirmed"
                ? "bg-[#232E25] text-white font-semibold"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium"
            }`}
          >
            Confirmed ({stats.confirmed})
          </button>
          <button
            type="button"
            onClick={() => setStatus("arrived")}
            className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
              status === "arrived"
                ? "bg-[#232E25] text-white font-semibold"
                : "bg-surface-muted hover:bg-surface-muted/80 text-charcoal font-medium"
            }`}
          >
            Arrived ({stats.arrived})
          </button>
          <button
            type="button"
            onClick={() => setStatus("pending")}
            className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
              status === "pending"
                ? "bg-[#232E25] text-white font-semibold"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200 font-medium"
            }`}
          >
            Pending ({stats.pending})
          </button>
          {stats.completed > 0 ? (
            <button
              type="button"
              onClick={() => setStatus("completed")}
              className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                status === "completed"
                  ? "bg-[#232E25] text-white font-semibold"
                  : "bg-surface-muted hover:bg-surface-muted/80 text-charcoal"
              }`}
            >
              Completed ({stats.completed})
            </button>
          ) : null}
          {stats.cancelled > 0 ? (
            <button
              type="button"
              onClick={() => setStatus("cancelled")}
              className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                status === "cancelled"
                  ? "bg-[#232E25] text-white font-semibold"
                  : "bg-surface-muted hover:bg-surface-muted/80 text-charcoal"
              }`}
            >
              Cancelled ({stats.cancelled})
            </button>
          ) : null}
        </div>

        {/* Date Scope Controls: All Dates vs Specific Date */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setDateScope("all")}
            className={`h-8 rounded-lg px-2.5 text-xs font-semibold transition cursor-pointer ${
              dateScope === "all"
                ? "bg-[#232E25] text-white shadow-xs"
                : "bg-white border border-black/10 text-charcoal hover:bg-[#FAF8F5]"
            }`}
          >
            All Dates ({rawRows.length})
          </button>

          <label
            className={`relative flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition ${
              dateScope === "single"
                ? "bg-[#232E25] text-white border-[#232E25] shadow-xs"
                : "border-black/10 bg-white text-charcoal hover:bg-[#FAF8F5]"
            }`}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={dateScope === "single" ? "text-white" : "text-charcoal/60"}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{dateScope === "single" ? selectedDate : "Pick Date"}</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setDateScope("single");
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Filter by specific date"
            />
          </label>

          {dateScope === "single" ? (
            <button
              type="button"
              onClick={() => setDateScope("all")}
              className="text-xs text-apple-copper hover:underline font-semibold cursor-pointer"
            >
              Show all dates
            </button>
          ) : null}
        </div>
      </div>

      {/* Filter Row: Search & Dropdowns */}
      <div className="flex flex-col gap-3 rounded-2xl border border-black/6 bg-white p-3.5 shadow-2xs sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-[200px] flex-1 sm:max-w-md">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/45"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            placeholder="Search guest, email, phone, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-xs sm:text-sm bg-[#FAF8F5] border-black/8 rounded-xl"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal text-xs cursor-pointer"
            >
              ✕
            </button>
          ) : null}
        </div>

        <div className="w-full sm:w-44">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReservationStatus | "")}
            className="h-9 text-xs sm:text-sm bg-[#FAF8F5] border-black/8 rounded-xl"
          >
            <option value="">All statuses</option>
            {ALL_RESERVATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {RESERVATION_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-44">
          <Select
            value={source}
            onChange={(e) => setSource(e.target.value as Reservation["source"] | "")}
            className="h-9 text-xs sm:text-sm bg-[#FAF8F5] border-black/8 rounded-xl"
          >
            <option value="">All channels</option>
            {ALL_RESERVATION_SOURCES.map((src) => (
              <option key={src} value={src}>
                {RESERVATION_SOURCE_LABELS[src]}
              </option>
            ))}
          </Select>
        </div>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9 text-xs text-charcoal/70 hover:text-charcoal cursor-pointer"
          >
            Reset filters
          </Button>
        ) : null}
      </div>

      {loadError ? (
        <Alert variant="error">
          {loadError}
          <button
            type="button"
            className="ml-2 font-medium underline cursor-pointer"
            onClick={() => void load()}
          >
            Retry
          </button>
        </Alert>
      ) : null}

      {loading ? (
        <div className="space-y-3 rounded-2xl border border-black/6 bg-white p-5">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-3/4 rounded-xl" />
        </div>
      ) : null}

      {!loading && !loadError && enriched.length === 0 ? (
        <EmptyState
          title="No reservations found"
          description="Adjust your status/search filters or switch to All Dates."
        />
      ) : null}

      {/* Desktop Table Container with Dedicated Scroll and Sticky Header */}
      <div className="hidden rounded-2xl border border-black/8 bg-white shadow-2xs md:block overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[560px] custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-[#FAF8F5] border-b border-[#EFEBE4] shadow-2xs">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="w-[300px] font-bold text-xs uppercase tracking-wider text-[#19241C]/70">
                  Guest
                </TableHead>
                <TableHead className="w-[190px] font-bold text-xs uppercase tracking-wider text-[#19241C]/70">
                  Time Slot / Date
                </TableHead>
                <TableHead className="w-[100px] font-bold text-xs uppercase tracking-wider text-[#19241C]/70">
                  Party
                </TableHead>
                <TableHead className="w-[140px] font-bold text-xs uppercase tracking-wider text-[#19241C]/70">
                  Table
                </TableHead>
                <TableHead className="w-[130px] font-bold text-xs uppercase tracking-wider text-[#19241C]/70">
                  Status
                </TableHead>
                <TableHead className="w-[110px] font-bold text-xs uppercase tracking-wider text-[#19241C]/70">
                  Source
                </TableHead>
                <TableHead className="w-[90px] text-right font-bold text-xs uppercase tracking-wider text-[#19241C]/70">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading || loadError || enriched.length === 0 ? null : (
                enriched.map((row, index) => {
                  const guest = customers.get(row.customerId);
                  const guestName = guest?.fullName ?? row.customerId;
                  const gInitials = guest ? initials(guest.fullName) : "G";
                  const assignedTable = row.tableIds?.[0]
                    ? tables.get(row.tableIds[0])
                    : null;
                  const tableLabel = assignedTable
                    ? `Table ${assignedTable.number}`
                    : row.tableIds.length > 0
                    ? `Table ${row.tableIds[0].replace("table-0", "")}`
                    : null;

                  // Highlight newest bookings (e.g. top 2 newest or created in last 48h)
                  const isNew = index === 0;

                  return (
                    <TableRow
                      key={row.id}
                      className="hover:bg-[#FAF8F5]/80 transition border-b border-black/4 group cursor-pointer"
                      onClick={() => router.push(`/reservations/${row.id}`)}
                    >
                      {/* Guest Column */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCEFEA] text-xs font-bold text-[#B95D2B] border border-black/5 shadow-2xs">
                            {gInitials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-sm text-[#19241C] truncate group-hover:text-apple-copper transition">
                                {guestName}
                              </p>
                              {isNew ? (
                                <span className="rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5">
                                  LATEST
                                </span>
                              ) : null}
                            </div>
                            <p className="text-xs text-charcoal/55 truncate">
                              {guest?.phone || guest?.email || "No contact info"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Time Slot & Date */}
                      <TableCell className="py-3">
                        <div className="flex flex-col text-xs font-semibold text-charcoal">
                          <div className="flex items-center gap-1.5">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-charcoal/50 shrink-0"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{formatReservationTimeRange(row.startAt, row.endAt)}</span>
                          </div>
                          <span className="text-[11px] font-normal text-charcoal/60 ml-4.5">
                            {formatReservationDate(row.startAt)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Party */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-charcoal">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-charcoal/50 shrink-0"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                          <span>{row.guestCount} guests</span>
                        </div>
                      </TableCell>

                      {/* Table */}
                      <TableCell className="py-3">
                        {tableLabel ? (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-black/8 bg-[#F5F2E9] px-2.5 py-1 text-xs font-semibold text-[#19241C]">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-charcoal/60"
                            >
                              <rect x="3" y="4" width="18" height="16" rx="2" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>{tableLabel}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-charcoal/40 italic">Unassigned</span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3">
                        <Badge variant="reservation" reservationStatus={row.status} />
                      </TableCell>

                      {/* Source */}
                      <TableCell className="py-3">
                        <span className="text-xs text-charcoal/70 capitalize font-medium">
                          {RESERVATION_SOURCE_LABELS[row.source]}
                        </span>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/reservations/${row.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-black/8 bg-white px-2.5 py-1 text-xs font-semibold text-charcoal shadow-2xs hover:bg-[#FAF8F5] transition"
                        >
                          <span>Open</span>
                          <span className="text-[10px] text-charcoal/50">→</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card List with Internal Scroll */}
      <div className="space-y-3 md:hidden overflow-y-auto max-h-[calc(100vh-275px)] pr-1">
        {loading || loadError
          ? null
          : enriched.map((row, index) => {
              const guest = customers.get(row.customerId);
              const gName = guest?.fullName ?? row.customerId;
              const gInitials = guest ? initials(guest.fullName) : "G";
              const assignedTable = row.tableIds?.[0]
                ? tables.get(row.tableIds[0])
                : null;
              const tableLabel = assignedTable
                ? `Table ${assignedTable.number}`
                : row.tableIds.length > 0
                ? `Table ${row.tableIds[0].replace("table-0", "")}`
                : "Unassigned";

              const isNew = index === 0;

              return (
                <div
                  key={row.id}
                  className="rounded-2xl border border-black/8 bg-white p-4 shadow-2xs space-y-3 cursor-pointer"
                  onClick={() => router.push(`/reservations/${row.id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCEFEA] text-xs font-bold text-[#B95D2B]">
                        {gInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm text-charcoal">{gName}</p>
                          {isNew ? (
                            <span className="rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5">
                              LATEST
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-charcoal/55">
                          {formatReservationDate(row.startAt)} · {formatReservationTimeRange(row.startAt, row.endAt)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="reservation" reservationStatus={row.status} />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EFEBE4] pt-2.5 text-xs text-charcoal/70">
                    <span>{row.guestCount} guests · {tableLabel}</span>
                    <span className="capitalize">{RESERVATION_SOURCE_LABELS[row.source]}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl text-xs font-semibold cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/reservations/${row.id}`);
                    }}
                  >
                    View details
                  </Button>
                </div>
              );
            })}
      </div>
    </div>
  );
}
