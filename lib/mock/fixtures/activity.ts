import type { ActivityEvent } from "@/lib/domain/types";

export const DEMO_ACTIVITY_SEED: ActivityEvent[] = [
  {
    id: "act-001",
    type: "reservation_created",
    message: "Sarah Smith",
    occurredAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    reservationId: "res-014",
  },
  {
    id: "act-002",
    type: "reservation_updated",
    message: "Table 10",
    occurredAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    reservationId: "res-006",
    tableId: "table-010",
  },
  {
    id: "act-003",
    type: "check_in",
    message: "Ana Garcia · Table 7",
    occurredAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    reservationId: "res-002",
    tableId: "table-007",
  },
  {
    id: "act-004",
    type: "cancellation",
    message: "Tom Brown · Table 12",
    occurredAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    reservationId: "res-007",
    tableId: "table-012",
  },
];
