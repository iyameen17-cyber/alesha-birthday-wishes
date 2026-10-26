/* music.js — "Alesha (Bis bald, mein Schatz)"
   An original love song, played live in the browser with Web Audio.
   Piano: Salamander Grand Piano samples (CC-BY 3.0, Alexander Holm) served by tonejs.github.io,
   with a soft synth fallback if they can't load. */
window.LoveSong = (() => {
  'use strict';

  const BPM = 76, BEAT = 60 / BPM;
  const KEY = 3;            /* written in C, played in E-flat */
  const GAP = 4;            /* beats of quiet before the song starts again */
  const BASE = 'https://tonejs.github.io/audio/salamander/';
  const NAMES = ['A1', 'C2', 'Ds2', 'Fs2', 'A2', 'C3', 'Ds3', 'Fs3', 'A3', 'C4', 'Ds4', 'Fs4', 'A4', 'C5', 'Ds5', 'Fs5', 'A5', 'C6'];

  const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midi(n) {
    const m = /^([A-G])([#b]?)(\d)$/.exec(n);
    return PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (Number(m[3]) + 1) * 12;
  }
  const sampleMidi = name => midi(name.replace('s', '#'));
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  /* chord = [bass, four arpeggio notes] */
  const CH = {
    C: ['C2', 'G2', 'C3', 'E3', 'G3'],
    'G/B': ['B1', 'G2', 'B2', 'D3', 'G3'],
    G: ['G1', 'G2', 'B2', 'D3', 'G3'],
    Am: ['A1', 'E2', 'A2', 'C3', 'E3'],
    F: ['F1', 'F2', 'A2', 'C3', 'F3'],
    Em: ['E2', 'B2', 'E3', 'G3', 'B3'],
    Dm: ['D2', 'A2', 'D3', 'F3', 'A3'],
    A7: ['A1', 'E2', 'A2', 'C#3', 'G3']
  };

  /* ---------- the melody (note, beats) ---------- */
  const INTRO = [
    ['r', 1], ['E5', .5], ['D5', .5], ['C5', 1], ['G4', 1],
    ['r', 1], ['D5', .5], ['C5', .5], ['B4', 1], ['G4', 1],
    ['r', 1], ['C5', .5], ['B4', .5], ['A4', 1], ['E4', 1],
    ['r', 1], ['A4', .5], ['C5', .5], ['F5', 1], ['E5', 1]
  ];
  const VERSE = [
    ['r', .5], ['E4', .5], ['G4', .5], ['G4', .5], ['G4', .5], ['A4', .5], ['G4', 1],
    ['E4', 1], ['D4', .5], ['B3', .5], ['D4', 1.5], ['r', .5],
    ['r', .5], ['C4', .5], ['E4', .5], ['E4', .5], ['A4', 1], ['G4', 1],
    ['F4', .5], ['E4', .5], ['F4', 1], ['A4', 2],
    ['r', .5], ['E4', .5], ['G4', .5], ['C5', .5], ['C5', 1], ['B4', .5], ['A4', .5],
    ['G4', 1], ['A4', .5], ['G4', .5], ['D4', 2],
    ['r', .5], ['A4', .5], ['A4', .5], ['C5', .5], ['A4', 1], ['G4', 1],
    ['F4', .5], ['E4', .5], ['F4', .5], ['G4', .5], ['D4', 2]
  ];
  const CHORUS = [
    ['A4', .5], ['A4', .5], ['C5', 1], ['A4', 1], ['r', 1],
    ['D5', 1], ['B4', 1], ['G4', 2],
    ['r', .5], ['B4', .5], ['B4', 1], ['G4', 1], ['E4', .5], ['G4', .5],
    ['A4', 1], ['C5', 3],
    ['r', .5], ['A4', .5], ['C5', 1], ['r', .5], ['A4', .5], ['D5', 1],
    ['r', .5], ['B4', .5], ['D5', 1], ['B4', 1], ['G4', 1],
    ['r', .5], ['G4', .5], ['E5', 1], ['D5', .5], ['C5', .5], ['D5', .5], ['E5', .5],
    ['D5', 1], ['C5', 3]
  ];
  const BRIDGE = [
    ['E5', 1], ['E5', .5], ['D5', .5], ['C5', 1], ['B4', .5], ['A4', .5],
    ['C5', 1.5], ['A4', .5], ['A4', 2],
    ['G4', .5], ['G4', .5], ['C5', 1], ['E5', 1], ['D5', .5], ['C5', .5],
    ['D5', 1.5], ['B4', .5], ['G4', 2],
    ['E5', .5], ['E5', .5], ['E5', .5], ['D5', .5], ['C5', 1], ['A4', 1],
    ['C5', 1], ['F5', 1], ['E5', 2],
    ['r', .5], ['D5', .5], ['F5', .5], ['E5', .5], ['D5', 1], ['C5', 1],
    ['C#5', 1], ['E5', 1], ['A4', 2]
  ];
  const OUTRO = [
    ['A4', 2], ['C5', 2],
    ['B4', 2], ['D5', 2],
    ['E5', 1], ['D5', 1], ['C5', 2],
    ['G5', .5], ['E5', .5], ['C5', .5], ['G4', .5], ['C5', 2]
  ];

  const VERSE_CH = ['C', 'G/B', 'Am', 'F', 'C', 'G', 'F', 'G'];
  const CHORUS_CH = ['F', 'G', 'Em', 'Am', 'F', 'G', 'C', 'C'];
  const BRIDGE_CH = ['Am', 'F', 'C', 'G', 'Am', 'F', 'Dm', 'A7'];

  const SONG = [
    { part: 'Intro', chords: ['C', 'G/B', 'Am', 'F'], mel: INTRO, bell: true, soft: true,
      lyrics: ['♪  a little piano, just for you  ♪'], lineBeats: 16 },
    { part: 'Verse 1', chords: VERSE_CH, mel: VERSE, soft: true, lyrics: [
      'It started with a little "hello",',
      'a tiny spark I didn\'t know',
      'would turn the hours into minutes, love —',
      'fifteen hours were never enough.'] },
    { part: 'Chorus', chords: CHORUS_CH, mel: CHORUS, pad: true, bell: true, lyrics: [
      'Happy birthday, Alesha,',
      'my panda, my sweetest star,',
      'a hug, a kiss, a cuddle —',
      'I\'m sending them wherever you are.'] },
    { part: 'Verse 2', chords: VERSE_CH, mel: VERSE, lyrics: [
      'A gold-medal smile, a storybook mind,',
      'the sweetest heart I\'ll ever find,',
      'I\'m learning German just to say',
      '"Ich liebe dich" in every way.'] },
    { part: 'Chorus', chords: CHORUS_CH, mel: CHORUS, pad: true, bell: true, lyrics: [
      'Happy birthday, Alesha,',
      'my teddy bear, my moonlit sky,',
      'a hug, a kiss, a cuddle —',
      'and a million more when I\'m by your side.'] },
    { part: 'Bridge', chords: BRIDGE_CH, mel: BRIDGE, pad: true, lyrics: [
      'Soon the miles will fall away,',
      'I\'ll hold you close and want to stay —',
      'teddy bears and movie nights,',
      'Berlin streets and library lights…'] },
    { part: 'Final chorus', chords: CHORUS_CH, mel: CHORUS, pad: true, big: true, shift: 2, lyrics: [
      'Happy birthday, Alesha,',
      'thirty-three and shining bright,',
      'bis bald, mein Schatz, my forever —',
      'I\'ll hold you soon, and hold you tight.'] },
    { part: 'Outro', chords: ['F', 'G', 'C', 'C'], mel: OUTRO, bell: true, shift: 2,
      lyrics: ['…ich liebe dich, Alesha. 💗'], lineBeats: 16 }
  ];

  function build() {
    const ev = [], lines = [];
    let bar = 0;
    SONG.forEach(sec => {
      const shift = KEY + (sec.shift || 0);
      const arpVel = sec.big ? .27 : sec.soft ? .17 : .22;
      sec.chords.forEach((name, i) => {
        const t0 = (bar + i) * 4, c = CH[name];
        ev.push({ t: t0, d: 4, m: midi(c[0]) + shift, v: sec.soft ? .36 : .44, k: 'p' });
        if (sec.big) ev.push({ t: t0, d: 4, m: midi(c[0]) + 12 + shift, v: .26, k: 'p' });
        [c[1], c[2], c[3], c[4], c[3], c[2], c[1]].forEach((n, j) => {
          ev.push({ t: t0 + (j + 1) * .5, d: 1.7, m: midi(n) + shift, v: arpVel + (j === 3 ? .04 : 0) + Math.random() * .03, k: 'p' });
        });
        if (sec.pad) ev.push({ t: t0, d: 4, m: [c[2], c[3], c[4]].map(n => midi(n) + 12 + shift), v: sec.big ? 1.2 : 1, k: 'pad' });
      });
      let t = bar * 4;
      sec.mel.forEach(([n, d]) => {
        if (n !== 'r') {
          const m = midi(n) + shift, v = (sec.soft ? .56 : .64) + Math.random() * .05;
          ev.push({ t, d: d * .94, m, v, k: 'p' });
          if (sec.big) ev.push({ t, d: d * .94, m: m - 12, v: .32, k: 'p' });
          if (sec.bell) ev.push({ t, d, m: m + 12, v: 1, k: 'bell' });
        }
        t += d;
      });
      const span = sec.lineBeats || 8;
      sec.lyrics.forEach((txt, i) => lines.push({ t: bar * 4 + i * span, d: span, txt, part: i === 0 ? sec.part : '' }));
      bar += sec.chords.length;
    });
    ev.sort((a, b) => a.t - b.t);
    return { ev, lines, total: bar * 4 };
  }
  const song = build();

  /* ---------- Happy Birthday (public domain), as a little waltz ---------- */
  const HB_BEAT = 60 / 100;
  const HB = [
    ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
    ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
    ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1],
    ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3]
  ];
  const HB_CH = [[1, 'C'], [4, 'G'], [7, 'G'], [10, 'C'], [13, 'C'], [16, 'F'], [19, 'C'], [22, 'C']];
  const HB_LINES = [
    [0, 'Happy birthday to you 🎵'],
    [6, 'Happy birthday to you 🎶'],
    [12, 'Happy birthday, dear Alesha 💗'],
    [18, 'Happy birthday to you! 🎂']
  ];
  const HB_TOTAL = 25;

  /* ---------- audio graph ---------- */
  let ctx = null, songBus, fxBus, dry, wet, analyser;
  const raw = {}, samples = {};
  let decoding = null;

  function preload() {
    if (preload.done) return;
    preload.done = true;
    NAMES.forEach(n => {
      raw[n] = fetch(BASE + n + '.mp3', { mode: 'cors' })
        .then(r => (r.ok ? r.arrayBuffer() : null))
        .catch(() => null);
    });
  }

  function ensureCtx() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* not supported */ }
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = .008; comp.release.value = .25;
    const master = ctx.createGain(); master.gain.value = 1.6;
    const makeup = ctx.createGain(); makeup.gain.value = 1.25;
    analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = .78;
    master.connect(comp); comp.connect(makeup); makeup.connect(analyser); analyser.connect(ctx.destination);

    const rev = ctx.createConvolver(); rev.buffer = impulse(3, 2.4);
    wet = ctx.createGain(); wet.gain.value = .9; wet.connect(rev);
    const revOut = ctx.createGain(); revOut.gain.value = .3; rev.connect(revOut); revOut.connect(master);
    dry = master;

    songBus = ctx.createGain(); songBus.gain.value = 0; songBus.connect(dry); songBus.connect(wet);
    fxBus = ctx.createGain(); fxBus.gain.value = 1; fxBus.connect(dry); fxBus.connect(wet);
    return ctx;
  }

  function impulse(sec, decay) {
    const len = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function decodeAll() {
    if (decoding) return decoding;
    preload();
    decoding = Promise.all(NAMES.map(n => raw[n].then(ab => ab && new Promise(res => {
      try {
        ctx.decodeAudioData(ab, b => { samples[sampleMidi(n)] = b; res(); }, () => res());
      } catch (e) { res(); }
    }))));
    return decoding;
  }

  function nearestSample(m) {
    let best = null, bd = 99;
    for (const k in samples) { const d = Math.abs(k - m); if (d < bd) { bd = d; best = Number(k); } }
    return bd <= 4 ? best : null;
  }

  /* ---------- voices ---------- */
  function piano(m, t, dur, vel, bus) {
    const g = ctx.createGain();
    g.connect(bus);
    const k = nearestSample(m);
    if (k !== null) {
      const s = ctx.createBufferSource();
      s.buffer = samples[k];
      s.playbackRate.value = Math.pow(2, (m - k) / 12);
      s.connect(g);
      g.gain.setValueAtTime(vel * 1.15, t);
      g.gain.setTargetAtTime(0, t + dur, .32);
      s.start(t);
      s.stop(t + dur + 2);
      return;
    }
    /* fallback: a gentle electric-piano-ish synth */
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2200; f.connect(g);
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g2 = ctx.createGain();
    o1.type = 'triangle'; o1.frequency.value = hz(m);
    o2.type = 'sine'; o2.frequency.value = hz(m) * 2; g2.gain.value = .25;
    o1.connect(f); o2.connect(g2); g2.connect(f);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel * .45, t + .01);
    g.gain.setTargetAtTime(vel * .14, t + .01, .3);
    g.gain.setTargetAtTime(0, t + dur, .25);
    o1.start(t); o2.start(t); o1.stop(t + dur + 1.5); o2.stop(t + dur + 1.5);
  }

  function bell(m, t, vel, bus) {
    const g = ctx.createGain(); g.connect(bus);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.055 * vel, t + .004);
    g.gain.setTargetAtTime(0, t + .01, .4);
    [[1, 1], [2, .28], [4.2, .1]].forEach(([mul, amp]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'sine'; o.frequency.value = hz(m) * mul; og.gain.value = amp;
      o.connect(og); og.connect(g); o.start(t); o.stop(t + 2.4);
    });
  }

  function pad(ms, t, dur, vel, bus) {
    const g = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 1000; f.Q.value = .4;
    f.connect(g); g.connect(bus);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.022 * vel, t + .9);
    g.gain.setTargetAtTime(0, t + dur, .45);
    ms.forEach(m => [-7, 7].forEach(det => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = hz(m); o.detune.value = det;
      o.connect(f); o.start(t); o.stop(t + dur + 3);
    }));
  }

  function voice(e, at, bus, beat) {
    const dur = e.d * beat;
    if (e.k === 'p') piano(e.m, at, dur, e.v, bus);
    else if (e.k === 'bell') bell(e.m, at, e.v, bus);
    else if (e.k === 'pad') pad(e.m, at, dur, e.v, bus);
  }

  /* ---------- transport ---------- */
  let playing = false, wanted = false, startAt = 0, pausedBeat = 0, idx = 0, timer = 0, hbBusy = false;
  const subs = new Set();
  const notify = () => subs.forEach(fn => { try { fn(playing); } catch (e) { /* listener error */ } });

  function tick() {
    if (!playing) return;
    const now = ctx.currentTime, horizon = now + .3;
    for (let guard = 0; guard < 500; guard++) {
      if (idx >= song.ev.length) { startAt += (song.total + GAP) * BEAT; idx = 0; }
      const e = song.ev[idx], at = startAt + e.t * BEAT;
      if (at > horizon) break;
      if (at > now - .04) voice(e, Math.max(at, now), songBus, BEAT);
      idx++;
    }
  }

  function position() {
    if (!ctx) return 0;
    if (!playing) return pausedBeat;
    const L = song.total + GAP;
    let b = (ctx.currentTime - startAt) / BEAT;
    if (b < 0) b += L;
    if (b >= L) b -= L;
    return Math.max(0, b);
  }

  function play(from) {
    if (!ensureCtx()) return;
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    wanted = true;
    if (playing || hbBusy) { notify(); return; }
    const b = typeof from === 'number' ? from : pausedBeat;
    playing = true;
    startAt = ctx.currentTime + .15 - b * BEAT;
    idx = song.ev.findIndex(e => e.t >= b - 1e-6);
    if (idx < 0) idx = song.ev.length;
    songBus.gain.cancelScheduledValues(ctx.currentTime);
    songBus.gain.setTargetAtTime(1, ctx.currentTime, .12);
    tick();
    clearInterval(timer);
    timer = setInterval(tick, 40);
    notify();
  }

  function pause(keepWanted) {
    if (!wanted && !playing) return;
    if (!keepWanted) wanted = false;
    if (!playing) { notify(); return; }
    pausedBeat = position();
    playing = false;
    clearInterval(timer);
    songBus.gain.cancelScheduledValues(ctx.currentTime);
    songBus.gain.setTargetAtTime(0, ctx.currentTime, .06);
    notify();
  }

  function unlockIOS() {
    try {
      const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource();
      s.buffer = b; s.connect(ctx.destination); s.start(0);
    } catch (e) { /* not needed */ }
  }

  /* Must be called from a tap/click. Resolves once the music has started. */
  async function start() {
    preload();
    if (!ensureCtx()) return false;
    ctx.resume().catch(() => {});
    unlockIOS();
    await Promise.race([decodeAll(), new Promise(r => setTimeout(r, 3500))]);
    play(0);
    return true;
  }

  function toggle() {
    if (!ctx) { start(); return; }
    if (playing || (wanted && hbBusy)) pause(); else play();
  }

  function restart() {
    if (!ctx) { start(); return; }
    pause(true);
    pausedBeat = 0;
    play(0);
  }

  /* Sing "Happy Birthday" on the piano; pauses the love song and brings it back afterwards. */
  function birthday(onLine) {
    return new Promise(resolve => {
      if (!ensureCtx() || hbBusy) { resolve(false); return; }
      ctx.resume().catch(() => {});
      decodeAll();
      const resumeAfter = wanted;
      hbBusy = true;
      pause(true);
      notify();
      const t0 = ctx.currentTime + .35, shift = KEY;
      let t = 0;
      HB.forEach(([n, d]) => {
        const m = midi(n) + shift;
        piano(m, t0 + t * HB_BEAT, d * HB_BEAT * .95, .66, fxBus);
        bell(m + 12, t0 + t * HB_BEAT, 1.2, fxBus);
        t += d;
      });
      HB_CH.forEach(([b, name]) => {
        const c = CH[name];
        piano(midi(c[0]) + shift, t0 + b * HB_BEAT, 2.6 * HB_BEAT, .4, fxBus);
        [1, 2].forEach(off => [c[2], c[3], c[4]].forEach(n => piano(midi(n) + shift, t0 + (b + off) * HB_BEAT, .8 * HB_BEAT, .17, fxBus)));
      });
      const timers = HB_LINES.map(([b, txt], i) => setTimeout(() => onLine && onLine(txt, i), (b * HB_BEAT + .35) * 1000));
      setTimeout(() => {
        timers.forEach(clearTimeout);
        hbBusy = false;
        if (resumeAfter) { wanted = true; play(); } else notify();
        resolve(true);
      }, (HB_TOTAL * HB_BEAT + 1.6) * 1000);
    });
  }

  /* Pause while the page is hidden; carry on when she comes back. */
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) {
      if (playing) { pause(true); }
    } else if (wanted && !hbBusy) {
      play();
    }
  });

  return {
    preload, start, play: () => play(), pause: () => pause(), toggle, restart, birthday, position,
    get playing() { return playing; },
    get singing() { return hbBusy; },
    get started() { return !!ctx; },
    get lines() { return song.lines; },
    get total() { return song.total; },
    analyser: () => analyser,
    context: () => ctx,
    lineAt(beat) {
      const L = song.lines;
      let i = -1;
      for (let j = 0; j < L.length; j++) { if (L[j].t <= beat + .01) i = j; else break; }
      return i;
    },
    onChange(fn) { subs.add(fn); return () => subs.delete(fn); }
  };
})();
