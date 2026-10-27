import type { StaffProfile, StaffRole } from "@/lib/domain/types";

export type StaffProfileRow = {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  role: StaffRole;
};

export function mapStaffProfileRow(row: StaffProfileRow): StaffProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
  };
}
