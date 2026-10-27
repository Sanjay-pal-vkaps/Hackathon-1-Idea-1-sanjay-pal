"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ActionNotice } from "@/components/reservations/action-notice";
import { useReservationActions } from "@/components/reservations/use-reservation-actions";
import { useStaffDate } from "@/components/staff/staff-workspace";
import { RESERVATION_SOURCE_LABELS } from "@/lib/constants/reservation-ui";
import type { Customer, ReservationSource, RestaurantTable } from "@/lib/domain/types";
import { getRepositories } from "@/lib/repositories";

const TIME_PRESETS = [
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

export function NewReservationForm() {
  const router = useRouter();
  const { selectedDate } = useStaffDate();

  // Form Date (defaults to topbar selectedDate)
  const [resDate, setResDate] = useState(selectedDate);

  // Guest Mode: "existing" or "new"
  const [guestMode, setGuestMode] = useState<"existing" | "new">("existing");

  // Existing Guest State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");

  // New Guest Fields
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Reservation Details
  const [guestCount, setGuestCount] = useState(2);
  const [time, setTime] = useState("13:30");
  const [source, setSource] = useState<ReservationSource>("phone");
  const [notes, setNotes] = useState("");

  // Table Selection
  const [allTables, setAllTables] = useState<RestaurantTable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [suggestedTableId, setSuggestedTableId] = useState<string | null>(null);
  const [suggestedTableLabel, setSuggestedTableLabel] = useState<string | null>(null);

  const [onlineGuestLimit, setOnlineGuestLimit] = useState(6);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { createReservation } = useReservationActions(setNotice);

  useEffect(() => {
    const repos = getRepositories();
    void Promise.all([
      repos.customers.list().then(setCustomers),
      repos.tables.listTables().then(setAllTables),
      repos.settings.getBookingSettings().then((s) => setOnlineGuestLimit(s.onlineGuestLimit)),
    ]);
  }, []);

  // Selected customer preview
  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === customerId) ?? null,
    [customers, customerId],
  );

  async function suggestTable() {
    const startAt = new Date(`${resDate}T${time}:00+02:00`).toISOString();
    const end = new Date(`${resDate}T${time}:00+02:00`);
    end.setMinutes(end.getMinutes() + 120);

    const id = await getRepositories().publicBooking.suggestTable(
      guestCount,
      startAt,
      end.toISOString(),
    );

    setSuggestedTableId(id);
    if (!id) {
      setSuggestedTableLabel(null);
      setNotice("No table matched capacity for this slot — select a table manually or assign on detail page.");
      return;
    }
    const table = allTables.find((t) => t.id === id);
    setSuggestedTableLabel(table ? `Table ${table.number} (${table.zone})` : id);
    setSelectedTableId(id);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    // Validate Guest
    let targetCustomerId = customerId;
    if (guestMode === "new") {
      if (!newFullName.trim() || !newPhone.trim() || !newEmail.trim()) {
        setNotice("Please fill in the new guest's name, phone, and email.");
        return;
      }
    } else {
      if (!targetCustomerId) {
        setNotice("Please select an existing guest or switch to '+ Create New Guest'.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const repos = getRepositories();

      // Step 1: Create customer if in new mode
      if (guestMode === "new") {
        const createdCustomer = await repos.customers.create({
          fullName: newFullName.trim(),
          phone: newPhone.trim(),
          email: newEmail.trim().toLowerCase(),
        });
        targetCustomerId = createdCustomer.id;
      }

      // Step 2: Calculate ISO slot
      const startAt = new Date(`${resDate}T${time}:00+02:00`).toISOString();
      const end = new Date(`${resDate}T${time}:00+02:00`);
      end.setMinutes(end.getMinutes() + 120);

      const needsApproval = source === "online" && guestCount > onlineGuestLimit;

      const finalTableId = selectedTableId || suggestedTableId;

      // Step 3: Create reservation synced with Supabase
      const created = await createReservation({
        customerId: targetCustomerId,
        guestCount,
        startAt,
        endAt: end.toISOString(),
        status: needsApproval ? "pending" : "confirmed",
        source,
        notes: notes || undefined,
        tableIds: finalTableId ? [finalTableId] : [],
      });

      router.push(`/reservations/${created.id}`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not create reservation in database.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="New Reservation"
        description="Create reservation synced with Supabase database · table assignment & guest management"
        actions={
          <Button variant="outline" onClick={() => router.push("/reservations")} className="rounded-xl">
            Cancel
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Form */}
        <form onSubmit={(e) => void submit(e)} className="space-y-6">
          {/* Section 1: Guest Selection / Creation */}
          <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFEBE4] pb-3">
              <h2 className="text-base font-bold text-[#19241C] flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FCEFEA] text-xs font-bold text-[#B95D2B]">
                  1
                </span>
                <span>Guest Information</span>
              </h2>

              {/* Guest Mode Tabs */}
              <div className="flex rounded-xl bg-[#F5F2E9] p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setGuestMode("existing")}
                  className={`rounded-lg px-3 py-1 transition ${
                    guestMode === "existing"
                      ? "bg-white text-charcoal shadow-xs"
                      : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  Existing Guest
                </button>
                <button
                  type="button"
                  onClick={() => setGuestMode("new")}
                  className={`rounded-lg px-3 py-1 transition ${
                    guestMode === "new"
                      ? "bg-[#232E25] text-white shadow-xs"
                      : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  + New Guest
                </button>
              </div>
            </div>

            {guestMode === "existing" ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="guest-select" className="text-xs font-semibold text-charcoal">
                    Select Guest from Database
                  </Label>
                  <Select
                    id="guest-select"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="h-10 text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
                  >
                    <option value="">Choose an existing guest…</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.phone || c.email})
                      </option>
                    ))}
                  </Select>
                </div>

                {selectedCustomer ? (
                  <div className="flex items-center gap-3 rounded-xl border border-black/8 bg-[#FAF8F5] p-3 text-xs">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCEFEA] text-sm font-bold text-[#B95D2B]">
                      {selectedCustomer.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-[#19241C] truncate">{selectedCustomer.fullName}</p>
                      <p className="text-charcoal/65 truncate">{selectedCustomer.phone} · {selectedCustomer.email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 text-[10px]">
                      Verified Guest
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-charcoal/50">
                    Or click <span className="font-semibold text-apple-copper cursor-pointer" onClick={() => setGuestMode("new")}>+ New Guest</span> above to register a new customer in Supabase.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="new-name" className="text-xs font-semibold text-charcoal">
                      Full Name *
                    </Label>
                    <Input
                      id="new-name"
                      required
                      placeholder="e.g. Mikel Arana"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="h-10 text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-phone" className="text-xs font-semibold text-charcoal">
                      Phone Number *
                    </Label>
                    <Input
                      id="new-phone"
                      required
                      placeholder="+34 612 345 678"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="h-10 text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-email" className="text-xs font-semibold text-charcoal">
                      Email Address *
                    </Label>
                    <Input
                      id="new-email"
                      type="email"
                      required
                      placeholder="guest@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="h-10 text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
                    />
                  </div>
                </div>
                <div className="rounded-xl bg-[#F5F2E9]/60 p-2.5 text-xs text-charcoal/70 flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>This customer will be saved to the database immediately upon booking.</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Date, Time & Party */}
          <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-[#19241C] flex items-center gap-2 border-b border-[#EFEBE4] pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FCEFEA] text-xs font-bold text-[#B95D2B]">
                2
              </span>
              <span>Reservation Details</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Date */}
              <div className="space-y-1.5">
                <Label htmlFor="res-date" className="text-xs font-semibold text-charcoal">
                  Date
                </Label>
                <Input
                  id="res-date"
                  type="date"
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="h-10 text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
                />
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <Label htmlFor="res-time" className="text-xs font-semibold text-charcoal">
                  Start Time
                </Label>
                <Input
                  id="res-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-10 text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
                />
              </div>

              {/* Party Size */}
              <div className="space-y-1.5">
                <Label htmlFor="res-party" className="text-xs font-semibold text-charcoal">
                  Party Size (Guests)
                </Label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-[#FAF8F5] text-base font-bold hover:bg-surface-muted"
                  >
                    −
                  </button>
                  <Input
                    id="res-party"
                    type="number"
                    min={1}
                    max={30}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                    className="h-10 text-center font-bold text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.min(30, c + 1))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-[#FAF8F5] text-base font-bold hover:bg-surface-muted"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Time Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-medium text-charcoal/60">Popular Service Slots:</span>
              <div className="flex flex-wrap gap-1.5">
                {TIME_PRESETS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      time === slot
                        ? "bg-[#B95D2B] text-white shadow-xs"
                        : "border border-black/8 bg-[#FAF8F5] text-charcoal hover:bg-white"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div className="space-y-1.5 pt-2">
              <Label htmlFor="res-source" className="text-xs font-semibold text-charcoal">
                Booking Channel / Source
              </Label>
              <Select
                id="res-source"
                value={source}
                onChange={(e) => setSource(e.target.value as ReservationSource)}
                className="h-10 text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
              >
                {Object.entries(RESERVATION_SOURCE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Section 3: Table Assignment & Notes */}
          <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-[#19241C] flex items-center gap-2 border-b border-[#EFEBE4] pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FCEFEA] text-xs font-bold text-[#B95D2B]">
                3
              </span>
              <span>Table Assignment & Notes</span>
            </h2>

            {/* Table Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="table-select" className="text-xs font-semibold text-charcoal">
                  Select Table
                </Label>
                <button
                  type="button"
                  onClick={() => void suggestTable()}
                  className="text-xs font-semibold text-apple-copper hover:underline flex items-center gap-1"
                >
                  <span>✨ Auto-Suggest Table</span>
                </button>
              </div>

              <Select
                id="table-select"
                value={selectedTableId}
                onChange={(e) => {
                  setSelectedTableId(e.target.value);
                  setSuggestedTableId(null);
                }}
                className="h-10 text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
              >
                <option value="">Leave unassigned (assign later)</option>
                {allTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.number} ({t.capacityMin}–{t.capacityMax} guests · {t.zone})
                  </option>
                ))}
              </Select>

              {suggestedTableLabel ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-2.5 text-xs text-emerald-900 font-medium flex items-center justify-between">
                  <span>Suggested Table: <strong>{suggestedTableLabel}</strong></span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Available</span>
                </div>
              ) : null}
            </div>

            {/* Notes */}
            <div className="space-y-1.5 pt-1">
              <Label htmlFor="res-notes" className="text-xs font-semibold text-charcoal">
                Notes & Special Requests
              </Label>
              <Textarea
                id="res-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary requirements (celiac, vegetarian), celebrations, high chairs, terrace preference…"
                className="text-sm bg-[#FAF8F5] border-black/10 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-xl bg-[#B95D2B] px-6 font-semibold text-white hover:bg-[#A85124] shadow-xs"
            >
              {submitting ? "Saving to Database…" : "Confirm & Create Reservation"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/reservations")}
              className="h-11 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Sidebar Live Summary Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-2xs space-y-4 sticky top-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal/80 border-b border-[#EFEBE4] pb-3">
              Reservation Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-charcoal/50 font-medium">Guest:</span>
                <p className="font-bold text-sm text-[#19241C] mt-0.5">
                  {guestMode === "new"
                    ? newFullName || "New Guest"
                    : selectedCustomer?.fullName || "Not selected yet"}
                </p>
                <p className="text-charcoal/60">
                  {guestMode === "new" ? newPhone || newEmail : selectedCustomer?.phone || selectedCustomer?.email}
                </p>
              </div>

              <div className="border-t border-[#EFEBE4] pt-2.5">
                <span className="text-charcoal/50 font-medium">Date & Time:</span>
                <p className="font-semibold text-charcoal mt-0.5">{resDate} at {time}</p>
                <p className="text-charcoal/60">Duration: 2 hours (120 mins)</p>
              </div>

              <div className="border-t border-[#EFEBE4] pt-2.5">
                <span className="text-charcoal/50 font-medium">Party Size:</span>
                <p className="font-semibold text-charcoal mt-0.5">{guestCount} Guests</p>
              </div>

              <div className="border-t border-[#EFEBE4] pt-2.5">
                <span className="text-charcoal/50 font-medium">Table Assignment:</span>
                <p className="font-semibold text-charcoal mt-0.5">
                  {selectedTableId
                    ? `Table ${allTables.find((t) => t.id === selectedTableId)?.number ?? selectedTableId}`
                    : "Unassigned"}
                </p>
              </div>

              <div className="border-t border-[#EFEBE4] pt-2.5">
                <span className="text-charcoal/50 font-medium">Channel:</span>
                <p className="font-semibold text-charcoal mt-0.5 capitalize">{RESERVATION_SOURCE_LABELS[source]}</p>
              </div>

              <div className="rounded-xl bg-[#FAF8F5] p-3 border border-black/5 text-[11px] text-charcoal/70">
                Data will be directly synced and verified in Supabase tables: <code>customers</code>, <code>reservations</code>, <code>reservation_tables</code>, and <code>activity_events</code>.
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActionNotice message={notice} onDismiss={() => setNotice(null)} />
    </div>
  );
}
