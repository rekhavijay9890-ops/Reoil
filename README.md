# Reoil

Used cooking oil collection — web app + Android mobile app for booking oil pickups.

## Features

- Landing page with impact stats and how-it-works steps
- Pickup booking form (web + mobile via Expo Go or APK)
- Admin dashboard at `/admin` to view all pickup requests
- Shared content between web and mobile (`shared/content.json`)
- Optional webhook notifications on new pickups

## Quick start

### Web app

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:4318](http://localhost:4318)

### Mobile (Expo Go — no APK needed)

```bash
# Terminal 1 — API
npm run dev

# Terminal 2 — mobile
cd mobile
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your public API URL
npm install --legacy-peer-deps
npm run start:tunnel
```

Scan the QR code with **Expo Go** on your phone.

### Admin dashboard

1. Set `ADMIN_KEY` in `.env`
2. Open [http://localhost:4318/admin](http://localhost:4318/admin)
3. Enter your admin key and click **Load pickups**

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_KEY` | Production | Protects `/admin` and `GET /api/pickup` |
| `PICKUP_WEBHOOK_URL` | Optional | Webhook called on new pickup (Slack, Zapier, etc.) |
| `EXPO_PUBLIC_API_URL` | Mobile | API base URL (in `mobile/.env`) |

## Build standalone APK

```bash
npm run mobile:apk
```

Output: `reoil.apk` (release build with JS bundled — works without Metro).

Requires Java 17 and Android SDK. See `scripts/build-android-apk.sh`.

## Project structure

```
shared/content.json     Stats, steps, form options (web + mobile)
src/                    Next.js web app
src/app/admin/          Admin pickup dashboard
src/app/api/pickup/     Booking API (POST public, GET admin-only)
data/pickups.json       Saved requests (local dev only)
mobile/                 Expo React Native app
scripts/                APK build script
```

## Production deployment

**Web:** Deploy to Vercel via Publish button or `git push`.

**Important:** File-based storage (`data/pickups.json`) does not persist on serverless hosts. For production you need either:

- A database (Supabase, PlanetScale, etc.)
- Or Vercel Blob / KV

Provide database credentials to wire persistent storage.

**Mobile:** Set `EXPO_PUBLIC_API_URL` in `mobile/.env` (Expo Go) or `mobile/eas.json` (cloud APK builds) to your deployed web URL.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Web dev server (port 4318) |
| `npm run build` | Production web build |
| `npm run mobile` | Start Expo dev server |
| `npm run mobile:apk` | Build standalone Android APK |
