"use client";

import { useStaffAuth } from "@/components/staff/staff-auth-provider";
import { can, type StaffAction } from "@/lib/permissions/can";
import type { StaffRole } from "@/lib/domain/types";

export function useStaffPermissions() {
  const { session } = useStaffAuth();
  const role: StaffRole = session?.role ?? "waiter";

  return {
    role,
    session,
    can: (action: StaffAction) => can(role, action),
  };
}
