"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PublicTimeSlot, ServiceShift } from "@/lib/domain/types";
import { getMockRepositories } from "@/lib/mock/repositories";
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

const FLOW_STEPS: { id: WizardStep; label: string }[] = [
  { id: "date", label: "Date" },
  { id: "service", label: "Service" },
  { id: "guests", label: "Guests" },
  { id: "time", label: "Time" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
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
  const searchParams = useSearchParams();
  const scenarioOverride = searchParams.get("scenario") as ResultKind | null;

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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof GuestDetails, string>>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const repos = getMockRepositories();
      const from = todayIso();
      const to = addDays(from, 21);
      const [dates, shiftList, settings] = await Promise.all([
        repos.publicBooking.listAvailableDates(from, to),
        repos.settings.listServiceShifts(),
        repos.settings.getBookingSettings(),
      ]);
      if (cancelled) return;
      setAvailableDates(dates);
      setShifts(shiftList);
      setGuestLimit(settings.onlineGuestLimit);
      if (dates[0]) setDate(dates[0]);
      if (shiftList[0]) setServiceShiftId(shiftList[0].id);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadSlots = useCallback(async () => {
    if (!date || !serviceShiftId) return;
    setLoadingSlots(true);
    const rows = await getMockRepositories().publicBooking.listTimeSlots(
      date,
      serviceShiftId,
    );
    setSlots(rows);
    setSlotId(null);
    setLoadingSlots(false);
  }, [date, serviceShiftId]);

  useEffect(() => {
    if (step !== "time" && step !== "review" && step !== "result") return;
    let cancelled = false;
    (async () => {
      if (!date || !serviceShiftId) return;
      setLoadingSlots(true);
      const rows = await getMockRepositories().publicBooking.listTimeSlots(
        date,
        serviceShiftId,
      );
      if (cancelled) return;
      setSlots(rows);
      setLoadingSlots(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [date, serviceShiftId, step]);

  const selectedShift = shifts.find((s) => s.id === serviceShiftId);
  const selectedSlot = slots.find((s) => s.id === slotId) ?? null;

  const calendarDays = useMemo(() => {
    const from = todayIso();
    return Array.from({ length: 21 }, (_, i) => addDays(from, i));
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
    if (!isValidEmail(guest.email)) errors.email = "Enter a valid email";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function computeResult(): ResultKind {
    if (scenarioOverride === "confirmed" || scenarioOverride === "pending" || scenarioOverride === "unavailable") {
      return scenarioOverride;
    }
    if (!selectedSlot || !selectedSlot.available) return "unavailable";
    if (guestCount > guestLimit) return "pending";
    return "confirmed";
  }

  function submitBooking() {
    setResultKind(computeResult());
    setStep("result");
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
      submitBooking();
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
      ? "Book a table"
      : step === "review"
        ? "Submit request"
        : step === "result"
          ? "Done"
          : "Continue";

  return (
    <div className="flex flex-1 flex-col pb-24">
      {step !== "intro" && step !== "result" ? (
        <nav aria-label="Booking progress" className="mb-6">
          <ol className="flex flex-wrap gap-2">
            {FLOW_STEPS.map((s, i) => {
              const active = s.id === step;
              const done = i < progressIndex;
              return (
                <li
                  key={s.id}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    active && "bg-forest-green text-white",
                    done && !active && "bg-forest-green/15 text-forest-green",
                    !active && !done && "bg-surface-muted text-charcoal/55",
                  )}
                >
                  {s.label}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      {step === "intro" ? (
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Reserve your table
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              A calm, simple booking flow for lunch or dinner. No account required — we
              only need your visit details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-0">
            <Alert variant="info">
              UI prototype · mock availability · no real reservation is created when you
              submit.
            </Alert>
          </CardContent>
        </Card>
      ) : null}

      {step === "date" ? (
        <StepCard title="Choose a date" description="Mondays are closed in the demo calendar.">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {calendarDays.map((day) => {
              const open = availableDates.includes(day);
              const selected = date === day;
              const label = new Intl.DateTimeFormat("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
              }).format(new Date(`${day}T12:00:00`));
              return (
                <button
                  key={day}
                  type="button"
                  disabled={!open}
                  onClick={() => setDate(day)}
                  className={cn(
                    "rounded-lg border px-2 py-3 text-left text-sm transition-colors",
                    selected && "border-forest-green bg-forest-green/10",
                    !selected && open && "border-border-muted hover:bg-surface-muted/60",
                    !open && "cursor-not-allowed border-dashed opacity-40",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </StepCard>
      ) : null}

      {step === "service" ? (
        <StepCard title="Lunch or dinner?" description="Pick a service period for your visit.">
          <ul className="space-y-2">
            {shifts.map((shift) => (
              <li key={shift.id}>
                <button
                  type="button"
                  onClick={() => setServiceShiftId(shift.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left",
                    serviceShiftId === shift.id
                      ? "border-apple-copper bg-apple-copper/5"
                      : "border-border-muted hover:bg-surface-muted/50",
                  )}
                >
                  <p className="font-medium text-charcoal">{shift.name}</p>
                  <p className="text-sm text-charcoal/65">
                    {shift.startTime} – {shift.endTime}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </StepCard>
      ) : null}

      {step === "guests" ? (
        <StepCard
          title="How many guests?"
          description={
            guestCount > guestLimit
              ? `Parties over ${guestLimit} may need approval (demo pending path).`
              : `Online bookings up to ${guestLimit} guests can auto-confirm in the demo.`
          }
        >
          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setGuestCount((n) => Math.max(1, n - 1))}
              aria-label="Decrease guests"
            >
              −
            </Button>
            <span className="min-w-[3rem] text-center text-3xl font-semibold tabular-nums">
              {guestCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setGuestCount((n) => Math.min(20, n + 1))}
              aria-label="Increase guests"
            >
              +
            </Button>
          </div>
        </StepCard>
      ) : null}

      {step === "time" ? (
        <StepCard
          title="Pick a time"
          description="Some slots are marked fully booked to demo unavailable times."
        >
          {loadingSlots ? (
            <p className="text-sm text-charcoal/60">Loading times…</p>
          ) : (
            <ul className="space-y-2">
              {slots.map((slot) => {
                const selected = slotId === slot.id;
                return (
                  <li key={slot.id}>
                    <button
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSlotId(slot.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left",
                        selected && slot.available && "border-apple-copper bg-apple-copper/5",
                        !selected && slot.available && "border-border-muted hover:bg-surface-muted/50",
                        !slot.available && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <span className="font-medium">
                        {formatReservationTimeRange(slot.startAt, slot.endAt)}
                      </span>
                      {!slot.available ? (
                        <span className="text-xs text-charcoal/55">{slot.reason}</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => void loadSlots()}>
            Refresh slots (mock)
          </Button>
        </StepCard>
      ) : null}

      {step === "details" ? (
        <StepCard title="Your details" description="We will not send real emails in this prototype.">
          <div className="space-y-4">
            <Field
              id="name"
              label="Full name"
              value={guest.fullName}
              error={fieldErrors.fullName}
              onChange={(v) => setGuest((g) => ({ ...g, fullName: v }))}
            />
            <Field
              id="phone"
              label="Phone"
              type="tel"
              value={guest.phone}
              error={fieldErrors.phone}
              onChange={(v) => setGuest((g) => ({ ...g, phone: v }))}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={guest.email}
              error={fieldErrors.email}
              onChange={(v) => setGuest((g) => ({ ...g, email: v }))}
            />
            <div className="space-y-2">
              <Label htmlFor="notes">Special requests (optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                value={guest.notes}
                onChange={(e) => setGuest((g) => ({ ...g, notes: e.target.value }))}
              />
            </div>
          </div>
        </StepCard>
      ) : null}

      {step === "review" ? (
        <StepCard title="Review" description="Confirm everything looks correct before submitting.">
          <dl className="space-y-3 text-sm">
            <ReviewRow label="Date" value={formatReservationDate(`${date}T12:00:00+02:00`)} />
            <ReviewRow label="Service" value={selectedShift?.name ?? "—"} />
            <ReviewRow label="Guests" value={String(guestCount)} />
            <ReviewRow
              label="Time"
              value={
                selectedSlot
                  ? formatReservationTimeRange(selectedSlot.startAt, selectedSlot.endAt)
                  : "—"
              }
            />
            <ReviewRow label="Name" value={guest.fullName} />
            <ReviewRow label="Contact" value={`${guest.phone} · ${guest.email}`} />
            {guest.notes ? <ReviewRow label="Notes" value={guest.notes} /> : null}
          </dl>
          {guestCount > guestLimit ? (
            <Alert variant="warning" className="mt-4">
              Large party — demo will show a pending approval result.
            </Alert>
          ) : null}
        </StepCard>
      ) : null}

      {step === "result" ? (
        <ResultStep kind={resultKind} guestName={guest.fullName} onRestart={() => setStep("intro")} />
      ) : null}

      {step !== "result" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border-muted bg-warm-ivory/95 px-4 py-3 backdrop-blur-sm md:static md:mt-auto md:border-0 md:bg-transparent md:px-0 md:py-0 md:pt-6">
          <div className="mx-auto flex max-w-lg gap-2 md:max-w-2xl">
            {step !== "intro" ? (
              <Button type="button" variant="outline" className="flex-1 md:flex-none" onClick={goBack}>
                Back
              </Button>
            ) : null}
            <Button
              type="button"
              className="flex-1 md:min-w-[160px]"
              disabled={step !== "intro" && !canNext}
              onClick={() => {
                if (step === "intro") {
                  setStep("date");
                  return;
                }
                handlePrimary();
              }}
            >
              {primaryLabel}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StepCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border-muted/80 pb-2">
      <dt className="text-charcoal/55">{label}</dt>
      <dd className="text-right font-medium text-charcoal">{value}</dd>
    </div>
  );
}

function ResultStep({
  kind,
  guestName,
  onRestart,
}: {
  kind: ResultKind;
  guestName: string;
  onRestart: () => void;
}) {
  const copy =
    kind === "confirmed"
      ? {
          title: "You're all set",
          body: "Your table request is confirmed in this demo scenario.",
          badge: "confirmed" as const,
        }
      : kind === "pending"
        ? {
            title: "Request received",
            body: "A team member would review large or special requests before confirming.",
            badge: "pending" as const,
          }
        : {
            title: "Time not available",
            body: "That slot is no longer open in the demo. Try another time or date.",
            badge: "pending" as const,
          };

  return (
    <Card className="text-center">
      <CardHeader className="items-center">
        <div
          className={cn(
            "mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl",
            kind === "confirmed" && "bg-emerald-100 text-emerald-800",
            kind === "pending" && "bg-amber-100 text-amber-900",
            kind === "unavailable" && "bg-red-100 text-red-800",
          )}
          aria-hidden
        >
          {kind === "confirmed" ? "✓" : kind === "pending" ? "…" : "!"}
        </div>
        <CardTitle className="text-xl">{copy.title}</CardTitle>
        <CardDescription className="max-w-sm text-base">{copy.body}</CardDescription>
        {guestName ? (
          <p className="text-sm text-charcoal/70">Reference name: {guestName}</p>
        ) : null}
        {kind !== "unavailable" ? (
          <Badge variant="reservation" reservationStatus={copy.badge} className="mx-auto mt-2" />
        ) : (
          <Badge className="mx-auto mt-2 border-red-200 bg-red-50 text-red-900">
            Unavailable
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="warning">
          Demo confirmation — reservation not created. No email or SMS was sent.
        </Alert>
        <Button type="button" variant="outline" onClick={onRestart}>
          Book another table
        </Button>
      </CardContent>
    </Card>
  );
}
