# Reoil Collector App — Delivery staff

A separate mobile app for delivery boys / field collectors who pick up used oil from customers.

## Setup

### 1. Run database migration

In Supabase SQL Editor, run after phase 4:

```
supabase/schema-phase5.sql
```

### 2. Create a collector account

In **Admin dashboard** (`/admin`):
1. Enter admin key → Load pickups
2. Scroll to **Delivery staff**
3. Add name, phone, password → **Add collector**

### 3. Assign pickups

For each booking in admin:
1. Select a **collector** from the dropdown
2. Set status to **assigned**
3. Click **Save changes**

The collector will see the job in their app.

## Collector app flow

```
Admin assigns pickup → status: assigned
        ↓
Collector opens app → sees job
        ↓
Start trip → status: on_the_way (customer notified)
        ↓
Mark collected + enter liters → status: collected
        ↓
Admin sets earnings → status: completed
```

## Run locally

```bash
cd collector
npm install
npm run start:web    # browser preview on port 19008
```

Set API URL in `collector/.env`:

```
EXPO_PUBLIC_API_URL=https://reoil-ten.vercel.app
```

## Build APK

After customer APK workflow, a collector APK can be built the same way using the `collector/` folder. Ask to enable GitHub Actions for `collector/**` when ready.

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/collector/auth/login` | Collector login |
| `GET /api/collector/pickups` | List assigned jobs |
| `PATCH /api/collector/pickup/[id]` | Start trip / mark collected |
| `GET/POST /api/admin/collectors` | Admin: list / create collectors |
