"use client";

import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { CustomerProfileForm } from "@/components/booking/customer-profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CustomerAccountView() {
  const router = useRouter();
  const { user, loading, signOut, refreshProfile } = useCustomerAuth();

  if (loading) {
    return <p className="text-sm text-charcoal/70">Loading…</p>;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="space-y-3 p-5">
          <p className="text-sm text-charcoal/70">Sign in or register to manage your profile.</p>
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
      <CustomerProfileForm
        key={user.id}
        user={user}
        onSaved={refreshProfile}
        onMyBookings={() => router.push("/book/my-bookings")}
        onSignOut={() => {
          void signOut();
          router.push("/book");
        }}
      />
    </Card>
  );
}
