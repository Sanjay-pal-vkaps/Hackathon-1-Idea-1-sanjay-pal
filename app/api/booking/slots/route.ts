import { NextResponse } from "next/server";

import { getPublicTimeSlots } from "@/lib/booking/server-context";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const shiftId = searchParams.get("shiftId");
  const guestCount = Number(searchParams.get("guestCount") ?? "2");
  if (!date || !shiftId) {
    return NextResponse.json(
      { error: "date and shiftId required" },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseServiceClient();
    const slots = await getPublicTimeSlots(
      supabase,
      date,
      shiftId,
      Number.isFinite(guestCount) ? guestCount : 2,
    );
    return NextResponse.json(slots);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load slots";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
