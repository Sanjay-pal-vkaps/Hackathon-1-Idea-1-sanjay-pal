import type { ReservationRepository } from "@/lib/domain/repositories/types";
import type { Reservation, ReservationStatus } from "@/lib/domain/types";
import { mapReservationRow, type ReservationRow } from "@/lib/data/mappers";
import { newId } from "@/lib/booking/engine";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { reservationDateKey } from "@/lib/utils/reservation-date";
import { canTransitionReservation } from "@/lib/utils/reservation-transitions";

const RESERVATION_SELECT = "*, reservation_tables(table_id)";

export class SupabaseReservationRepository implements ReservationRepository {
  private client = getSupabaseBrowserClient();

  private mapRows(data: ReservationRow[] | null): Reservation[] {
    return (data ?? []).map((row) => mapReservationRow(row));
  }

  async list(filters?: Parameters<ReservationRepository["list"]>[0]) {
    const { data, error } = await this.client
      .from("reservations")
      .select(RESERVATION_SELECT)
      .order("start_at");
    if (error) throw new Error(error.message);

    let rows = this.mapRows(data as ReservationRow[]);
    if (filters?.status) {
      rows = rows.filter((r) => r.status === filters.status);
    }
    if (filters?.source) {
      rows = rows.filter((r) => r.source === filters.source);
    }
    if (filters?.date) {
      rows = rows.filter(
        (r) => reservationDateKey(r.startAt) === filters.date,
      );
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
    return rows;
  }

  async get(id: string) {
    const { data, error } = await this.client
      .from("reservations")
      .select(RESERVATION_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapReservationRow(data as ReservationRow) : null;
  }

  async listPending() {
    return this.list({ status: "pending" });
  }

  async listForTable(tableId: string, date?: string) {
    const all = await this.list(date ? { date } : undefined);
    return all.filter((r) => r.tableIds.includes(tableId));
  }

  async create(
    input: Omit<Reservation, "id" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const id = newId("res");
    const { error } = await this.client.from("reservations").insert({
      id,
      customer_id: input.customerId,
      start_at: input.startAt,
      end_at: input.endAt,
      guest_count: input.guestCount,
      status: input.status,
      source: input.source,
      notes: input.notes ?? null,
      created_at: now,
      updated_at: now,
    });
    if (error) throw new Error(error.message);

    if (input.tableIds.length > 0) {
      const { error: linkError } = await this.client
        .from("reservation_tables")
        .insert(
          input.tableIds.map((tableId) => ({
            reservation_id: id,
            table_id: tableId,
          })),
        );
      if (linkError) throw new Error(linkError.message);
    }

    const created = await this.get(id);
    if (!created) throw new Error("Reservation not found after create");
    return created;
  }

  async updateStatus(id: string, status: ReservationStatus) {
    const current = await this.get(id);
    if (!current) throw new Error("Reservation not found");
    if (!canTransitionReservation(current.status, status)) {
      throw new Error(`Invalid status transition: ${current.status} → ${status}`);
    }
    return this.update(id, { status });
  }

  async update(id: string, patch: Partial<Reservation>) {
    if (patch.status) {
      const current = await this.get(id);
      if (current && !canTransitionReservation(current.status, patch.status)) {
        throw new Error(
          `Invalid status transition: ${current.status} → ${patch.status}`,
        );
      }
    }
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (patch.customerId !== undefined) payload.customer_id = patch.customerId;
    if (patch.startAt !== undefined) payload.start_at = patch.startAt;
    if (patch.endAt !== undefined) payload.end_at = patch.endAt;
    if (patch.guestCount !== undefined) payload.guest_count = patch.guestCount;
    if (patch.status !== undefined) payload.status = patch.status;
    if (patch.source !== undefined) payload.source = patch.source;
    if (patch.notes !== undefined) payload.notes = patch.notes ?? null;

    const { error } = await this.client
      .from("reservations")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);

    if (patch.tableIds) {
      await this.client
        .from("reservation_tables")
        .delete()
        .eq("reservation_id", id);
      if (patch.tableIds.length > 0) {
        const { error: linkError } = await this.client
          .from("reservation_tables")
          .insert(
            patch.tableIds.map((tableId) => ({
              reservation_id: id,
              table_id: tableId,
            })),
          );
        if (linkError) throw new Error(linkError.message);
      }
    }

    const updated = await this.get(id);
    if (!updated) throw new Error("Reservation not found after update");
    return updated;
  }
}
