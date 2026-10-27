import { NextResponse } from "next/server";

import type { StaffRole } from "@/lib/domain/types";
import { can, type StaffAction } from "@/lib/permissions/can";
import { loadStaffProfileForUser } from "@/lib/staff/load-staff-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireStaffApi(action: StaffAction) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const profile = await loadStaffProfileForUser(supabase, user.id);
  if (!profile) {
    return {
      error: NextResponse.json({ error: "Staff profile required" }, { status: 403 }),
    };
  }

  if (!can(profile.role, action)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { supabase, profile, role: profile.role as StaffRole };
}
