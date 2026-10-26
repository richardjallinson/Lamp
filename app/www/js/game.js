/* Lamp — the level screen: letter wheel levels, "from memory" levels and the daily puzzle. */
(function () {
  "use strict";
  const Lamp = window.Lamp, D = window.LAMP_DATA;
  const $ = (id) => document.getElementById(id);
  const norm = (w) => w.replace(/[^A-Za-z]/g, "").toUpperCase();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ICON = Lamp.ICON;

  let G = null; // current game: {mode, story, lv, found, hints, built, order, hintsUsed, t0, daily}
  let VERSE = [], LEVELS = [], letters = [], sel = [], drag = false, moved = false, downHit = null, undoTap = false, demoT = [];

  const L = () => LEVELS[G.lv];
  const curVerse = () => (G.mode === "daily" ? G.daily : G.story.verses[L().v]);

  /* ---------- open ---------- */
  Lamp.playStory = function (story, fromStart) {
    const done = Lamp.state.progress[story.id] || 0;
    const start = fromStart || done >= story.levels.length ? 0 : done;
    G = { mode: "story", story, lv: start, sStart: start, replay: done >= story.levels.length };
    Lamp.state.last = story.id; Lamp.save();
    show();
  };
  Lamp.playDaily = function () {
    const d = Lamp.dailyToday();
    const story = D.stories.find((s) => s.id === d.story);
    G = { mode: "daily", daily: d, story, lv: 0 };
    show();
  };
  Lamp.dailyNumber = function () {
    const t = new Date(Lamp.today() + "T12:00:00"), e = new Date("2026-10-01T12:00:00");
    return Math.round((t - e) / 864e5) + 1;
  };
  Lamp.dailyToday = function () {
    const n = Lamp.dailyNumber(), list = D.daily;
    return list[(((n - 1) % list.length) + list.length) % list.length];
  };

  function show() {
    $("level").hidden = false; $("main").hidden = true;
    G.found = []; G.hints = {}; G.built = 0; G.order = []; G.hintsUsed = 0; G.t0 = Date.now();
    G.bonusFound = []; G.lvMiss = 0; G.lvHint = 0;
    start(true);
  }
  function close() {
    stopDemo();
    document.querySelectorAll("#level .sheet").forEach((s) => s.remove());
    $("level").hidden = true; $("main").hidden = false;
    Lamp.render && Lamp.render();
  }
  Lamp.closeLevel = close;

  function paint() {
    const img = G.mode === "daily" ? (G.story && G.story.img) : G.story.img;
    const bg = $("bg");
    bg.classList.toggle("none", !img);
    bg.style.backgroundImage = img ? "url(img/" + img + ")" : "";
    /* each level frames the painting a little differently (until there are more paintings per story) */
    const F = [[1, 50, 50], [1.18, 30, 35], [1.12, 70, 60], [1.25, 50, 25], [1.15, 25, 70], [1.22, 75, 30], [1.1, 40, 80], [1.28, 60, 45], [1.16, 50, 65], [1, 50, 50]];
    const f = G.mode === "daily" ? F[0] : F[G.lv % F.length];
    bg.style.transform = "scale(" + f[0] + ")"; bg.style.transformOrigin = f[1] + "% " + f[2] + "%";
    $("level").classList.toggle("cross", !!(L() && L().cross));
  }
  function lit(frac, instant) {
    const b = $("bg");
    if (instant) { b.style.transition = "none"; requestAnimationFrame(() => (b.style.transition = "")); }
    const f = Math.max(0, Math.min(1, frac));
    b.style.filter = "brightness(" + (0.3 + 0.7 * f).toFixed(2) + ") saturate(" + (0.55 + 0.45 * f).toFixed(2) + ")";
  }

  function start(fresh) {
    LEVELS = G.mode === "daily" ? [Object.assign({ v: 0, id: G.daily.ref }, G.daily)] : G.story.levels;
    VERSE = curVerse().w;
    if (L().recall) { G.built = L().start || 0; G.order = []; }
    G.bonusFound = (Lamp.state.bonus[L().id] || []).slice();
    /* the letters play this era's instrument, with a different little tune each level */
    if (Lamp.setInstrument) Lamp.setInstrument(Lamp.eraOf(G.story).inst, (G.story ? D.stories.indexOf(G.story) * 3 : 0) + G.lv + (G.mode === "daily" ? Lamp.dailyNumber() : 0));
    paint();
    lit(G.mode === "daily" ? 0.6 : G.lv / LEVELS.length, fresh);
    $("lback").textContent = "‹ " + (G.mode === "daily" ? "Today" : G.story.book);
    renderTop(); renderBoard();
    L().recall ? renderRecall() : renderWheelLevel();
  }

  function renderTop() {
    $("loil").innerHTML = ICON.oil + Lamp.state.oil;
    const s = Lamp.streak();
    $("lstreak").innerHTML = ICON.lamp + "<span>" + (s.n ? (s.n === 1 ? "Day 1" : s.n + " days") : "Light it") + "</span>";
    $("lstreak").classList.toggle("dim", !s.lit);
    $("ttl").textContent = G.mode === "daily" ? "Daily verse #" + Lamp.dailyNumber()
      : G.story.title + " · Level " + (G.lv + 1) + " of " + LEVELS.length;
    $("dots").innerHTML = G.mode === "daily" ? "" : LEVELS.map((_, i) => '<i class="' + (i < G.lv ? "done" : i === G.lv ? "on" : "") + '"></i>').join("");
  }

  /* Long verses get smaller text so the wheel and buttons always fit. */
  function verseScale(n) { return n <= 16 ? 1 : n <= 24 ? 0.92 : n <= 32 ? 0.85 : n <= 42 ? 0.78 : 0.72; }
  function boardHTML() {
    const lv = L();
    return VERSE.map((w) => {
      const n = norm(w), punct = w.replace(/[A-Za-z]/g, "");
      if (lv.hide && lv.hide.includes(n) && /^[A-Za-z]+$/.test(w.replace(/^[(]|[,;:.?!)]+$/g, ""))) {
        const got = G.found.includes(n), h = G.hints[n] || 0;
        const lead = w.match(/^[(]/) ? "(" : "", tail = w.replace(/^[(]?[A-Za-z]+/, "");
        return '<span style="white-space:nowrap">' + lead + '<span class="blank" aria-label="' + (got ? n.toLowerCase() : "missing word, " + n.length + " letters") + '">' +
          n.split("").map((c, i) => '<b class="' + (got ? "f" : i < h ? "h" : "") + '">' + (got || i < h ? c : "") + "</b>").join("") + "</span>" + esc(tail) + "</span>";
      }
      return esc(w);
    }).join(" ");
  }
  /* ---------- crossword level ---------- */
  function crossCells() {
    const X = L().cross, cells = {};
    X.words.forEach((w) => {
      const got = G.found.includes(w.w), h = G.hints[w.w] || 0;
      for (let i = 0; i < w.w.length; i++) {
        const k = (w.r + (w.d ? i : 0)) + "," + (w.c + (w.d ? 0 : i)), c = cells[k] || (cells[k] = { ch: w.w[i], show: false, hint: false, gold: false, words: [] });
        if (got) c.show = true; else if (i < h) c.hint = true;
        if (X.gold === w.w) c.gold = true;
        c.words.push(w.w);
      }
    });
    return cells;
  }
  function renderCross(fresh) {
    const X = L().cross, cells = crossCells(), b = $("board");
    b.classList.add("xboard");
    const W = Math.min(b.clientWidth || 340, 460) - 8, H = Math.max(160, (b.clientHeight || window.innerHeight * 0.4) - 8);
    const size = Math.max(22, Math.min(48, Math.floor(Math.min(W / X.w, H / X.h))));
    let h = '<div class="xgrid" style="width:' + size * X.w + "px;height:" + size * X.h + "px;--xs:" + size + 'px">';
    Object.keys(cells).forEach((k) => {
      const [r, c] = k.split(",").map(Number), x = cells[k], isNew = fresh && x.words.includes(fresh) && x.show;
      h += '<b class="' + (x.show ? "f" : x.hint ? "h" : "") + (x.gold ? " gold" : "") + (isNew ? " new" : "") + '" style="left:' + c * size + "px;top:" + r * size + 'px">' + (x.show || x.hint ? x.ch : "") + "</b>";
    });
    b.innerHTML = h + "</div>" + '<div class="ref">' + (X.gold ? '<span class="goldtag">Gold squares hide a word</span>' : "Every word is in the KJV") + "</div>";
  }
  function renderBoard(fresh) {
    if (L().cross) { renderCross(fresh); return; }
    $("board").classList.remove("xboard");
    const ref = curVerse().ref, vs = "--vs:calc(var(--verse-size) * " + verseScale(VERSE.length) + ")";
    if (L().recall) {
      const given = VERSE.slice(0, L().start || 0).map(esc).join(" ");
      const built = VERSE.slice(L().start || 0, G.built).map(esc).join(" ");
      const rest = VERSE.slice(G.built).map((w) => w.replace(/[A-Za-z]/g, "_")).join(" ");
      $("board").innerHTML = '<div class="verse built" style="' + vs + '">' + (given ? '<span class="given">' + given + "</span> " : "") + built + (G.built > (L().start || 0) ? " " : "") +
        '<span class="ghost">' + rest + '</span></div><div class="ref">' + esc(ref) + " · from memory</div>";
      fitBoard(verseScale(VERSE.length));
      return;
    }
    $("board").innerHTML = '<div class="verse" style="' + vs + '">' + boardHTML() + '</div><div class="ref">' + esc(ref) + "</div>";
    fitBoard(verseScale(VERSE.length));
  }
  /* Long verses on small screens: shrink the text until the whole verse and its reference fit the card. */
  function fitBoard(scale) { requestAnimationFrame(() => fitNow(scale, 0)); }   // after the wheel and buttons are laid out
  function fitNow(scale, tries) {
    const b = $("board"), v = b.querySelector(".verse"); if (!v) return;
    if (!b.clientHeight) { if (tries < 30) requestAnimationFrame(() => fitNow(scale, tries + 1)); return; }   // level screen not shown yet
    let s = scale;
    while (b.scrollHeight > b.clientHeight + 1 && s > 0.58) { s -= 0.04; v.style.setProperty("--vs", "calc(var(--verse-size) * " + s.toFixed(2) + ")"); }
  }

  /* ---------- wheel level ---------- */
  function defaultTip() {
    const n = L().hide.length;
    if (L().cross) return L().cross.gold ? "Fill the crossword. The gold squares hide a word to remember." : "Fill the crossword: " + n + " words from the story.";
    return L().tip || (n > 1 ? n + " words are missing. Find them all." : "One word is missing.");
  }
  function renderWheelLevel() {
    letters = L().wheel.split(""); sel = [];
    $("play").innerHTML = '<div class="howto" id="howto">' + esc(defaultTip()) + "</div>" +
      '<div class="wordrow"><button class="mini" id="bClr" aria-label="Clear letters">✕</button><div class="word" id="word" aria-live="polite"></div><button class="mini go" id="bGo" aria-label="Check word">✓</button></div>' +
      '<div class="wheelwrap"><div id="wheel" role="application" aria-label="Letter wheel"><svg id="lines"></svg></div></div>' +
      '<div class="ctrl"><button class="round" id="bHint" aria-label="Hint, costs one drop of oil"><span>' + ICON.hint + "</span>Hint · 1</button>" +
      '<button class="round" id="bShuf" aria-label="Shuffle letters"><span>' + ICON.shuffle + "</span>Shuffle</button>" +
      '<button class="round" id="bBonus" aria-label="Bonus words found"><span>' + ICON.star + '</span><em id="bc" style="font-style:normal">Bonus 0</em></button></div>';
    placeLetters();
    const wh = $("wheel");
    wh.addEventListener("pointerdown", (e) => {
      stopDemo(); drag = true; moved = false; undoTap = false; wh.setPointerCapture(e.pointerId);
      const h = hitAt(e); downHit = h;
      if (h != null) { if (sel.length && sel[sel.length - 1] === h) undoTap = true; else if (!sel.includes(h)) { sel.push(h); Lamp.sound("tap", sel.length - 1); } }
      drawSel();
    });
    wh.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const h = hitAt(e);
      if (h != null && h !== downHit) moved = true;
      if (moved && h != null) { if (sel[sel.length - 2] === h) sel.pop(); else if (!sel.includes(h)) { sel.push(h); Lamp.sound("tap", sel.length - 1); } }
      const p = localPt(e); drawSel(moved ? p[0] : null, moved ? p[1] : null);
    });
    const end = () => { if (!drag) return; drag = false; if (moved) submit(); else { if (undoTap) sel.pop(); drawSel(); } };
    wh.addEventListener("pointerup", end); wh.addEventListener("pointercancel", end);
    $("bGo").onclick = () => { stopDemo(); submit(); };
    $("bClr").onclick = () => { stopDemo(); sel = []; drawSel(); };
    $("bHint").onclick = hint;
    $("bShuf").onclick = () => {
      stopDemo(); sel = []; Lamp.sound("shuffle");
      for (let i = letters.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [letters[i], letters[j]] = [letters[j], letters[i]]; }
      placeLetters(); drawSel();
    };
    $("bBonus").onclick = () => toast(G.bonusFound.length ? "Bonus: " + G.bonusFound.join(", ").toLowerCase() : "No bonus words yet");
    $("bc").textContent = "Bonus " + G.bonusFound.length;
    drawSel();
    if (!Lamp.state.tutorial && G.mode === "story") {
      Lamp.state.tutorial = true; Lamp.save();
      const tryDemo = () => (document.querySelector("#level .sheet") ? setTimeout(tryDemo, 400) : demo());
      setTimeout(tryDemo, 700);
    }
  }
  function demo() {
    const w = L().hide[0]; let i = 0; sel = []; if (!$("wheel")) return;
    const used = new Set();
    const step = () => {
      if (i < w.length) {
        const idx = letters.findIndex((c, j) => c === w[i] && !used.has(j)); used.add(idx);
        sel.push(idx); i++; drawSel(); demoT.push(setTimeout(step, 450));
      } else demoT.push(setTimeout(() => { sel = []; drawSel(); toast("Now you try"); demoT = []; $("howto") && ($("howto").textContent = defaultTip()); }, 900));
    };
    $("howto").textContent = "Watch: tap " + w.split("").join(", ") + " in order, then ✓."; step();
  }
  function stopDemo() { if (demoT.length) { demoT.forEach(clearTimeout); demoT = []; sel = []; $("howto") && ($("howto").textContent = defaultTip()); } }
  Lamp.stopDemo = stopDemo;
  function localPt(e) { const r = $("wheel").getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function hitAt(e) {
    let best = null;
    $("wheel").querySelectorAll(".lt").forEach((n) => {
      const b = n.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < b.width * 0.62) best = +n.dataset.i;
    });
    return best;
  }
  function placeLetters() {
    const wh = $("wheel"); wh.querySelectorAll(".lt").forEach((n) => n.remove());
    letters.forEach((c, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / letters.length, d = document.createElement("div");
      d.className = "lt"; d.textContent = c;
      d.style.left = 50 + 34 * Math.cos(a) + "%"; d.style.top = 50 + 34 * Math.sin(a) + "%";
      d.dataset.i = i; wh.appendChild(d);
    });
  }
  function drawSel(px, py) {
    const wh = $("wheel"); if (!wh) return;
    const r = wh.getBoundingClientRect(), nodes = [...wh.querySelectorAll(".lt")];
    nodes.forEach((n) => n.classList.toggle("sel", sel.includes(+n.dataset.i)));
    const pts = sel.map((i) => { const b = nodes[i].getBoundingClientRect(); return [b.left + b.width / 2 - r.left, b.top + b.height / 2 - r.top]; });
    if (drag && pts.length && px != null) pts.push([px, py]);
    $("lines").setAttribute("viewBox", "0 0 " + r.width + " " + r.height);
    $("lines").innerHTML = pts.length > 1 ? '<polyline points="' + pts.map((p) => p.join(",")).join(" ") + '" fill="none" stroke="#C9A24A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>' : "";
    $("word").textContent = sel.map((i) => letters[i]).join("");
    const on = sel.length > 0 && !demoT.length;
    $("bGo").classList.toggle("on", on); $("bClr").classList.toggle("on", on);
  }
  function submit() {
    const w = sel.map((i) => letters[i]).join(""), lv = L();
    sel = []; drawSel();
    if (!w) return;
    const wd = $("word"); wd.textContent = w;
    if (lv.hide.includes(w)) {
      if (G.found.includes(w)) toast("Already found");
      else {
        G.found.push(w); renderBoard(w); toast("✓ " + w.toLowerCase()); Lamp.sound("word"); Lamp.haptic("success");
        if (lv.hide.every((x) => G.found.includes(x))) setTimeout(levelDone, 650);
      }
    } else if (lv.bonus.includes(w)) {
      if (G.bonusFound.includes(w)) toast("Already found");
      else {
        G.bonusFound.push(w); Lamp.state.oil++;
        Lamp.state.bonus[lv.id] = G.bonusFound.slice(); Lamp.save();
        renderTop(); $("bc").textContent = "Bonus " + G.bonusFound.length;
        toast("Bonus word · +1 oil"); Lamp.sound("bonus"); Lamp.haptic("light");
      }
    } else {
      wd.classList.remove("bad"); void wd.offsetWidth; wd.classList.add("bad");
      if (w.length >= 2) G.lvMiss = (G.lvMiss || 0) + 1;   // a wrong word breaks a flawless level
      toast(w.length < 2 ? "Too short" : "Not in this level"); Lamp.sound("bad"); Lamp.haptic("error");
    }
    setTimeout(() => { if ($("word") && !sel.length) $("word").textContent = ""; }, 700);
  }
  function hint() {
    const lv = L(), t = lv.hide.find((x) => !G.found.includes(x));
    if (!t) return;
    if (Lamp.state.oil < 1) { toast("Out of oil. Find bonus words to earn more"); return; }
    Lamp.state.oil--; Lamp.save();
    G.hintsUsed++; G.lvHint = (G.lvHint || 0) + 1; G.hints[t] = (G.hints[t] || 0) + 1;
    if (G.hints[t] >= t.length) G.found.push(t);
    renderTop(); renderBoard(); Lamp.haptic("light"); Lamp.sound("hint");
    if (lv.hide.every((x) => G.found.includes(x))) setTimeout(levelDone, 650);
  }

  /* ---------- from memory ---------- */
  function renderRecall() {
    const s = L().start || 0;
    if (!G.order.length) {
      G.order = VERSE.map((w, i) => i).filter((i) => i >= s);
      for (let i = G.order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [G.order[i], G.order[j]] = [G.order[j], G.order[i]]; }
    }
    $("play").innerHTML = '<div class="howto">' + esc(L().tip || (s ? "Finish the verse from memory. Tap the words in order." : "Now say it from memory. Tap the words in order.")) + "</div>" +
      '<div class="tiles" id="tiles">' + G.order.map((i) => '<button class="tile' + (i < G.built ? " used" : "") + '" data-i="' + i + '">' + esc(VERSE[i].replace(/[^A-Za-z]/g, "")) + "</button>").join("") + "</div>";
    $("tiles").onclick = (e) => {
      const b = e.target.closest(".tile"); if (!b) return;
      const i = +b.dataset.i, need = VERSE[G.built];
      if (norm(VERSE[i]) === norm(need)) {
        const twin = [...$("tiles").children].find((x) => !x.classList.contains("used") && norm(VERSE[+x.dataset.i]) === norm(need));
        (twin || b).classList.add("used"); G.built++; renderBoard(); Lamp.sound("tap", (G.built - 1 - (L().start || 0)) % 7);
        if (G.built === VERSE.length) setTimeout(storyDone, 500);
      } else { G.lvMiss = (G.lvMiss || 0) + 1; b.classList.remove("bad"); void b.offsetWidth; b.classList.add("bad"); Lamp.haptic("error"); }
    };
  }

  /* ---------- results ---------- */
  function recordLevel() {
    const first = Lamp.markPlayed();
    if (G.mode === "story") {
      const p = Lamp.state.progress[G.story.id] || 0;
      if (G.lv + 1 > p) Lamp.state.progress[G.story.id] = G.lv + 1;
    }
    Lamp.save();
    return first;
  }
  function streakLine() {
    const n = Lamp.streak().n;
    return n > 1 ? n + " days in a row. One rest day a week never breaks it." : "Come back tomorrow to keep it burning. One rest day a week never breaks it.";
  }
  /* Level-complete headlines: picked at random, never one of the last dozen shown. */
  const PRAISE = {
    any: ["Well done", "Nice job", "Great work", "Keep going", "Beautiful", "That's it", "Nicely done", "Good going",
      "Wonderful", "Spot on", "Way to go", "You got it", "Lovely work", "Bright work", "Shining", "Keep it burning",
      "Well found", "Light on your path", "Word by word", "Steady on", "On your way", "Brilliant", "Excellent",
      "Splendid", "Right on", "Good and faithful", "Hidden in your heart", "Line upon line", "Burning bright",
      "Another lamp lit", "Onward", "Press on", "Perfect", "Superb", "You're glowing", "Strong work", "Neatly done",
      "That's the word", "Treasure found", "Well remembered"],
    clean: ["Flawless", "No hints needed", "All on your own", "Clean as a whistle", "Sharp eyes", "Not a hint in sight"],
    bonus: ["Bonus words too", "Extra oil earned", "Above and beyond", "Digging deeper"],
    almost: ["Nearly there", "One more to go", "The last step awaits", "Almost home"],
  };
  const recentPraise = [];
  function praise(kinds) {
    let pool = [];
    kinds.forEach((k) => { pool = pool.concat(PRAISE[k]); });
    let fresh = pool.filter((p) => !recentPraise.includes(p));
    if (!fresh.length) fresh = pool;
    const pick = fresh[Math.floor(Math.random() * fresh.length)];
    recentPraise.push(pick); if (recentPraise.length > 12) recentPraise.shift();
    return pick;
  }
  function levelDone() {
    const lv = L();
    const marked = lv.cross ? lv.hide.map((w) => (w === lv.cross.gold ? '<mark class="gold">' + w + "</mark>" : "<mark>" + w + "</mark>")).join(" ") : VERSE.map((w) => (lv.hide.includes(norm(w)) ? "<mark>" + esc(w.replace(/[^A-Za-z]/g, "")) + "</mark>" + esc(w.replace(/[A-Za-z]/g, "")) : esc(w))).join(" ");
    const first = recordLevel();
    Lamp.sound(G.mode === "daily" ? "daily" : "level");
    const still = stillHere();
    if (G.mode === "daily") { lit(1); setTimeout(() => still() && dailyCard(first), 700); return; }
    lit((G.lv + 1) / LEVELS.length);
    const nextIsRecall = LEVELS[G.lv + 1] && LEVELS[G.lv + 1].recall;
    // a special headline about a quarter of the time when it fits (no hints, bonus words, next is the last level)
    const kinds = ["any"];
    if (Math.random() < 0.25) {
      if (nextIsRecall) kinds.splice(0, 1, "almost");
      else if (G.bonusFound.length) kinds.splice(0, 1, "bonus");
      else if (!G.hintsUsed) kinds.splice(0, 1, "clean");
    }
    /* flawless levels (no wrong words, no hints): three in a row fill a drop of oil */
    const flawless = !G.lvMiss && !G.lvHint;
    let flawNote = "";
    if (flawless) G.sFlaw = (G.sFlaw || 0) + 1;
    if (flawless) {
      Lamp.state.flaw = (Lamp.state.flaw || 0) + 1;
      if (Lamp.state.flaw >= 3) { Lamp.state.flaw = 0; Lamp.state.oil += 1; flawNote = "<b>Three flawless levels in a row.</b> +1 oil for your lamp."; renderTop(); }
      else flawNote = "<b>Flawless.</b> " + Lamp.state.flaw + " of 3 in a row: no mistakes, no hints. Three earn a drop of oil.";
      Lamp.save();
    } else if (Lamp.state.flaw) { Lamp.state.flaw = 0; Lamp.save(); }
    const pips = (n, full) => '<span class="pips">' + [0, 1, 2].map((i) => '<i class="' + (full || i < n ? "on" : "") + '"></i>').join("") + "</span>";
    const head = flawless && Math.random() < 0.5 ? praise(["clean"]) : praise(kinds);
    setTimeout(() => still() && sheet(
      '<div class="kick">Level ' + (G.lv + 1) + " complete</div><h2>" + esc(head) + "</h2>" +
      '<div class="v' + (lv.cross ? " xwords" : "") + '">' + marked + '</div><div class="r">' + (lv.cross ? "Crossword · " + esc(G.story.title) : esc(curVerse().ref) + " · KJV") + "</div>" +
      (lv.cross && lv.cross.gold ? '<div class="note goldnote">' + ICON.star + " <b>Gold word: " + esc(lv.cross.gold) + ".</b> " + (lv.cross.clue ? "Remember it: it will help you with the puzzle ahead." : "Keep it in mind as the story goes on.") + "</div>" : "") +
      (first ? '<div class="note">' + ICON.lamp + " <b>Your lamp is lit for today.</b> " + streakLine() + "</div>" : "") +
      (G.bonusFound.length ? '<div class="note">Bonus words: <b>' + esc(G.bonusFound.join(", ").toLowerCase()) + "</b></div>" : "") +
      (flawNote ? '<div class="note flaw">' + pips(Lamp.state.flaw, Lamp.state.flaw === 0) + flawNote + "</div>" : "") +
      '<button class="cta" data-act="next">' + (nextIsRecall ? "Final level: from memory" : "Next level") + "</button>" +
      '<button class="cta alt" data-act="leave">Back to ' + esc(G.story.book) + "</button>",
      { next: () => { G.lv++; resetLevel(); start(); }, leave: close }), 900);
  }
  /* Result cards appear after a short pause; skip them if the player has already left the level. */
  function stillHere() { const g = G, lv = G.lv; return () => G === g && G.lv === lv && !$("level").hidden; }
  function resetLevel() { G.found = []; G.hints = {}; G.built = 0; G.order = []; G.lvMiss = 0; G.lvHint = 0; }
  function storyDone() {
    const st = G.story, firstTime = !Lamp.state.completed[st.id];
    const first = recordLevel();
    if (firstTime) { Lamp.state.completed[st.id] = Lamp.today(); Lamp.state.oil += 2; Lamp.save(); }
    lit(1); Lamp.sound("story"); Lamp.haptic("success");
    const still = stillHere();
    const idx = D.stories.indexOf(st), nx = D.stories[idx + 1];
    const nextOpen = nx && (nx.free || (Lamp.state.unlocked && !Lamp.preview));
    const key = st.verses[st.key];
    const done = Object.keys(Lamp.state.completed).length;
    const seal = Lamp.adv && Lamp.adv.pending(st.id);   // the adventure: this story has a seal to break
    if (firstTime && done === 3 && !Lamp.state.reviewAsked) { Lamp.state.reviewAsked = true; Lamp.save(); setTimeout(() => Lamp.native("review"), 2500); }
    /* the finished painting first, full screen (tap to go on), then the story-complete card */
    /* what the painting screen tells you: what you earned, and a clue to what comes next */
    const gifts = [];
    if (firstTime) gifts.push("+2 oil for your lamp");
    if (G.sStart === 0 && (G.sFlaw || 0) + (!G.lvMiss && !G.lvHint ? 1 : 0) >= st.levels.length) gifts.push("Flawless: not one mistake or hint");
    if (first) gifts.push("Your lamp is lit for today");
    if (firstTime) gifts.push("Verse gathered");
    let clue = "";
    if (seal) clue = st.id === "fall" ? "The way to the tree of life is kept. Go to the Garden Gate." : "A puzzle stands before the next story: " + Lamp.adv.sealTitle(st.id) + ".";
    else if (nx) { const kv = nx.verses[nx.key].w; clue = "Next, in " + nx.book + ": “" + kv.slice(0, 7).join(" ").replace(/[,;:.]$/, "") + (kv.length > 7 ? "…" : "") + "”"; }
    else clue = "You have reached the end of the Bible.";
    setTimeout(() => { if (!still()) return; if (st.img) Lamp.showPainting(st, () => still() && storyCard(), { gifts, clue }); else storyCard(); }, 1300);
    const storyCard = () => {
    const sh = sheet(
      '<div class="kick">Story complete' + (firstTime ? " · +2 oil" : "") + "</div><h2>" + esc(st.title) + "</h2>" +
      '<div class="v">“' + esc(key.w.join(" ")) + '”</div><div class="r">' + esc(key.ref) + " · KJV</div>" +
      (first ? '<div class="note">' + ICON.lamp + " <b>Your lamp is lit for today.</b> " + streakLine() + "</div>" : "") +
      '<div class="note"><b>Why it matters.</b> ' + esc(st.note) + "</div>" +
      '<div class="thumb"><div style="' + (st.img ? "background-image:url(img/" + st.img + ")" : "background:radial-gradient(circle at 50% 30%,rgba(201,162,74,.6),#141A33 70%)") + '"></div><p>' +
      (firstTime ? "The painting is fully lit and the verse is added to Verses gathered." : "You know this one by heart.") +
      (nx ? " Next story: <b>" + esc(nx.title) + "</b>." : " You have reached the end of the Bible.") + "</p></div>" +
      (seal ? '<div class="note">' + ICON.star + " <b>A puzzle guards this story’s relic.</b> Solve it to add the relic to your satchel and open the way ahead.</div>" +
        '<button class="cta" data-act="seal">' + (st.id === "fall" ? "Go to the Garden Gate" : "Solve the puzzle: " + esc(Lamp.adv.sealTitle(st.id))) + "</button>" +
        (nx && Lamp.blockedBy && Lamp.blockedBy(nx) ? '<p class="sealnote">The next story, “' + esc(nx.title) + "”, opens when the puzzle is solved.</p>" : "") : "") +
      (nx && !(seal && Lamp.blockedBy && Lamp.blockedBy(nx)) ? '<button class="cta' + (seal ? " alt" : "") + '" data-act="next">' + (nextOpen ? "Play next story" : (Lamp.preview ? "Coming Soon!" : "Unlock the next story")) + "</button>" : "") +
      '<button class="cta alt" data-act="leave">Back to the journey</button>',
      { seal: () => { const go = () => Lamp.adv.startSeal(st.id); if (st.id === "fall" && Lamp.narr) Lamp.narr.ending(st, null, "Go to the Garden Gate", go); else go(); },
        next: () => { const go = () => { if (nextOpen) Lamp.playStory(nx, false); else { close(); Lamp.showUnlock(nx); } }; if (Lamp.narr) Lamp.narr.ending(st, nx, nextOpen ? "Play next story" : (Lamp.preview ? "Coming Soon!" : "Unlock the next story"), go); else go(); },
        leave: () => { Lamp.narr && Lamp.narr.stop(); close(); } });
    const th = sh.querySelector(".thumb>div");
    if (th && st.img) { th.classList.add("tap"); th.setAttribute("role", "button"); th.setAttribute("aria-label", "See the painting"); th.onclick = () => Lamp.showPainting(st, () => {}); }
    };
    setTimeout(() => still() && Lamp.narr && Lamp.narr.verse(st.id), 1900);   // the Lamplighter reads the verse over the painting
  }
  /* A story's painting, full screen and fully lit: shown when the story is finished, and from the card's thumbnail. */
  Lamp.showPainting = function (st, then, extra) {
    const gifts = (extra && extra.gifts) || [], clue = extra && extra.clue;
    const old = document.getElementById("reveal"); if (old) old.remove();
    const el = document.createElement("div");
    el.id = "reveal"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", st.title + ", painting");
    el.innerHTML = '<div class="rv-blur" style="background-image:url(img/' + st.img + ')"></div><img class="rv-img" src="img/' + st.img + '" alt="">' +
      '<div class="rv-cap"><div class="rv-kick">' + esc(st.book) + '</div><div class="rv-ttl">' + esc(st.title) + '</div><div class="rv-ref">' + esc(st.verses[st.key].ref) + "</div>" +
      (gifts.length ? '<div class="rv-gifts">' + gifts.map((g) => "<span>" + esc(g) + "</span>").join("") + "</div>" : "") +
      (clue ? '<div class="rv-clue">' + esc(clue) + "</div>" : "") +
      '<div class="rv-tap">Tap to continue</div></div>';
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("on"));
    let ready = false; setTimeout(() => (ready = true), 900);
    el.addEventListener("click", () => {
      if (!ready) return;
      el.classList.remove("on"); setTimeout(() => el.remove(), 500); then && then();
    });
  };
  function dailyCard(first) {
    const secs = Math.round((Date.now() - G.t0) / 1000), mm = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
    const hu = G.hintsUsed, fl = hu === 0 ? 3 : hu === 1 ? 2 : 1, lamps = "🪔".repeat(fl) + "·".repeat(3 - fl), dn = Lamp.dailyNumber();
    if (!Lamp.state.daily[Lamp.today()]) { Lamp.state.daily[Lamp.today()] = { hints: hu, secs, n: dn }; Lamp.state.oil += 1; Lamp.save(); }
    const txt = "Lamp · Daily verse #" + dn + "\n" + lamps + "  " + mm + (hu ? ", " + hu + " hint" + (hu > 1 ? "s" : "") : ", no hints") + "\n" + G.daily.ref + " · " + Lamp.streak().n + "-day lamp";
    sheet('<div class="kick">Daily verse #' + dn + ' solved · +1 oil</div><h2>' + lamps + "</h2>" +
      '<div class="v">“' + esc(G.daily.w.join(" ")) + '”</div><div class="r">' + esc(G.daily.ref) + " · KJV</div>" +
      (first ? '<div class="note">' + ICON.lamp + " <b>Your lamp is lit for today.</b> " + streakLine() + "</div>" : "") +
      (G.story ? '<div class="note"><b>Why it matters.</b> ' + esc(G.story.note) + "</div>" : "") +
      '<div class="share" id="shareTxt">' + esc(txt).replace(/\n/g, "<br>") + "</div>" +
      '<button class="cta gold" data-act="copy" data-keep="1">Copy result to share</button><button class="cta alt" data-act="leave">Done</button>',
      { copy: () => Lamp.copyText(txt, $("shareTxt")), leave: close });
  }

  /* ---------- shared helpers ---------- */
  function toast(t) { const el = $("toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 1300); }
  Lamp.toast = toast;
  function sheet(html, acts) {
    const sh = document.createElement("div"); sh.className = "sheet";
    sh.innerHTML = '<div class="card" role="dialog" aria-modal="true">' + html + "</div>";
    (G && !$("level").hidden ? $("level") : document.body).appendChild(sh);
    sh.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      if (!b.dataset.keep) sh.remove();
      acts && acts[b.dataset.act] && acts[b.dataset.act](b);
    });
    const f = sh.querySelector("[data-act]"); f && f.focus({ preventScroll: true });
    return sh;
  }
  Lamp.sheet = sheet;
  Lamp.copyText = function (txt, el) {
    const done = () => toastAny("Copied. Paste it on Facebook or in a text");
    const fallback = () => { if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } toastAny("Select the text and copy it"); };
    if (Lamp.native("share", { text: txt })) return;
    try { navigator.clipboard.writeText(txt).then(done, fallback); } catch (e) { fallback(); }
  };
  function toastAny(t) { if (!$("level").hidden) toast(t); else Lamp.mainToast && Lamp.mainToast(t); }

  /* test hooks used by the automated play-through */
  Lamp._test = {
    get G() { return G; }, get letters() { return letters; }, get VERSE() { return VERSE; },
    spell(w) { const used = new Set(); sel = [...w].map((c) => { const i = letters.findIndex((x, j) => x === c && !used.has(j)); used.add(i); return i; }); submit(); },
    stopDemo,
    goto(story, lv) {
      G = { mode: "story", story, lv, found: [], hints: {}, built: 0, order: [], hintsUsed: 0, t0: Date.now(), bonusFound: [] };
      $("level").hidden = false; $("main").hidden = true; start(true);
    },
    tapTile(i) { const t = [...document.querySelectorAll("#tiles .tile:not(.used)")].find((x) => norm(VERSE[+x.dataset.i]) === norm(VERSE[i])); t && t.click(); },
  };
  document.addEventListener("DOMContentLoaded", () => { $("lback").onclick = close; });
})();
