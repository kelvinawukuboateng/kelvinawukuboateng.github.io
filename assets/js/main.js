// Entry point: builds the page's lists and dialog, then starts the 3D scenes.
import { PROJECTS } from './data/projects.js';
import { STACK, EXTRA } from './data/stack.js';
import { paintCard } from './cards.js';
import { getTheme, setTheme, onThemeChange } from './theme.js';
import { hasWebGL } from './util.js';
import { initTerrain } from './scenes/terrain.js';
import { initRing } from './scenes/ring.js';
import { initStack } from './scenes/stack.js';

const $ = (id) => document.getElementById(id);
document.documentElement.classList.add('js');

/* ---------- theme toggle ---------- */
const toggle = $('themeToggle');
const syncToggle = (t) => toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
syncToggle(getTheme()); onThemeChange(syncToggle);
toggle.addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));

/* ---------- project list ---------- */
const cards = [];
const idx = $('index');
PROJECTS.forEach((p, i) => {
  const li = document.createElement('li');
  const bt = document.createElement('button'); bt.type = 'button';
  const first = p.summary.split('. ')[0].replace(/\.$/, '') + '.';
  bt.innerHTML = `<span class="y">${p.year}</span><span class="t">${p.title}${p.live ? '<span class="live">Live</span>' : ''}<span class="d">${first}</span></span><span class="tags">${p.stack.slice(0, 3).join(' · ')}</span>`;
  bt.addEventListener('click', () => openProject(i));
  li.appendChild(bt); idx.appendChild(li);
});

/* ---------- stack groups (text) ---------- */
const groups = {};
STACK.forEach((s) => { (groups[s.group] = groups[s.group] || []).push(s.name); });
$('stackGroups').innerHTML = Object.keys(groups).map((g) =>
  `<div><dt>${g}</dt><dd>${groups[g].concat(EXTRA[g] || []).join(', ')}</dd></div>`).join('');

/* ---------- project dialog ---------- */
const dlg = $('dlg');
function openProject(i) {
  const p = PROJECTS[i];
  if (!cards[i]) cards[i] = paintCard(p);
  $('dlgImg').src = cards[i].toDataURL('image/jpeg', 0.9);
  $('dlgImg').alt = `Preview of ${p.title}`;
  $('dlgKicker').textContent = p.kicker;
  $('dlgTitle').textContent = p.title;
  $('dlgSummary').textContent = p.summary;
  $('dlgPoints').innerHTML = p.points.map((t) => `<li>${t}</li>`).join('');
  $('dlgMetrics').innerHTML = p.metrics.map(([v, l]) => `<div class="metric"><b>${v}</b><span>${l}</span></div>`).join('');
  $('dlgStack').textContent = 'Built with ' + p.stack.join(', ');
  const links = $('dlgLinks'); links.innerHTML = '';
  p.links.forEach(([t, u], k) => {
    const a = document.createElement('a'); a.className = 'btn' + (k === 0 ? ' primary' : '');
    a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = t + ' ↗'; links.appendChild(a);
  });
  if (!p.links.length) links.innerHTML = '<p class="hint-plain">Research thesis, available on request.</p>';
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
}
$('dlgClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

/* ---------- copy email ---------- */
$('copy').addEventListener('click', (e) => {
  const btn = e.currentTarget, text = $('email').textContent;
  const done = (msg) => { btn.textContent = msg; setTimeout(() => { btn.textContent = 'Copy email'; }, 1800); };
  const select = () => { const r = document.createRange(); r.selectNodeContents($('email')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done('Press Ctrl+C'); };
  try { navigator.clipboard.writeText(text).then(() => done('Copied'), select); } catch (_) { select(); }
});

/* ---------- section entrances (only for content below the fold) ---------- */
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const els = document.querySelectorAll('.sec-head > *, .index li, .job, .edu > *, .stack-groups > div, .contact h2, .contact-lede, .reach');
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove('pending'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el, k) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.classList.add('rise', 'pending'); el.style.transitionDelay = `${(k % 4) * 70}ms`; io.observe(el);
  });
}

/* ---------- 3D ---------- */
async function start3D() {
  if (!hasWebGL()) { document.documentElement.classList.add('nogl'); return; }
  initTerrain($('terrain'));
  try {
    await Promise.all(['700 72px "Barlow Condensed"', '600 21px "Barlow"', '500 18px "Barlow"', '400 17px "Barlow"']
      .map((f) => document.fonts.load(f)));
  } catch (_) { /* fall back to system fonts */ }
  PROJECTS.forEach((p, i) => { cards[i] = paintCard(p); });
  const nowName = $('nowName');
  const ring = initRing({
    stage: $('stage'), canvas: $('ring'), cards, projects: PROJECTS,
    onOpen: openProject, onCurrent: (i) => { nowName.textContent = PROJECTS[i].title; },
  });
  $('prev').addEventListener('click', () => ring.go(-1));
  $('next').addEventListener('click', () => ring.go(1));
  initStack({ host: $('balls'), canvas: $('ballsCanvas'), tip: $('ballTip'), items: STACK });
}
start3D();
