# Test the new app UI (when Codespace Metro fails)

If `npm run start:codespace` shows a server error, use one of these instead.

## Option 1: Browser preview (easiest in Codespace)

Works without Expo Go or a phone.

```bash
cd /workspaces/Reoil/mobile
git pull origin main
npm install
npm run start:web
```

Then:

1. Open the **PORTS** tab
2. Find port **19007** → set visibility to **Public**
3. Open the forwarded URL in your browser (Chrome mobile view: F12 → phone icon)

You can click through splash, tabs, booking flow, and confirmation in the browser.

---

## Option 2: Download APK from GitHub Actions

Builds the real Android app in the cloud — install on your phone.

1. Open https://github.com/rekhavijay9890-ops/Reoil/actions
2. Click **Build Android APK**
3. Click **Run workflow** → **Run workflow**
4. Wait ~15–25 minutes for a green checkmark
5. Open the run → **Artifacts** → download **reoil-apk**
6. Install `reoil.apk` on your Android phone

No Codespace or Expo Go needed.

---

## Option 3: Your own computer + Expo Go

If you have Node.js on your laptop:

```bash
git clone https://github.com/rekhavijay9890-ops/Reoil.git
cd Reoil/mobile
npm install
npx expo start --tunnel
```

Scan the QR code with **Expo Go** on your phone. Tunnel works better from a local machine than Codespace.

---

## Option 4: Android emulator on your PC

```bash
cd Reoil/mobile
npm install
npx expo start
# Press 'a' to open Android emulator (requires Android Studio)
```

---

## Quick comparison

| Method | Needs phone? | Needs Codespace? |
|--------|--------------|------------------|
| Browser (`start:web`) | No | Yes (or local PC) |
| GitHub Actions APK | Yes (Android) | No |
| Expo Go + tunnel | Yes | No (use laptop) |
| Android emulator | No | No (needs Android Studio) |
