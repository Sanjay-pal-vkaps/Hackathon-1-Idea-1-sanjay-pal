# Deploy — staging / production (T2)

**Not scheduled yet** — use this doc when the full project is ready for go-live. Until then, develop and test locally (`npm run dev`, [`SMOKE_CHECKLIST.md`](SMOKE_CHECKLIST.md) on localhost).

Target: **Vercel** + existing **Supabase** project (same migrations as local).

## 1. Supabase (once per project)

1. Apply migrations in order — see [`supabase/README.md`](supabase/README.md).
2. **Authentication → URL configuration**
   - **Site URL:** `https://<your-vercel-domain>` (or custom domain)
   - **Redirect URLs:** add  
     `https://<your-vercel-domain>/auth/callback`  
     (keep `http://localhost:3000/auth/callback` for local dev)
3. Create staff user: `npm run staff:create -- --email … --password … --role owner --name …`

## 2. Vercel project

1. Import the Git repo (GitHub / Origin).
2. Framework preset: **Next.js** (default).
3. **Environment variables** (Production + Preview):

| Variable | Where |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API (publishable / anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API (service role — **server only**) |
| `NEXT_PUBLIC_APP_URL` | `https://<your-vercel-domain>` (booking links in email) |
| `RESEND_API_KEY` | Resend dashboard (guest booking emails) |
| `EMAIL_FROM` | Verified sender in Resend (default sandbox: `onboarding@resend.dev`) |

Optional for DB scripts (local / CI deploy hooks only — **do not** expose on client):

| Variable | Purpose |
|----------|---------|
| `SUPABASE_DB_URL` | `npm run db:apply-*` from your machine |

4. Deploy. CI must pass `npm run verify` on the default branch before you rely on a release.

## 3. Post-deploy smoke

1. `GET https://<domain>/api/health` → `{ "ok": true }`
2. Walk [`SMOKE_CHECKLIST.md`](SMOKE_CHECKLIST.md) against the live URL.
3. Full sign-off: [`REGRESSION.md`](REGRESSION.md).

## Preview deployments

Use the same three Supabase env vars on **Preview** if previews should hit real data (recommended: separate Supabase project for previews).

## Notes

- `/dev/ui` returns 404 in production builds.
- Staff and guest share one Supabase Auth session per browser — test with separate profiles.
- SMS is not configured. Email uses Resend when `RESEND_API_KEY` is set.
