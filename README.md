# Iturrieta — Restaurant Reservation & Table Management

UI-first implementation for the Iturrieta booking system. **Phase 1 UI (U1–U8) is implemented on mock data.** Backend (Supabase, RLS, real booking engine) is Phase 2+.

See local **`Iturrieta_MILESTONES.md`**, **`PROJECT_BRIEF.md`**, **`QA_CHECKLIST.md`**, and **`UI_REFERENCES/`** (not committed).

## Phase 1 UI — complete

| Area | Routes |
|------|--------|
| Staff admin | `/login`, `/dashboard`, `/floor-plan`, `/reservations/*`, `/customers/*`, `/schedule`, `/activity`, `/settings`, `/staff` |
| Guest booking | `/book`, `/book/login`, `/book/register`, `/book/account`, `/book/my-bookings`, `/book/link/[token]` |
| Secondary | `/reports`, `/integrations` (empty states) |
| Dev | `/dev/ui` component gallery |

**Deferred (not blocking UI sign-off):** floor plan PNG asset swap / hit-map recalibration (`public/floor-plan-bg.png`).

## U6 — Roles & permissions (mock)

- `lib/permissions/can.ts` — Owner / Manager / Waiter matrix
- Role picker on **mock staff login** + **live role switcher** (sidebar + top bar)
- Waiter: floor **table status** only; no layout edit, no reservation create/cancel, no `/staff`
- Manager: settings **read-only**; no Users & Roles nav
- Direct URL to forbidden routes → `StaffForbidden` empty state

## U7 — UX dev toggles

Staff shell **Dev UI** panel (non-production builds):

- **Slow load (800ms)** — skeleton on `/reservations`
- **Fail next load** — error alert + **Retry** (clears fail toggle on success)

Empty states: reservations filter, floor status filter, pending queue, reports/integrations.

Form validation: staff login email, guest booking details, customer register, reservation forms.

Dialogs: initial focus moves to first focusable control when opened.

## U8 — Customer account (mock)

- `/book/register` — mock profile in `localStorage`
- `/book/login` — demo guest emails from fixtures
- `/book/account`, `/book/my-bookings`
- Self-service link: `/book/link/demo-valid-token` → single reservation **res-001**; any other token → invalid empty state

## QA

Full manual checklist: local **`QA_CHECKLIST.md`** (tick boxes for Phase 1 sign-off).

## Quick smoke (Phase 1A)

1. **Owner:** floor edit → mock save → refresh (localStorage)
2. **Manager:** approve pending on `/reservations/pending`
3. **Waiter:** change table status on floor plan; confirm `/reservations/new` blocked
4. **Guest:** `/book` → confirmed with disclaimer
5. **Guest:** party &gt; online limit → pending result
6. **Dev:** enable fail load on `/reservations` → Retry

## UX checklist (core routes)

| Route | Loading | Empty | Error retry | Validation |
|-------|---------|-------|-------------|------------|
| `/login` | — | — | — | Email |
| `/dashboard` | shell | — | — | — |
| `/floor-plan` | load floor | No tables for filter | — | — |
| `/reservations` | skeleton (dev delay) | No rows | Retry (dev fail) | — |
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
| `npm run build` | Production build |

## Mock data disclaimer

All data is fictional. The prototype banner and mock toasts/disclaimers apply — no real reservations, auth, email, SMS, or payments in Phase 1.

Swap mock repos in Phase 3 via `getMockRepositories()` → server APIs (`lib/mock/repositories/index.ts`).
