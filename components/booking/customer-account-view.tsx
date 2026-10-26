"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerAccountView() {
  const router = useRouter();
  const { user, signOut, signIn } = useCustomerAuth();
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <Card>
        <CardContent className="space-y-3 p-5">
          <p className="text-sm text-charcoal/70">Sign in or register to view a demo profile.</p>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/book/login")}>Sign in</Button>
            <Button variant="outline" onClick={() => router.push("/book/register")}>
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {saved ? (
          <Alert variant="warning">Mock save — profile not stored on server.</Alert>
        ) : null}
        <div>
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            defaultValue={user.fullName}
            className="mt-1"
            onBlur={(e) =>
              signIn({ ...user, fullName: e.target.value || user.fullName })
            }
          />
        </div>
        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" defaultValue={user.email} disabled className="mt-1" />
        </div>
        <div>
          <Label htmlFor="profile-phone">Phone</Label>
          <Input
            id="profile-phone"
            defaultValue={user.phone}
            className="mt-1"
            onBlur={(e) => signIn({ ...user, phone: e.target.value || user.phone })}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setSaved(true);
              window.setTimeout(() => setSaved(false), 4000);
            }}
          >
            Save profile (mock)
          </Button>
          <Button variant="outline" onClick={() => router.push("/book/my-bookings")}>
            My bookings
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              signOut();
              router.push("/book");
            }}
          >
            Sign out (mock)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
