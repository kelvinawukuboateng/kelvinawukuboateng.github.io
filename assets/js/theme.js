// Theme state: 'dark' (default) or 'light'. Saved per visitor when storage is available.

const KEY = 'kab-theme';
const root = document.documentElement;
const listeners = new Set();

export function getTheme() {
  return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export function setTheme(t) {
  root.setAttribute('data-theme', t);
  try { localStorage.setItem(KEY, t); } catch (_) { /* storage unavailable */ }
}

export function onThemeChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

// Notify on any change to data-theme, including one made by the host page.
new MutationObserver(() => {
  const t = getTheme();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'light' ? '#eef1f6' : '#060912');
  listeners.forEach((fn) => fn(t));
}).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

// Colours the WebGL scenes use per theme.
export const SCENE = {
  dark: {
    bg: 0x060912, terrainLow: 0x14305a, terrainMid: 0x5cc8ff, terrainHigh: 0xf5b841, pin: 0xf5b841,
    fog: 0x060912, streaks: [0x2a7fff, 0x5cc8ff, 0x1d4ed8, 0x60a5fa], streakOpacity: 0.9, glowOpacity: 0.08,
    additive: true, dust: 0x8fb8ff, ballLight: 1.0,
  },
  light: {
    bg: 0xeef1f6, terrainLow: 0xa9bad6, terrainMid: 0x0a66c2, terrainHigh: 0xd08a00, pin: 0xb06d00,
    fog: 0xeef1f6, streaks: [0x2563eb, 0x0a66c2, 0x60a5fa, 0x1e40af], streakOpacity: 0.55, glowOpacity: 0.06,
    additive: false, dust: 0x5b7bb5, ballLight: 1.15,
  },
};
