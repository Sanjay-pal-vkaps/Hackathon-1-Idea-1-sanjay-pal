/**
 * Regenerate supabase/seed.sql from lib/mock/fixtures (seed IDs only).
 * Run: npm run db:generate-seed
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { DEMO_ACTIVITY_SEED } from "@/lib/mock/fixtures/activity";
import { DEMO_CUSTOMERS } from "@/lib/mock/fixtures/customers";
import { DEMO_FLOORS } from "@/lib/mock/fixtures/floors";
import {
  DEMO_RESERVATIONS_SEED,
} from "@/lib/mock/fixtures/reservations";
import {
  DEMO_BOOKING_SETTINGS,
  DEMO_SERVICE_SHIFTS,
} from "@/lib/mock/fixtures/settings";
import { DEMO_TABLES_SEED } from "@/lib/mock/fixtures/tables";
import { getDemoSeedMetadataAt } from "@/lib/seed/demo-service-date";

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlNullableString(value: string | undefined): string {
  return value === undefined ? "NULL" : sqlString(value);
}

const seedDemoAt = getDemoSeedMetadataAt();

const lines: string[] = [
  "-- Generated from seed fixtures — do not edit by hand; run npm run db:generate-seed",
  "BEGIN;",
  "",
  "TRUNCATE TABLE public.activity_events, public.reservation_tables, public.reservations,",
  "  public.restaurant_tables, public.customers, public.service_shifts, public.booking_settings,",
  "  public.floors RESTART IDENTITY CASCADE;",
  "",
];

for (const floor of DEMO_FLOORS) {
  lines.push(
    `INSERT INTO public.floors (id, name) VALUES (${sqlString(floor.id)}, ${sqlString(floor.name)});`,
  );
}
lines.push("");

for (const table of DEMO_TABLES_SEED) {
  const rot =
    table.layout.rotation === undefined
      ? "NULL"
      : String(table.layout.rotation);
  lines.push(
    `INSERT INTO public.restaurant_tables (` +
      `id, floor_id, number, capacity_min, capacity_max, zone, shape, active, status, ` +
      `layout_x, layout_y, layout_width, layout_height, layout_rotation` +
      `) VALUES (` +
      `${sqlString(table.id)}, ${sqlString(table.layout.floorId)}, ${table.number}, ` +
      `${table.capacityMin}, ${table.capacityMax}, ${sqlString(table.zone)}, ` +
      `${sqlString(table.shape)}::public.table_shape, ${table.active}, ` +
      `${sqlString(table.status)}::public.table_status, ` +
      `${table.layout.x}, ${table.layout.y}, ${table.layout.width}, ${table.layout.height}, ${rot}` +
      `);`,
  );
}
lines.push("");

for (const customer of DEMO_CUSTOMERS) {
  lines.push(
    `INSERT INTO public.customers (id, full_name, email, phone) VALUES (` +
      `${sqlString(customer.id)}, ${sqlString(customer.fullName)}, ` +
      `${sqlString(customer.email)}, ${sqlString(customer.phone)});`,
  );
}
lines.push("");

for (const reservation of DEMO_RESERVATIONS_SEED) {
  lines.push(
    `INSERT INTO public.reservations (` +
      `id, customer_id, start_at, end_at, guest_count, status, source, notes, created_at, updated_at` +
      `) VALUES (` +
      `${sqlString(reservation.id)}, ${sqlString(reservation.customerId)}, ` +
      `${sqlString(reservation.startAt)}::timestamptz, ${sqlString(reservation.endAt)}::timestamptz, ` +
      `${reservation.guestCount}, ${sqlString(reservation.status)}::public.reservation_status, ` +
      `${sqlString(reservation.source)}::public.reservation_source, ` +
      `${sqlNullableString(reservation.notes)}, ${sqlString(seedDemoAt)}::timestamptz, ${sqlString(seedDemoAt)}::timestamptz` +
      `);`,
  );
}
lines.push("");

for (const reservation of DEMO_RESERVATIONS_SEED) {
  for (const tableId of reservation.tableIds) {
    lines.push(
      `INSERT INTO public.reservation_tables (reservation_id, table_id) VALUES (` +
        `${sqlString(reservation.id)}, ${sqlString(tableId)});`,
    );
  }
}
lines.push("");

for (const shift of DEMO_SERVICE_SHIFTS) {
  lines.push(
    `INSERT INTO public.service_shifts (id, name, start_time, end_time, default_duration_minutes) VALUES (` +
      `${sqlString(shift.id)}, ${sqlString(shift.name)}, ${sqlString(shift.startTime)}::time, ` +
      `${sqlString(shift.endTime)}::time, ${shift.defaultDurationMinutes});`,
  );
}
lines.push("");

const s = DEMO_BOOKING_SETTINGS;
lines.push(
  `INSERT INTO public.booking_settings (id, online_guest_limit, cleaning_buffer_minutes, timezone) VALUES (` +
    `1, ${s.onlineGuestLimit}, ${s.cleaningBufferMinutes}, ${sqlString(s.timezone)});`,
);
lines.push("");

for (const event of DEMO_ACTIVITY_SEED) {
  lines.push(
    `INSERT INTO public.activity_events (id, type, message, occurred_at, reservation_id, table_id) VALUES (` +
      `${sqlString(event.id)}, ${sqlString(event.type)}::public.activity_event_type, ` +
      `${sqlString(event.message)}, ${sqlString(event.occurredAt)}::timestamptz, ` +
      `${sqlNullableString(event.reservationId)}, ${sqlNullableString(event.tableId)});`,
  );
}

lines.push("");
lines.push("COMMIT;");
lines.push("");

const outPath = join(process.cwd(), "supabase", "seed.sql");
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath} (${lines.length} lines)`);
