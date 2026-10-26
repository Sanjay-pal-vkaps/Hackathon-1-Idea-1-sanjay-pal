import type { ReservationSource, ReservationStatus } from "@/lib/domain/types";

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  arrived: "Arrived",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
  no_show: "No-show",
};

export const RESERVATION_SOURCE_LABELS: Record<ReservationSource, string> = {
  online: "Online",
  walk_in: "Walk-in",
  phone: "Phone",
  whatsapp: "WhatsApp",
};

export const ALL_RESERVATION_STATUSES: ReservationStatus[] = [
  "pending",
  "confirmed",
  "arrived",
  "completed",
  "cancelled",
  "rejected",
  "no_show",
];

export const ALL_RESERVATION_SOURCES: ReservationSource[] = [
  "online",
  "walk_in",
  "phone",
  "whatsapp",
];
