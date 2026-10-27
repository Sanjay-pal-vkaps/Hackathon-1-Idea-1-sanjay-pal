"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { ActionNotice } from "@/components/reservations/action-notice";
import { useReservationActions } from "@/components/reservations/use-reservation-actions";
import { useStaffPermissions } from "@/components/staff/use-staff-permissions";
import { Alert } from "@/components/ui/alert";
import {
  RESERVATION_SOURCE_LABELS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/constants/reservation-ui";
import type { Customer, Reservation, RestaurantTable } from "@/lib/domain/types";
import { getRepositories } from "@/lib/repositories";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";
import {
  canTransitionReservation,
  nextStatuses,
  TRANSITION_DISABLED_HINT,
} from "@/lib/utils/reservation-transitions";

type ReservationDetailViewProps = {
  reservationId: string;
};

function tableLabel(tables: RestaurantTable[], id: string) {
  const table = tables.find((t) => t.id === id);
  return table ? `Table ${table.number}` : id;
}

export function ReservationDetailView({ reservationId }: ReservationDetailViewProps) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null | undefined>(
    undefined,
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const [rescheduleStart, setRescheduleStart] = useState("");
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  const { updateStatus, updateReservation } = useReservationActions(setNotice);
  const { can: staffCan } = useStaffPermissions();

  const load = useCallback(async () => {
    const repos = getRepositories();
    const row = await repos.reservations.get(reservationId);
    if (!row) {
      setReservation(null);
      return;
    }
    setReservation(row);
    setSelectedTableIds(row.tableIds);
    const [guest, tableList] = await Promise.all([
      repos.customers.get(row.customerId),
      repos.tables.listTables(),
    ]);
    setCustomer(guest);
    setTables(tableList);
    const startLocal = new Date(row.startAt);
    const pad = (n: number) => String(n).padStart(2, "0");
    setRescheduleStart(
      `${startLocal.getFullYear()}-${pad(startLocal.getMonth() + 1)}-${pad(startLocal.getDate())}T${pad(startLocal.getHours())}:${pad(startLocal.getMinutes())}`,
    );
  }, [reservationId]);

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

  const timeline = useMemo(() => {
    if (!reservation) return [];
    const items = [
      { at: reservation.createdAt, label: "Created" },
      { at: reservation.updatedAt, label: `Status: ${RESERVATION_STATUS_LABELS[reservation.status]}` },
    ];
    return items;
  }, [reservation]);

  if (reservation === undefined) {
    return <PageHeader title="Loading…" description="Reservation detail" />;
  }

  if (reservation === null) {
    return (
      <div className="space-y-4">
        <PageHeader title="Reservation not found" />
        <Button variant="outline" onClick={() => router.push("/reservations")}>
          Back to list
        </Button>
      </div>
    );
  }

  const allowed = nextStatuses(reservation.status);

  async function applyStatus(status: Reservation["status"]) {
    if (!canTransitionReservation(reservation!.status, status)) return;

    if (reservation!.status === "pending" && status === "confirmed") {
      const res = await fetch(
        `/api/staff/reservations/${reservation!.id}/approve`,
        { method: "POST" },
      );
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setNotice(body.error ?? "Could not approve — check availability.");
        return;
      }
      setNotice("Confirmed. Guest emailed when configured.");
      await load();
      return;
    }

    if (reservation!.status === "pending" && status === "rejected") {
      const res = await fetch(
        `/api/staff/reservations/${reservation!.id}/reject`,
        { method: "POST" },
      );
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setNotice(body.error ?? "Could not reject this request.");
        return;
      }
      setNotice("Rejected. Guest emailed when configured.");
      await load();
      return;
    }

    const updated = await updateStatus(reservation!, status);
    setReservation(updated);
  }

  async function saveTables() {
    const updated = await updateReservation(reservation!.id, {
      tableIds: selectedTableIds,
    });
    setReservation(updated);
    setTablesOpen(false);
  }

  async function saveReschedule() {
    const start = new Date(rescheduleStart);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 120);
    const updated = await updateReservation(reservation!.id, {
      startAt: start.toISOString(),
      endAt: end.toISOString(),
    });
    setReservation(updated);
    setRescheduleOpen(false);
  }

  const canEdit = staffCan("edit_reservation");
  const canApprove = staffCan("approve_pending");
  const canCancel = staffCan("cancel_reservation");
  const canReschedule = staffCan("reschedule_reservation");
  const canAssign = staffCan("assign_tables");

  const actionBar =
    canEdit || canApprove || canCancel || canReschedule || canAssign ? (
      <div className="flex flex-wrap gap-2">
        {canApprove && allowed.includes("confirmed") ? (
          <Button size="sm" onClick={() => void applyStatus("confirmed")}>
            Approve
          </Button>
        ) : null}
        {canApprove && allowed.includes("rejected") ? (
          <Button size="sm" variant="outline" onClick={() => void applyStatus("rejected")}>
            Reject
          </Button>
        ) : null}
        {canEdit && allowed.includes("arrived") ? (
          <Button size="sm" onClick={() => void applyStatus("arrived")}>
            Mark arrived
          </Button>
        ) : null}
        {canEdit && allowed.includes("completed") ? (
          <Button size="sm" onClick={() => void applyStatus("completed")}>
            Complete
          </Button>
        ) : null}
        {canEdit && allowed.includes("no_show") ? (
          <Button size="sm" variant="outline" onClick={() => void applyStatus("no_show")}>
            No-show
          </Button>
        ) : null}
        {canCancel && allowed.includes("cancelled") ? (
          <Button size="sm" variant="outline" onClick={() => setCancelOpen(true)}>
            Cancel
          </Button>
        ) : null}
        {canReschedule &&
        !["cancelled", "completed", "rejected", "no_show"].includes(
          reservation.status,
        ) ? (
          <Button size="sm" variant="ghost" onClick={() => setRescheduleOpen(true)}>
            Reschedule
          </Button>
        ) : null}
        {canAssign ? (
          <Button size="sm" variant="ghost" onClick={() => setTablesOpen(true)}>
            Assign tables
          </Button>
        ) : null}
      </div>
    ) : (
      <Alert variant="info">View-only for your role — changes require Manager or Owner.</Alert>
    );

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <PageHeader
        title={customer?.fullName ?? reservation.id}
        description={`${formatReservationDate(reservation.startAt)} · ${RESERVATION_SOURCE_LABELS[reservation.source]}`}
        actions={
          <Button variant="outline" onClick={() => router.push("/reservations")}>
            Back
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="reservation" reservationStatus={reservation.status} />
        <span className="text-sm text-charcoal/65">{reservation.id}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6 rounded-xl border border-border-muted bg-white p-5">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal/55">
              Guest
            </h2>
            {customer ? (
              <div className="mt-2 space-y-1 text-sm">
                <p className="font-medium text-charcoal">{customer.fullName}</p>
                <p className="text-charcoal/70">{customer.email}</p>
                <p className="text-charcoal/70">{customer.phone}</p>
                <Link
                  href={`/customers/${customer.id}`}
                  className="text-sm font-medium text-apple-copper hover:underline"
                >
                  Customer profile
                </Link>
              </div>
            ) : (
              <p className="mt-2 text-sm text-charcoal/60">Unknown guest</p>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal/55">
              Booking
            </h2>
            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-charcoal/55">Time</dt>
                <dd className="font-medium">
                  {formatReservationTimeRange(reservation.startAt, reservation.endAt)}
                </dd>
              </div>
              <div>
                <dt className="text-charcoal/55">Party size</dt>
                <dd className="font-medium">{reservation.guestCount} guests</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-charcoal/55">Tables</dt>
                <dd className="font-medium">
                  {reservation.tableIds.length === 0
                    ? "Unassigned"
                    : reservation.tableIds
                        .map((id) => tableLabel(tables, id))
                        .join(", ")}
                  {reservation.tableIds.length > 1 ? (
                    <span className="ml-2 text-xs text-charcoal/55">(combined seating)</span>
                  ) : null}
                </dd>
              </div>
              {reservation.notes ? (
                <div className="sm:col-span-2">
                  <dt className="text-charcoal/55">Notes</dt>
                  <dd>{reservation.notes}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="hidden lg:block">{actionBar}</section>
        </div>

        <aside className="rounded-xl border border-border-muted bg-white p-5">
          <h2 className="text-sm font-semibold text-charcoal">Timeline</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {timeline.map((item, i) => (
              <li key={i} className="border-l-2 border-apple-copper/40 pl-3">
                <p className="font-medium text-charcoal">{item.label}</p>
                <p className="text-xs text-charcoal/55">
                  {new Date(item.at).toLocaleString("en-GB")}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-charcoal/50">{TRANSITION_DISABLED_HINT}</p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-muted bg-warm-ivory p-3 lg:hidden">
        {actionBar}
      </div>

      <Dialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel reservation?"
        description="Status will update in Supabase. Cancellation emails are not sent yet."
        footer={
          <>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Keep
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                void applyStatus("cancelled").then(() => setCancelOpen(false));
              }}
            >
              Cancel booking
            </Button>
          </>
        }
      />

      <Dialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        title="Reschedule"
        description="Adjust start time · end time stays 2 hours after start."
        footer={
          <>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
              Close
            </Button>
            <Button onClick={() => void saveReschedule()}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="reschedule-start">New start</Label>
          <Input
            id="reschedule-start"
            type="datetime-local"
            value={rescheduleStart}
            onChange={(e) => setRescheduleStart(e.target.value)}
          />
        </div>
      </Dialog>

      <Dialog
        open={tablesOpen}
        onOpenChange={setTablesOpen}
        title="Assign tables"
        description="Select one or more tables for combined seating."
        footer={
          <>
            <Button variant="outline" onClick={() => setTablesOpen(false)}>
              Close
            </Button>
            <Button onClick={() => void saveTables()}>Save assignment</Button>
          </>
        }
      >
        <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
          {tables.map((table) => {
            const checked = selectedTableIds.includes(table.id);
            return (
              <li key={table.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-muted px-3 py-2 hover:bg-surface-muted/50">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedTableIds((prev) =>
                        checked
                          ? prev.filter((id) => id !== table.id)
                          : [...prev, table.id],
                      );
                    }}
                  />
                  <span className="font-medium">
                    Table {table.number} · {table.capacityMin}–{table.capacityMax}
                  </span>
                  <span className="text-charcoal/55">{table.zone}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Dialog>

      <ActionNotice message={notice} onDismiss={() => setNotice(null)} />
    </div>
  );
}
