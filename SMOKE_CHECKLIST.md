# Production smoke checklist (Supabase)

Run after `npm run verify` passes locally, or after deploy to staging/production.

**Prerequisites:** `.env.local` (or host env) has `NEXT_PUBLIC_SUPABASE_*` and `SUPABASE_SERVICE_ROLE_KEY`. Migrations applied through I2 (`20251027300000_customer_auth.sql`).

## Automated gate

```bash
npm run verify   # typecheck → lint → test → build
```

## Staff (use a dedicated browser profile or incognito — see note below)

- [ ] `/login` — staff email + password → lands on `/dashboard` with live counts
- [ ] `/reservations` — list loads from DB (not empty if seed ran)
- [ ] `/reservations/pending` — approve one pending → status updates; activity shows audit row
- [ ] `/floor-plan` — table status change sticks; Owner **Edit layout → Save** persists after refresh (Supabase, not localStorage)
- [ ] `/settings` — booking settings load and save (Manager read-only if applicable)
- [ ] Sign out → `/login`; protected routes redirect when unauthenticated

## Guest booking (no login)

- [ ] `/book` — date picker and slots load via `/api/booking/*`
- [ ] Complete booking with party within online limit → **confirmed** (or pending per rules)
- [ ] After submit → **View reservation** link works (`/book/link/…`)
- [ ] `/book/link/demo-valid-token` — shows **res-001** (after I4 migration)
- [ ] Party above online limit → **pending** + staff sees it on pending queue
- [ ] Booking works without customer account

## Customer account (I2)

- [ ] `/book/register` — new account (password 8+ chars) → profile created
- [ ] Register with email that already has guest bookings (e.g. seed `john.miller@example.com`) → past reservations linked
- [ ] `/book/my-bookings` — only this customer’s reservations (RLS)
- [ ] `/book/account` — save name/phone → persists after refresh
- [ ] `/book/login` — sign in with password → same my-bookings list

## Session conflict (documented behavior)

- [ ] After staff login, `/book/login` in the **same browser** replaces the Supabase session — staff area may show logged out. Use separate profiles for parallel staff + guest testing.

## Build / runtime

- [ ] `npm run build` completes with no TypeScript errors
- [ ] `npm start` — smoke one staff route and `/book` against production build
- [ ] `GET /api/health` → `{ "ok": true }` on deployed host
- [ ] No secrets in client bundle (only `NEXT_PUBLIC_*` in browser)

## Email (optional — Resend)

- [ ] With `RESEND_API_KEY` set, complete `/book` → guest inbox receives confirmation (Resend sandbox: `onboarding@resend.dev` only delivers to your Resend account email)
- [ ] Approve pending → confirmation email; reject → rejection email

## Out of scope (skipped per plan)

- SMS notifications
- Payments
