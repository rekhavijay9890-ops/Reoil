#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/mobile"
ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"

export ANDROID_HOME
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"

install_android_sdk() {
  if [ -x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
    return
  fi

  echo "Installing Android SDK..."
  mkdir -p "$ANDROID_HOME/cmdline-tools"
  TMP_ZIP="/tmp/android-cmdline-tools.zip"

  curl -fsSL "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" -o "$TMP_ZIP"
  unzip -qo "$TMP_ZIP" -d /tmp/android-sdk-tmp
  mv /tmp/android-sdk-tmp/cmdline-tools "$ANDROID_HOME/cmdline-tools/latest"
  rm -rf /tmp/android-sdk-tmp "$TMP_ZIP"

  yes | sdkmanager --licenses >/dev/null || true
  sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
}

install_android_sdk

cd "$MOBILE_DIR"
cp -n .env.example .env 2>/dev/null || true
npx expo prebuild --platform android --clean --no-install
cd android
./gradlew assembleDebug

APK_PATH="$MOBILE_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
OUTPUT_PATH="$ROOT_DIR/reoil-debug.apk"
cp "$APK_PATH" "$OUTPUT_PATH"
echo ""
echo "APK ready: $OUTPUT_PATH"
