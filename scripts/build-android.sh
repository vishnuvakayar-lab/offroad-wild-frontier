#!/usr/bin/env bash
# Builds a DEBUG Android APK by wrapping dist/ in a Capacitor 7 shell. Needs JDK 21 + Android SDK (platform 35, build-tools 35).
# Usage: ANDROID_HOME=/path/to/sdk scripts/build-android.sh   -> release/offroad-wild-frontier-<version>-debug.apk
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd); V=$(node -p "require('$ROOT/package.json').version"); W=${NATIVE_DIR:-$ROOT/../owf-native}
: "${ANDROID_HOME:?set ANDROID_HOME to the Android SDK}"
(cd "$ROOT" && npm run build)
mkdir -p "$W" && cd "$W"
[ -f package.json ] || echo '{"name":"owf-native","private":true,"version":"'"$V"'","type":"module"}' > package.json
[ -d node_modules/@capacitor/android ] || npm i -s @capacitor/core@7 @capacitor/cli@7 @capacitor/android@7
cp "$ROOT/native/capacitor.config.json" . && rm -rf www && cp -r "$ROOT/dist" www
[ -d android ] || npx cap add android
npx cap sync android
CODE=$(echo "$V" | awk -F. '{print $1*10000+$2*100+$3}')
sed -i -E "s/versionName \"[^\"]+\"/versionName \"$V\"/; s/versionCode [0-9]+/versionCode $CODE/" android/app/build.gradle
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
(cd android && ./gradlew assembleDebug --no-daemon -q)
mkdir -p "$ROOT/release" && cp android/app/build/outputs/apk/debug/app-debug.apk "$ROOT/release/offroad-wild-frontier-$V-debug.apk"
echo "APK: $ROOT/release/offroad-wild-frontier-$V-debug.apk"
