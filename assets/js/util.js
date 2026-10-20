export const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function whenVisible(el, cb) {
  if (!('IntersectionObserver' in window)) { cb(true); return; }
  new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting)), { rootMargin: '120px' }).observe(el);
}

export function hasWebGL() {
  if (!window.THREE) return false;
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); }
  catch (_) { return false; }
}
