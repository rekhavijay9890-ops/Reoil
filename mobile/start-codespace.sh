#!/usr/bin/env bash
# Run from mobile folder: bash start-codespace.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "EXPO_PUBLIC_API_URL=https://reoil-ten.vercel.app" > .env

if [ -f ../shared/content.json ]; then
  cp ../shared/content.json ./content.json
  echo "Synced content.json from ../shared/"
fi

if [ -n "${CODESPACE_NAME:-}" ] && [ -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]; then
  export EXPO_PACKAGER_PROXY_URL="https://${CODESPACE_NAME}-8081.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
  export REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
  echo "Codespace proxy: ${EXPO_PACKAGER_PROXY_URL}"
  echo "Set port 8081 to PUBLIC in the PORTS tab, then scan QR in Expo Go."
fi

npx expo start --port 8081 --clear
