# Local release sign-off

**Branch:** `landing-page` (includes full `backend` stack + premium landing)  
**Date:** 2026-10-27

## Fix `EACCES` on `npm ci` / `next build`

If `node_modules` or `.next` were created as **root** (e.g. Docker or `sudo npm`), fix ownership once:

```bash
cd /var/www/html/Sanju/Hackathon/Idea1
sudo chown -R "$USER:$USER" node_modules .next
rm -rf node_modules .next
npm ci
npm run verify
```

Do **not** run `npm install` with `sudo` in this project.

## Automated (done)

| Check | Command / result |
|-------|------------------|
| Verify gate | `npm run verify` — pass |
| DB I2 + I4 | `npm run db:apply-i2-customer` · `npm run db:apply-i4-links` |
| Demo seed (today’s dates) | `npm run db:generate-seed` · `npm run db:apply-seed` |
| API smoke | `npm run smoke:local` — health, booking APIs, demo link, `/` · `/book` · `/login` |

**Note:** After `db:apply-seed`, demo link token is included in seed SQL. If you only ran an older seed, run `npm run db:apply-i4-links` once.

## Manual browser (you — ~20 min)

Use [`SMOKE_CHECKLIST.md`](SMOKE_CHECKLIST.md):

- Staff flows in **Profile A** (incognito or separate browser)
- Guest/customer in **Profile B**
- Tick each checkbox when done

Optional: [`REGRESSION.md`](REGRESSION.md)

## Email (optional)

Set `RESEND_API_KEY` + `NEXT_PUBLIC_APP_URL` in `.env.local`, then one book + approve/reject from checklist.

## Git

- Release branch: **`landing-page`** (includes `backend` + landing)
- Push: `git push origin landing-page backend`
- Merge into `main` via PR on GitHub if `main` is protected

## Deploy (T2 — not run here)

Follow [`DEPLOY.md`](DEPLOY.md), then repeat smoke against production URL.
