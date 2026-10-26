"use client";

import type { ActivityEventType, Reservation } from "@/lib/domain/types";
import { getMockRepositories } from "@/lib/mock/repositories";
import { useCallback } from "react";

function activityForStatus(
  status: Reservation["status"],
): ActivityEventType | null {
  if (status === "arrived") return "check_in";
  if (status === "cancelled") return "cancellation";
  if (status === "confirmed" || status === "rejected") return "reservation_updated";
  return "reservation_updated";
}

export function useReservationActions(onNotice: (msg: string) => void) {
  const refreshNotice = useCallback(() => {
    onNotice("Mock save — not stored on server");
  }, [onNotice]);

  const appendActivity = useCallback(
    async (
      reservation: Reservation,
      type: ActivityEventType,
      message: string,
    ) => {
      const repos = getMockRepositories();
      await repos.activity.append({
        type,
        message,
        reservationId: reservation.id,
        tableId: reservation.tableIds[0],
      });
    },
    [],
  );

  const updateStatus = useCallback(
    async (reservation: Reservation, status: Reservation["status"]) => {
      const repos = getMockRepositories();
      const updated = await repos.reservations.updateStatus(reservation.id, status);
      const actType = activityForStatus(status);
      if (actType) {
        await appendActivity(updated, actType, `${updated.id} → ${status} (demo)`);
      }
      refreshNotice();
      return updated;
    },
    [appendActivity, refreshNotice],
  );

  const updateReservation = useCallback(
    async (id: string, patch: Partial<Reservation>) => {
      const repos = getMockRepositories();
      const updated = await repos.reservations.update(id, patch);
      await appendActivity(
        updated,
        "reservation_updated",
        `Reservation ${updated.id} updated (demo)`,
      );
      refreshNotice();
      return updated;
    },
    [appendActivity, refreshNotice],
  );

  const createReservation = useCallback(
    async (input: Omit<Reservation, "id" | "createdAt" | "updatedAt">) => {
      const repos = getMockRepositories();
      const created = await repos.reservations.create(input);
      await appendActivity(
        created,
        "reservation_created",
        `New reservation — ${created.guestCount} guests (demo)`,
      );
      refreshNotice();
      return created;
    },
    [appendActivity, refreshNotice],
  );

  return { updateStatus, updateReservation, createReservation };
}
