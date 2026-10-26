import type { ReservationStatus } from "@/lib/domain/types";

const ALLOWED: Record<ReservationStatus, ReservationStatus[]> = {
  pending: ["confirmed", "rejected"],
  confirmed: ["arrived", "cancelled", "no_show"],
  arrived: ["completed"],
  completed: [],
  cancelled: [],
  rejected: [],
  no_show: [],
};

export function canTransitionReservation(
  from: ReservationStatus,
  to: ReservationStatus,
): boolean {
  return ALLOWED[from].includes(to);
}

export function nextStatuses(from: ReservationStatus): ReservationStatus[] {
  return ALLOWED[from];
}

export function isTerminalReservationStatus(status: ReservationStatus): boolean {
  return ALLOWED[status].length === 0;
}

export const TRANSITION_DISABLED_HINT =
  "Enforced server-side in Phase 2";
