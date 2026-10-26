/* Lamp — TESTER TOOLS, for Richard while building. NOT for the App Store.
   ┌──────────────────────────────────────────────────────────────┐
   │  Before the App Store build: set TESTER = false (one line).  │
   └──────────────────────────────────────────────────────────────┘
   With TESTER on:
   - a "Skip" button floats at the top whenever there is something to get past: a word level, a story card,
     a story seal, the Garden Gate, the start screen. It finishes that step at once (no oil is earned by skipping).
   - Settings shows a "Tester tools" group: Skip button on/off, unlock all stories, fill the lamp, jump to the
     Garden Gate, mark the first three stories done, reset the adventure, replay the full start screen. */
(function () {
  "use strict";
  const TESTER = false;
  const Lamp = (window.Lamp = window.Lamp || {});
  Lamp.tester = TESTER;
  if (!TESTER) return;
  const $ = (id) => document.getElementById(id);
  const D = window.LAMP_DATA;

  /* ---------- the Skip button ---------- */
  const btn = document.createElement("button");
  btn.id = "devskip"; btn.type = "button"; btn.innerHTML = "⏭ Skip"; btn.setAttribute("aria-label", "Tester: skip this step");
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(btn));

  function where() {
    if ($("reveal")) return "reveal";
    if ($("narr")) return "narr";
    if ($("intro") && !$("intro").classList.contains("closing")) return "intro";
    if ($("adv")) return "adv";
    if ($("level") && !$("level").hidden) return "level";
    return null;
  }
  function refresh() {
    const on = Lamp.state.settings.devskip !== false && where();
    btn.classList.toggle("on", !!on);
  }
  setInterval(refresh, 400);

  function skipLevel() {
    const sheetBtn = document.querySelector("#level .sheet [data-act]");
    if (sheetBtn) { sheetBtn.click(); return; }
    const T = Lamp._test, G = T && T.G; if (!G) return;
    const lv = G.mode === "daily" ? G.daily : G.story.levels[G.lv];
    G.lvHint = (G.lvHint || 0) + 1;   // skipped levels never count as flawless
    if (lv.recall) for (let k = G.built; k < T.VERSE.length; k++) T.tapTile(k);
    else (lv.hide || []).forEach((w) => { if (!G.found.includes(w)) T.spell(w); });
    /* one tap = on to the next level (the story-complete card is left for you, with its seal) */
    const t0 = Date.now(), wait = setInterval(() => {
      const next = document.querySelector('#level .sheet [data-act="next"]'), card = document.querySelector("#level .sheet");
      if (card) { clearInterval(wait); if (next && !document.querySelector('#level .sheet [data-act="seal"]') && !/Story complete/i.test(card.textContent)) next.click(); }
      else if (Date.now() - t0 > 3000) clearInterval(wait);
    }, 100);
  }
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const w = where();
    if (w === "reveal") { $("reveal").click(); setTimeout(() => $("reveal") && $("reveal").click(), 950); }
    else if (w === "narr") { const b = document.querySelector("#narr .ncta"); b && b.click(); }
    else if (w === "intro") { const s = $("in-skip"), b = $("in-begin"); if ($("intro").classList.contains("title")) b && b.click(); else if ($("intro").classList.contains("lit")) s && s.click(); else { const l = $("in-light"); l && l.click(); } }
    else if (w === "adv") { Lamp.adv && Lamp.adv.devSkip(); }
    else if (w === "level") skipLevel();
    Lamp.haptic && Lamp.haptic("light");
  });

  /* ---------- Settings → Tester tools ---------- */
  Lamp.testerHTML = function () {
    const st = Lamp.state.settings;
    const row = (act, title, small) => '<button class="row" data-dev="' + act + '"><span class="l"><b>' + title + "</b><small>" + small + "</small></span></button>";
    return '<div class="group tester"><div class="row"><span class="l"><b>Tester tools</b><small>For testing only. Turned off before the App Store.</small></span></div>' +
      '<div class="row"><span class="l"><b>Skip button</b><small>Finish any level, card or puzzle with one tap.</small></span><button class="switch" role="switch" aria-checked="' + (st.devskip !== false) + '" data-set="devskip"></button></div>' +
      row("unlock", "Unlock all stories", Lamp.state.unlocked ? "All 66 books are open." : "Open every book without buying (test only).") +
      row("oil", "Fill the lamp", "Add 10 drops of oil.") +
      '<div class="row"><span class="l"><b>Open every story</b><small>Ignore the adventure order (puzzles still work).</small></span><button class="switch" role="switch" aria-checked="' + !!Lamp.state.devOpen + '" data-dev="open"></button></div>' +
      row("first3", "Finish Creation, Eden and the Fall", "Marks the first three stories done, so the seals and the gate are ready.") +
      row("gate", "Go to the Garden Gate", "Opens the chamber straight away.") +
      row("advreset", "Reset the adventure only", "Clears relics, seals and the gate. Stories stay done.") +
      row("intro", "Show the full start screen again", "Plays the long version next time the app opens.") +
      "</div>";
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-dev]"); if (!b) return;
    const a = b.dataset.dev, s = Lamp.state, toast = (t) => Lamp.mainToast && Lamp.mainToast(t);
    if (a === "unlock") { s.unlocked = true; Lamp.save(); toast("All stories unlocked (test)"); }
    if (a === "open") { s.devOpen = !s.devOpen; Lamp.save(); toast(s.devOpen ? "Every story is open (test)" : "Stories open in order again"); }
    if (a === "oil") { s.oil += 10; Lamp.save(); toast("+10 oil"); }
    if (a === "first3") {
      ["creation", "eden", "fall"].forEach((id) => { const st = D.stories.find((x) => x.id === id); s.progress[id] = st.levels.length; if (!s.completed[id]) s.completed[id] = Lamp.today(); });
      Lamp.save(); toast("Creation, Eden and the Fall marked done");
    }
    if (a === "gate") { Lamp.adv && Lamp.adv.openGate(); }
    if (a === "advreset") { Lamp.adv && Lamp.adv.devReset(); toast("Adventure reset"); }
    if (a === "intro") { s.intro = false; s.introAgain = true; Lamp.save(); toast("The full start screen plays next time the app opens"); }
    Lamp.render && Lamp.render();
  });
})();
