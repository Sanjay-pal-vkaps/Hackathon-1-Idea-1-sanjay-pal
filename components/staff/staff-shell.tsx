"use client";

import { useState } from "react";
import { StaffSidebar } from "@/components/staff/staff-sidebar";
import { StaffTopbar } from "@/components/staff/staff-topbar";
export function StaffShell({
  selectedDate,
  onDateChange,
  children,
}: {
  selectedDate: string;
  onDateChange: (date: string) => void;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-1 bg-warm-ivory">
      <div className="hidden lg:block">
        <StaffSidebar collapsed={collapsed} />
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-y-0 left-0 z-40 w-64 shadow-xl lg:hidden">
          <StaffSidebar mobile onNavigate={() => setMobileNavOpen(false)} />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <StaffTopbar
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          onOpenNav={() => setMobileNavOpen(true)}
        />
        <div className="hidden border-b border-border-muted bg-surface-muted/50 px-4 py-1 text-right lg:block">
          <button
            type="button"
            className="text-xs text-charcoal/70 hover:text-charcoal"
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </button>
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>

      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-charcoal/40 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
    </div>
  );
}
