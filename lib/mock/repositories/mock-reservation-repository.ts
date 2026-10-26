import type { ReservationRepository } from "@/lib/domain/repositories/types";
import type { Reservation, ReservationStatus } from "@/lib/domain/types";
import { getMockStore } from "@/lib/mock/store";

function matchesDate(reservation: Reservation, date: string) {
  return reservation.startAt.startsWith(date);
}

export class MockReservationRepository implements ReservationRepository {
  async list(filters?: Parameters<ReservationRepository["list"]>[0]) {
    let rows = [...getMockStore().reservations];
    if (filters?.status) {
      rows = rows.filter((r) => r.status === filters.status);
    }
    if (filters?.source) {
      rows = rows.filter((r) => r.source === filters.source);
    }
    if (filters?.date) {
      rows = rows.filter((r) => matchesDate(r, filters.date!));
    }
    if (filters?.search?.trim()) {
      const q = filters.search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.customerId.toLowerCase().includes(q) ||
          (r.notes?.toLowerCase().includes(q) ?? false),
      );
    }
    return rows.sort((a, b) => a.startAt.localeCompare(b.startAt));
  }

  async get(id: string) {
    return getMockStore().reservations.find((r) => r.id === id) ?? null;
  }

  async listPending() {
    return getMockStore().reservations.filter((r) => r.status === "pending");
  }

  async listForTable(tableId: string, date?: string) {
    return getMockStore().reservations.filter(
      (r) =>
        r.tableIds.includes(tableId) &&
        (!date || matchesDate(r, date)),
    );
  }

  async create(
    input: Omit<Reservation, "id" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const reservation: Reservation = {
      ...input,
      id: `res-${String(getMockStore().reservations.length + 1).padStart(3, "0")}`,
      createdAt: now,
      updatedAt: now,
    };
    getMockStore().reservations.push(reservation);
    return reservation;
  }

  async updateStatus(id: string, status: ReservationStatus) {
    return this.update(id, { status });
  }

  async update(id: string, patch: Partial<Reservation>) {
    const store = getMockStore();
    const index = store.reservations.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Demo reservation not found: ${id}`);
    store.reservations[index] = {
      ...store.reservations[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    return store.reservations[index];
  }
}
