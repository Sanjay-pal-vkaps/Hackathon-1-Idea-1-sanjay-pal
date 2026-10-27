"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      nextErrors.email = "Enter a valid email";
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
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          {submitError ? <Alert variant="warning">{submitError}</Alert> : null}
          <div>
            <Label htmlFor="reg-name">Full name</Label>
            <Input
              id="reg-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
              required
            />
            {errors.fullName ? (
              <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-700">{errors.email}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="reg-phone">Phone (optional)</Label>
            <Input
              id="reg-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              required
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-700">{errors.password}</p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
