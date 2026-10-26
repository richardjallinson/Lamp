/* Lamp — saved state and the bridge to the iPhone app.
   Everything is kept on the device (localStorage). When running inside the iPhone app,
   each save is also handed to Swift, which mirrors it to the user's own iCloud. */
(function () {
  "use strict";
  const Lamp = (window.Lamp = window.Lamp || {});
  const KEY = "lamp-state-v1";
  const DEFAULT = {
    v: 1, savedAt: 0,
    oil: 3,
    progress: {},   // storyId -> number of levels completed (0..levels)
    completed: {},  // storyId -> "YYYY-MM-DD" first completed
    days: [],       // "YYYY-MM-DD" days with at least one level finished
    daily: {},      // "YYYY-MM-DD" -> {hints, secs}
    fav: {},        // storyId -> true
    bonus: {},      // levelId -> [bonus words found]
    settings: { text: "m", sound: true, music: false, haptics: true, cb: false, narr: true },
    unlocked: false,
    tutorial: false,
    intro: false,   // the full start screen has been seen once
    introAgain: false,   // tester tools: play the full start screen once more
    flaw: 0,        // flawless word levels in a row (no wrong words, no hints); every 3 earn a drop of oil
    adv: { relics: {}, seals: {}, gate: {}, p: {} },   // the adventure: relics found, story seals broken, Garden Gate steps
    last: null,     // storyId last played
    reviewAsked: false,
    devOpen: false,
    build: null,
    welcomed: false,  // the first-time welcome has been shown      // the build that saved this progress (see js/release.js)   // tester tools: every story open, ignoring the adventure order
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function normalise(s) {
    const out = clone(DEFAULT);
    if (!s || typeof s !== "object") return out;
    for (const k of Object.keys(DEFAULT)) if (s[k] !== undefined) out[k] = s[k];
    out.settings = Object.assign(clone(DEFAULT.settings), s.settings || {});
    return out;
  }

  /* Combine two copies of progress (this phone and iCloud) without losing anything. */
  function mergeStates(a, b) {
    const newer = a.savedAt >= b.savedAt ? a : b;
    const m = normalise(newer);
    const keys = (x, y) => new Set([...Object.keys(x || {}), ...Object.keys(y || {})]);
    m.progress = {};
    for (const k of keys(a.progress, b.progress)) m.progress[k] = Math.max(a.progress[k] || 0, b.progress[k] || 0);
    m.completed = {};
    for (const k of keys(a.completed, b.completed)) {
      const d = [a.completed[k], b.completed[k]].filter(Boolean).sort();
      m.completed[k] = d[0];
    }
    m.days = [...new Set([...(a.days || []), ...(b.days || [])])].sort();
    m.daily = Object.assign({}, b.daily, a.daily);
    m.bonus = {};
    for (const k of keys(a.bonus, b.bonus)) m.bonus[k] = [...new Set([...(a.bonus[k] || []), ...(b.bonus[k] || [])])];
    m.unlocked = !!(a.unlocked || b.unlocked);
    m.tutorial = !!(a.tutorial || b.tutorial);
    m.intro = !!(a.intro || b.intro);
    m.flaw = (a.savedAt >= b.savedAt ? a.flaw : b.flaw) || 0;
    const flags = (x, y) => Object.assign({}, (x || {}), (y || {}));
    const aa = a.adv || {}, ba = b.adv || {};
    m.adv = { relics: flags(aa.relics, ba.relics), seals: flags(aa.seals, ba.seals), gate: flags(aa.gate, ba.gate), p: flags(aa.p, ba.p) };
    m.reviewAsked = !!(a.reviewAsked || b.reviewAsked);
    m.build = a.build || b.build || null;
    return m;
  }

  function loadLocal() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return normalise(s); } catch (e) {}
    return clone(DEFAULT);
  }

  Lamp.hasNative = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.lamp);
  Lamp.native = function (type, data) {
    if (!Lamp.hasNative) return false;
    try { window.webkit.messageHandlers.lamp.postMessage(Object.assign({ type }, data || {})); return true; } catch (e) { return false; }
  };

  Lamp.state = loadLocal();
  /* a new build starts from the very first scene (js/release.js) */
  const staleBuild = (s) => Lamp.freshEachBuild && Lamp.build && s.build !== Lamp.build;
  if (staleBuild(Lamp.state)) {
    Lamp.state = Object.assign(clone(DEFAULT), { settings: Lamp.state.settings, build: Lamp.build });
    try { localStorage.setItem(KEY, JSON.stringify(Lamp.state)); } catch (e) {}
    Lamp.freshStart = true;
  }
  Lamp.save = function () {
    Lamp.state.savedAt = Date.now();
    if (Lamp.build) Lamp.state.build = Lamp.build;
    const json = JSON.stringify(Lamp.state);
    try { localStorage.setItem(KEY, json); } catch (e) {}
    Lamp.native("save", { state: json });
  };
  Lamp.resetAll = function () {
    const keep = { unlocked: Lamp.state.unlocked, settings: Lamp.state.settings, intro: Lamp.state.intro };
    Lamp.state = Object.assign(clone(DEFAULT), keep, { tutorial: true });
    Lamp.save();
    Lamp.native("reset");
  };
  Lamp.mergeStates = mergeStates;

  /* Messages from Swift arrive here: window.Lamp.fromNative({...}) */
  Lamp.fromNative = function (msg) {
    if (!msg || !msg.type) return;
    if (msg.type === "cloudState" && msg.state) {
      try {
        const incoming = normalise(JSON.parse(msg.state));
        if (staleBuild(incoming)) { Lamp.save(); return; }   // iCloud still holds an older build's progress: replace it
        Lamp.state = mergeStates(Lamp.state, incoming);
        try { localStorage.setItem(KEY, JSON.stringify(Lamp.state)); } catch (e) {}
        Lamp.refresh && Lamp.refresh();
      } catch (e) {}
    } else if (msg.type === "entitlement") {
      Lamp.state.unlocked = !!msg.unlocked;
      Lamp.save();
      Lamp.onUnlockChanged && Lamp.onUnlockChanged(msg);
    } else if (msg.type === "purchaseResult") {
      Lamp.onPurchaseResult && Lamp.onPurchaseResult(msg);
    } else if (msg.type === "price") {
      Lamp.price = msg.price;
    }
  };

  /* ---------- dates and the "keep the lamp lit" streak ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const key = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  Lamp.today = () => key(new Date());
  Lamp.dayAdd = (k, n) => { const d = new Date(k + "T12:00:00"); d.setDate(d.getDate() + n); return key(d); };
  Lamp.weekOf = (k) => { const d = new Date(k + "T12:00:00"); return Lamp.dayAdd(k, -d.getDay()); };

  /* Count back from today (or yesterday if today isn't played yet). A missed day is a rest day
     only if the day before it was played and that Sunday-Saturday week hasn't used its rest day.
     A second gap ends the streak. */
  Lamp.streak = function () {
    const set = new Set(Lamp.state.days), t = Lamp.today(), y = Lamp.dayAdd(t, -1);
    let k = set.has(t) ? t : y, n = 0;
    const rest = {}, restDays = [];
    for (let g = 0; g < 4000; g++) {
      if (set.has(k)) { n++; k = Lamp.dayAdd(k, -1); continue; }
      const prev = Lamp.dayAdd(k, -1), w = Lamp.weekOf(k);
      if ((n > 0 || k === y) && !rest[w] && set.has(prev)) { rest[w] = 1; restDays.push(k); k = prev; continue; }
      break;
    }
    return { n, lit: set.has(t), restDays };
  };
  Lamp.markPlayed = function () {
    const t = Lamp.today();
    if (Lamp.state.days.includes(t)) return false;
    Lamp.state.days.push(t);
    Lamp.save();
    return true;
  };

  /* ---------- feedback: sound, music and vibration ----------
     Sounds are original recordings made by app/tools/make_sounds.py, embedded in js/sounds.js.
     They are decoded once, after the first touch (iPhones only allow audio after a touch). */
  let ctx = null, master = null, buffers = {}, decoding = false, musicSrc = null, musicGain = null;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    }
    if (ctx.state !== "running") { try { ctx.resume(); } catch (e) {} }   // also after "interrupted" (iPhone: after the narration voice plays)
    if (!decoding && window.LAMP_SOUNDS) {
      decoding = true;
      Object.keys(window.LAMP_SOUNDS).filter((k) => !instKey(k)).forEach(decodeOne);
      if (Lamp.inst) decodeInst(Lamp.inst);
    }
    return ctx;
  }
  /* the letter instruments (one per era, see eras.js) are decoded only when a story of that era is played */
  const instKey = (k) => /^[a-z]+([1-7]|W)$/.test(k) && !/^tap/.test(k);
  const decodedInst = {};
  function decodeInst(inst) {
    if (!ctx || inst === "harp" || decodedInst[inst] || !window.LAMP_SOUNDS) return;
    decodedInst[inst] = true;
    Object.keys(window.LAMP_SOUNDS).filter((k) => k.indexOf(inst) === 0 && instKey(k)).forEach(decodeOne);
  }
  function decodeOne(k) {
    try {
      const b64 = window.LAMP_SOUNDS[k].split(",")[1], bin = atob(b64), u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      ctx.decodeAudioData(u8.buffer, (buf) => { buffers[k] = buf; if (k === "music") Lamp.musicUpdate(); }, () => {});
    } catch (e) {}
  }
  /* Each level gets one of these little tunes for its letters (scale steps 0-6), so picking letters plays a melody */
  const TUNES = [[0, 1, 2, 3, 4, 5, 6], [0, 2, 1, 3, 2, 4, 3, 5, 4, 6], [0, 4, 2, 5, 3, 6, 4], [2, 1, 3, 2, 4, 3, 5, 4, 6],
    [0, 1, 2, 4, 3, 5, 6, 5], [4, 2, 0, 1, 3, 5, 6], [0, 2, 4, 3, 1, 3, 5, 6], [1, 0, 2, 4, 3, 5, 4, 6]];
  Lamp.setInstrument = function (inst, seed) {
    Lamp.inst = inst || "harp";
    Lamp.tune = TUNES[Math.abs(seed | 0) % TUNES.length];
    decodeInst(Lamp.inst);
  };
  /* the start screen plays its own music through the same audio context */
  Lamp.audioOut = function () { const c = audio(); return c ? { ctx: c, out: master } : null; };
  /* the music goes quiet while the Lamplighter speaks */
  Lamp.duck = function (on) {
    if (!musicGain || !ctx) return;
    try { const t = ctx.currentTime; musicGain.gain.cancelScheduledValues(t); musicGain.gain.setValueAtTime(musicGain.gain.value, t); musicGain.gain.linearRampToValueAtTime(on ? 0.07 : 0.32, t + (on ? 0.4 : 1.2)); } catch (e) {}
  };
  Lamp.sound = function (kind, index) {
    if (!Lamp.state.settings.sound) return;
    const c = audio(); if (!c) return;
    const inst = Lamp.inst || "harp", tune = Lamp.tune || TUNES[0];
    let name = kind, fall = kind;
    if (kind === "tap") { const i = Math.max(index || 0, 0), step = tune[i % tune.length] + 1; fall = "tap" + step; name = inst === "harp" ? fall : inst + step; }
    else if (kind === "word" && inst !== "harp") name = inst + "W";
    const buf = buffers[name] || buffers[fall]; if (!buf) return;
    const src = c.createBufferSource(), g = c.createGain();
    g.gain.value = { tap: 0.55, shuffle: 0.6, bad: 0.7 }[kind] || 0.85;
    src.buffer = buf; src.connect(g).connect(master); src.start();
  };
  /* Quiet ambient music: off unless switched on in Settings. Loops seamlessly. */
  Lamp.musicUpdate = function () {
    const want = !!Lamp.state.settings.music && !document.hidden && Lamp.audioUnlocked && !Lamp.introOn;
    if (want) {
      const c = audio(); if (!c || musicSrc || !buffers.music) return;
      const L = window.LAMP_MUSIC_LOOP || { start: 0.2, length: 32 };
      musicSrc = c.createBufferSource(); musicGain = c.createGain();
      musicSrc.buffer = buffers.music; musicSrc.loop = true; musicSrc.loopStart = L.start; musicSrc.loopEnd = L.start + L.length;
      musicGain.gain.setValueAtTime(0.0001, c.currentTime); musicGain.gain.exponentialRampToValueAtTime(0.32, c.currentTime + 2.5);
      musicSrc.connect(musicGain).connect(master); musicSrc.start(0, L.start);
    } else if (musicSrc) {
      const s = musicSrc, g = musicGain; musicSrc = null; musicGain = null;
      try { g.gain.setValueAtTime(g.gain.value, ctx.currentTime); g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8); s.stop(ctx.currentTime + 0.9); } catch (e) {}
    }
  };
  function unlock() {
    Lamp.audioUnlocked = true; audio(); Lamp.musicUpdate();
    document.removeEventListener("pointerdown", unlock, true); document.removeEventListener("touchend", unlock, true);
  }
  document.addEventListener("pointerdown", unlock, true);
  document.addEventListener("touchend", unlock, true);
  document.addEventListener("visibilitychange", () => { if (ctx && !document.hidden && ctx.state !== "running") ctx.resume(); Lamp.musicUpdate(); });
  Lamp.haptic = function (style) {
    if (!Lamp.state.settings.haptics) return;
    if (!Lamp.native("haptic", { style })) { try { navigator.vibrate && navigator.vibrate(style === "error" ? [20, 40, 20] : 12); } catch (e) {} }
  };
})();
