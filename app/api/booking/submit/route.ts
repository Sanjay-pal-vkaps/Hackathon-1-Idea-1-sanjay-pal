import { NextResponse } from "next/server";

import { submitGuestBooking } from "@/lib/booking/submit-guest-booking";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      notes?: string;
      guestCount?: number;
      startAt?: string;
      endAt?: string;
    };

    if (
      !body.fullName?.trim() ||
      !body.email?.trim() ||
      !body.phone?.trim() ||
      !body.startAt ||
      !body.endAt ||
      !body.guestCount
    ) {
      return NextResponse.json({ error: "Missing booking fields" }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    const result = await submitGuestBooking(supabase, {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      notes: body.notes,
      guestCount: body.guestCount,
      startAt: body.startAt,
      endAt: body.endAt,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
