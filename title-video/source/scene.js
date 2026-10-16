// Style 03 (particles) for an opening slide: a cosmic background (nebula, twinkling stars, glints, shooting stars),
// stardust floating in depth that spirals in and builds the title, which stays sharp with a slow orbit ring around it.
// Every value is a pure function of t. Silent (no sfx).
(() => {
  'use strict';
  const LINES = ['בינה מלאכותית', 'בגובה העיניים'];
  const SUB = 'איך בינה מלאכותית יכולה לעזור לנו בחיי היום יום';
  const N = 6500;
  const T_ASM0 = 1.9, T_ASM1 = 4.9, T_TXT = 4.65, T_SUB = 5.3;
  const COL = [[244, 241, 236], [0, 205, 192], [248, 192, 58]];   // white, teal, yellow

  scene('main', 0, DUR, { bg: '#04060F' }, (root) => {
    const R = rng(7);
    const CX = W / 2, CY = 0.47 * H;

    // ---------- nebula: painted once on an offscreen canvas, drawn each frame with a slow drift ----------
    const NW = Math.round(W * 1.2), NH = Math.round(H * 1.2);
    const neb = document.createElement('canvas'); neb.width = NW; neb.height = NH;
    const nc = neb.getContext('2d');
    nc.fillStyle = '#04060F'; nc.fillRect(0, 0, NW, NH);
    nc.globalCompositeOperation = 'lighter';
    const NCOL = ['0,140,150', '20,70,160', '90,50,150', '0,170,160', '160,110,40'];
    for (let k = 0; k < 70; k++) {
      // clouds gather along a soft diagonal band, like a milky way
      const u = R(), x = lerp(-0.1, 1.1, u) * NW, y = (0.62 - 0.38 * u + (R() - 0.5) * 0.45) * NH;
      const r = 120 + R() * 380, c = NCOL[Math.floor(R() * (k % 7 === 0 ? 5 : 4))], a = 0.035 + R() * 0.06;
      const gr = nc.createRadialGradient(x, y, 0, x, y, r);
      for (let s = 0; s <= 20; s++) { const v = s / 20; gr.addColorStop(v, `rgba(${c},${(a * (1 - E.smooth(v))).toFixed(4)})`); }
      nc.fillStyle = gr; nc.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    nc.globalCompositeOperation = 'source-over';
    { // fine grain so the gradients never band
      const id = nc.getImageData(0, 0, NW, NH), r2 = rng(5);
      for (let i = 0; i < id.data.length; i += 4) { const v = (r2() - 0.5) * 6; id.data[i] += v; id.data[i + 1] += v; id.data[i + 2] += v; }
      nc.putImageData(id, 0, 0);
    }

    // ---------- stars: each twinkles on its own sine (controlled, not random per frame) ----------
    const stars = Array.from({ length: 900 }, (_, i) => {
      const big = hash(i * 3.1) < 0.025;
      return { x: hash(i * 1.3 + 2) * W, y: hash(i * 7.7 + 1) * H, b: 0.25 + 0.75 * hash(i * 4.9) ** 2, f: 0.25 + 1.3 * hash(i * 2.3),
        ph: hash(i * 8.1) * 6.283, r: big ? 2.2 : 0.7 + 1.1 * hash(i * 6.6), big, tint: hash(i * 5.5) < 0.2 ? 1 : hash(i * 5.5) > 0.9 ? 2 : 0, z: 0.3 + 0.7 * hash(i * 9.9) };
    });
    const SHOOT = [[1.3, 1500, 120, -1], [5.9, 380, 90, 1], [7.6, 1350, 70, -1]];   // [t0, x0, y0, dir]

    // ---------- the title, sampled from a hidden canvas ----------
    const fo = { font: F.D, weight: 900 };
    const size = Math.min(170, ...LINES.map(l => fit(l, fo, 0.58 * W)));
    const lineH = size * 1.12, y1 = CY - lineH / 2 - 30, ys = [y1, y1 + lineH];
    const hid = document.createElement('canvas'); hid.width = W; hid.height = H;
    const hc = hid.getContext('2d');
    const font = `900 ${size.toFixed(1)}px "Noto Sans Hebrew"`;
    hc.font = font; hc.direction = 'rtl'; hc.textAlign = 'center'; hc.textBaseline = 'middle'; hc.fillStyle = '#fff';
    LINES.forEach((l, i) => hc.fillText(l, CX, ys[i]));
    const img = hc.getImageData(0, 0, W, H).data, filled = [];
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (img[(y * W + x) * 4 + 3] > 140) filled.push([x, y]);
    report('titleSize', size);

    // ---------- stardust: floats in depth, then spirals into its title pixel (or onto the orbit ring) ----------
    const FOC = 900;
    const P = Array.from({ length: N }, (_, i) => {
      const w = filled[Math.floor(R() * filled.length)], line = w[1] > (ys[0] + ys[1]) / 2 ? 1 : 0;
      const col = line ? 2 : (hash(i * 3.3) < 0.5 ? 1 : 0);
      // start: spread wide in 3D around the frame, drifting slowly toward the camera
      const sx = (R() - 0.5) * W * 1.9, sy = (R() - 0.5) * H * 1.9, sz = 200 + R() * 1300;
      return { i, w, col, sx, sy, sz, v: 40 + 60 * R(), d: hash(i * 2.9) * 0.55 * (Math.hypot(w[0] - CX, w[1] - CY) / (W / 2)) + hash(i * 1.1) * 0.25,
        spin: (hash(i * 7.3) < 0.5 ? -1 : 1) * (1.6 + 1.4 * hash(i * 4.2)), ring: hash(i * 4.4) < 0.13, ra: hash(i * 6.2) * 6.283, rr: 1 + 0.09 * (hash(i * 2.2) - 0.5), tw: hash(i * 3.9) * 6.283 };
    });
    const float = (p, t) => {   // projected position while floating: slow drift toward the camera and a lazy sway
      const z = Math.max(60, p.sz - p.v * t), s = FOC / (FOC + z);
      return [CX + (p.sx + 30 * Math.sin(t * 0.4 + p.tw)) * s, CY + (p.sy + 20 * Math.cos(t * 0.33 + p.tw)) * s, s];
    };
    const target = (p, t) => {
      if (!p.ring) return [p.w[0] + 1.1 * Math.sin(t * 2 + p.i), p.w[1], 1.15];
      const a = p.ra + 0.12 * t;
      return [CX + Math.cos(a) * 860 * p.rr, CY + 10 + Math.sin(a) * 360 * p.rr, 1.1 + 0.3 * Math.sin(a)];
    };
    const pos = (p, t) => {
      const f = float(p, t), k = E.io3(seg(t - p.d, T_ASM0, T_ASM1 - 0.3));
      if (k <= 0) return f;
      const g = target(p, t);
      // spiral in: the remaining offset turns around the target as it shrinks
      const ang = p.spin * (1 - k), ox = f[0] - g[0], oy = f[1] - g[1];
      const rx = ox * Math.cos(ang) - oy * Math.sin(ang), ry = ox * Math.sin(ang) + oy * Math.cos(ang);
      return [g[0] + rx * (1 - k), g[1] + ry * (1 - k), lerp(f[2], g[2], k)];
    };

    // ---------- layers ----------
    const cam = div(root, { left: '0px', top: '0px', width: W + 'px', height: H + 'px', transformOrigin: `${CX}px ${CY}px` });
    const g = canvas2d(cam);
    const sub = row(cam, SUB.split(' '), { x: CX, y: ys[1] + lineH * 0.5 + 70, size: Math.min(58, fit(SUB, { font: F.RUBIK, weight: 500 }, 0.55 * W)), color: '#9EEBE2', font: F.RUBIK, weight: 500 });

    function glint(x, y, r, a, rgb) {   // a bright star: soft core + four point sparkle
      const gr = g.createRadialGradient(x, y, 0, x, y, r * 5);
      for (let s = 0; s <= 12; s++) { const v = s / 12; gr.addColorStop(v, `rgba(${rgb},${(a * 0.5 * (1 - v) ** 2).toFixed(4)})`); }
      g.fillStyle = gr; g.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
      g.strokeStyle = `rgba(${rgb},${(a * 0.7).toFixed(3)})`; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(x - r * 9, y); g.lineTo(x + r * 9, y); g.moveTo(x, y - r * 9); g.lineTo(x, y + r * 9); g.stroke();
    }
    const TINT = ['255,255,255', '150,240,230', '255,215,140'];

    return t => {
      tf(cam, { s: 1 + 0.035 * E.io3(t / DUR) });
      // nebula, drifting slowly
      const intro = seg(t, 0, 1.2);
      g.globalAlpha = 0.35 + 0.65 * E.smooth(intro);
      g.drawImage(neb, -0.1 * W - 40 * Math.sin(t * 0.07) - 30 * t / DUR, -0.1 * H - 20 * t / DUR);
      g.globalAlpha = 1;
      // stars
      g.globalCompositeOperation = 'lighter';
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(6.283 * s.f * t + s.ph);
        const a = s.b * tw * (0.3 + 0.7 * intro);
        const x = s.x - 14 * s.z * t / DUR, y = s.y;
        if (s.big) glint(x, y, s.r, a, TINT[s.tint]);
        else { g.fillStyle = `rgba(${TINT[s.tint]},${a.toFixed(3)})`; g.fillRect(x, y, s.r, s.r); }
      }
      // shooting stars
      for (const [t0, x0, y0, dir] of SHOOT) {
        const u = (t - t0) / 0.7;
        if (u < 0 || u > 1) continue;
        const hx = x0 + dir * 520 * E.o2(u), hy = y0 + 230 * E.o2(u), len = 160 * Math.sin(Math.PI * u);
        const gr = g.createLinearGradient(hx, hy, hx - dir * len, hy - len * 0.44);
        gr.addColorStop(0, `rgba(230,255,250,${(0.9 * Math.sin(Math.PI * u)).toFixed(3)})`); gr.addColorStop(1, 'rgba(230,255,250,0)');
        g.strokeStyle = gr; g.lineWidth = 2.2; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx - dir * len, hy - len * 0.44); g.stroke();
      }
      // stardust, batched by colour and brightness
      const txtA = seg(t, T_TXT, T_TXT + 0.5);
      const B = COL.map(() => [0, 1, 2, 3, 4].map(() => ({ dots: new Path2D(), lines: new Path2D(), n: 0 })));
      for (const p of P) {
        const a = pos(p, t);
        if (a[0] < -40 || a[0] > W + 40 || a[1] < -40 || a[1] > H + 40) continue;
        const b = pos(p, t - 1 / 120), s = a[2];
        const lv = p.ring && t > T_ASM1 ? 4 : clamp(Math.floor((s - 0.45) / 0.2), 0, 3);
        const bk = B[p.col][lv], dx = a[0] - b[0], dy = a[1] - b[1];
        if (dx * dx + dy * dy < 2.5) { const r = 1.3 + 2.2 * s; bk.dots.rect(a[0] - r / 2, a[1] - r / 2, r, r); }
        else { bk.lines.moveTo(b[0], b[1]); bk.lines.lineTo(a[0], a[1]); }
        bk.n++;
      }
      const pin = seg(t, 0.2, 1.4);
      g.lineCap = 'round';
      B.forEach((rw, c) => rw.forEach((bk, lv) => {
        if (!bk.n) return;
        const al = (lv === 4 ? 0.85 : (0.5 + 0.14 * lv) * (1 - 0.72 * txtA)) * pin, rgb = COL[c].join(',');
        g.fillStyle = `rgba(${rgb},${al.toFixed(3)})`; g.fill(bk.dots);
        g.strokeStyle = `rgba(${rgb},${al.toFixed(3)})`; g.lineWidth = 1.3 + 0.7 * Math.min(lv, 3); g.stroke(bk.lines);
      }));
      // a soft warm bloom as the title forms
      const fl = t >= T_TXT ? Math.exp(-(t - T_TXT) * 2.5) * seg(t, T_TXT - 0.2, T_TXT + 0.1) : 0;
      if (fl > 0) {
        const gr = g.createRadialGradient(CX, CY, 0, CX, CY, 720);
        for (let k = 0; k <= 20; k++) { const u = k / 20; gr.addColorStop(u, `rgba(248,192,58,${(0.1 * fl * (1 - u) ** 2).toFixed(4)})`); }
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
      }
      g.globalCompositeOperation = 'source-over';
      // the sharp title (same font and size as the sample, so the dust lands on its pixels)
      if (txtA > 0) {
        g.font = font; g.direction = 'rtl'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.globalAlpha = txtA;
        LINES.forEach((l, i) => { g.fillStyle = i ? '#F8C03A' : '#F4F1EC'; g.fillText(l, CX, ys[i]); });
        g.globalAlpha = 1;
      }
      sub.forEach((w, i) => { const k = rise(t, T_SUB + 0.07 * i, 24); tf(w.g, { o: k.o, y: k.y }); });
    };
  });
})();
