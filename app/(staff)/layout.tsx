import type { ReactNode } from "react";
import { StaffAppShell } from "@/components/staff/staff-app-shell";

/** Mock auth uses localStorage — do not statically cache the loading shell. */
export const dynamic = "force-dynamic";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <StaffAppShell>{children}</StaffAppShell>;
}
