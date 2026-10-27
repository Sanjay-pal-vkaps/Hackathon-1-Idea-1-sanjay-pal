"use client";

import { StaffRouteGuard } from "@/components/staff/staff-route-guard";
import { StaffUsersView } from "@/components/staff/staff-users-view";

export function StaffUsersPageView() {
  return (
    <StaffRouteGuard
      action="manage_staff_users"
      fallbackTitle="Users & roles — Owner only"
    >
      <StaffUsersView />
    </StaffRouteGuard>
  );
}
