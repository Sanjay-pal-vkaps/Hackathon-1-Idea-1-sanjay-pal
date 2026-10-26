"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
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
import type { Customer, Reservation, ReservationStatus } from "@/lib/domain/types";
import { withMockLoad, writeSimulateError } from "@/lib/mock/dev-ui-store";
import { getMockRepositories } from "@/lib/mock/repositories";
import { useStaffPermissions } from "@/components/staff/use-staff-permissions";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

export function ReservationsListView() {
  const router = useRouter();
  const { selectedDate } = useStaffDate();
  const { can: staffCan } = useStaffPermissions();
  const [rows, setRows] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Map<string, Customer>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<ReservationStatus | "">("");
  const [source, setSource] = useState<Reservation["source"] | "">("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [list, guestList] = await withMockLoad(async () => {
        const repos = getMockRepositories();
        return Promise.all([
          repos.reservations.list({
            date: selectedDate,
            status: status || undefined,
            source: source || undefined,
            search: search || undefined,
          }),
          repos.customers.list(),
        ]);
      });
      setRows(list);
      setCustomers(new Map(guestList.map((c) => [c.id, c])));
      writeSimulateError(false);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, search, source, status]);

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

  const enriched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const guest = customers.get(r.customerId);
      return (
        r.id.toLowerCase().includes(q) ||
        guest?.fullName.toLowerCase().includes(q) ||
        guest?.email.toLowerCase().includes(q) ||
        (r.notes?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [customers, rows, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservations"
        description={`Operations for ${formatReservationDate(`${selectedDate}T12:00:00+02:00`)} · mock data`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => router.push("/reservations/pending")}
            >
              Pending queue
            </Button>
            {staffCan("create_reservation") ? (
              <Button onClick={() => router.push("/reservations/new")}>
                New reservation
              </Button>
            ) : null}
          </>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border-muted bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-[140px] flex-1">
          <label className="mb-1 block text-xs font-medium text-charcoal/70">
            Search
          </label>
          <Input
            placeholder="Guest, email, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-charcoal/70">
            Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReservationStatus | "")}
          >
            <option value="">All statuses</option>
            {ALL_RESERVATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {RESERVATION_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-charcoal/70">
            Source
          </label>
          <Select
            value={source}
            onChange={(e) => setSource(e.target.value as Reservation["source"] | "")}
          >
            <option value="">All sources</option>
            {ALL_RESERVATION_SOURCES.map((s) => (
              <option key={s} value={s}>
                {RESERVATION_SOURCE_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>
        <p className="text-xs text-charcoal/55 sm:ml-auto">
          Date follows top bar · {selectedDate}
        </p>
      </div>

      {loadError ? (
        <Alert variant="error">
          {loadError}{" "}
          <button
            type="button"
            className="ml-2 font-medium underline"
            onClick={() => void load()}
          >
            Retry
          </button>
        </Alert>
      ) : null}

      {loading ? (
        <div className="space-y-2 rounded-xl border border-border-muted bg-white p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
        </div>
      ) : null}

      {!loading && !loadError && enriched.length === 0 ? (
        <EmptyState
          title="No reservations for this view"
          description="Adjust filters or pick another date in the top bar."
        />
      ) : null}

      <div className="hidden rounded-xl border border-border-muted bg-white md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Tables</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || loadError || enriched.length === 0 ? null : (
              enriched.map((row) => {
                const guest = customers.get(row.customerId);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <p className="font-medium">{guest?.fullName ?? row.customerId}</p>
                      <p className="text-xs text-charcoal/55">{guest?.phone}</p>
                    </TableCell>
                    <TableCell>{formatReservationTimeRange(row.startAt, row.endAt)}</TableCell>
                    <TableCell>{row.guestCount}</TableCell>
                    <TableCell>
                      {row.tableIds.length === 0
                        ? "—"
                        : row.tableIds.length > 1
                          ? `${row.tableIds.length} tables`
                          : "1 table"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="reservation" reservationStatus={row.status} />
                    </TableCell>
                    <TableCell>{RESERVATION_SOURCE_LABELS[row.source]}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/reservations/${row.id}`}
                        className="text-sm font-medium text-apple-copper hover:underline"
                      >
                        Open
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ul className="space-y-3 md:hidden">
        {loading || loadError
          ? null
          : enriched.map((row) => {
          const guest = customers.get(row.customerId);
          return (
            <li
              key={row.id}
              className="rounded-xl border border-border-muted bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-charcoal">
                    {guest?.fullName ?? row.customerId}
                  </p>
                  <p className="text-sm text-charcoal/65">
                    {formatReservationTimeRange(row.startAt, row.endAt)}
                  </p>
                </div>
                <Badge variant="reservation" reservationStatus={row.status} />
              </div>
              <p className="mt-2 text-sm text-charcoal/70">
                {row.guestCount} guests · {RESERVATION_SOURCE_LABELS[row.source]}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => router.push(`/reservations/${row.id}`)}
              >
                View details
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
