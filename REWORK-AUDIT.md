# OFFROAD: WILD FRONTIER — Rework audit, plan and work board

Date: 2026-10-11. Source of truth: this git repo (`/workspace/offroad-wild-frontier`). The live Netlify site
`extraordinary-brioche-0db36a.netlify.app` still serves the **old build 0.4.0 (commit 3a9f087)**.

## Phase A — Audit of the existing project (before any rework change)

**Stack:** Vite 8 + TypeScript, Three.js r186 (WebGL2), Rapier 3D 0.21 (WASM raycast-vehicle controller), procedural Web Audio.
Entry: `index.html` → `src/main.ts` (3 KB loader) → lazily imports `src/game.ts` (Three.js, ~730 KB) + Rapier (4.3 MB, WASM inlined).
Multiplayer: `server/` (Node + ws + headless Rapier, committed in 7e7b297, never hosted). Deploy: static `dist/` (Netlify Drop, anonymous).

**Measured baseline (commit 7e7b297):**
- `npm run build`: clean (tsc client + server, vite, esbuild server). Only warning: Rapier chunk > 4 MB.
- `node tests/acceptance.mjs`: **158/158 passed** (log: `screenshots/rework/baseline-acceptance-158.txt`).
- Headless Chrome, SwiftShader **CPU** renderer: 10–16 FPS at 1280×720 (Low 16.5, Medium 10.0, High 10–12). Not representative of phones/GPUs.
- Console errors during gameplay sessions: none.
- Driving: accelerate / brake / reverse (hold brake) / steer / handbrake / reset all work; per-surface grip measurably differs
  (3 s full throttle: dirt 64.9, sand 50.5, mud 33.2 km/h); chase camera with terrain + obstacle avoidance; drag-to-look.

### Gap analysis (original requirements → state at audit)

| Requirement | State | Root cause / note |
|---|---|---|
| Real 3D drivable 4×4, physics, suspension, surfaces | Implemented | Rapier raycast vehicle, 4WD, per-surface grip/drag |
| Chase camera, camera rotation | Implemented | drag-to-look, re-centres |
| Keyboard controls | Implemented | |
| Mobile controls | **Partial / wrong design** | big on-screen ◀ ▶ GAS BRAKE buttons only; no tilt, no auto-throttle |
| Visual quality ("premium, cinematic") | **Poor** | flat per-vertex colours with zero texture detail, grey disc puddles, single-cone trees, no grass/clouds; this is the main reason it looked like a prototype |
| Distinct biomes (jungle mud, desert dunes, rocky mountain) | Partial | zones on one 320 m map; mud basin had no jungle at all; desert had no dressing |
| Fog / rain / night / headlights | Implemented | 5 presets; rain had no ground splashes |
| Cinematic intro, audio, particles | Implemented | procedural audio measured, not listened to |
| Garage + vehicles (Defender/Land Cruiser/Patrol-inspired, pickup, rally, recovery) | Implemented (stylised) | procedural models, no logos; not licensed photo-real models |
| Missions: challenges, races, rescue | Implemented | 6 missions, medals, best times, credits/XP, unlocks, upgrades |
| 10-level progression | **Missing** | (new requirement) |
| Online multiplayer | **Implemented locally only** | server + client exist; no reachable host → not real online play |
| Graphics presets affect quality/FPS | Implemented | Low/Med/High change AA, pixel ratio, shadows, particles, scree |
| PWA / installable | Missing | no manifest / icons |
| GPU context loss / load failure recovery | Partial | load failure message existed; context loss froze on black |
| Android APK / iOS app | Missing (blocked) | no Android SDK; iOS needs macOS + Xcode + Apple account |
| User could actually see the game | **Broken** | Netlify anonymous drop was password-gated; password failed on the user's iPhone |

## Work board (revised order; dependencies → acceptance criteria)

