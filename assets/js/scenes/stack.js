// Tech stack: glossy 3D balls that drop in, float, and can be pushed or grabbed.
import { getTheme, onThemeChange, SCENE } from '../theme.js';
import { REDUCED, whenVisible } from '../util.js';

function ballTexture(item) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#f5f7fb'; x.fillRect(0, 0, 1024, 512);
  const len = item.mark.length, size = len <= 2 ? 190 : len === 3 ? 150 : 112;
  x.font = `700 ${size}px "Barlow Condensed", "Arial Narrow", sans-serif`;
  x.fillStyle = item.color; x.textAlign = 'center'; x.textBaseline = 'middle';
  [256, 768].forEach((cx) => x.fillText(item.mark, cx, 262));
  return c;
}

function envMap(THREE, renderer) {
  // A small studio: a soft grey room with two bright panels, baked into a PMREM env map.
  const room = new THREE.Scene();
  room.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x8a93a6, side: THREE.BackSide })));
  const panel = (w, h, pos, rot, col) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })); m.position.set(...pos); m.rotation.set(...rot); room.add(m); };
  panel(10, 4, [0, 8, 2], [Math.PI / 2, 0, 0], 0xffffff);
  panel(4, 8, [-9, 1, 3], [0, Math.PI / 2, 0], 0xdfe9ff);
  panel(3, 6, [9, 0, -2], [0, -Math.PI / 2, 0], 0xffe9cc);
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(room, 0.04); pm.dispose();
  return rt.texture;
}

