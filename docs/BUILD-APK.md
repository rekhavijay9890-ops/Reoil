# Build the Android APK on GitHub

You have two ways to build `reoil.apk` yourself — no Expo Go needed on the phone.

## Option 1: GitHub Actions (recommended)

Build in the cloud and download the APK from GitHub.

1. Open your repo: https://github.com/rekhavijay9890-ops/Reoil
2. Click **Actions** (top menu)
3. Click **Build Android APK** in the left sidebar
4. Click **Run workflow** → **Run workflow** (green button)
5. Wait about 15–25 minutes for the job to finish (green checkmark)
6. Open the completed run → scroll to **Artifacts** → download **reoil-apk**
7. Unzip if needed — inside is `reoil.apk`
8. Copy to your Android phone and install (allow “Install from unknown sources” if asked)

The workflow also runs automatically when you push changes to `mobile/` on `main`.

### Change API URL for the APK

Edit the workflow file `.github/workflows/build-apk.yml` and change:

```yaml
EXPO_PUBLIC_API_URL: https://reoil-ten.vercel.app
```

Or set a GitHub **repository variable** and reference it in the workflow.

---

## Option 2: GitHub Codespace (terminal)

Build inside your Codespace — same script GitHub Actions uses.

```bash
cd /workspaces/Reoil
git pull origin main
cd mobile
npm install
cd ..
npm run mobile:apk
```

When finished, the APK is at:

```
/workspaces/Reoil/reoil.apk
```

Download it: right-click `reoil.apk` in the file explorer → **Download**.

**Note:** First build can take 20–30 minutes (downloads Android SDK + Gradle). Later builds are faster.

---

## Option 3: Expo EAS (cloud, optional)

If you prefer Expo’s build service:

```bash
cd mobile
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Update `mobile/eas.json` → `preview.env.EXPO_PUBLIC_API_URL` to your live URL first.

---

## Install on your phone

1. Transfer `reoil.apk` to the phone (USB, Google Drive, etc.)
2. Open the file → **Install**
3. Open **Reoil** — no dev server or Expo Go required

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Actions tab missing | Push `.github/workflows/build-apk.yml` to `main` (pull latest first) |
| Build failed in Actions | Open the failed run → read the red step log |
| APK won’t install | Uninstall old Reoil app first, then install new APK |
| App can’t reach server | Rebuild with correct `EXPO_PUBLIC_API_URL` |
