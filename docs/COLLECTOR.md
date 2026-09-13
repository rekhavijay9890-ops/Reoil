# Delivery staff (collector) — built into the Reoil app

Delivery boys use the **same Reoil APK** as customers. They sign in via a separate staff login.

## How to sign in

1. Open the **Reoil** app
2. On the login screen, tap **🚚 Delivery staff login**
3. Enter phone + password (created by admin)

Staff see **Jobs** and **Profile** tabs — not the customer home/bookings screens.

## Admin setup

### 1. Run SQL (if not done)
```
supabase/schema-phase5.sql
```

### 2. Create collector account
**Admin dashboard** → **Delivery staff** → add name, phone, password

### 3. Assign pickup
Pick a collector → set status **assigned** → Save

## Collector workflow

```
assigned → Verify GPS nearby → Start trip → on_the_way
on_the_way → Verify GPS nearby → Enter liters → collected
Admin → completed (customer paid)
```

## Location verification (how delivery boy is verified)

The delivery boy must be **within 300 m** of the customer's pinned GPS location to:

- **Start trip** (when status is assigned)
- **Mark collected** (when status is on_the_way)

The app shows live distance: *"You are 150 m from pickup"* / *"✓ At pickup location"*

**Requirements:**
- Customer must book with **GPS pinned** (Use current location in book flow)
- Collector must allow **location permission** on their phone
- Server validates GPS on every action (cannot be faked from app alone)

Run `supabase/schema-phase6.sql` to store verification audit (optional).

Change radius on Vercel: `COLLECTOR_PROXIMITY_METERS=300` (default 300 m)

## Features in staff mode

- List of assigned jobs
- Live distance to customer
- Open address in **Google Maps**
- **Call customer**
- **Verify & start trip** / **Verify & mark collected** (only when nearby)

## Note

The separate `collector/` folder in the repo is deprecated — everything runs inside `mobile/` now. One APK for both customers and delivery staff.