| # | Step | Depends on | Acceptance criteria | Status |
|---|---|---|---|---|
| 1 | Audit + repair driving foundation | — | build clean; 158 legacy checks green; fixed-step physics stable at low FPS; context-loss overlay | **Done** |
| 2 | One high-quality level end to end (L1 Desert Training) incl. tilt / touch controls | 1 | L1 playable from Career; clean bot ≤ gold, human-like bot ≤ bronze; tilt (iOS permission on tap), denial/no-sensor fallback, recentre, touch halves, auto-throttle, brake/reverse — automated tests | **Done** (sensors stubbed in tests) |
| 3 | Level progression + saves | 2 | 10 levels with honest status; completion unlocks next; points/XP/levels/unlocked vehicles persist across reload; points-based garage unlock drives the chosen vehicle | **Done** |
| 4 | Remaining single-player levels L3–L7, L10 + vehicle progression | 3 | each level has its own route/objective, fail + restart; L6 needs a river (water physics), L10 needs a larger map | L3–L5 **prototype** (reuse routes with own rules/weather); L6, L7, L10 **not built** |
| 5 | Multiplayer server + L8/L9 | 3, hosting | server-authoritative sessions, rooms + invite codes, coop, race positions, leaderboard, server-validated rewards | server/rooms/invite codes/convoy/race exist from Phase 7 (local); leaderboard + server-validated rewards **not built**; **blocked on hosting** |
| 6 | Simultaneous multi-client tests | 5 | ≥4 headless clients on one server, latency simulation, reconnection | Phase 7 local tests exist; to be re-run in step 5 |
| 7 | Optimise | 4 | real-device FPS (needs a real phone), draw calls, bundle size | partly (instancing, chunk culling, presets) |
| 8 | Deploy preview | 1–3 | deployed build = this commit; verified in a fresh browser | see report |

## What changed in this rework (steps 1–3)

- **Ground** (`src/groundShader.ts`, `src/terrain.ts`): procedural detail shader on the terrain — sand wind ripples + grain (bump), mud clods
  and glossy wet pools, darker wet shorelines around puddles, grass/dirt clumps and pebbles, rock cracks. Wet spots reflect the sky.
  Off on Low.
- **Water**: puddles use a dark muddy water shader with sky reflections, animated ripples and soft shorelines (were flat grey discs).
- **Sky**: drifting cloud layer per weather; sky is rendered into a reflection map (water, wet ground, vehicle paint outdoors).
- **Biomes** (`src/nature.ts`): jungle fringe around the mud basin (95 broadleaf trees with colliders, ferns, bushes, reeds on the mud rim),
  wind-animated grass (up to 9000 tufts), desert sandstone outcrops (34, colliders), dry scrub, dead trees. Instanced in 40 m chunks with
  frustum + distance culling; counts scale with the preset (Low: no grass). Seeded, so the multiplayer server builds identical colliders.
  Existing mission routes are kept clear: all six legacy bot times are unchanged.
- **Controls** (`src/input.ts`, Settings → Mobile controls): **Tilt** (default on touch devices; DeviceOrientation, iOS
  `DeviceOrientationEvent.requestPermission()` called inside the Play/Start tap; orientation-aware portrait/landscape; deadzone;
  ⟲ Centre recalibration; automatic fallback to touch halves on denial or no sensor data, and back to tilt if data arrives),
  **Touch halves** (hold left/right half to steer, drives forward, both halves = brake/reverse), **Buttons** (old compact set,
  optional). **Auto-throttle** option, default on for touch devices; left half / both halves always brake. Small HB pill. Keyboard unchanged.
- **Career** (`src/levels.ts`, Menu → Career): 10 levels. L1 Desert Training (new 13-gate sand trail with coaching tips, stop in the
  finish circle, 1:30 limit) and L2 Sand Dune Challenge (2-lap race at sunset, 2:00 limit) are **playable**; L3 Mud Jungle (fog, fail if
  stuck 15 s, 3 recoveries), L4 Rocky Mountain (3 recoveries), L5 Night Expedition (night navigation) are **prototypes** reusing existing
  routes; L6, L7, L10 **not built yet** (locked, labelled); L8, L9 **need the online server** (labelled). Completion = saved best time;
  the next level unlocks; results screen says so. Points (= credits) and XP rewards; vehicles unlock with points + player level in the garage.
- Mission rules added: forced weather, limited recoveries, stuck-fail, coaching tips, `trail` mission type.
- Robustness: WebGL context-loss overlay with Reload; physics up to 8 fixed steps per frame; PWA manifest + icons (Add to Home Screen).

