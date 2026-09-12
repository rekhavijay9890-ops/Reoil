#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/mobile"
ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"

export ANDROID_HOME
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"

if [ -d "/usr/lib/jvm/java-17-openjdk-amd64" ]; then
  export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
elif [ -d "/usr/lib/jvm/java-21-openjdk-amd64" ]; then
  export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
fi

export GRADLE_OPTS="-Xmx3g -XX:MaxMetaspaceSize=512m -Dorg.gradle.daemon=false"

install_android_sdk() {
  if [ -x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
    return
  fi

  echo "Installing Android SDK to $ANDROID_HOME ..."
  mkdir -p "$ANDROID_HOME/cmdline-tools"
  TMP_ZIP="/tmp/android-cmdline-tools.zip"

  curl -fsSL "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" -o "$TMP_ZIP"
  unzip -qo "$TMP_ZIP" -d /tmp/android-sdk-tmp
  mv /tmp/android-sdk-tmp/cmdline-tools "$ANDROID_HOME/cmdline-tools/latest"
  rm -rf /tmp/android-sdk-tmp "$TMP_ZIP"

  yes | sdkmanager --licenses >/dev/null || true
  sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
}

patch_android_project() {
  local GRADLE_PROPS="$MOBILE_DIR/android/gradle.properties"
  local LOCAL_PROPS="$MOBILE_DIR/android/local.properties"

  echo "sdk.dir=${ANDROID_HOME}" > "$LOCAL_PROPS"

  if [ -f "$GRADLE_PROPS" ]; then
    sed -i 's/reactNativeArchitectures=.*/reactNativeArchitectures=arm64-v8a/' "$GRADLE_PROPS" 2>/dev/null || \
      echo "reactNativeArchitectures=arm64-v8a" >> "$GRADLE_PROPS"
    sed -i 's/org.gradle.jvmargs=.*/org.gradle.jvmargs=-Xmx3g -XX:MaxMetaspaceSize=512m/' "$GRADLE_PROPS" 2>/dev/null || true
  fi
}

install_android_sdk

echo "Java: $(java -version 2>&1 | head -1)"
echo "ANDROID_HOME: $ANDROID_HOME"

cd "$MOBILE_DIR"
export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-https://reoil-ten.vercel.app}"
echo "EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL" > .env
echo "API URL for this APK: $EXPO_PUBLIC_API_URL"

echo "Running expo prebuild..."
npx expo prebuild --platform android --clean --no-install

patch_android_project

echo "Building standalone RELEASE APK (JS bundled inside)..."
cd android
if ! ./gradlew assembleRelease --no-daemon --stacktrace 2>&1 | tee /tmp/gradle-build.log; then
  echo ""
  echo "========== BUILD FAILED =========="
  grep -iE "error:|FAILED|Exception|What went wrong" /tmp/gradle-build.log | tail -20
  exit 1
fi

APK_PATH="$MOBILE_DIR/android/app/build/outputs/apk/release/app-release.apk"
OUTPUT_PATH="$ROOT_DIR/reoil.apk"

if [ ! -f "$APK_PATH" ]; then
  echo "APK not found at $APK_PATH"
  exit 1
fi

cp "$APK_PATH" "$OUTPUT_PATH"
echo ""
echo "Standalone APK ready: $OUTPUT_PATH"
ls -lh "$OUTPUT_PATH"
