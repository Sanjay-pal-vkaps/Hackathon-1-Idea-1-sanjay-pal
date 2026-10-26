"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CUSTOMERS } from "@/lib/mock/fixtures/customers";

export function CustomerLoginForm() {
  const router = useRouter();
  const { signIn } = useCustomerAuth();
  const [email, setEmail] = useState(DEMO_CUSTOMERS[0]?.email ?? "");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const match = DEMO_CUSTOMERS.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!match) {
      setError("Use a demo guest email from fixtures, e.g. john.miller@example.com");
      return;
    }
    setError(null);
    signIn(match);
    router.push("/book/my-bookings");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Alert variant="warning">Mock sign-in — no password check performed.</Alert>
          <div>
            <Label htmlFor="cust-email">Email</Label>
            <Input
              id="cust-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
            {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
          </div>
          <Button type="submit" className="w-full">
            Sign in (mock)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
