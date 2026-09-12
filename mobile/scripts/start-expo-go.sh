#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "EXPO_PUBLIC_API_URL=https://reoil-ten.vercel.app" > .env
echo "API: https://reoil-ten.vercel.app"
echo ""

# GitHub Codespace: ngrok tunnel often fails — use port forwarding instead
if [ -n "${CODESPACE_NAME:-}" ] && [ -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]; then
  PORT=8081
  PROXY_URL="https://${CODESPACE_NAME}-${PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"

  echo "Codespace detected — using port forwarding (no ngrok tunnel)."
  echo ""
  echo "1. After Metro starts, open the PORTS tab (bottom panel)"
  echo "2. Find port ${PORT} → right-click → Port Visibility → Public"
  echo "3. Open Expo Go on your phone → Scan QR code"
  echo ""
  echo "Proxy URL: ${PROXY_URL}"
  echo ""

  export EXPO_PACKAGER_PROXY_URL="${PROXY_URL}"
  export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
  export REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

  npx expo start --port "${PORT}"
  exit 0
fi

echo "Starting Expo Go (tunnel mode)..."
echo "1. Install Expo Go on your phone"
echo "2. Scan the QR code below"
echo ""

if npx expo start --tunnel; then
  exit 0
fi

echo ""
echo "Tunnel failed. Try port forwarding mode manually:"
echo "  EXPO_PACKAGER_PROXY_URL=https://YOUR-HOST-8081.app.github.dev npx expo start --port 8081"
