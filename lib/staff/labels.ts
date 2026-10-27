import type { StaffRole } from "@/lib/domain/types";

export function staffRoleLabel(role: StaffRole): string {
  switch (role) {
    case "owner":
      return "Administrator";
    case "manager":
      return "Manager / Reception";
    case "waiter":
      return "Waiter";
  }
}
