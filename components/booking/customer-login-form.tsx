"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function CustomerLoginForm() {
  const router = useRouter();
  const { clearAuthError, authError, refreshProfile } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    clearAuthError();
    setError(null);
    setSubmitting(true);

    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setSubmitting(false);
      setError(signInError.message);
      return;
    }

    await fetch("/api/customer/sync-profile", { method: "POST" });
    await refreshProfile();
    setSubmitting(false);
    router.push("/book/my-bookings");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-2xl py-4 sm:py-8">
      {/* 50% Larger Form Card */}
      <div className="overflow-hidden rounded-3xl border border-border-muted bg-white p-8 sm:p-12 md:p-14 shadow-sm">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest-green/20 bg-forest-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-forest-green">
            <span>🍏</span> Iturrieta Sagardotegia · Guest Portal
          </div>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-forest-green">
            Welcome back
          </h2>
          <p className="mt-2 text-base leading-relaxed text-charcoal/70">
            Sign in to access your reservations, update dining preferences, or reschedule your upcoming table.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => void onSubmit(e)}>
          {authError ? (
            <Alert variant="warning" className="rounded-2xl border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              {authError}
            </Alert>
          ) : null}

          {error ? (
            <Alert variant="warning" className="rounded-2xl border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="cust-email" className="text-xs font-semibold uppercase tracking-wider text-charcoal/75">
              Email Address
            </Label>
            <Input
              id="cust-email"
              type="email"
              placeholder="name@example.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 rounded-2xl border-border-muted px-4 py-3.5 text-base focus-visible:ring-forest-green"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cust-password" className="text-xs font-semibold uppercase tracking-wider text-charcoal/75">
                Password
              </Label>
            </div>
            <Input
              id="cust-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-13 rounded-2xl border-border-muted px-4 py-3.5 text-base focus-visible:ring-forest-green"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-2xl bg-forest-green hover:bg-forest-green/90 text-warm-ivory text-base font-semibold shadow-md transition"
            disabled={submitting}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-warm-ivory border-t-transparent" />
                Signing in…
              </span>
            ) : (
              "Sign in to Guest Portal →"
            )}
          </Button>
        </form>

        <div className="mt-8 border-t border-border-muted/60 pt-6 text-center text-sm text-charcoal/70">
          <p>
            Don’t have a customer account?{" "}
            <Link
              href="/book/register"
              className="font-semibold text-apple-copper hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Guest Booking Alternative Card */}
      <div className="mt-6 rounded-3xl border border-border-muted bg-surface-muted/50 p-6 text-center text-sm text-charcoal/75">
        <p className="font-semibold text-charcoal text-base">Just looking to book a table?</p>
        <p className="mt-1">No registration or login is required to reserve a table at Iturrieta.</p>
        <Link
          href="/book"
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-white border border-border-muted px-5 py-2.5 font-semibold text-forest-green shadow-xs transition hover:bg-forest-green hover:text-white"
        >
          Book a table as guest →
        </Link>
      </div>

      {/* Account Benefits */}
      <div className="mt-6 rounded-3xl border border-forest-green/15 bg-forest-green/5 p-6 text-xs sm:text-sm text-charcoal/75">
        <p className="font-semibold text-forest-green uppercase tracking-wider text-xs">
          Guest Account Benefits:
        </p>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
          <li className="flex items-start gap-2">
            <span className="text-apple-copper font-bold">✓</span>
            <span>View all past & upcoming visits</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-apple-copper font-bold">✓</span>
            <span>Save dietary & table notes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-apple-copper font-bold">✓</span>
            <span>Fast one-click bookings</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
