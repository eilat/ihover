// scene.js: "who am I" intro for Eilat Brayer. Style 06 (hand-drawn doodle) with her E.B donkey.
// Pure function of t: everything below the build is recomputed from t in the returned seek.
(() => {
  'use strict';
  scene('main', 0, DUR, { bg: C.PAPER }, (root) => {
    const svg = svgBox(root, 0, 0, W, H);
    const defs = svgEl('defs', svg);
    // pencil wobble: fixed seed, defined once, sits on the groups that move (texture moves with them)
    const pf = svgEl('filter', defs, { id: 'pencil', x: '-10%', y: '-10%', width: '120%', height: '120%' });
    svgEl('feTurbulence', pf, { type: 'fractalNoise', baseFrequency: '0.85', numOctaves: 2, seed: 4, result: 'n' });
    svgEl('feDisplacementMap', pf, { in: 'SourceGraphic', in2: 'n', scale: 3.2, xChannelSelector: 'R', yChannelSelector: 'G' });
    const gf = svgEl('filter', defs, { id: 'grain', x: 0, y: 0, width: '100%', height: '100%' });
    svgEl('feTurbulence', gf, { type: 'fractalNoise', baseFrequency: '0.9', numOctaves: 3, seed: 9, result: 'n' });
    svgEl('feColorMatrix', gf, { in: 'n', type: 'matrix', values: '0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 1.4 -0.45' });

    // ---------- hand-drawn shapes (re-jittered 10 times a second: the "boil") ----------
    const ALL = [];
    let SEED = 1;
    const cr = (p, closed) => {
      const n = p.length, at = i => closed ? p[(i + n) % n] : p[clamp(i, 0, n - 1)];
      let d = `M${f2(p[0][0])} ${f2(p[0][1])}`;
      for (let i = 0; i < (closed ? n : n - 1); i++) {
        const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
        d += `C${f2(p1[0] + (p2[0] - p0[0]) / 6)} ${f2(p1[1] + (p2[1] - p0[1]) / 6)} ${f2(p2[0] - (p3[0] - p1[0]) / 6)} ${f2(p2[1] - (p3[1] - p1[1]) / 6)} ${f2(p2[0])} ${f2(p2[1])}`;
      }
      return closed ? d + 'Z' : d;
    };
    const pl = (p, closed) => 'M' + p.map(q => `${f2(q[0])} ${f2(q[1])}`).join('L') + (closed ? 'Z' : '');
    const subdiv = (p, closed, step = 34) => {
      const out = [];
      for (let i = 0; i < (closed ? p.length : p.length - 1); i++) {
        const a = p[i], b = p[(i + 1) % p.length], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
        for (let k = 0; k < n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]);
      }
      if (!closed) out.push(p[p.length - 1]);
      return out;
    };
    const ell = (cx, cy, rx, ry, n = 14, rot = 0) => Array.from({ length: n }, (_, i) => {
      const a = i / n * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry, c = Math.cos(rot), s = Math.sin(rot);
      return [cx + x * c - y * s, cy + x * s + y * c];
    });
    const rc = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    function D(parent, pts, o = {}) {
      const closed = o.closed !== false, smooth = o.smooth !== false;
      const el = svgEl('path', parent, {
        fill: o.fill || 'none', stroke: o.stroke === undefined ? C.INK : o.stroke, 'stroke-width': o.sw ?? 6,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      });
      if (o.draw) el.setAttribute('pathLength', 1);
      const s = { el, pts: smooth ? pts : subdiv(pts, closed), closed, smooth, seed: SEED++ * 17.31, amp: o.amp ?? 2.2 };
      ALL.push(s); return s;
    }
    function boil(step, amp) {
      for (const s of ALL) {
        const a = s.amp * amp;
        const p = s.pts.map((q, i) => [q[0] + (hash(s.seed + i * 7.1 + step * 13.3) - 0.5) * 2 * a, q[1] + (hash(s.seed + i * 3.7 + step * 29.9 + 5) - 0.5) * 2 * a]);
        s.el.setAttribute('d', s.smooth ? cr(p, s.closed) : pl(p, s.closed));
      }
    }
    // self-drawing reveal of a list of shapes (k 0..1 over the whole list), fills fade in behind the line
    function reveal(shapes, k) {
      const n = shapes.length;
      shapes.forEach((s, i) => {
        const ki = clamp(k * (n * 0.6 + 0.4) - i * 0.6, 0, 1);
        s.el.style.strokeDasharray = ki >= 1 ? 'none' : `${ki.toFixed(3)} 2`;
        s.el.style.fillOpacity = seg(ki, 0.55, 1).toFixed(3);
        s.el.style.visibility = ki <= 0 ? 'hidden' : 'visible';
      });
    }
    const G = (parent, attrs = {}) => svgEl('g', parent, attrs);
    const T = (g, s) => g.setAttribute('transform', s);
    const op = (g, o) => { g.style.opacity = o.toFixed(3); g.style.visibility = o <= 0.003 ? 'hidden' : 'visible'; };

    // ---------- layers ----------
    const propL = G(svg, { filter: 'url(#pencil)' });
    const fxL = G(svg);
    const dRoot = G(svg);
    const dBody = G(dRoot, { filter: 'url(#pencil)' });
    const bubL = G(svg);
    const finL = G(svg);

    // ---------- the donkey (from the E.B logo), origin = between the feet ----------
    const FEET = 1000, HOME = 560;
    const tailG = G(dBody);
    D(tailG, [[0, 0], [40, -20], [95, -20], [130, -60], [140, -120]], { closed: false, sw: 18, stroke: C.INK });
    D(tailG, [[0, 0], [40, -20], [95, -20], [130, -60], [140, -120]], { closed: false, sw: 9, stroke: C.YELLOW, amp: 0 });
    D(tailG, [[140, -120], [118, -165], [134, -150], [140, -175], [148, -150], [166, -162], [150, -118]], { fill: C.YELLOW, sw: 5 });
    const legs = [-48, 48].map(x => {
      const g = G(dBody);
      D(g, rc(-34, -10, 34, 168), { fill: C.TEAL, smooth: false });
      D(g, ell(x < 0 ? -6 : 6, 190, 46, 27), { fill: C.YELLOW });
      D(g, [[-22, 204], [22, 204]], { closed: false, sw: 5, stroke: C.ORANGE });
      return { g, x };
    });
    D(dBody, [[-95, -470], [95, -470], [128, -400], [140, -310], [120, -240], [0, -222], [-120, -240], [-140, -310], [-128, -400]], { fill: C.GREY });
    D(dBody, [[-138, -330], [138, -330], [130, -240], [60, -205], [0, -215], [-60, -205], [-130, -240]], { fill: C.TEAL });
    const arms = [-1, 1].map(sd => {
      const g = G(dBody);
      D(g, [[-22, 0], [22, 0], [24, 80], [20, 140], [-20, 140], [-24, 80]], { fill: C.GREY });
      D(g, ell(0, 152, 31, 26), { fill: C.YELLOW });
      return { g, sd };
    });
    // bow tie
    const bow = G(dBody);
    D(bow, [[0, 0], [-62, -32], [-70, 8], [-58, 34]], { fill: C.YELLOW });
    D(bow, [[0, 0], [62, -32], [70, 8], [58, 34]], { fill: C.YELLOW });
    D(bow, ell(0, 0, 15, 14, 8), { fill: C.DARK });
    // head (pivot at the neck)
    const head = G(dBody);
    const ears = [-1, 1].map(sd => {
      const g = G(head);
      D(g, [[-28, 0], [-36, -70], [-16, -150], [0, -165], [16, -150], [34, -70], [28, 0]], { fill: C.GREY });
      D(g, [[-10, -60], [-12, -120], [0, -150], [12, -120], [10, -60]], { fill: C.DARK, sw: 3 });
      return { g, sd };
    });
    D(head, [[-112, -150], [-80, -210], [0, -232], [80, -210], [112, -150], [116, -80], [80, -20], [0, 0], [-80, -20], [-116, -80]], { fill: C.GREY });
    D(head, [[-60, -215], [-40, -255], [-20, -222], [0, -262], [20, -224], [44, -252], [62, -212]], { fill: C.DARK, sw: 4 });
    const cap = G(head);
    D(cap, rc(-86, -232, 86, -206), { fill: C.ORANGE, smooth: false });
    D(cap, rc(-70, -318, 70, -232), { fill: C.YELLOW, smooth: false });
    D(cap, rc(-54, -304, 54, -244), { fill: C.WHITE, smooth: false, sw: 4 });
    // "E.B" drawn as strokes (a logo mark, not text)
    D(cap, [[-18, -292], [-38, -292], [-38, -256], [-18, -256]], { closed: false, smooth: false, sw: 7, stroke: C.ORANGE, amp: 1 });
    D(cap, [[-38, -274], [-22, -274]], { closed: false, sw: 7, stroke: C.ORANGE, amp: 1 });
    D(cap, ell(-6, -258, 4, 4, 6), { fill: C.ORANGE, stroke: C.ORANGE, sw: 2, amp: 0.5 });
    D(cap, [[12, -256], [12, -292], [28, -292], [36, -284], [28, -275], [12, -275], [30, -275], [39, -266], [30, -256], [12, -256]], { closed: false, smooth: false, sw: 7, stroke: C.ORANGE, amp: 1 });
    const muzzle = G(head);
    D(muzzle, [[-92, -70], [-60, -112], [0, -122], [60, -112], [92, -70], [86, -20], [40, 8], [-40, 8], [-86, -20]], { fill: C.TEAL });
    D(muzzle, ell(-32, -88, 10, 6, 8), { fill: C.DARK, sw: 3 });
    D(muzzle, ell(32, -88, 10, 6, 8), { fill: C.DARK, sw: 3 });
    const mouthOpen = D(muzzle, ell(0, -40, 46, 18, 12), { fill: C.DARK, sw: 4 });
    D(muzzle, [[-52, -52], [52, -52], [46, -36], [-46, -36]], { fill: C.WHITE, smooth: false, sw: 4 });
    [-26, 0, 26].forEach(x => D(muzzle, [[x, -52], [x, -36]], { closed: false, sw: 3 }));
    const eyes = [-1, 1].map(sd => {
      const g = G(head);
      D(g, ell(sd * 58, -150, 40, 34, 12), { fill: C.WHITE, sw: 3 });
      const pupil = G(g);
      D(pupil, ell(0, 0, 11, 16, 10), { fill: C.INK, sw: 2 });
      D(pupil, ell(3, -6, 3.5, 3.5, 6), { fill: C.WHITE, stroke: 'none' });
      return { g, pupil, sd };
    });
    D(head, [[-112, -186], [-6, -186], [-6, -112], [-112, -112]], { sw: 16, stroke: C.INK, smooth: false });
    D(head, [[6, -186], [112, -186], [112, -112], [6, -112]], { sw: 16, stroke: C.INK, smooth: false });
    D(head, [[-6, -160], [6, -160]], { closed: false, sw: 12 });

    // ---------- speech bubbles ----------
    const BUB = [
      { a: 3.1, b: 5.3, s: 'היי, אני|אילת ברייר!' },
      { a: 5.6, b: 8.3, s: 'נולדתי וגדלתי|כאן במושב', prop: 'house' },
      { a: 8.6, b: 11.9, s: '16 שנה מעצבת מוצר|ומאפיינת חוויית משתמש', prop: 'screen' },
      { a: 12.2, b: 15.0, s: 'בונה עם אבא|רהיטים מברזל ועץ', prop: 'chair' },
      { a: 15.3, b: 17.9, s: 'ובחודש הקרוב:|מוסקת זיתים', prop: 'olive' },
      { a: 18.2, b: 21.0, s: 'וזאת ההרצאה|הראשונה שלי...' },
    ];
    const BX0 = 860, BX1 = 1790, MOUTH = [HOME + 40, FEET - 520];
    const HF = { font: F.HAND, weight: 700 };
    function textBlock(parent, s, size, cx, cy, maxW, gapK = 0.26) {
      const o = Object.assign({ size }, HF), gap = size * gapK;
      const words = s.replace(/\|/g, ' ').split(' '), ws = words.map(w => measure(w, o).w), lines = [[]];
      let cur = 0, idx = 0;
      if (s.includes('|')) { lines.length = 0; s.split('|').forEach(l => lines.push(l.split(' ').map(() => idx++))); }
      else words.forEach((w, i) => {
        const add = (lines[lines.length - 1].length ? gap : 0) + ws[i];
        if (cur + add > maxW && lines[lines.length - 1].length) { lines.push([]); cur = 0; }
        cur += (lines[lines.length - 1].length ? gap : 0) + ws[i]; lines[lines.length - 1].push(i);
      });
      const lh = size * 0.95, out = [];
      let lw = 0;
      lines.forEach((ln, li) => {
        const tot = ln.reduce((a, i) => a + ws[i], 0) + gap * (ln.length - 1);
        lw = Math.max(lw, tot);
        let xr = cx + tot / 2;
        const y = cy + (li - (lines.length - 1) / 2) * lh;
        ln.forEach(i => {
          const g = G(parent);
          const t = svgEl('text', g, { x: f2(xr - ws[i] / 2), y: f2(y), 'text-anchor': 'middle', 'dominant-baseline': 'central', direction: 'rtl', fill: C.INK, 'font-family': 'Amatic SC', 'font-weight': 700, 'font-size': size });
          t.textContent = words[i];
          out.push(g); xr -= ws[i] + gap;
        });
      });
      return { words: out, w: lw, h: lines.length * lh };
    }
    BUB.forEach((B, k) => {
      const g = G(bubL), shapeG = G(g, { filter: 'url(#pencil)' }), txG = G(g);
      const lw = Math.max(...B.s.split('|').map(l => measure(l, Object.assign({ size: 150 }, HF)).w));
      const size = Math.min(150, 150 * 780 / lw), tb = textBlock(txG, B.s, size, 0, 0, 800);
      const bw = tb.w + 140, bh = tb.h + 90;
      const cx = clamp(1300, BX0 + bw / 2, BX1 - bw / 2), cy = 70 + bh / 2 + 10;
      B.cx = cx; B.cy = cy; B.bw = bw; B.bh = bh;
      T(txG, `translate(${f2(cx)} ${f2(cy)})`);
      // tail from the lower left of the bubble towards the mouth
      const base = [cx - bw / 2 + 8, cy + bh / 2 - 60], tip = [lerp(base[0], MOUTH[0], 0.6), lerp(base[1], MOUTH[1], 0.6) + 10];
      const tailPts = [[base[0], base[1] - 34], tip, [base[0] + 4, base[1] + 30]];
      const x0 = cx - bw / 2, x1 = cx + bw / 2, y0 = cy - bh / 2, y1 = cy + bh / 2, r = 46;
      const body = [[x0 + r, y0], [cx, y0 - 6], [x1 - r, y0], [x1 - 6, y0 + 8], [x1, y0 + r], [x1 + 5, cy], [x1, y1 - r], [x1 - 6, y1 - 8], [x1 - r, y1], [cx, y1 + 6], [x0 + r, y1], [x0 + 6, y1 - 8], [x0, y1 - r], [x0 - 5, cy], [x0, y0 + r], [x0 + 6, y0 + 8]];
      B.shapes = [D(shapeG, tailPts, { fill: C.WHITE, smooth: false, draw: true }), D(shapeG, body, { fill: C.WHITE, draw: true })];
      B.cover = D(shapeG, [[base[0] + 12, base[1] - 26], [lerp(base[0], tip[0], 0.25) + 6, lerp(base[1], tip[1], 0.25)], [base[0] + 14, base[1] + 22]], { fill: C.WHITE, stroke: 'none', smooth: false, amp: 0.6 });
      B.g = g; B.words = tb.words; B.origin = tip;
      sfx(B.a, 'pop', 0.7);
      B.words.forEach((_, i) => sfx(B.a + 0.3 + i * 0.13, 'tick', 0.35));
    });
    // the little "shaking!" shout
    const shout = { a: 19.35, b: 21.0, g: G(bubL) };
    {
      const sg = G(shout.g, { filter: 'url(#pencil)' });
      const cx = 1330, cy = 770, pts = [];
      for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2, rr = i % 2 ? 1 : 1.22; pts.push([cx + Math.cos(a) * 250 * rr, cy + Math.sin(a) * 120 * rr]); }
      shout.shape = D(sg, pts, { fill: C.YELLOW, smooth: false, draw: true });
      shout.words = textBlock(G(shout.g), 'משקשקת!', 160, cx, cy, 800).words;
      shout.cx = cx; shout.cy = cy;
      sfx(shout.a, 'popHi', 0.8);
    }

    // ---------- props (drawn in pencil, bottom right) ----------
    const PX = 1320, PY = 800;
    const props = {};
    function prop(name, build) { const g = G(propL); T(g, `translate(${PX} ${PY})`); props[name] = { g, shapes: build(g) }; }
    prop('house', g => [
      D(g, [[-260, 150], [360, 150]], { closed: false, smooth: false, draw: true }),
      D(g, rc(-130, -30, 120, 150), { fill: '#F6D9A8', smooth: false, draw: true }),
      D(g, [[-165, -30], [-5, -170], [155, -30]], { fill: C.ORANGE, smooth: false, draw: true }),
      D(g, rc(-95, 60, -40, 150), { fill: C.TEAL, smooth: false, draw: true }),
      D(g, rc(20, 20, 85, 80), { fill: C.WHITE, smooth: false, draw: true }),
      D(g, [[52, 20], [52, 80]], { closed: false, smooth: false, draw: true, sw: 4 }),
      ...[180, 230, 280, 330].map(x => D(g, [[x - 17, 150], [x - 17, 30], [x, 8], [x + 17, 30], [x + 17, 150]], { fill: C.WOOD, smooth: false, draw: true, sw: 5 })),
      D(g, [[150, 70], [360, 70]], { closed: false, smooth: false, draw: true, sw: 5 }),
    ]);
    prop('screen', g => [
      D(g, rc(-210, -150, 210, 110), { fill: C.WHITE, smooth: false, draw: true }),
      D(g, rc(-188, -128, 188, -94), { fill: C.TEAL, smooth: false, draw: true, sw: 4 }),
      D(g, rc(-188, -76, -40, 88), { fill: '#FBE3A4', smooth: false, draw: true, sw: 4 }),
      ...[-60, -25, 10, 45].map((y, i) => D(g, [[-15, y], [170 - i * 30, y]], { closed: false, smooth: false, draw: true, sw: 5 })),
      D(g, rc(-25, 110, 25, 150), { fill: C.GREY, smooth: false, draw: true, sw: 5 }),
      D(g, rc(-100, 150, 100, 168), { fill: C.GREY, smooth: false, draw: true, sw: 5 }),
      D(g, [[95, 40], [99, 92], [111, 80], [124, 103], [133, 98], [121, 76], [138, 75]], { fill: C.WHITE, smooth: false, draw: true, sw: 4 }),
    ]);
    prop('chair', g => [
      D(g, [[-200, 160], [260, 160]], { closed: false, smooth: false, draw: true }),
      D(g, [[-100, 160], [-100, -190]], { closed: false, smooth: false, draw: true, sw: 11 }),
      D(g, [[100, 160], [100, -190]], { closed: false, smooth: false, draw: true, sw: 11 }),
      D(g, rc(-120, -170, 120, -130), { fill: C.WOOD, smooth: false, draw: true }),
      D(g, rc(-120, -100, 120, -60), { fill: C.WOOD, smooth: false, draw: true }),
      D(g, rc(-130, -10, 130, 26), { fill: C.WOOD, smooth: false, draw: true }),
      D(g, [[-100, 100], [100, 100]], { closed: false, smooth: false, draw: true, sw: 8 }),
    ]);
    const sparks = G(props.chair.g);
    const sparkLines = Array.from({ length: 9 }, (_, i) => {
      const a = -Math.PI * (0.1 + 0.8 * i / 8), r0 = 22, r1 = 70 + 40 * hash(i + 3);
      return D(sparks, [[100 + Math.cos(a) * r0, 100 + Math.sin(a) * r0], [100 + Math.cos(a) * r1, 100 + Math.sin(a) * r1]], { closed: false, sw: 6, stroke: i % 2 ? C.YELLOW : C.ORANGE, amp: 3 });
    });
    prop('olive', g => {
      const stem = [[-260, -10], [-120, -60], [20, -70], [160, -40], [270, 10]];
      const out = [D(g, stem, { closed: false, sw: 10, stroke: C.WOOD, draw: true })];
      [[-200, -34, -0.9, 1], [-150, -50, 0.7, -1], [-60, -66, -0.8, 1], [0, -70, 0.9, -1], [90, -58, -0.6, 1], [160, -42, 0.8, -1], [230, -10, -0.3, 1]].forEach(([x, y, r, sd]) => {
        out.push(D(g, ell(x + 34 * Math.cos(r), y + sd * 40, 58, 20, 12, r), { fill: C.OLIVE, sw: 4, draw: true }));
      });
      [[-100, 20], [60, 10], [140, 40], [-20, 0]].forEach(([x, y], i) => out.push(D(g, ell(x, y, 22, 28, 10), { fill: i % 2 ? C.OLIVED : '#7A8B3A', sw: 4, draw: true })));
      return out;
    });
    const PROPT = {};
    BUB.forEach(B => { if (B.prop) { PROPT[B.prop] = [B.a + 0.25, B.b]; sfx(B.a + 0.25, 'swish', 0.4); } });

    // falling olive, sweat drops, motion lines
    const olive = G(fxL, { filter: 'url(#pencil)' });
    D(olive, ell(0, 0, 20, 25, 10), { fill: C.OLIVED, sw: 4 });
    D(olive, [[0, -24], [6, -40]], { closed: false, sw: 4, stroke: C.WOOD });
    const OL0 = 16.15, OLY0 = -60, OLX = HOME + 30, CAPTOP = FEET - 470 - 318 - 22;
    const OLHIT = OL0 + Math.sqrt(2 * (CAPTOP - OLY0) / 5200);
    sfx(OLHIT, 'boing', 0.6); sfx(OLHIT, 'thud', 0.5);
    const drops = [19.15, 19.6, 20.05, 20.45].map((t0, i) => {
      const g = G(fxL);
      D(g, [[0, -26], [14, 0], [10, 14], [0, 18], [-10, 14], [-14, 0]], { fill: '#9FD6E8', sw: 4 });
      return { g, t0, sd: i % 2 ? 1 : -1 };
    });
    const mlines = G(fxL);
    const lift = [-60, 0, 60].map(x => D(mlines, [[x, 20], [x, 70]], { closed: false, sw: 5 }));
    const dust = [-1, 1].map(sd => D(mlines, [[sd * 80, 0], [sd * 120, -20], [sd * 160, -10]], { closed: false, sw: 5 }));
    const shiver = [-1, 1].flatMap(sd => [0, 1].map(j => D(mlines, [[sd * (165 + j * 26), -470 + j * 60], [sd * (180 + j * 26), -420 + j * 60], [sd * (165 + j * 26), -370 + j * 60]], { closed: false, sw: 5 })));

    // ---------- the final card ----------
    const FN = 21.3;
    const nameSize = Math.min(250, fit('אילת ברייר', HF, 860));
    const nameW = textBlock(finL, 'אילת ברייר', nameSize, 1300, 400, 2000).words;
    const ul = G(finL, { filter: 'url(#pencil)' });
    const underline = D(ul, [[1640, 520], [1420, 532], [1180, 526], [960, 538]], { closed: false, sw: 9, stroke: C.TEAL, draw: true });
    const subW = textBlock(finL, 'מעצבת מוצר וחוויית משתמש', 130, 1300, 640, 2000).words;
    sfx(FN, 'pop', 0.7); nameW.forEach((_, i) => sfx(FN + 0.1 + i * 0.16, 'tick', 0.4));
    sfx(FN + 0.9, 'chime', 0.6);

    // paper grain on top, static
    svgEl('rect', svg, { x: 0, y: 0, width: W, height: H, filter: 'url(#grain)', opacity: 0.09 });

    // ---------- the donkey's timeline ----------
    const X = track(2350, [[0.1, HOME, 3.4, 1]]);
    const CROUCH = 2.15, UP = 2.42, LAND = 2.86, HJ = 70;
    for (let i = 0; i < 8; i++) sfx(0.25 + i * 0.24, 'tick', 0.25);
    sfx(UP, 'boing', 0.8); sfx(LAND, 'thud', 0.8);
    const tremble = t => clamp(sp(t, 19.0, 18) - sp(t, 20.9, 12), 0, 1);
    for (let tt = 19.05; tt < 20.85; tt += 0.11) sfx(tt, 'key', 0.22);
    const WAVES = [[3.3, 4.9], [21.6, 23.4]];
    const waveK = t => Math.max(...WAVES.map(([a, b]) => clamp(sp(t, a, 14) - sp(t, b, 12), 0, 1)));
    const BLINKS = [1.4, 4.3, 7.4, 10.6, 13.9, OLHIT + 0.02, 18.7, 21.1, 23.6];
    const talkWin = BUB.map(B => [B.a + 0.25, B.a + 0.4 + B.words.length * 0.13]).concat([[shout.a, shout.a + 0.5], [FN, FN + 0.6]]);
    const lookX = track(-6, [[2.1, 0], [5.8, 6], [8.0, 0], [8.9, 7], [11.4, 0], [12.4, 7], [14.6, 0], [15.6, 7], [OLHIT - 0.25, 0], [17.4, 0], [18.3, 0]], 10, 0.8);
    const lookY = track(0, [[OLHIT - 0.35, -9], [OLHIT + 0.6, 0]], 12, 0.8);
    const bodyY = t => {
      if (t < UP) return 0;
      const u = (t - UP) / (LAND - UP);
      return u < 1 ? -4 * HJ * u * (1 - u) : 0;
    };

    return t => {
      const step = Math.floor(t * 10);
      boil(step, 1 + 1.6 * tremble(t));
      // body placement
      const x = X(t), vx = vel(X, t), mv = clamp(Math.abs(vx) / 4, 0, 1), dist = 2350 - x;
      const ph = dist / 75, bob = -9 * Math.abs(Math.sin(ph)) * mv;
      const tr = tremble(t), shx = tr * 6 * Math.sin(t * Math.PI * 2 * 15);
      const crouch = clamp(sp(t, CROUCH, 30) - sp(t, UP, 45), 0, 1);
      const y = bodyY(t), vy = vel(bodyY, t);
      const air = t > UP && t < LAND;
      const land = t >= LAND ? 0.17 * (1 - S(t - LAND, 16, 0.4)) : 0;
      const bonk = t >= OLHIT ? 0.07 * (1 - S(t - OLHIT, 18, 0.35)) : 0;
      const breathe = 0.012 * Math.sin(t * 2.4);
      let sy = 1 + breathe - 0.17 * crouch - land - bonk + (air ? 0.08 * Math.min(1, Math.abs(vy) / 8) : 0);
      let sx = 1 + (1 - sy) * 0.6;
      const fin = sp(t, FN - 0.2, 6);
      T(dRoot, `translate(${f2(x + shx)} ${f2(FEET + y + bob)})`);
      T(dBody, `scale(${sx.toFixed(4)} ${sy.toFixed(4)})`);
      // legs walk, tremble at the knees
      legs.forEach((L, i) => {
        const a = 22 * Math.sin(ph + i * Math.PI) * mv + tr * 3 * Math.sin(t * 90 + i) + (air ? (i ? 8 : -8) : 0);
        T(L.g, `translate(${L.x} -232) rotate(${f2(a)})`);
      });
      // arms: swing while walking, wave, push the glasses, thumbs up for the chair
      const wv = waveK(t);
      const glasses = clamp(sp(t, 9.3, 12) - sp(t, 10.2, 12), 0, 1);
      const proud = clamp(sp(t, 13.0, 12) - sp(t, 14.4, 12), 0, 1);
      const scared = clamp(sp(t, 18.9, 14) - sp(t, 20.9, 12), 0, 1);
      arms.forEach((A, i) => {
        let a = A.sd * -12 + 16 * Math.sin(ph + (i ? 0 : Math.PI)) * mv + (air ? A.sd * -40 : 0);
        if (A.sd > 0) a += (-150 - a) * wv + 28 * wv * Math.sin((t - 3.3) * Math.PI * 2 * 2.2) + (-80 - a) * proud;
        if (A.sd < 0) a += (165 - a) * glasses;
        a += A.sd * -28 * scared;
        T(A.g, `translate(${A.sd * 100} -448) rotate(${f2(a)})`);
      });
      T(bow, `translate(0 -470) rotate(${f2(4 * Math.sin(t * 3.1) + tr * 6 * Math.sin(t * 70))})`);
      // head: idle sway, bonk squash
      const hr = 2.5 * Math.sin(t * 1.3) + 3 * mv * Math.sin(ph * 2) + tr * 1.5 * Math.sin(t * 80);
      T(head, `translate(0 ${f2(-470 + bonk * 120)}) rotate(${f2(hr)})`);
      T(cap, `rotate(${f2(-4 + (t >= OLHIT ? -10 * (1 - S(t - OLHIT, 14, 0.4)) : 0))})`);
      // ears and tail follow through (from the body's velocity a moment ago)
      const lagVy = vel(bodyY, t - 0.06);
      ears.forEach(E => {
        const a = E.sd * 30 + clamp(lagVy * 1.6, -26, 26) * E.sd + 9 * mv * Math.sin(ph) + tr * 7 * Math.sin(t * 60 + E.sd) + E.sd * 14 * scared;
        T(E.g, `translate(${E.sd * 58} -205) rotate(${f2(a)})`);
      });
      T(tailG, `translate(70 -265) rotate(${f2(10 * Math.sin(t * 2.6) + 14 * mv * Math.sin(ph) + tr * 8 * Math.sin(t * 50))})`);
      // eyes: look, blink, cross after the bonk
      const blink = Math.max(...BLINKS.map(b => clamp(1 - Math.abs(t - b) / 0.07, 0, 1)));
      const cross = t >= OLHIT ? clamp(1 - S(t - OLHIT - 0.6, 10, 1), 0, 1) * clamp((t - OLHIT) / 0.05, 0, 1) : 0;
      eyes.forEach(E => {
        T(E.g, `translate(0 -150) scale(1 ${f2(1 - 0.9 * blink)}) translate(0 150)`);
        const px = E.sd * 58 + lookX(t) - E.sd * 12 * cross, py = -148 + lookY(t) + 6 * scared;
        T(E.pupil, `translate(${f2(px)} ${f2(py)}) scale(${f2(1 - 0.25 * scared)})`);
      });
      // mouth: talks while words appear, chatters while shaking
      const talking = talkWin.some(([a, b]) => t >= a && t <= b);
      const open = (talking ? 0.35 + 0.65 * Math.abs(Math.sin(t * 15)) : 0.15) + tr * 0.5 * Math.abs(Math.sin(t * 57));
      mouthOpen.el.setAttribute('transform', `translate(0 -40) scale(1 ${f2(clamp(open, 0.12, 1.3))}) translate(0 40)`);

      // bubbles: pop out of the tail tip, draw the outline, words rise one by one
      BUB.forEach(B => {
        const o = clamp(sp(t, B.a, 22) - sp(t, B.b, 20), 0, 1);
        op(B.g, o);
        if (o <= 0) return;
        const s = 0.55 + 0.45 * S(t - B.a, 20, 0.62) - 0.06 * sp(t, B.b, 20);
        T(B.g, `translate(${f2(B.origin[0])} ${f2(B.origin[1])}) scale(${f2(s)}) translate(${f2(-B.origin[0])} ${f2(-B.origin[1])})`);
        reveal(B.shapes, seg(t, B.a, B.a + 0.35));
        op(B.cover.el, seg(t, B.a + 0.25, B.a + 0.36));
        B.words.forEach((w, i) => { const r = rise(t, B.a + 0.3 + i * 0.13, 30); op(w, r.o); T(w, `translate(0 ${f2(r.y)})`); });
      });
      {
        const o = clamp(sp(t, shout.a, 26) - sp(t, shout.b, 20), 0, 1);
        op(shout.g, o);
        if (o > 0) {
          const s = 0.5 + 0.5 * S(t - shout.a, 24, 0.5), j = 6 * Math.sin(t * 70);
          T(shout.g, `translate(${f2(shout.cx + j)} ${f2(shout.cy)}) scale(${f2(s)}) translate(${-shout.cx} ${-shout.cy})`);
          reveal([shout.shape], seg(t, shout.a, shout.a + 0.25));
          shout.words.forEach(w => { const r = rise(t, shout.a + 0.15, 30); op(w, r.o); T(w, `translate(0 ${f2(r.y)})`); });
        }
      }
      // props
      for (const name in props) {
        const [a, b] = PROPT[name], Pp = props[name];
        const o = clamp(1 - sp(t, b, 18), 0, 1) * (t >= a ? 1 : 0);
        op(Pp.g, o);
        if (o <= 0) continue;
        const s = 1 - 0.08 * sp(t, b, 18), jx = (hash(step * 3.1) - 0.5) * 2, jy = (hash(step * 5.7) - 0.5) * 2;
        T(Pp.g, `translate(${f2(PX + jx)} ${f2(PY + jy)}) scale(${f2(s)})`);
        reveal(Pp.shapes, seg(t, a, a + 1.1));
      }
      const spk = t > 13.0 && t < 14.4;
      sparkLines.forEach((L, i) => op(L.el, spk && hash(step * 1.7 + i * 3.3 + Math.floor(t * 24)) > 0.45 ? 1 : 0));
      // olive bonk
      if (t < OL0 || t > OLHIT + 1.2) op(olive, 0);
      else {
        let ox = OLX, oy, rot = 0;
        if (t < OLHIT) oy = OLY0 + fall(t, OL0);
        else { const u = t - OLHIT; ox = OLX + 330 * u; oy = CAPTOP - 520 * u + 0.5 * 3200 * u * u; rot = 400 * u; }
        op(olive, clamp((OLHIT + 1.2 - t) / 0.3, 0, 1));
        T(olive, `translate(${f2(ox)} ${f2(oy)}) rotate(${f2(rot)})`);
      }
      // sweat
      drops.forEach(dp => {
        const u = t - dp.t0;
        if (u < 0 || u > 0.75) { op(dp.g, 0); return; }
        op(dp.g, clamp((0.75 - u) / 0.15, 0, 1) * clamp(u / 0.05, 0, 1));
        T(dp.g, `translate(${f2(x + dp.sd * (130 + 160 * u))} ${f2(FEET - 700 - 120 * u + fall(dp.t0 + u, dp.t0, -200, 2600))})`);
      });
      // motion lines
      T(mlines, `translate(${f2(x)} ${FEET})`);
      lift.forEach(L => op(L.el, t > UP && t < UP + 0.25 ? 1 : 0));
      dust.forEach(L => op(L.el, t > LAND && t < LAND + 0.3 ? 1 : 0));
      shiver.forEach((L, i) => op(L.el, tr > 0.3 && (step + i) % 2 === 0 ? 1 : 0));
      // final card
      nameW.forEach((w, i) => { const r = rise(t, FN + 0.1 + i * 0.16, 36); op(w, r.o); T(w, `translate(0 ${f2(r.y)})`); });
      reveal([underline], seg(t, FN + 0.45, FN + 1.0));
      subW.forEach((w, i) => { const r = rise(t, FN + 0.8 + i * 0.12, 30); op(w, r.o); T(w, `translate(0 ${f2(r.y)})`); });
      void fin;
    };
  });
})();
