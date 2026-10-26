import type { StaffRole } from "@/lib/domain/types";

export type StaffAction =
  | "edit_floor_layout"
  | "view_settings"
  | "edit_settings"
  | "manage_staff_users"
  | "approve_pending"
  | "create_reservation"
  | "cancel_reservation"
  | "edit_reservation"
  | "reschedule_reservation"
  | "assign_tables"
  | "update_table_status"
  | "view_reservations";

const ALLOWED: Record<StaffRole, ReadonlySet<StaffAction>> = {
  owner: new Set<StaffAction>([
    "edit_floor_layout",
    "view_settings",
    "edit_settings",
    "manage_staff_users",
    "approve_pending",
    "create_reservation",
    "cancel_reservation",
    "edit_reservation",
    "reschedule_reservation",
    "assign_tables",
    "update_table_status",
    "view_reservations",
  ]),
  manager: new Set<StaffAction>([
    "edit_floor_layout",
    "view_settings",
    "approve_pending",
    "create_reservation",
    "cancel_reservation",
    "edit_reservation",
    "reschedule_reservation",
    "assign_tables",
    "update_table_status",
    "view_reservations",
  ]),
  waiter: new Set<StaffAction>([
    "update_table_status",
    "view_reservations",
  ]),
};

export function can(role: StaffRole, action: StaffAction): boolean {
  return ALLOWED[role].has(action);
}
