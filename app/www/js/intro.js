/* Lamp — start screen (see css/intro.css for the look).
   Shown each time the app opens. The first time, the full version (verse, then Richard's film of the
   lamp flying into the gate, about 13 s); after that, the quick version (the last 3.5 s of the film). Lamp.state.intro remembers that the full
   one has been seen (also mirrored to iCloud with the rest of the progress). */
(function () {
  "use strict";
  const Lamp = (window.Lamp = window.Lamp || {});
  const WORDS = ["Thy word is a lamp", "unto my feet,", "and a light", "unto my path."];
  const GATE = { x: 0.5, y: 0.5 };       // the Eastern Gate in the night Jerusalem painting (title-gate.jpg), fraction of the picture
  const WICK = { x: 0.844, y: 0.544 };   // the wick of the painted lamp in Richard's lamp picture (title.jpg)
  const LAMPBOX = { x: 0.0685, y: 0.269, w: 0.882, h: 0.3875 };   // where the cut-out lamp (lamp-cut.png) sits over the painted one
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
  function music(which, offset) {
    if (!Lamp.state.settings.sound || !Lamp.audioOut) return;
    const a = Lamp.audioOut(); if (!a) return;
    const go = () => { const s = a.ctx.createBufferSource(); s.buffer = bufs[which]; s.connect(a.out); s.start(0, offset || 0); };
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
  function placeGate() { const g = gatePoint(); stage.style.setProperty("--gx", g.x + "px"); stage.style.setProperty("--gy", g.y + "px");
    const r = stage.getBoundingClientRect(), k = Math.max(r.width / PIC.w, r.height / PIC.h), ox = (r.width - PIC.w * k) / 2, oy = (r.height - PIC.h * k) / 2;
    stage.style.setProperty("--wx", (ox + WICK.x * PIC.w * k) + "px"); stage.style.setProperty("--wy", (oy + WICK.y * PIC.h * k) + "px");
    const L = $("in-lamp"); if (L) { L.style.left = (ox + LAMPBOX.x * PIC.w * k) + "px"; L.style.top = (oy + LAMPBOX.y * PIC.h * k) + "px"; L.style.width = (LAMPBOX.w * PIC.w * k) + "px"; L.style.height = (LAMPBOX.h * PIC.h * k) + "px"; } }

  const sfx = (name, vol, delay) => setTimeout(() => { try { if (Lamp.score && Lamp.state.settings.sound !== false) Lamp.score.sfx("fsy-sfx-" + name, vol); } catch (e) {} }, delay || 0);
  function fly(ms) {
    const lamp = $("in-lamp"), r = lamp.getBoundingClientRect(), st = stage.getBoundingClientRect(), g = gatePoint();
    placeGate(); stage.classList.add("fly");
    if (!lamp.animate) return;
    const cx = r.left - st.left + r.width / 2, cy = r.top - st.top + r.height / 2, dx = g.x - cx, dy = g.y - cy;
    /* like a plane: it moves off forward (away from you, so it shrinks at once), drifts right and up, then banks into the turn
       so the flame leads and the handle trails, and goes in through the gate */
    const P = "perspective(900px) ";
    lamp.animate([
      { transform: P + "translate(0,0) scale(1) rotateY(0deg) rotateZ(0deg)", opacity: 1 },
      { transform: P + "translate(" + (dx * 0.1 + 30) + "px," + (dy * 0.08 - 20) + "px) scale(.66) rotateY(-12deg) rotateZ(-6deg)", opacity: 1, offset: 0.22 },
      { transform: P + "translate(" + (dx * 0.3 + 60) + "px," + (dy * 0.3 - 10) + "px) scale(.46) rotateY(-42deg) rotateZ(-38deg)", opacity: 1, offset: 0.48 },
      { transform: P + "translate(" + (dx * 0.62 + 30) + "px," + (dy * 0.62) + "px) scale(.28) rotateY(-28deg) rotateZ(-70deg)", opacity: 1, offset: 0.7 },
      { transform: P + "translate(" + (dx * 0.92) + "px," + (dy * 0.93) + "px) scale(.09) rotateY(0deg) rotateZ(-84deg)", opacity: 1, offset: 0.92 },
      { transform: P + "translate(" + dx + "px," + dy + "px) scale(.015) rotateY(0deg) rotateZ(-86deg)", opacity: 0 },
    ], { duration: ms, easing: "cubic-bezier(.4,0,.7,.5)", fill: "forwards" });
    sfx("wings", 0.55, 0); sfx("wingsflap", 0.45, ms * 0.45);
  }

  function arrive(quiet) { stage.classList.add("gone"); Lamp.haptic && Lamp.haptic("success"); if (!quiet) { sfx("door", 0.9, 0); sfx("shofar", 0.6, 700); } }

  /* ---------- Richard's film of the flight (video/start/gate.mp4, 8 s, with its own sound): the lamp lifts, banks away
     and goes in as the gate opens (doors open at about 5 s, wide by 6.9 s). The quick replay plays its last 3.5 s. ---------- */
  const FILM = { open: 6.9, quickFrom: 4.5, music: 3.65 };   // music: where in the "full" cue the film starts, so the cue's hit (8.6 s) lands on the door (4.95 s)
  let filmOn = false;
  function film(quick, fallback) {
    const v = $("in-film"); if (!v) { fallback(); return; }
    let opened = false, done = false;
    const open = () => { if (opened || !stage) return; opened = true; arrive(true); };
    const end = () => { if (done || !stage) return; done = true; open(); toTitle(); };
    const fail = () => { if (filmOn || done) return; stage.classList.remove("film"); fallback(); };
    v.onerror = fail;
    v.ontimeupdate = () => { if (v.currentTime >= FILM.open) open(); };
    v.onended = end;
    placeGate(); stage.classList.add("fly", "film");
    try { v.currentTime = quick ? FILM.quickFrom : 0; } catch (e) {}
    const pr = v.play();
    if (pr && pr.then) pr.then(() => { filmOn = true; }, fail); else filmOn = true;
    later(end, (quick ? 8.3 - FILM.quickFrom : 8.3) * 1000 + 1500);   // whatever happens, the title comes
  }
  function stopFilm() { const v = $("in-film"); if (v) { try { v.pause(); } catch (e) {} v.ontimeupdate = v.onended = v.onerror = null; } }
  function toTitle() {
    stage.classList.add("title");
    if (!Lamp.state.intro || Lamp.state.introAgain) { Lamp.state.intro = true; delete Lamp.state.introAgain; Lamp.save(); }
    setTimeout(() => { const b = $("in-begin"); if (b) b.focus({ preventScroll: true }); }, 900);
  }

  function light() {
    if (started) return; started = true;
    const quick = seen();
    stage.classList.add("lit"); embers.start(); sfx("harp", 0.45, 200);
    Lamp.haptic && Lamp.haptic("light");
    if (quick) {
      stage.classList.add("quick");
      later(() => stage.classList.add("reveal"), 120);
      later(() => { music("full", FILM.music + FILM.quickFrom); film(true, () => { fly(2200); later(arrive, 200); later(toTitle, 460); }); }, 240);
      return;
    }
    later(() => music("full"), 5400 - FILM.music * 1000);   // the cue's swell and hit land on the gate opening in the film
    const spans = stage.querySelectorAll(".in-verse span:not(.in-ref)");
    spans.forEach((s, i) => later(() => s.classList.add("on"), 1400 + i * 650));
    later(() => stage.querySelector(".in-ref").classList.add("on"), 1400 + spans.length * 650 + 200);
    later(() => stage.classList.add("reveal"), 4600);
    later(() => film(false, () => { fly(2800); later(arrive, 2800); later(toTitle, 3100); }), 5400);   // music hit at 5400 + 4950
  }
  function skip() {
    timers.forEach(clearTimeout); timers = []; started = true; stopFilm(); stage.classList.remove("film");
    const lamp = $("in-lamp"); if (lamp.getAnimations) lamp.getAnimations().forEach((a) => a.finish());
    placeGate(); stage.classList.add("lit", "reveal", "fly", "gone"); toTitle(); embers.start();
  }
  function close() {
    if (!stage || stage.classList.contains("closing")) return;
    stage.classList.add("closing");
    setTimeout(() => {
      embers.stop(); timers.forEach(clearTimeout); stopFilm();
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
      /* embers rise from the wick: the painted lamp's wick before the flight, the flying lamp's wick during it */
      const L = $("in-lamp"), st = stage.getBoundingClientRect(); let x, y;
      if (stage.classList.contains("fly") && L) { const r = L.getBoundingClientRect(); x = r.left - st.left + r.width * 0.878; y = r.top - st.top + r.height * 0.6; }
      else { x = parseFloat(stage.style.getPropertyValue("--wx")) || st.width * 0.84; y = (parseFloat(stage.style.getPropertyValue("--wy")) || st.height * 0.54) - 30; }
      return { x: x + (Math.random() - 0.5) * 10, y, vx: (Math.random() - 0.5) * 0.35, vy: -(0.35 + Math.random() * 0.9), life: 0, max: 180 + Math.random() * 200, r: 0.6 + Math.random() * 1.6 };
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
      '<div id="in-wickglow" aria-hidden="true"></div>' +
      '<canvas class="in-layer" id="in-embers"></canvas>' +
      '<div class="in-layer" id="in-gatepaint"></div>' +
      '<div id="in-gate"></div>' +
      '<div id="in-lamp" aria-hidden="true"><div id="in-glow"></div><img id="in-clay" src="img/start/lamp-cut.png" alt=""></div>' +
      '<video class="in-layer" id="in-film" src="video/start/gate.mp4" playsinline webkit-playsinline preload="auto" aria-hidden="true"></video>' +
      '<div class="in-layer" id="in-open"></div>' +
      '<div class="in-layer" id="in-shade"></div>' +
      '<div class="in-prompt" aria-hidden="true">Tap to light the lamp<small>' + (G ? "The Seven Candles" : "Lamp · Bible Word Puzzle Adventure") + "</small></div>" +
      '<div class="in-verse" aria-live="polite">' + WORDS.map((w) => "<span>" + w + "</span>").join(" ") + '<span class="in-ref">Psalm 119:105</span></div>' +
      (G ? '<div class="in-title" aria-label="Lamp, The Seven Candles"><div class="in-lamp-word" aria-hidden="true">LAMP</div><div class="in-rule"></div><div class="in-sub">The Seven<br>Candles</div><div class="in-based">Based on <i>The Final Seven Years</i><br>by Richard J. Allinson</div></div>'
         : '<div class="in-title" aria-label="Lamp, Bible Word Puzzle Adventure"><div class="in-lamp-word" aria-hidden="true">LAMP</div><div class="in-rule"></div><div class="in-sub">Bible Word Puzzle<br>Adventure</div></div>') +
      '<div class="in-titleblock"><div class="in-tag">' + (G ? "I have set watchmen upon thy walls, O Jerusalem.<br>" + (back ? "Your watch continues." : "Your watch begins.") : "Thy word is a lamp unto my feet.<br>" + (back ? "Your journey continues." : "Your journey begins.")) + "</div></div>" +
      '<button class="in-begin" id="in-begin">' + (G ? "Enter" : back ? "Continue the journey" : "Begin the journey") + "</button>" +
      (G ? "" : '<div class="in-promo">Coming soon: <b>The Final Seven Years</b><br>A journey through Daniel and Revelation</div>') +
      '<div class="in-credit">Created by Richard J. Allinson</div>' +
      '<button class="in-skip" id="in-skip" aria-label="Skip">Skip</button>' +
      '<button class="in-sr" id="in-light">Light the lamp</button>';
    document.body.appendChild(el);
    stage = el; Lamp.introOn = true; started = false; timers = [];
    embers.init(); placeGate();
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
