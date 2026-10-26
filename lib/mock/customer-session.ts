import type { Customer } from "@/lib/domain/types";

const STORAGE_KEY = "iturrieta_mock_customer_session";

const listeners = new Set<() => void>();

/** Stable reference for useSyncExternalStore when localStorage unchanged */
let cachedRaw: string | null | undefined;
let cachedSession: MockCustomerSession | null = null;

export type MockCustomerSession = Pick<Customer, "id" | "fullName" | "email" | "phone">;

export function subscribeMockCustomerSession(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function notify() {
  listeners.forEach((l) => l());
}

export function readMockCustomerSession(): MockCustomerSession | null {
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
    cachedSession = JSON.parse(raw) as MockCustomerSession;
    return cachedSession;
  } catch {
    cachedSession = null;
    return null;
  }
}

export function writeMockCustomerSession(session: MockCustomerSession) {
  const raw = JSON.stringify(session);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSession = session;
  notify();
}

export function clearMockCustomerSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  cachedRaw = null;
  cachedSession = null;
  notify();
}
