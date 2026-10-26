import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-forest-green">
          Iturrieta · Phase 1 UI
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-charcoal">
          Reservation system prototype
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal/75">
          U1–U8 complete on mock data: staff admin (roles, reservations, floor plan), guest
          booking, and optional customer account flows. Backend integration is Phase 2.
        </p>
      </div>

      <Alert variant="warning">
        Mock data only — no Supabase, authentication, or live reservations in this milestone.
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Start here</CardTitle>
          <CardDescription>
            Try guest booking or mock staff login. Use the role switcher in the admin shell to test
            Owner, Manager, and Waiter UI.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/book"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-apple-copper px-4 text-sm font-medium text-white transition-colors hover:bg-apple-copper/90"
          >
            Book a table (guest)
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border-muted bg-white px-4 text-sm font-medium text-charcoal hover:bg-surface-muted"
          >
            Staff login (mock)
          </Link>
          <Link
            href="/dev/ui"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border-muted bg-white px-4 text-sm font-medium text-charcoal hover:bg-surface-muted"
          >
            UI component gallery
          </Link>
        </CardContent>
      </Card>

      <p className="text-xs text-charcoal/60">
        Roadmap: see local <code className="rounded bg-surface-muted px-1">Iturrieta_MILESTONES.md</code>{" "}
        (not committed — preserved locally).
      </p>
    </main>
  );
}
