"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { StaffSidebar } from "@/components/staff/staff-sidebar";
import { StaffTopbar } from "@/components/staff/staff-topbar";

export function StaffShell({
  selectedDate,
  onDateChange,
  mobileNavOpen = false,
  setMobileNavOpen,
  children,
}: {
  selectedDate: string;
  onDateChange: (date: string) => void;
  mobileNavOpen?: boolean;
  setMobileNavOpen?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [internalMobileNav, setInternalMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isNavOpen = setMobileNavOpen ? mobileNavOpen : internalMobileNav;
  const setNavOpen = setMobileNavOpen ?? setInternalMobileNav;

  const isDashboard = pathname === "/dashboard";

  return (
    <div className="flex min-h-screen flex-1 bg-[#F5F2E9]">
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen self-start z-30">
        <StaffSidebar collapsed={collapsed} />
      </div>

      {isNavOpen ? (
        <div className="fixed inset-y-0 left-0 z-40 w-64 shadow-xl lg:hidden">
          <StaffSidebar mobile onNavigate={() => setNavOpen(false)} />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {!isDashboard ? (
          <>
            <div className="shrink-0 sticky top-0 z-20 bg-[#F5F2E9]/95 backdrop-blur-xs">
              <StaffTopbar
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                onOpenNav={() => setNavOpen(true)}
              />
            </div>
            <div className="hidden shrink-0 border-b border-border-muted bg-surface-muted/50 px-4 py-1 text-right lg:block">
              <button
                type="button"
                className="text-xs text-charcoal/70 hover:text-charcoal cursor-pointer"
                onClick={() => setCollapsed((v) => !v)}
              >
                {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              </button>
            </div>
          </>
        ) : null}

        <main className={isDashboard ? "flex-1 p-4 md:p-6 lg:p-7" : "flex-1 p-4 md:p-6"}>
          {children}
        </main>
      </div>

      {isNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-charcoal/40 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
    </div>
  );
}