export function initStack({ host, canvas, tip, items }) {
  const THREE = window.THREE;
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setClearColor(0x000000, 0);
  r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  const sc = new THREE.Scene();
  sc.environment = envMap(THREE, r);
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100); cam.position.set(0, 0, 16);
  const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(-4, 6, 8); sc.add(key);
  const rim = new THREE.DirectionalLight(0x9fd4ff, 0.5); rim.position.set(6, -2, -4); sc.add(rim);
  sc.add(new THREE.AmbientLight(0xffffff, 0.25));

  const geo = new THREE.SphereGeometry(1, 64, 48);
  const balls = items.map((it, i) => {
    const tex = new THREE.CanvasTexture(ballTexture(it)); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
    const mat = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1 });
    const m = new THREE.Mesh(geo, mat); sc.add(m);
    m.userData = { i, item: it, home: new THREE.Vector3(), p: new THREE.Vector3(0, 20, 0), v: new THREE.Vector3(), delay: i * 0.06, wob: Math.random() * 6 };
    return m;
  });

  let rad = 1, viewW = 10, viewH = 6;
  function layout() {
    const w = host.clientWidth, h = host.clientHeight;
    r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    viewH = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)); viewW = viewH * cam.aspect;
    const n = balls.length;
    const rowsFor = (cols) => { let c = 0, rows = 0; while (c < n) { c += rows % 2 ? cols - 1 : cols; rows++; } return rows; };
    let best = null;
    for (let cols = 3; cols <= 9; cols++) {
      const rows = rowsFor(cols);
      const rx = (viewW * 0.88) / (cols * 2.25), ry = (viewH * 0.84) / ((rows - 1) * 2.25 * 0.92 + 2.2);
      const rr = Math.min(rx, ry, 1.15);
      if (!best || rr > best.rr) best = { cols, rows, rr };
    }
    rad = best.rr; const sp = rad * 2.25, rowH = sp * 0.92;
    let k = 0;
    for (let row = 0; row < best.rows; row++) {
      const inRow = Math.min(row % 2 ? best.cols - 1 : best.cols, n - k);
      const x0 = -(inRow - 1) * sp / 2, y = ((best.rows - 1) / 2 - row) * rowH;
      for (let c = 0; c < inRow; c++, k++) balls[k].userData.home.set(x0 + c * sp, y, 0);
    }
    balls.forEach((b) => b.scale.setScalar(rad));
  }
  layout(); addEventListener('resize', layout);

  function applyTheme(t) { const c = SCENE[t]; key.intensity = 0.9 * c.ballLight; r.toneMappingExposure = t === 'light' ? 0.98 : 1.05; }
  applyTheme(getTheme()); onThemeChange(applyTheme);

  // pointer
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const ptr = new THREE.Vector3(999, 999, 0); let grabbed = null, hover = null, ptrActive = false;
  function toWorld(e) {
    const b = canvas.getBoundingClientRect();
    ndc.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1);
    ray.setFromCamera(ndc, cam); ray.ray.intersectPlane(plane, ptr);
    const hit = ray.intersectObjects(balls)[0]; return hit ? hit.object : null;
  }
  canvas.addEventListener('pointermove', (e) => {
    ptrActive = true; hover = toWorld(e);
    canvas.style.cursor = grabbed ? 'grabbing' : hover ? 'grab' : '';
  });
  canvas.addEventListener('pointerdown', (e) => {
    const b = toWorld(e); if (!b) return;
    grabbed = b; hover = b; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing';
  });
  const release = () => { if (grabbed) { grabbed.userData.v.multiplyScalar(0.5); } grabbed = null; };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => { ptrActive = false; hover = null; ptr.set(999, 999, 0); tip.hidden = true; });

  // simulation
  let started = REDUCED, startT = 0, on = false;
  whenVisible(host, (v) => {
    on = v;
    if (v && !started) { started = true; startT = performance.now(); balls.forEach((b) => b.userData.p.set(b.userData.home.x, b.userData.home.y + viewH, 0)); }
  });
  if (REDUCED) balls.forEach((b) => b.userData.p.copy(b.userData.home));
  const tmp = new THREE.Vector3(), prev = performance.now();
  let last = prev;

  function step(now) {
    let elapsed = Math.min(0.12, (now - last) / 1000); last = now;
    const t = now / 1000, since = (now - startT) / 1000;
    while (elapsed > 0) { const dt = Math.min(1 / 60, elapsed); elapsed -= dt; physics(dt, t, since); }
    finish(t, since);
  }
  function physics(dt, t, since) {
    balls.forEach((b) => {
      const u = b.userData; if (!started || since < u.delay) return;
      if (b === grabbed) { tmp.copy(ptr).sub(u.p); u.v.copy(tmp).multiplyScalar(12); u.p.addScaledVector(u.v, dt); return; }
      const home = tmp.copy(u.home); if (!REDUCED) home.y += Math.sin(t * 0.9 + u.wob) * 0.12 * rad;
      u.v.addScaledVector(home.sub(u.p), 18 * dt);              // spring home
      if (ptrActive && !grabbed) {                                // pointer repel
        const dx = u.p.x - ptr.x, dy = u.p.y - ptr.y, d2 = dx * dx + dy * dy, R0 = rad * 2.1;
        if (d2 < R0 * R0 && d2 > 1e-4) { const d = Math.sqrt(d2), f = (R0 - d) / R0 * 60 * dt; u.v.x += dx / d * f; u.v.y += dy / d * f; }
      }
      u.v.multiplyScalar(Math.pow(0.04, dt));                     // damping
      u.p.addScaledVector(u.v, dt);
    });
    // collisions
    for (let i = 0; i < balls.length; i++) for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i].userData, b = balls[j].userData;
      const dx = b.p.x - a.p.x, dy = b.p.y - a.p.y, d = Math.hypot(dx, dy), min = rad * 2.04;
      if (d < min && d > 1e-4) {
        const o = (min - d) / 2, nx = dx / d, ny = dy / d;
        const wa = balls[i] === grabbed ? 0 : 1, wb = balls[j] === grabbed ? 0 : 1, sum = wa + wb || 1;
        a.p.x -= nx * o * 2 * wa / sum; a.p.y -= ny * o * 2 * wa / sum; b.p.x += nx * o * 2 * wb / sum; b.p.y += ny * o * 2 * wb / sum;
      }
    }
  }
  function finish(t, since) {
    balls.forEach((b) => {
      const u = b.userData; b.position.copy(u.p);
      const cl = (v) => Math.max(-0.45, Math.min(0.45, v));
      b.rotation.x += (cl(-u.v.y * 0.06) - b.rotation.x) * 0.1;
      b.rotation.y += (cl(u.v.x * 0.06 + Math.sin(t * 0.6 + u.wob) * 0.22) - b.rotation.y) * 0.1;
      b.visible = started && since >= u.delay || REDUCED;
    });
    // tooltip
    const show = grabbed || hover;
    if (show) {
      tmp.copy(show.position); tmp.y += rad; tmp.project(cam);
      tip.textContent = show.userData.item.name; tip.hidden = false;
      tip.style.left = ((tmp.x + 1) / 2 * host.clientWidth) + 'px'; tip.style.top = ((1 - tmp.y) / 2 * host.clientHeight) + 'px';
    } else tip.hidden = true;
    r.render(sc, cam);
  }
  (function loop(now) { requestAnimationFrame(loop); if (on) step(now); })(prev);
}
