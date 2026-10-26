"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import type { BookingSettings } from "@/lib/domain/types";
import { getMockRepositories } from "@/lib/mock/repositories";

export function BookingSettingsForm({ readOnly = false }: { readOnly?: boolean }) {
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getMockRepositories()
      .settings.getBookingSettings()
      .then(setSettings);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    await getMockRepositories().settings.updateBookingSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  }

  if (!settings) {
    return <PageHeader title="Settings" description="Loading…" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description={
          readOnly
            ? "Read-only for Manager in demo · Owner can edit"
            : "Booking rules and buffers · mock persistence only"
        }
      />

      {saved ? (
        <Alert variant="warning">Mock save — not stored on server</Alert>
      ) : null}

      <form
        onSubmit={(e) => void save(e)}
        className="max-w-lg space-y-5 rounded-xl border border-border-muted bg-white p-5"
      >
        <div className="space-y-2">
          <Label htmlFor="guest-limit">Online guest limit</Label>
          <Input
            id="guest-limit"
            type="number"
            min={1}
            max={30}
            value={settings.onlineGuestLimit}
            disabled={readOnly}
            onChange={(e) =>
              setSettings({
                ...settings,
                onlineGuestLimit: Number(e.target.value),
              })
            }
          />
          <p className="text-xs text-charcoal/55">
            Requests above this limit show as pending in demo flows.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="buffer">Cleaning buffer (minutes)</Label>
          <Input
            id="buffer"
            type="number"
            min={0}
            max={60}
            step={5}
            value={settings.cleaningBufferMinutes}
            disabled={readOnly}
            onChange={(e) =>
              setSettings({
                ...settings,
                cleaningBufferMinutes: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tz">Timezone</Label>
          <Input
            id="tz"
            value={settings.timezone}
            disabled={readOnly}
            onChange={(e) =>
              setSettings({ ...settings, timezone: e.target.value })
            }
          />
        </div>

        {readOnly ? null : (
          <Button type="submit">Save settings (mock)</Button>
        )}
      </form>
    </div>
  );
}
