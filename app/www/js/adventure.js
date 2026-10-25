/* Lamp — the adventure (pilot: Creation → Eden → the Fall → the Garden Gate).

   Finishing a story offers its Story Seal: a short puzzle built on that story's scripture.
   Breaking a seal earns the story's relic, which goes into the satchel. Relics open the chambers:
   painted scenes you tap through like Myst, solved with what you have learned.

     Creation  → "Light the Days"   (order the seven days of Genesis 1)  → Stone of Days
     Eden      → "The Four Rivers"  (word search, Genesis 2:10-14)       → Onyx Stone
     The Fall  → the Coat of Skins (Genesis 3:21), and the Garden Gate chamber:
                 lamp light reveals letters → spell LIGHT → set the Onyx Stone → the dial of days rises →
                 the Stone of Days unlocks it → turn it to the day of rest → the flaming sword is still →
                 lay the Coat of Skins on the threshold → the gate opens → on to Noah.

   Progress is saved in Lamp.state.adv = { relics: {id:1}, seals: {storyId:1}, gate: {step flags} }. */
(function () {
  "use strict";
  const Lamp = (window.Lamp = window.Lamp || {});
  const D = window.LAMP_DATA;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const IMG = "img/adv/";
  const STEP = 360 / 7;

  const RELICS = {
    days: { name: "Stone of Days", img: "relic-days.webp", story: "creation",
      v: "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.", ref: "Genesis 2:2" },
    onyx: { name: "Onyx Stone", img: "relic-onyx.webp", story: "eden",
      v: "And the gold of that land is good: there is bdellium and the onyx stone.", ref: "Genesis 2:12" },
    coat: { name: "Coat of Skins", img: "relic-coat.webp", story: "fall",
      v: "Unto Adam also and to his wife did the LORD God make coats of skins, and clothed them.", ref: "Genesis 3:21" },
  };
  const ORDER = ["days", "onyx", "coat"];
  const SEALS = { creation: { relic: "days", title: "Light the Days", run: lightTheDays }, eden: { relic: "onyx", title: "The Four Rivers", run: fourRivers },
    fall: { relic: "coat", title: "The Garden Gate", run: null } };

  /* ---------- saved progress ---------- */
  function A() {
    const s = Lamp.state;
    if (!s.adv || typeof s.adv !== "object") s.adv = {};
    s.adv.relics = s.adv.relics || {}; s.adv.seals = s.adv.seals || {}; s.adv.gate = s.adv.gate || {};
    return s.adv;
  }
  const has = (r) => !!A().relics[r];
  const story = (id) => D.stories.find((s) => s.id === id);
  const done = (id) => !!Lamp.state.completed[id];

  /* ---------- sound: the game's sounds plus a few made here (stone, click) ---------- */
  function snd(k, i) { Lamp.sound && Lamp.sound(k, i); }
  function sfx(kind) {
    if (!Lamp.state.settings.sound || !Lamp.audioOut) return;
    const a = Lamp.audioOut(); if (!a) return;
    const c = a.ctx, t = c.currentTime, len = kind === "stone" ? 1.3 : 0.08;
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * len), c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf;
    if (kind === "stone") {
      f.type = "lowpass"; f.frequency.setValueAtTime(260, t); f.frequency.linearRampToValueAtTime(90, t + len);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.9, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    } else {
      f.type = "bandpass"; f.frequency.value = 2400; f.Q.value = 2;
      g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    }
    src.connect(f).connect(g).connect(a.out); src.start(t);
  }
  const buzz = (s) => Lamp.haptic && Lamp.haptic(s);

  /* ---------- the layer ---------- */
  let root = null, sayTimer = 0, selected = null, onClose = null, mode = null;   // mode: which seal or chamber is open (for tester Skip)
  function open(title, opts) {
    shut(true); mode = null;
    root = document.createElement("div");
    root.id = "adv"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", title);
    root.innerHTML = '<div class="adv-scene" id="adv-scene"></div>' +
      '<div class="adv-top"><button class="abtn" id="adv-x" aria-label="Leave">✕</button><span class="ttl" id="adv-ttl">' + esc(title) + "</span>" +
      '<button class="abtn" id="adv-hint" aria-label="Hint, costs one drop of oil">' + Lamp.ICON.hint + "<span>1</span></button></div>" +
      '<div class="say" id="adv-say" aria-live="polite"></div>' +
      (opts && opts.satchel ? '<div class="satchel" id="adv-satchel"></div>' : "");
    document.body.appendChild(root);
    requestAnimationFrame(() => root && root.classList.add("on"));
    $("adv-x").onclick = () => shut();
    $("adv-hint").style.visibility = opts && opts.hint ? "visible" : "hidden";
    $("adv-hint").onclick = () => {
      if (!opts.hint) return;
      if (Lamp.state.oil < 1) { say("Your lamp is out of oil. Find bonus words in the stories to fill it."); return; }
      Lamp.state.oil--; Lamp.save(); snd("hint"); opts.hint();
    };
    selected = null; onClose = opts && opts.onClose;
    if (opts && opts.satchel) satchel();
    return root;
  }
  function shut(quiet) {
    if (!root) return;
    Lamp.narr && Lamp.narr.stop();
    const r = root, cb = onClose; root = null; onClose = null; selected = null;
    clearTimeout(sayTimer); window.removeEventListener("resize", fitAll);
    r.classList.remove("on"); setTimeout(() => r.remove(), 450);
    if (!quiet) { cb && cb(); if ($("level") && !$("level").hidden && Lamp.closeLevel) Lamp.closeLevel(); else Lamp.refresh && Lamp.refresh(); }
  }
  function say(text, ref, ms) {
    const el = $("adv-say"); if (!el) return;
    el.innerHTML = esc(text) + (ref ? "<small>" + esc(ref) + "</small>" : "");
    el.classList.add("on"); clearTimeout(sayTimer);
    sayTimer = setTimeout(() => el.classList.remove("on"), ms || Math.max(3200, text.length * 55));
  }
  function card(html, acts) {
    if (!root) return;
    const sh = document.createElement("div"); sh.className = "asheet";
    sh.innerHTML = '<div class="card" role="dialog" aria-modal="true">' + html + "</div>";
    root.appendChild(sh);
    sh.addEventListener("click", (e) => { const b = e.target.closest("[data-act]"); if (!b) return; sh.remove(); acts[b.dataset.act] && acts[b.dataset.act](); });
    const f = sh.querySelector("[data-act]"); f && f.focus({ preventScroll: true });
  }

  /* ---------- the satchel ---------- */
  function satchel() {
    const el = $("adv-satchel"); if (!el) return;
    const used = A().gate;
    el.innerHTML = '<span class="lbl">Satchel</span>' + ORDER.map((r) => {
      const R = RELICS[r];
      if (!has(r)) return '<button class="relic empty" aria-label="Empty: ' + esc(R.name) + ' not found yet" data-relic="' + r + '"></button>';
      const isUsed = (r === "onyx" && used.onyx) || (r === "days" && used.keyed) || (r === "coat" && used.coat);
      return '<button class="relic' + (selected === r ? " sel" : "") + (isUsed ? " used" : "") + '" data-relic="' + r + '" aria-label="' + esc(R.name) + '"><img src="' + IMG + R.img + '" alt=""></button>';
    }).join("");
    el.querySelectorAll(".relic").forEach((b) => (b.onclick = () => {
      const r = b.dataset.relic, R = RELICS[r];
      if (!has(r)) { const st = story(R.story); say("Not found yet. It comes from the story “" + st.title + "”."); return; }
      selected = selected === r ? null : r; sfx("click");
      if (selected) say(R.name + " · tap where to use it", R.ref, 2600);
      satchel();
    }));
  }
  function take() { const r = selected; selected = null; satchel(); return r; }

  /* ---------- scenes: a painting fitted to fill the screen, with tappable places on it ---------- */
  const boxes = [];
  function fitAll() { boxes.forEach((b) => fit(b.el, b.w, b.h)); }
  function fit(box, W, H) {
    const sc = $("adv-scene"); if (!sc) return;
    const r = sc.getBoundingClientRect(), k = Math.max(r.width / W, r.height / H);
    Object.assign(box.style, { width: W * k + "px", height: H * k + "px", left: (r.width - W * k) / 2 + "px", top: (r.height - H * k) / 2 + "px" });
  }
  function scene(img, W, H) {
    const sc = $("adv-scene"); sc.innerHTML = ""; boxes.length = 0;
    const box = document.createElement("div"); box.className = "adv-box";
    box.innerHTML = '<img class="bgimg" src="' + IMG + img + '" alt="">';
    sc.appendChild(box); boxes.push({ el: box, w: W, h: H }); fit(box, W, H);
    window.removeEventListener("resize", fitAll); window.addEventListener("resize", fitAll);
    return box;
  }
  function hot(box, x0, y0, x1, y1, label, fn) {
    const h = document.createElement("button"); h.className = "hot"; h.setAttribute("aria-label", label);
    Object.assign(h.style, { left: x0 * 100 + "%", top: y0 * 100 + "%", width: (x1 - x0) * 100 + "%", height: (y1 - y0) * 100 + "%", background: "transparent", border: "none" });
    h.onclick = (e) => { e.stopPropagation(); fn(h); };
    box.appendChild(h); return h;
  }

  /* ---------- relic reward ---------- */
  /* oil for solving well: +1 with no mistakes and no hints, +1 more if quick (only the first time a seal is broken) */
  function rewards(st) {
    if (!st) return "";
    const lines = [], clean = !st.hints && st.misses <= (st.allow || 0), quick = !st.hints && st.swift && st.secs <= st.swift;
    if (clean) lines.push("<b>Flawless</b> · no mistakes, no hints · +1 oil");
    if (quick) lines.push("<b>Swift</b> · solved in " + Math.round(st.secs) + " seconds · +1 oil");
    const oil = lines.length; if (oil) { Lamp.state.oil += oil; Lamp.save(); }
    return oil ? '<div class="rewards">' + lines.map((l) => "<div>" + Lamp.ICON.oil + " " + l + "</div>").join("") + "</div>"
      : '<div class="rewards none">Solve a seal with no mistakes or hints, or quickly, to earn drops of oil.</div>';
  }
  function giveRelic(r, then, extra) {
    const R = RELICS[r], first = !has(r);
    A().relics[r] = 1; Lamp.save();
    snd("story"); buzz("success");
    card('<div class="kick">' + (first ? "Relic found" : "Relic") + '</div><img class="relic-big" src="' + IMG + R.img + '" alt=""><h2>' + esc(R.name) + "</h2>" +
      '<div class="v">“' + esc(R.v) + '”</div><div class="r">' + esc(R.ref) + " · KJV</div>" +
      "<p>" + (first ? "Added to your satchel. Relics open the chambers on the way ahead." : "It is already in your satchel.") + "</p>" + (extra || "") +
      '<button class="cta" data-act="go">Continue</button>', { go: then });
  }
  function afterSeal(id) {
    const st = story(id), idx = D.stories.indexOf(st), nx = D.stories[idx + 1];
    const nextOpen = nx && (nx.free || Lamp.state.unlocked);
    card('<div class="kick">Seal broken</div><h2>' + esc(st.title) + "</h2><p>" + (nx ? "Next story: <b>" + esc(nx.title) + "</b>." : "") + "</p>" +
      (nx ? '<button class="cta" data-act="next">' + (nextOpen ? "Play next story" : "Unlock the next story") + "</button>" : "") +
      '<button class="cta alt" data-act="leave">Back to the journey</button>', {
      next: () => { shut(true); const go = () => { if (nextOpen) Lamp.playStory(nx, false); else { Lamp.closeLevel && Lamp.closeLevel(); Lamp.showUnlock(nx); } };
        if (Lamp.narr) Lamp.narr.ending(st, nx, nextOpen ? "Play next story" : "Unlock the next story", go); else go(); },
      leave: () => { shut(true); Lamp.closeLevel && Lamp.closeLevel(); },
    });
  }
  function sealDone(id, stats) {
    const first = !A().seals[id];
    A().seals[id] = 1; Lamp.save();
    giveRelic(SEALS[id].relic, () => afterSeal(id), first ? rewards(stats) : "");
  }

  /* ======================================================================
     Creation — Light the Days. Each round shows the words God spoke on the next day;
     the player drags (or taps) the matching stone chip into the dial, day by day.
     ====================================================================== */
  const DAYS = [
    ["Let there be light", "Genesis 1:3"], ["Let there be a firmament in the midst of the waters", "Genesis 1:6"],
    ["Let the earth bring forth grass", "Genesis 1:11"], ["Let there be lights in the firmament of the heaven", "Genesis 1:14"],
    ["Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth", "Genesis 1:20"],
    ["Let the earth bring forth the living creature after his kind", "Genesis 1:24"],
    ["And he rested on the seventh day from all his work which he had made", "Genesis 2:2"],
  ];
  function lightTheDays() {
    let next = 0, misses = 0, run = 0, hints = 0, busy = false;
    const t0 = Date.now();
    open("Story seal · Creation", { hint: () => { hints++; nudge(); say("This chip matches the words for day " + (next + 1) + "."); } });
    mode = "creation";
    const st = story("creation");
    $("adv-scene").innerHTML = '<div class="seal"><div class="bgp" style="background-image:url(img/' + st.img + ')"></div><h1>Light the Days</h1>' +
      '<p class="how">Read what God spoke on each day, then set the matching stone into the dial.</p>' +
      '<div class="ddial" id="ld-dial"><img class="base" src="' + IMG + 'dial.webp" alt="">' +
      DAYS.map((_, i) => '<img class="day" id="ld-d' + i + '" src="' + IMG + "day-" + (i + 1) + '.webp" alt="">').join("") + "</div>" +
      '<div class="line clue" id="ld-line" aria-live="polite"></div><div class="dcards" id="ld-cards"></div></div>';
    const order = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
    const cards = $("ld-cards"), dial = $("ld-dial");
    cards.innerHTML = order.map((i) => '<button class="dcard" data-day="' + i + '" aria-label="Stone chip"><img src="' + IMG + "card-" + (i + 1) + '.webp" alt=""></button>').join("");
    function clue() {
      $("ld-line").innerHTML = '<span class="dayno">Day ' + (next + 1) + "</span>“" + esc(DAYS[next][0]) + "”<small>" + esc(DAYS[next][1]) + "</small>";
      $("ld-line").classList.remove("pop"); void $("ld-line").offsetWidth; $("ld-line").classList.add("pop");
    }
    function nudge() { cards.querySelectorAll(".nudge").forEach((c) => c.classList.remove("nudge")); const c = cards.querySelector('[data-day="' + next + '"]'); if (c) c.classList.add("nudge"); }
    clue();
    function back(b) {   // a wrong chip slides home with a little shake
      b.classList.remove("drag"); b.style.transform = ""; snd("bad"); buzz("error");
      setTimeout(() => { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }, 260);
    }
    function place(b) {
      const d = +b.dataset.day;
      if (d !== next) { misses++; run++; back(b); if (run >= 2) nudge(); return; }
      run = 0; busy = true;
      const r = b.getBoundingClientRect(), dr = dial.getBoundingClientRect(), a = d * STEP * Math.PI / 180;
      const tx = dr.left + dr.width / 2 + Math.sin(a) * dr.width * 0.33 - (r.left + r.width / 2);
      const ty = dr.top + dr.height / 2 - Math.cos(a) * dr.height * 0.33 - (r.top + r.height / 2);
      const prev = b.style.transform && b.style.transform.match(/translate\(([-\d.]+)px, ?([-\d.]+)px\)/);
      const px = prev ? +prev[1] : 0, py = prev ? +prev[2] : 0;
      b.classList.remove("drag", "nudge"); b.classList.add("flying");
      b.style.transform = "translate(" + (px + tx) + "px," + (py + ty) + "px) rotate(" + d * STEP + "deg) scale(.5)";
      snd("tap", d); buzz("light");
      setTimeout(() => {
        b.classList.add("gone"); $("ld-d" + d).classList.add("on"); sfx("click");
        next++; busy = false;
        if (next < 7) { clue(); return; }
        $("ld-line").innerHTML = "“And God saw every thing that he had made, and, behold, it was very good.”<small>Genesis 1:31</small>";
        setTimeout(() => { dial.classList.add("done"); snd("level"); sfx("stone"); }, 300);
        setTimeout(() => sealDone("creation", { misses, hints, secs: (Date.now() - t0) / 1000, swift: 60 }), 2900);
      }, 560);
    }
    /* drag a chip onto the stone, or simply tap it */
    cards.querySelectorAll(".dcard").forEach((b) => {
      let sx = 0, sy = 0, moved = false, down = false;
      b.addEventListener("pointerdown", (e) => { if (busy || b.classList.contains("gone")) return; down = true; moved = false; sx = e.clientX; sy = e.clientY; b.setPointerCapture(e.pointerId); });
      b.addEventListener("pointermove", (e) => {
        if (!down) return; const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 8) return;
        moved = true; b.classList.add("drag"); b.style.transform = "translate(" + dx + "px," + dy + "px) scale(1.08)";
      });
      const up = (e) => {
        if (!down) return; down = false;
        if (!moved) { place(b); return; }
        const dr = dial.getBoundingClientRect();
        const over = e.clientX > dr.left && e.clientX < dr.right && e.clientY > dr.top && e.clientY < dr.bottom;
        if (over) { b.style.transform = b.style.transform.replace(/ scale\([\d.]+\)/, ""); place(b); }
        else { b.classList.remove("drag"); b.style.transform = ""; }
      };
      b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up);
      b.addEventListener("click", (e) => e.preventDefault());
    });
  }

  /* ======================================================================
     Eden — The Four Rivers: a word search (Genesis 2:10-14).
     ====================================================================== */
  const RIVERS = ["PISON", "GIHON", "HIDDEKEL", "EUPHRATES"];
  const EDEN_WORDS = RIVERS.concat(["EDEN", "GARDEN", "RIVER", "GOLD", "ONYX", "TREE"]);
  function makeGrid(seed) {
    let s = seed;
    const rnd = () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const N = 10, g = Array.from({ length: N }, () => Array(N).fill("")), dirs = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    const words = EDEN_WORDS.slice().sort((a, b) => b.length - a.length);
    for (const w of words) {
      let ok = false;
      for (let tries = 0; tries < 400 && !ok; tries++) {
        const [dr, dc] = dirs[Math.floor(rnd() * dirs.length)], r0 = Math.floor(rnd() * N), c0 = Math.floor(rnd() * N);
        const r1 = r0 + dr * (w.length - 1), c1 = c0 + dc * (w.length - 1);
        if (r1 < 0 || r1 >= N || c1 < 0 || c1 >= N) continue;
        let fits = true;
        for (let i = 0; i < w.length; i++) { const ch = g[r0 + dr * i][c0 + dc * i]; if (ch && ch !== w[i]) { fits = false; break; } }
        if (!fits) continue;
        for (let i = 0; i < w.length; i++) g[r0 + dr * i][c0 + dc * i] = w[i];
        ok = true;
      }
      if (!ok) return null;
    }
    const fill = "ABDEGHILMNORSTUWY";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!g[r][c]) g[r][c] = fill[Math.floor(rnd() * fill.length)];
    return g;
  }
  function fourRivers() {
    let g = null;
    for (let seed = 2210; !g; seed++) g = makeGrid(seed);
    const found = new Set(), t0 = Date.now();
    let hints = 0, misses = 0;
    open("Story seal · Eden", { hint: () => {
      hints++;
      const left = EDEN_WORDS.filter((w) => !found.has(w)); if (!left.length) return;
      const w = left[0], at = locate(w); if (!at) return;
      const cell = grid.children[at[0] * 10 + at[1]]; cell.classList.remove("hint"); void cell.offsetWidth; cell.classList.add("hint");
      say("Look for " + w + " starting here.");
    } });
    mode = "eden";
    const st = story("eden");
    $("adv-scene").innerHTML = '<div class="seal"><div class="bgp" style="background-image:url(img/' + st.img + ')"></div><h1>The Four Rivers</h1>' +
      '<p class="how">“And a river went out of Eden to water the garden; and from thence it was parted, and became into four heads.” Genesis 2:10</p>' +
      '<div class="wgrid" id="wg" role="grid" aria-label="Word search"></div><div class="wlist" id="wl"></div>' +
      '<div class="line" id="wline">Drag across the letters to find each word.</div></div>';
    Lamp.narr && Lamp.narr.play("gen-02-rivers");
    const grid = $("wg"), list = $("wl");
    grid.innerHTML = g.map((row, r) => row.map((ch, c) => '<span class="wc" data-r="' + r + '" data-c="' + c + '">' + ch + "</span>").join("")).join("");
    function drawList() { list.innerHTML = EDEN_WORDS.map((w) => '<span class="' + (RIVERS.includes(w) ? "river " : "") + (found.has(w) ? "done" : "") + '">' + w + "</span>").join(""); }
    drawList();
    function locate(w) {
      const dirs = [[0, 1], [1, 0], [1, 1], [-1, 1]];
      for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) for (const [dr, dc] of dirs) {
        let ok = true;
        for (let i = 0; i < w.length; i++) { const rr = r + dr * i, cc = c + dc * i; if (rr < 0 || rr > 9 || cc < 0 || cc > 9 || g[rr][cc] !== w[i]) { ok = false; break; } }
        if (ok) return [r, c];
      }
      return null;
    }
    let start = null, path = [];
    const cellAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.classList && el.classList.contains("wc") ? el : null; };
    function line(a, b) {
      const r0 = +a.dataset.r, c0 = +a.dataset.c, r1 = +b.dataset.r, c1 = +b.dataset.c, dr = Math.sign(r1 - r0), dc = Math.sign(c1 - c0);
      const n = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0));
      if (!(r0 === r1 || c0 === c1 || Math.abs(r1 - r0) === Math.abs(c1 - c0))) return null;
      const out = []; for (let i = 0; i <= n; i++) out.push(grid.children[(r0 + dr * i) * 10 + c0 + dc * i]); return out;
    }
    function paint() { grid.querySelectorAll(".wc.sel").forEach((c) => c.classList.remove("sel")); path.forEach((c) => c.classList.add("sel")); }
    grid.addEventListener("pointerdown", (e) => { const c = cellAt(e.clientX, e.clientY); if (!c) return; start = c; path = [c]; paint(); grid.setPointerCapture(e.pointerId); snd("tap", 0); });
    grid.addEventListener("pointermove", (e) => {
      if (!start) return; const c = cellAt(e.clientX, e.clientY); if (!c) return;
      const p = line(start, c); if (p && p.length !== path.length) { path = p; paint(); snd("tap", Math.min(path.length - 1, 6)); }
    });
    const end = () => {
      if (!start) return;
      const w = path.map((c) => c.textContent).join(""), rw = w.split("").reverse().join("");
      const hit = EDEN_WORDS.find((x) => !found.has(x) && (x === w || x === rw));
      if (hit) {
        found.add(hit); path.forEach((c) => c.classList.add(RIVERS.includes(hit) ? "f-river" : "f-gold"));
        snd(RIVERS.includes(hit) ? "bonus" : "word"); buzz("light"); drawList();
        const notes = { PISON: "Pison: “that is it which compasseth the whole land of Havilah, where there is gold.” Genesis 2:11",
          GIHON: "Gihon: “the same is it that compasseth the whole land of Ethiopia.” Genesis 2:13",
          HIDDEKEL: "Hiddekel: “that is it which goeth toward the east of Assyria.” Genesis 2:14",
          EUPHRATES: "“And the fourth river is Euphrates.” Genesis 2:14", ONYX: "“there is bdellium and the onyx stone.” Genesis 2:12",
          GOLD: "“And the gold of that land is good.” Genesis 2:12", TREE: "“the tree of life also in the midst of the garden.” Genesis 2:9" };
        $("wline").textContent = notes[hit] || hit + " found.";
        if (found.size === EDEN_WORDS.length) { setTimeout(() => snd("level"), 400); setTimeout(() => sealDone("eden", { misses, hints, allow: 2, secs: (Date.now() - t0) / 1000, swift: 150 }), 1600); }
      } else if (path.length > 1) { misses++; snd("bad"); }
      start = null; path = []; paint();
    };
    grid.addEventListener("pointerup", end); grid.addEventListener("pointercancel", end);
  }

  /* ======================================================================
     The Garden Gate chamber.
     ====================================================================== */
  const GW = 941, GH = 1672;
  function G() { return A().gate; }
  function setG(k) { G()[k] = 1; Lamp.save(); satchel(); }
  function gateHint() {
    const g = G(); g.hints = (g.hints || 0) + 1; Lamp.save();
    const tips = !g.light ? "The blank stone in the middle of the gate. Look closely, and bring your lamp."
      : !g.onyx ? (has("onyx") ? "The hollow at the top of the stone waits for a stone of its own. Choose the Onyx Stone in your satchel, then tap the hollow." : "You need the Onyx Stone. It is found by breaking the seal of “A Garden Eastward in Eden”.")
      : !g.keyed ? (has("days") ? "The dial will not turn. Choose the Stone of Days in your satchel, then tap the centre of the dial." : "You need the Stone of Days, from the seal of “Let There Be Light”.")
      : !g.rest ? "Turn the dial until the day God rested is under the golden mark."
      : !g.coat ? "The sword is still. Choose the Coat of Skins and tap the threshold steps in front of the doors."
      : "The gate is open.";
    say(tips);
  }
  function openGate() {
    const r = open("The Garden Gate", { satchel: true, hint: gateHint });
    if (!r) return;
    mode = "gate";
    gateScene(true);
  }
  function gateScene(arrive, stopping) {
    const g = G();
    if (g.open) { openView(false); return; }
    const box = scene("gate.jpg", GW, GH);
    box.insertAdjacentHTML("beforeend", '<div class="seam" id="gseam"></div>' +
      '<div class="swordwrap"><div class="bob"><div class="sword-turn"><img class="sword" src="' + IMG + 'sword.webp" alt=""></div></div></div>' +
      '<img class="coat-laid" id="gcoat" src="' + IMG + 'relic-coat.webp" alt="">');
    if (g.rest && !stopping) root.classList.add("still");
    if (stopping) setTimeout(() => { if (root) { root.classList.add("still"); sfx("stone"); buzz("success"); say("The flaming sword is still, and fades away. The way to the threshold is open."); } }, 900);
    hot(box, 0.02, 0.2, 0.3, 0.62, "Cherub on the left", () => say("“He placed at the east of the garden of Eden Cherubims…”", "Genesis 3:24"));
    hot(box, 0.72, 0.2, 0.98, 0.62, "Cherub on the right", () => say("Carved guardians, wings raised. They have watched this gate since the beginning."));
    hot(box, 0.42, 0.36, 0.62, 0.6, "The stone panel in the gate", () => { sfx("click"); panelScene(); });
    hot(box, 0.33, 0.27, 0.42, 0.66, "The left door", () => say(g.rest ? "The doors are heavy and still. Something must be laid at the threshold." : "“…a flaming sword which turned every way, to keep the way of the tree of life.”", g.rest ? "" : "Genesis 3:24"));
    hot(box, 0.62, 0.27, 0.72, 0.66, "The right door", () => say("Light glows through the seam. Something lies beyond."));
    hot(box, 0.22, 0.655, 0.86, 0.71, "The threshold steps", () => {
      const r = selected;
      if (!G().rest) { if (r) take(); say("The flaming sword turns every way. Nothing can pass while it burns."); snd("bad"); return; }
      if (r === "coat") { take(); layCoat(); return; }
      if (r) { take(); say("Nothing happens."); return; }
      say("A worn stone threshold, as if waiting for an offering.");
    });
    if (arrive) say(g.light ? "You are back at the Garden Gate." : "The way to the tree of life is shut, and a flaming sword turns before the gate.", g.light ? "" : "Genesis 3:24");
    else if (g.rest && !g.coat && !stopping) say("The sword is still. The way to the threshold is open.");
  }

  function panelScene() {
    const g = G(), box = scene("panel.jpg", GW, GH);
    const LET = [["T", 0.33, 0.4], ["H", 0.67, 0.46], ["G", 0.42, 0.6], ["I", 0.69, 0.68], ["L", 0.31, 0.74]];
    box.insertAdjacentHTML("beforeend", '<div class="lit-panel' + (g.light ? " on" : "") + '" id="plit"></div>' +
      LET.map((l, i) => '<span class="glyph" id="pg' + i + '" style="left:' + l[1] * 100 + "%;top:" + l[2] * 100 + '%">' + l[0] + "</span>").join("") +
      '<div class="slots" id="pslots">' + "<i></i>".repeat(5) + "</div>" +
      '<img class="onyx-set' + (g.onyx ? " on" : "") + '" id="ponyx" src="' + IMG + 'relic-onyx.webp" alt="">' +
      '<div class="dark' + (g.light ? " gone" : "") + '" id="pdark"></div>' +
      '<div class="handlamp" id="phl"><img src="img/start/clay-lamp-warm.webp" alt=""><img class="hf" src="img/start/flame.webp" alt=""></div>' +
      '<div class="dialscene" id="pdial"></div>');
    const back = document.createElement("button"); back.className = "abtn"; back.textContent = "‹ Gate"; back.style.cssText = "position:absolute;left:14px;top:calc(58px + env(safe-area-inset-top,0px));z-index:6";
    back.onclick = () => { sfx("click"); gateScene(false); }; $("adv-scene").appendChild(back);
    if (g.light) LET.forEach((_, i) => $("pg" + i).classList.add("used", "seen"));
    const socket = hot(box, 0.4, 0.07, 0.6, 0.25, "The hollow in the stone", () => {
      const r = selected;
      if (G().onyx) { openDial(); return; }
      if (!G().light) { if (r) take(); say("An empty hollow, shaped like an egg. It is too dark to see more."); return; }
      if (r === "onyx") { take(); setG("onyx"); $("ponyx").classList.add("on"); socket.classList.remove("pulse"); sfx("stone"); buzz("success");
        say("The onyx stone settles into the hollow, and the stone begins to move…"); setTimeout(openDial, 1800); return; }
      if (r) { take(); say("It does not fit."); snd("bad"); return; }
      say("An empty hollow, shaped like a stone the size of an egg.");
    });
    if (g.light && !g.onyx) socket.classList.add("pulse");
    if (g.light) { say(g.onyx ? "The onyx stone glows in its hollow. Tap it to see the dial." : "“Let there be light: and there was light.” The hollow above is waiting."); return; }

    /* lamp light: drag to reveal the hidden letters */
    const dark = $("pdark"), hl = $("phl"), seen = new Set();
    say("It is too dark to read. Drag your lamp across the stone.");
    const R = () => box.getBoundingClientRect();
    function move(e) {
      if (!box.isConnected) { sc.removeEventListener("pointerdown", onDown); sc.removeEventListener("pointermove", onMove); return; }
      const b = R(), x = e.clientX - b.left, y = e.clientY - b.top, lr = Math.max(60, b.width * 0.13);
      dark.style.setProperty("--mx", x + "px"); dark.style.setProperty("--my", y - lr * 0.6 + "px"); dark.style.setProperty("--lr", lr + "px");
      const ly = y - lr * 0.6, lw = hl.offsetWidth || 86;
      hl.style.left = x - 0.195 * lw + "px"; hl.style.top = ly - 0.36 * lw + "px"; hl.classList.add("on");
      LET.forEach((l, i) => {
        if (seen.has(i)) return;
        const g = $("pg" + i), dist = Math.hypot(l[1] * b.width - x, l[2] * b.height - ly);
        g.style.opacity = Math.max(0, Math.min(1, 1.5 - dist / lr)).toFixed(2);   // letters only show inside the lamp light
        if (dist < lr * 0.9) { seen.add(i); g.style.opacity = ""; g.classList.add("seen"); snd("tap", seen.size); buzz("light"); if (seen.size === 5) allSeen(); }
      });
    }
    const sc = $("adv-scene");
    const onDown = (e) => { if (e.target.closest(".abtn,.relic")) return; move(e); };
    const onMove = (e) => { if (e.buttons || e.pointerType === "touch") move(e); };
    sc.addEventListener("pointerdown", onDown); sc.addEventListener("pointermove", onMove);
    function allSeen() {
      sc.removeEventListener("pointerdown", onDown); sc.removeEventListener("pointermove", onMove);
      setTimeout(() => {
        hl.classList.remove("on"); dark.classList.add("gone");
        say("Five letters, glowing in the stone. Tap them in the right order to spell a word of light.");
        spell();
      }, 700);
    }
    function spell() {
      const slots = $("pslots"), got = [];
      slots.classList.add("on");
      LET.forEach((l, i) => {
        const el = $("pg" + i); el.classList.add("tap"); el.setAttribute("role", "button"); el.setAttribute("aria-label", "Letter " + l[0]);
        el.onclick = (e) => {
          e.stopPropagation(); if (el.classList.contains("used")) return;
          el.classList.add("used"); got.push(i); slots.children[got.length - 1].textContent = l[0]; snd("tap", got.length);
          if (got.length < 5) return;
          const w = got.map((k) => LET[k][0]).join("");
          if (w === "LIGHT") {
            setG("light"); snd("word"); buzz("success"); $("plit").classList.add("on");
            say("“And God said, Let there be light: and there was light.”", "Genesis 1:3", 5000);
            setTimeout(() => { slots.classList.remove("on"); socket.classList.add("pulse"); say("A hollow at the top of the stone catches the light. It is waiting for something."); }, 4200);
          } else {
            snd("bad"); buzz("error");
            G().miss = (G().miss || 0) + 1; Lamp.save();
            say("Not quite. Think of the first thing God spoke into being.");
            setTimeout(() => { got.length = 0; [...slots.children].forEach((s) => (s.textContent = "")); LET.forEach((_, k) => $("pg" + k).classList.remove("used")); }, 700);
          }
        };
      });
    }
  }

  function openDial() {
    const g = G(), ds = $("pdial"); if (!ds) return;
    let idx = g.rest ? 6 : 2, angle = -idx * STEP;
    ds.innerHTML = '<div class="gdial' + (g.keyed ? " keyed" : "") + (g.rest ? " solved" : "") + '" id="gd"><div class="wheel" id="gw" style="transform:rotate(' + angle + 'deg)"><img src="' + IMG + 'dial.webp" alt="The dial of days"></div>' +
      '<img class="hubstone" src="' + IMG + 'relic-days.webp" alt=""><div class="hubhot" id="ghub" role="button" aria-label="The centre of the dial"></div><div class="marker"></div></div>' +
      '<div class="dialbtns"><button class="abtn" id="gl" aria-label="Turn left">↺</button><button class="abtn" id="gback">‹ Stone</button><button class="abtn" id="gr" aria-label="Turn right">↻</button></div>';
    ds.classList.add("on"); sfx("stone");
    const dial = $("gd"), wheel = $("gw");
    say(g.rest ? "The dial rests on the seventh day." : g.keyed ? "Turn the dial to the day God rested." : "A dial of the seven days rises from the stone. Its centre is worn smooth, as if waiting for a key.");
    $("gback").onclick = () => { ds.classList.remove("on"); };
    $("ghub").onclick = (e) => {
      e.stopPropagation(); const r = selected;
      if (G().keyed) { say("The Stone of Days is set in the centre. Turn the dial."); return; }
      if (r === "days") { take(); setG("keyed"); dial.classList.add("keyed"); sfx("stone"); buzz("success"); say("The Stone of Days fits the centre. The dial can turn."); return; }
      if (r) { take(); say("It does not fit the centre."); snd("bad"); return; }
      say("The centre is worn smooth and round, like a stone the size of a palm.");
    };
    function turn(d) {
      if (G().rest) return;
      if (!G().keyed) { say("It will not move. Something must be set in its centre first."); snd("bad"); buzz("error"); return; }
      idx = (idx + d + 7) % 7; angle -= d * STEP; wheel.style.transform = "rotate(" + angle + "deg)"; sfx("click"); buzz("light");
      check();
    }
    function check() {
      if (idx !== 6) return;
      setG("rest"); dial.classList.add("solved"); snd("level"); buzz("success");
      say("“And he rested on the seventh day from all his work which he had made.”", "Genesis 2:2", 4800);
      setTimeout(() => { ds.classList.remove("on"); gateScene(false, true); }, 4200);
    }
    $("gl").onclick = () => turn(-1); $("gr").onclick = () => turn(1);
    /* drag to turn */
    let dragA = null, base = 0;
    const ang = (e) => { const b = dial.getBoundingClientRect(); return Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180 / Math.PI; };
    dial.addEventListener("pointerdown", (e) => { if (e.target.id === "ghub" || G().rest || !G().keyed) return; dragA = ang(e); base = angle; wheel.classList.add("drag"); dial.setPointerCapture(e.pointerId); });
    dial.addEventListener("pointermove", (e) => { if (dragA === null) return; let d = ang(e) - dragA; if (d > 180) d -= 360; if (d < -180) d += 360; wheel.style.transform = "rotate(" + (base + d) + "deg)"; });
    const up = (e) => {
      if (dragA === null) return; wheel.classList.remove("drag");
      let d = ang(e) - dragA; if (d > 180) d -= 360; if (d < -180) d += 360;
      const steps = Math.round(d / STEP); dragA = null;
      angle = base + steps * STEP; idx = (((idx - steps) % 7) + 7) % 7; wheel.style.transform = "rotate(" + angle + "deg)";
      if (steps) { sfx("click"); buzz("light"); check(); }
    };
    dial.addEventListener("pointerup", up); dial.addEventListener("pointercancel", up);
  }

  function layCoat() {
    const box = document.querySelector("#adv .adv-box");
    setG("coat"); $("gcoat").classList.add("on"); sfx("stone"); buzz("success");
    say("“Unto Adam also and to his wife did the LORD God make coats of skins, and clothed them.”", "Genesis 3:21", 3000);
    setTimeout(() => {
      $("gseam").classList.add("wide"); sfx("stone");
      Lamp.playCue && Lamp.playCue("quick");
      box.classList.add("zoom");
      setTimeout(() => {
        if (!root) return;
        const f = document.createElement("div"); f.className = "flash"; $("adv-scene").appendChild(f);
        requestAnimationFrame(() => f.classList.add("on")); buzz("success");
        setTimeout(() => { if (!root) return; setG("open"); A().seals.fall = 1; Lamp.save(); openView(true); }, 600);
      }, 1500);
    }, 2600);
  }
  function openView(fresh) {
    const box = scene("gate-open.jpg", GW, GH);
    root.classList.remove("still");
    const f = document.createElement("div"); f.className = "flash on"; $("adv-scene").appendChild(f);
    requestAnimationFrame(() => requestAnimationFrame(() => f.classList.remove("on")));
    box.classList.add("push");
    if (fresh && Lamp.narr) setTimeout(() => Lamp.narr.play("gate-open"), 2600);
    hot(box, 0.3, 0.2, 0.7, 0.62, "The tree of life", () => say("“Blessed are they that do his commandments, that they may have right to the tree of life, and may enter in through the gates into the city.”", "Revelation 22:14"));
    setTimeout(() => {
      if (!root) return;
      const nx = story("noah");
      card('<div class="kick">The Garden Gate · open</div><h2>The way of the tree of life</h2>' +
        '<div class="v">“Blessed are they that do his commandments, that they may have right to the tree of life, and may enter in through the gates into the city.”</div><div class="r">Revelation 22:14 · KJV</div>' +
        "<p>" + (fresh ? "The first chamber is open. What was closed in Genesis is opened again at the end of the Bible. " : "") + "The journey goes on: <b>" + esc(nx.title) + "</b>.</p>" +
        (fresh && !G().skipped ? rewards({ hints: G().hints || 0, misses: G().miss || 0 }) : "") +
        '<button class="cta" data-act="next">Continue to Noah</button><button class="cta alt" data-act="stay">Stay in the garden</button><button class="cta alt" data-act="leave">Back to the journey</button>', {
        next: () => { shut(true); Lamp.playStory(nx, false); },
        stay: () => {},
        leave: () => { shut(true); Lamp.closeLevel && Lamp.closeLevel(); },
      });
    }, fresh ? 3400 : 900);
  }

  /* ---------- what the rest of the game uses ---------- */
  Lamp.adv = {
    /* a story with an unbroken seal: the story-complete card offers it */
    pending(id) { return !!SEALS[id] && !A().seals[id]; },
    sealTitle(id) { return SEALS[id] && SEALS[id].title; },
    startSeal(id) { if (SEALS[id]) SEALS[id].run(); },
    openGate() { if (!has("coat")) giveRelicAndGate(); else openGate(); },
    /* the Adventure card on the Journey screen */
    card() {
      const a = A(), gateReady = done("fall") || has("coat");
      let h = '<div class="advcard"><div class="advhead"><h3>The Adventure</h3><small>Relics ' + ORDER.filter(has).length + " of " + ORDER.length + "</small></div>";
      h += '<div class="advrelics">' + ORDER.map((r) => has(r) ? '<button class="advrelic" data-adv="relic:' + r + '" aria-label="' + esc(RELICS[r].name) + '"><img src="' + IMG + RELICS[r].img + '" alt=""></button>'
        : '<span class="advrelic empty" aria-label="Not found yet"></span>').join("") + "</div>";
      ["creation", "eden"].forEach((id) => { if (done(id) && !a.seals[id]) h += '<button class="advrow" data-adv="seal:' + id + '"><b>Break the seal: ' + esc(SEALS[id].title) + "</b><small>" + esc(story(id).title) + " · earns the " + esc(RELICS[SEALS[id].relic].name) + "</small></button>"; });
      h += '<button class="advrow gate' + (gateReady ? "" : " locked") + '" data-adv="gate"><b>The Garden Gate</b><small>' +
        (a.gate.open ? "Open · the way of the tree of life" : gateReady ? "A chamber to solve · Genesis 3" : "Finish “Where Art Thou?” to reach the gate") + "</small></button></div>";
      return h;
    },
    click(key) {
      if (key === "gate") { if (done("fall") || has("coat")) Lamp.adv.openGate(); else Lamp.mainToast && Lamp.mainToast("Finish “Where Art Thou?” to reach the Garden Gate"); return; }
      const [k, v] = key.split(":");
      if (k === "seal") Lamp.adv.startSeal(v);
      if (k === "relic") { open(RELICS[v].name, {}); giveRelicView(v); }
    },
    relics: RELICS,
    /* tester tools only (js/dev.js): finish the open seal or chamber at once, with no oil reward */
    devSkip() {
      if (!root) return false;
      if (root.querySelector(".asheet")) { const b = root.querySelector(".asheet [data-act]"); b && b.click(); return true; }
      if (mode === "creation" || mode === "eden") { const m = mode; mode = null; sealDone(m, null); return true; }
      if (mode === "gate") {
        ["days", "onyx", "coat"].forEach((r) => (A().relics[r] = 1));
        ["light", "onyx", "keyed", "rest", "coat"].forEach((k) => (G()[k] = 1));
        G().open = 1; G().skipped = 1; A().seals.fall = 1; Lamp.save(); mode = null; openView(true); return true;
      }
      return false;
    },
    devReset() { Lamp.state.adv = { relics: {}, seals: {}, gate: {} }; Lamp.save(); },
  };
  function giveRelicAndGate() { open("The Garden Gate", { satchel: true, hint: gateHint }); mode = "gate"; gateScene(false); giveRelic("coat", () => { satchel(); gateScene(true); }); }
  function giveRelicView(r) {
    const R = RELICS[r];
    card('<div class="kick">Relic · in your satchel</div><img class="relic-big" src="' + IMG + R.img + '" alt=""><h2>' + esc(R.name) + "</h2>" +
      '<div class="v">“' + esc(R.v) + '”</div><div class="r">' + esc(R.ref) + " · KJV</div>" + '<button class="cta" data-act="x">Close</button>', { x: () => shut() });
  }
  SEALS.fall.run = () => giveRelicAndGate();
})();
