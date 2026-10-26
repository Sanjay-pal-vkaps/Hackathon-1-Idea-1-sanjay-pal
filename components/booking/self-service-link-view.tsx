"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Customer, Reservation } from "@/lib/domain/types";
import { MOCK_SELF_SERVICE_TOKENS } from "@/lib/mock/fixtures/self-service";
import { getMockRepositories } from "@/lib/mock/repositories";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

export function SelfServiceLinkView({ token }: { token: string }) {
  const [reservation, setReservation] = useState<Reservation | null | undefined>(
    undefined,
  );
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (token !== MOCK_SELF_SERVICE_TOKENS.valid.token) {
        if (!cancelled) setReservation(null);
        return;
      }
      const repos = getMockRepositories();
      const row = await repos.reservations.get(MOCK_SELF_SERVICE_TOKENS.valid.reservationId);
      if (cancelled) return;
      setReservation(row);
      if (row) setCustomer(await repos.customers.get(row.customerId));
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (reservation === undefined) {
    return <p className="text-sm text-charcoal/70">Loading link…</p>;
  }

  if (!reservation) {
    return (
      <EmptyState
        title="Link not valid"
        description="This demo token is expired or unknown. Try token demo-valid-token in U8 docs."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your reservation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Badge variant="reservation" reservationStatus={reservation.status} />
        <p className="font-medium text-charcoal">{customer?.fullName ?? "Guest"}</p>
        <p>{formatReservationDate(reservation.startAt)}</p>
        <p>{formatReservationTimeRange(reservation.startAt, reservation.endAt)}</p>
        <p className="text-charcoal/65">{reservation.guestCount} guests</p>
        <p className="text-xs text-charcoal/55">
          Self-service link demo — exactly one booking shown for valid token.
        </p>
      </CardContent>
    </Card>
  );
}
