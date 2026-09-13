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
assigned → Start trip → on_the_way
on_the_way → Enter liters → collected
Admin → completed (customer paid)
```

## Features in staff mode

- List of assigned jobs
- Open address in **Google Maps**
- **Call customer**
- **Start trip** / **Mark collected**

## Note

The separate `collector/` folder in the repo is deprecated — everything runs inside `mobile/` now. One APK for both customers and delivery staff.
