"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { StaffAuthGate, StaffAuthProvider } from "@/components/staff/staff-auth-provider";
import { StaffWorkspace } from "@/components/staff/staff-workspace";

function StaffLoadingShell() {
  return (
    <div className="flex flex-1 items-center justify-center p-8 text-sm text-charcoal/70">
      Loading staff workspace (mock)…
    </div>
  );
}

export function StaffAppShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // Client-only staff shell (mock localStorage auth).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount gate after hydration
    setMounted(true);
  }, []);

  if (!mounted) {
    return <StaffLoadingShell />;
  }

  return (
    <StaffAuthProvider>
      <StaffAuthGate>
        <StaffWorkspace>{children}</StaffWorkspace>
      </StaffAuthGate>
    </StaffAuthProvider>
  );
}
