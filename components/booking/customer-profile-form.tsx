"use client";

import { useState } from "react";
import type { Customer } from "@/lib/domain/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaveError(null);
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("customers")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
      })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }

    await onSaved();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-muted/60 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-apple-copper">
            Guest Portal
          </span>
          <h2 className="mt-1 font-serif text-3xl font-medium text-forest-green">
            My Profile
          </h2>
          <p className="mt-0.5 text-xs text-charcoal/60">
            Manage your personal contact details
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onMyBookings}
          className="self-start sm:self-auto rounded-full border-border-muted text-xs hover:border-forest-green hover:text-forest-green"
        >
          View Bookings →
        </Button>
      </div>

      <div className="space-y-4">
        {saved ? (
          <Alert variant="info" className="rounded-xl border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
            ✓ Profile changes saved successfully.
          </Alert>
        ) : null}

        {saveError ? (
          <Alert variant="warning" className="rounded-xl border-red-200 bg-red-50 text-xs text-red-800">
            {saveError}
          </Alert>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="profile-name" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
            Full Name
          </Label>
          <Input
            id="profile-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-xl border-border-muted py-2.5 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-email" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
            Email Address (Primary Account)
          </Label>
          <Input
            id="profile-email"
            value={user.email}
            disabled
            className="rounded-xl border-border-muted bg-surface-muted/50 py-2.5 text-sm text-charcoal/60 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-phone" className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
            Mobile Phone Number
          </Label>
          <Input
            id="profile-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl border-border-muted py-2.5 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-muted/60 pt-6">
          <Button
            onClick={() => void saveProfile()}
            disabled={saving}
            className="rounded-xl bg-forest-green hover:bg-forest-green/90 text-warm-ivory px-6 py-2.5 text-sm font-medium"
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>

          <Button
            variant="ghost"
            onClick={onSignOut}
            className="text-xs text-charcoal/60 hover:text-red-700"
          >
            Sign out of account
          </Button>
        </div>
      </div>
    </div>
  );
}
