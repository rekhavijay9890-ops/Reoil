#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/mobile"
ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"

export ANDROID_HOME
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"
export GRADLE_OPTS="-Xmx3g -XX:MaxMetaspaceSize=512m -Dorg.gradle.daemon=false"
export JAVA_TOOL_OPTIONS="-Xmx3g"

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

patch_gradle_for_codespaces() {
  local GRADLE_PROPS="$MOBILE_DIR/android/gradle.properties"

  if [ ! -f "$GRADLE_PROPS" ]; then
    return
  fi

  # Build only arm64 — faster, less RAM, works on all modern Android phones
  grep -q "reactNativeArchitectures" "$GRADLE_PROPS" || \
    echo "reactNativeArchitectures=arm64-v8a" >> "$GRADLE_PROPS"

  grep -q "org.gradle.jvmargs" "$GRADLE_PROPS" || \
    echo "org.gradle.jvmargs=-Xmx3g -XX:MaxMetaspaceSize=512m" >> "$GRADLE_PROPS"

  grep -q "org.gradle.parallel" "$GRADLE_PROPS" || \
    echo "org.gradle.parallel=true" >> "$GRADLE_PROPS"
}

install_android_sdk

cd "$MOBILE_DIR"
cp -n .env.example .env 2>/dev/null || true

echo "Running expo prebuild..."
npx expo prebuild --platform android --clean --no-install

patch_gradle_for_codespaces

echo "Building APK (arm64 only)..."
cd android
./gradlew assembleDebug --no-daemon --stacktrace 2>&1 | tee /tmp/gradle-build.log

APK_PATH="$MOBILE_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
OUTPUT_PATH="$ROOT_DIR/reoil-debug.apk"

if [ ! -f "$APK_PATH" ]; then
  echo ""
  echo "BUILD FAILED — last 40 lines of log:"
  tail -40 /tmp/gradle-build.log
  exit 1
fi

cp "$APK_PATH" "$OUTPUT_PATH"
echo ""
echo "APK ready: $OUTPUT_PATH"
ls -lh "$OUTPUT_PATH"
