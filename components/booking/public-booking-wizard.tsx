"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PublicTimeSlot, ServiceShift } from "@/lib/domain/types";
import { getRepositories } from "@/lib/repositories";
import {
  formatReservationDate,
  formatReservationTimeRange,
} from "@/lib/utils/reservation-format";
import { cn } from "@/lib/utils/cn";

type WizardStep =
  | "intro"
  | "date"
  | "service"
  | "guests"
  | "time"
  | "details"
  | "review"
  | "result";

type ResultKind = "confirmed" | "pending" | "unavailable";

type GuestDetails = {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
};

const FLOW_STEPS: { id: WizardStep; label: string; number: number }[] = [
  { id: "date", label: "Date", number: 1 },
  { id: "service", label: "Service", number: 2 },
  { id: "guests", label: "Party", number: 3 },
  { id: "time", label: "Time", number: 4 },
  { id: "details", label: "Details", number: 5 },
  { id: "review", label: "Review", number: 6 },
];

function stepIndex(step: WizardStep) {
  if (step === "intro") return -1;
  if (step === "result") return FLOW_STEPS.length;
  return FLOW_STEPS.findIndex((s) => s.id === step);
}

function addDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function PublicBookingWizard() {
  const [step, setStep] = useState<WizardStep>("intro");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [shifts, setShifts] = useState<ServiceShift[]>([]);
  const [guestLimit, setGuestLimit] = useState(6);
  const [slots, setSlots] = useState<PublicTimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [date, setDate] = useState("");
  const [serviceShiftId, setServiceShiftId] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [guest, setGuest] = useState<GuestDetails>({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [resultKind, setResultKind] = useState<ResultKind>("confirmed");
  const [resultLinkToken, setResultLinkToken] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof GuestDetails, string>>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const from = todayIso();
      const to = addDays(from, 28);
      const params = new URLSearchParams({ from, to });
      const res = await fetch(`/api/booking/bootstrap?${params}`);
      if (!res.ok) return;
      const body = (await res.json()) as {
        dates: string[];
        shifts: ServiceShift[];
        guestLimit: number;
      };
      if (cancelled) return;
      setAvailableDates(body.dates);
      setShifts(body.shifts);
      setGuestLimit(body.guestLimit);
      if (body.dates[0]) setDate(body.dates[0]);
      if (body.shifts[0]) setServiceShiftId(body.shifts[0].id);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadSlots = useCallback(async () => {
    if (!date || !serviceShiftId) return;
    setLoadingSlots(true);
    const rows = await getRepositories().publicBooking.listTimeSlots(
      date,
      serviceShiftId,
      guestCount,
    );
    setSlots(rows);
    setSlotId(null);
    setLoadingSlots(false);
  }, [date, serviceShiftId, guestCount]);

  useEffect(() => {
    if (step !== "time" && step !== "review" && step !== "result") return;
    let cancelled = false;
    (async () => {
      if (!date || !serviceShiftId) return;
      setLoadingSlots(true);
      const rows = await getRepositories().publicBooking.listTimeSlots(
        date,
        serviceShiftId,
        guestCount,
      );
      if (cancelled) return;
      setSlots(rows);
      setLoadingSlots(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [date, serviceShiftId, step, guestCount]);

  const selectedShift = shifts.find((s) => s.id === serviceShiftId);
  const selectedSlot = slots.find((s) => s.id === slotId) ?? null;

  const calendarDays = useMemo(() => {
    const from = todayIso();
    return Array.from({ length: 28 }, (_, i) => addDays(from, i));
  }, []);

  const progressIndex = stepIndex(step);

  function goNext() {
    const order: WizardStep[] = [
      "intro",
      "date",
      "service",
      "guests",
      "time",
      "details",
      "review",
      "result",
    ];
    const i = order.indexOf(step);
    if (i >= 0 && i < order.length - 1) setStep(order[i + 1]!);
  }

  function goBack() {
    const order: WizardStep[] = [
      "intro",
      "date",
      "service",
      "guests",
      "time",
      "details",
      "review",
      "result",
    ];
    const i = order.indexOf(step);
    if (i > 0) setStep(order[i - 1]!);
  }

  function validateDetails() {
    const errors: Partial<Record<keyof GuestDetails, string>> = {};
    if (!guest.fullName.trim()) errors.fullName = "Name is required";
    if (!guest.phone.trim() || guest.phone.trim().length < 6) {
      errors.phone = "Enter a valid phone number";
    }
    if (!isValidEmail(guest.email)) errors.email = "Enter a valid email address";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const [submitting, setSubmitting] = useState(false);

  async function submitBooking() {
    if (!selectedSlot) return;

    setSubmitting(true);
    try {
      const result = await getRepositories().publicBooking.submitGuestBooking({
        fullName: guest.fullName,
        email: guest.email,
        phone: guest.phone,
        notes: guest.notes || undefined,
        guestCount,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
      });
      setResultKind(result.kind);
      setResultLinkToken(result.linkToken ?? null);
      setStep("result");
    } catch {
      setResultLinkToken(null);
      setResultKind("unavailable");
      setStep("result");
    } finally {
      setSubmitting(false);
    }
  }

  const detailsValid = useMemo(
    () =>
      guest.fullName.trim().length > 0 &&
      guest.phone.trim().length >= 6 &&
      isValidEmail(guest.email),
    [guest.email, guest.fullName, guest.phone],
  );

  const canNext =
    step === "intro" ||
    (step === "date" && Boolean(date) && availableDates.includes(date)) ||
    (step === "service" && Boolean(serviceShiftId)) ||
    (step === "guests" && guestCount >= 1 && guestCount <= 20) ||
    (step === "time" && Boolean(selectedSlot?.available)) ||
    (step === "details" && detailsValid) ||
    step === "review";

  function handlePrimary() {
    if (step === "review") {
      void submitBooking();
      return;
    }
    if (step === "details") {
      if (!validateDetails()) return;
      goNext();
      return;
    }
    if (step === "time" && !selectedSlot?.available) return;
    goNext();
  }

  const primaryLabel =
    step === "intro"
      ? "Select Date & Time"
      : step === "review"
        ? submitting
          ? "Confirming Reservation…"
          : "Confirm Reservation"
        : step === "result"
          ? "Done"
          : "Continue →";

  return (
    <div className="flex flex-1 flex-col">
      {/* Title & Eyebrow Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-forest-green/20 bg-forest-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest-green">
          <span>🍏</span> Iturrieta Sagardotegia · Online Reservations
        </div>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-forest-green sm:text-4xl md:text-5xl">
          Reserve your table in Aramaio
        </h1>
        <p className="mt-2 text-sm text-charcoal/70 sm:text-base">
          Live table availability, direct kupela cider experience, and instant booking confirmation.
        </p>
      </div>

      {/* Main Grid: Left for Wizard Steps, Right for Sticky Booking Summary */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Side: Booking Wizard (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          {/* Progress Indicator */}
          {step !== "intro" && step !== "result" ? (
            <div className="mb-6">
              <nav aria-label="Booking steps" className="overflow-x-auto pb-2">
                <ol className="flex items-center gap-2 min-w-max">
                  {FLOW_STEPS.map((s, i) => {
                    const active = s.id === step;
                    const done = i < progressIndex;
                    return (
                      <li key={s.id} className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition",
                            active && "bg-forest-green text-warm-ivory shadow-sm ring-2 ring-forest-green/20",
                            done && !active && "bg-forest-green/15 text-forest-green",
                            !active && !done && "bg-surface-muted text-charcoal/50",
                          )}
                        >
                          <span className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                            active && "bg-warm-ivory text-forest-green",
                            done && !active && "bg-forest-green text-white",
                            !active && !done && "bg-charcoal/20 text-charcoal/70",
                          )}>
                            {done && !active ? "✓" : s.number}
                          </span>
                          <span>{s.label}</span>
                        </div>
                        {i < FLOW_STEPS.length - 1 ? (
                          <span className="text-border-muted" aria-hidden>›</span>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          ) : null}

          {/* STEP: Intro */}
          {step === "intro" ? (
            <div className="overflow-hidden rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-6">
                <Image
                  src="/images/landing/txotx.jpg"
                  alt="Txotx ritual at Iturrieta cider house"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-warm-ivory">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-apple-copper">
                    Basque Dining Tradition
                  </span>
                  <p className="font-serif text-xl sm:text-2xl font-medium">
                    Convivial tables, open cider barrels & charcoal grills
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-medium text-forest-green">
                  Welcome to the Sagardotegi Experience
                </h2>
                <p className="text-sm leading-relaxed text-charcoal/75 sm:text-base">
                  Booking is quick and seamless. You can reserve for lunch or dinner with instant confirmation. No account or prepayment required.
                </p>

                <div className="grid gap-3 pt-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-border-muted/80 bg-surface-muted/30 p-3.5">
                    <p className="text-base">🍷</p>
                    <p className="mt-1 font-semibold text-xs text-charcoal">Unlimited Cider</p>
                    <p className="text-[11px] text-charcoal/60">From kupelas during txotx</p>
                  </div>
                  <div className="rounded-xl border border-border-muted/80 bg-surface-muted/30 p-3.5">
                    <p className="text-base">🥩</p>
                    <p className="mt-1 font-semibold text-xs text-charcoal">Traditional Menu</p>
                    <p className="text-[11px] text-charcoal/60">Chuletón, cod & Idiazabal</p>
                  </div>
                  <div className="rounded-xl border border-border-muted/80 bg-surface-muted/30 p-3.5">
                    <p className="text-base">⚡</p>
                    <p className="mt-1 font-semibold text-xs text-charcoal">Instant Confirm</p>
                    <p className="text-[11px] text-charcoal/60">Direct live availability</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-muted/60">
                  <Button
                    type="button"
                    size="lg"
                    className="w-full bg-forest-green hover:bg-forest-green/90 text-warm-ivory py-6 text-base font-medium rounded-xl shadow-sm"
                    onClick={() => setStep("date")}
                  >
                    Select Date & Guests →
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {/* STEP: Date */}
          {step === "date" ? (
            <div className="rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                  Step 1 of 6
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-forest-green">
                  Choose your visit date
                </h2>
                <p className="mt-1 text-sm text-charcoal/65">
                  We are open Tuesday through Sunday (Mondays closed). Select from the next 4 weeks below.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {calendarDays.map((day) => {
                  const open = availableDates.includes(day);
                  const selected = date === day;
                  const dObj = new Date(`${day}T12:00:00`);
                  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(dObj);
                  const dayNum = new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(dObj);
                  const monthName = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(dObj);
                  const isToday = day === todayIso();

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={!open}
                      onClick={() => setDate(day)}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition duration-200",
                        selected && "border-forest-green bg-forest-green/10 ring-2 ring-forest-green text-forest-green shadow-sm",
                        !selected && open && "border-border-muted bg-white hover:border-forest-green/60 hover:bg-surface-muted/40",
                        !open && "cursor-not-allowed border-dashed bg-surface-muted/30 opacity-40 text-charcoal/40",
                      )}
                    >
                      {isToday ? (
                        <span className="absolute top-1.5 right-2 rounded-full bg-apple-copper/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-apple-copper">
                          Today
                        </span>
                      ) : null}
                      <span className="text-xs font-medium uppercase tracking-wider text-charcoal/55">
                        {weekday}
                      </span>
                      <span className="my-0.5 font-serif text-2xl font-bold">
                        {dayNum}
                      </span>
                      <span className="text-[11px] text-charcoal/60 font-medium">
                        {monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* STEP: Service Shift */}
          {step === "service" ? (
            <div className="rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                  Step 2 of 6
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-forest-green">
                  Select Lunch or Dinner
                </h2>
                <p className="mt-1 text-sm text-charcoal/65">
                  Choose whether you want daytime mountain views or cozy fireside tavern dining.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {shifts.map((shift) => {
                  const selected = serviceShiftId === shift.id;
                  const isLunch = shift.name.toLowerCase().includes("lunch") || shift.startTime.startsWith("1");
                  return (
                    <button
                      key={shift.id}
                      type="button"
                      onClick={() => setServiceShiftId(shift.id)}
                      className={cn(
                        "flex flex-col items-start rounded-2xl border p-5 text-left transition duration-200",
                        selected
                          ? "border-forest-green bg-forest-green/10 ring-2 ring-forest-green shadow-sm"
                          : "border-border-muted bg-white hover:border-forest-green/60 hover:bg-surface-muted/30",
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-2xl">{isLunch ? "☀️" : "🌙"}</span>
                        {selected ? (
                          <span className="rounded-full bg-forest-green px-2 py-0.5 text-[10px] font-bold uppercase text-warm-ivory">
                            Selected
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-3 font-serif text-xl font-medium text-forest-green">
                        {shift.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-apple-copper">
                        {shift.startTime} – {shift.endTime}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
                        {isLunch
                          ? "Sunny terrace views of the Aramaio valley, apple orchards & daylight txotx pours."
                          : "Atmospheric evening dining by candlelight and the warm glow of the open grill."}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* STEP: Guests */}
          {step === "guests" ? (
            <div className="rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                  Step 3 of 6
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-forest-green">
                  How many guests are coming?
                </h2>
                <p className="mt-1 text-sm text-charcoal/65">
                  Select your party size. Everyone is welcome at our long communal tables!
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-6">
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setGuestCount((n) => Math.max(1, n - 1))}
                    aria-label="Decrease guests"
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-muted bg-surface-muted/40 text-2xl font-bold text-charcoal transition hover:border-forest-green hover:bg-forest-green hover:text-white"
                  >
                    −
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="font-serif text-6xl font-bold tabular-nums text-forest-green">
                      {guestCount}
                    </span>
                    <span className="mt-1 text-xs font-medium uppercase tracking-wider text-charcoal/50">
                      {guestCount === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGuestCount((n) => Math.min(20, n + 1))}
                    aria-label="Increase guests"
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-muted bg-surface-muted/40 text-2xl font-bold text-charcoal transition hover:border-forest-green hover:bg-forest-green hover:text-white"
                  >
                    +
                  </button>
                </div>

                {/* Quick Selection Chips */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {[2, 4, 6, 8, 10, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-semibold transition",
                        guestCount === num
                          ? "bg-forest-green text-warm-ivory shadow-sm"
                          : "border border-border-muted bg-surface-muted/50 text-charcoal/70 hover:border-forest-green hover:text-forest-green",
                      )}
                    >
                      {num} People
                    </button>
                  ))}
                </div>

                {guestCount > guestLimit ? (
                  <div className="mt-6 w-full rounded-2xl border border-apple-copper/40 bg-apple-copper/10 p-4 text-xs text-charcoal/80">
                    <p className="font-semibold text-apple-copper">
                      👥 Large Party (Over {guestLimit} Guests)
                    </p>
                    <p className="mt-1 leading-relaxed">
                      For large groups and celebrations, your request goes directly to our priority host queue. Our staff will confirm your custom table setup promptly!
                    </p>
                  </div>
                ) : (
                  <p className="mt-6 text-xs text-charcoal/50">
                    ✓ Instant automatic confirmation available for parties up to {guestLimit} guests.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {/* STEP: Time Slot */}
          {step === "time" ? (
            <div className="rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                    Step 4 of 6
                  </span>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-forest-green">
                    Pick your arrival time
                  </h2>
                  <p className="mt-1 text-sm text-charcoal/65">
                    Live table availability for {guestCount} {guestCount === 1 ? "guest" : "guests"} on {formatReservationDate(`${date}T12:00:00+02:00`)}.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void loadSlots()}
                  className="self-start sm:self-auto text-xs"
                >
                  ↻ Refresh times
                </Button>
              </div>

              {loadingSlots ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-green border-t-transparent" />
                  <p className="mt-3 text-sm text-charcoal/60">Checking table availability…</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-muted p-8 text-center text-sm text-charcoal/60">
                  No slots available for this service. Please try selecting a different service or date.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {slots.map((slot) => {
                    const selected = slotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSlotId(slot.id)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border p-4 text-left transition duration-200",
                          selected && slot.available && "border-forest-green bg-forest-green/10 ring-2 ring-forest-green text-forest-green shadow-sm",
                          !selected && slot.available && "border-border-muted bg-white hover:border-forest-green/60 hover:bg-surface-muted/30",
                          !slot.available && "cursor-not-allowed border-dashed bg-surface-muted/30 opacity-45",
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">⏰</span>
                          <div>
                            <span className="font-semibold text-sm">
                              {formatReservationTimeRange(slot.startAt, slot.endAt)}
                            </span>
                            <span className="block text-[11px] text-charcoal/50">
                              2 hr traditional dining window
                            </span>
                          </div>
                        </div>

                        {slot.available ? (
                          <span className="rounded-full bg-forest-green/10 px-2 py-0.5 text-[10px] font-bold uppercase text-forest-green">
                            Available
                          </span>
                        ) : (
                          <span className="rounded-full bg-charcoal/10 px-2 py-0.5 text-[10px] font-medium text-charcoal/60">
                            {slot.reason ?? "Reserved"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {/* STEP: Details */}
          {step === "details" ? (
            <div className="rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                  Step 5 of 6
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-forest-green">
                  Lead guest details
                </h2>
                <p className="mt-1 text-sm text-charcoal/65">
                  We need this only to confirm your reservation and send your self-service booking link.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="e.g. Amaia Etxebarria"
                    value={guest.fullName}
                    onChange={(e) => setGuest((g) => ({ ...g, fullName: e.target.value }))}
                    className="rounded-xl border-border-muted py-2.5"
                  />
                  {fieldErrors.fullName ? (
                    <p className="text-xs text-red-600">{fieldErrors.fullName}</p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                      Mobile Phone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+34 600 000 000"
                      value={guest.phone}
                      onChange={(e) => setGuest((g) => ({ ...g, phone: e.target.value }))}
                      className="rounded-xl border-border-muted py-2.5"
                    />
                    {fieldErrors.phone ? (
                      <p className="text-xs text-red-600">{fieldErrors.phone}</p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="amaia@example.com"
                      value={guest.email}
                      onChange={(e) => setGuest((g) => ({ ...g, email: e.target.value }))}
                      className="rounded-xl border-border-muted py-2.5"
                    />
                    {fieldErrors.email ? (
                      <p className="text-xs text-red-600">{fieldErrors.email}</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Special Requests or Dietary Requirements (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="e.g. High chair needed, celebrating a birthday, fish allergy, terrace preference..."
                    value={guest.notes}
                    onChange={(e) => setGuest((g) => ({ ...g, notes: e.target.value }))}
                    className="rounded-xl border-border-muted"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* STEP: Review */}
          {step === "review" ? (
            <div className="rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
                  Step 6 of 6 · Review
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-forest-green">
                  Please review your reservation
                </h2>
                <p className="mt-1 text-sm text-charcoal/65">
                  Confirm all details are correct before we finalize your table.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border-muted/80 bg-surface-muted/30">
                <div className="border-b border-border-muted/60 bg-forest-green px-5 py-3 text-warm-ivory flex justify-between items-center">
                  <span className="font-serif text-lg font-medium">Iturrieta Sagardotegia</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-apple-copper">
                    Aramaio
                  </span>
                </div>

                <dl className="divide-y divide-border-muted/50 p-5 text-sm">
                  <div className="flex justify-between py-2">
                    <dt className="text-charcoal/60">Date</dt>
                    <dd className="font-semibold text-charcoal">
                      {formatReservationDate(`${date}T12:00:00+02:00`)}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-charcoal/60">Service & Time</dt>
                    <dd className="font-semibold text-charcoal">
                      {selectedShift?.name} · {selectedSlot ? formatReservationTimeRange(selectedSlot.startAt, selectedSlot.endAt) : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-charcoal/60">Number of Guests</dt>
                    <dd className="font-semibold text-charcoal">
                      {guestCount} {guestCount === 1 ? "Person" : "People"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-charcoal/60">Lead Guest</dt>
                    <dd className="font-semibold text-charcoal">{guest.fullName}</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-charcoal/60">Contact</dt>
                    <dd className="font-semibold text-charcoal">{guest.phone} · {guest.email}</dd>
                  </div>
                  {guest.notes ? (
                    <div className="flex justify-between py-2">
                      <dt className="text-charcoal/60">Notes</dt>
                      <dd className="font-medium text-charcoal text-right max-w-xs">{guest.notes}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              {guestCount > guestLimit ? (
                <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
                  ⚠️ <strong>Notice for Large Party:</strong> Since your party exceeds {guestLimit} guests, this will be received as a priority booking request. Our team will review table configurations and confirm immediately.
                </div>
              ) : null}
            </div>
          ) : null}

          {/* STEP: Result (Confirmation / Success) */}
          {step === "result" ? (
            <ResultView
              kind={resultKind}
              guestName={guest.fullName}
              linkToken={resultLinkToken}
              date={date}
              time={selectedSlot ? formatReservationTimeRange(selectedSlot.startAt, selectedSlot.endAt) : ""}
              guests={guestCount}
              onRestart={() => {
                setResultLinkToken(null);
                setStep("intro");
              }}
            />
          ) : null}

          {/* Navigation Controls (Back & Continue) */}
          {step !== "result" && step !== "intro" ? (
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-border-muted/60 pt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-6 border-border-muted hover:bg-surface-muted"
                onClick={goBack}
              >
                ← Back
              </Button>

              <Button
                type="button"
                className="rounded-xl bg-forest-green hover:bg-forest-green/90 text-warm-ivory px-8 py-2.5 font-medium shadow-sm"
                disabled={!canNext || submitting}
                onClick={handlePrimary}
              >
                {primaryLabel}
              </Button>
            </div>
          ) : null}
        </div>

        {/* Right Side: Sticky Reservation Summary (4/5 Cols) */}
        {step !== "result" ? (
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-border-muted bg-white shadow-sm">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/images/landing/hero.jpg"
                  alt="Iturrieta Basque Caserío in Aramaio"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-warm-ivory">
                  <p className="font-serif text-lg font-medium leading-tight">Iturrieta Sagardotegia</p>
                  <p className="text-[11px] text-warm-ivory/80">Arraga auzoa, 2 · Aramaio (Álava)</p>
                </div>
              </div>

              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-apple-copper">
                  Reservation Summary
                </p>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-border-muted/50 pb-2">
                    <span className="text-charcoal/60">📅 Date</span>
                    <span className="font-semibold text-charcoal">
                      {date ? formatReservationDate(`${date}T12:00:00+02:00`) : "Select date"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border-muted/50 pb-2">
                    <span className="text-charcoal/60">☀️ Service</span>
                    <span className="font-semibold text-charcoal">
                      {selectedShift?.name ?? "Select service"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border-muted/50 pb-2">
                    <span className="text-charcoal/60">👥 Party Size</span>
                    <span className="font-semibold text-charcoal">
                      {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border-muted/50 pb-2">
                    <span className="text-charcoal/60">⏰ Time Window</span>
                    <span className="font-semibold text-charcoal">
                      {selectedSlot ? formatReservationTimeRange(selectedSlot.startAt, selectedSlot.endAt) : "Pick time slot"}
                    </span>
                  </div>
                </div>

                {/* Experience Highlights */}
                <div className="mt-5 rounded-2xl bg-surface-muted/40 p-4 text-[11px] text-charcoal/75 space-y-1.5">
                  <p className="font-semibold text-forest-green">✨ What’s included:</p>
                  <p>• 100% Organic Basque Cider direct from kupelas</p>
                  <p>• Authentic multi-course Sagardotegi meal</p>
                  <p>• Free modification or cancellation via link</p>
                </div>

                <div className="mt-5 border-t border-border-muted/60 pt-4 text-center">
                  <p className="text-[11px] text-charcoal/60">Need assistance or group booking?</p>
                  <a
                    href="tel:+34685721593"
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-green hover:underline"
                  >
                    <span>📞</span> Call +34 685 72 15 93
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ResultView({
  kind,
  guestName,
  linkToken,
  date,
  time,
  guests,
  onRestart,
}: {
  kind: ResultKind;
  guestName: string;
  linkToken: string | null;
  date: string;
  time: string;
  guests: number;
  onRestart: () => void;
}) {
  const selfServicePath = linkToken ? `/book/link/${encodeURIComponent(linkToken)}` : null;

  if (kind === "confirmed") {
    return (
      <div className="overflow-hidden rounded-3xl border border-border-muted bg-white p-6 sm:p-10 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800">
          ✓
        </div>

        <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-widest text-apple-copper">
          Ongi Etorri!
        </span>
        <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-forest-green">
          Your Table is Confirmed!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/70">
          Thank you, <strong className="text-charcoal">{guestName}</strong>. We are delighted to welcome you to Iturrieta Sagardotegia.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border-muted/80 bg-surface-muted/30 p-5 text-left text-sm">
          <div className="flex justify-between border-b border-border-muted/50 pb-2">
            <span className="text-charcoal/60">Date & Time</span>
            <span className="font-semibold text-charcoal">{formatReservationDate(`${date}T12:00:00+02:00`)} · {time}</span>
          </div>
          <div className="flex justify-between border-b border-border-muted/50 py-2">
            <span className="text-charcoal/60">Guests</span>
            <span className="font-semibold text-charcoal">{guests} People</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-charcoal/60">Location</span>
            <span className="font-semibold text-charcoal">Arraga auzoa, 2 · Aramaio</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {selfServicePath ? (
            <Link
              href={selfServicePath}
              className="w-full sm:w-auto rounded-xl bg-forest-green px-6 py-3 text-sm font-medium text-warm-ivory shadow-sm transition hover:bg-forest-green/90"
            >
              View & Manage Reservation →
            </Link>
          ) : null}

          <Link
            href="/"
            className="w-full sm:w-auto rounded-xl border border-border-muted px-6 py-3 text-sm font-medium text-charcoal transition hover:bg-surface-muted"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (kind === "pending") {
    return (
      <div className="overflow-hidden rounded-3xl border border-border-muted bg-white p-6 sm:p-10 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-800">
          ⏳
        </div>

        <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-widest text-apple-copper">
          Request Received
        </span>
        <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-forest-green">
          Your Request is Being Prepared
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/70">
          Thank you, <strong className="text-charcoal">{guestName}</strong>. Our host team will review your group reservation and confirm table arrangements shortly.
        </p>

        {selfServicePath ? (
          <div className="mt-8 flex justify-center">
            <Link
              href={selfServicePath}
              className="rounded-xl bg-forest-green px-6 py-3 text-sm font-medium text-warm-ivory shadow-sm transition hover:bg-forest-green/90"
            >
              Track Request Status →
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border-muted bg-white p-6 sm:p-10 shadow-sm text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-800">
        ✕
      </div>
      <h2 className="mt-4 font-serif text-3xl font-medium text-charcoal">Time Slot Unavailable</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/70">
        That slot was just reserved or is no longer available. Please select another time or date.
      </p>
      <div className="mt-6">
        <Button onClick={onRestart} className="rounded-xl bg-forest-green px-6 py-2.5 text-white">
          Choose Another Time
        </Button>
      </div>
    </div>
  );
}
