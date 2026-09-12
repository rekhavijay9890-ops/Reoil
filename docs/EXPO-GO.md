# Test Reoil in Expo Go

## GitHub Codespace (recommended when tunnel fails)

Ngrok tunnel (`--tunnel`) often fails in Codespaces. Use **port forwarding** instead:

```bash
cd mobile
echo "EXPO_PUBLIC_API_URL=https://reoil-ten.vercel.app" > .env

export EXPO_PACKAGER_PROXY_URL="https://${CODESPACE_NAME}-8081.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

npx expo start --port 8081
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
