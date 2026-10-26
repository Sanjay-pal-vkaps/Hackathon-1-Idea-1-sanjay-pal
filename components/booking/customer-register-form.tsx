"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerRegisterForm() {
  const router = useRouter();
  const { signIn } = useCustomerAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!fullName.trim()) nextErrors.fullName = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    signIn({
      id: "cust-demo-u8",
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || "+34 600 000 000",
    });
    router.push("/book/account");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a demo account</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Alert variant="warning">
            Mock registration — no account is created on a server.
          </Alert>
          <div>
            <Label htmlFor="reg-name">Full name</Label>
            <Input
              id="reg-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
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
          <Button type="submit" className="w-full">
            Continue (mock profile)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
