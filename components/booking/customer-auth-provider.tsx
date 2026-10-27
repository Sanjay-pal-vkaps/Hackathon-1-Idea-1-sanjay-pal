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
import type { Customer } from "@/lib/domain/types";
import { loadCustomerProfileForUser } from "@/lib/customer/load-customer-profile";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type CustomerAuthContextValue = {
  user: Customer | null;
  loading: boolean;
  authError: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const syncProfile = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    let profile = await loadCustomerProfileForUser(supabase, authUser.id);
    if (!profile) {
      const res = await fetch("/api/customer/sync-profile", { method: "POST" });
      if (res.ok) {
        const body = (await res.json()) as { customer: Customer };
        profile = body.customer;
      }
    }

    if (!profile) {
      setAuthError("Could not load your guest profile.");
      setUser(null);
    } else {
      setAuthError(null);
      setUser(profile);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function syncFromAuth() {
      await syncProfile();
    }

    void syncFromAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncFromAuth();
    });

    return () => subscription.unsubscribe();
  }, [syncProfile]);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = useMemo(
    (): CustomerAuthContextValue => ({
      user,
      loading,
      authError,
      refreshProfile: syncProfile,
      signOut,
      clearAuthError,
    }),
    [user, loading, authError, syncProfile, signOut, clearAuthError],
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return ctx;
}
