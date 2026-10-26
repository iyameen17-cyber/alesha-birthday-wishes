/* scenes.js — a little animated scene for every hourly card.
   Alesha's panda wears the pink bow; Yameen's panda has the heart on its tummy. */
window.Scenes = (() => {
  'use strict';
  const K = '#2b2238';
  let uid = 0;
  const seeded = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;

  function sky(h) {
    if (h <= 4 || h >= 21) return { a: '#120a35', b: '#3d1d6e' };
    if (h === 5) return { a: '#26185a', b: '#ff9aa8' };
    if (h <= 7) return { a: '#ffb3a7', b: '#ffe6bf' };
    if (h <= 11) return { a: '#9fd6ff', b: '#fff0f7' };
    if (h <= 15) return { a: '#86ccff', b: '#eef9ff' };
    if (h <= 17) return { a: '#ffbf7a', b: '#ffe2ee' };
    if (h === 18) return { a: '#ff7d6b', b: '#ffc58f' };
    return { a: '#47207f', b: '#ff8fbd' };
  }

  /* ---------- characters ---------- */
  function panda(o) {
    const her = o.kind === 'her';
    const eyes = o.eyes === 'happy'
      ? '<g fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"><path d="M61 89q9-11 18 0"/><path d="M121 89q9-11 18 0"/></g>'
      : o.eyes === 'sleep'
        ? '<g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M61 85q9 8 18 0"/><path d="M121 85q9 8 18 0"/></g>'
        : `<g class="blink"><circle cx="70" cy="84" r="8" fill="#fff"/><circle cx="71" cy="85.5" r="5.4" fill="${K}"/><circle cx="73.5" cy="82" r="2.1" fill="#fff"/><circle cx="130" cy="84" r="8" fill="#fff"/><circle cx="129" cy="85.5" r="5.4" fill="${K}"/><circle cx="131.5" cy="82" r="2.1" fill="#fff"/></g>`;
    const mouth = o.kiss
      ? '<path d="M100 126l-7-6.5a4.3 4.3 0 0 1 7-5 4.3 4.3 0 0 1 7 5z" fill="#ff4f8f"/>'
      : `<path d="M89 115q5.5 7 11 0q5.5 7 11 0" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`;
    const bow = her ? '<g transform="translate(150 28) rotate(18)"><path d="M0 0C-6-15-27-15-25 0-27 15-6 15 0 0z" fill="#ff4f8f"/><path d="M0 0C6-15 27-15 25 0 27 15 6 15 0 0z" fill="#ff4f8f"/><circle r="6.5" fill="#ff8fbd"/></g>' : '';
    const scarf = o.scarf ? `<path d="M50 132q50 22 100 0l3 16q-53 24-106 0z" fill="${o.scarf}"/><path d="M${her ? 74 : 126} 146l-8 34 14 2 6-30z" fill="${o.scarf}"/>` : '';
    const blush = o.blush ?? .6;
    return `<g transform="translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) scale(${o.s})"><g class="pd ${o.cls || ''}">
      <ellipse cx="100" cy="226" rx="56" ry="6" fill="rgba(30,10,50,.18)"/>
      <ellipse cx="66" cy="208" rx="25" ry="16" fill="${K}"/><ellipse cx="134" cy="208" rx="25" ry="16" fill="${K}"/>
      <ellipse cx="100" cy="164" rx="56" ry="50" fill="#fff"/><ellipse cx="100" cy="174" rx="33" ry="29" fill="#f6f0fa"/>
      ${her ? '' : '<path d="M100 188l-11-10a7 7 0 0 1 11-8.5 7 7 0 0 1 11 8.5z" fill="#ff6f9f"/>'}
      ${scarf}
      <g transform="rotate(${o.armL || 0} 54 134)"><ellipse cx="54" cy="160" rx="15" ry="30" transform="rotate(22 54 160)" fill="${K}"/></g>
      <g transform="rotate(${o.armR || 0} 146 134)"><ellipse cx="146" cy="160" rx="15" ry="30" transform="rotate(-22 146 160)" fill="${K}"/></g>
      <g transform="rotate(${o.tilt || 0} 100 145)">
        <circle cx="44" cy="40" r="23" fill="${K}"/><circle cx="156" cy="40" r="23" fill="${K}"/>
        <ellipse cx="100" cy="88" rx="68" ry="60" fill="#fff"/>
        <ellipse cx="68" cy="86" rx="17" ry="21" transform="rotate(30 68 86)" fill="${K}"/><ellipse cx="132" cy="86" rx="17" ry="21" transform="rotate(-30 132 86)" fill="${K}"/>
        ${eyes}
        <ellipse cx="100" cy="106" rx="10" ry="7" fill="${K}"/>
        ${mouth}
        <ellipse cx="52" cy="111" rx="11" ry="7" fill="#ff8fb3" opacity="${blush}"/><ellipse cx="148" cy="111" rx="11" ry="7" fill="#ff8fb3" opacity="${blush}"/>
        ${bow}
      </g>
    </g></g>`;
  }

  /* two pandas: 'hug' (arms around each other), 'kiss', or 'side' (side by side) */
  function pairParts(kind, cx, gy, s, o = {}) {
    const w = 200 * s, y = gy - 232 * s + 6 * s;
    const A = { kind: 'her', s, y, blush: 1, scarf: o.scarfA, cls: o.clsA || 'sway' };
    const B = { kind: 'me', s, y, blush: 1, scarf: o.scarfB, cls: o.clsB || 'sway' };
    if (kind === 'hug') {
      Object.assign(A, { x: cx - .8 * w, eyes: o.eyes || 'happy', armR: -80 });
      Object.assign(B, { x: cx - .2 * w, eyes: o.eyes || 'happy', armL: 80 });
    } else if (kind === 'kiss') {
      Object.assign(A, { x: cx - .87 * w, eyes: 'happy', tilt: 12, kiss: true });
      Object.assign(B, { x: cx - .13 * w, eyes: 'happy', tilt: -12, kiss: true });
    } else {
      const g = o.gap || 0;
      Object.assign(A, { x: cx - .9 * w - g, eyes: o.eyes || 'open', blush: .75, tilt: o.tilt || 0, armR: o.armA || 0, kiss: o.kiss, cls: o.clsA || 'bob' });
      Object.assign(B, { x: cx - .1 * w + g, eyes: o.eyes || 'open', blush: .75, tilt: -(o.tilt || 0), armL: o.armB || 0, kiss: o.kiss, cls: o.clsB || 'bob2' });
    }
    return [panda(A), panda(B), A, B];
  }
  const pair = (...a) => { const p = pairParts(...a); return p[0] + p[1]; };

  /* ---------- scenery ---------- */
  const base = (id, c) => `<defs><linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient><radialGradient id="gl${id}"><stop offset="0" stop-color="#fff6c8" stop-opacity=".85"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient></defs><rect width="400" height="250" fill="url(#sk${id})"/>`;
  function stars(n, seed) {
    const r = seeded(seed);
    let out = '';
    for (let i = 0; i < n; i++) out += `<circle class="tw" style="animation-delay:${(-r() * 3).toFixed(2)}s" cx="${(r() * 400).toFixed(1)}" cy="${(r() * 150).toFixed(1)}" r="${(.6 + r() * 1.3).toFixed(2)}" fill="#fff"/>`;
    return out;
  }
  const shoot = (v = 0) => v ? '<path class="shoot s2" d="M120 26l-80 30" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>' : '<path class="shoot" d="M340 16l-90 34" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
  const fullMoon = (x, y, r, id) => `<circle cx="${x}" cy="${y}" r="${r * 2.3}" fill="url(#gl${id})"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff3c4"/><circle cx="${x - r * .3}" cy="${y - r * .2}" r="${r * .18}" fill="#f1e1a4"/><circle cx="${x + r * .35}" cy="${y + r * .3}" r="${r * .13}" fill="#f1e1a4"/>`;
  const crescent = (x, y, r, id) => `<defs><mask id="cr${id}"><rect width="400" height="250" fill="#fff"/><circle cx="${x + r * .42}" cy="${y - r * .28}" r="${r * .86}" fill="#000"/></mask></defs><circle cx="${x}" cy="${y}" r="${r * 2}" fill="url(#gl${id})" opacity=".7"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff1bd" mask="url(#cr${id})"/>`;
  const sun = (x, y, r, id) => `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="url(#gl${id})"/><g class="sunp"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff1a8"/></g>`;
  const hill = (c1, c2) => `<path d="M0 196C90 170 170 186 240 180S360 168 400 178V250H0Z" fill="${c1}"/><path d="M0 214C120 196 260 214 400 204V250H0Z" fill="${c2}"/>`;
  const NIGHT = ['#2a1a56', '#3a226f'], DAY = ['#bfe8b4', '#a3d995'];
  const cloud = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><g class="drift"><ellipse cx="0" cy="0" rx="26" ry="11" fill="#fff" opacity=".92"/><ellipse cx="-12" cy="-7" rx="14" ry="11" fill="#fff" opacity=".92"/><ellipse cx="10" cy="-10" rx="16" ry="14" fill="#fff" opacity=".92"/></g></g>`;
  const popHeart = (x, y, cls = '') => `<g transform="translate(${x} ${y})"><g class="pop ${cls}"><path d="M0 13C-22-2-15-20 0-9 15-20 22-2 0 13Z" fill="#ff4f8f"/><ellipse cx="-7" cy="-6" rx="3.5" ry="2" fill="#fff" opacity=".6" transform="rotate(-30 -7 -6)"/></g></g>`;
  const birds = () => [[30, 0], [60, 4], [44, -7]].map(([y, d]) => `<g transform="translate(0 ${y})"><g class="fly" style="animation-delay:${d}s"><path d="M0 0q5-6 10 0q5-6 10 0" stroke="#5b4a5a" stroke-width="1.8" fill="none" stroke-linecap="round"/></g></g>`).join('');

  function lahore(x, y, s, col, lit) {
    const win = lit ? '<g fill="#ffd27a"><rect x="20" y="-28" width="8" height="12" rx="4"/><rect x="40" y="-28" width="8" height="12" rx="4"/><rect x="71" y="-31" width="8" height="17" rx="4"/><rect x="102" y="-28" width="8" height="12" rx="4"/><rect x="122" y="-28" width="8" height="12" rx="4"/><circle cx="226" cy="-162" r="3"/></g>' : '';
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="${col}">
      <rect x="0" y="-40" width="150" height="40"/>
      <path d="M45-40Q45-80 75-88Q105-80 105-40Z"/><rect x="73" y="-100" width="4" height="14"/>
      <path d="M10-40Q10-62 29-67Q48-62 48-40Z"/><path d="M102-40Q102-62 121-67Q140-62 140-40Z"/>
      <rect x="-16" y="-112" width="9" height="112"/><path d="M-19-112h15l-7.5-13z"/>
      <rect x="157" y="-112" width="9" height="112"/><path d="M154-112h15l-7.5-13z"/>
      <path d="M205 0C219-22 221-70 223-150H229C231-70 233-22 247 0Z"/><path d="M219-150h14l-3-7h-8z"/><circle cx="226" cy="-162" r="5"/>
      ${win}
    </g>`;
  }

  function cup(x, y, col = '#fff') {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><path d="M-9-16h18v11a9 9 0 0 1-18 0z" fill="${col}" stroke="#e7c7d6" stroke-width="1"/><path d="M9-12a5 5 0 0 1 0 9" fill="none" stroke="#e7c7d6" stroke-width="2.5"/><path d="M0-7l-3.5-3a2 2 0 0 1 3.5-2.2 2 2 0 0 1 3.5 2.2z" fill="#ff8fbd"/><g class="steam" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2" stroke-linecap="round"><path d="M-3-20q-4-6 0-12q4-6 0-12"/></g><g class="steam s2" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2" stroke-linecap="round"><path d="M4-20q-4-6 0-12q4-6 0-12"/></g></g>`;
  }
  const candle = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-3.5" y="-20" width="7" height="20" rx="1.5" fill="#fff6e0"/><ellipse class="glowc" cx="0" cy="-27" rx="15" ry="15" fill="rgba(255,210,120,.35)"/><path class="flame" d="M0-33c3 4 4.5 7 4.5 9a4.5 4.5 0 0 1-9 0c0-2 1.5-5 4.5-9z" fill="#ffc94d"/></g>`;
  const tableFront = (x, w, y, top, front) => `<rect x="${x}" y="${y}" width="${w}" height="9" rx="4" fill="${top}"/><path d="M${x + 6} ${y + 9}h${w - 12}l-10 ${250 - y}h${-(w - 32)}z" fill="${front}"/>`;
  function plate(x, y, kind) {
    const food = kind === 'puri'
      ? `<ellipse cx="${x - 8}" cy="${y - 8}" rx="13" ry="7" fill="#e9a94a"/><ellipse cx="${x + 8}" cy="${y - 10}" rx="12" ry="6.5" fill="#f2bc5e"/>`
      : kind === 'halwa'
        ? `<path d="M${x - 15} ${y - 5}q15-16 30 0z" fill="#f2a01e"/><circle cx="${x - 3}" cy="${y - 11}" r="1.6" fill="#8ee6b0"/><circle cx="${x + 4}" cy="${y - 9}" r="1.6" fill="#fff"/>`
        : `<path d="M${x - 16} ${y - 5}c4-10 8 2 12-6s8 4 12-4 6 4 8 8" stroke="#f3c64a" stroke-width="3" fill="none"/><path d="M${x - 14} ${y - 7}c5-8 9 3 13-5s9 3 13-3" stroke="#f7d36a" stroke-width="3" fill="none"/><circle cx="${x - 4}" cy="${y - 11}" r="3.2" fill="#a8432f"/><circle cx="${x + 6}" cy="${y - 10}" r="3" fill="#a8432f"/><path d="M${x + 1} ${y - 15}q4-4 8 0q-4 3-8 0z" fill="#5fbf6a"/>`;
    return `<ellipse cx="${x}" cy="${y - 2}" rx="27" ry="6.5" fill="#fff" stroke="#efe3ea"/>${food}`;
  }
  const blanket = (x1, x2, top, col = '#ff8fbd', bottom = 252) => `<g class="blanket"><path d="M${x1} ${bottom}L${x1 + 8} ${top + 14}Q${(x1 + x2) / 2} ${top - 12} ${x2 - 8} ${top + 14}L${x2} ${bottom}Q${(x1 + x2) / 2} ${bottom + 10} ${x1} ${bottom}Z" fill="${col}"/><g fill="rgba(255,255,255,.55)"><circle cx="${x1 + 30}" cy="${top + 30}" r="3"/><circle cx="${x1 + 70}" cy="${top + 22}" r="3"/><circle cx="${x2 - 40}" cy="${top + 28}" r="3"/><circle cx="${x1 + 50}" cy="${top + 50}" r="3"/><circle cx="${x2 - 60}" cy="${top + 48}" r="3"/></g><path d="M${(x1 + x2) / 2} ${top + 40}l-7-6.5a4.3 4.3 0 0 1 7-5 4.3 4.3 0 0 1 7 5z" fill="#fff" opacity=".8"/></g>`;
  function lights(y0, seed, n = 16) {
    const r = seeded(seed), cols = ['#ffd166', '#ff8fbd', '#7fdcff', '#b89cff', '#8ee6b0'];
    let out = `<path d="M-5 ${y0}Q200 ${y0 + 32} 405 ${y0}" fill="none" stroke="rgba(80,60,60,.6)" stroke-width="1.3"/>`;
    for (let i = 1; i < n; i++) {
      const t = i / n, x = (1 - t) * (1 - t) * -5 + 2 * (1 - t) * t * 200 + t * t * 405, y = y0 + 64 * t * (1 - t);
      out += `<circle class="tw" style="animation-delay:${(-r() * 2).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${(y + 4).toFixed(1)}" r="3.4" fill="${cols[i % cols.length]}"/>`;
    }
    return out;
  }
  const railing = y => { let b = ''; for (let x = 6; x < 400; x += 18) b += `<rect x="${x}" y="${y + 7}" width="5" height="${250 - y}" fill="#a06c52"/>`; return `${b}<rect y="${y}" width="400" height="8" rx="3" fill="#8a5a44"/>`; };
  const tree = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-4" y="-40" width="8" height="40" fill="#8a5a44"/><g class="leaves"><circle cx="0" cy="-58" r="24" fill="#6fb85f"/><circle cx="-16" cy="-44" r="16" fill="#7cc46f"/><circle cx="16" cy="-46" r="17" fill="#5aa64f"/></g></g>`;
  const balloon = (x, y, c, d) => `<g transform="translate(${x} ${y})"><g class="bal" style="animation-delay:${d}s"><path d="M0 18q-5 20 2 44" stroke="#fff" stroke-width="1.2" fill="none"/><ellipse cx="0" cy="0" rx="13" ry="16" fill="${c}"/><ellipse cx="-4" cy="-6" rx="3" ry="5" fill="#fff" opacity=".5"/></g></g>`;
  function shelf(seed) {
    const r = seeded(seed), cols = ['#ff8fbd', '#7fdcff', '#ffd166', '#b89cff', '#8ee6b0', '#ffb46b', '#e0216b'];
    let out = '<rect x="14" y="10" width="372" height="118" rx="6" fill="#b9834f"/><rect x="20" y="16" width="360" height="106" fill="#8a5a32"/>';
    [52, 88, 122].forEach(by => {
      let x = 24;
      while (x < 370) { const w = 7 + r() * 8, h = 22 + r() * 9; out += `<rect x="${x.toFixed(1)}" y="${(by - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="${cols[Math.floor(r() * cols.length)]}"/>`; x += w + 1.5; }
      out += `<rect x="18" y="${by}" width="364" height="5" fill="#b9834f"/>`;
    });
    return out;
  }
  function scooter(x, y) {
    const wheel = cx => `<g class="wheel"><circle cx="${cx}" cy="${y - 13}" r="13" fill="${K}"/><circle cx="${cx}" cy="${y - 13}" r="5" fill="#ddd"/><path d="M${cx - 9} ${y - 13}h18M${cx} ${y - 22}v18" stroke="#777" stroke-width="2"/></g>`;
    return `<path d="M${x + 4} ${y - 14}Q${x - 2} ${y - 44} ${x + 30} ${y - 48}L${x + 74} ${y - 48}Q${x + 94} ${y - 48} ${x + 98} ${y - 24}L${x + 112} ${y - 24}Q${x + 121} ${y - 24} ${x + 121} ${y - 14}Z" fill="#ff5c9a"/>
      <rect x="${x + 22}" y="${y - 56}" width="52" height="10" rx="5" fill="#5b2a6e"/>
      <path d="M${x + 98} ${y - 30}L${x + 110} ${y - 76}" stroke="#7a6a8a" stroke-width="6" stroke-linecap="round"/><path d="M${x + 100} ${y - 80}h22" stroke="#7a6a8a" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${x + 115}" cy="${y - 66}" r="6" fill="#fff6b0"/>${wheel(x + 22)}${wheel(x + 104)}`;
  }
  function popcorn(x, y) {
    let puffs = '';
    [[-12, -34], [-4, -38], [5, -36], [13, -33], [-8, -42], [3, -44], [10, -40]].forEach(([dx, dy]) => { puffs += `<circle cx="${x + dx}" cy="${y + dy}" r="6" fill="#fff4d6"/>`; });
    return `${puffs}<path d="M${x - 19} ${y - 32}h38l-6 44h-26z" fill="#fff"/><path d="M${x - 12} ${y - 32}l3 44M${x} ${y - 32}v44M${x + 12} ${y - 32}l-3 44" stroke="#e8455f" stroke-width="5"/>`;
  }
  function confetti(n, seed) {
    const r = seeded(seed), ch = ['🎉', '✨', '💗', '🎊', '⭐'];
    return Array.from({ length: n }, () => [ch[Math.floor(r() * ch.length)], 4 + r() * 92, -5, 'fall', (r() * 4).toFixed(2), (3 + r() * 2.5).toFixed(2), 12 + r() * 8]);
  }
  function floaters(n, seed, chars = ['💗', '💕', '💖'], x0 = 28, xw = 44) {
    const r = seeded(seed);
    return Array.from({ length: n }, () => [chars[Math.floor(r() * chars.length)], x0 + r() * xw, 30 + r() * 26, 'rise', (r() * 4).toFixed(2), (3 + r() * 2).toFixed(2), 13 + r() * 10]);
  }
  const fall = (n, seed, chars, size = 14) => { const r = seeded(seed); return Array.from({ length: n }, () => [chars[Math.floor(r() * chars.length)], r() * 96, -6, 'fall', (r() * 5).toFixed(2), (4 + r() * 3).toFixed(2), size + r() * 6]); };

  /* ---------- the scenes ---------- */
  const S = {
    moon(id, c) {
      return {
        label: 'Two pandas cuddling under a big full moon and shooting stars',
        svg: base(id, c) + stars(60, 3) + shoot() + shoot(1) + fullMoon(318, 60, 30, id) + hill(...NIGHT) + pair('hug', 196, 214, .46, { eyes: 'open' }),
        fx: floaters(6, 11, ['✨', '💗', '⭐'])
      };
    },
    cuddle(id, c) {
      return {
        label: 'Two pandas asleep together under a pink blanket',
        svg: base(id, c) + stars(45, 5) + crescent(72, 56, 26, id) + hill(...NIGHT) + pair('hug', 200, 214, .46, { eyes: 'sleep', clsA: 'breathe', clsB: 'breathe' }) + blanket(110, 290, 176),
        fx: [['z', 63, 30, 'zz', 0, 3, 18], ['Z', 67, 24, 'zz', 1, 3, 24], ['z', 60, 34, 'zz', 2, 3, 15], ...floaters(3, 4, ['💗', '✨'])]
      };
    },
    hug(id, c) {
      return {
        label: 'Two pandas hugging tightly under the stars',
        svg: base(id, c) + stars(45, 9) + crescent(320, 52, 24, id) + hill(...NIGHT) + pair('hug', 200, 214, .48),
        fx: floaters(8, 21)
      };
    },
    dawn(id, c) {
      return {
        label: 'Two pandas watching the dawn from a hill',
        svg: base(id, c) + stars(24, 13) + `<ellipse cx="290" cy="200" rx="240" ry="70" fill="url(#gl${id})"/><g class="rise-sun"><circle cx="290" cy="198" r="26" fill="#ffd27a"/></g>` + hill('#3a2050', '#4a2a62') + pair('side', 190, 214, .46, { tilt: 8 }),
        fx: floaters(4, 31, ['✨', '💗'])
      };
    },
    sunrise(id, c) {
      const s = .44, [pa, pb, A, B] = pairParts('side', 196, 214, s, { armA: -40, armB: 40, tilt: 5 });
      return {
        label: 'Two pandas sharing morning chai on a Lahore rooftop at sunrise',
        svg: base(id, c) + sun(318, 72, 22, id) + cloud(80, 50, 1) + cloud(250, 34, .7) + lahore(30, 206, .58, 'rgba(140,80,110,.35)') + '<rect y="200" width="400" height="50" fill="#e7c3a8"/>' + pa + pb + cup(A.x + 189 * s, A.y + 170 * s) + cup(B.x + 11 * s, B.y + 170 * s, '#ffe3ef') + railing(206) + birds(),
        fx: floaters(3, 41, ['☀️', '💗', '✨'])
      };
    },
    kiss(id, c) {
      return {
        label: 'Two pandas sharing a kiss with a heart popping above them',
        svg: base(id, c) + sun(330, 54, 20, id) + cloud(70, 56, 1) + cloud(220, 40, .8) + hill(...DAY) + pair('kiss', 200, 214, .48) + popHeart(200, 94),
        fx: floaters(8, 51, ['💋', '💗', '💕'])
      };
    },
    breakfast(id, c) {
      return {
        label: 'Two pandas on a breakfast date with chai and halwa puri',
        svg: base(id, c) + sun(60, 50, 18, id) + cloud(300, 46, .9) + hill(...DAY) + pair('side', 200, 206, .44, { tilt: 6, gap: 8, eyes: 'happy' }) + tableFront(64, 272, 194, '#ffd6e7', '#ffc2da') + plate(156, 194, 'puri') + plate(244, 194, 'halwa') + cup(112, 194) + cup(290, 194, '#ffe3ef'),
        fx: floaters(4, 61, ['☕', '💗', '✨'])
      };
    },
    cafe(id, c) {
      return {
        label: 'Two pandas on a café date with heart lattes and fairy lights',
        svg: base(id, c) + '<rect width="400" height="250" fill="#ffe9da"/><rect y="170" width="400" height="80" fill="#f1cdb3"/>'
          + `<rect x="24" y="36" width="104" height="92" rx="8" fill="url(#sk${id})" stroke="#fff" stroke-width="6"/>` + cloud(70, 76, .7) + '<path d="M76 36v92M24 82h104" stroke="#fff" stroke-width="4"/>'
          + lights(14, 71) + '<rect x="300" y="44" width="56" height="44" rx="4" fill="#fff" stroke="#e0b07a" stroke-width="4"/><path d="M328 80l-12-11a7 7 0 0 1 12-8.5 7 7 0 0 1 12 8.5z" fill="#ff8fbd"/>'
          + '<path d="M368 170c-4-20 6-34 4-46m-10 46c-8-14-18-20-24-22m28 22c6-12 16-18 22-18" stroke="#5aa64f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M352 168h32l-4 26h-24z" fill="#e8a07a"/>'
          + pair('side', 210, 210, .44, { tilt: 9 }) + '<ellipse cx="210" cy="201" rx="112" ry="13" fill="#fff"/><rect x="204" y="206" width="12" height="44" fill="#d9b8a0"/>' + cup(170, 200) + cup(252, 200, '#ffe3ef'),
        fx: floaters(4, 71, ['☕', '💗'], 34, 34)
      };
    },
    cake(id, c) {
      const flags = Array.from({ length: 11 }, (_, i) => { const x = 10 + i * 38, t = (x + 5) / 410, y = 14 + 64 * t * (1 - t); return `<path d="M${x} ${y.toFixed(1)}h22l-11 20z" fill="${['#ff8fbd', '#ffd166', '#7fdcff', '#b89cff'][i % 4]}"/>`; }).join('');
      return {
        label: 'Two pandas cheering behind a birthday cake that says 33',
        svg: base(id, c) + '<rect width="400" height="250" fill="#fff0f6"/><path d="M-5 14Q200 46 405 14" stroke="#c9a" fill="none"/>' + flags + balloon(46, 110, '#ff5c9a', 0) + balloon(354, 96, '#b89cff', -1.2) + balloon(372, 126, '#ffd166', -.6)
          + pair('side', 200, 208, .44, { armA: -150, armB: 150, eyes: 'happy', gap: 30, clsA: 'jump', clsB: 'jump2' })
          + tableFront(36, 328, 204, '#ffd1e3', '#ffbfd6')
          + '<g transform="translate(200 204)"><rect x="-52" y="-44" width="104" height="44" rx="8" fill="#ff9cc4"/><path d="M-52-40q8 10 16 0t16 0 16 0 16 0 16 0 16 0 16 0v-6h-104z" fill="#fff"/><rect x="-36" y="-76" width="72" height="34" rx="7" fill="#ffd1e3"/><path d="M-36-72q6 8 12 0t12 0 12 0 12 0 12 0 12 0v-6h-72z" fill="#fff"/><text x="0" y="-12" text-anchor="middle" font-family="Great Vibes, cursive" font-size="22" fill="#e0216b">33</text><rect x="-13" y="-96" width="6" height="20" rx="1.5" fill="#7fdcff"/><rect x="7" y="-96" width="6" height="20" rx="1.5" fill="#ff8fbd"/></g>'
          + candle(190, 108).replace('<rect x="-3.5" y="-20" width="7" height="20" rx="1.5" fill="#fff6e0"/>', '') + candle(210, 108).replace('<rect x="-3.5" y="-20" width="7" height="20" rx="1.5" fill="#fff6e0"/>', ''),
        fx: confetti(14, 81)
      };
    },
    italian(id, c) {
      const s = .44, [pa, pb, A, B] = pairParts('side', 200, 208, s, { tilt: 8, gap: 24, eyes: 'happy' });
      const am = [A.x + 103.9 * s, A.y + 117.3 * s], bm = [B.x + 96.1 * s, B.y + 117.3 * s];
      return {
        label: 'Two pandas sharing one spaghetti noodle on an Italian date',
        svg: `<defs><pattern id="ck${id}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#fff"/><rect width="8" height="8" fill="#e8455f"/><rect x="8" y="8" width="8" height="8" fill="#e8455f"/></pattern></defs>`
          + '<rect width="400" height="250" fill="#ffe3c2"/><rect y="150" width="400" height="100" fill="#f0c99a"/>'
          + '<path d="M0 20c30 10 40-6 70 4s40-8 70 2 40-6 70 4 40-8 70 2 40-6 70 4" stroke="#5aa64f" stroke-width="3" fill="none"/><g fill="#7cc46f"><ellipse cx="40" cy="22" rx="6" ry="3"/><ellipse cx="120" cy="20" rx="6" ry="3"/><ellipse cx="200" cy="24" rx="6" ry="3"/><ellipse cx="280" cy="20" rx="6" ry="3"/><ellipse cx="360" cy="24" rx="6" ry="3"/></g>'
          + '<rect x="290" y="48" width="70" height="52" rx="4" fill="#fff8ee" stroke="#c98d5b" stroke-width="4"/><text x="325" y="80" text-anchor="middle" font-family="Great Vibes, cursive" font-size="20" fill="#c2185b">Roma ♥</text>'
          + `<ellipse cx="80" cy="44" rx="40" ry="40" fill="url(#gl${id})"/><path d="M80 0v26" stroke="#5b4a3a" stroke-width="2"/><path d="M66 38h28l-6-12h-16z" fill="#c2185b"/>`
          + pa + pb + `<path class="noodle" d="M${am[0].toFixed(1)} ${am[1].toFixed(1)}Q200 ${(am[1] + 62).toFixed(1)} ${bm[0].toFixed(1)} ${bm[1].toFixed(1)}" stroke="#f3c64a" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
          + `<rect x="40" y="196" width="320" height="9" rx="4" fill="url(#ck${id})"/><path d="M46 205h308l-10 45h-288z" fill="url(#ck${id})"/>`
          + plate(200, 196, 'pasta') + candle(300, 196) + '<path d="M104 196v-20" stroke="#5aa64f" stroke-width="2"/><circle cx="104" cy="172" r="6" fill="#e0216b"/><rect x="98" y="184" width="12" height="12" rx="3" fill="#bfe3ff" opacity=".8"/>'
          + popHeart(200, (am[1] - 30).toFixed(1)),
        fx: floaters(4, 91, ['💗', '🍝', '💕'])
      };
    },
    meet(id, c) {
      const [pa, pb] = pairParts('hug', 200, 214, .48);
      return {
        label: 'Two pandas running into each other\'s arms',
        svg: base(id, c) + sun(64, 52, 20, id) + cloud(300, 44, 1) + cloud(180, 30, .7) + hill(...DAY) + '<path d="M0 236Q200 204 400 236" stroke="#fff" stroke-width="12" fill="none" opacity=".45"/>' + `<g class="run-l">${pa}</g><g class="run-r">${pb}</g>` + popHeart(200, 92, 'late'),
        fx: floaters(8, 101).map(f => (f[4] = (Number(f[4]) + 1.8).toFixed(2), f))
      };
    },
    cinema(id, c) {
      return {
        label: 'Two pandas on a cinema date with popcorn, lit by the movie',
        svg: `<defs><linearGradient id="bm${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8" stop-opacity=".45"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient></defs>`
          + '<rect width="400" height="250" fill="#1d0f30"/><rect x="186" y="8" width="28" height="14" rx="3" fill="#fff6c8"/>'
          + `<path class="beam" d="M188 20h24L420 250H-20Z" fill="url(#bm${id})"/>` + stars(18, 111)
          + '<g fill="#4a1630">' + Array.from({ length: 9 }, (_, i) => `<rect x="${i * 46 - 6}" y="138" width="40" height="40" rx="12"/>`).join('') + '</g>'
          + '<rect x="78" y="112" width="104" height="110" rx="26" fill="#b0204a"/><rect x="218" y="112" width="104" height="110" rx="26" fill="#b0204a"/>'
          + pair('side', 200, 222, .46, { gap: 22, tilt: 5 })
          + '<rect x="60" y="214" width="280" height="36" rx="10" fill="#8c1838"/><rect x="190" y="196" width="20" height="40" rx="6" fill="#6e1230"/>' + popcorn(200, 214)
          + '<rect class="flick" width="400" height="250" fill="#bfe3ff"/>',
        fx: [['🍿', 46, 52, 'rise', 0, 3.4, 16], ['🍿', 55, 52, 'rise', 1.7, 3.4, 14], ...floaters(4, 113, ['💗', '✨', '🎬'])]
      };
    },
    ride(id, c) {
      const s = .34, x = 120, y = 236, py = y - 50 - 232 * s + 2;
      const her = panda({ kind: 'her', s, x: x + 2, y: py, eyes: 'happy', armR: -80, blush: 1 });
      const him = panda({ kind: 'me', s, x: x + 38, y: py, eyes: 'open', armR: -64, blush: .8 });
      const city = lahore(20, 0, .62, 'rgba(120,70,120,.38)') + lahore(250, 0, .5, 'rgba(120,70,120,.3)');
      return {
        label: 'Two pandas riding a scooter past the Badshahi Mosque and Minar-e-Pakistan',
        svg: base(id, c) + sun(330, 50, 20, id) + cloud(90, 46, .9) + cloud(260, 30, .7)
          + `<g transform="translate(0 206)"><g class="scroll"><g>${city}</g><g transform="translate(400 0)">${city}</g></g></g>`
          + '<rect y="204" width="400" height="46" fill="#8d89a0"/><g transform="translate(0 228)"><g class="dash">' + Array.from({ length: 12 }, (_, i) => `<rect x="${i * 40}" y="-2" width="22" height="4" rx="2" fill="#fff"/>`).join('') + '</g></g>'
          + `<g class="bumpy">${her}${him}${scooter(x, y)}</g>` + '<g class="wind" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M70 170h34"/><path d="M60 186h40"/><path d="M78 202h26"/></g>',
        fx: floaters(4, 121, ['💗', '✨'], 22, 30)
      };
    },
    flyingkiss(id, c) {
      const s = .44, w = 88, y = 214 - 232 * s + 6 * s;
      return {
        label: 'Two pandas blowing kisses to each other across a hill',
        svg: base(id, c) + sun(200, 50, 20, id) + cloud(80, 50, .9) + cloud(320, 40, .8) + hill(...DAY)
          + panda({ kind: 'her', s, x: 30, y, eyes: 'happy', kiss: true, armR: -128, blush: 1, cls: 'bob' }) + panda({ kind: 'me', s, x: 400 - 30 - w, y, eyes: 'happy', kiss: true, armL: 128, blush: 1, cls: 'bob2' }),
        fx: [['💋', 24, 46, 'flyR', 0, 2.8, 22], ['💋', 24, 46, 'flyR', 1.4, 2.8, 17], ['💋', 70, 46, 'flyL', .7, 2.8, 22], ['💋', 70, 46, 'flyL', 2.1, 2.8, 17], ...floaters(3, 131, ['💗', '💕'], 40, 20)]
      };
    },
    books(id, c) {
      return {
        label: 'Two pandas reading one book together under a lamp',
        svg: base(id, c) + '<rect width="400" height="250" fill="#f6ecff"/>' + shelf(141) + '<rect y="196" width="400" height="54" fill="#e5d2f2"/><ellipse cx="200" cy="226" rx="150" ry="16" fill="#ffd1e3"/>'
          + `<ellipse cx="352" cy="140" rx="50" ry="50" fill="url(#gl${id})"/><path d="M352 152v84" stroke="#5b4a3a" stroke-width="3"/><path d="M336 152h32l-8-22h-16z" fill="#ffd166"/>`
          + pair('side', 196, 214, .46, { tilt: 8 })
          + '<g transform="translate(196 198)"><path d="M0-4L-36-14V10L0 18Z" fill="#fff"/><path d="M0-4L36-14V10L0 18Z" fill="#fdf6ff"/><path d="M-36 10L0 18L36 10V14L0 22-36 14Z" fill="#e0216b"/><path d="M-30-6l24 7M-30 0l24 7M30-6L6 1M30 0L6 7" stroke="#d6c8e6" stroke-width="1.5"/></g>',
        fx: [['♥', 48, 66, 'rise', 0, 3, 16], ['✦', 52, 66, 'rise', 1, 3, 14], ['a', 46, 66, 'rise', 2, 3, 14], ['💗', 54, 66, 'rise', 1.5, 3.4, 14]]
      };
    },
    garden(id, c) {
      return {
        label: 'Two pandas walking hand in hand through a garden at golden hour',
        svg: base(id, c) + sun(312, 150, 26, id) + birds() + tree(40, 200, 1.1) + tree(368, 196, 1) + tree(96, 192, .7) + hill('#cfe3a4', '#b9d68c')
          + '<path d="M150 250Q200 214 250 206" stroke="#f2deb0" stroke-width="22" fill="none" opacity=".8"/>'
          + '<g fill="#ff8fbd"><circle cx="30" cy="222" r="4"/><circle cx="60" cy="230" r="4"/><circle cx="340" cy="226" r="4"/><circle cx="372" cy="236" r="4"/></g><g fill="#ffd166"><circle cx="44" cy="234" r="3.5"/><circle cx="356" cy="214" r="3.5"/></g>'
          + pair('side', 200, 214, .46, { armA: -30, armB: 30, clsA: 'walk', clsB: 'walk2', eyes: 'happy' }),
        fx: fall(8, 151, ['🌸', '💗'], 13)
      };
    },
    dinner(id, c) {
      return {
        label: 'Two pandas on a candlelit rooftop dinner with the Badshahi Mosque behind them',
        svg: base(id, c) + sun(330, 178, 24, id) + lahore(36, 198, .66, '#4a2350', true) + lights(10, 161)
          + pair('side', 200, 206, .44, { tilt: 8, gap: 12, eyes: 'happy' })
          + tableFront(56, 288, 196, '#8a2f55', '#6e2445') + candle(200, 196) + plate(140, 196, 'pasta') + plate(260, 196, 'puri') + '<path d="M90 196v-18" stroke="#5aa64f" stroke-width="2"/><circle cx="90" cy="174" r="6" fill="#ff4f8f"/>',
        fx: floaters(5, 171, ['✨', '💗', '🕯️'])
      };
    },
    winter(id, c) {
      const s = .44, [pa, pb, A, B] = pairParts('side', 200, 214, s, { gap: -4, tilt: 10, armA: -40, armB: 40, scarfA: '#ff5c9a', scarfB: '#7fdcff' });
      return {
        label: 'Two pandas in scarves cuddling under a blanket with chai on a foggy winter evening',
        svg: base(id, c) + stars(18, 181) + crescent(330, 48, 20, id)
          + '<g class="fog"><ellipse cx="90" cy="150" rx="170" ry="16" fill="#fff" opacity=".2"/></g><g class="fog f2"><ellipse cx="310" cy="172" rx="170" ry="14" fill="#fff" opacity=".18"/></g>'
          + hill('#d7def5', '#c2cbea') + pa + pb + cup(A.x + 189 * s, A.y + 170 * s) + cup(B.x + 11 * s, B.y + 170 * s, '#ffe3ef') + blanket(116, 284, 196, '#b89cff')
          + '<g class="fog f3"><ellipse cx="200" cy="232" rx="230" ry="14" fill="#fff" opacity=".22"/></g>',
        fx: fall(12, 191, ['❄', '✦', '❄'], 12)
      };
    },
    dance(id, c) {
      return {
        label: 'Two pandas slow dancing under fairy lights',
        svg: base(id, c) + stars(26, 201) + lights(8, 203) + lights(34, 207, 12) + '<ellipse cx="200" cy="214" rx="130" ry="20" fill="#fff" opacity=".22"/>' + hill('#5a2b7a', '#6b3488')
          + pair('hug', 200, 214, .48, { clsA: 'dance', clsB: 'dance' }),
        fx: [['♪', 34, 40, 'rise', 0, 3.4, 20], ['♫', 64, 36, 'rise', 1.2, 3.4, 22], ['♪', 58, 48, 'rise', 2.2, 3.4, 16], ...floaters(4, 209, ['💗', '✨'])]
      };
    },
    sofa(id, c) {
      const snow = Array.from({ length: 14 }, (_, i) => `<circle class="snow" style="animation-delay:${(-i * .45).toFixed(2)}s" cx="${290 + (i * 37) % 80}" cy="${10 + (i * 23) % 40}" r="${1.4 + (i % 3) * .6}" fill="#fff"/>`).join('');
      return {
        label: 'Two pandas watching a movie on the sofa under one blanket, snow outside the window',
        svg: base(id, c) + `<defs><clipPath id="wn${id}"><rect x="284" y="24" width="92" height="90" rx="6"/></clipPath></defs>`
          + '<rect width="400" height="250" fill="#3b2357"/><rect y="200" width="400" height="50" fill="#2c1a42"/>'
          + `<g clip-path="url(#wn${id})"><rect x="284" y="24" width="92" height="90" fill="#151036"/>${stars(8, 211).replace(/cx="(\d+\.?\d*)"/g, (m, v) => `cx="${(284 + Number(v) * .23).toFixed(1)}"`).replace(/cy="(\d+\.?\d*)"/g, (m, v) => `cy="${(24 + Number(v) * .4).toFixed(1)}"`)}${snow}</g>`
          + '<rect x="284" y="24" width="92" height="90" rx="6" fill="none" stroke="#8a6a9a" stroke-width="5"/><path d="M330 24v90M284 69h92" stroke="#8a6a9a" stroke-width="3"/>'
          + `<ellipse cx="40" cy="120" rx="46" ry="46" fill="url(#gl${id})"/><path d="M40 128v100" stroke="#8a6a9a" stroke-width="3"/><path d="M24 128h32l-8-24h-16z" fill="#ffd166"/>`
          + '<rect x="78" y="128" width="244" height="72" rx="24" fill="#ff8fbd"/><rect x="62" y="150" width="40" height="78" rx="18" fill="#ff7aa8"/><rect x="298" y="150" width="40" height="78" rx="18" fill="#ff7aa8"/>'
          + pair('side', 200, 218, .44, { gap: -2, tilt: 10 }) + blanket(104, 296, 192, '#b89cff') + '<rect x="70" y="214" width="260" height="20" rx="8" fill="#ff6fa5"/>' + popcorn(200, 246)
          + '<rect class="flick" width="400" height="250" fill="#9fd8ff"/>',
        fx: floaters(4, 213, ['💗', '🍿', '✨'])
      };
    },
    hug2(id, c) {
      return {
        label: 'Two pandas hugging in front of a glowing heart over the Lahore skyline',
        svg: base(id, c) + stars(50, 221) + lahore(16, 216, .82, '#1e1238', true) + lahore(236, 216, .62, '#24163f', true)
          + '<g transform="translate(200 132)"><g class="beat"><path d="M0 66C-96 4-64-74 0-32 64-74 96 4 0 66Z" fill="#ff4f8f" opacity=".42"/></g></g>'
          + hill('#22144a', '#2d1a5a') + pair('hug', 200, 218, .5),
        fx: floaters(9, 223)
      };
    },
    goodnight(id, c) {
      const [pa, pb] = pairParts('hug', 222, 186, .34, { eyes: 'sleep', clsA: 'breathe', clsB: 'breathe' });
      return {
        label: 'Two pandas asleep together inside a crescent moon',
        svg: base(id, c) + stars(80, 231) + shoot() + shoot(1) + crescent(196, 132, 92, id) + pa + pb + blanket(162, 268, 158, '#ff8fbd', 192),
        fx: [['z', 66, 30, 'zz', 0, 3, 16], ['Z', 70, 24, 'zz', 1, 3, 22], ['z', 63, 34, 'zz', 2, 3, 14], ...floaters(3, 233, ['✨', '⭐'])]
      };
    }
  };

  function fxHtml(list) {
    return '<div class="sfx" aria-hidden="true">' + list.map(([ch, x, y, a, d, t, sz]) =>
      `<span class="${a}" style="left:${Number(x).toFixed(1)}%;top:${Number(y).toFixed(1)}%;animation-delay:${d}s;animation-duration:${t}s;font-size:${Math.round(sz || 18)}px">${ch}</span>`).join('') + '</div>';
  }

  function build(card) {
    const id = 's' + (++uid);
    const out = (S[card.s] || S.hug)(id, sky(card.h), card);
    return `<div class="scene sc-${card.s}"><svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${out.label}">${out.svg}</svg>${fxHtml(out.fx || [])}</div>`;
  }

  return { build, panda, pair, sky };
})();
