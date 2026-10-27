function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value.trim();
}

/** Browser-safe Supabase project URL */
export function getSupabaseUrl(): string {
  return required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

/**
 * Publishable (anon) key — safe for the browser with RLS.
 * Supports both legacy ANON_KEY and newer PUBLISHABLE_KEY names.
 */
export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    key,
  );
}

/** Server-only — never import from client components */
export function getSupabaseServiceRoleKey(): string {
  return required(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
