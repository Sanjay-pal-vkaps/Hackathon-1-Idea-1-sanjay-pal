import Link from "next/link";
import { UiGallery } from "@/app/dev/ui/ui-gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMockRepositories } from "@/lib/mock/repositories";

export default async function DevUiPage() {
  const repos = getMockRepositories();
  const [tables, reservations, customers, settings] = await Promise.all([
    repos.tables.listTables(),
    repos.reservations.list(),
    repos.customers.list(),
    repos.settings.getBookingSettings(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <UiGallery />
      <div className="mx-auto w-full max-w-5xl px-4 pb-10">
        <Card>
          <CardHeader>
            <CardTitle>Mock repository snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-charcoal/80">
            <p>Demo tables: {tables.length}</p>
            <p>Demo reservations: {reservations.length}</p>
            <p>Demo customers: {customers.length}</p>
            <p>
              Online guest limit (demo): {settings.onlineGuestLimit} · Buffer:{" "}
              {settings.cleaningBufferMinutes} min · TZ: {settings.timezone}
            </p>
            <Link href="/" className="text-apple-copper underline-offset-2 hover:underline">
              Back to foundation home
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
