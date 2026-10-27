"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { StaffShell } from "@/components/staff/staff-shell";

function defaultOpsDate() {
  return new Date().toISOString().slice(0, 10);
}

type StaffDateContextValue = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  openMobileNav: () => void;
};

const StaffDateContext = createContext<StaffDateContextValue | null>(null);

export function useStaffDate() {
  const ctx = useContext(StaffDateContext);
  if (!ctx) throw new Error("useStaffDate must be used within StaffWorkspace");
  return ctx;
}

export function StaffWorkspace({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(defaultOpsDate);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate,
      openMobileNav: () => setMobileNavOpen(true),
    }),
    [selectedDate],
  );

  return (
    <StaffDateContext.Provider value={value}>
      <StaffShell
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      >
        {children}
      </StaffShell>
    </StaffDateContext.Provider>
  );
}
