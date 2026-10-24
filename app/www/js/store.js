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
    settings: { text: "m", sound: true, haptics: true, cb: false },
    unlocked: false,
    tutorial: false,
    last: null,     // storyId last played
    reviewAsked: false,
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
    m.reviewAsked = !!(a.reviewAsked || b.reviewAsked);
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
  Lamp.save = function () {
    Lamp.state.savedAt = Date.now();
    const json = JSON.stringify(Lamp.state);
    try { localStorage.setItem(KEY, json); } catch (e) {}
    Lamp.native("save", { state: json });
  };
  Lamp.resetAll = function () {
    const keep = { unlocked: Lamp.state.unlocked, settings: Lamp.state.settings };
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

  /* ---------- feedback: sound and vibration ---------- */
  let ctx = null;
  Lamp.sound = function (kind) {
    if (!Lamp.state.settings.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { tap: [660], word: [523, 784], bonus: [880], level: [523, 659, 784], bad: [196] }[kind] || [440];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t0 = ctx.currentTime + i * 0.09;
        o.type = kind === "bad" ? "triangle" : "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(kind === "tap" ? 0.04 : 0.12, t0 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + (kind === "tap" ? 0.08 : 0.35));
        o.connect(g).connect(ctx.destination); o.start(t0); o.stop(t0 + 0.4);
      });
    } catch (e) {}
  };
  Lamp.haptic = function (style) {
    if (!Lamp.state.settings.haptics) return;
    if (!Lamp.native("haptic", { style })) { try { navigator.vibrate && navigator.vibrate(style === "error" ? [20, 40, 20] : 12); } catch (e) {} }
  };
})();
