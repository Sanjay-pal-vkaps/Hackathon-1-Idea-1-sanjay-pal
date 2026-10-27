/**
 * Apply B1 migration + seed to Supabase Postgres.
 * Requires SUPABASE_DB_URL (Dashboard → Settings → Database → Connection string → URI).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const root = process.cwd();
const migrationPath = join(
  root,
  "supabase/migrations/20251027000000_initial_schema.sql",
);
const seedPath = join(root, "supabase/seed.sql");

const connectionString =
  process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Missing SUPABASE_DB_URL (or DATABASE_URL). Add to .env.local:\n" +
      "  SUPABASE_DB_URL=postgresql://postgres.[ref]:[password]@...supabase.com:5432/postgres",
  );
  process.exit(1);
}

const migrationSql = readFileSync(migrationPath, "utf8");
const seedSql = readFileSync(seedPath, "utf8");

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Applying migration…");
  await client.query(migrationSql);
  console.log("Applying seed…");
  await client.query(seedSql);
  console.log("B1 migration + seed applied successfully.");
} catch (err) {
  console.error("Apply failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
