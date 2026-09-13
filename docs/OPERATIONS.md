# Operations guide — tracking pickups end to end

## How a booking flows

```
Customer books (app)  →  status: pending
        ↓
Admin confirms slot   →  status: confirmed   (+ push notification to customer)
        ↓
Collector assigned    →  status: assigned
        ↓
Collector en route    →  status: on_the_way
        ↓
Oil collected         →  status: collected
        ↓
Weighed & paid        →  status: completed  (+ earnings show in app)
```

Customer sees each step in **Bookings** tab and **Track pickup** screen.

## Admin dashboard (monitor all operations)

1. Open **https://reoil-ten.vercel.app/admin**
2. Enter your `ADMIN_KEY` (set in Vercel env vars)
3. Click **Load pickups**

You can:
- See all bookings (newest first)
- Filter by status (pending, confirmed, etc.)
- Change status with the dropdown
- Set **liters weighed** and **earnings ₹** when completing
- Set **agreed rate ₹/L** for negotiable bookings

Summary cards show: total bookings, pending count, liters collected.

## Delivery collector app

A separate app for field staff (`collector/` folder).

1. Admin creates collector accounts in `/admin` → **Delivery staff**
2. Admin assigns a collector + sets status **assigned**
3. Collector logs in on **Reoil Collector** app
4. Collector: Start trip → Mark collected (enters liters)
5. Admin marks **completed** with final earnings

See `docs/COLLECTOR.md` for full setup.

## Status change notifications

When you change status in admin:
- Customer gets a **push notification** (if they logged in on the app)
- A **webhook** fires if `PICKUP_WEBHOOK_URL` is set (Slack, Zapier, etc.)
- WhatsApp link is logged server-side for manual follow-up

## Pricing

Rates are defined in `shared/content.json` under `payout`:

| Type | Default ₹/L | Range |
|------|-------------|-------|
| Home | 12 | ₹10 – ₹14 |
| Hotel | 14 | ₹12 – ₹16 |
| Restaurant | 15 | ₹13 – ₹18 |
| Commercial | 14 | ₹12 – ₹16 |

Customers see the estimated payout when booking. They can toggle **Negotiable price** and propose a rate within the range. Admin sets the **agreed rate** before marking completed.

**Final earnings** = actual liters weighed × agreed rate (set by admin).

## Database setup (required)

Run these in Supabase SQL Editor, in order:

1. `schema.sql`
2. `schema-phase2.sql`
3. `schema-phase3.sql` — addresses, GPS, push tokens
4. `schema-phase4.sql` — negotiable pricing

## Troubleshooting booking failures

If bookings fail with a database error:
- Check all schema files above have been run
- Check Vercel has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase → Table Editor → pickups — booking should appear with status `pending`
