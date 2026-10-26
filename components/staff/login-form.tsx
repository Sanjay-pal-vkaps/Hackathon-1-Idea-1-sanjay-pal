"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useStaffAuth } from "@/components/staff/staff-auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMockStaffSession, staffRoleLabel } from "@/lib/mock/staff-session";
import type { StaffRole } from "@/lib/domain/types";
import { Select } from "@/components/ui/select";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useStaffAuth();
  const [email, setEmail] = useState("sanju@iturrieta.demo");
  const [password, setPassword] = useState("demo");
  const [role, setRole] = useState<StaffRole>("owner");
  const [emailError, setEmailError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError(null);
    signIn(
      createMockStaffSession({
        email,
        displayName: "Sanju Pal",
        role,
      }),
    );
    const next = searchParams.get("next") || "/dashboard";
    router.push(next);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Staff sign in</CardTitle>
        <CardDescription>
          Mock authentication for UI development — no credentials are verified.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Alert variant="warning">
            Mock sign-in — no authentication performed. Do not use real passwords.
          </Alert>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
              aria-invalid={Boolean(emailError)}
            />
            {emailError ? (
              <p className="mt-1 text-xs text-red-700">{emailError}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="role">Role (mock)</Label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="mt-1"
            >
              {(["owner", "manager", "waiter"] as StaffRole[]).map((r) => (
                <option key={r} value={r}>
                  {staffRoleLabel(r)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Continue to dashboard (mock)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
