import { NextResponse } from "next/server";

import { linkCustomerToAuthUser } from "@/lib/customer/link-customer-to-auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      fullName?: string;
      phone?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const fullName = body.fullName?.trim();
    const phone = body.phone?.trim() ?? "";

    if (!email || !password || !fullName || password.length < 8) {
      return NextResponse.json(
        { error: "Name, valid email, and password (8+ characters) are required." },
        { status: 400 },
      );
    }

    const admin = createSupabaseServiceClient();
    const { data: created, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, phone },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const customer = await linkCustomerToAuthUser(
      admin,
      created.user.id,
      email,
      { fullName, phone },
    );

    return NextResponse.json({ customer });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
