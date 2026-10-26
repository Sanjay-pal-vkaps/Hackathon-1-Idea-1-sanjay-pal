"use client";

import { OperationsTabs } from "@/components/dashboard/operations-tabs";
import { FloorPlanWorkspace } from "@/components/floor-plan/floor-plan-workspace";

export function FloorPlanView() {
  return (
    <div className="space-y-5">
      <OperationsTabs />
      <FloorPlanWorkspace defaultTableId="table-003" />
    </div>
  );
}
