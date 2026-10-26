"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { MockStaffSession } from "@/lib/mock/staff-session";
import {
  clearMockStaffSession,
  readMockStaffSession,
  subscribeMockStaffSession,
  writeMockStaffSession,
} from "@/lib/mock/staff-session";

type StaffAuthContextValue = {
  session: MockStaffSession | null;
  signIn: (session: MockStaffSession) => void;
  signOut: () => void;
};

const StaffAuthContext = createContext<StaffAuthContextValue | null>(null);

function useMockStaffSessionSnapshot() {
  return useSyncExternalStore(
    subscribeMockStaffSession,
    () => readMockStaffSession(),
    () => null,
  );
}

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const session = useMockStaffSessionSnapshot();
  const router = useRouter();

  const signIn = useCallback((next: MockStaffSession) => {
    writeMockStaffSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearMockStaffSession();
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      session,
      signIn,
      signOut,
    }),
    [session, signIn, signOut],
  );

  return (
    <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}

export function StaffAuthGate({ children }: { children: ReactNode }) {
  const { session } = useStaffAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [session, router, pathname]);

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-charcoal/70">
        Redirecting to mock sign-in…
      </div>
    );
  }

  return <>{children}</>;
}
