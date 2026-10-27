import { NextResponse } from "next/server";

import { linkCustomerToAuthUser } from "@/lib/customer/link-customer-to-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createSupabaseServiceClient();
    const customer = await linkCustomerToAuthUser(admin, user.id, user.email, {
      fullName: (user.user_metadata?.full_name as string | undefined) ?? undefined,
      phone: (user.user_metadata?.phone as string | undefined) ?? undefined,
    });
    return NextResponse.json({ customer });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
