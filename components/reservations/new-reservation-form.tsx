"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MockNotice } from "@/components/reservations/mock-notice";
import { useReservationActions } from "@/components/reservations/use-reservation-actions";
import { useStaffDate } from "@/components/staff/staff-workspace";
import { RESERVATION_SOURCE_LABELS } from "@/lib/constants/reservation-ui";
import type { Customer, ReservationSource } from "@/lib/domain/types";
import { getMockRepositories } from "@/lib/mock/repositories";

export function NewReservationForm() {
  const router = useRouter();
  const { selectedDate } = useStaffDate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [time, setTime] = useState("19:00");
  const [source, setSource] = useState<ReservationSource>("walk_in");
  const [notes, setNotes] = useState("");
  const [suggestedTableId, setSuggestedTableId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { createReservation } = useReservationActions(setNotice);

  useEffect(() => {
    void getMockRepositories().customers.list().then(setCustomers);
  }, []);

  async function suggestTable() {
    const startAt = new Date(`${selectedDate}T${time}:00+02:00`).toISOString();
    const end = new Date(`${selectedDate}T${time}:00+02:00`);
    end.setMinutes(end.getMinutes() + 120);
    const id = await getMockRepositories().publicBooking.suggestTable(
      guestCount,
      startAt,
      end.toISOString(),
    );
    setSuggestedTableId(id);
    if (!id) setNotice("No mock table matched capacity — assign manually on detail.");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) return;
    const startAt = new Date(`${selectedDate}T${time}:00+02:00`).toISOString();
    const end = new Date(`${selectedDate}T${time}:00+02:00`);
    end.setMinutes(end.getMinutes() + 120);
    const created = await createReservation({
      customerId,
      guestCount,
      startAt,
      endAt: end.toISOString(),
      status: source === "online" && guestCount > 6 ? "pending" : "confirmed",
      source,
      notes: notes || undefined,
      tableIds: suggestedTableId ? [suggestedTableId] : [],
    });
    router.push(`/reservations/${created.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New reservation"
        description="Walk-in, phone, or WhatsApp entry · uses top-bar date"
        actions={
          <Button variant="outline" onClick={() => router.push("/reservations")}>
            Cancel
          </Button>
        }
      />

      <form
        onSubmit={(e) => void submit(e)}
        className="max-w-xl space-y-5 rounded-xl border border-border-muted bg-white p-5"
      >
        <div className="space-y-2">
          <Label htmlFor="guest">Guest</Label>
          <Select
            id="guest"
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Select guest…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="party">Party size</Label>
            <Input
              id="party"
              type="number"
              min={1}
              max={20}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Start time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value as ReservationSource)}
          >
            {Object.entries(RESERVATION_SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Allergies, occasion, internal note…"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-surface-muted/40 p-3 text-sm">
          <Button type="button" variant="outline" size="sm" onClick={() => void suggestTable()}>
            Suggest table (mock)
          </Button>
          <span className="text-charcoal/70">
            {suggestedTableId
              ? `Suggested: ${suggestedTableId}`
              : "No table suggested yet"}
          </span>
        </div>

        <Button type="submit" disabled={!customerId}>
          Create reservation (mock)
        </Button>
      </form>

      <MockNotice message={notice} onDismiss={() => setNotice(null)} />
    </div>
  );
}
