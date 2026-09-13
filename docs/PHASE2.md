# Phase 2 — Login & real data

## What's new

- **Login / Register** with phone + password
- **Real pickup history** linked to your account
- **Live earnings & impact stats** from your bookings
- **Pickup tracking** timeline screen
- **Fixed bottom tab bar** — no overlap with Android navigation buttons

## One-time Supabase setup

Run this in **Supabase → SQL Editor** (after `schema.sql`):

```sql
-- Copy contents of supabase/schema-phase2.sql and Run
```

This creates the `profiles` table and adds `status`, `earnings_inr`, etc. to `pickups`.

## Vercel env vars

Add to Vercel (if not already set):

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Database |
| `SUPABASE_SERVICE_ROLE_KEY` | Server API |
| `ADMIN_KEY` | Admin dashboard |
| `CUSTOMER_AUTH_SECRET` | Mobile login tokens (optional; uses ADMIN_KEY if unset) |

Redeploy after adding env vars.

## Mobile app flow

1. Splash → **Login** (or Register)
2. Home shows **your** impact & upcoming pickup
3. Book pickup → saved to **your account**
4. Bookings / Earnings tabs show **real data**
5. Tap **Track** to see pickup status timeline

## Admin: update pickup status

In Supabase **Table Editor → pickups**, edit `status`:

`pending` → `confirmed` → `assigned` → `on_the_way` → `collected` → `completed`

When status is `completed`, set `earnings_inr` and `liters_estimated` for accurate earnings.

## Test locally

```bash
# Run schema-phase2.sql in Supabase first
cd mobile
npm install
npm run start:web
```

Register a new account in the app, book a pickup, then check Supabase `pickups` table for `profile_id`.
