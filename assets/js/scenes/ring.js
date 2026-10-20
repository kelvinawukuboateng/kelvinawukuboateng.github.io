// Projects: a draggable 3D ring of preview screens with light streaks behind it.
import { SCENE, getTheme, onThemeChange } from '../theme.js';
import { REDUCED, whenVisible } from '../util.js';

export function initRing({ stage, canvas, cards, projects, onOpen, onCurrent }) {
  const THREE = window.THREE;
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setClearColor(0x000000, 0);
  r.outputEncoding = THREE.sRGBEncoding;
  const sc = new THREE.Scene(); sc.fog = new THREE.Fog(0x000000, 10, 26);
  const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);

  const R = 8.2, N = projects.length, step = Math.PI * 2 / N;
  const group = new THREE.Group(); sc.add(group);
  const meshes = projects.map((p, i) => {
    const tex = new THREE.CanvasTexture(cards[i]);
    tex.anisotropy = r.capabilities.getMaxAnisotropy(); tex.encoding = THREE.sRGBEncoding;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.75), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, fog: false }));
    const a = i * step; m.position.set(Math.sin(a) * R, i % 2 ? -0.35 : 0.35, -Math.cos(a) * R);
    m.lookAt(0, m.position.y, 0); m.userData = { i, baseY: m.position.y }; group.add(m); return m;
  });

  // light streaks
  const streakMats = [], glowMats = [];
  for (let s = 0; s < 7; s++) {
    const pts = [], rad = 11 + s * 0.9, y0 = -2.6 + s * 0.8, ph = s * 1.3;
    for (let k = 0; k <= 80; k++) { const a = k / 80 * Math.PI * 2; pts.push(new THREE.Vector3(Math.sin(a) * rad, y0 + Math.sin(a * 2 + ph) * 1.2, -Math.cos(a) * rad)); }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const sm = new THREE.MeshBasicMaterial({ transparent: true });
    const gm = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false });
    sm.userData.k = gm.userData.k = s; streakMats.push(sm); glowMats.push(gm);
    sc.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 300, 0.018, 6, true), sm));
    sc.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 300, 0.12, 8, true), gm));
  }
  // dust
  const dn = 900, dp = new Float32Array(dn * 3);
  for (let i = 0; i < dn; i++) { const a = Math.random() * Math.PI * 2, rr = 4 + Math.random() * 16; dp[i * 3] = Math.sin(a) * rr; dp[i * 3 + 1] = (Math.random() - 0.5) * 10; dp[i * 3 + 2] = -Math.cos(a) * rr; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.6 });
  sc.add(new THREE.Points(dg, dustMat));

  function applyTheme(t) {
    const c = SCENE[t];
    sc.fog.color.setHex(c.fog);
    streakMats.forEach((m) => { m.color.setHex(c.streaks[m.userData.k % 4]); m.opacity = c.streakOpacity; m.blending = c.additive ? THREE.AdditiveBlending : THREE.NormalBlending; m.needsUpdate = true; });
    glowMats.forEach((m) => { m.color.setHex(c.streaks[m.userData.k % 4]); m.opacity = c.glowOpacity; m.blending = c.additive ? THREE.AdditiveBlending : THREE.NormalBlending; m.needsUpdate = true; });
    dustMat.color.setHex(c.dust);
  }
  applyTheme(getTheme()); onThemeChange(applyTheme);

  let rot = 0, target = 0, hover = -1, dragging = false, sx = 0, moved = 0, lastInteract = 0, last = -1;
  const ray = new THREE.Raycaster(), mv = new THREE.Vector2();
  function size() { const w = stage.clientWidth, h = stage.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.fov = w < 640 ? 72 : 55; cam.updateProjectionMatrix(); }
  size(); addEventListener('resize', size);

  const pick = (e) => {
    const b = canvas.getBoundingClientRect();
    mv.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1);
    ray.setFromCamera(mv, cam); const h = ray.intersectObjects(meshes)[0]; return h ? h.object.userData.i : -1;
  };
  canvas.addEventListener('pointerdown', (e) => { dragging = true; sx = e.clientX; moved = 0; stage.classList.add('dragging'); canvas.setPointerCapture(e.pointerId); lastInteract = performance.now(); });
  canvas.addEventListener('pointermove', (e) => {
    if (dragging) { const dx = e.clientX - sx; sx = e.clientX; moved += Math.abs(dx); target -= dx * 0.0045; lastInteract = performance.now(); }
    else { hover = pick(e); canvas.style.cursor = hover >= 0 ? 'pointer' : ''; }
  });
  canvas.addEventListener('pointerup', (e) => {
    if (!dragging) return; dragging = false; stage.classList.remove('dragging');
    if (moved < 6) { const i = pick(e); if (i >= 0) onOpen(i); } else { target = Math.round(target / step) * step; }
  });
  canvas.addEventListener('pointercancel', () => { dragging = false; stage.classList.remove('dragging'); });
  canvas.addEventListener('pointerleave', () => { hover = -1; });

  const go = (d) => { target = Math.round(target / step) * step + d * step; lastInteract = performance.now(); };

  let on = true; whenVisible(stage, (v) => { on = v; });
  const t0 = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop); if (!on) return;
    const t = (now - t0) / 1000;
    if (!REDUCED && !dragging && now - lastInteract > 5000) target += 0.0016;
    rot += (target - rot) * 0.08; group.rotation.y = rot;
    meshes.forEach((m, i) => {
      const s = i === hover ? 1.06 : 1; m.scale.x += (s - m.scale.x) * 0.15; m.scale.y = m.scale.x;
      if (!REDUCED) m.position.y = m.userData.baseY + Math.sin(t * 0.8 + i) * 0.08;
    });
    cam.position.set(0, 0.25, -3.6); cam.lookAt(0, 0, -10);
    const cur = ((Math.round(rot / step) % N) + N) % N;
    if (cur !== last) { last = cur; onCurrent(cur); }
    r.render(sc, cam);
  })(t0);

  return { go };
}
