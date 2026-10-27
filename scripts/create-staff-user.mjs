/**
 * Create a Supabase Auth user + staff_profiles row.
 * Usage:
 *   npm run staff:create -- --email owner@iturrieta.demo --password 'YourPass' --role owner --name "Demo Owner"
 */
import { createClient } from "@supabase/supabase-js";

function readArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1 || !process.argv[idx + 1]) return undefined;
  return process.argv[idx + 1];
}

const email = readArg("email") ?? "owner@iturrieta.demo";
const password = readArg("password");
const role = readArg("role") ?? "owner";
const displayName = readArg("name") ?? "Demo Owner";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!password) {
  console.error("Pass --password '...' (use quotes if special characters)");
  process.exit(1);
}

const allowedRoles = new Set(["owner", "manager", "waiter"]);
if (!allowedRoles.has(role)) {
  console.error("Role must be owner, manager, or waiter");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: created, error: createError } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { display_name: displayName },
});

if (createError) {
  console.error("auth.admin.createUser:", createError.message);
  process.exit(1);
}

const userId = created.user.id;

const { error: profileError } = await admin.from("staff_profiles").insert({
  user_id: userId,
  email,
  display_name: displayName,
  role,
});

if (profileError) {
  console.error("staff_profiles insert:", profileError.message);
  console.error("Rolling back auth user may be required manually in Dashboard.");
  process.exit(1);
}

console.log("Staff user ready:");
console.log("  email:", email);
console.log("  role:", role);
console.log("  user_id:", userId);
