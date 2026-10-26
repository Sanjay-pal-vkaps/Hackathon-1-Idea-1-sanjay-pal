"use client";

import { useEffect, useState } from "react";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { OperationsTabs } from "@/components/dashboard/operations-tabs";
import { RecentActivityStrip } from "@/components/dashboard/recent-activity-strip";
import { FloorPlanWorkspace } from "@/components/floor-plan/floor-plan-workspace";
import { useStaffDate } from "@/components/staff/staff-workspace";
import type { ActivityEvent, DashboardStats } from "@/lib/domain/types";
import { getMockRepositories } from "@/lib/mock/repositories";

export function DashboardView() {
  const { selectedDate } = useStaffDate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    const repos = getMockRepositories();
    let cancelled = false;
    (async () => {
      const [nextStats, nextActivity] = await Promise.all([
        repos.dashboard.getStats(selectedDate),
        repos.activity.listRecent(4),
      ]);
      if (!cancelled) {
        setStats(nextStats);
        setActivity(nextActivity);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  return (
    <div className="space-y-5">
      <DashboardHero />

      {stats ? <KpiCards stats={stats} /> : null}

      <OperationsTabs />

      <FloorPlanWorkspace defaultTableId="table-003" />

      {activity.length > 0 ? <RecentActivityStrip events={activity} /> : null}
    </div>
  );
}
