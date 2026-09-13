# Phase 3 — Operations, Customer, Business

Phase 3 adds admin operations, customer convenience features, and business accounts.

## Database setup

Run in Supabase SQL Editor **after** `schema-phase2.sql`:

```
supabase/schema-phase3.sql
```

This adds:

- `account_type` on profiles (`home` | `business`)
- `addresses` table (saved pickup locations)
- `lat` / `lng` on pickups
- `push_tokens` table (Expo push notifications)

## What's included

### A — Operations

| Feature | Where |
|---------|-------|
| Admin status updates | Web `/admin` — change status, liters, earnings |
| Status notifications | Webhook + Expo push when status changes |
| Real contact | Profile → Help & support (WhatsApp), Call support |

Set env vars on Vercel:

- `ADMIN_API_KEY` — admin dashboard access
- `CONTACT_WHATSAPP` — WhatsApp number (no `+`, e.g. `919876543210`)
- `PICKUP_WEBHOOK_URL` — optional webhook for Slack/Zapier

### B — Customer

| Feature | Where |
|---------|-------|
| Saved addresses | Profile → Saved addresses |
| Forgot password | Login → Forgot password |
| GPS location | Book flow → Use current location |
| Push notifications | Auto-registered on login (Android) |

### C — Business

| Feature | Where |
|---------|-------|
| Business account | Register → "Restaurant / hotel account" |
| Business dashboard | Home banner or Profile → Personal information |
| Bulk booking | Business dashboard → Bulk book (1–10 pickups) |
| Monthly report | Business dashboard — liters, earnings, completed |

## API routes (new)

- `POST /api/auth/reset-password`
- `GET/POST/DELETE /api/me/addresses`
- `POST /api/me/push-token`
- `GET /api/me/report`
- `POST /api/pickup/bulk`
- `PATCH /api/pickup/[id]` — admin only

## Mobile testing

```bash
cd mobile
npm install
npm run start:web    # browser preview on port 19007
```

For APK: GitHub Actions → **Build Android APK** → download artifact.

## Wiring checklist

- [x] Hotel type no longer mapped to commercial
- [x] Bookings filter matches hotel pickups
- [x] Bulk booking requires login
- [x] GPS coords sent with pickup
- [x] Admin PATCH advances status → customer sees update in app
- [x] Push token saved on login → push sent on status change

## Next (Phase D — later)

- Play Store listing
- Production push credentials (FCM)
- In-app maps (Google Maps)
