"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useStaffAuth } from "@/components/staff/staff-auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authError, clearAuthError } = useStaffAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /*
  function fillDemoAccount(demoEmail: string) {
    setEmail(demoEmail);
    setEmailError(null);
    setSubmitError(null);
  }
  */

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    clearAuthError();
    setSubmitError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid staff email address");
      return;
    }
    setEmailError(null);

    if (!password.trim()) {
      setSubmitError("Enter your password");
      return;
    }

    const next = searchParams.get("next") || "/dashboard";
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="w-full max-w-xl">
      <div className="overflow-hidden rounded-3xl border border-border-muted bg-white p-8 sm:p-12 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest-green/20 bg-forest-green/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-forest-green">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            Staff & Management Workspace
          </div>

          <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-forest-green">
            Operations Sign In
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
            Sign in with your verified staff credentials to manage the floor plan, approve incoming bookings, and oversee dining service.
          </p>
        </div>

        {/* Quick-Fill Demo Credentials Helper (commented out) */}
        {/*
        <div className="mb-6 rounded-2xl border border-border-muted bg-surface-muted/40 p-4 text-xs">
          <p className="font-semibold uppercase tracking-wider text-charcoal/60 text-[11px]">
            Quick Demo Accounts:
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("owner@iturrieta.demo")}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest-green/30 bg-white px-3 py-1 font-medium text-forest-green transition hover:bg-forest-green hover:text-white"
            >
              <span>👑</span> Owner (Full Access)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("manager@iturrieta.demo")}
              className="inline-flex items-center gap-1.5 rounded-full border border-apple-copper/40 bg-white px-3 py-1 font-medium text-apple-copper transition hover:bg-apple-copper hover:text-white"
            >
              <span>📋</span> Manager (Floor & Bookings)
            </button>
          </div>
        </div>
        */}

        {/* Login Form */}
        <form className="space-y-5" onSubmit={onSubmit}>
          {authError ? (
            <Alert variant="warning" className="rounded-2xl border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
              {authError}
            </Alert>
          ) : null}

          {submitError ? (
            <Alert variant="warning" className="rounded-2xl border-red-200 bg-red-50 p-4 text-xs text-red-800">
              {submitError}
            </Alert>
          ) : null}

          {searchParams.get("error") === "auth_callback" ? (
            <Alert variant="warning" className="rounded-2xl border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
              Sign-in link expired or invalid. Try again.
            </Alert>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-charcoal/75">
              Staff Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. owner@iturrieta.demo"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border-border-muted px-4 py-2.5 text-sm focus-visible:ring-forest-green"
              required
              aria-invalid={Boolean(emailError)}
            />
            {emailError ? (
              <p className="text-xs text-red-600">{emailError}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-charcoal/75">
                Staff Password
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl border-border-muted px-4 py-2.5 text-sm focus-visible:ring-forest-green"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-forest-green hover:bg-forest-green/90 text-warm-ivory text-sm font-semibold shadow-sm transition"
            disabled={submitting}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-warm-ivory border-t-transparent" />
                Signing in…
              </span>
            ) : (
              "Sign In to Workspace →"
            )}
          </Button>
        </form>

        {/* Roles Matrix Note (commented out) */}
        {/*
        <div className="mt-8 border-t border-border-muted/60 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">
            Role Permission Matrix
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 text-xs text-charcoal/70">
            <div className="rounded-xl border border-border-muted/60 bg-surface-muted/30 p-2.5">
              <span className="font-semibold text-charcoal block">👑 Owner</span>
              <span className="text-[11px] text-charcoal/60 leading-tight block mt-0.5">
                Floor edit, users, rules & reports
              </span>
            </div>
            <div className="rounded-xl border border-border-muted/60 bg-surface-muted/30 p-2.5">
              <span className="font-semibold text-charcoal block">📋 Manager</span>
              <span className="text-[11px] text-charcoal/60 leading-tight block mt-0.5">
                Approve queues, layout & tables
              </span>
            </div>
            <div className="rounded-xl border border-border-muted/60 bg-surface-muted/30 p-2.5">
              <span className="font-semibold text-charcoal block">🍽️ Waiter</span>
              <span className="text-[11px] text-charcoal/60 leading-tight block mt-0.5">
                Live table status & service view
              </span>
            </div>
          </div>
        </div>
        */}

        {/* Guest Alternative */}
        <div className="mt-6 border-t border-border-muted/60 pt-5 text-center text-xs text-charcoal/60">
          <p>
            Looking to reserve a table instead?{" "}
            <Link href="/book" className="font-semibold text-apple-copper hover:underline">
              Guest reservation portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
