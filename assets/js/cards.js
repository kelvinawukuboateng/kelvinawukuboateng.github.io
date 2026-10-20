// Paints each project's preview "screen" onto a canvas, from real project data.
import { DATA as D } from './data/projects.js';

export const CARD_W = 1200;
export const CARD_H = 750;
const GOLD = '#f5b841';
const TEXT = '#e7ecf6';
const SOFT = '#a3adc4';

function rr(x, px, py, w, h, r) {
  x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r);
  x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
}
const font = (sz, w, fam) => `${w} ${sz}px ${fam === 'display' ? '"Barlow Condensed", "Arial Narrow", sans-serif' : '"Barlow", "Segoe UI", sans-serif'}`;
export function hexA(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function label(x, t, px, py, align = 'left', c = SOFT, sz = 18, w = 500) { x.font = font(sz, w, 'text'); x.fillStyle = c; x.textAlign = align; x.fillText(t, px, py); x.textAlign = 'left'; }
function kpi(x, px, py, val, lab, c) { x.font = font(54, 700, 'display'); x.fillStyle = c || TEXT; x.fillText(val, px, py); label(x, lab, px, py + 30); }

export function paintCard(p) {
  const cv = document.createElement('canvas'); cv.width = CARD_W; cv.height = CARD_H;
  const x = cv.getContext('2d'); const W = CARD_W, H = CARD_H;
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0f172b'); g.addColorStop(1, '#080d1a');
  rr(x, 0, 0, W, H, 28); x.fillStyle = g; x.fill();
  x.save(); rr(x, 0, 0, W, H, 28); x.clip();
  const rg = x.createRadialGradient(W * .85, H * .15, 0, W * .85, H * .15, 600);
  rg.addColorStop(0, hexA(p.accent, .22)); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(0, 0, W, H);
  // window bar
  x.fillStyle = 'rgba(255,255,255,.045)'; x.fillRect(0, 0, W, 58);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { x.beginPath(); x.arc(34 + i * 24, 29, 7, 0, 7); x.fillStyle = c; x.globalAlpha = .85; x.fill(); x.globalAlpha = 1; });
  rr(x, W / 2 - 270, 15, 540, 28, 14); x.fillStyle = 'rgba(255,255,255,.07)'; x.fill();
  label(x, p.url, W / 2, 35, 'center', '#8b95ad', 17, 400);
  // header
  label(x, p.kicker, 56, 116, 'left', p.accent, 21, 600);
  x.font = font(72, 700, 'display'); x.fillStyle = TEXT; x.fillText(p.title.toUpperCase(), 52, 186);
  DRAW[p.draw](x, { x: 56, y: 236, w: W - 112, h: H - 296 }, p);
  x.restore();
  rr(x, 1, 1, W - 2, H - 2, 27); x.strokeStyle = hexA(p.accent, .35); x.lineWidth = 2; x.stroke();
  return cv;
}

