"use client";

import { StaffRouteGuard } from "@/components/staff/staff-route-guard";
import { StaffUsersStub } from "@/components/staff/staff-users-stub";

export function StaffUsersPageView() {
  return (
    <StaffRouteGuard
      action="manage_staff_users"
      fallbackTitle="Users & roles — Owner only"
    >
      <StaffUsersStub />
    </StaffRouteGuard>
  );
}
