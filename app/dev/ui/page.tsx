import Link from "next/link";
import { notFound } from "next/navigation";
import { UiGallery } from "@/app/dev/ui/ui-gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mapBookingSettingsRow } from "@/lib/data/mappers";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DevUiPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  const supabase = createSupabaseServiceClient();
  const [
    { count: tableCount },
    { count: reservationCount },
    { count: customerCount },
    { data: settingsRow },
  ] = await Promise.all([
    supabase.from("restaurant_tables").select("*", { count: "exact", head: true }),
    supabase.from("reservations").select("*", { count: "exact", head: true }),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("booking_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  const settings = settingsRow ? mapBookingSettingsRow(settingsRow) : null;

  return (
    <div className="flex flex-col gap-6">
      <UiGallery />
      <div className="mx-auto w-full max-w-5xl px-4 pb-10">
        <Card>
          <CardHeader>
            <CardTitle>Database snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-charcoal/80">
            <p>Tables: {tableCount ?? "—"}</p>
            <p>Reservations: {reservationCount ?? "—"}</p>
            <p>Customers: {customerCount ?? "—"}</p>
            {settings ? (
              <p>
                Online guest limit: {settings.onlineGuestLimit} · Buffer:{" "}
                {settings.cleaningBufferMinutes} min · TZ: {settings.timezone}
              </p>
            ) : (
              <p>Booking settings not loaded.</p>
            )}
            <Link href="/" className="text-apple-copper underline-offset-2 hover:underline">
              Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
