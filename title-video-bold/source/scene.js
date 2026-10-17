// Style 02 (bold type) in the presentation's look: Heebo Black, green / yellow / black / white.
// A light bar opens the frame, each word hits on its own colour field on a half-second grid,
// then everything settles into the deck's title layout on white. Pure function of t, no sfx (the score carries the hits).
(() => {
  'use strict';
  const G = n => 0.3 + 0.5 * n;
  const T_FIN = G(8);
  const SUB = 'איך בינה מלאכותית יכולה לעזור לנו בחיי היום־יום';
  const HB = { font: F.HEEBO, weight: 900 };
  // shots: [word, bg, text colour, entrance]
  const SHOTS = [
    ['בינה', C.GREEN, C.WHITE, 'slam'],
    ['בינה', C.INK, C.YELLOW, 'dense'],
    ['מלאכותית', C.YELLOW, C.INK, 'expand'],
    ['מלאכותית', C.WHITE, C.GREEN, 'dense'],
    ['בגובה', C.GREEN, C.WHITE, 'slide'],
    ['בגובה', C.INK, C.YELLOW, 'dense'],
    ['העיניים', C.WHITE, C.INK, 'select'],
  ];

  scene('main', 0, DUR, { bg: C.INK }, (root) => {
    // ---------- colour fields (outside the camera, hard cuts) ----------
    const fields = SHOTS.map(([, bg], i) => ({ el: rect(root, 0, 0, W, H, { background: bg }), a: G(i), b: i === 6 ? G(8) : G(i + 1) }));
    const finField = rect(root, 0, 0, W, H, { background: C.WHITE });
    // the opening light bar
    const bar = rect(root, 0, H / 2 - 2, W, 4, { background: C.GREEN, transformOrigin: '50% 50%' });
    const cam = grp(root, W / 2, H / 2);

    // ---------- the shot words ----------
    const words = SHOTS.map(([w, , col, mode], i) => {
      const o = Object.assign({ color: col, ls: mode === 'dense' ? -0.05 : mode === 'expand' ? 0.02 : 0 }, HB);
      const size = Math.min(480, fit(w, o, 0.62 * W));
      const g = txt(cam, w, Object.assign({ size, y: -0.02 * H }, o));
      const mw = measure(w, Object.assign({ size }, o)).w;
      return { g, i, mode, size, w: mw, a: G(i), b: i === 6 ? G(8) : G(i + 1), from: Math.min(1.25, (W - 60) / (mw * 1.04)) };
    });
    // selection box for the last word
    const sel = words[6];
    const selSvg = svgEl('svg', cam, { width: 10, height: 10 }); selSvg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
    const selG = svgEl('g', selSvg);
    const BW = sel.w + 70, BH = sel.size * 0.86;
    svgEl('rect', selG, { x: -BW / 2, y: -BH / 2, width: BW, height: BH, fill: 'none', stroke: C.GREEN, 'stroke-width': 4 });
    [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]].forEach(([u, v]) =>
      svgEl('rect', selG, { x: u * BW / 2 - 9, y: v * BH / 2 - 9, width: 18, height: 18, fill: C.WHITE, stroke: C.GREEN, 'stroke-width': 3 }));
    const selLabel = txt(cam, `W ${Math.round(sel.w)}  H ${Math.round(sel.size * 0.72)}`, { font: F.MONO, weight: 600, size: 26, color: C.GREEN, dir: 'ltr', y: BH / 2 + 46 - 0.02 * H });
    const selLock = txt(cam, 'LOCKED', { font: F.MONO, weight: 600, size: 26, color: C.WHITE, dir: 'ltr', y: BH / 2 + 46 - 0.02 * H, css: { background: C.GREEN, padding: '4px 12px' } });
    const curs = cursor(cam, 58, C.INK, C.WHITE);

    // ---------- the final title card (the deck's title slide) ----------
    const fin = grp(cam, 0, 0);
    const L1 = ['בינה', 'מלאכותית'], L2 = ['בגובה', 'העיניים'];
    const fsize = Math.min(270, fit(L1.join(' '), HB, 0.66 * W), fit(L2.join(' '), HB, 0.66 * W));
    const lh = fsize * 1.14, y1 = -0.23 * H, y2 = y1 + lh;
    const r1 = row(fin, L1, Object.assign({ x: 0, y: y1, size: fsize, color: C.INK, gap: fsize * 0.24 }, HB));
    const r2 = row(fin, L2, Object.assign({ x: 0, y: y2, size: fsize, color: C.GREEN, gap: fsize * 0.24 }, HB));
    const leftEdge = r2[1].cx - r2[1].w / 2;
    // the yellow dot with the deck's black outline and offset shadow
    const dot = grp(fin, leftEdge - fsize * 0.32, y2 + fsize * 0.2);
    box(dot, 6, 6, fsize * 0.26, fsize * 0.26, { background: C.INK, borderRadius: '50%' });
    box(dot, 0, 0, fsize * 0.26, fsize * 0.26, { background: C.YELLOW, borderRadius: '50%', border: `5px solid ${C.INK}`, boxSizing: 'border-box' });
    const subSize = Math.min(64, fit(SUB, { font: F.HEEBO, weight: 500 }, 0.56 * W));
    const subRow = row(fin, SUB.split(' '), { x: 0, y: y2 + lh * 0.5 + subSize * 1.5, size: subSize, color: C.INK, font: F.HEEBO, weight: 500, gap: subSize * 0.38 });
    // underline that closes under the subtitle
    const ulW = Math.min(W * 0.56, subRow.reduce((a, w) => a + w.w, 0) + subSize * 0.38 * (subRow.length - 1));
    const ul = box(fin, 0, y2 + lh * 0.5 + subSize * 2.55, ulW, 6, { background: C.YELLOW, transformOrigin: '100% 50%' });
    // corner rings like the deck (grey top left, green bottom right), drawn on the frame, not in the camera
    const rings = svgBox(root, 0, 0, W, H);
    const ringSet = (cx, cy, col, n) => Array.from({ length: n }, (_, k) => svgEl('circle', rings, { cx, cy, r: 60 + k * 12, fill: 'none', stroke: col, 'stroke-width': 2, opacity: 0.9, pathLength: 1 }));
    const ringsA = ringSet(-40, -40, '#B5B5B5', 22), ringsB = ringSet(W + 40, H + 40, '#2FA879', 22);

    // ---------- camera ----------
    const hits = [[G(0), 16], [G(1), 8], [G(4) + 0.05, 10], [G(6) + 0.5, 6], [T_FIN, 8]];

    return t => {
      // fields
      on(bar, t < G(0) + 0.02);
      if (t < G(0) + 0.02) {
        const u = clamp(t / 0.3, 0, 1);
        tf(bar, { x: -W * (1 - S(t + 0.05, 30, 1)), sy: 1 + 2 * seg(t, 0.15, 0.3) });
      }
      fields.forEach(f => on(f.el, t >= f.a && t < f.b));
      on(finField, t >= T_FIN);
      // anticipation: the field leans in a touch before each hit
      // shot words
      let shotIdx = -1;
      words.forEach(wd => {
        const live = t >= wd.a && t < wd.b;
        if (!live) { on(wd.g, false); return; }
        shotIdx = wd.i;
        const u = t - wd.a;
        if (wd.mode === 'slam') { const k = slam(t, wd.a, wd.from); tf(wd.g, { s: k.s, o: k.o }); }
        else if (wd.mode === 'dense') { const k = slam(t, wd.a, 1.08, 30, 0.7); tf(wd.g, { s: k.s, sx: 0.84, o: 1 }); }
        else if (wd.mode === 'expand') {
          const k = S(u, 26, 0.68), c = clamp(k, 0, 1);
          wd.g.inner.style.letterSpacing = lerp(-0.1, 0.02, c).toFixed(3) + 'em';
          tf(wd.g, { sx: lerp(0.6, 1, k), o: 1 });
        } else if (wd.mode === 'slide') {
          const X = tt => (1 - S(tt - wd.a, 30, 0.8)) * W;
          tf(wd.g, { x: X(t), mb: [vel(X, t), 0], o: 1 });
        } else if (wd.mode === 'select') {
          const r = rise(t, wd.a + 0.45, 30); tf(wd.g, { o: r.o, y: r.y });
        }
      });
      // selection box: comes in big and turned, the cursor grabs a handle, it snaps to the word and locks
      const sa = sel.a, live = t >= sa && t < sel.b;
      on(selSvg, live); on(selLabel, live && t < sa + 0.6); on(selLock, live && t >= sa + 0.6); on(curs, live && t < sa + 0.75);
      if (live) {
        const k = S(t - sa, 22, 0.7), sc = lerp(1.15, 1, k), rot = lerp(6, 0, k);
        selG.setAttribute('transform', `rotate(${f2(rot)}) scale(${f2(sc)})`);
        const lk = slam(t, sa + 0.6, 1.2, 30, 0.6); tf(selLock, { s: lk.s, o: lk.o });
        const cx = lerp(BW * 0.9, BW / 2, S(t - sa - 0.1, 14, 0.9)), cy = lerp(BH * 1.1, BH / 2, S(t - sa - 0.1, 14, 0.9));
        const press = t > sa + 0.45 && t < sa + 0.62 ? 0.86 : 1;
        tf(curs, { x: cx * sc, y: cy * sc - 0.02 * H, s: press });
      }
      // final card
      const fo = t >= T_FIN;
      on(fin, fo);
      if (fo) {
        [...r1, ...r2].forEach((w, i) => { const r = rise(t, T_FIN + i * 0.09, 40); tf(w.g, { o: r.o, y: r.y }); });
        const dk = slam(t, T_FIN + 0.5, 1.25, 30, 0.55);
        const beatN = Math.floor((t - T_FIN) / 0.5), pulse = beatN >= 2 ? 0.06 * (1 - S(t - (T_FIN + beatN * 0.5), 18, 0.5)) : 0;
        tf(dot, { s: dk.s * (1 + pulse), o: dk.o });
        subRow.forEach((w, i) => { const r = rise(t, T_FIN + 0.75 + i * 0.05, 24); tf(w.g, { o: r.o, y: r.y }); });
        tf(ul, { sx: clamp(S(t - T_FIN - 1.25, 12, 1), 0.001, 1), o: 1 });
      }
      [...ringsA, ...ringsB].forEach((c, k) => {
        const kk = k % 22, d = clamp(seg(t, T_FIN + 0.3 + kk * 0.03, T_FIN + 1.3 + kk * 0.03), 0, 1);
        c.style.visibility = fo && d > 0 ? 'visible' : 'hidden';
        c.style.strokeDasharray = `${E.o3(d).toFixed(3)} 2`;
      });
      // camera: push and a slight roll per shot, shake on the hits
      const shotA = fo ? T_FIN : shotIdx >= 0 ? G(shotIdx) : 0, su = t - shotA;
      const push = fo ? 1 + 0.035 * E.o2(seg(t, T_FIN, DUR)) : 1 + 0.04 * clamp(su / 0.5, 0, 1);
      const roll = fo ? 0 : (shotIdx % 2 ? -0.6 : 0.6) * clamp(su / 0.5, 0, 1);
      const [sx, sy, sr] = shake(t, hits);
      tf(cam, { x: sx, y: sy, s: push, r: roll + sr });
    };
  });
})();
