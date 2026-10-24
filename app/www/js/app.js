/* Lamp — main screens: Journey (66 books), a book's stories, Today, Verses gathered, Settings, Unlock. */
(function () {
  "use strict";
  const Lamp = window.Lamp, D = window.LAMP_DATA, ICON = Lamp.ICON;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const VERSION = "1.0 (1)";
  const OT = D.books.slice(0, 39), NT = D.books.slice(39);
  const byBook = {};
  D.stories.forEach((s) => (byBook[s.book] = byBook[s.book] || []).push(s));
  const FREE_STORIES = D.stories.filter((s) => s.free).length;

  let tab = "journey", book = null, gatheredMode = "verses", query = "";

  const isOpen = (s) => s.free || Lamp.state.unlocked;
  const levelsDone = (s) => Math.min(Lamp.state.progress[s.id] || 0, s.levels.length);
  const isDone = (s) => !!Lamp.state.completed[s.id];
  const bookName = (b) => (b === "Psalms" ? "Psalms" : b);
  const imgStyle = (s, extra) => (s.img ? "background-image:url(img/" + s.img + ");" : "") + (extra || "");

  function applySettings() {
    const st = Lamp.state.settings, r = document.documentElement;
    r.classList.toggle("text-s", st.text === "s"); r.classList.toggle("text-l", st.text === "l");
    r.classList.toggle("cb", !!st.cb);
  }

  Lamp.render = function () {
    applySettings();
    document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-current", t.dataset.tab === tab ? "page" : "false"));
    const v = $("view");
    if (tab === "journey") v.innerHTML = book ? bookView(book) : journey();
    else if (tab === "today") v.innerHTML = today();
    else if (tab === "gathered") v.innerHTML = gathered();
    else v.innerHTML = settings();
    wire();
  };
  Lamp.refresh = () => { if ($("level").hidden) Lamp.render(); };

  /* ---------- pieces ---------- */
  function pills() {
    const s = Lamp.streak();
    return '<div class="pills"><span class="pill streak' + (s.lit ? "" : " dim") + '" aria-label="Lamp streak">' + ICON.lamp +
      (s.n ? (s.n === 1 ? "Day 1" : s.n + " days") : "Light it") + '</span><span class="pill" aria-label="Lamp oil">' + ICON.oil + Lamp.state.oil + "</span></div>";
  }
  function weekRow() {
    const set = new Set(Lamp.state.days), s = Lamp.streak(), t = Lamp.today(), w0 = Lamp.weekOf(t);
    let h = '<div class="week" aria-label="This week">';
    for (let i = 0; i < 7; i++) {
      const k = Lamp.dayAdd(w0, i), cls = set.has(k) ? "on" : s.restDays.includes(k) ? "rest" : k === t ? "now" : k > t ? "later" : "";
      h += '<span class="wd ' + cls + '"><i>' + (set.has(k) ? ICON.lamp : s.restDays.includes(k) ? "☾" : "") + "</i>" + "SMTWTFS"[i] + "</span>";
    }
    return h + "</div>";
  }
  function ring(done, total) {
    const r = 14, c = 2 * Math.PI * r, f = total ? done / total : 0;
    return '<svg class="ring" viewBox="0 0 34 34" aria-hidden="true"><circle class="bg" cx="17" cy="17" r="' + r + '"/>' +
      (f > 0 ? '<circle class="fg" cx="17" cy="17" r="' + r + '" stroke-dasharray="' + (c * f).toFixed(1) + " " + c.toFixed(1) + '"/>' : "") + "</svg>";
  }
  function nextStory() {
    const last = D.stories.find((s) => s.id === Lamp.state.last);
    if (last && !isDone(last)) return last;
    return D.stories.find((s) => !isDone(s)) || D.stories[0];
  }

  /* ---------- Journey ---------- */
  function journey() {
    const st = nextStory(), done = levelsDone(st), open = isOpen(st);
    const total = Object.keys(Lamp.state.completed).length, s = Lamp.streak();
    const dailyDone = !!Lamp.state.daily[Lamp.today()];
    let h = '<div class="head"><div class="brand">Lamp</div>' + pills() + "</div>";
    h += '<p class="lede">' + (total ? total + " of " + D.stories.length + " stories complete." : "Rebuild the Bible, verse by verse, until you know it by heart.") + "</p>";
    h += '<button class="hero" data-story="' + st.id + '" style="' + imgStyle(st) + '">' +
      '<span class="kick">' + (done ? "Continue · " : open ? "Start · " : "Locked · ") + esc(st.book) + "</span><b>" + esc(st.title) + "</b>" +
      "<small>" + esc(st.verses[st.key].ref) + " · " + (done ? "level " + (done + 1) + " of " + st.levels.length : st.levels.length + " levels") + "</small>" +
      '<span class="bar-prog"><i style="width:' + Math.round((100 * done) / st.levels.length) + '%"></i></span>' +
      '<span class="go">' + (open ? (done ? "Continue" : "Play") : "Unlock") + "</span></button>";
    h += '<button class="daily" data-go="today"><span class="ic">' + ICON.lamp + "</span><span><b>Today’s verse</b><small>" +
      (dailyDone ? "Solved today. A new verse arrives tomorrow." : "Daily verse #" + Lamp.dailyNumber() + " · the same puzzle for everyone") + '</small></span><span class="chev">›</span></button>';
    h += weekRow() + '<div class="streakline">' + (s.lit ? "Your lamp is lit today." : s.n ? "Play one level today to keep your lamp lit." : "Finish one level to light your lamp.") + "</div>";
    [["Old Testament", OT], ["New Testament", NT]].forEach(([name, books]) => {
      h += '<div class="testament"><h3>' + name + '</h3><div class="books">';
      books.forEach((b) => {
        const list = byBook[b] || [];
        if (!list.length) return;
        const c = list.filter(isDone).length, open = list.some(isOpen), free = list.every((x) => x.free);
        h += '<button class="bookrow" data-book="' + esc(b) + '"><span class="nm"><b>' + esc(bookName(b)) + "</b><small>" +
          list.length + (list.length === 1 ? " story" : " stories") + " · " + c + " done</small></span>" +
          (free && !Lamp.state.unlocked ? '<span class="tag-free">Free</span>' : "") +
          (open ? ring(c, list.length) : '<span class="lock" aria-label="Locked">' + ICON.lock + "</span>") + "</button>";
      });
      h += "</div></div>";
    });
    return h;
  }

  function bookView(b) {
    const list = byBook[b] || [];
    let h = '<div class="backbar"><button class="back" data-back="1">‹ Journey</button><span style="flex:1"></span>' + pills() + "</div>";
    h += '<h1 class="booktitle">' + esc(bookName(b)) + '</h1><p class="lede">' + list.length + (list.length === 1 ? " story" : " stories") +
      (list[0] && !isOpen(list[0]) ? " · unlock to play" : "") + "</p>";
    h += '<div class="stories">' + list.map((s) => {
      const d = levelsDone(s), f = isDone(s) ? 1 : d / s.levels.length, open = isOpen(s);
      return '<button class="scard" data-story="' + s.id + '"><span class="paint' + (s.img ? "" : " none") + '" style="' + imgStyle(s, "filter:brightness(" + (0.35 + 0.65 * f).toFixed(2) + ") saturate(" + (0.55 + 0.45 * f).toFixed(2) + ")") + '"></span>' +
        (isDone(s) ? '<span class="badge" aria-label="Complete">' + ICON.check + "</span>" : !open ? '<span class="badge" aria-label="Locked">' + ICON.lock + "</span>" : "") +
        '<span class="txt"><b>' + esc(s.title) + "</b><small>" + esc(s.verses[s.key].ref) + " · " + (isDone(s) ? "complete" : d ? d + " of " + s.levels.length + " levels" : s.levels.length + " levels") + "</small></span></button>";
    }).join("") + "</div>";
    return h;
  }

  /* ---------- Today ---------- */
  function today() {
    const d = Lamp.dailyToday(), res = Lamp.state.daily[Lamp.today()], s = Lamp.streak();
    let h = '<div class="head"><div class="brand">Today</div>' + pills() + "</div>";
    h += '<p class="lede">One verse a day, the same for everyone. Fewer hints means more lamps on your result.</p>';
    h += '<div class="section"><h2>Daily verse #' + Lamp.dailyNumber() + "</h2>";
    if (res) {
      const fl = res.hints === 0 ? 3 : res.hints === 1 ? 2 : 1;
      h += '<div class="daily" style="cursor:default"><span class="ic">' + ICON.lamp + "</span><span><b>" + "🪔".repeat(fl) + "</b><small>Solved in " +
        Math.floor(res.secs / 60) + ":" + String(res.secs % 60).padStart(2, "0") + (res.hints ? " with " + res.hints + " hint" + (res.hints > 1 ? "s" : "") : " with no hints") + " · " + esc(d.ref) + "</small></span></div>";
      h += '<button class="cta gold" data-copyres="1">Copy result to share</button><button class="cta alt" data-daily="1" style="color:var(--cream);border-color:rgba(201,162,74,.4)">Play it again</button>';
    } else {
      h += '<button class="daily" data-daily="1"><span class="ic">' + ICON.lamp + "</span><span><b>Play today’s verse</b><small>" + d.hide.length + " missing words · " + d.wheel.length + "-letter wheel</small></span><span class=\"chev\">›</span></button>";
    }
    h += "</div>";
    h += '<div class="section"><h2>Keep the lamp lit</h2>' + weekRow() +
      '<p class="lede">' + (s.n ? "<b style=\"color:var(--cream)\">" + s.n + (s.n === 1 ? " day" : " days") + ".</b> " : "") +
      "Finish one level a day to keep your lamp burning. One rest day each week, Sunday to Saturday, never breaks it.</p></div>";
    return h;
  }

  /* ---------- Verses gathered ---------- */
  function gathered() {
    const done = D.stories.filter(isDone);
    let h = '<div class="head"><div class="brand">Gathered</div>' + pills() + "</div>";
    h += '<p class="lede">' + done.length + " of " + D.stories.length + " verses learned by heart.</p>";
    h += '<div class="seg" role="group" aria-label="Show">' + [["verses", "Verses"], ["fav", "Favourites"], ["paint", "Paintings"]]
      .map(([k, l]) => '<button data-mode="' + k + '" aria-pressed="' + (gatheredMode === k) + '">' + l + "</button>").join("") + "</div>";
    if (!done.length) return h + '<div class="empty"><b>Nothing gathered yet</b>Finish a story and its verse is kept here, ready to read, search and share.</div>';
    if (gatheredMode === "paint") {
      return h + '<div class="gallery">' + done.map((s) => '<div role="img" aria-label="' + esc(s.title) + '" style="' + (s.img ? imgStyle(s) : "background:radial-gradient(circle at 50% 30%,rgba(201,162,74,.55),#141A33 70%)") + '"></div>').join("") + "</div>";
    }
    h += '<input class="search" id="q" type="search" placeholder="Search verses, books or words" value="' + esc(query) + '" aria-label="Search verses">';
    const q = query.toLowerCase().trim();
    const list = done.filter((s) => (gatheredMode !== "fav" || Lamp.state.fav[s.id]) &&
      (!q || (s.title + " " + s.book + " " + s.verses[s.key].ref + " " + s.verses[s.key].w.join(" ")).toLowerCase().includes(q)));
    if (!list.length) return h + '<div class="empty">' + (gatheredMode === "fav" ? "Tap the heart on a verse to keep it here." : "No verses match.") + "</div>";
    return h + '<div class="vlist">' + list.map((s) => {
      const k = s.verses[s.key], fav = !!Lamp.state.fav[s.id];
      return '<div class="vitem"><div class="pt' + (s.img ? "" : " none") + '" style="' + imgStyle(s) + '"></div><div class="bd"><q>' + esc(k.w.join(" ")) + '</q><div class="rf">' + esc(k.ref) + " · " + esc(s.title) + "</div>" +
        '<div class="acts"><button class="ib' + (fav ? " on" : "") + '" data-fav="' + s.id + '" aria-pressed="' + fav + '">' + (fav ? ICON.heartOn : ICON.heart) + (fav ? "Saved" : "Save") + "</button>" +
        '<button class="ib" data-share="' + s.id + '">' + ICON.share + "Share</button></div></div></div>";
    }).join("") + "</div>";
  }

  /* ---------- Settings ---------- */
  function settings() {
    const st = Lamp.state.settings;
    const sw = (k, on) => '<button class="switch" role="switch" aria-checked="' + !!on + '" data-set="' + k + '"><span class="sr" hidden>' + k + "</span></button>";
    let h = '<div class="head"><div class="brand">Settings</div></div>';
    h += '<div class="group"><div class="row"><span class="l"><b>Verse text size</b><small>Changes the size of verses in levels.</small></span><span class="sizes">' +
      [["s", "A", 14], ["m", "A", 17], ["l", "A", 21]].map(([k, l, px]) => '<button data-size="' + k + '" aria-pressed="' + (st.text === k) + '" style="font-size:' + px + 'px" aria-label="' + { s: "Small", m: "Medium", l: "Large" }[k] + '">' + l + "</button>").join("") + "</span></div>" +
      '<div class="row"><span class="l"><b>Sound effects</b><small>Harp notes as you spell, bells for words found.</small></span>' + sw("sound", st.sound) + "</div>" +
      '<div class="row"><span class="l"><b>Music</b><small>Quiet background music while you play.</small></span>' + sw("music", st.music) + "</div>" +
      '<div class="row"><span class="l"><b>Vibration</b><small>Gentle taps on your iPhone.</small></span>' + sw("haptics", st.haptics) + "</div>" +
      '<div class="row"><span class="l"><b>Colour-blind friendly colours</b><small>Blue and orange instead of cream and gold.</small></span>' + sw("cb", st.cb) + "</div></div>";
    h += '<div class="group">' + (Lamp.state.unlocked
      ? '<div class="row"><span class="l"><b>Full Bible unlocked</b><small>All 66 books, ' + D.stories.length + " stories. Thank you.</small></span>" + ICON.check.replace("<svg", '<svg style="width:22px;height:22px;color:var(--gold)"') + "</div>"
      : '<button class="row" data-unlock="1"><span class="l"><b>Unlock the full Bible</b><small>Genesis to Revelation, one payment, no ads.</small></span><span style="color:var(--gold);font-weight:700">›</span></button>') +
      '<button class="row" data-restore="1"><span class="l"><b>Restore purchase</b><small>Use this after reinstalling or on a new iPhone.</small></span></button></div>';
    h += '<div class="group"><button class="row" data-reset="1"><span class="l"><b style="color:#F0A59A">Reset progress</b><small>Clears stories, streak, oil and gathered verses on this iPhone.</small></span></button></div>';
    h += '<p class="small-print">Lamp ' + VERSION + " · King James Version text<br>No account, no ads, no tracking. Your progress stays on this iPhone and in your own iCloud.</p>";
    h += '<p class="small-print">“Thy word is a lamp unto my feet, and a light unto my path.” Psalm 119:105</p>';
    return h;
  }

  /* ---------- unlock ---------- */
  Lamp.showUnlock = function (story) {
    const price = Lamp.price || "$4.99", rest = D.stories.length - FREE_STORIES;
    const sh = Lamp.sheet('<div class="kick">Unlock the full Bible</div><h2>' + (story ? esc(story.title) + " is in the full Bible" : "Genesis to Revelation") + "</h2>" +
      '<div class="price">' + esc(price) + '</div><p style="margin:2px 0 0">One payment. Yours for good, on all your devices.</p>' +
      '<ul class="ticks"><li>All 66 books and ' + rest + " more stories, " + D.stories.reduce((a, s) => a + (s.free ? 0 : s.levels.length), 0) + " more levels</li>" +
      "<li>Every painting to light up and collect</li><li>No ads, no subscription, no lamp oil to buy</li></ul>" +
      '<button class="cta gold" data-act="buy" data-keep="1" id="buyBtn">Unlock for ' + esc(price) + "</button>" +
      '<button class="cta alt" data-act="restore" data-keep="1">Restore purchase</button>' +
      '<button class="cta alt" data-act="close">Not now</button>' +
      (Lamp.hasNative ? "" : '<p style="font-size:12.5px;margin:10px 0 0;color:#6B6F7E">This is the preview outside the App Store, so “Unlock” switches the full Bible on for testing.</p>'),
      {
        buy: (b) => {
          if (Lamp.native("purchase")) { b.textContent = "Waiting for the App Store…"; b.disabled = true; return; }
          Lamp.state.unlocked = true; Lamp.save(); sh.remove(); Lamp.render(); mainToast("Full Bible unlocked (test)");
        },
        restore: () => { if (!Lamp.native("restore")) mainToast("Restore works in the App Store version"); },
        close: () => {},
      });
  };
  Lamp.onPurchaseResult = function (msg) {
    document.querySelectorAll(".sheet").forEach((s) => s.remove());
    if (msg.ok) { Lamp.state.unlocked = true; Lamp.save(); mainToast("Full Bible unlocked. Thank you!"); }
    else if (msg.message) mainToast(msg.message);
    Lamp.render();
  };
  Lamp.onUnlockChanged = () => Lamp.render();

  function confirmReset() {
    Lamp.sheet('<div class="kick">Reset progress</div><h2>Start again from Genesis?</h2><p>This clears every story, your streak, your lamp oil and your gathered verses on this iPhone. Your purchase is kept.</p>' +
      '<button class="cta danger" data-act="yes">Reset everything</button><button class="cta alt" data-act="no">Keep my progress</button>',
      { yes: () => { Lamp.resetAll(); tab = "journey"; book = null; Lamp.render(); mainToast("Progress reset"); }, no: () => {} });
  }

  /* ---------- events ---------- */
  function mainToast(t) { const el = $("mtoast"); el.textContent = t; el.classList.add("show"); clearTimeout(mainToast.t); mainToast.t = setTimeout(() => el.classList.remove("show"), 1800); }
  Lamp.mainToast = mainToast;
  function openStory(id) {
    const s = D.stories.find((x) => x.id === id);
    if (!isOpen(s)) { Lamp.showUnlock(s); return; }
    Lamp.playStory(s, false);
  }
  function wire() {
    const v = $("view");
    v.querySelectorAll("[data-story]").forEach((b) => (b.onclick = () => openStory(b.dataset.story)));
    v.querySelectorAll("[data-book]").forEach((b) => (b.onclick = () => { book = b.dataset.book; Lamp.render(); v.scrollTop = 0; }));
    v.querySelectorAll("[data-back]").forEach((b) => (b.onclick = () => { book = null; Lamp.render(); }));
    v.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { tab = b.dataset.go; book = null; Lamp.render(); v.scrollTop = 0; }));
    v.querySelectorAll("[data-daily]").forEach((b) => (b.onclick = () => Lamp.playDaily()));
    v.querySelectorAll("[data-copyres]").forEach((b) => (b.onclick = () => {
      const res = Lamp.state.daily[Lamp.today()], d = Lamp.dailyToday(), fl = res.hints === 0 ? 3 : res.hints === 1 ? 2 : 1;
      const txt = "Lamp · Daily verse #" + Lamp.dailyNumber() + "\n" + "🪔".repeat(fl) + "·".repeat(3 - fl) + "  " + Math.floor(res.secs / 60) + ":" + String(res.secs % 60).padStart(2, "0") +
        (res.hints ? ", " + res.hints + " hint" + (res.hints > 1 ? "s" : "") : ", no hints") + "\n" + d.ref + " · " + Lamp.streak().n + "-day lamp";
      Lamp.copyText(txt, null);
    }));
    v.querySelectorAll("[data-mode]").forEach((b) => (b.onclick = () => { gatheredMode = b.dataset.mode; Lamp.render(); }));
    const q = $("q");
    if (q) q.oninput = () => { query = q.value; const pos = q.selectionStart; Lamp.render(); const n = $("q"); n.focus(); n.setSelectionRange(pos, pos); };
    v.querySelectorAll("[data-fav]").forEach((b) => (b.onclick = () => { const id = b.dataset.fav; if (Lamp.state.fav[id]) delete Lamp.state.fav[id]; else Lamp.state.fav[id] = true; Lamp.save(); Lamp.render(); }));
    v.querySelectorAll("[data-share]").forEach((b) => (b.onclick = () => {
      const s = D.stories.find((x) => x.id === b.dataset.share), k = s.verses[s.key];
      Lamp.copyText("“" + k.w.join(" ") + "” " + k.ref + " (KJV)\nLearned by heart with Lamp: Bible Word Puzzle", null);
    }));
    v.querySelectorAll("[data-set]").forEach((b) => (b.onclick = () => { const k = b.dataset.set; Lamp.state.settings[k] = !Lamp.state.settings[k]; Lamp.save(); Lamp.render(); if (k === "haptics" && Lamp.state.settings.haptics) Lamp.haptic("light"); if (k === "music") Lamp.musicUpdate(); if (k === "sound" && Lamp.state.settings.sound) Lamp.sound("bonus"); }));
    v.querySelectorAll("[data-size]").forEach((b) => (b.onclick = () => { Lamp.state.settings.text = b.dataset.size; Lamp.save(); Lamp.render(); }));
    v.querySelectorAll("[data-unlock]").forEach((b) => (b.onclick = () => Lamp.showUnlock(null)));
    v.querySelectorAll("[data-restore]").forEach((b) => (b.onclick = () => { if (!Lamp.native("restore")) mainToast("Restore works in the App Store version"); else mainToast("Checking the App Store…"); }));
    v.querySelectorAll("[data-reset]").forEach((b) => (b.onclick = confirmReset));
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab").forEach((t) => (t.onclick = () => { tab = t.dataset.tab; book = null; Lamp.render(); $("view").scrollTop = 0; }));
    Lamp.render();
    Lamp.native("ready");
  });
})();
