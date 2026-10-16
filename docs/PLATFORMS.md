# Platforms — OFFROAD: WILD FRONTIER 0.8.0

The game is a web build (Vite + TypeScript, Three.js WebGL, Rapier physics as WebAssembly). Every other platform wraps that same `dist/` folder.
**Real-hardware status: real iPhone NOT TESTED, real Android NOT TESTED, consoles NOT TESTED.** Everything below marked SIMULATED ran in Playwright device emulation on a Linux box with software WebGL (SwiftShader), so the frame rates here are not real-device numbers.

## 1. Web / PWA (shipping)
- Build: `npm ci && npm run build` → `dist/` (relative paths, `base: './'`, so it works from any folder).
- Deploy: copy `dist/` into the gh-pages `preview/` folder only (the root keeps the stable build).
- PWA: `manifest.webmanifest` (relative `start_url`/`scope` `./`, 192/512 icons, landscape, fullscreen) plus `sw.js`, which is generated at build time by the `owf-sw` Vite plugin:
  - It precaches the exact hashed build. The cache name is `owf-<version>-<buildid>`, and old caches are deleted on activate.
  - Page navigations are network-first, so a new deploy shows up. Hashed assets are cache-first.
  - It is registered with `scope: './'`, so under `/preview/` it controls only `/preview/` and never the site root. It also refuses to serve requests outside its scope.
  - Add `?nosw` to the URL to skip registration.
  - It only registers over https or on localhost.
- Requirements: WebGL (2 preferred, 1 accepted) and WebAssembly. Both are checked **before** the 5 MB download, and a clear message is shown if either is missing.

## 2. Android (Capacitor 7). Debug APK built, NOT installed on a device
- Wrapper choice: **Capacitor**. It is the same web code in a system WebView (Chrome-based, so WebGL2, WASM and the Gamepad API are available), it's free and MIT-licensed, and it also produces an iOS project. Cordova was rejected because it is older and its plugins are ageing.
- Built in the box: `release/offroad-wild-frontier-0.8.0-debug.apk`, about 6.3 MB.
  - Package `com.vishnu.offroadwild`, versionName 0.8.0 / versionCode 800, minSdk 23, targetSdk 35.
  - Signed with the auto-generated **debug** key (sideload only).
  - It was not run on an emulator or a phone (no device or KVM in the box): **NOT TESTED**.
- Rebuild:
  - `ANDROID_HOME=/path/to/sdk scripts/build-android.sh`
  - Needs JDK 21, Android SDK cmdline-tools, `platforms;android-35` and `build-tools;35.0.0`. Gradle 8.11 downloads itself.
- Release signing:
  - Create a keystore: `keytool -genkeypair -v -keystore owf-release.jks -alias owf -keyalg RSA -keysize 2048 -validity 10000`.
  - Keep the keystore **out of git**.
  - Add a `signingConfigs.release` block in `android/app/build.gradle` that reads the passwords from environment variables, then run `./gradlew bundleRelease` to get an `.aab` for Google Play.
- Account and store:
  - A Google Play Console developer account costs a one-time USD 25. New personal accounts must run a closed test with at least 12 testers for 14 days before production.
  - Store needs: target API level within a year of the latest, a Data safety form, a content rating questionnaire, a privacy policy URL (the online mode sends a player name and inputs to the game server), and a 512 px icon, feature graphic and screenshots.
- Notes: lock to landscape in `AndroidManifest.xml` (`android:screenOrientation="sensorLandscape"`) if wanted. Gamepads over Bluetooth work through the WebView's Gamepad API.

## 3. iOS (Capacitor). Documented only, NOT BUILT, NOT TESTED
- Requires macOS + Xcode 16+. Steps: `npm i @capacitor/ios@7 && npx cap add ios && npx cap open ios`, then archive in Xcode.
- Apple Developer Program costs USD 99/year, and TestFlight is used for beta testing.
- App Review guideline 4.2 (minimum functionality) means a wrapped website must feel like an app. This game is fully offline-capable once cached, which helps.
- WKWebView on iOS 15+ supports WebGL2 and WASM. The Gamepad API works with MFi, Xbox and PlayStation pads. There is **no vibration** for web content (rumble is silently ignored), and there is no Vibration API.
- As a no-build alternative, iPhone users can use Safari → Share → Add to Home Screen (PWA, fullscreen).

## 4. Desktop. Evaluated, not built
| Option | Size | Pros | Cons |
|---|---|---|---|
| **Tauri 2** (recommended) | ~5–10 MB | Small, uses the OS WebView, free signing on Linux | Linux WebKitGTK WebGL performance varies; needs Rust toolchain; macOS notarization needs the USD 99 Apple account; Windows code-signing certificate is paid (optional, SmartScreen warnings without) |
| Electron | ~90 MB+ | Same Chromium everywhere, so the game behaves exactly as in Chrome | Large download, more memory |
| PWA install (Chrome/Edge "Install app") | 0 | Already works from `/preview/` | Browser-dependent |
Steam: Steamworks costs USD 100 per app; ship the Electron or Tauri build there.

## 5. Consoles. NOT TESTED, not buildable here
- Xbox: the Edge browser on Xbox runs WebGL and gamepads, so the web build may run there (NOT TESTED). A Store release needs ID@Xbox (application + dev kit or Dev Mode) and UWP/WebView2 packaging.
- PlayStation / Nintendo Switch: these require a registered developer, NDA'd SDKs and dev kits, and a native engine port. There is no web wrapper route. They are out of scope for this codebase without a commercial engine port.
- What is already console-ready in the game:
  - Full gamepad play (standard mapping).
  - D-pad/stick menu navigation with a visible focus ring, A to press, B/Start to go back.
  - Rumble through `vibrationActuator` where available.
  - No mouse required anywhere in menus.

## 6. Controls reference
- Keyboard (rebindable in Settings → Keyboard bindings): W/↑ gas, S/↓ brake/reverse, A/D or ←/→ steer, Space handbrake, C camera, B look back, V reset camera, R reset vehicle, Esc/P pause.
- Gamepad (standard mapping):
  - Left stick steers. RT is gas and LT is brake/reverse.
  - A is handbrake, Y camera, X reset vehicle, RB look back (hold), Back reset camera, Start pause.
  - The D-pad navigates menus.
  - Dead zone and sensitivity are in Settings.
- Touch: the rotational steering wheel (default), GAS and BRAKE/REV pedals, HB, Reset, and the camera, look-back and camera-reset buttons. Optional schemes: buttons, tilt (off by default), halves.
- Device arbitration: the most recently *changed* device drives the car (keys, touch or pad). Inputs are never summed, and a resting or drifting gamepad never takes over.
