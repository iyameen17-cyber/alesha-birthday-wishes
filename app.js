/* app.js — 22 birthday cards for Alesha from Yameen, one unlocking every hour on 27 October 2026
   (2:00 AM to 11:00 PM, Pakistan time). */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  /* ---------- the schedule ---------- */
  const START = Date.UTC(2026, 9, 26, 21, 0, 0); /* 27 Oct 2026, 2:00 AM in Lahore (UTC+5) */
  const HOUR = 3600e3;
  const PKT = 5 * HOUR;
  const CARDS = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(window.CARDS_DATA), ch => ch.charCodeAt(0))));
  const N = CARDS.length;
  const unlockAt = i => START + i * HOUR;
  const label = h => (h === 12 ? '12:00 PM' : h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`);
  const short = h => (h === 12 ? '12 PM' : h < 12 ? `${h} AM` : `${h - 12} PM`);

  /* the phone's clock, corrected by the web server's clock when they disagree */
  const clock = { offset: 0 };
  window.__clock = clock;
  const now = () => Date.now() + clock.offset;
  async function syncClock() {
    try {
      const t0 = Date.now();
      const res = await fetch(location.pathname + '?t=' + t0, { method: 'HEAD', cache: 'no-store' });
      const t1 = Date.now(), d = Date.parse(res.headers.get('date') || '');
      if (isNaN(d)) return;
      const off = d + 500 - (t0 + t1) / 2;
      if (Math.abs(off) > 5000) { clock.offset = off; tick(true); }
    } catch (e) { /* offline: trust the phone */ }
  }
  const unlocked = () => { const t = now(); return t < START ? 0 : Math.min(N, Math.floor((t - START) / HOUR) + 1); };
  const pad = n => String(n).padStart(2, '0');
  function hms(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(pad);
  }
  function human(ms) {
    const m = Math.max(1, Math.ceil(ms / 60000));
    if (m < 60) return `${m} minute${m === 1 ? '' : 's'}`;
    const h = Math.floor(m / 60), r = m % 60;
    return `${h} hour${h === 1 ? '' : 's'}${r ? ` ${r} min` : ''}`;
  }

  const opened = new Set(store.get('aw-opened', []).filter(i => i >= 0 && i < N));
  const saveOpened = () => store.set('aw-opened', [...opened]);

  /* ---------- little effects ---------- */
  const fxLayer = $('#fx');
  function sprinkle(x, y, chars = ['💗', '💖', '💕', '✨'], n = 8, spread = 90) {
    if (reduced()) n = Math.min(n, 3);
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = pick(chars);
      const a = rand(0, Math.PI * 2), d = rand(spread * .4, spread);
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * d - spread * .6).toFixed(1) + 'px');
      s.style.setProperty('--r', rand(-40, 40).toFixed(0) + 'deg');
      s.style.setProperty('--s', rand(16, 30).toFixed(0) + 'px');
      fxLayer.appendChild(s);
      setTimeout(() => s.remove(), 1300);
    }
  }
  function confettiRain(n = 60) {
    if (reduced()) n = 12;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.className = 'conf';
      s.textContent = pick(['💗', '✨', '💌', '🎉', '💋', '🌸', '⭐']);
      s.style.left = rand(0, 100) + 'vw';
      s.style.setProperty('--t', rand(2.6, 4.6).toFixed(2) + 's');
      s.style.setProperty('--d', rand(0, 1.2).toFixed(2) + 's');
      s.style.setProperty('--x', rand(-60, 60).toFixed(0) + 'px');
      s.style.fontSize = rand(14, 28).toFixed(0) + 'px';
      fxLayer.appendChild(s);
      setTimeout(() => s.remove(), 6500);
    }
  }
  const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  let toastT = 0;
  function toast(msg, ms = 3200) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), ms);
  }

  /* ---------- background: stars, floating hearts, and the sky of the current hour ---------- */
  (function decorate() {
    const st = $('#stars');
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('i');
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 100) + '%';
      s.style.setProperty('--d', rand(0, 3).toFixed(2) + 's');
      s.style.setProperty('--z', rand(1, 2.6).toFixed(1) + 'px');
      st.appendChild(s);
    }
    const fl = $('#floaters');
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      s.textContent = pick(['💗', '💕', '✨', '💌', '🤍', '💋']);
      s.style.left = rand(0, 96) + '%';
      s.style.setProperty('--t', rand(16, 30).toFixed(1) + 's');
      s.style.setProperty('--d', (-rand(0, 30)).toFixed(1) + 's');
      s.style.fontSize = rand(12, 26).toFixed(0) + 'px';
      fl.appendChild(s);
    }
    $('#hero-art').innerHTML = `<svg viewBox="0 0 220 130" aria-hidden="true">${Scenes.pair('hug', 110, 126, .46)}</svg>`;
  })();
  function setTheme() {
    const h = new Date(now() + PKT).getUTCHours();
    const theme = h >= 5 && h < 7 ? 'dawn' : h >= 7 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'golden' : 'night';
    document.body.dataset.theme = theme;
  }

  /* ---------- the grid of 22 cards ---------- */
  const grid = $('#grid');
  CARDS.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'tile locked';
    li.style.setProperty('--i', i);
    li.innerHTML = `<button type="button" class="tile-btn"><span class="t-hour">${short(c.h)}</span><span class="t-ic" aria-hidden="true">🔒</span><span class="t-title"></span><span class="t-state"></span></button>`;
    $('.tile-btn', li).addEventListener('click', () => tryOpen(i));
    grid.appendChild(li);
  });
  function renderTiles() {
    const n = unlocked();
    $$('.tile', grid).forEach((li, i) => {
      const c = CARDS[i], open = i < n, seen = opened.has(i), next = i === n;
      li.className = 'tile ' + (open ? (seen ? 'seen' : 'ready') : next ? 'next' : 'locked');
      $('.t-ic', li).textContent = open ? c.e : next ? '⏳' : '🔒';
      $('.t-title', li).textContent = open ? c.t : next ? 'opens in' : 'opens at ' + label(c.h);
      $('.t-state', li).textContent = open ? (seen ? 'opened 💗' : 'open me 💌') : '';
      $('.tile-btn', li).setAttribute('aria-label', open ? `Card ${i + 1}, ${c.t}${seen ? ', opened' : ', ready to open'}` : `Card ${i + 1}, locked until ${label(c.h)}`);
    });
  }

  /* ---------- the countdown ---------- */
  const ccLabel = $('#cc-label'), ccSub = $('#cc-sub'), ccOpen = $('#cc-open'), ring = $('#cc-ring');
  const ringLen = 2 * Math.PI * 54;
  ring.style.strokeDasharray = ringLen.toFixed(1);
  let lastN = -1;
  function tick(force) {
    const n = unlocked();
    if (n !== lastN || force) {
      if (lastN !== -1 && n > lastN) celebrateUnlock(n - 1);
      lastN = n;
      renderTiles();
      setTheme();
    }
    const parts = $$('#cc-time b');
    if (n < N) {
      const rem = unlockAt(n) - now(), [h, m, s] = hms(rem);
      parts[0].textContent = h; parts[1].textContent = m; parts[2].textContent = s;
      ring.style.strokeDashoffset = (ringLen * Math.min(1, Math.max(0, rem / HOUR))).toFixed(1);
      ccLabel.textContent = n === 0 ? 'Your first card opens at 2:00 AM' : `Card ${n + 1} opens at ${label(CARDS[n].h)}`;
      ccSub.textContent = n === 0 ? 'Get comfy, birthday girl… something sweet is on its way 💗' : `${n} of ${N} cards are open. A new one arrives every hour.`;
      const nextTile = grid.children[n];
      if (nextTile) $('.t-state', nextTile).textContent = `${h}:${m}:${s}`;
      $('#cc-time').hidden = false;
    } else {
      ccLabel.textContent = 'All 22 cards are yours 💗';
      ccSub.textContent = 'Happy birthday, Alesha. Every single one was written with love — Yameen.';
      ring.style.strokeDashoffset = '0';
      $('#cc-time').hidden = true;
    }
    const newest = n - 1;
    ccOpen.hidden = n === 0;
    if (n > 0) ccOpen.textContent = opened.has(newest) ? `Read card ${newest + 1} again 💌` : `Open card ${newest + 1} 💌`;
    if (Math.floor(now() / 1000) % 60 === 0) setTheme();
  }
  ccOpen.addEventListener('click', () => openCard(unlocked() - 1));
  function celebrateUnlock(i) {
    confettiRain(70);
    toast(`💌 Card ${i + 1} just opened — “${CARDS[i].t}”`, 5000);
    const tile = grid.children[i];
    if (tile) { tile.classList.add('just'); setTimeout(() => tile.classList.remove('just'), 2400); }
    document.title = `💌 New card! · For Alesha`;
    setTimeout(() => { document.title = 'Every hour, for Alesha 💌'; }, 9000);
  }

  /* ---------- opening a card ---------- */
  const viewer = $('#viewer'), cardEl = $('#card'), vPrev = $('#v-prev'), vNext = $('#v-next');
  let cur = -1;
  function tryOpen(i) {
    if (i < unlocked()) { openCard(i); return; }
    const tile = grid.children[i];
    tile.classList.remove('nope'); void tile.offsetWidth; tile.classList.add('nope');
    toast(`Patience, jaan 💗 Card ${i + 1} opens at ${label(CARDS[i].h)} — in ${human(unlockAt(i) - now())}.`);
  }

  function template(c, i) {
    return `<div class="c-top"><span class="c-hour">${label(c.h)}</span><span class="c-num">Card ${i + 1} of ${N}</span></div>
      <h2 class="c-title" id="c-title"><span aria-hidden="true">${c.e}</span> ${esc(c.t)}</h2>
      ${Scenes.build(c)}
      <p class="c-wish">${esc(c.w)}</p>
      <div class="c-plan"><span class="c-pi" aria-hidden="true">${c.pi}</span><div><b>Yameen's wish for us</b><p>${esc(c.p)}</p></div></div>
      <figure class="c-quote"><span class="c-film" aria-hidden="true">🎬</span><blockquote>“${esc(c.q)}”</blockquote><figcaption>— ${esc(c.qf)} (${c.qy})</figcaption>${c.qt ? `<p class="c-qt">${esc(c.qt)}</p>` : ''}</figure>
      <div class="c-love"><button type="button" class="love-btn" data-love="kiss">💋 Send a kiss back</button><button type="button" class="love-btn" data-love="hug">🤗 Hug back</button></div>
      <div class="c-yours">
        <label for="wish-${i}"><b>Now it's your turn, Alesha 💭</b><span>${esc(c.a)}</span></label>
        <textarea id="wish-${i}" rows="3" maxlength="800" placeholder="Write your wish here… it stays on your phone until you send it to Yameen."></textarea>
        <div class="c-yours-row"><span class="c-saved" aria-live="polite"></span><button type="button" class="btn btn-pink c-send">Send it to Yameen 💌</button></div>
      </div>
      <p class="c-sign">Happy birthday, my love. Hugs, kisses &amp; cuddles,<span>Yameen</span></p>
      <p class="c-foot">Yameen loves you 💗 and can't wait to meet you</p>`;
  }

  function openCard(i) {
    if (i < 0 || i >= unlocked()) return;
    cur = i;
    const c = CARDS[i];
    cardEl.innerHTML = template(c, i);
    const ta = $('textarea', cardEl), saved = $('.c-saved', cardEl), key = 'aw-wish-' + i;
    ta.value = store.get(key, '');
    if (ta.value) saved.textContent = 'saved ✓';
    let saveT = 0;
    ta.addEventListener('input', () => {
      clearTimeout(saveT);
      saveT = setTimeout(() => { store.set(key, ta.value); saved.textContent = ta.value.trim() ? 'saved on your phone ✓' : ''; }, 350);
    });
    $('.c-send', cardEl).addEventListener('click', e => sendWish(i, ta.value, e.currentTarget));
    $$('.love-btn', cardEl).forEach(b => b.addEventListener('click', () => loveBack(b.dataset.love, b)));
    if (typeof viewer.showModal === 'function') { if (!viewer.open) viewer.showModal(); } else viewer.setAttribute('open', '');
    viewer.appendChild(fxLayer); viewer.appendChild($('#toast'));
    viewer.scrollTop = 0;
    $('.v-scroll', viewer).scrollTop = 0;
    cardEl.classList.remove('enter'); void cardEl.offsetWidth; cardEl.classList.add('enter');
    const first = !opened.has(i);
    opened.add(i); saveOpened(); renderTiles(); tick();
    setTimeout(() => {
      const sc = $('.scene', cardEl);
      if (sc) { const [x, y] = centerOf(sc); sprinkle(x, y, first ? ['💗', '💋', '🤗', '💖', '✨'] : ['💗', '✨'], first ? 16 : 6, 160); }
    }, 450);
    const n = unlocked();
    vPrev.disabled = i === 0;
    vNext.disabled = i + 1 >= n;
    vNext.textContent = i + 1 >= N ? 'That was the last one 💗' : i + 1 >= n ? `Next opens at ${short(CARDS[i + 1].h)} 🔒` : 'Next card →';
  }
  vPrev.addEventListener('click', () => openCard(cur - 1));
  vNext.addEventListener('click', () => openCard(cur + 1));
  function closeViewer() { if (typeof viewer.close === 'function') viewer.close(); else viewer.removeAttribute('open'); }
  $$('[data-close]', viewer).forEach(b => b.addEventListener('click', closeViewer));
  viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
  viewer.addEventListener('close', () => { document.body.appendChild(fxLayer); document.body.appendChild($('#toast')); if (cur >= 0) { const t = grid.children[cur]; if (t) $('.tile-btn', t).focus({ preventScroll: true }); } });

  function loveBack(kind, btn) {
    const [x, y] = centerOf(btn);
    if (kind === 'kiss') {
      sprinkle(x, y, ['💋', '💋', '💗', '😘'], 14, 180);
      const mark = document.createElement('span');
      mark.className = 'kiss-mark';
      mark.textContent = '💋';
      mark.style.left = rand(8, 80) + '%';
      mark.style.top = rand(4, 30) + '%';
      mark.style.setProperty('--r', rand(-30, 30).toFixed(0) + 'deg');
      cardEl.appendChild(mark);
      toast(pick(['Kiss received! Yameen is blushing 🙈', 'Mwah! He felt that one all the way from here 💋', 'Kiss delivered straight to Yameen 💌']));
    } else {
      sprinkle(x, y, ['🤗', '💗', '💞', '🫶'], 14, 180);
      const sc = $('.scene', cardEl);
      if (sc) { sc.classList.remove('squeeze'); void sc.offsetWidth; sc.classList.add('squeeze'); }
      toast(pick(['Hug received — and squeezed right back 🤗', 'Tightest hug ever, delivered 💗', 'Yameen says: never letting go 🫶']));
    }
  }

  async function sendWish(i, text, btn) {
    const t = (text || '').trim();
    if (!t) { toast('Write your wish first, Alesha 💭'); $('textarea', cardEl).focus(); return; }
    const c = CARDS[i];
    const msg = `💌 My ${label(c.h)} birthday wish (card ${i + 1} · ${c.t})\n\n${t}\n\n— Alesha`;
    const [x, y] = centerOf(btn);
    sprinkle(x, y, ['💌', '💗', '✨'], 10, 140);
    if (navigator.share) {
      try { await navigator.share({ text: msg }); toast('Sent with love 💌'); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  }

  /* ---------- our song (optional) ---------- */
  const musicBtn = $('#music');
  if (window.LoveSong) {
    LoveSong.preload();
    LoveSong.onChange(on => {
      musicBtn.classList.toggle('on', on);
      musicBtn.innerHTML = on ? '<span aria-hidden="true">❚❚</span> Pause our song' : '<span aria-hidden="true">🎵</span> Play our song';
    });
    musicBtn.addEventListener('click', () => LoveSong.toggle());
  } else musicBtn.hidden = true;

  /* tiny hearts wherever she taps */
  let lastTap = 0;
  document.addEventListener('pointerdown', e => {
    const t = performance.now();
    if (t - lastTap < 120 || e.target.closest('textarea, button, a')) return;
    lastTap = t;
    sprinkle(e.clientX, e.clientY, ['💗', '💕', '✨'], 4, 50);
  }, { passive: true });

  tick(true);
  setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  syncClock();
})();
