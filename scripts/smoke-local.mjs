/**
 * Automated local smoke (API + routes). Manual browser checks remain in SMOKE_CHECKLIST.md.
 * Usage: npm run dev (or npm start) then npm run smoke:local
 */
const base = process.env.SMOKE_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

async function check(name, url, assert) {
  const res = await fetch(`${base}${url}`);
  const body = await res.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    data = body;
  }
  if (!res.ok) {
    throw new Error(`${name}: HTTP ${res.status} ${body.slice(0, 200)}`);
  }
  assert(data, res);
  console.log(`✓ ${name}`);
}

async function main() {
  console.log(`Smoke base: ${base}\n`);

  await check("GET /api/health", "/api/health", (data) => {
    if (data?.ok !== true) throw new Error("expected { ok: true }");
  });

  const range = "from=2026-01-01&to=2026-12-31";

  await check("GET /api/booking/bootstrap", `/api/booking/bootstrap?${range}`, (data) => {
    if (typeof data?.guestLimit !== "number") throw new Error("missing guestLimit");
    if (!Array.isArray(data?.shifts)) throw new Error("missing shifts");
    if (!Array.isArray(data?.dates) || data.dates.length === 0) {
      throw new Error("expected non-empty dates");
    }
  });

  await check("GET /api/booking/dates", `/api/booking/dates?${range}`, (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("expected non-empty dates array");
    }
  });

  await check("GET /book/link/demo-valid-token (API)", "/api/booking/link/demo-valid-token", (data) => {
    if (!data?.reservation?.id) throw new Error("expected reservation for demo token");
    if (data.reservation.id !== "res-001") throw new Error(`expected res-001, got ${data.reservation.id}`);
  });

  for (const path of ["/", "/book", "/login"]) {
    const res = await fetch(`${base}${path}`);
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    console.log(`✓ GET ${path} → ${res.status}`);
  }

  console.log("\nAutomated smoke passed. Complete browser section in SMOKE_CHECKLIST.md.");
}

main().catch((err) => {
  console.error("\nSmoke failed:", err.message);
  process.exit(1);
});
