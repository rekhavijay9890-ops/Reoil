# Delivery staff (collector) — built into the Reoil app

Delivery boys use the **same Reoil APK** as customers. They sign in via a separate staff login.

## How delivery boys join (onboarding)

### Self-registration (recommended)

1. Open **Reoil** app → **🚚 Delivery staff login**
2. Tap **New delivery partner? Apply here**
3. Complete 3-step onboarding:
   - Name, phone, city
   - Vehicle type (bike, scooter, van, car)
   - Password
4. Wait for **admin approval** (status: pending)
5. After approval, sign in and see assigned jobs

### Admin-created account

Admin can still add delivery staff manually in **Admin dashboard** → **Delivery staff** (instantly approved).

## How to sign in (after approval)

1. **Reoil** app → **Delivery staff login**
2. Enter phone + password

Staff see **Jobs** and **Profile** tabs — not the customer home/bookings screens.

## Admin setup

### 1. Run SQL (if not done)
```
supabase/schema-phase5.sql
supabase/schema-phase7.sql
```

### 2. Approve applications
**Admin dashboard** → **Pending onboarding** → Approve or Reject

### 3. Or create account manually
**Delivery staff** section → add name, phone, password

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
