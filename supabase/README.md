# Supabase — Phase 2

## Migrations

| File | Purpose |
|------|---------|
| `migrations/20251027000000_initial_schema.sql` | **B1** — tables, enums, RLS enabled |
| `migrations/20251027100000_staff_rls.sql` | **B2** — staff helpers + RLS policies |
| `migrations/20251027300000_customer_auth.sql` | **I2** — guest accounts + own bookings RLS |
| `migrations/20251027400000_self_service_links.sql` | **I4** — `/book/link/[token]` self-service |
| `seed.sql` | Demo data — same IDs as `lib/mock/fixtures/*` |

Regenerate seed after fixture changes:

```bash
npm run db:generate-seed
```

## Apply (Dashboard SQL Editor)

Run in order:

1. `migrations/20251027000000_initial_schema.sql` (if not already applied)
2. `seed.sql` (if empty)
3. **`migrations/20251027100000_staff_rls.sql`** ← B2 staff login  
4. **`migrations/20251027300000_customer_auth.sql`** ← I2 guest accounts  
5. **`migrations/20251027400000_self_service_links.sql`** ← I4 booking links

Or locally (needs `SUPABASE_DB_URL` in `.env.local`):

```bash
npm run db:apply-b1          # B1 + seed
npm run db:apply-b2-rls      # B2 policies only
```

## B2 — First staff user

After RLS migration, create an Auth user linked to `staff_profiles`:

```bash
npm run staff:create -- --email owner@iturrieta.demo --password 'ChooseAStrongPassword' --role owner --name "Demo Owner"
```

Sign in at `/login`. Staff UI reads/writes **Supabase** via `getRepositories()`. Guest booking uses `/api/booking/*`.

**Deploy:** [`DEPLOY.md`](../DEPLOY.md) — Auth redirect URL and Vercel env vars.

## Env vars

See `.env.example`. Never commit `.env.local`.
