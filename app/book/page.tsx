import { Suspense } from "react";
import { PublicBookingWizard } from "@/components/booking/public-booking-wizard";

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-charcoal/70">Loading booking…</p>
      }
    >
      <PublicBookingWizard />
    </Suspense>
  );
}
