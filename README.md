# Reoil

Used cooking oil collection — web app + Android mobile app for booking oil pickups.

## Web app

```bash
npm install
npm run dev
```

Open [http://localhost:4318](http://localhost:4318)

## Mobile app (Android)

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

Scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator.

### API connection

The mobile app calls the Next.js API. Start the web server first:

```bash
npm run dev
```

Set `EXPO_PUBLIC_API_URL` in `mobile/.env`:

| Device | API URL |
|--------|---------|
| Android emulator | `http://10.0.2.2:4318` |
| Physical phone (same Wi-Fi) | `http://YOUR_COMPUTER_IP:4318` |
| Production | `https://your-deployed-url.vercel.app` |

### Build test APK

```bash
npm run mobile:apk
```

Output: `reoil-debug.apk` in the project root. Transfer to your Android phone and install (enable "Install unknown apps" if prompted).

Alternative with Expo cloud build:

```bash
cd mobile
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

## Project structure

```
src/                 Next.js web app
mobile/              Expo React Native app
mobile/app/          Mobile screens (home + schedule)
data/pickups.json    Saved pickup requests (created at runtime)
```

## Features

- Landing page with impact stats and how-it-works steps
- Pickup booking form (web + mobile)
- Shared API at `/api/pickup` with CORS for mobile
- Pickup requests saved to `data/pickups.json`