## Hosting brief (multiplayer, step 5) — nothing has been created; no accounts, no paid resources

**What the server needs:** one Node 20 process (`npm run build && PORT=8080 node dist-server/server.mjs`) serving the web client and
the WebSocket endpoint `/ws`; health check `GET /healthz`. Measured locally in Phase 7: 30 Hz authoritative tick with headless Rapier.
Sizing: 1 vCPU / 1 GB RAM is enough for a few rooms of 8; 2 OCPU / 4–12 GB (the whole free A1 allowance) comfortably covers the 24-room default cap (`MAX_ROOMS`).
Disk < 1 GB. Ports: **443** (and 80 for the TLS certificate challenge/redirect) public; 8080 bound to localhost only behind a reverse proxy.

**Oracle Cloud Always Free (user must create the account; card + ID verification):**
- Ampere A1 Flex (`VM.Standard.A1.Flex`): **2 OCPU / 12 GB RAM in total** across all A1 VMs (1,500 OCPU-h + 9,000 GB-h per month),
  per Oracle's Always Free page checked 2026-10-11 (allocation was reduced in 2026). One 2-OCPU VM or two 1-OCPU VMs. Each boot volume
  is at least 47 GB, counted against the 200 GB free block storage. Also 2 × `VM.Standard.E2.1.Micro` (AMD, 1/8 OCPU, 1 GB) as a fallback.
- If more A1 than the free total is running when the trial ends, **all A1 instances are disabled and deleted after 30 days** unless the
  account is upgraded — create only one 2 OCPU / 12 GB (or smaller) VM.
- **Idle reclaim:** an Always Free VM can be reclaimed if, over 7 days, CPU (95th percentile) < 20 % **and** network < 20 % **and**
  (A1 only) memory < 20 %. Keeping memory use above 20 % of the VM (e.g. a 4 GB VM with the server + a modest cache) or real traffic avoids it.
- **Home region is permanent** and Always Free compute only runs there (UAE East / Dubai was suggested).
- "**Out of host capacity**" errors are common for A1 in busy regions; retry later or a smaller shape.
- Steps: create VCN with internet gateway → Ubuntu 24.04 A1 VM with your SSH public key → in the **security list allow only 22 (your IP),
  80, 443** → on the VM `ufw allow 80,443/tcp` + `ufw limit 22/tcp` (Oracle images also ship iptables rules: open 80/443 there too) →
  install Node 20 + Caddy → `git clone` → `npm ci && npm run build` → systemd unit for `node dist-server/server.mjs` (PORT=8080, HOST=127.0.0.1,
  TRUST_PROXY=1, DEBUG_API=0, ALLOW_NET_SIM=0) → Caddyfile `game.example.com { reverse_proxy 127.0.0.1:8080 }` (automatic Let's Encrypt TLS;
  needs a domain or a free DNS name pointing at the VM's public IP).
- Security: SSH key-only (`PasswordAuthentication no`, no root login), unattended-upgrades, app runs as an unprivileged user, built-in rate
  limits already on (per-IP connections, messages, joins, inputs), **no secrets in the repo** (none are needed today).
- **Charges to watch:** upgrading the account to Pay-As-You-Go makes anything outside Always Free billable; block volumes beyond the
  **200 GB** free total; outbound data beyond **10 TB/month**; any non-free shape (e.g. A1 above the free OCPU/GB total, E4/E5, GPU);
  reserved public IPs beyond the free allowance; load balancers beyond the free one; extra backups/snapshots. Set a budget alert at $1.

## Known limitations (honest)
- Sensor behaviour on a real iPhone/Android is **unverified**: tests stub `requestPermission` and dispatch synthetic `deviceorientation` events.
- FPS numbers come from a CPU software renderer; no real phone has been measured.
- Vehicles are stylised procedural models (no licensed photo-real models).
- Multiplayer has never run on a public server; it is not claimed as working cross-platform online play.
- L3–L5 reuse existing routes; L6, L7, L10 not built; L8/L9 need hosting.
- No Android APK / iOS app package (toolchains/accounts not available).
