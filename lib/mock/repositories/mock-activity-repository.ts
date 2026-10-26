import type { ActivityRepository } from "@/lib/domain/repositories/types";
import type { ActivityEvent } from "@/lib/domain/types";
import { getMockStore } from "@/lib/mock/store";

export class MockActivityRepository implements ActivityRepository {
  async listRecent(limit = 10) {
    return [...getMockStore().activity]
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, limit);
  }

  async append(event: Omit<ActivityEvent, "id" | "occurredAt">) {
    const row = {
      ...event,
      id: `act-${String(getMockStore().activity.length + 1).padStart(3, "0")}`,
      occurredAt: new Date().toISOString(),
    };
    getMockStore().activity.unshift(row);
    return row;
  }
}
