import type { TableStatus } from "@/lib/domain/types";

export const ALL_TABLE_STATUSES: TableStatus[] = [
  "available",
  "reserved",
  "occupied",
  "cleaning",
  "out_of_service",
];

export const TABLE_STATUS_LABELS: Record<TableStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  cleaning: "Cleaning",
  out_of_service: "Out of service",
};

/** Floor-plan marker rings (UI reference palette) */
export const TABLE_STATUS_CANVAS: Record<
  TableStatus,
  { ring: string; glow: string; text: string }
> = {
  available: { ring: "#22c55e", glow: "rgba(34,197,94,0.35)", text: "#14532d" },
  reserved: { ring: "#c9734a", glow: "rgba(201,115,74,0.4)", text: "#7c2d12" },
  occupied: { ring: "#ef4444", glow: "rgba(239,68,68,0.35)", text: "#7f1d1d" },
  cleaning: { ring: "#94a3b8", glow: "rgba(148,163,184,0.35)", text: "#334155" },
  out_of_service: { ring: "#71717a", glow: "rgba(113,113,122,0.3)", text: "#3f3f46" },
};
