"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  clearMockCustomerSession,
  readMockCustomerSession,
  subscribeMockCustomerSession,
  writeMockCustomerSession,
  type MockCustomerSession,
} from "@/lib/mock/customer-session";

type CustomerAuthContextValue = {
  user: MockCustomerSession | null;
  signIn: (user: MockCustomerSession) => void;
  signOut: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(
    subscribeMockCustomerSession,
    () => readMockCustomerSession(),
    () => null,
  );

  const signIn = useCallback((next: MockCustomerSession) => {
    writeMockCustomerSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearMockCustomerSession();
  }, []);

  const value = useMemo(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut],
  );

  return (
    <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return ctx;
}
