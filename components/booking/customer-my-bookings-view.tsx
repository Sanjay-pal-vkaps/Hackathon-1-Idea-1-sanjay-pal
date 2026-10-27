"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { Badge } from "@/components/ui/badge";
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
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-green border-t-transparent" />
        <p className="mt-3 text-sm text-charcoal/60">Loading your reservations…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-border-muted bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-green/10 text-2xl">
          🔒
        </div>
        <h2 className="mt-4 font-serif text-2xl font-medium text-forest-green">
          Sign in to view your bookings
        </h2>
        <p className="mt-2 text-sm text-charcoal/65">
          Please log in to your guest account to manage and view your table reservations.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row justify-center">
          <Link
            href="/book/login"
            className="rounded-xl bg-forest-green px-6 py-2.5 text-sm font-medium text-warm-ivory transition hover:bg-forest-green/90"
          >
            Sign In
          </Link>
          <Link
            href="/book/register"
            className="rounded-xl border border-border-muted px-6 py-2.5 text-sm font-medium text-charcoal transition hover:bg-surface-muted"
          >
            Register Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-muted/60 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
            Guest Portal
          </span>
          <h2 className="mt-1 font-serif text-3xl font-medium text-forest-green">
            My Reservations
          </h2>
          <p className="mt-0.5 text-xs text-charcoal/60">
            Signed in as {user.email}
          </p>
        </div>

        <Link
          href="/book"
          className="self-start sm:self-auto rounded-full bg-forest-green px-4 py-2 text-xs font-medium text-warm-ivory transition hover:bg-forest-green/90"
        >
          + New Reservation
        </Link>
      </div>

      {loadError ? (
        <p className="text-sm text-red-700">{loadError}</p>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="You haven’t booked any tables yet. Once you make a reservation, it will appear here."
        />
      ) : (
        <ul className="divide-y divide-border-muted/60">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-serif text-lg font-medium text-charcoal">
                  {formatReservationDate(r.startAt)}
                </p>
                <p className="text-sm text-charcoal/65">
                  {formatReservationTimeRange(r.startAt, r.endAt)} · {r.guestCount}{" "}
                  {r.guestCount === 1 ? "Guest" : "Guests"}
                </p>
                {r.notes ? (
                  <p className="mt-1 text-xs text-charcoal/50 italic">
                    “{r.notes}”
                  </p>
                ) : null}
              </div>
              <Badge variant="reservation" reservationStatus={r.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
