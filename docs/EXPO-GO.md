# Test Reoil in Expo Go

## GitHub Codespace (recommended when tunnel fails)

Ngrok tunnel (`--tunnel`) often fails in Codespaces. Use **port forwarding** instead:

```bash
cd mobile
npm install
npm run start:codespace
```

Then:

1. Open the **PORTS** tab at the bottom of VS Code
2. Find port **8081** → right-click → **Port Visibility** → **Public**
3. Open **Expo Go** on your phone → **Scan QR code**

## Local machine or working tunnel

```bash
cd mobile
npm run expo:go
```

Or:

```bash
npx expo start --tunnel
```

## Test checklist

1. Home screen loads
2. Tap **Schedule a pickup**
3. Submit a booking
4. Verify at https://reoil-ten.vercel.app/admin
