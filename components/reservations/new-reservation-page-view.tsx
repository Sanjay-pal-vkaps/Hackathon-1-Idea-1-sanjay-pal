"use client";

import { StaffRouteGuard } from "@/components/staff/staff-route-guard";
import { NewReservationForm } from "@/components/reservations/new-reservation-form";

export function NewReservationPageView() {
  return (
    <StaffRouteGuard
      action="create_reservation"
      fallbackTitle="Waiters cannot create reservations"
    >
      <NewReservationForm />
    </StaffRouteGuard>
  );
}
