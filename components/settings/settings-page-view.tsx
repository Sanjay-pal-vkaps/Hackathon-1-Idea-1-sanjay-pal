"use client";

import { StaffRouteGuard } from "@/components/staff/staff-route-guard";
import { useStaffPermissions } from "@/components/staff/use-staff-permissions";
import { BookingSettingsForm } from "@/components/settings/booking-settings-form";

export function SettingsPageView() {
  const { can: staffCan } = useStaffPermissions();
  return (
    <StaffRouteGuard action="view_settings" fallbackTitle="Settings not available">
      <BookingSettingsForm readOnly={!staffCan("edit_settings")} />
    </StaffRouteGuard>
  );
}
