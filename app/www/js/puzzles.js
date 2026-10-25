/* Lamp — the six Genesis puzzles after the Garden Gate (pictures made by tools/make_puzzle_assets.py).

     Noah     → The Ark Door (set the wheels to Genesis 6:15) and The Window and the Dove (Genesis 8:6-11) → Olive Leaf
     Abram    → The Road to Bethel (map, compass and altars, Genesis 12:5-8)                             → Tent Peg
     Moriah   → The Ram in the Thicket (altar, look behind, untangle the thorns, Genesis 22)             → Ram's Horn
     Bethel   → The Stone Pillar (free the stone, set it up, anoint it, name the place, Genesis 28)      → Anointed Stone
     Joseph   → The Storehouses (a fifth of each harvest, packed into the storehouse, Genesis 41)        → Coat of Many Colours

   Each puzzle keeps its finished steps in Lamp.state.adv.p[storyId], so leaving and coming back returns to the same step.
   Hints come in three steps (where to look, the idea, the move) and cost one drop of oil each, as in the rest of the adventure. */
(function () {
  "use strict";
  const Lamp = window.Lamp;
  if (!Lamp || !Lamp.adv || !Lamp.adv.kit) return;
  const K = Lamp.adv.kit, esc = K.esc, $ = (id) => document.getElementById(id);
  const PIC = K.IMG + "p/";

  /* ---------- relics ---------- */
  const RELICS = {
    olive: { name: "Olive Leaf", img: "p/relic-olive.webp", story: "noah",
      v: "And the dove came in to him in the evening; and, lo, in her mouth was an olive leaf pluckt off: so Noah knew that the waters were abated from off the earth.", ref: "Genesis 8:11" },
    peg: { name: "Tent Peg", img: "p/relic-peg.webp", story: "abram",
      v: "And he removed from thence unto a mountain on the east of Bethel, and pitched his tent, having Bethel on the west, and Hai on the east.", ref: "Genesis 12:8" },
    horn: { name: "Ram's Horn", img: "p/relic-horn.webp", story: "provide",
      v: "And Abraham lifted up his eyes, and looked, and behold behind him a ram caught in a thicket by his horns.", ref: "Genesis 22:13" },
    anointed: { name: "Anointed Stone", img: "p/relic-anointed.webp", story: "ladder",
      v: "And Jacob rose up early in the morning, and took the stone that he had put for his pillows, and set it up for a pillar, and poured oil upon the top of it.", ref: "Genesis 28:18" },
    colours: { name: "Coat of Many Colours", img: "p/relic-colours.webp", story: "joseph",
      v: "Now Israel loved Joseph more than all his children, because he was the son of his old age: and he made him a coat of many colours.", ref: "Genesis 37:3" },
  };
  Object.keys(RELICS).forEach((k) => Lamp.adv.addRelic(k, RELICS[k]));

  /* ---------- shared pieces ---------- */
  const W = 941, H = 1672;
  function prog(id) { const a = K.A(); a.p[id] = a.p[id] || {}; return a.p[id]; }
  function fresh(id) { const a = K.A(); if (a.seals[id]) { a.p[id] = {}; Lamp.save(); } return prog(id); }   // a broken seal plays again from the start
  const save = () => Lamp.save();
  function sizeBox(box) { const w = parseFloat(box.style.width) || box.clientWidth; box.style.fontSize = (w / W) * 16 + "px"; }   // 1em = 16 painting pixels
  window.addEventListener("resize", () => setTimeout(() => document.querySelectorAll("#adv .adv-box").forEach(sizeBox), 0));
  function sc(img) { const box = K.scene("p/" + img, W, H); box.classList.add("pz"); sizeBox(box); return box; }
  /* a picture or a button laid on the painting, centred on (x, y), w = width as a share of the painting */
  function put(box, src, x, y, w, cls, label, fn) {
    const el = document.createElement(fn ? "button" : "div");
    el.className = "pzi " + (cls || "");
    Object.assign(el.style, { left: x * 100 + "%", top: y * 100 + "%", width: w * 100 + "%" });
    if (src) el.innerHTML = '<img src="' + PIC + src + '" alt="">';
    if (label) el.setAttribute("aria-label", label);
    if (fn) el.onclick = (e) => { e.stopPropagation(); fn(el); };
    box.appendChild(el); return el;
  }
  function addImg(box, img, cls) { const i = document.createElement("img"); i.className = "bgimg " + (cls || ""); i.src = PIC + img; i.alt = ""; box.appendChild(i); return i; }
  /* buttons that float over the scene: a way back, and the scroll that always holds the clue */
  function backBtn(label, fn) {
    const b = document.createElement("button"); b.className = "abtn pz-back"; b.textContent = "‹ " + label;
    b.onclick = (e) => { e.stopPropagation(); K.sfx("click"); fn(); }; $("adv-scene").appendChild(b); return b;
  }
  function scrollBtn(label, html) {
    const b = document.createElement("button"); b.className = "abtn pz-scroll"; b.innerHTML = "📜 " + esc(label);
    b.onclick = (e) => { e.stopPropagation(); b.classList.remove("pulse"); K.sfx("click"); K.card(html() + '<button class="cta" data-act="x">Close</button>', { x: () => {} }); };
    $("adv-scene").appendChild(b); return b;
  }
  const verses = (list) => list.map((v) => '<div class="v pzv"><sup>' + esc(v[0]) + "</sup>" + esc(v[1]) + "</div>").join("");
  function tray() { let t = $("pz-tray"); if (!t) { t = document.createElement("div"); t.id = "pz-tray"; t.className = "pz-tray"; $("adv-scene").appendChild(t); } return t; }
  /* three-step hints for the step the player is on */
  function hinter(state, table) {
    let at = null, lvl = 0;
    return () => {
      state.hints++;
      const key = state.stage(), list = table[key] || ["Look around the scene. Everything you can use glows softly."];
      if (key !== at) { at = key; lvl = 0; }
      const text = list[Math.min(lvl, list.length - 1)]; lvl++;
      K.say(typeof text === "function" ? text() : text, "", 6000);
    };
  }
  function glint(els) { els.forEach((el, i) => el && setTimeout(() => { el.classList.remove("glint"); void el.offsetWidth; el.classList.add("glint"); }, 250 + i * 180)); }
  /* the objects glint again after a while with no progress */
  function idler(fn) { let t = 0; const poke = () => { clearTimeout(t); t = setTimeout(() => { if (K.root()) { fn(); poke(); } }, 12000); }; poke(); return poke; }
  function fade(box, img, ms) {
    const i = addImg(box, img, "pz-fadein"); requestAnimationFrame(() => requestAnimationFrame(() => i.classList.add("on")));
    return new Promise((r) => setTimeout(r, ms || 1400));
  }
  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
  function stats(st, swift) { return { misses: st.misses, hints: st.hints, secs: (Date.now() - st.t0) / 1000, swift }; }
  function newState() { return { misses: 0, hints: 0, t0: Date.now(), stage: () => "" }; }
  const live = (box) => box && box.isConnected;

  /* ======================================================================
     1. Noah — The Ark Door: three wheels, set to the measurements on the builder's plank (Genesis 6:15).
     ====================================================================== */
  const VALUES = [10, 30, 50, 100, 150, 300, 450, 600];
  const WHEELS = [   // top to bottom on the door: centre y, window y, what it measures, the answer
    { y: 0.164, wy: 0.08, k: "height", ans: 30, start: 5 },
    { y: 0.478, wy: 0.389, k: "length", ans: 300, start: 2 },
    { y: 0.81, wy: 0.718, k: "breadth", ans: 50, start: 1 },
  ];
  const MARK = {
    length: '<svg viewBox="0 0 100 60"><path d="M6 30H94M6 30l14-12M6 30l14 12M94 30l-14-12M94 30l-14 12"/></svg>',
    breadth: '<svg viewBox="0 0 100 60"><rect x="22" y="10" width="56" height="40" rx="4"/><path d="M8 30H92M8 30l10-9M8 30l10 9M92 30l-10-9M92 30l-10 9"/></svg>',
    height: '<svg viewBox="0 0 60 100"><path d="M30 94V6M30 6L18 20M30 6l12 14M14 94h32"/></svg>',
  };
  const ARK_V = [["6:15", "And this is the fashion which thou shalt make it of: The length of the ark shall be three hundred cubits, the breadth of it fifty cubits, and the height of it thirty cubits."]];
  function noah() {
    const p = fresh("noah"), st = newState();
    K.open("Noah · The Ark", { hint: hinter(st, NOAH_HINTS) }, "noah");
    st.stage = () => (!p.door ? (p.readPlank ? "wheels" : "plank") : !p.gears ? "gears" : !p.raven ? "raven" : !p.dove1 ? "dove1" : (p.days || 0) < 7 ? "days" : "dove2");
    if (p.door) deck(p, st); else ark(p, st);
  }
  const NOAH_HINTS = {
    plank: ["The builder's plank by the ark has words on it. Read it closely.", "The plank gives the length, the breadth and the height of the ark.", "Read the plank, then set each wheel on the door to the measurement for its carving."],
    wheels: ["Each wheel has a carving beside it: long, wide or tall.", "Length is the long arrow, breadth the wide one, height the upright one. The plank gives each one.", "Set height to 30, length to 300 and breadth to 50, then draw the bolts."],
    gears: ["The window needs the crank's turning to reach it.", "Put all three gears on the three pegs between the crank and the window.", "Tap a gear below, then tap a peg. When all three are on, turn the crank."],
    raven: ["Noah's log says what he sent out first.", "“And he sent forth a raven.” Genesis 8:7", "Tap the raven to send it out of the window."],
    dove1: ["After the raven, Noah sent another bird.", "“Also he sent forth a dove from him.” Genesis 8:8", "Tap the dove to send her out."],
    days: ["Noah's log says how long he waited before sending the dove again.", "“And he stayed yet other seven days.” Genesis 8:10. The beam has seven notches.", "Tap the notched beam seven times, then send the dove."],
    dove2: ["Seven days have passed.", "“And again he sent forth the dove out of the ark.” Genesis 8:10", "Tap the dove."],
  };
  function ark(p, st) {
    const box = sc("ark.jpg");
    const door = K.hot(box, 0.43, 0.27, 0.71, 0.74, "The door of the ark", () => { K.sfx("click"); doorScene(p, st); });
    const plank = put(box, null, 0.5, 0.955, 0.36, "pz-pill", "The builder's plank", () => { K.sfx("click"); plankScene(p, st); });
    plank.innerHTML = "<span>🪵 The builder's plank</span>";
    K.say(p.readPlank ? "The ark stands finished, its great door shut." : "The ark stands finished on dry ground. Its great door is shut fast.", "", 4200);
    glint([door, plank]);
    idler(() => glint([door, plank]));
  }
  function plankScene(p, st) {
    const box = sc("plank.jpg");
    const t = document.createElement("div"); t.className = "pz-carve"; t.style.cssText = "left:51%;top:48%;width:27%;transform:translate(-50%,-50%) rotate(6.4deg)";
    t.innerHTML = "<b>THE LENGTH</b> OF THE ARK SHALL BE <b>THREE HUNDRED</b> CUBITS · <b>THE BREADTH</b> OF IT <b>FIFTY</b> CUBITS · AND <b>THE HEIGHT</b> OF IT <b>THIRTY</b> CUBITS<small>GENESIS 6:15</small>";
    box.appendChild(t);
    p.readPlank = 1; save();
    K.say("“The length of the ark shall be three hundred cubits, the breadth of it fifty cubits, and the height of it thirty cubits.”", "Genesis 6:15", 7000);
    backBtn("Ark", () => ark(p, st));
  }
  function doorScene(p, st) {
    const box = sc("door.jpg"), idx = p.wheels || WHEELS.map((w) => w.start);
    const show = [];
    WHEELS.forEach((w, i) => {
      const hub = put(box, null, 0.5, w.y + 0.012, 0.25, "pz-hub", "Wheel for the " + w.k, () => turn(i, 1));
      hub.style.backgroundImage = "url(" + PIC + "door.jpg)";
      const num = put(box, null, 0.5, w.y + 0.012, 0.1, "pz-num"); num.setAttribute("aria-live", "polite");
      const mk = put(box, null, 0.155, w.y, 0.11, "pz-mark"); mk.innerHTML = MARK[w.k] + "<span>" + w.k.toUpperCase() + "</span>";
      put(box, null, 0.845, w.y - 0.045, 0.11, "pz-arrow", "Turn the " + w.k + " wheel up", () => turn(i, 1)).textContent = "▲";
      put(box, null, 0.845, w.y + 0.045, 0.11, "pz-arrow", "Turn the " + w.k + " wheel down", () => turn(i, -1)).textContent = "▼";
      show.push({ hub, num, rot: idx[i] * 45 });
    });
    function draw() { WHEELS.forEach((w, i) => { show[i].num.textContent = VALUES[idx[i]]; show[i].hub.style.transform = "translate(-50%,-50%) rotate(" + show[i].rot + "deg)"; }); }
    function turn(i, d) {
      idx[i] = (idx[i] + d + VALUES.length) % VALUES.length; show[i].rot += d * 45; p.wheels = idx.slice(); save();
      K.sfx("click"); K.buzz("light"); draw();
    }
    // the hub picture must line up with the door painting under it
    WHEELS.forEach((w, i) => { const h = show[i].hub; h.style.backgroundSize = (W / (0.25 * W)) * 100 + "% auto"; h.style.backgroundPosition = "50% " + ((w.y + 0.012) * H - 0.125 * W) / (H - 0.25 * W) * 100 + "%"; });
    draw();
    const bolt = put(box, null, 0.5, 0.955, 0.42, "pz-pill pz-bolt", "Draw the bolts", () => {
      const ok = WHEELS.every((w, i) => VALUES[idx[i]] === w.ans);
      if (!ok) { st.misses++; K.snd("bad"); K.buzz("error"); box.classList.remove("pz-shake"); void box.offsetWidth; box.classList.add("pz-shake");
        K.say(p.readPlank ? "The bolts will not move. The wheels are not set to the measure God gave." : "The bolts will not move. Perhaps something nearby gives the measure.", "", 3800); return; }
      p.door = 1; save(); K.sfx("stone"); K.snd("level"); K.buzz("success"); box.classList.add("pz-open");
      K.say("“Thus did Noah; according to all that God commanded him, so did he.”", "Genesis 6:22", 5200);
      setTimeout(() => { if (!live(box)) return; K.say("The rains came, and the ark was lifted up above the earth. Forty days later, the rain has stopped…", "Genesis 7:17; 8:6", 5200); deck(p, st); }, 4600);
    });
    bolt.innerHTML = "<span>Draw the bolts</span>";
    backBtn("Ark", () => ark(p, st));
    if (!p.readPlank) K.say("Three great wheels lock the door, each carved with a mark.", "", 3600);
    glint(show.map((s) => s.hub).concat([bolt]));
  }

  /* ---------- 2. Noah — The Window and the Dove (Genesis 8:6-11) ---------- */
  const PEGS = [[0.31, 0.415], [0.42, 0.415], [0.53, 0.415]];
  const GEAR = { s: { img: "gear-s.webp", w: 0.085 }, m: { img: "gear-m.webp", w: 0.11 }, l: { img: "gear-l.webp", w: 0.13 } };
  const NOTCH = (i) => 0.255 + i * 0.047;
  const LOG = [
    ["8:6", "And it came to pass at the end of forty days, that Noah opened the window of the ark which he had made:"],
    ["8:7", "And he sent forth a raven, which went forth to and fro, until the waters were dried up from off the earth."],
    ["8:8", "Also he sent forth a dove from him, to see if the waters were abated from off the face of the ground;"],
    ["8:9", "But the dove found no rest for the sole of her foot, and she returned unto him into the ark, for the waters were on the face of the whole earth: then he put forth his hand, and took her, and pulled her in unto him into the ark."],
    ["8:10", "And he stayed yet other seven days; and again he sent forth the dove out of the ark;"],
    ["8:11", "And the dove came in to him in the evening; and, lo, in her mouth was an olive leaf pluckt off: so Noah knew that the waters were abated from off the earth."],
  ];
  function deck(p, st) {
    const box = sc("deck.jpg");
    const open = addImg(box, "deck-open.jpg", "pz-fadein" + (p.gears ? " on" : ""));
    const dusk = document.createElement("div"); dusk.className = "pz-dusk"; box.appendChild(dusk);
    p.pegs = p.pegs || [null, null, null];
    let sel = null;
    const logLines = () => (!p.gears ? 1 : !p.raven ? 2 : !p.dove1 ? 3 : 5) + (p.done ? 1 : 0);
    const log = scrollBtn("Noah's log", () => '<div class="kick">Noah\'s log</div><h2>After the flood</h2>' + verses(LOG.slice(0, logLines())) + '<div class="r">Genesis 8 · KJV</div>');
    const pegEls = PEGS.map(([x, y], i) => put(box, null, x, y, 0.075, "pz-peg", "Peg " + (i + 1), () => pegTap(i)));
    const gearEls = [];
    function drawGears() {
      gearEls.forEach((g) => g.remove()); gearEls.length = 0;
      p.pegs.forEach((g, i) => { if (!g) return; const el = put(box, GEAR[g].img, PEGS[i][0], PEGS[i][1], GEAR[g].w, "pz-gear" + (i % 2 ? " rev" : ""), "Gear on peg " + (i + 1), () => pegTap(i)); gearEls.push(el); });
      drawTray();
    }
    function pegTap(i) {
      if (p.gears) { K.say("The gears are set. The window is open."); return; }
      if (p.pegs[i] && !sel) { const g = p.pegs[i]; p.pegs[i] = null; save(); K.sfx("click"); drawGears(); sel = g; drawTray(); return; }
      if (!sel) { K.say("An empty peg. Choose a gear below, then tap a peg."); return; }
      if (p.pegs[i]) { const g = p.pegs[i]; p.pegs[i] = sel; sel = g; } else { p.pegs[i] = sel; sel = null; }
      save(); K.sfx("click"); K.buzz("light"); drawGears();
      if (p.pegs.every(Boolean)) K.say("All three gears mesh, from the crank to the window. Turn the crank.", "", 3600);
    }
    function drawTray() {
      const t = tray();
      if (!p.gears) {
        const free = ["s", "m", "l"].filter((g) => !p.pegs.includes(g));
        t.innerHTML = '<span class="lbl">Gears</span>' + (free.length ? free.map((g) => '<button class="pz-tit' + (sel === g ? " sel" : "") + '" data-g="' + g + '" aria-label="Gear"><img src="' + PIC + GEAR[g].img + '" style="width:' + GEAR[g].w / 0.13 * 84 + '%" alt=""></button>').join("") : '<span class="note">All three gears are on the pegs.</span>');
        t.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { sel = sel === b.dataset.g ? null : b.dataset.g; K.sfx("click"); drawTray(); if (sel) K.say("Now tap a peg on the wall.", "", 2000); }));
        return;
      }
      t.innerHTML = '<span class="lbl">Birds</span>' +
        (p.raven ? '<span class="pz-tit gone"></span>' : '<button class="pz-tit" data-b="raven" aria-label="The raven"><img src="' + PIC + 'raven.webp" alt=""></button>') +
        (p.done ? '<span class="pz-tit gone"></span>' : '<button class="pz-tit" data-b="dove" aria-label="The dove"><img src="' + PIC + 'dove.webp" alt=""></button>') +
        '<span class="note">' + (p.dove1 ? "Days marked: <b>" + (p.days || 0) + " of 7</b>" : "Tap a bird to send it out of the window.") + "</span>";
      t.querySelectorAll("[data-b]").forEach((b) => (b.onclick = () => bird(b.dataset.b, b)));
    }
    const crank = K.hot(box, 0.12, 0.45, 0.38, 0.62, "The crank", () => {
      if (p.gears) { K.say("The window is open."); return; }
      if (!p.pegs.every(Boolean)) { K.sfx("click"); K.say("The crank turns, but its turning reaches nothing. The pegs between it and the window are empty.", "", 3800); crank.classList.add("pz-wiggle"); setTimeout(() => crank.classList.remove("pz-wiggle"), 600); return; }
      p.gears = 1; save(); box.classList.add("spin");
      [0, 160, 320, 480, 640].forEach((t) => setTimeout(() => K.sfx("click"), t));
      setTimeout(() => { K.sfx("stone"); open.classList.add("on"); K.buzz("success"); log.classList.add("pulse"); drawTray();
        K.say("“Noah opened the window of the ark which he had made.”", "Genesis 8:6", 5000); }, 900);
      setTimeout(() => box.classList.remove("spin"), 2400);
    });
    const beam = K.hot(box, 0.74, 0.2, 0.87, 0.6, "The notched beam", () => {
      if (!p.dove1) { K.sfx("click"); K.say("A beam with seven notches cut in it, like a tally of days.", "", 3000); return; }
      if ((p.days || 0) >= 7) { K.say("Seven days are marked."); return; }
      p.days = (p.days || 0) + 1; save(); K.sfx("click"); K.snd("tap", p.days - 1); K.buzz("light"); marks(); drawTray();
      if (p.days === 7) { K.say("“And he stayed yet other seven days.”", "Genesis 8:10", 3400); }
    });
    const markEls = [];
    function marks() { markEls.forEach((m) => m.remove()); markEls.length = 0; for (let i = 0; i < (p.days || 0); i++) markEls.push(put(box, null, 0.805, NOTCH(i), 0.05, "pz-tally")); }
    marks();
    let flying = false;
    function bird(b, btn) {
      if (flying) return;
      if (b === "dove" && !p.raven) { st.misses++; K.snd("bad"); K.say("Noah's log says what he sent forth first.", "", 3000); log.classList.add("pulse"); return; }
      flying = true;
      const img = btn.querySelector("img"), r = img.getBoundingClientRect(), win = box.getBoundingClientRect();
      const fl = document.createElement("img"); fl.src = img.src; fl.className = "pz-fly"; fl.alt = "";
      Object.assign(fl.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px" }); document.body.appendChild(fl);
      const tx = win.left + win.width * 0.46 - r.left - r.width / 2, ty = win.top + win.height * 0.18 - r.top - r.height / 2;
      btn.style.visibility = "hidden"; K.sfx("click");
      const out = fl.animate([{ transform: "translate(0,0) scale(1)" }, { transform: "translate(" + tx + "px," + ty + "px) scale(.35)", opacity: 0.2 }], { duration: 1300, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" });
      out.onfinish = async () => {
        if (b === "raven") {
          fl.remove(); p.raven = 1; save(); flying = false; log.classList.add("pulse"); drawTray();
          K.say("“He sent forth a raven, which went forth to and fro, until the waters were dried up from off the earth.”", "Genesis 8:7", 6000); return;
        }
        const leaf = p.dove1 && (p.days || 0) >= 7;
        if (leaf) { dusk.classList.add("on"); K.say("The day passes. Evening comes…", "", 2600); await wait(2600); }
        else await wait(1200);
        if (!K.root()) { fl.remove(); return; }
        const back = fl.animate([{ transform: "translate(" + tx + "px," + ty + "px) scale(.35)", opacity: 0.2 }, { transform: "translate(0,0) scale(1)", opacity: 1 }], { duration: 1300, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" });
        if (leaf) { const lf = document.createElement("img"); lf.src = PIC + "relic-olive.webp"; lf.className = "pz-fly leaf"; lf.alt = ""; Object.assign(lf.style, { left: r.left + r.width * 0.55 + "px", top: r.top + r.height * 0.2 + "px", width: r.width * 0.45 + "px" }); document.body.appendChild(lf);
          lf.animate([{ transform: "translate(" + tx + "px," + ty + "px) scale(.35)", opacity: 0 }, { transform: "translate(0,0) scale(1)", opacity: 1 }], { duration: 1300, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" });
          setTimeout(() => lf.remove(), 4200); }
        back.onfinish = () => {
          setTimeout(() => fl.remove(), leaf ? 2900 : 300); btn.style.visibility = ""; flying = false;
          if (leaf) {
            p.done = 1; save(); K.snd("bonus"); K.buzz("success"); drawTray();
            K.say("“And the dove came in to him in the evening; and, lo, in her mouth was an olive leaf pluckt off.”", "Genesis 8:11", 6000);
            setTimeout(() => K.root() && K.sealDone("noah", stats(st, 300)), 3800); return;
          }
          if (!p.dove1) { p.dove1 = 1; save(); log.classList.add("pulse"); drawTray(); K.say("The dove found no rest for the sole of her foot, and she returned unto him into the ark.", "Genesis 8:9", 6000); return; }
          st.misses++; K.snd("bad"); K.say("She comes back with nothing. “The dove found no rest for the sole of her foot.” Read Noah's log again.", "Genesis 8:9", 6000); log.classList.add("pulse");
        };
      };
    }
    drawGears();
    if (!p.gears) { K.say("The upper deck of the ark. The window is shuttered; a crank and three empty pegs wait on the wall.", "", 5200); glint(pegEls.concat([crank])); }
    idler(() => glint(p.gears ? [beam, log] : pegEls.concat([crank])));
  }

  /* ======================================================================
     3. Abram — The Road to Bethel (Genesis 12:5-8)
     ====================================================================== */
  const PLACES = {
    haran: { x: 0.7, y: 0.16, name: "Haran", sym: "🏘" },
    sichem: { x: 0.42, y: 0.42, name: "Sichem", sub: "the plain of Moreh", sym: "🌳" },
    bethel: { x: 0.33, y: 0.69, name: "Bethel", sym: "🏘" },
    hai: { x: 0.71, y: 0.69, name: "Hai", sym: "🏘" },
    mw: { x: 0.18, y: 0.6, name: "A mountain", sym: "⛰" },
    me: { x: 0.52, y: 0.63, name: "A mountain", sym: "⛰" },
  };
  const ROADS = [["haran", "sichem"], ["sichem", "bethel"], ["sichem", "hai"], ["bethel", "mw"], ["bethel", "me"], ["me", "hai"]];
  const ROAD_V = [
    ["12:5", "And Abram took Sarai his wife, and Lot his brother's son, and all their substance that they had gathered, and the souls that they had gotten in Haran; and they went forth to go into the land of Canaan; and into the land of Canaan they came."],
    ["12:6", "And Abram passed through the land unto the place of Sichem, unto the plain of Moreh. And the Canaanite was then in the land."],
    ["12:7", "And the LORD appeared unto Abram, and said, Unto thy seed will I give this land: and there builded he an altar unto the LORD, who appeared unto him."],
    ["12:8", "And he removed from thence unto a mountain on the east of Bethel, and pitched his tent, having Bethel on the west, and Hai on the east: and there he builded an altar unto the LORD, and called upon the name of the LORD."],
  ];
  const ROAD_HINTS = {
    start: ["The scroll lists the places in the order Abram reached them.", "From Haran, Abram passed through the land to Sichem, the plain of Moreh.", "Tap Sichem to move the tent there."],
    altar1: ["Read the scroll: what did Abram do at Sichem?", "“There builded he an altar unto the LORD.” Genesis 12:7", "Tap the altar below while the tent is at Sichem."],
    compass: ["“A mountain on the east of Bethel.” Which way is east on this map?", "Turn the compass so its long north point is at the top. Then east is on the right.", "Tap the compass until the long point is straight up."],
    mountain: ["He pitched his tent with Bethel on the west and Hai on the east.", "West is on the left and east on the right. The mountain must sit between Bethel and Hai.", "Move the tent to the mountain between Bethel and Hai."],
    altar2: ["What did Abram build where he pitched his tent?", "“And there he builded an altar unto the LORD.” Genesis 12:8", "Tap the altar below."],
  };
  const adj = (a, b) => ROADS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  function abram() {
    const p = fresh("abram"), st = newState();
    K.open("Abram · The Road to Bethel", { hint: hinter(st, ROAD_HINTS) }, "abram");
    st.stage = () => (!p.step ? "start" : p.step === 1 ? "altar1" : p.step === 2 ? (p.compass ? "mountain" : "compass") : "altar2");
    if (p.inMap) mapScene(p, st); else tentScene(p, st);
  }
  function tentScene(p, st) {
    const box = sc("tent.jpg");
    const m = K.hot(box, 0.13, 0.44, 0.9, 0.61, "The map on the table", () => { K.sfx("click"); p.inMap = 1; save(); mapScene(p, st); });
    K.hot(box, 0.75, 0.38, 0.92, 0.47, "The lamp", () => K.say("A small clay lamp burns beside the map."));
    K.say("Abram's tent at dusk. A map lies spread on the low table under the lamp.", "", 4200);
    glint([m]); idler(() => glint([m]));
  }
  function mapScene(p, st) {
    const box = sc("map.jpg");
    p.at = p.at || "haran"; p.altars = p.altars || []; p.rot = p.rot == null ? 135 : p.rot;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 941 1672"); svg.setAttribute("class", "pz-roads");
    svg.innerHTML = ROADS.map(([a, b]) => '<line x1="' + PLACES[a].x * W + '" y1="' + PLACES[a].y * H + '" x2="' + PLACES[b].x * W + '" y2="' + PLACES[b].y * H + '"/>').join("");
    box.appendChild(svg);
    const marks = {};
    Object.keys(PLACES).forEach((k) => {
      const P = PLACES[k];
      const el = put(box, null, P.x, P.y, 0.2, "pz-place" + (P.sym === "⛰" ? " mtn" : ""), P.name + (P.sub ? ", " + P.sub : ""), () => go(k));
      el.innerHTML = '<i>' + P.sym + "</i><span>" + esc(P.name) + (P.sub ? "<small>" + esc(P.sub) + "</small>" : "") + "</span>";
      marks[k] = el;
    });
    const altars = [];
    function drawAltars() { altars.forEach((a) => a.remove()); altars.length = 0; p.altars.forEach((k) => altars.push(put(box, "tok-altar.webp", PLACES[k].x - 0.06, PLACES[k].y - 0.035, 0.08, "pz-tok"))); }
    const tent = put(box, "tok-tent.webp", PLACES[p.at].x + 0.06, PLACES[p.at].y - 0.035, 0.09, "pz-tok tent");
    drawAltars();
    const comp = put(box, "compass.webp", 0.21, 0.27, 0.22, "pz-compass", "The compass rose", () => {
      if (p.compass) { K.say("North is at the top: east is on the right, west on the left."); return; }
      p.rot = (p.rot + 45) % 360; save(); K.sfx("click"); K.buzz("light"); drawComp();
      if (p.rot === 0) { p.compass = 1; save(); K.snd("word"); K.buzz("success"); setTimeout(drawComp, 50); K.say("The long point is north, at the top. So east is on the right, and west is on the left.", "", 4800); }
    });
    comp.insertAdjacentHTML("beforeend", '<b class="n">N</b><b class="e">E</b><b class="s">S</b><b class="w">W</b>');
    function drawComp() { comp.querySelector("img").style.transform = "rotate(" + p.rot + "deg)"; comp.classList.toggle("set", !!p.compass); }
    drawComp();
    const scroll = scrollBtn("Scroll", () => '<div class="kick">The scroll</div><h2>Abram’s journey</h2>' + verses(ROAD_V) + '<div class="r">Genesis 12:5–8 · KJV</div>');
    const t = tray();
    t.innerHTML = '<span class="lbl">Tokens</span><button class="pz-tit" id="pz-altar" aria-label="Build an altar here"><img src="' + PIC + 'tok-altar.webp" alt=""></button><span class="note">Tap a place to move the tent along the roads. Tap the altar to build one where the tent stands.</span>';
    $("pz-altar").onclick = altar;
    function moveTent(k) {
      p.at = k; save(); K.sfx("click"); K.buzz("light");
      tent.style.left = (PLACES[k].x + 0.06) * 100 + "%"; tent.style.top = (PLACES[k].y - 0.035) * 100 + "%";
    }
    function go(k) {
      if (k === p.at) { K.say(k === "haran" ? "Haran, where Abram set out from." : "The tent is here."); return; }
      if (p.step >= 3) { K.say("Abram's tent is pitched. His journey for now is done."); return; }
      if (!adj(p.at, k)) { K.say("No road leads there from here. Follow the roads.", "", 2600); return; }
      if (p.at === "sichem" && (p.step || 0) < 2) { st.misses++; K.snd("bad"); K.say("Not yet. Read the scroll: what did Abram do at Sichem?", "", 3600); scroll.classList.add("pulse"); return; }
      if (k === "sichem") { moveTent(k); if (!p.step) { p.step = 1; save(); K.say("“And Abram passed through the land unto the place of Sichem, unto the plain of Moreh.”", "Genesis 12:6", 5200); } return; }
      if (k === "mw" || k === "me") {
        if (!p.compass) { K.snd("bad"); K.say("Which side of Bethel is east? The compass lies askew. Turn it until its long point is at the top.", "", 4600); comp.classList.add("glint"); return; }
        if (k === "mw") { st.misses++; K.snd("bad"); K.buzz("error"); K.say("From this mountain, Bethel would be on the east. The scroll says Bethel on the west, and Hai on the east.", "", 5200); return; }
        moveTent(k); p.step = 3; save(); K.sfx("stone"); K.buzz("success");
        K.say("“He pitched his tent, having Bethel on the west, and Hai on the east.”", "Genesis 12:8", 5200); return;
      }
      moveTent(k);
      K.say(k === "bethel" ? "Bethel. The scroll says Abram pitched his tent on a mountain, with Bethel on one side and Hai on the other." : "Hai. The scroll says Abram pitched his tent on a mountain, with Bethel on one side and Hai on the other.", "", 5000);
    }
    function altar() {
      if (p.altars.includes(p.at)) { K.say("An altar already stands here."); return; }
      const right = (p.at === "sichem" && p.step === 1) || (p.at === "me" && p.step === 3);
      if (!right) { st.misses++; K.snd("bad"); K.say(p.at === "haran" ? "The scroll does not tell of an altar in Haran." : "The scroll does not tell of an altar here.", "", 3200); return; }
      p.altars.push(p.at); K.sfx("stone"); K.buzz("success"); drawAltars();
      if (p.at === "sichem") { p.step = 2; save(); K.say("“And there builded he an altar unto the LORD, who appeared unto him.”", "Genesis 12:7", 5200); return; }
      p.step = 4; save(); K.snd("level");
      K.say("“And there he builded an altar unto the LORD, and called upon the name of the LORD.”", "Genesis 12:8", 5200);
      setTimeout(() => K.root() && K.sealDone("abram", stats(st, 180)), 3600);
    }
    backBtn("Tent", () => { p.inMap = 0; save(); tentScene(p, st); });
    if (!p.step) { K.say("Abram's journey begins in Haran, at the top of the map. The scroll tells where he went.", "", 5200); scroll.classList.add("pulse"); }
    idler(() => glint([scroll, comp, marks.sichem]));
  }

  /* ======================================================================
     4. Moriah — The Ram in the Thicket (Genesis 22)
     ====================================================================== */
  const STONES = [[0.2, 0.62], [0.8, 0.6], [0.28, 0.8], [0.72, 0.79], [0.56, 0.88]];
  const RING = (i) => [0.5 + Math.cos((i / 5) * 6.283 - 1.57) * 0.13, 0.665 + Math.sin((i / 5) * 6.283 - 1.57) * 0.045];
  /* the thicket: nine tiles; sides N=0 E=1 S=2 W=3. "I" joins two opposite sides, "L" two neighbouring sides. */
  const TILES = [["L", 1], ["L", 3], ["I", 0], ["L", 0], ["I", 1], ["L", 2], ["L", 1], ["L", 1], ["L", 3]];   // the shape, and its solved turn
  const TILE_START = [1, 2, 0, 3, 1, 2, 0, 1, 2];
  const MORIAH_HINTS = {
    altar: ["Scattered stones lie on the mountain top. Something must be built.", "“Abraham built an altar there, and laid the wood in order.” Genesis 22:9", "Tap each stone to set it in the ring, then the wood, then the fire."],
    look: ["The question asks where the lamb is. Where have you not looked?", "The scroll says “behind him”. Turn the view around.", "Tap “Look behind”, then tap the thicket."],
    thorns: ["The ram is caught by his horns. Make a way out through the thorns.", "Turn the tiles so the open way runs from the ram's horns at the top to open ground at the bottom.", () => "Turn the glowing tile."],
  };
  function provide() {
    const p = fresh("provide"), st = newState();
    K.open("Moriah · The Ram", { hint: hinter(st, MORIAH_HINTS) }, "provide");
    st.stage = () => (!p.fire ? "altar" : !p.ram ? "look" : "thorns");
    st.hintTile = () => {};
    MORIAH_HINTS.thorns[2] = () => { const i = st.hintTile(); return i >= 0 ? "Turn the glowing tile." : "Follow the open way from the top."; };
    if (p.ram) ramScene(p, st); else ahead(p, st);
  }
  function ahead(p, st) {
    const box = sc("mor-ahead.jpg"), turn = addImg(box, "mor-behind.jpg", "pz-turn");
    p.stones = p.stones || [];
    const ring = put(box, null, 0.5, 0.665, 0.34, "pz-ring");
    const stones = STONES.map(([x, y], i) => {
      const at = p.stones.indexOf(i), pos = at >= 0 ? RING(at) : [x, y];
      return put(box, "stone.webp", pos[0], pos[1], 0.12, "pz-stone" + (at >= 0 ? " set" : ""), "A stone", (el) => {
        if (p.stones.includes(i)) { K.say("The stone is part of the altar now."); return; }
        const k = p.stones.length; p.stones.push(i); save(); const r = RING(k);
        el.style.left = r[0] * 100 + "%"; el.style.top = r[1] * 100 + "%"; el.classList.add("set"); K.sfx("stone"); K.buzz("light");
        if (p.stones.length === 5) { K.say("“And Abraham built an altar there.”", "Genesis 22:9", 3400); glint([wood]); }
      });
    });
    const wood = put(box, "wood.webp", p.wood ? 0.5 : 0.17, p.wood ? 0.645 : 0.72, 0.16, "pz-item" + (p.wood ? " set" : ""), "A bundle of wood", (el) => {
      if (p.wood) { K.say("The wood lies in order on the altar."); return; }
      if (p.stones.length < 5) { st.misses++; K.snd("bad"); K.say("First the altar must be built. “Abraham built an altar there, and laid the wood in order.”", "Genesis 22:9", 5000); return; }
      p.wood = 1; save(); el.style.left = "50%"; el.style.top = "64.5%"; el.classList.add("set"); K.sfx("stone"); K.buzz("light");
      K.say("“…and laid the wood in order.”", "Genesis 22:9", 3000); glint([fire]);
    });
    const fire = put(box, "fire.webp", p.fire ? 0.64 : 0.84, p.fire ? 0.655 : 0.73, 0.12, "pz-item" + (p.fire ? " set" : ""), "A pot of fire", (el) => {
      if (p.fire) { K.say("The fire burns beside the altar."); return; }
      if (!p.wood) { st.misses++; K.snd("bad"); K.say("The wood must be laid in order first.", "Genesis 22:9", 3200); return; }
      p.fire = 1; save(); el.style.left = "64%"; el.style.top = "65.5%"; el.classList.add("set"); K.sfx("stone"); K.buzz("success");
      setTimeout(question, 900);
    });
    let behind = false;
    const turnBtn = put(box, null, 0.5, 0.955, 0.4, "pz-pill pz-turnbtn", "Look behind", () => look());
    turnBtn.innerHTML = "<span>↻ Look behind</span>";
    const thicket = K.hot(box, 0.04, 0.42, 0.68, 0.86, "The thicket", () => {
      if (!behind) return;
      if (!p.fire) { K.say("A thick bush of thorns. Nothing stirs in it.", "", 3000); return; }
      p.ram = 1; save(); K.sfx("click"); K.say("“Behold behind him a ram caught in a thicket by his horns.”", "Genesis 22:13", 4200);
      setTimeout(() => K.root() && ramScene(p, st), 1400);
    });
    thicket.style.display = "none";
    function look() {
      behind = !behind; K.sfx("click"); turn.classList.toggle("on", behind); box.classList.toggle("behind", behind);
      turnBtn.innerHTML = "<span>" + (behind ? "↺ Look ahead" : "↻ Look behind") + "</span>";
      [ring, wood, fire].concat(stones).forEach((e) => (e.style.visibility = behind ? "hidden" : ""));
      thicket.style.display = behind ? "" : "none";
      if (behind) { K.say(p.fire ? "Behind you, a thicket. Something is caught in it." : "Behind you, a thicket of thorns, and the hills beyond.", "", 3200); if (p.fire) glint([thicket]); }
    }
    let swX = null;
    box.addEventListener("pointerdown", (e) => (swX = e.clientX));
    box.addEventListener("pointerup", (e) => { if (swX != null && Math.abs(e.clientX - swX) > 70) look(); swX = null; });
    function question() {
      K.snd("hint");
      K.card('<div class="kick">On the mount</div><h2>“Behold the fire and the wood: but where is the lamb for a burnt offering?”</h2><div class="r">Genesis 22:7 · KJV</div>' +
        '<div class="v">“My son, God will provide himself a lamb for a burnt offering.”</div><div class="r">Genesis 22:8 · KJV</div>' +
        "<p>Nothing on the mountain answers the question. The scroll holds the next words.</p>" + '<button class="cta" data-act="x">Look again</button>', { x: () => { scroll.classList.add("pulse"); turnBtn.classList.add("glint"); } });
    }
    const scroll = scrollBtn("Scroll", () => '<div class="kick">The scroll</div><h2>Mount Moriah</h2>' +
      verses(p.fire ? [["22:9", "And they came to the place which God had told him of; and Abraham built an altar there, and laid the wood in order."], ["22:13", "And Abraham lifted up his eyes, and looked, and behold behind him a ram caught in a thicket by his horns."]]
        : [["22:9", "And they came to the place which God had told him of; and Abraham built an altar there, and laid the wood in order."]]) + '<div class="r">Genesis 22 · KJV</div>');
    if (!p.stones.length) K.say("The top of the mountain, early in the morning. Stones lie scattered, with a bundle of wood and a pot of fire.", "", 5200);
    else if (p.fire) setTimeout(() => K.root() && K.say("“Where is the lamb?” The scroll holds the answer.", "", 3400), 300);
    glint(stones.concat([wood, fire]));
    idler(() => glint(p.fire ? [turnBtn, scroll] : stones.filter((_, i) => !p.stones.includes(i)).concat(p.stones.length === 5 ? [wood, fire] : [])));
  }
  function ramScene(p, st) {
    const box = sc("ram.jpg");
    p.rot = p.rot || TILE_START.slice();
    const grid = put(box, null, 0.5, 0.75, 0.66, "pz-thorns");
    grid.style.height = (0.66 * W) / H * 100 + "%";
    grid.innerHTML = '<div class="entry"></div><div class="exit"></div>' + TILES.map((_, i) => '<button class="tile" data-i="' + i + '" aria-label="Thorn branches"><svg viewBox="0 0 100 100"></svg></button>').join("");
    const els = [...grid.querySelectorAll(".tile")];
    const sides = (i) => { const [k, sol] = TILES[i], base = k === "I" ? [0, 2] : [0, 1], r = (p.rot[i] + sol) % 4; return base.map((s) => (s + r) % 4); };
    // TILES[i][1] is the turn that solves it: tile i is solved when p.rot[i] % 4 === 0
    function path() {   // follow the open way from the top of the middle tile
      let r = 0, c = 1, from = 0; const seen = [];
      for (let n = 0; n < 12; n++) {
        const i = r * 3 + c, s = sides(i); if (!s.includes(from)) return { seen, out: false };
        seen.push(i); const to = s[0] === from ? s[1] : s[0];
        const nr = r + [-1, 0, 1, 0][to], nc = c + [0, 1, 0, -1][to];
        if (nr > 2 && nc === 1) return { seen, out: true };
        if (nr < 0 || nr > 2 || nc < 0 || nc > 2) return { seen, out: false };
        r = nr; c = nc; from = (to + 2) % 4;
      }
      return { seen, out: false };
    }
    const THORN = '<path class="br" d="M8 20 Q40 30 30 60 T70 92M92 14 Q62 40 80 70M20 88 Q30 70 12 50"/><path class="th" d="M28 32l-6-6M34 50l8-4M64 62l6 6M76 40l7-3M18 70l-7 2M50 84l2 8"/>';
    function draw() {
      const pa = path();
      els.forEach((el, i) => {
        const s = sides(i), on = pa.seen.includes(i);
        el.querySelector("svg").innerHTML = THORN + s.map((d) => '<line class="way' + (on ? " on" : "") + '" x1="50" y1="50" x2="' + [50, 100, 50, 0][d] + '" y2="' + [0, 50, 100, 50][d] + '"/>').join("") + '<circle class="way' + (on ? " on" : "") + '" cx="50" cy="50" r="13"/>';
      });
      grid.classList.toggle("free", pa.out);
      return pa;
    }
    st.hintTile = () => {
      els.forEach((e) => e.classList.remove("glint"));
      const pa = path(), SOL = [1, 0, 3, 4, 5, 8, 7];   // the solved way runs 1→0→3→4→5→8→7
      const i = SOL.find((k) => p.rot[k] % (TILES[k][0] === "I" ? 2 : 4) !== 0);
      if (i == null || pa.out) return -1; els[i].classList.add("glint"); return i;
    };
    els.forEach((el, i) => (el.onclick = (e) => {
      e.stopPropagation(); if (p.freed) return;
      p.rot[i] = (p.rot[i] + 1) % 4; save(); K.sfx("click"); K.buzz("light"); el.classList.remove("glint");
      if (draw().out) freed();
    }));
    function freed() {
      p.freed = 1; save(); K.snd("level"); K.buzz("success"); grid.classList.add("done");
      K.say("The thorns part, and the ram is free.", "", 2600);
      setTimeout(() => { if (!K.root()) return; K.say("“And Abraham called the name of that place Jehovahjireh.” The LORD will provide.", "Genesis 22:14", 5200); }, 2600);
      setTimeout(() => K.root() && K.sealDone("provide", stats(st, 200)), 6400);
    }
    draw();
    backBtn("Mountain", () => ahead(p, st));
    if (!p.freed) K.say("The ram is caught fast by his horns. Turn the tangled branches to open a way out, from his horns to the open ground.", "", 6000);
    idler(() => st.hintTile && glint([grid]));
  }

  /* ======================================================================
     5. Bethel — The Stone Pillar (Genesis 28:10-22)
     ====================================================================== */
  /* the rubble: a 5×5 tray; [row, col, length, horizontal]. The first is Jacob's stone; it leaves by the gap on the right of row 2. */
  const RUBBLE = [[2, 0, 2, true], [4, 2, 2, true], [0, 1, 3, true], [1, 1, 3, true], [3, 0, 2, true], [2, 4, 2, false], [2, 3, 2, false], [4, 0, 2, true], [0, 0, 2, false]];
  const NAMES = ["LUZ", "BETHEL", "HARAN"];
  const BETHEL_V = [
    ["28:16", "And Jacob awaked out of his sleep, and he said, Surely the LORD is in this place; and I knew it not."],
    ["28:18", "And Jacob rose up early in the morning, and took the stone that he had put for his pillows, and set it up for a pillar, and poured oil upon the top of it."],
    ["28:19", "And he called the name of that place Bethel: but the name of that city was called Luz at the first."],
  ];
  const BETHEL_HINTS = {
    night: ["One smooth stone lies at the head of the sleeping place.", "Jacob “took of the stones of that place, and put them for his pillows.” Genesis 28:11", "Tap the smooth stone."],
    rubble: ["The smooth stone is boxed in. Move the stones around it.", "Slide stones along their length to clear the gap on the right of the smooth stone's row.", () => "Slide the glowing stone."],
    up: ["The scroll says what Jacob did with the stone in the morning, in order.", "He “set it up for a pillar”.", "Swipe up on the stone, or tap it, to stand it upright."],
    oil: ["“…and poured oil upon the top of it.”", "Your own lamp holds oil.", "Drag the lamp over the top of the pillar and hold it there."],
    name: ["The scroll tells what Jacob called the place.", "Luz was the city's old name. Jacob gave the place a new one.", "Turn the ring to BETHEL and set it."],
  };
  function ladder() {
    const p = fresh("ladder"), st = newState();
    K.open("Bethel · The Stone Pillar", { hint: hinter(st, BETHEL_HINTS) }, "ladder");
    st.stage = () => (!p.dream ? "night" : !p.free ? "rubble" : !p.up ? "up" : !p.oil ? "oil" : "name");
    st.next = () => -1;
    BETHEL_HINTS.rubble[2] = () => { const i = st.next(); return i >= 0 ? "Slide the glowing stone." : "Slide the smooth stone out to the right."; };
    if (!p.dream) night(p, st); else morning(p, st);
  }
  function night(p, st) {
    const box = sc("bet-night.jpg");
    const stone = K.hot(box, 0.52, 0.54, 0.88, 0.645, "The smooth stone", async () => {
      stone.remove(); K.sfx("click");
      K.say("Jacob lay down in that place to sleep, with a stone for his pillow…", "Genesis 28:11", 3400);
      await wait(2800); if (!live(box)) return;
      await fade(box, "bet-dream.jpg", 1800); if (!live(box)) return;
      K.snd("story");
      K.say("“And he dreamed, and behold a ladder set up on the earth, and the top of it reached to heaven: and behold the angels of God ascending and descending on it.”", "Genesis 28:12", 8000);
      await wait(7600); if (!live(box)) return;
      K.say("“Surely the LORD is in this place; and I knew it not.”", "Genesis 28:16", 4400);
      await wait(4200); if (!live(box)) return;
      p.dream = 1; save(); morning(p, st);
    });
    K.say("A stony place at night. Jacob's cloak lies on the ground, and a smooth stone at its head.", "", 5000);
    glint([stone]); idler(() => glint([stone]));
  }
  function morning(p, st) {
    const box = sc(p.oil ? "bet-pillar.jpg" : "bet-sun.jpg");
    scrollBtn("Scroll", () => '<div class="kick">The morning</div><h2>At Bethel</h2>' + verses(BETHEL_V) + '<div class="r">Genesis 28 · KJV</div>');
    if (!p.free) return rubble(p, st, box);
    if (!p.up) return standUp(p, st, box);
    if (!p.oil) return anoint(p, st, box);
    nameRing(p, st, box);
  }
  function rubble(p, st, box) {
    let B = p.blocks ? p.blocks.map((b) => b.slice()) : RUBBLE.map((b) => b.slice());
    const ov = document.createElement("div"); ov.className = "pz-rubble"; $("adv-scene").appendChild(ov);
    ov.innerHTML = '<div class="tray" id="rb"><div class="gap"></div></div><p>Slide the stones to free the smooth stone. It leaves by the gap on the right.</p>';
    const tr = $("rb"), els = [];
    const cells = (b) => Array.from({ length: b[2] }, (_, k) => (b[3] ? [b[0], b[1] + k] : [b[0] + k, b[1]]));
    const free = (i, r, c) => r >= 0 && r < 5 && c >= 0 && c < 5 && !B.some((b, j) => j !== i && cells(b).some(([y, x]) => y === r && x === c));
    function range(i) {   // how far block i can slide back and forward
      const b = B[i]; let lo = 0, hi = 0;
      while (true) { const n = lo - 1, [r, c] = b[3] ? [b[0], b[1] + n] : [b[0] + n, b[1]]; if (!free(i, r, c)) break; lo = n; }
      while (true) { const n = hi + 1, [r, c] = b[3] ? [b[0], b[1] + b[2] - 1 + n] : [b[0] + b[2] - 1 + n, b[1]]; if (!free(i, r, c)) break; hi = n; }
      if (i === 0) { const end = b[1] + b[2] - 1 + hi; if (end === 4) hi += 3; }   // the smooth stone may slide out through the gap
      return [lo, hi];
    }
    B.forEach((b, i) => {
      const el = document.createElement("div"); el.className = "blk" + (i === 0 ? " key" : "") + (b[3] ? " h" : " v");
      el.innerHTML = '<img src="' + PIC + (i === 0 ? "smooth.webp" : "rubble.webp") + '" alt="">';
      el.setAttribute("aria-label", i === 0 ? "The smooth stone" : "A rubble stone");
      tr.appendChild(el); els.push(el);
    });
    function place(i, off) {
      const b = B[i], el = els[i];
      el.style.left = (b[1] + (b[3] ? off : 0)) * 20 + "%"; el.style.top = (b[0] + (b[3] ? 0 : off)) * 20 + "%";
      el.style.width = (b[3] ? b[2] : 1) * 20 + "%"; el.style.height = (b[3] ? 1 : b[2]) * 20 + "%";
    }
    B.forEach((_, i) => place(i, 0));
    let drag = null, moves = p.moves || 0;
    els.forEach((el, i) => {
      el.addEventListener("pointerdown", (e) => { if (p.free) return; e.preventDefault(); el.setPointerCapture(e.pointerId); drag = { i, x: e.clientX, y: e.clientY, rg: range(i), off: 0 }; el.classList.add("drag"); els.forEach((x) => x.classList.remove("glint")); });
      el.addEventListener("pointermove", (e) => {
        if (!drag || drag.i !== i) return;
        const cell = tr.clientWidth / 5, d = (B[i][3] ? e.clientX - drag.x : e.clientY - drag.y) / cell;
        drag.off = Math.max(drag.rg[0], Math.min(drag.rg[1], d)); place(i, drag.off);
      });
      const up = () => {
        if (!drag || drag.i !== i) return;
        const n = Math.round(drag.off); el.classList.remove("drag"); drag = null;
        if (B[i][3]) B[i][1] += n; else B[i][0] += n; place(i, 0);
        if (n) { moves++; p.moves = moves; K.sfx("stone"); K.buzz("light"); }
        if (i === 0 && B[0][1] > 3) return out();
        p.blocks = B; save();
      };
      el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    });
    /* the next move on the shortest way out (for the third hint) */
    st.next = () => {
      const key = (bs) => bs.map((b) => b[0] + "," + b[1]).join(";");
      const start = B.map((b) => b.slice()), seen = new Map([[key(start), null]]), q = [start];
      const fr = (bs, i, r, c) => r >= 0 && r < 5 && c >= 0 && c < 5 && !bs.some((b, j) => j !== i && cells(b).some(([y, x]) => y === r && x === c));
      while (q.length) {
        const s = q.shift();
        if (s[0][1] + s[0][2] === 5) {   // trace back to the first move
          let k = key(s), prev = seen.get(k), cur = s;
          while (prev && seen.get(key(prev.s))) { cur = prev.s; prev = seen.get(key(cur)); }
          const i = prev ? prev.i : 0; els.forEach((x) => x.classList.remove("glint")); els[i].classList.add("glint"); return i;
        }
        s.forEach((b, i) => [-1, 1].forEach((d) => {
          for (let k = 1; k < 5; k++) {
            const nb = b.slice(); if (b[3]) nb[1] += d * k; else nb[0] += d * k;
            if (!cells(nb).every(([r, c]) => fr(s, i, r, c))) break;
            const ns = s.slice(); ns[i] = nb; const kk = key(ns);
            if (!seen.has(kk)) { seen.set(kk, { s, i }); q.push(ns); }
          }
        }));
      }
      return -1;
    };
    function out() {
      p.free = 1; delete p.blocks; save();
      els[0].classList.add("out"); K.sfx("stone"); K.snd("word"); K.buzz("success");
      K.say("The smooth stone is free.", "", 2400);
      setTimeout(() => { ov.classList.add("gone"); setTimeout(() => { ov.remove(); if (K.root()) standUp(p, st, box); }, 500); }, 1400);
    }
    K.say("Morning. The stone Jacob slept on is hemmed in by rubble.", "", 4200);
  }
  function standUp(p, st, box) {
    const ov = document.createElement("div"); ov.className = "pz-altar-ov"; $("adv-scene").appendChild(ov);
    ov.innerHTML = '<div class="pillar" id="pl"><img src="' + PIC + 'smooth.webp" alt="The smooth stone"></div><p>“…and set it up for a pillar.” Swipe up to stand the stone upright.</p>';
    const pl = $("pl"); let y0 = null;
    const go = () => { if (p.up) return; p.up = 1; save(); pl.classList.add("up"); K.sfx("stone"); K.buzz("success"); K.say("He set it up for a pillar.", "Genesis 28:18", 3000); setTimeout(() => { ov.remove(); if (K.root()) anoint(p, st, box); }, 1500); };
    pl.addEventListener("pointerdown", (e) => (y0 = e.clientY));
    pl.addEventListener("pointerup", (e) => { if (y0 != null && y0 - e.clientY > 30) go(); else if (y0 != null) go(); y0 = null; });
  }
  function anoint(p, st, box) {
    const ov = document.createElement("div"); ov.className = "pz-altar-ov"; $("adv-scene").appendChild(ov);
    ov.innerHTML = '<div class="pillar up still" id="pl"><img src="' + PIC + 'smooth.webp" alt="The stone pillar"><div class="oilrun" id="or"></div></div>' +
      '<div class="pz-lamp" id="pzl"><img src="img/start/clay-lamp-warm.webp" alt="Your lamp"><img class="hf" src="img/start/flame.webp" alt=""></div><p id="pzlp">“…and poured oil upon the top of it.” Drag your lamp to the top of the pillar and hold it there.</p>';
    const lamp = $("pzl"), pl = $("pl"); let held = 0, timer = 0, sx = 0, sy = 0, lx = 0, ly = 0;
    lamp.addEventListener("pointerdown", (e) => { e.preventDefault(); lamp.setPointerCapture(e.pointerId); sx = e.clientX; sy = e.clientY; const r = lamp.getBoundingClientRect(); lx = r.left; ly = r.top; lamp.classList.add("drag"); });
    lamp.addEventListener("pointermove", (e) => {
      if (!lamp.classList.contains("drag")) return;
      lamp.style.transform = "translate(" + (e.clientX - sx) + "px," + (e.clientY - sy) + "px) rotate(-25deg)";
      const r = pl.getBoundingClientRect(), over = e.clientX > r.left - 20 && e.clientX < r.right + 20 && e.clientY > r.top - 90 && e.clientY < r.top + r.height * 0.3;
      if (over && !timer) { pl.classList.add("pour"); timer = setInterval(() => { held += 100; $("or").style.height = Math.min(100, held / 18) + "%"; if (held >= 1800) poured(); }, 100); }
      if (!over && timer) { clearInterval(timer); timer = 0; pl.classList.remove("pour"); }
    });
    const up = () => { lamp.classList.remove("drag"); if (!p.oil) lamp.style.transform = ""; clearInterval(timer); timer = 0; pl.classList.remove("pour"); };
    lamp.addEventListener("pointerup", up); lamp.addEventListener("pointercancel", up);
    void lx; void ly;
    if (Lamp.state.oil < 1) { Lamp.state.oil += 1; save(); K.say("Your lamp is dry, so the Lamplighter gives you one drop for this.", "", 4200); }
    function poured() {
      clearInterval(timer); timer = 0; if (p.oil) return;
      p.oil = 1; Lamp.state.oil = Math.max(0, Lamp.state.oil - 1); save(); K.snd("bonus"); K.buzz("success");
      K.say("“…and poured oil upon the top of it.” One drop of oil from your lamp.", "Genesis 28:18", 4200);
      setTimeout(async () => { if (!K.root()) return; ov.classList.add("gone"); await fade(box, "bet-pillar.jpg", 1600); ov.remove(); if (K.root()) nameRing(p, st, box); }, 1800);
    }
  }
  function nameRing(p, st, box) {
    const ov = document.createElement("div"); ov.className = "pz-ringname"; $("adv-scene").appendChild(ov);
    let i = p.nm || 0;
    ov.innerHTML = '<p>A carved ring turns beneath the pillar. What did Jacob call the place?</p><div class="nring"><button class="abtn" id="nl" aria-label="Turn left">‹</button><div class="nm" id="nm" aria-live="polite"></div><button class="abtn" id="nr" aria-label="Turn right">›</button></div><button class="abtn gold" id="nset">Set the name</button>';
    const draw = () => ($("nm").textContent = NAMES[i]);
    draw();
    $("nl").onclick = () => { i = (i + NAMES.length - 1) % NAMES.length; p.nm = i; K.sfx("click"); draw(); };
    $("nr").onclick = () => { i = (i + 1) % NAMES.length; p.nm = i; K.sfx("click"); draw(); };
    $("nset").onclick = () => {
      const n = NAMES[i];
      if (n !== "BETHEL") {
        st.misses++; K.snd("bad"); K.buzz("error");
        K.say(n === "LUZ" ? "Luz was the city's name at the first. What did Jacob call the place?" : "Haran is where Jacob was journeying to. What did he call this place?", "Genesis 28:10, 19", 4600); return;
      }
      ov.remove(); K.sfx("stone"); K.snd("level"); K.buzz("success"); Lamp.state.oil += 2; save();
      K.say("“This is none other but the house of God, and this is the gate of heaven.” Bethel means “house of God”. Two drops of oil return to your lamp.", "Genesis 28:17", 6400);
      setTimeout(() => K.root() && K.sealDone("ladder", stats(st, 240)), 5200);
    };
    K.say("The pillar stands anointed in the morning light.", "", 3000);
  }

  /* ======================================================================
     6. Joseph — The Storehouses (Genesis 41)
     ====================================================================== */
  const FIELDS = [15, 10, 5, 15, 10, 15, 10];
  const SHAPES = { 3: [[[0, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 0]]], 2: [[[0, 0], [0, 1]]], 1: [[[0, 0]]] };
  function shapeOf(i) { const n = FIELDS[i] / 5; if (n === 3) { const k = FIELDS.slice(0, i).filter((f) => f === 15).length; return SHAPES[3][k]; } return SHAPES[n][0]; }
  const turnShape = (cs, r) => { let s = cs; for (let k = 0; k < r; k++) s = s.map(([y, x]) => [x, -y]); const my = Math.min(...s.map((c) => c[0])), mx = Math.min(...s.map((c) => c[1])); return s.map(([y, x]) => [y - my, x - mx]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
  const STORE_V = [
    ["41:34", "Let Pharaoh do this, and let him appoint officers over the land, and take up the fifth part of the land of Egypt in the seven plenteous years."],
    ["41:35", "And let them gather all the food of those good years that come, and lay up corn under the hand of Pharaoh, and let them keep food in the cities."],
    ["41:36", "And that food shall be for store to the land against the seven years of famine, which shall be in the land of Egypt; that the land perish not through the famine."],
  ];
  const JOSEPH_HINTS = {
    fields: ["The scroll on the storehouse door says how much of each harvest to keep.", "“Take up the fifth part.” A fifth of 10 sheaves is 2.", "Take 1 from a field of 5, 2 from a field of 10, and 3 from a field of 15."],
    door: ["All seven shares are gathered.", "Carry them into the storehouse.", "Tap the open storehouse door."],
    pack: ["Every bundle must fit on the floor. Tap a bundle a second time to turn it.", "Fill the corners first.", () => "Place the glowing bundle where the floor glows."],
  };
  function joseph() {
    const p = fresh("joseph"), st = newState();
    K.open("Joseph · The Storehouses", { hint: hinter(st, JOSEPH_HINTS) }, "joseph");
    st.stage = () => (!FIELDS.every((_, j) => p.taken && p.taken[j]) ? "fields" : !p.inside ? "door" : "pack");
    st.packHint = () => "";
    JOSEPH_HINTS.pack[2] = () => st.packHint();
    if (p.inside && !p.full) storeFloor(p, st); else courtyard(p, st);
  }
  function wallCard(lean) {
    K.card('<div class="kick">Pharaoh’s dream</div><h2>' + (lean ? "Seven years of famine" : "Seven years of plenty") + '</h2><img class="pz-wall" src="' + PIC + (lean ? "wall-lean.jpg" : "wall-good.jpg") + '" alt="">' +
      '<div class="v">“' + (lean ? "And the seven thin and ill favoured kine that came up after them are seven years; and the seven empty ears blasted with the east wind shall be seven years of famine." : "The seven good kine are seven years; and the seven good ears are seven years: the dream is one.") + '”</div><div class="r">Genesis 41:' + (lean ? "27" : "26") + ' · KJV</div><button class="cta" data-act="x">Close</button>', { x: () => {} });
  }
  function courtyard(p, st) {
    const box = sc("granary.jpg");
    p.taken = p.taken || [];
    const scroll = scrollBtn("Scroll", () => '<div class="kick">On the storehouse door</div><h2>Joseph’s counsel</h2>' + verses(STORE_V) + '<div class="r">Genesis 41 · KJV</div>');
    const fl = document.createElement("div"); fl.className = "pz-fields"; $("adv-scene").appendChild(fl);
    fl.innerHTML = '<div class="lbl">The seven plenteous years · sheaves in each field</div><div class="row">' + FIELDS.map((n, i) => '<button class="fld" data-i="' + i + '"><small>Year ' + (i + 1) + "</small><b>" + n + '</b><span>🌾</span></button>').join("") + "</div>";
    const dream = put(box, null, 0.5, 0.955, 0.3, "pz-pill", "Pharaoh's dream", () => wallCard(!!p.full)); dream.innerHTML = "<span>🐄 Pharaoh’s dream</span>";
    function drawFields() { fl.querySelectorAll(".fld").forEach((b) => { const i = +b.dataset.i; b.classList.toggle("taken", !!p.taken[i]); if (p.taken[i]) b.querySelector("span").textContent = "✓ " + FIELDS[i] / 5; }); }
    fl.querySelectorAll(".fld").forEach((b) => (b.onclick = (e) => {
      e.stopPropagation(); const i = +b.dataset.i, n = FIELDS[i];
      if (p.taken[i]) { K.say("Year " + (i + 1) + ": the share is gathered."); return; }
      K.card('<div class="kick">Year ' + (i + 1) + ' of plenty</div><h2>' + n + ' sheaves</h2><p>How many sheaves will you take up for the storehouse?</p><div class="pz-choose">' +
        [1, 2, 3, 5].map((k) => '<button class="cta alt" data-act="t' + k + '">' + k + "</button>").join("") + "</div>",
        Object.fromEntries([1, 2, 3, 5].map((k) => ["t" + k, () => {
          if (k * 5 !== n) { st.misses++; K.snd("bad"); K.buzz("error"); K.say(k + " is not the fifth part of " + n + ". The scroll says how much to keep.", "Genesis 41:34", 4400); scroll.classList.add("pulse"); return; }
          p.taken[i] = 1; save(); K.snd("word"); K.buzz("light"); drawFields();
          if (FIELDS.every((_, j) => p.taken[j])) { K.say("All seven shares are gathered. Carry them into the storehouse.", "", 4000); glint([door]); }
          else K.say("A fifth part: " + k + " of " + n + " sheaves, bound into a bundle.", "", 2600);
        }])));
    }));
    drawFields();
    const door = K.hot(box, 0.6, 0.38, 0.84, 0.56, "The storehouse door", () => {
      if (p.full) { K.say("The storehouse is open, and its corn feeds the land."); return; }
      if (!FIELDS.every((_, j) => p.taken[j])) { K.say("The storehouse stands open and empty, waiting for the harvest. The scroll on its door says what to bring.", "", 4600); scroll.classList.add("pulse"); return; }
      K.sfx("stone"); p.inside = 1; save(); storeFloor(p, st);
    });
    if (p.full) return finish(p, st, box);
    if (!p.taken.length) K.say("Egypt in the years of plenty. Fields of sheaves stretch beyond the granaries.", "", 4600);
    glint([scroll].concat([...fl.querySelectorAll(".fld")]));
    idler(() => glint(FIELDS.every((_, j) => p.taken[j]) ? [door] : [scroll]));
  }
  function storeFloor(p, st) {
    const box = sc("floor.jpg");
    p.placed = p.placed || {};   // field index → [row, col, turn]
    let sel = null, turn = 0;
    const N = 4, CW = 0.17;
    const grid = put(box, null, 0.5, 0.45, CW * N, "pz-floor");
    grid.style.height = (CW * N * W) / H * 100 + "%";
    grid.innerHTML = Array.from({ length: N * N }, (_, k) => '<button class="cell" data-k="' + k + '" aria-label="Floor ' + (Math.floor(k / N) + 1) + "," + ((k % N) + 1) + '"></button>').join("");
    const cellsEl = [...grid.querySelectorAll(".cell")];
    const occ = () => { const o = {}; Object.keys(p.placed).forEach((i) => { const [r, c, t] = p.placed[i]; turnShape(shapeOf(+i), t).forEach(([y, x]) => (o[(r + y) * N + c + x] = +i)); }); return o; };
    function draw() {
      const o = occ();
      cellsEl.forEach((el, k) => { el.className = "cell" + (o[k] != null ? " full y" + (o[k] % 7) : ""); el.textContent = o[k] != null ? "🌾" : ""; });
      const t = tray(); const left = FIELDS.map((_, i) => i).filter((i) => !p.placed[i]);
      t.innerHTML = '<span class="lbl">Bundles</span><div class="pz-bundles">' + left.map((i) => {
        const cs = turnShape(shapeOf(i), sel === i ? turn : 0), h = Math.max(...cs.map((c) => c[0])) + 1, w = Math.max(...cs.map((c) => c[1])) + 1;
        return '<button class="bdl' + (sel === i ? " sel" : "") + '" data-i="' + i + '" aria-label="Bundle from year ' + (i + 1) + '" style="grid-template-columns:repeat(' + w + ',1fr);grid-template-rows:repeat(' + h + ',1fr);width:' + w * 22 + 'px;height:' + h * 22 + 'px">' +
          cs.map(([y, x]) => '<i style="grid-row:' + (y + 1) + ";grid-column:" + (x + 1) + '"></i>').join("") + "</button>";
      }).join("") + "</div>" + (sel != null ? '<span class="note">Tap the floor to set it down. Tap the bundle again to turn it.</span>' : '<span class="note">Choose a bundle.</span>');
      t.querySelectorAll(".bdl").forEach((b) => (b.onclick = () => { const i = +b.dataset.i; if (sel === i) turn = (turn + 1) % 4; else { sel = i; turn = 0; } K.sfx("click"); draw(); }));
    }
    function fits(i, r, c, t, o) { return turnShape(shapeOf(i), t).every(([y, x]) => r + y < N && c + x < N && o[(r + y) * N + c + x] == null); }
    cellsEl.forEach((el, k) => (el.onclick = (e) => {
      e.stopPropagation(); cellsEl.forEach((x) => x.classList.remove("glint"));
      const o = occ(), r = Math.floor(k / N), c = k % N;
      if (o[k] != null && sel == null) { delete p.placed[o[k]]; save(); K.sfx("click"); draw(); return; }   // take a bundle back up
      if (sel == null) { K.say("Choose a bundle below first."); return; }
      const cs = turnShape(shapeOf(sel), turn), [ay, ax] = cs[0];   // the bundle's first square goes where you tap
      const r0 = r - ay, c0 = c - ax;
      if (r0 < 0 || c0 < 0 || !fits(sel, r0, c0, turn, o)) { K.snd("bad"); K.say("It does not fit there.", "", 1600); return; }
      p.placed[sel] = [r0, c0, turn]; save(); sel = null; turn = 0; K.sfx("stone"); K.buzz("light"); draw();
      if (Object.keys(p.placed).length === 7) full();
    }));
    /* a hint that shows where the next bundle goes, if the floor can still be filled */
    function solve(placed) {
      const o = {}; Object.keys(placed).forEach((i) => { const [r, c, t] = placed[i]; turnShape(shapeOf(+i), t).forEach(([y, x]) => (o[(r + y) * N + c + x] = 1)); });
      const left = FIELDS.map((_, i) => i).filter((i) => !placed[i]); const out = {};
      function rec() {
        let k = 0; while (k < N * N && o[k]) k++; if (k === N * N) return true;
        const r = Math.floor(k / N), c = k % N;
        for (const i of left) { if (out[i]) continue; for (let t = 0; t < 4; t++) {
          const cs = turnShape(shapeOf(i), t), [ay, ax] = cs[0], r0 = r - ay, c0 = c - ax;
          if (r0 < 0 || c0 < 0 || !cs.every(([y, x]) => r0 + y < N && c0 + x < N && c0 + x >= 0 && !o[(r0 + y) * N + c0 + x])) continue;
          cs.forEach(([y, x]) => (o[(r0 + y) * N + c0 + x] = 1)); out[i] = [r0, c0, t];
          if (rec()) return true;
          cs.forEach(([y, x]) => delete o[(r0 + y) * N + c0 + x]); delete out[i];
        } }
        return false;
      }
      return rec() ? out : null;
    }
    st.packHint = () => {
      const s = solve(p.placed); if (!s) return "This arrangement cannot be finished. Tap a bundle on the floor to take it back up.";
      const i = sel != null && s[sel] ? sel : +Object.keys(s)[0]; sel = i; turn = s[i][2]; draw();
      const [r, c, t] = s[i]; turnShape(shapeOf(i), t).forEach(([y, x]) => cellsEl[(r + y) * N + c + x].classList.add("glint"));
      return "The chosen bundle, turned like this, goes where the floor glows.";
    };
    function full() {
      p.full = 1; save(); K.snd("level"); K.buzz("success"); grid.classList.add("done");
      K.say("“And Joseph gathered corn as the sand of the sea, very much, until he left numbering; for it was without number.”", "Genesis 41:49", 6000);
      setTimeout(() => { if (!K.root()) return; tray().remove(); courtyard(p, st); }, 5600);
    }
    draw();
    backBtn("Courtyard", () => { tray().remove(); p.inside = 0; save(); courtyard(p, st); });
    if (!Object.keys(p.placed).length) K.say("Inside the storehouse. Lay all seven bundles on the floor so that every one fits.", "", 4600);
  }
  function finish(p, st, box) {
    const t = $("pz-tray"); if (t) t.remove();
    setTimeout(() => { if (!K.root()) return; wallCard(true); }, 600);
    setTimeout(() => {
      if (!K.root()) return; box.classList.add("pz-glow"); K.sfx("stone");
      K.say("The seven lean years came, as the dream foretold. “And Joseph opened all the storehouses.”", "Genesis 41:56", 6000);
      setTimeout(() => K.root() && K.sealDone("joseph", stats(st, 240)), 5600);
    }, 1400);
  }

  /* ---------- register the seals ---------- */
  Lamp.adv.register("noah", { relic: "olive", title: "The Ark and the Dove", run: noah });
  Lamp.adv.register("abram", { relic: "peg", title: "The Road to Bethel", run: abram });
  Lamp.adv.register("provide", { relic: "horn", title: "The Ram in the Thicket", run: provide });
  Lamp.adv.register("ladder", { relic: "anointed", title: "The Stone Pillar", run: ladder });
  Lamp.adv.register("joseph", { relic: "colours", title: "The Storehouses", run: joseph });
})();
