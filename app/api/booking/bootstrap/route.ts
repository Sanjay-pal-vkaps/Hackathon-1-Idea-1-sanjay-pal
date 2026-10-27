import { NextResponse } from "next/server";

import { listAvailableDates } from "@/lib/booking/engine";
import { loadBookingEngineContext } from "@/lib/booking/server-context";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to) {
    return NextResponse.json({ error: "from and to required" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const ctx = await loadBookingEngineContext(supabase);
    return NextResponse.json({
      dates: listAvailableDates(from, to),
      shifts: ctx.shifts,
      guestLimit: ctx.settings.onlineGuestLimit,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bootstrap failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
