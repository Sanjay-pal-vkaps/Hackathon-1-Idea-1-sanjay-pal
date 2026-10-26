"use client";

import { useEffect, useState } from "react";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Reservation } from "@/lib/domain/types";
import { getMockRepositories } from "@/lib/mock/repositories";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

export function CustomerMyBookingsView() {
  const { user } = useCustomerAuth();
  const [rows, setRows] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const all = await getMockRepositories().reservations.list();
      const linkedId = user.id.startsWith("cust-") ? user.id : "cust-001";
      const mine = all.filter((r) => r.customerId === linkedId);
      if (!cancelled) setRows(mine.length > 0 ? mine : all.filter((r) => r.customerId === "cust-001").slice(0, 3));
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <EmptyState
        title="Sign in to see demo bookings"
        description="Guest booking without an account does not populate this list."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border-muted">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-charcoal">
                  {formatReservationDate(r.startAt)}
                </p>
                <p className="text-sm text-charcoal/65">
                  {formatReservationTimeRange(r.startAt, r.endAt)} · {r.guestCount} guests
                </p>
              </div>
              <Badge variant="reservation" reservationStatus={r.status} />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-charcoal/55">
          Mock list for {user.fullName} — not a live account history.
        </p>
      </CardContent>
    </Card>
  );
}
