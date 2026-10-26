"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { StaffDevPanel } from "@/components/staff/staff-dev-panel";
import { StaffShell } from "@/components/staff/staff-shell";

/** Aligns with demo reservation fixtures in `lib/mock/fixtures/reservations.ts` */
function defaultOpsDate() {
  return "2026-10-16";
}

type StaffDateContextValue = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

const StaffDateContext = createContext<StaffDateContextValue | null>(null);

export function useStaffDate() {
  const ctx = useContext(StaffDateContext);
  if (!ctx) throw new Error("useStaffDate must be used within StaffWorkspace");
  return ctx;
}

export function StaffWorkspace({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(defaultOpsDate);
  const value = useMemo(
    () => ({ selectedDate, setSelectedDate }),
    [selectedDate],
  );

  return (
    <StaffDateContext.Provider value={value}>
      <StaffShell selectedDate={selectedDate} onDateChange={setSelectedDate}>
        <div className="mb-4">
          <StaffDevPanel />
        </div>
        {children}
      </StaffShell>
    </StaffDateContext.Provider>
  );
}
