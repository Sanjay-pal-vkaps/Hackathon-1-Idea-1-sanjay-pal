"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui/page-header";
import { MockNotice } from "@/components/reservations/mock-notice";
import { useReservationActions } from "@/components/reservations/use-reservation-actions";
import type { Customer, Reservation } from "@/lib/domain/types";
import { useStaffPermissions } from "@/components/staff/use-staff-permissions";
import { getMockRepositories } from "@/lib/mock/repositories";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

export function PendingQueueView() {
  const router = useRouter();
  const { can: staffCan } = useStaffPermissions();
  const [pending, setPending] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Map<string, Customer>>(new Map());
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { updateStatus } = useReservationActions(setNotice);

  const load = useCallback(async () => {
    const repos = getMockRepositories();
    const [rows, guestList] = await Promise.all([
      repos.reservations.listPending(),
      repos.customers.list(),
    ]);
    setPending(rows.sort((a, b) => a.startAt.localeCompare(b.startAt)));
    setCustomers(new Map(guestList.map((c) => [c.id, c])));
  }, []);

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

  async function approve(id: string) {
    await updateStatus(
      pending.find((p) => p.id === id)!,
      "confirmed",
    );
    setConfirmId(null);
    await load();
  }

  async function reject(id: string) {
    await updateStatus(pending.find((p) => p.id === id)!, "rejected");
    setRejectId(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending approval"
        description="Requests awaiting manager review · availability re-check is copy-only in Phase 1"
        actions={
          <Button variant="outline" onClick={() => router.push("/reservations")}>
            All reservations
          </Button>
        }
      />

      <ul className="space-y-3">
        {pending.length === 0 ? (
          <li className="rounded-xl border border-dashed border-border-muted bg-white p-8 text-center text-sm text-charcoal/60">
            No pending requests in mock data.
          </li>
        ) : (
          pending.map((row) => {
            const guest = customers.get(row.customerId);
            return (
              <li
                key={row.id}
                className="rounded-xl border border-border-muted bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-charcoal">
                        {guest?.fullName ?? row.customerId}
                      </p>
                      <Badge variant="reservation" reservationStatus="pending" />
                    </div>
                    <p className="mt-1 text-sm text-charcoal/70">
                      {formatReservationDate(row.startAt)} ·{" "}
                      {formatReservationTimeRange(row.startAt, row.endAt)}
                    </p>
                    <p className="text-sm text-charcoal/65">
                      {row.guestCount} guests · {row.notes ?? "No notes"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {staffCan("approve_pending") ? (
                      <>
                        <Button size="sm" onClick={() => setConfirmId(row.id)}>
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectId(row.id)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/reservations/${row.id}`)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <Dialog
        open={confirmId !== null}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Approve reservation?"
        description="Mock flow: in Phase 2 the server would re-check table availability and buffers before confirming."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button onClick={() => confirmId && void approve(confirmId)}>
              Approve (mock)
            </Button>
          </>
        }
      />

      <Dialog
        open={rejectId !== null}
        onOpenChange={(open) => !open && setRejectId(null)}
        title="Reject request?"
        description="Guest would receive a notification when messaging is configured."
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectId(null)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => rejectId && void reject(rejectId)}
            >
              Reject (mock)
            </Button>
          </>
        }
      />

      <MockNotice message={notice} onDismiss={() => setNotice(null)} />
    </div>
  );
}
