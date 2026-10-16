// Tiny entry chunk: shows the loading screen immediately, then downloads the game (Three.js)
// and the physics engine (Rapier WASM) as separate chunks in parallel.
const $ = (id: string) => document.getElementById(id)!;
const setLoad = (pct: number, text: string) => { ($('load-bar') as HTMLElement).style.width = pct + '%'; $('load-text').textContent = text; };
const TIPS = [
  'Tip: mud saps your speed — keep momentum and avoid sharp steering.',
  'Tip: sand lets the wheels spin; feather the throttle on the dunes.',
  'Tip: Space (or HB) locks the rear wheels for tight turns.',
  'Tip: press T in-game to change the weather, M to mute.',
  'Tip: drag the view to look around; the camera re-centres by itself.',
];
let tip = 0;
const tipTimer = setInterval(() => { tip = (tip + 1) % TIPS.length; $('load-tip').textContent = TIPS[tip]; }, 2600);
(window as any).__boot = { t0: performance.now() };

/** capability check before downloading ~5 MB: WebGL (2 or 1) and WebAssembly are required */
function missingFeatures() {
  const miss: string[] = [];
  try { const c = document.createElement('canvas'); if (!(c.getContext('webgl2') || c.getContext('webgl'))) miss.push('WebGL'); } catch { miss.push('WebGL'); }
  if (typeof WebAssembly !== 'object' || typeof WebAssembly.instantiate !== 'function') miss.push('WebAssembly');
  return miss;
}
// PWA: service worker scoped to this folder (e.g. /preview/), never the site root
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost') && !/[?&]nosw/.test(location.search)) {
  navigator.serviceWorker.register('./sw.js', { scope: './' }).catch((e) => console.warn('service worker not registered', e));
}

async function start() {
  const miss = missingFeatures();
  if (miss.length) {
    clearInterval(tipTimer); setLoad(100, '');
    $('load-text').innerHTML = `<b>This browser can't run the game:</b> ${miss.join(' and ')} ${miss.length > 1 ? 'are' : 'is'} missing or disabled.<br>Try an up-to-date Chrome, Edge, Firefox or Safari, and enable hardware acceleration.`;
    (window as any).__boot.missing = miss; return;
  }
  setLoad(8, 'Downloading game…');
  const rapierP = import('@dimforge/rapier3d-compat');
  const gameP = import('./game');
  const [R, game] = await Promise.all([rapierP, gameP]);
  (window as any).__boot.downloaded = performance.now();
  setLoad(30, 'Starting physics…');
  await R.default.init();
  await game.boot(R.default, setLoad);
  (window as any).__boot.ready = performance.now();
  clearInterval(tipTimer);
  const ls = $('loading'); ls.classList.add('fade'); setTimeout(() => ls.classList.add('hidden'), 600);
}

start().catch((e) => {
  console.error(e);
  $('load-text').textContent = 'Failed to start: ' + (e?.message ?? e) + ' — your browser may not support WebGL2/WebAssembly.';
});
