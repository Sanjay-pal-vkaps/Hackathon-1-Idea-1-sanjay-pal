"use client";

import type { ReactNode } from "react";
import { useStaffPermissions } from "@/components/staff/use-staff-permissions";
import { StaffForbidden } from "@/components/staff/staff-forbidden";
import type { StaffAction } from "@/lib/permissions/can";

export function StaffRouteGuard({
  action,
  children,
  fallbackTitle,
}: {
  action: StaffAction;
  children: ReactNode;
  fallbackTitle?: string;
}) {
  const { can } = useStaffPermissions();
  if (!can(action)) {
    return <StaffForbidden title={fallbackTitle} />;
  }
  return <>{children}</>;
}
