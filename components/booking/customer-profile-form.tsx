"use client";

import { useState } from "react";
import type { Customer } from "@/lib/domain/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type CustomerProfileFormProps = {
  user: Customer;
  onSaved: () => Promise<void>;
  onMyBookings: () => void;
  onSignOut: () => void;
};

export function CustomerProfileForm({
  user,
  onSaved,
  onMyBookings,
  onSignOut,
}: CustomerProfileFormProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function saveProfile() {
    setSaveError(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("customers")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
      })
      .eq("id", user.id);

    if (error) {
      setSaveError(error.message);
      return;
    }

    await onSaved();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  }

  return (
    <>
      <CardHeader>
        <CardTitle>My profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {saved ? <Alert variant="info">Profile saved.</Alert> : null}
        {saveError ? <Alert variant="warning">{saveError}</Alert> : null}
        <div>
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" value={user.email} disabled className="mt-1" />
        </div>
        <div>
          <Label htmlFor="profile-phone">Phone</Label>
          <Input
            id="profile-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void saveProfile()}>Save profile</Button>
          <Button variant="outline" onClick={onMyBookings}>
            My bookings
          </Button>
          <Button variant="ghost" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </CardContent>
    </>
  );
}
