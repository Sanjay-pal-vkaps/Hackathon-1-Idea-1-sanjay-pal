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

export function CustomerRegisterForm() {
  const router = useRouter();
  const { refreshProfile } = useCustomerAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!fullName.trim()) nextErrors.fullName = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    const res = await fetch("/api/customer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      }),
    });

    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setSubmitting(false);
      setSubmitError(body.error ?? "Registration failed");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setSubmitting(false);
      setSubmitError(signInError.message);
      return;
    }

    await refreshProfile();
    setSubmitting(false);
    router.push("/book/account");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-forest-green/20 bg-forest-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest-green">
            <span>🍏</span> Join Iturrieta
          </div>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-forest-green">
            Create an account
          </h2>
          <p className="mt-1.5 text-sm text-charcoal/65">
            Register to keep track of your visits and seamlessly manage all your reservations.
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          {submitError ? (
            <Alert variant="warning" className="rounded-xl border-amber-300 bg-amber-50 text-xs text-amber-900">
              {submitError}
            </Alert>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="reg-name" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
              Full Name *
            </Label>
            <Input
              id="reg-name"
              placeholder="e.g. Amaia Etxebarria"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl border-border-muted py-2.5 text-sm"
              required
            />
            {errors.fullName ? (
              <p className="text-xs text-red-600">{errors.fullName}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
              Email Address *
            </Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="amaia@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-border-muted py-2.5 text-sm"
              required
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-phone" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
              Phone Number (Optional)
            </Label>
            <Input
              id="reg-phone"
              type="tel"
              placeholder="+34 600 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border-border-muted py-2.5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-password" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
              Password (8+ characters) *
            </Label>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-border-muted py-2.5 text-sm"
              required
            />
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-forest-green hover:bg-forest-green/90 text-warm-ivory py-3 text-sm font-medium shadow-sm transition"
            disabled={submitting}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-warm-ivory border-t-transparent" />
                Creating account…
              </span>
            ) : (
              "Complete Registration →"
            )}
          </Button>
        </form>

        <div className="mt-6 border-t border-border-muted/60 pt-5 text-center text-xs text-charcoal/65">
          <p>
            Already have an account?{" "}
            <Link
              href="/book/login"
              className="font-semibold text-apple-copper hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
