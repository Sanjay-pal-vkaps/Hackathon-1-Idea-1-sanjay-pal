import { describe, expect, it } from "vitest";

import {
  buildPublicTimeSlots,
  intervalsOverlap,
  isTableFreeForInterval,
  suggestTableId,
} from "@/lib/booking/engine";
import type { Reservation, RestaurantTable, ServiceShift } from "@/lib/domain/types";

const table = (id: string, max: number): RestaurantTable => ({
  id,
  number: 1,
  capacityMin: 2,
  capacityMax: max,
  zone: "Main",
  shape: "circle",
  active: true,
  status: "available",
  layout: { floorId: "floor-ground", x: 0, y: 0, width: 40, height: 40 },
});

const shift: ServiceShift = {
  id: "shift-lunch",
  name: "Lunch",
  startTime: "13:00",
  endTime: "15:00",
  defaultDurationMinutes: 120,
};

describe("intervalsOverlap", () => {
  it("detects overlapping intervals", () => {
    expect(
      intervalsOverlap(
        "2026-10-16T13:00:00.000Z",
        "2026-10-16T15:00:00.000Z",
        "2026-10-16T14:00:00.000Z",
        "2026-10-16T16:00:00.000Z",
      ),
    ).toBe(true);
  });

  it("allows back-to-back when no buffer applied in call", () => {
    expect(
      intervalsOverlap(
        "2026-10-16T13:00:00.000Z",
        "2026-10-16T15:00:00.000Z",
        "2026-10-16T15:00:00.000Z",
        "2026-10-16T17:00:00.000Z",
      ),
    ).toBe(false);
  });
});

describe("suggestTableId", () => {
  it("returns a fitting free table", () => {
    const tables = [table("table-001", 4), table("table-002", 6)];
    const id = suggestTableId(
      3,
      "2026-10-16T13:00:00.000Z",
      "2026-10-16T15:00:00.000Z",
      tables,
      [],
      15,
    );
    expect(id).toBe("table-001");
  });

  it("returns null when table is booked including buffer", () => {
    const tables = [table("table-001", 4)];
    const reservations: Reservation[] = [
      {
        id: "res-1",
        customerId: "cust-1",
        startAt: "2026-10-16T13:00:00.000Z",
        endAt: "2026-10-16T15:00:00.000Z",
        guestCount: 2,
        status: "confirmed",
        source: "online",
        tableIds: ["table-001"],
        createdAt: "",
        updatedAt: "",
      },
    ];
    const id = suggestTableId(
      2,
      "2026-10-16T15:00:00.000Z",
      "2026-10-16T17:00:00.000Z",
      tables,
      reservations,
      15,
    );
    expect(id).toBeNull();
  });
});

describe("isTableFreeForInterval", () => {
  it("ignores cancelled reservations", () => {
    const reservations: Reservation[] = [
      {
        id: "res-1",
        customerId: "cust-1",
        startAt: "2026-10-16T13:00:00.000Z",
        endAt: "2026-10-16T15:00:00.000Z",
        guestCount: 2,
        status: "cancelled",
        source: "online",
        tableIds: ["table-001"],
        createdAt: "",
        updatedAt: "",
      },
    ];
    expect(
      isTableFreeForInterval(
        "table-001",
        "2026-10-16T13:00:00.000Z",
        "2026-10-16T15:00:00.000Z",
        15,
        reservations,
      ),
    ).toBe(true);
  });
});

describe("buildPublicTimeSlots", () => {
  it("returns at least one slot for an open day", () => {
    const slots = buildPublicTimeSlots(
      "2026-10-16",
      shift,
      [table("table-001", 4)],
      [],
      15,
      2,
    );
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.some((s) => s.available)).toBe(true);
  });
});
