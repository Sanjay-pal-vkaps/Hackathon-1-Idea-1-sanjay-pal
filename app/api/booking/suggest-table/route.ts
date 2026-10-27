import { NextResponse } from "next/server";

import { suggestTableId } from "@/lib/booking/engine";
import { loadBookingEngineContext } from "@/lib/booking/server-context";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      guestCount?: number;
      startAt?: string;
      endAt?: string;
    };
    if (!body.guestCount || !body.startAt || !body.endAt) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    const ctx = await loadBookingEngineContext(supabase);
    const tableId = suggestTableId(
      body.guestCount,
      body.startAt,
      body.endAt,
      ctx.tables,
      ctx.reservations,
      ctx.settings.cleaningBufferMinutes,
    );

    return NextResponse.json({ tableId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Suggest table failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
