import { NextResponse } from "next/server";

import { listAvailableDates } from "@/lib/booking/engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!from || !to) {
    return NextResponse.json({ error: "from and to required" }, { status: 400 });
  }
  return NextResponse.json(listAvailableDates(from, to));
}
