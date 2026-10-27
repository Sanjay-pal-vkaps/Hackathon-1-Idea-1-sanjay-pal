# Full regression pass (T4)

Use after a staging or production deploy, or before a demo freeze.

**Automated gate (local or CI):**

```bash
npm run verify
```

**Live URL:** ___________________  
**Date / tester:** ___________________  
**Supabase project:** ___________________ (staging vs prod)

---

## A — Release smoke ([`SMOKE_CHECKLIST.md`](SMOKE_CHECKLIST.md))

Copy sections A–E from `SMOKE_CHECKLIST.md` and tick on the deployed URL:

- [ ] Staff login, dashboard, reservations, pending approve, floor plan, settings, sign out
- [ ] Guest `/book` without login (slots + submit)
- [ ] Customer register / login / my-bookings / account (I2 migration applied)
- [ ] Session conflict understood (separate browser profiles)
- [ ] `npm run build` / `npm start` OR production host healthy

---

## B — Core UX (staff)

| Route | Pass |
|-------|------|
| `/login` — email validation | |
| `/dashboard` — KPIs load | |
| `/floor-plan` — filter empty state if needed | |
| `/reservations` — list + filters | |
| `/reservations/new` — validation (Manager+) | |
| `/reservations/[id]` — detail actions | |
| `/reservations/pending` — approve flow | |
| `/customers` — search | |
| `/schedule` — day view | |
| `/activity` — live feed | |
| `/settings` — save (role-dependent) | |
| Waiter — floor status only; forbidden routes | |

---

## C — Guest & customer

| Route | Pass |
|-------|------|
| `/book` — wizard + validation | |
| `/book/register` | |
| `/book/login` | |
| `/book/account` | |
| `/book/my-bookings` | |
| `/book/link/[token]` — valid / invalid token | |

---

## D — Permissions matrix (quick)

| Role | Floor layout edit | New reservation | Settings write | `/staff` |
|------|-------------------|-----------------|----------------|----------|
| Owner | | | | |
| Manager | | | | |
| Waiter | | | | |

---

## E — Out of scope (confirm still skipped)

- [ ] Guest email on book / approve / reject when `RESEND_API_KEY` set (or server log when unset)
- [ ] No payments (expected)

---

## Sign-off

- [ ] **Regression complete** — issues logged below or none

**Issues / notes:**

```
```
