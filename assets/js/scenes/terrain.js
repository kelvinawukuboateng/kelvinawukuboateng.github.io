// Hero: an animated point-cloud terrain with sensor pins.
import { SCENE, getTheme, onThemeChange } from '../theme.js';
import { REDUCED, whenVisible } from '../util.js';

export function initTerrain(canvas) {
  const THREE = window.THREE;
  const host = canvas.parentElement;
  const r = new THREE.WebGLRenderer({ canvas, antialias: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const sc = new THREE.Scene();
  sc.fog = new THREE.Fog(0x000000, 8, 30);
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

  const NX = 200, NZ = 110, S = 0.18, n = NX * NZ;
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) { const k = (i * NZ + j) * 3; pos[k] = (i - NX / 2) * S; pos[k + 2] = -j * S + 4; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.95 });
  sc.add(new THREE.Points(geo, mat));

  const low = new THREE.Color(), mid = new THREE.Color(), high = new THREE.Color(), tmp = new THREE.Color();
  const hgt = (x, z, t) => 0.9 * Math.sin(x * 0.32 + t * 0.25) * Math.cos(z * 0.35 - t * 0.1) + 0.45 * Math.sin(x * 0.9 - z * 0.55 + t * 0.5)
    + 1.6 * Math.exp(-((x - 4.5) ** 2 + (z + 6) ** 2) / 7) + 1.1 * Math.exp(-((x + 3) ** 2 + (z + 11) ** 2) / 10);

  const pinMats = [];
  const pins = [[4.5, -6], [-3, -11], [9, -3], [-8, -5]].map(([px, pz]) => {
    const g = new THREE.Group();
    const lm = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.7 });
    const dm = new THREE.MeshBasicMaterial();
    const hm = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    pinMats.push(lm, dm, hm);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.6, 0)]), lm);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), dm);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.16, 32), hm);
    dot.position.y = halo.position.y = 1.6; g.add(line, dot, halo);
    g.userData = { px, pz, halo }; sc.add(g); return g;
  });

  function applyTheme(t) {
    const c = SCENE[t];
    r.setClearColor(c.bg, 1); sc.fog.color.setHex(c.fog);
    low.setHex(c.terrainLow); mid.setHex(c.terrainMid); high.setHex(c.terrainHigh);
    pinMats.forEach((m) => m.color.setHex(c.pin));
    mat.size = t === 'light' ? 0.06 : 0.055;
    render(lastT);
  }

  let mx = 0, my = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  function size() { const w = host.clientWidth, h = host.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }

  let lastT = 8;
  function render(t) {
    lastT = t;
    for (let i = 0; i < n; i++) {
      const k = i * 3, x = pos[k], z = pos[k + 2], y = hgt(x, z, t); pos[k + 1] = y;
      const h = Math.min(1, Math.max(0, (y + 1.2) / 3.4));
      if (h < 0.6) tmp.copy(low).lerp(mid, h / 0.6); else tmp.copy(mid).lerp(high, (h - 0.6) / 0.4);
      col[k] = tmp.r; col[k + 1] = tmp.g; col[k + 2] = tmp.b;
    }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    pins.forEach((g, i) => {
      const { px, pz, halo } = g.userData; g.position.set(px, hgt(px, pz, t), pz); halo.lookAt(cam.position);
      const ph = (t * 0.8 + i * 0.3) % 1, s = 1 + ph * 1.6; halo.scale.set(s, s, s); halo.material.opacity = 0.7 * (1 - ph);
    });
    const wide = cam.aspect > 1.1;
    cam.position.set((wide ? -2.5 : 0) + mx * 1.6, 3.6 - my * 0.8, 9); cam.lookAt(wide ? 1.5 : 0, 0, -5);
    r.render(sc, cam);
  }

  size(); addEventListener('resize', size);
  applyTheme(getTheme()); onThemeChange(applyTheme);

  let on = true; whenVisible(host, (v) => { on = v; });
  const t0 = performance.now();
  if (REDUCED) { render(8); addEventListener('resize', () => render(8)); return; }
  (function loop(now) { requestAnimationFrame(loop); if (on) render((now - t0) / 1000); })(t0);
}
