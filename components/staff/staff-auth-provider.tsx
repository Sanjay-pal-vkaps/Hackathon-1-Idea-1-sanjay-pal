"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { StaffProfile } from "@/lib/domain/types";
import { loadStaffProfileForUser } from "@/lib/staff/load-staff-profile";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type StaffAuthContextValue = {
  session: StaffProfile | null;
  loading: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
};

const StaffAuthContext = createContext<StaffAuthContextValue | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function syncFromAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSession(null);
        setLoading(false);
        return;
      }

      const profile = await loadStaffProfileForUser(supabase, user.id);
      if (!profile) {
        setAuthError(
          "No staff profile for this account. Ask an owner to create your staff profile.",
        );
        setSession(null);
        await supabase.auth.signOut();
      } else {
        setAuthError(null);
        setSession(profile);
      }
      setLoading(false);
    }

    void syncFromAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncFromAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setSession(null);
    router.push("/login");
  }, [router]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = useMemo(
    (): StaffAuthContextValue => ({
      session,
      loading,
      authError,
      signOut,
      clearAuthError,
    }),
    [session, loading, authError, signOut, clearAuthError],
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
  const { session, loading } = useStaffAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [session, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-charcoal/70">
        Checking staff session…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-charcoal/70">
        Redirecting to sign-in…
      </div>
    );
  }

  return <>{children}</>;
}
