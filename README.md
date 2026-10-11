# OFFROAD: WILD FRONTIER — web-first prototype (Phases 1–3)

Original 3D off-road game. One shared TypeScript codebase targets Web (desktop + mobile browsers) first;
Android/iOS shells come later by wrapping the same build.

## Run
```bash
npm install
npm run dev          # dev server
npm run build        # type-check + production build -> dist/
npm run preview      # serve dist on http://127.0.0.1:4173
npm run test:accept  # Playwright acceptance tests against the preview server (writes screenshots/)
```

## Controls
Desktop: W/↑ throttle · S/↓ brake (hold at standstill = reverse) · A/D or ←/→ steer · Space handbrake · R reset/upright · T cycle weather · M mute · Esc/P pause (skips the intro) · drag mouse to look.
Mobile: ◀ ▶ steer (left thumb) · GAS / BRAKE / HB (right thumb) · ❚❚ pause · drag the view to look. Multi-touch supported.

## Phase 1 — engine choice
| Layer | Choice | Why |
|---|---|---|
| Rendering | **Three.js** (r186, WebGL2) | Smallest runtime of the mature web 3D engines, excellent mobile Safari/Chrome support, full control over a scalable render pipeline (presets, shadows, pixel ratio). |
| Physics | **Rapier 3D** (`@dimforge/rapier3d-compat`, WASM) | Fast deterministic WASM physics with a built-in raycast vehicle controller (suspension, friction slip, brakes); the same library runs in Node, so a future authoritative server can simulate the same vehicles. |
| Tooling | **Vite + TypeScript** | Fast builds, static `dist/` deployable anywhere. |
| Native shells (later) | **Capacitor** | Wraps the same `dist/` into Android (Gradle/APK/AAB) and iOS (Xcode) projects. |
| Multiplayer (Phase 7) | **Colyseus** (Node) + Rapier on the server | Rooms, matchmaking, private rooms, reconnection tokens; server-authoritative state. |

Babylon.js was the main alternative (more batteries-included) but is heavier to download on mobile; Unity/Godot web exports are much larger and slower to start on iPhone Safari.

### Platform limitations (honest)
- **iOS app build**: needs macOS + Xcode + an Apple Developer account/signing certificate. The build box is Linux, so an `.ipa` cannot be produced here. iPhone players can use Safari now (and "Add to Home Screen").
- **Android APK/AAB**: needs JDK 17+ and the Android SDK (not installed on the box yet; installable later). Play Store release needs a signing keystore and a Play Console account.
- **iOS Safari**: WebGL2 is supported on iOS 15+; low-power mode and thermal throttling cap FPS; no fullscreen API on iPhone (safe-area handled via `viewport-fit=cover`).
- **Testing here** uses headless Chrome with SwiftShader (CPU software rendering), so FPS numbers are not representative of real phones/GPUs.

## What's in Phases 2–3
- Loading screen, responsive main menu (side card on landscape/desktop, bottom card on portrait), settings drawer (side / bottom sheet) with Low/Medium/High graphics presets, touch-control mode, FPS toggle. Menus are partial panels, never full-screen. Safe-area insets, rotation and resize handled.
- One original procedural 4×4 (no licensed/trademarked assets) on Rapier raycast-vehicle physics: 4 wheels, spring/damper suspension, 4WD, speed-sensitive steering, brakes, reverse, handbrake (rear lock + reduced rear grip).
- 320 m test map: flat dirt spawn, sunken **mud** basin (low grip + strong drag, wheel-spin, dark tyre tracks, puddles), **sand** area (medium grip/drag, wheel-spin, tracks, dunes), rolling hills, rocky rim, trees and rocks with colliders, boundary walls.
- Smoothed chase camera with drag-to-look that re-centres.

## Phase 4 — presentation, audio, effects
- **Audio** (`src/audio.ts`, Web Audio, fully procedural): engine = saw + square sub-oscillator through soft-clip and a throttle-opened low-pass, pitch from RPM of a 6-speed auto gearbox model (RPM also flares with wheel slip); wind (speed/weather dependent), rain, birds by day / crickets at night; surface layers (dirt rumble, sand hiss, randomly modulated mud squelch); puddle splash bursts. The AudioContext is created only inside the first user gesture (pointer/touch/key) and a silent buffer is played to unlock iOS; suspends when the tab is hidden. Volume slider, mute checkbox, HUD mute button (M).
- **Particles** (`src/particles.ts`): soft GPU points with CPU simulation — mud droplets (gravity, ground bounce), dust/sand plumes (rise and grow), water splashes. Emission per wheel scales with measured wheel slip and speed; budget scales with preset (Low 35 %, Medium 70 %, High 100 %); tinted per weather.
- **Puddles**: 8 real terrain depressions (0.5 m deep) with water surfaces; extra drag in water, splash burst + sound on entry, spray while driving through.
- **Tyre tracks**: continuous ribbon strips per wheel (ring buffer of 4000 joined quads) instead of separate stamps.
- **Weather/time** (`src/weather.ts`): Clear day, Sunset dunes (low sun, sun disc in sky), Dense fog, Rain (shader-animated streaks, wet/glossy ground and paint), Night (stars, moonlight, headlights incl. a shadow-casting centre beam on Medium/High). Selectable in Settings and via the HUD quick button / T key.
- **Cinematic**: ~7.6 s letter-boxed intro on Play (high flyover → low vehicle showcase with title → swing into chase cam); skippable by button, any key, or tap; can be disabled in Settings. Chase camera now has speed-based FOV and distance, look-ahead, speed-dependent heading smoothing, terrain avoidance and an obstacle ray-cast (trees/rocks/walls) that pulls the camera in.
- **Loading**: entry chunk is ~3 KB and shows an animated loading screen (spinning tyre, ridge silhouette, tips) immediately; the game (Three.js, ~587 KB) and Rapier (~4.3 MB, WASM inlined as base64) download in parallel as separate chunks.
- **Fixes**: spawn faces open ground towards the dunes; graphics preset switches anti-aliasing live by recreating the WebGL renderer (no page reload).
