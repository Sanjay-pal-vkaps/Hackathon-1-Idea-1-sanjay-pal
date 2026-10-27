"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useStaffDate } from "@/components/staff/staff-workspace";
import type { Customer, Reservation, ServiceShift } from "@/lib/domain/types";
import { getRepositories } from "@/lib/repositories";
import { formatReservationTime } from "@/lib/utils/reservation-format";

export function ScheduleDayView() {
  const router = useRouter();
  const { selectedDate } = useStaffDate();
  const [shifts, setShifts] = useState<ServiceShift[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Map<string, Customer>>(new Map());

  const load = useCallback(async () => {
    const repos = getRepositories();
    const [shiftList, rows, guestList] = await Promise.all([
      repos.settings.listServiceShifts(),
      repos.reservations.list({ date: selectedDate }),
      repos.customers.list(),
    ]);
    setShifts(shiftList);
    setReservations(rows);
    setCustomers(new Map(guestList.map((c) => [c.id, c])));
  }, [selectedDate]);

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

  const byShift = useMemo(() => {
    return shifts.map((shift) => {
      const items = reservations.filter((r) => {
        const time = formatReservationTime(r.startAt);
        return time >= shift.startTime && time < shift.endTime;
      });
      return { shift, items };
    });
  }, [reservations, shifts]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description={`Day view · ${selectedDate} · live reservations`}
      />

      <div className="space-y-4">
        {byShift.map(({ shift, items }) => (
          <section
            key={shift.id}
            className="rounded-xl border border-border-muted bg-white p-4"
          >
            <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold text-charcoal">{shift.name}</h2>
                <p className="text-sm text-charcoal/65">
                  {shift.startTime} – {shift.endTime} · default{" "}
                  {shift.defaultDurationMinutes} min
                </p>
              </div>
              <span className="text-sm text-charcoal/55">
                {items.length} booking{items.length === 1 ? "" : "s"}
              </span>
            </header>
            <ul className="space-y-2">
              {items.length === 0 ? (
                <li className="text-sm text-charcoal/55">No reservations in this shift.</li>
              ) : (
                items.map((r) => {
                  const guest = customers.get(r.customerId);
                  return (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-muted/40 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {formatReservationTime(r.startAt)} ·{" "}
                          {guest?.fullName ?? r.customerId}
                        </p>
                        <p className="text-xs text-charcoal/55">
                          {r.guestCount} guests
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
                  );
                })
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
