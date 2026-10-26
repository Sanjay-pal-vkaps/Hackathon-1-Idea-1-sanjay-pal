import type { StaffProfile, StaffRole } from "@/lib/domain/types";

const STORAGE_KEY = "iturrieta_mock_staff_session";

const listeners = new Set<() => void>();

/** Stable reference for useSyncExternalStore when localStorage unchanged */
let cachedRaw: string | null | undefined;
let cachedSession: MockStaffSession | null = null;

export type MockStaffSession = StaffProfile;

export function subscribeMockStaffSession(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notifyMockStaffSession() {
  listeners.forEach((listener) => listener());
}

export function readMockStaffSession(): MockStaffSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedSession;
  }

  cachedRaw = raw;
  if (!raw) {
    cachedSession = null;
    return null;
  }

  try {
    cachedSession = JSON.parse(raw) as MockStaffSession;
    return cachedSession;
  } catch {
    cachedSession = null;
    return null;
  }
}

export function writeMockStaffSession(session: MockStaffSession): void {
  const raw = JSON.stringify(session);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSession = session;
  notifyMockStaffSession();
}

export function clearMockStaffSession(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  cachedRaw = null;
  cachedSession = null;
  notifyMockStaffSession();
}

export function createMockStaffSession(input: {
  email: string;
  displayName?: string;
  role?: StaffRole;
}): MockStaffSession {
  return {
    id: "staff-demo-001",
    email: input.email,
    displayName: input.displayName ?? "Sanju Pal",
    role: input.role ?? "owner",
  };
}

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
