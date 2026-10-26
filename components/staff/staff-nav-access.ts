import type { StaffRole } from "@/lib/domain/types";
import { can } from "@/lib/permissions/can";
import { STAFF_NAV_MAIN, STAFF_NAV_SYSTEM, type StaffNavItem } from "@/components/staff/staff-nav";

export function navItemsForRole(role: StaffRole): {
  main: StaffNavItem[];
  system: StaffNavItem[];
} {
  const main = STAFF_NAV_MAIN.filter((item) => {
    if (item.href === "/reservations") return can(role, "view_reservations");
    return true;
  });

  const system = STAFF_NAV_SYSTEM.filter((item) => {
    if (item.href === "/settings") return can(role, "view_settings");
    if (item.href === "/staff") return can(role, "manage_staff_users");
    return true;
  });

  return { main, system };
}
