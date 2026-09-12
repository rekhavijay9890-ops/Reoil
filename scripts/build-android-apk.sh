#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/mobile"
ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"

export ANDROID_HOME
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"

# Prefer Java 17 for Android builds (Java 21 often breaks Gradle config)
if [ -d "/usr/lib/jvm/java-17-openjdk-amd64" ]; then
  export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
elif [ -d "/usr/lib/jvm/java-17-amazon-corretto" ]; then
  export JAVA_HOME="/usr/lib/jvm/java-17-amazon-corretto"
fi

export GRADLE_OPTS="-Xmx3g -XX:MaxMetaspaceSize=512m -Dorg.gradle.daemon=false"
export JAVA_TOOL_OPTIONS="-Xmx3g"

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

  # Required — without this Gradle fails in ~11s with a cryptic stack trace
  echo "sdk.dir=${ANDROID_HOME}" > "$LOCAL_PROPS"
  echo "Created local.properties → sdk.dir=${ANDROID_HOME}"

  if [ ! -f "$GRADLE_PROPS" ]; then
    return
  fi

  # arm64 only — faster, less RAM
  sed -i 's/reactNativeArchitectures=.*/reactNativeArchitectures=arm64-v8a/' "$GRADLE_PROPS" 2>/dev/null || \
    echo "reactNativeArchitectures=arm64-v8a" >> "$GRADLE_PROPS"

  # More memory for Codespaces
  sed -i 's/org.gradle.jvmargs=.*/org.gradle.jvmargs=-Xmx3g -XX:MaxMetaspaceSize=512m/' "$GRADLE_PROPS" 2>/dev/null || true
}

install_android_sdk

echo "Java: $(java -version 2>&1 | head -1)"
echo "ANDROID_HOME: $ANDROID_HOME"

cd "$MOBILE_DIR"
cp -n .env.example .env 2>/dev/null || true

echo "Running expo prebuild..."
npx expo prebuild --platform android --clean --no-install

patch_android_project

echo "Building APK..."
cd android
if ! ./gradlew assembleDebug --no-daemon --stacktrace 2>&1 | tee /tmp/gradle-build.log; then
  echo ""
  echo "========== BUILD FAILED — root cause (searching log) =========="
  grep -iE "error:|FAILED|Exception|What went wrong|SDK location" /tmp/gradle-build.log | tail -20
  echo "=============================================================="
  exit 1
fi

APK_PATH="$MOBILE_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
OUTPUT_PATH="$ROOT_DIR/reoil-debug.apk"

if [ ! -f "$APK_PATH" ]; then
  echo "APK not found at $APK_PATH"
  exit 1
fi

cp "$APK_PATH" "$OUTPUT_PATH"
echo ""
echo "APK ready: $OUTPUT_PATH"
ls -lh "$OUTPUT_PATH"
