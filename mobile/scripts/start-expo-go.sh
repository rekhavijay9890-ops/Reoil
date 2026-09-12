#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Live API — works from any phone on mobile data or Wi-Fi
echo "EXPO_PUBLIC_API_URL=https://reoil-ten.vercel.app" > .env

echo "API: https://reoil-ten.vercel.app"
echo ""
echo "Starting Expo Go (tunnel mode)..."
echo "1. Install Expo Go on your phone (Play Store / App Store)"
echo "2. Scan the QR code shown below"
echo ""

npx expo start --tunnel