const DRAW = {
  food(x, b, p) {
    const d = D.food.top, max = 60, lw = 250, bw = b.w * .62 - lw, rowH = (b.h - 10) / d.length;
    label(x, 'kgCO₂e per kg, top emitters', b.x + lw, b.y - 12);
    d.forEach(([n, v], i) => {
      const y = b.y + i * rowH;
      label(x, n, b.x, y + rowH * .62, 'left', TEXT, 19);
      rr(x, b.x + lw, y + rowH * .22, bw, rowH * .5, 6); x.fillStyle = 'rgba(255,255,255,.05)'; x.fill();
      rr(x, b.x + lw, y + rowH * .22, Math.max(8, bw * v / max), rowH * .5, 6); x.fillStyle = i === 0 ? p.accent : hexA(p.accent, .55); x.fill();
      label(x, v.toFixed(1), b.x + lw + bw * v / max + 10, y + rowH * .62, 'left', TEXT, 17, 600);
    });
    const sx = b.x + b.w * .7; label(x, 'Average by lifecycle stage', sx, b.y - 12);
    const s = D.food.stages, sm = 3.5;
    s.forEach(([n, v], i) => {
      const y = b.y + 10 + i * ((b.h - 20) / s.length);
      label(x, n, sx, y + 16, 'left', TEXT, 17);
      rr(x, sx, y + 24, Math.max(4, (b.w * .3) * v / sm), 8, 4); x.fillStyle = i < 2 ? GOLD : 'rgba(255,255,255,.25)'; x.fill();
    });
  },
  freight(x, b) {
    const yrs = D.freight.years, M = D.freight.modes, names = Object.keys(M);
    const cols = ['#5cc8ff', '#f5b841', '#7fd99a', '#c59bff', '#ff8a65', '#64748b'];
    const cw = b.w * .64, gap = cw / yrs.length, colW = gap * .56;
    label(x, 'Share of trade value by mode', b.x, b.y - 12);
    yrs.forEach((yr, i) => {
      const tot = names.reduce((s, n) => s + M[n][i], 0); let acc = 0; const cx = b.x + i * gap + gap * .2;
      names.forEach((n, j) => {
        const hh = (b.h - 40) * M[n][i] / tot, yy = b.y + (b.h - 40) - acc - hh;
        x.fillStyle = cols[j]; x.fillRect(cx, yy, colW, hh - 2); acc += hh;
      });
      label(x, String(yr), cx + colW / 2, b.y + b.h - 8, 'center', SOFT, 18);
    });
    const allTot = yrs.map((_, i) => names.reduce((s, k) => s + M[k][i], 0)).reduce((a, c) => a + c, 0);
    const lx = b.x + cw + 36;
    names.forEach((n, j) => {
      const y = b.y + 8 + j * 44; x.fillStyle = cols[j]; x.fillRect(lx, y, 18, 18);
      const sh = M[n].reduce((a, c) => a + c, 0) / allTot * 100;
      label(x, n, lx + 30, y + 16, 'left', TEXT, 20);
      label(x, sh.toFixed(1) + '%', b.x + b.w, y + 16, 'right', TEXT, 20, 600);
    });
  },
  bank(x, b, p) {
    kpi(x, b.x, b.y + 44, '93.05%', 'ROC-AUC, Random Forest', p.accent);
    kpi(x, b.x + 300, b.y + 44, '89.45%', 'Accuracy');
    kpi(x, b.x + 580, b.y + 44, '12 → 45%', 'Minority class after ADASYN');
    const r = D.bank.rate, cy = b.y + 120, ch = b.h - 150, cw = b.w, bw = cw / 12;
    label(x, 'Subscription rate by contact month, %', b.x, cy);
    [0, 25, 50].forEach((v) => { const y = cy + 20 + ch - (ch * v / 55); x.fillStyle = 'rgba(255,255,255,.06)'; x.fillRect(b.x, y, cw, 1); label(x, String(v), b.x + cw, y - 6, 'right', SOFT, 16); });
    const mo = 'JFMAMJJASOND';
    r.forEach((v, i) => { const hh = ch * v / 55; rr(x, b.x + i * bw + bw * .18, cy + 20 + ch - hh, bw * .64, hh, 6); x.fillStyle = v > 40 ? p.accent : hexA(p.accent, .35); x.fill(); label(x, mo[i], b.x + i * bw + bw / 2, cy + 20 + ch + 24, 'center', SOFT, 17); });
  },
  rec(x, b, p) {
    const w = D.rec.weekly, cw = b.w * .6, ch = b.h - 40, mn = 90000, mx = 150000;
    const py = (v) => b.y + ch - (v - mn) / (mx - mn) * ch;
    label(x, 'Weekly events, May–Sep 2015', b.x, b.y - 12);
    [100000, 125000, 150000].forEach((v) => { x.fillStyle = 'rgba(255,255,255,.06)'; x.fillRect(b.x, py(v), cw, 1); label(x, (v / 1000) + 'k', b.x + cw + 10, py(v) + 6, 'left', SOFT, 16); });
    x.beginPath(); w.forEach((v, i) => { const px = b.x + i / (w.length - 1) * cw; i ? x.lineTo(px, py(v)) : x.moveTo(px, py(v)); });
    x.strokeStyle = p.accent; x.lineWidth = 4; x.stroke();
    x.lineTo(b.x + cw, b.y + ch); x.lineTo(b.x, b.y + ch); x.closePath();
    const ag = x.createLinearGradient(0, b.y, 0, b.y + ch); ag.addColorStop(0, hexA(p.accent, .35)); ag.addColorStop(1, hexA(p.accent, 0)); x.fillStyle = ag; x.fill();
    const k = 11; x.beginPath(); x.arc(b.x + k / (w.length - 1) * cw, py(w[k]), 8, 0, 7); x.fillStyle = GOLD; x.fill();
    const fx = b.x + cw + 100, fw = b.w - cw - 100; label(x, 'Funnel', fx, b.y - 12);
    D.rec.funnel.forEach(([n, v], i) => {
      const y = b.y + 10 + i * (ch / 3), ww = fw * Math.max(.14, Math.log10(v) / Math.log10(2194512));
      rr(x, fx, y, ww, ch / 3 - 36, 10); x.fillStyle = hexA(p.accent, .85 - i * .22); x.fill();
      label(x, n, fx + 14, y + 30, 'left', '#060912', 18, 600); label(x, v.toLocaleString('en-US'), fx, y + ch / 3 - 12, 'left', TEXT, 18, 600);
    });
  },
  water(x, b, p) {
    const steps = ['Raw sensor series', 'Outliers removed', 'Stationarity tested', 'Features selected'];
    steps.forEach((s, i) => {
      const px = b.x + i * (b.w / 4); rr(x, px, b.y, b.w / 4 - 28, 66, 14);
      x.fillStyle = i === 3 ? hexA(p.accent, .25) : 'rgba(255,255,255,.05)'; x.fill(); x.strokeStyle = hexA(p.accent, .4); x.lineWidth = 1.5; x.stroke();
      label(x, s, px + 18, b.y + 41, 'left', TEXT, 19);
      if (i < 3) label(x, '→', px + b.w / 4 - 14, b.y + 41, 'center', p.accent, 22, 600);
    });
    const my = b.y + 110;
    ['ANN', 'SVM', 'Random Forest'].forEach((m, i) => {
      const px = b.x + i * (b.w / 3); rr(x, px, my, b.w / 3 - 24, 92, 16); x.fillStyle = 'rgba(255,255,255,.04)'; x.fill();
      x.font = font(46, 700, 'display'); x.fillStyle = i === 2 ? p.accent : TEXT; x.fillText(m.toUpperCase(), px + 22, my + 62);
    });
    for (let k = 0; k < 6; k++) {
      x.beginPath();
      for (let i = 0; i <= 200; i++) { const px = b.x + i / 200 * b.w; const yy = b.y + b.h - 20 - k * 22 + Math.sin(i * .09 + k) * 14 * Math.sin(i * .02 + k * .7); i ? x.lineTo(px, yy) : x.moveTo(px, yy); }
      x.strokeStyle = hexA(p.accent, .15 + k * .1); x.lineWidth = 2; x.stroke();
    }
  },
  gis(x, b, p) {
    rr(x, b.x, b.y, b.w, b.h, 18); x.fillStyle = '#0a1426'; x.fill(); x.save(); rr(x, b.x, b.y, b.w, b.h, 18); x.clip();
    const peaks = [[.3, .45, 1], [.68, .35, .8], [.55, .75, .6]];
    const nz = (u, v) => Math.sin(u * 1.7 + Math.sin(v * 1.3)) * .5 + Math.sin(v * 2.1 + Math.cos(u * .9)) * .5;
    const f = (u, v) => peaks.reduce((s, [a, c, h]) => s + h * Math.exp(-((u - a) ** 2 + (v - c) ** 2) * 14), 0) + nz(u * 4, v * 4) * .08;
    const st = 4;
    for (let i = 0; i < b.w; i += st) for (let j = 0; j < b.h; j += st) {
      const v = f(i / b.w, j / b.h), band = v * 10, fr = band - Math.floor(band);
      if (fr < .09) { x.fillStyle = hexA(Math.floor(band) > 6 ? p.accent : '#8b95ad', .25 + Math.min(.6, v * .6)); x.fillRect(b.x + i, b.y + j, st - 1, st - 1); }
    }
    x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 3; x.beginPath(); x.moveTo(b.x, b.y + b.h * .8);
    x.bezierCurveTo(b.x + b.w * .3, b.y + b.h * .6, b.x + b.w * .5, b.y + b.h * .9, b.x + b.w, b.y + b.h * .55); x.stroke();
    peaks.forEach(([u, v]) => { const px = b.x + u * b.w, py = b.y + v * b.h; x.beginPath(); x.arc(px, py, 16, 0, 7); x.fillStyle = hexA(p.accent, .25); x.fill(); x.beginPath(); x.arc(px, py, 7, 0, 7); x.fillStyle = p.accent; x.fill(); });
    x.restore(); label(x, 'Pitch 45° · bearing −17° · dark-matter style', b.x + 20, b.y + b.h - 20, 'left', TEXT, 17);
  },
  lab(x, b, p) {
    const half = b.w / 2 - 20;
    for (let s = 0; s < 2; s++) {
      const ox = b.x + s * (half / 2 + 10), sz = half / 2 - 10;
      for (let i = 0; i < 24; i++) for (let j = 0; j < 24; j++) {
        const v = .5 + .5 * Math.sin(i * .35) * Math.cos(j * .3), n = s === 0 ? (Math.sin(i * 12.9 + j * 78.2) * 43758.5 % 1) * .7 : 0;
        const c = Math.max(0, Math.min(1, v + n)); x.fillStyle = `rgb(${244 * c | 0},${114 * c + 40 | 0},${182 * c | 0})`;
        x.fillRect(ox + i * sz / 24, b.y + j * sz / 24, sz / 24 + 1, sz / 24 + 1);
      }
      label(x, s ? 'Median filter' : 'Gaussian noise added', ox, b.y + sz + 30, 'left', TEXT, 18);
    }
    const sx = b.x + half + 40;
    label(x, 'Seq("ATCG").transcribe()', sx, b.y + 22, 'left', TEXT, 20);
    label(x, "→ Seq('AUCG')", sx, b.y + 54, 'left', p.accent, 20, 600);
    const seq = 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDW';
    x.font = font(19, 500, 'text');
    for (let r = 0; r < 8; r++) { const line = seq.slice(r * 24, r * 24 + 24); for (let k = 0; k < line.length; k++) { x.fillStyle = 'AILMFVW'.includes(line[k]) ? p.accent : '#5b6580'; x.fillText(line[k], sx + k * 21, b.y + 104 + r * 30); } }
    label(x, '8X1D · RCSB PDB FASTA', sx, b.y + b.h - 4, 'left', SOFT, 17);
  },
  web(x, b, p) {
    const titles = ['Ticket booking', 'Quiz app', 'Admin dashboard', 'Payment form'];
    const cw = (b.w - 48) / 4;
    titles.forEach((t, i) => {
      const px = b.x + i * (cw + 16); rr(x, px, b.y, cw, b.h - 10, 16); x.fillStyle = 'rgba(255,255,255,.04)'; x.fill(); x.strokeStyle = 'rgba(255,255,255,.08)'; x.stroke();
      x.fillStyle = hexA(p.accent, .6); x.fillRect(px + 18, b.y + 22, cw * .5, 10);
      for (let k = 0; k < 6; k++) { x.fillStyle = `rgba(255,255,255,${k % 3 ? .07 : .12})`; rr(x, px + 18, b.y + 56 + k * 44, cw - 36 - (k % 2) * 40, 26, 8); x.fill(); }
      if (i === 1) { rr(x, px + 18, b.y + b.h - 92, cw - 36, 40, 20); x.fillStyle = p.accent; x.fill(); }
      label(x, t, px + 18, b.y + b.h - 34, 'left', TEXT, 19, 600);
    });
  },
};
