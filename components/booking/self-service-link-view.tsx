"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Reservation } from "@/lib/domain/types";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

type LinkPayload = {
  reservation: Reservation;
  guestName: string;
};

export function SelfServiceLinkView({ token }: { token: string }) {
  const [payload, setPayload] = useState<LinkPayload | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/booking/link/${encodeURIComponent(token)}`);
      if (cancelled) return;
      if (!res.ok) {
        setPayload(null);
        return;
      }
      setPayload((await res.json()) as LinkPayload);
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (payload === undefined) {
    return <p className="text-sm text-charcoal/70">Loading link…</p>;
  }

  if (!payload) {
    return (
      <EmptyState
        title="Link not valid"
        description="This link is unknown or expired. Use the link from your booking confirmation or sign in under My bookings."
      />
    );
  }

  const { reservation, guestName } = payload;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your reservation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Badge variant="reservation" reservationStatus={reservation.status} />
        <p className="font-medium text-charcoal">{guestName}</p>
        <p>{formatReservationDate(reservation.startAt)}</p>
        <p>{formatReservationTimeRange(reservation.startAt, reservation.endAt)}</p>
        <p className="text-charcoal/65">{reservation.guestCount} guests</p>
        <p className="text-xs text-charcoal/55">
          Reference {reservation.id} · bookmark this page or use the link from your confirmation email.
        </p>
      </CardContent>
    </Card>
  );
}
