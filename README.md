# OFFROAD: WILD FRONTIER — web-first prototype (Phases 1–5b)

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

## Phase 5 — Garage & vehicle roster

Six original, procedurally modelled vehicles (no licensed names, logos or meshes). Each has its own mass, power, gearing/top speed, per-surface grip, lateral stiffness, suspension, wheelbase/track, wheel size and steering:

| Vehicle | Class | Mass | 0–60 km/h | Top in 7 s | Yaw @50 km/h | Mud 3 s |
|---|---|---|---|---|---|---|
| Frontier Scout | short-wheelbase classic 4×4 | 1650 kg | 2.2 s | 99 km/h | 48.8°/s | 33.2 km/h |
| Voyager Expedition | large expedition SUV | 2450 kg | 2.6 s | 98 km/h | 43.6°/s | 34.8 km/h |
| Sahara GT | full-size desert SUV | 2700 kg | 2.1 s | 112 km/h | 43.8°/s | 32.4 km/h |
| Workhorse Trail | off-road pickup | 2200 kg | 2.8 s | 94 km/h | 44.3°/s | 32.0 km/h |
| Apex R4 | rally car | 1250 kg | 1.55 s | 128 km/h | 53.6°/s | 22.4 km/h |
| Atlas Recovery | recovery truck (boom + winch) | 4300 kg | 3.8 s | 76 km/h | 36.6°/s | 32.5 km/h |

(Measured by `tests/acceptance.mjs` with the deterministic fixed-step `__game.simulate`; raw data in `screenshots/phase5/vehicles.json`.)

- **Garage** (Menu → Garage): rotating studio showcase with key/rim spot lights, stat bars, 8 paint swatches, prev/next (arrow keys / A-D / tap). Right-side panel on desktop & landscape (18–31% of the screen), bottom sheet in portrait (~36%). Vehicle + per-vehicle paint saved in localStorage and used in Free Roam.
- **Proving-ground strip**: flat, marked straight at z≈100 used for top-speed tests (and drivable in Free Roam).
- **Night visibility**: subtle camera-side fill + opposite rim point light that follow the car (night/fog/rain/sunset only; off in clear daylight).
- **Steering**: lock at speed raised (Scout 0.18→0.26 rad) plus a capped yaw assist on the ground; Scout full-lock yaw @80 km/h 29.7→41.0°/s with all four wheels down.
- Screenshots: `screenshots/phase5/`.

## Phase 5b — Detailed vehicle models

All six bodies were rebuilt procedurally (`src/kit.ts` helpers, `src/models.ts` builders) and **physics/handling is unchanged** (same specs; acceptance numbers identical). Each model follows the silhouette, proportions and signature design cues of a well-known off-roader class — **design-cue level only: no manufacturer names, logos, badges or emblems, and no copied meshes**; in-game names stay original.

- Scout — classic short-wheelbase utility 4×4 cues: slab sides, flat clamshell bonnet and wing tops, near-vertical screen, contrast roof with alpine windows, round lamps in a black grille panel, exposed hinges, side-hinged rear door with spare.
- Voyager — long-running utility-wagon cues: long boxy wagon, bonnet power bulge, wide slat grille with rectangular lamps, big flares, asymmetric barn doors; roof tent, bull bar + winch, snorkel, ladder.
- Sahara — full-size luxury desert SUV cues: rounded-square body, high beltline, large chrome grille with heavy bars, swept lamps + light strip, body-colour arch blisters, chrome mouldings/rails/running boards, wraparound tail lamps.
- Pickup — mid-size double-cab cues: sloping bonnet to a tall trapezoid grille, slim swept lamps, four doors, separate bed + tailgate, sports bar, chrome step bumper.
- Rally — world-rally hatch cues: short/wide/low, box arches, splitter and intakes, roof scoop, roof-level wing, diffuser, light pod, livery bands (no text).
- Recovery — cab-over recovery truck cues: flat tilt cab, split screen, slat grille, visor, beacon bar, tall mirrors, exhaust stack, fuel tank, lockers, boom + ram + hook, under-lift, winch.

Common: bevelled extruded side-profile panels with real wheel-arch cut-outs, tinted clear-coat glass, shut lines/handles/hinges, lamp housings with emissive lenses, mirrors, tow hooks, underbody (rails, tank, exhaust, skid plate); tread-block tyres, style-specific rims (steel / 6-spoke / twin-spoke / rally / truck) with brake discs and lug nuts, calipers that steer but don't spin; animated dampers + coil springs and solid axles (or wishbones on the Sahara/rally) driven by the suspension; clear-coat metallic paint (Medium/High), studio reflection map on car materials only, and a cosmetic mud layer that builds up on the lower body in the mud basin.

Performance: static parts are merged per material and suspension parts are instanced, so the car went from 64–70 meshes to 23–26 (High/Medium) / 17–21 (Low). Low preset swaps live to a simplified model (~3.5k triangles instead of ~21–29k). Numbers: `screenshots/phase5b/model-stats.json`, `perf-before-after.json`; comparison script `tests/phase5b-compare.mjs`.
