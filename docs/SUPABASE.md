# Supabase setup guide for Reoil

Reoil uses Supabase to store pickup requests in production. **No customer login** — users book as guests. Only you use the **admin dashboard** to view bookings.

---

## Step 1 — Create a free Supabase account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign in with GitHub (easiest)

---

## Step 2 — Create a new project

1. Click **New project**
2. Fill in:
   - **Name:** `reoil`
   - **Database password:** choose a strong password (save it somewhere safe)
   - **Region:** pick closest to your users (e.g. Southeast Asia / US East)
3. Click **Create new project**
4. Wait 1–2 minutes for the project to finish setting up

---

## Step 3 — Create the pickups table

1. In your Supabase project, open **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the entire contents of `supabase/schema.sql` from this repo
4. Paste into the editor
5. Click **Run**

You should see: `Success. No rows returned`

---

## Step 4 — Get your API keys

1. Open **Project Settings** (gear icon, bottom left)
2. Click **API** under Configuration
3. Copy these two values:

| Setting | Where to find | Example |
|---------|---------------|---------|
| **Project URL** | Project URL field | `https://abcdefgh.supabase.co` |
| **service_role key** | `service_role` under Project API keys | `eyJhbGciOiJIUzI1NiIs...` |

**Important:** Use the **service_role** key (not `anon`). It stays on your server only — never put it in the mobile app or commit to GitHub.

---

## Step 5 — Add keys to your app

### Local / Codespace

Create or edit `.env` in the project root:

```bash
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
ADMIN_KEY=your-secret-admin-password
```

Restart the dev server:

```bash
npm run dev
```

### Vercel (production)

1. Open your project on [vercel.com](https://vercel.com)
2. Go to **Settings → Environment Variables**
3. Add:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | Your project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key |
| `ADMIN_KEY` | Your admin password |

4. Redeploy the app

---

## Step 6 — Test it works

### Test booking (customer — no login)

1. Open your app: `http://localhost:4318/schedule`
2. Fill in the form and submit
3. In Supabase → **Table Editor** → **pickups** — you should see the new row

### Test admin dashboard

1. Open: `http://localhost:4318/admin`
2. Enter your `ADMIN_KEY`
3. Click **Load pickups**
4. You should see the booking you just submitted

---

## Step 7 — Mobile app (Expo Go)

Set the API URL in `mobile/.env`:

```bash
# Local Codespace — use your public port 4318 URL
EXPO_PUBLIC_API_URL=https://your-codespace-4318.app.github.dev

# Production — use your Vercel URL
EXPO_PUBLIC_API_URL=https://your-reoil-app.vercel.app
```

Restart Expo:

```bash
cd mobile && npx expo start --tunnel
```

Bookings from the phone go to the same Supabase database.

---

## How storage works

| Environment | `SUPABASE_URL` set? | Storage |
|-------------|---------------------|---------|
| Local dev (no Supabase) | No | `data/pickups.json` |
| Local / production | Yes | Supabase `pickups` table |

---

## Admin dashboard only — no customer login

| Role | Login needed? | How |
|------|---------------|-----|
| Customer | No | Books pickup as guest |
| You (admin) | Yes | `/admin` + `ADMIN_KEY` |

Customers never see the admin page. Protect your `ADMIN_KEY` like a password.

---

## View data in Supabase directly

You can also browse bookings in Supabase without the admin dashboard:

1. Supabase project → **Table Editor**
2. Click **pickups**
3. All customer bookings are listed with name, phone, email, address, etc.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Failed to save pickup` | Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env` |
| `relation "pickups" does not exist` | Run `supabase/schema.sql` in SQL Editor |
| Admin shows "Invalid admin key" | `ADMIN_KEY` in `.env` must match what you type in `/admin` |
| Mobile booking fails | Set `EXPO_PUBLIC_API_URL` to your live API URL |
| Data not in Supabase | Restart `npm run dev` after adding `.env` |

---

## Security checklist

- [ ] `service_role` key only in server `.env` / Vercel env vars — never in mobile app
- [ ] `ADMIN_KEY` is a long random string (not `password123`)
- [ ] `.env` is in `.gitignore` (already configured)
- [ ] RLS is enabled on `pickups` table (schema.sql does this)
