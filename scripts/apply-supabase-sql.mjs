/**
 * Run a single SQL file against Supabase Postgres.
 * Requires SUPABASE_DB_URL in .env.local
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

const relPath = process.argv[2];
if (!relPath) {
  console.error("Usage: node scripts/apply-supabase-sql.mjs <path-to.sql>");
  process.exit(1);
}

const connectionString =
  process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing SUPABASE_DB_URL in .env.local");
  process.exit(1);
}

const sql = readFileSync(resolve(process.cwd(), relPath), "utf8");
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log(`Applied ${relPath}`);
} catch (err) {
  console.error("Apply failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
