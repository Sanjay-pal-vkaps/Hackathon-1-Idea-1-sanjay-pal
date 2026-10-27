"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import type { Customer, Reservation } from "@/lib/domain/types";
import { getRepositories } from "@/lib/repositories";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

export function CustomerDetailView({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);
  const [history, setHistory] = useState<Reservation[]>([]);

  const load = useCallback(async () => {
    const repos = getRepositories();
    const guest = await repos.customers.get(customerId);
    setCustomer(guest);
    if (!guest) return;
    const rows = await repos.reservations.list();
    setHistory(
      rows
        .filter((r) => r.customerId === customerId)
        .sort((a, b) => b.startAt.localeCompare(a.startAt)),
    );
  }, [customerId]);

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

  if (customer === undefined) {
    return <PageHeader title="Loading…" />;
  }

  if (!customer) {
    return (
      <div className="space-y-4">
        <PageHeader title="Customer not found" />
        <Button variant="outline" onClick={() => router.push("/customers")}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.fullName}
        description={customer.email}
        actions={
          <Button variant="outline" onClick={() => router.push("/customers")}>
            Back
          </Button>
        }
      />

      <div className="rounded-xl border border-border-muted bg-white p-5 text-sm">
        <p>{customer.phone}</p>
        <p className="mt-1 text-charcoal/55">ID: {customer.id}</p>
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold text-charcoal">
          Booking history
        </h2>
        <ul className="divide-y divide-border-muted rounded-xl border border-border-muted bg-white">
          {history.length === 0 ? (
            <li className="p-6 text-sm text-charcoal/60">No reservations yet.</li>
          ) : (
            history.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-charcoal">
                    {formatReservationDate(r.startAt)}
                  </p>
                  <p className="text-sm text-charcoal/65">
                    {formatReservationTimeRange(r.startAt, r.endAt)} · {r.guestCount}{" "}
                    guests
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="reservation" reservationStatus={r.status} />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/reservations/${r.id}`)}
                  >
                    Open
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
