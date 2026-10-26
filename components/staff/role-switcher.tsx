"use client";

import { useStaffAuth } from "@/components/staff/staff-auth-provider";
import { Select } from "@/components/ui/select";
import {
  readMockStaffSession,
  staffRoleLabel,
  writeMockStaffSession,
} from "@/lib/mock/staff-session";
import type { StaffRole } from "@/lib/domain/types";

const ROLES: StaffRole[] = ["owner", "manager", "waiter"];

export function RoleSwitcher({ compact }: { compact?: boolean }) {
  const { session } = useStaffAuth();
  if (!session) return null;

  function onChange(next: StaffRole) {
    const current = readMockStaffSession();
    if (!current) return;
    writeMockStaffSession({ ...current, role: next });
  }

  return (
    <div className={compact ? "w-full" : "min-w-[140px]"}>
      <label className="sr-only" htmlFor="dev-role-switcher">
        Mock role (UI only)
      </label>
      <Select
        id="dev-role-switcher"
        value={session.role}
        onChange={(e) => onChange(e.target.value as StaffRole)}
        className="h-9 bg-white text-xs"
        title="Development role switcher — not real authorization"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {compact ? role : `Role: ${staffRoleLabel(role)}`}
          </option>
        ))}
      </Select>
    </div>
  );
}
