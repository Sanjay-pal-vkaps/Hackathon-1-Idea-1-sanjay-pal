"use client";

import { useEffect, useState } from "react";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { mapReservationRow, type ReservationRow } from "@/lib/data/mappers";
import type { Reservation } from "@/lib/domain/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";

export function CustomerMyBookingsView() {
  const { user, loading } = useCustomerAuth();
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("reservations")
        .select("*, reservation_tables(table_id)")
        .order("start_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        setLoadError(error.message);
        return;
      }
      setLoadError(null);
      setRows((data ?? []).map((r) => mapReservationRow(r as ReservationRow)));
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return <p className="text-sm text-charcoal/70">Loading…</p>;
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in to see your bookings"
        description="Guest booking without an account does not appear here until you register with the same email."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {loadError ? (
          <p className="text-sm text-red-700">{loadError}</p>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            description="Book a table or link past guest bookings by registering with the same email."
          />
        ) : (
          <ul className="divide-y divide-border-muted">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
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
                <Badge variant="reservation" reservationStatus={r.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
