import { randomBytes } from "node:crypto";

import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_TTL_DAYS = 90;

export function generateReservationLinkToken(): string {
  return randomBytes(24).toString("base64url");
}

export async function createReservationLinkToken(
  supabase: SupabaseClient,
  reservationId: string,
  ttlDays = DEFAULT_TTL_DAYS,
): Promise<string> {
  const token = generateReservationLinkToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);

  const { error } = await supabase.from("reservation_link_tokens").insert({
    token,
    reservation_id: reservationId,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  return token;
}

export async function resolveReservationIdByLinkToken(
  supabase: SupabaseClient,
  token: string,
): Promise<string | null> {
  const trimmed = token.trim();
  if (!trimmed) return null;

  const { data, error } = await supabase
    .from("reservation_link_tokens")
    .select("reservation_id, expires_at")
    .eq("token", trimmed)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  if (new Date(data.expires_at as string).getTime() < Date.now()) {
    return null;
  }

  return data.reservation_id as string;
}
