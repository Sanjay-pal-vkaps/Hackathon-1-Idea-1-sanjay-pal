# Iturrieta — Restaurant Reservation & Table Management

Iturrieta restaurant booking — **Next.js UI + Supabase** (staff auth, live data, guest booking APIs). Database setup: [`supabase/README.md`](supabase/README.md).

See **`Iturrieta_MILESTONES.md`**, **`DEPLOY.md`**, **`SMOKE_CHECKLIST.md`**, **`REGRESSION.md`**, and local **`PROJECT_BRIEF.md`**, **`QA_CHECKLIST.md`**, **`UI_REFERENCES/`** (not committed).

## Phase 1 UI — complete

| Area | Routes |
|------|--------|
| Staff admin | `/login`, `/dashboard`, `/floor-plan`, `/reservations/*`, `/customers/*`, `/schedule`, `/activity`, `/settings`, `/staff` |
| Guest booking | `/book`, `/book/login`, `/book/register`, `/book/account`, `/book/my-bookings`, `/book/link/[token]` |
| Secondary | `/reports`, `/integrations` (empty states) |
| Dev | `/dev/ui` component gallery |

**Deferred (not blocking UI sign-off):** floor plan PNG asset swap / hit-map recalibration (`public/floor-plan-bg.png`).

## Roles & permissions

- `lib/permissions/can.ts` — Owner / Manager / Waiter matrix (from Supabase `staff_profiles`)
- Waiter: floor **table status** only; no layout edit, no reservation create/cancel, no `/staff`
- Manager: settings **read-only**; no Users & Roles nav
- Direct URL to forbidden routes → `StaffForbidden` empty state

Empty states: reservations filter, floor status filter, pending queue, reports/integrations.

Form validation: staff login email, guest booking details, customer register, reservation forms.

Dialogs: initial focus moves to first focusable control when opened.

## Customer account (Supabase I2)

- `/book/register`, `/book/login` (email + password)
- `/book/account`, `/book/my-bookings` (RLS — own data only)
- Apply migration: `npm run db:apply-i2-customer` or SQL Editor (`20251027300000_customer_auth.sql`)
- **Note:** Staff and guest share one Supabase Auth session per browser

## QA

- **Release gate (local):** `npm run verify`
- **Manual smoke (local):** [`SMOKE_CHECKLIST.md`](SMOKE_CHECKLIST.md)
- **Deploy:** deferred until project complete — see [`DEPLOY.md`](DEPLOY.md) when ready
- Phase 1 UI sign-off: local **`QA_CHECKLIST.md`**

## UX checklist (core routes)

| Route | Loading | Empty | Error retry | Validation |
|-------|---------|-------|-------------|------------|
| `/login` | — | — | — | Email |
| `/dashboard` | shell | — | — | — |
| `/floor-plan` | load floor | No tables for filter | — | — |
| `/reservations` | skeleton | No rows | Retry | — |
| `/reservations/new` | — | — | — | Guest required |
| `/reservations/[id]` | header | not found | — | — |
| `/reservations/pending` | — | No pending | — | — |
| `/customers` | — | search | — | — |
| `/book` | dates | — | — | Details step |
| `/book/register` | — | — | — | Name/email |

## Setup

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

- Home: [http://localhost:3000](http://localhost:3000)
- Guest book: [http://localhost:3000/book](http://localhost:3000/book)
- Staff: [http://localhost:3000/login](http://localhost:3000/login)
- UI gallery: [http://localhost:3000/dev/ui](http://localhost:3000/dev/ui)

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Vitest (booking engine) |
| `npm run build` | Production build |
| `npm run verify` | All of the above (pre-deploy) |
| `npm run db:apply-i2-customer` | Customer auth migration |

## Email notifications (Resend)

Guest emails on book (confirmed/pending), staff approve, and staff reject. Set `RESEND_API_KEY` and `NEXT_PUBLIC_APP_URL` in `.env.local` (see `.env.example`). Without a key, the server logs the message and bookings still succeed.

Regenerate demo seed for **today’s service date**: `npm run db:generate-seed`, then re-run `supabase/seed.sql` in the SQL Editor.

## Deferred

SMS and payments are not implemented. Seed data is fictional; use a non-production Supabase project for demos.
