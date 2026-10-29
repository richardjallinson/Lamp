/* Lamp — start screen (see css/intro.css for the look).
   Shown each time the app opens. The first time, the full version (about 9 s, music hit at 8.6 s);
   after that, the quick version (about 2 s, hit at 2.0 s). Lamp.state.intro remembers that the full
   one has been seen (also mirrored to iCloud with the rest of the progress). */
(function () {
  "use strict";
  const Lamp = (window.Lamp = window.Lamp || {});
  const WORDS = ["Thy word is a lamp", "unto my feet,", "and a light", "unto my path."];
  const GATE = { x: 0.5, y: 0.5 };   // the Eastern Gate in the night Jerusalem painting (fraction of the picture)
  const PIC = { w: 1080, h: 1920 };
  let stage = null, timers = [], started = false, bufs = {}, decoding = false;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  const $ = (id) => document.getElementById(id);
  const hasProgress = () => Object.keys(Lamp.state.progress || {}).some((k) => Lamp.state.progress[k] > 0);
  const seen = () => !!Lamp.state.intro || (hasProgress() && !Lamp.state.introAgain);   // introAgain: tester tools replay

  /* ---------- music: decoded while the screen waits, played on the tap ---------- */
  function decode() {
    if (decoding || !window.LAMP_INTRO_SOUNDS || !Lamp.audioOut) return;
    const a = Lamp.audioOut(); if (!a) return;
    decoding = true;
    Object.keys(window.LAMP_INTRO_SOUNDS).forEach((k) => {
      try {
        const bin = atob(window.LAMP_INTRO_SOUNDS[k].split(",")[1]), u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        a.ctx.decodeAudioData(u8.buffer, (b) => { bufs[k] = b; }, () => {});
      } catch (e) {}
    });
  }
  function music(which) {
    if (!Lamp.state.settings.sound || !Lamp.audioOut) return;
    const a = Lamp.audioOut(); if (!a) return;
    const go = () => { const s = a.ctx.createBufferSource(); s.buffer = bufs[which]; s.connect(a.out); s.start(); };
    if (bufs[which]) { go(); return; }
    decode();
    const t0 = Date.now(), wait = setInterval(() => {      // still decoding: start as soon as it's ready, if it's not too late
      if (bufs[which]) { clearInterval(wait); if (Date.now() - t0 < 400) go(); }
      else if (Date.now() - t0 > 400) clearInterval(wait);
    }, 20);
  }

  Lamp.playCue = music;   // the adventure plays the short cue when a chamber opens

  /* ---------- the gate's position on this screen (the painting is drawn with background-size: cover) ---------- */
  function gatePoint() {
    const r = stage.getBoundingClientRect(), k = Math.max(r.width / PIC.w, r.height / PIC.h);
    return { x: (r.width - PIC.w * k) / 2 + GATE.x * PIC.w * k, y: (r.height - PIC.h * k) / 2 + GATE.y * PIC.h * k };
  }
  function placeGate() { const g = gatePoint(); stage.style.setProperty("--gx", g.x + "px"); stage.style.setProperty("--gy", g.y + "px"); }

  function fly(ms) {
    const lamp = $("in-lamp"), r = lamp.getBoundingClientRect(), st = stage.getBoundingClientRect(), g = gatePoint();
    placeGate(); stage.classList.add("fly");
    if (!lamp.animate) return;
    const dx = g.x - (r.left - st.left + r.width / 2), dy = g.y - (r.top - st.top + r.height / 2), B = "translate(-50%,-40%) ";
    lamp.animate([
      { transform: B + "translate(0,0) scale(1) rotate(0)", opacity: 1 },
      { transform: B + "translate(" + (dx * 0.1 + 18) + "px," + dy * 0.16 + "px) scale(.78) rotate(-5deg)", opacity: 1, offset: 0.22 },
      { transform: B + "translate(" + (dx * 0.5 + 22) + "px," + dy * 0.58 + "px) scale(.34) rotate(2deg)", opacity: 1, offset: 0.6 },
      { transform: B + "translate(" + (dx * 0.92 + 4) + "px," + dy * 0.93 + "px) scale(.1) rotate(0)", opacity: 1, offset: 0.88 },
      { transform: B + "translate(" + dx + "px," + dy + "px) scale(.02)", opacity: 0 },
    ], { duration: ms, easing: "cubic-bezier(.45,0,.75,.6)", fill: "forwards" });
  }

  function arrive() { stage.classList.add("gone"); Lamp.haptic && Lamp.haptic("success"); }
  function toTitle() {
    stage.classList.add("title");
    if (!Lamp.state.intro || Lamp.state.introAgain) { Lamp.state.intro = true; delete Lamp.state.introAgain; Lamp.save(); }
    setTimeout(() => { const b = $("in-begin"); if (b) b.focus({ preventScroll: true }); }, 900);
  }

  function light() {
    if (started) return; started = true;
    const quick = seen();
    stage.classList.add("lit"); embers.start();
    Lamp.haptic && Lamp.haptic("light");
    if (quick) {
      music("quick"); stage.classList.add("quick");
      later(() => stage.classList.add("reveal"), 120);
      later(() => fly(1760), 240);
      later(arrive, 2000);
      later(toTitle, 2300);
      return;
    }
    music("full");
    const spans = stage.querySelectorAll(".in-verse span:not(.in-ref)");
    spans.forEach((s, i) => later(() => s.classList.add("on"), 1400 + i * 650));
    later(() => stage.querySelector(".in-ref").classList.add("on"), 1400 + spans.length * 650 + 200);
    later(() => stage.classList.add("reveal"), 4600);
    later(() => fly(1760), 6800);
    later(arrive, 8560);
    later(toTitle, 8900);
  }
  function skip() {
    timers.forEach(clearTimeout); timers = []; started = true;
    const lamp = $("in-lamp"); if (lamp.getAnimations) lamp.getAnimations().forEach((a) => a.finish());
    placeGate(); stage.classList.add("lit", "reveal", "fly", "gone"); toTitle(); embers.start();
  }
  function close() {
    if (!stage || stage.classList.contains("closing")) return;
    stage.classList.add("closing");
    setTimeout(() => {
      embers.stop(); timers.forEach(clearTimeout);
      stage.remove(); stage = null;
      Lamp.introOn = false; Lamp.musicUpdate && Lamp.musicUpdate();
      Lamp.afterIntro && Lamp.afterIntro();
    }, 750);
  }

  /* ---------- embers: warm sparks drifting up from the flame, trailing it in flight ---------- */
  const embers = (function () {
    let cv, c, ps = [], run = false, raf = 0, W = 0, H = 0;
    function size() { const dpr = Math.min(window.devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function spawn() {
      const f = $("in-flame").getBoundingClientRect(), st = stage.getBoundingClientRect();
      return { x: f.left - st.left + f.width * (0.44 + Math.random() * 0.12), y: f.top - st.top + f.height * 0.14, vx: (Math.random() - 0.5) * 0.35, vy: -(0.35 + Math.random() * 0.9), life: 0, max: 180 + Math.random() * 200, r: 0.6 + Math.random() * 1.6 };
    }
    function tick() {
      if (!stage) return;
      c.clearRect(0, 0, W, H);
      if (run && !stage.classList.contains("gone") && ps.length < 90 && Math.random() < (stage.classList.contains("fly") ? 0.9 : 0.5)) ps.push(spawn());
      ps = ps.filter((p) => {
        p.life++; p.x += p.vx + Math.sin((p.life + p.r * 40) / 22) * 0.25; p.y += p.vy;
        const a = 1 - p.life / p.max; if (a <= 0) return false;
        c.beginPath(); c.fillStyle = "rgba(255," + Math.round(190 + 50 * a) + "," + Math.round(110 * a) + "," + (a * 0.85).toFixed(3) + ")";
        c.shadowColor = "rgba(255,200,90,.9)"; c.shadowBlur = 8; c.arc(p.x, p.y, p.r, 0, 6.283); c.fill(); return true;
      });
      if (run || ps.length) raf = requestAnimationFrame(tick);
    }
    return {
      init() { cv = $("in-embers"); c = cv.getContext("2d"); window.addEventListener("resize", () => { if (stage) { size(); placeGate(); } }); },
      start() { if (run || matchMedia("(prefers-reduced-motion: reduce)").matches) return; size(); run = true; cancelAnimationFrame(raf); tick(); },
      stop() { run = false; ps = []; cancelAnimationFrame(raf); },
    };
  })();

  /* ---------- build the screen ---------- */
  Lamp.showIntro = function () {
    const back = hasProgress() || Lamp.state.intro, G = !!Lamp.gameOnly;
    const el = document.createElement("div");
    el.id = "intro"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Lamp");
    el.innerHTML =
      '<div class="in-layer" id="in-paint"></div>' +
      '<canvas class="in-layer" id="in-embers"></canvas>' +
      '<div id="in-gate"></div>' +
      '<div id="in-lamp" aria-hidden="true"><div id="in-glow"></div><img id="in-clay" src="img/start/clay-lamp.webp" alt=""><img id="in-warm" src="img/start/clay-lamp-warm.webp" alt="">' +
      '<div id="in-flame"><img src="img/start/flame.webp" alt=""></div></div>' +
      '<div class="in-layer" id="in-open"></div>' +
      '<div class="in-layer" id="in-shade"></div>' +
      '<div class="in-prompt" aria-hidden="true">Tap to light the lamp<small>' + (G ? "The Final Seven Years" : "Lamp · Bible Word Puzzle Adventure") + "</small></div>" +
      '<div class="in-verse" aria-live="polite">' + WORDS.map((w) => "<span>" + w + "</span>").join(" ") + '<span class="in-ref">Psalm 119:105</span></div>' +
      (G ? '<div class="in-title" aria-label="Lamp, The Final Seven Years"><div class="in-lamp-word" aria-hidden="true">LAMP</div><div class="in-rule"></div><div class="in-sub">The Final<br>Seven Years</div></div>'
         : '<div class="in-title" aria-label="Lamp, Bible Word Puzzle Adventure"><div class="in-lamp-word" aria-hidden="true">LAMP</div><div class="in-rule"></div><div class="in-sub">Bible Word Puzzle<br>Adventure</div></div>') +
      '<div class="in-titleblock"><div class="in-tag">' + (G ? "I have set watchmen upon thy walls, O Jerusalem.<br>" + (back ? "Your watch continues." : "Your watch begins.") : "Thy word is a lamp unto my feet.<br>" + (back ? "Your journey continues." : "Your journey begins.")) + "</div></div>" +
      '<button class="in-begin" id="in-begin">' + (G ? "Enter" : back ? "Continue the journey" : "Begin the journey") + "</button>" +
      (G ? "" : '<div class="in-promo">Coming soon: <b>The Final Seven Years</b><br>A journey through Daniel and Revelation</div>') +
      '<div class="in-credit">Created by Richard J. Allinson</div>' +
      '<button class="in-skip" id="in-skip" aria-label="Skip">Skip</button>' +
      '<button class="in-sr" id="in-light">Light the lamp</button>';
    document.body.appendChild(el);
    stage = el; Lamp.introOn = true; started = false; timers = [];
    embers.init();
    el.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      if (!started) light(); else if (!el.classList.contains("title")) skip();
    });
    $("in-skip").onclick = (e) => { e.stopPropagation(); skip(); };
    $("in-light").onclick = (e) => { e.stopPropagation(); light(); };
    $("in-begin").onclick = (e) => { e.stopPropagation(); close(); };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.querySelector(".in-prompt").textContent = "Tap to begin"; }
    decode();
  };
})();
