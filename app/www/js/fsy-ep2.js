/* The Final Seven Years · Episode 2: The Appointed Time · Act 1, The Ninth of Av (PROTOTYPE).
   Built from the approved script (Claude Doc "Episode 2, Act 1: The Ninth of Av — Script", 10 Nov 2026).
   Tester builds only: it opens from the Episodes screen when js/dev.js has TESTER on.
   Pictures are stand-ins from Episode 1 (marked on screen); Yoel's lines show as subtitles until they are voiced.
   Its own save: Lamp.state.ep2. It reuses Episode 1's screen styles (fwalk, fwview, fwbar …) and adds e2-* ones. */
(function () {
  const K = Lamp.adv && Lamp.adv.kit, F = Lamp.fsy && Lamp.fsy.parts;
  if (!K || !F) return;
  const esc = K.esc, $ = (id) => document.getElementById(id);
  const IMG = "img/fsy/w/", PP = "img/fsy/people/";
  /* pictures made for Episode 2 (the rest are stand-ins from Episode 1, labelled in tester builds) */
  const REAL = new Set(["home-table", "desk-day", "taxi-rank", "jaffa-dusk", "wall-9av", "wall-9av-edge", "chain-street", "chain-shops", "yoel-room", "roof-sunset"]);
  const save = () => Lamp.save();
  const E = () => {
    const s = Lamp.state;
    if (!s.ep2) s.ep2 = { at: "pro", view: null, done: {}, items: {}, f: {}, began: 0 };
    return s.ep2;
  };
  const has = (k) => !!E().items[k];
  const give = (k) => { E().items[k] = 1; save(); };
  const flag = (k) => !!E().f[k];
  const set = (k, v) => { E().f[k] = v === undefined ? 1 : v; save(); };
  /* Yoel's lines: subtitles now; they play aloud once the files exist (audio/narration/fsy-e2-*.mp3, listed here) */
  const HAVE = new Set([]);
  const LINES = {
    "e2-pro-1": "You know where. This is when. Come back on the ninth of Av. Bring the rod.",
    "e2-1-book1": "The ninth of Av. Both houses burned on this day, the first and the second, more than six hundred years apart. A people that remembers the day its house was destroyed is a people that has not given up on the house.",
    "e2-1-book2": "I have marked seventeen days after it. I will tell you why when you have earned it. First, learn to see what is finished, and what is only promised. Most men cannot tell the difference. Most men are not asked to.",
    "e2-1-wall": "How doth the city sit solitary, that was full of people. That is the first line they read tonight. They have read it on this night for two thousand years. Watch them, and you will understand why anyone would want to know when.",
    "e2-1-room": "I took this room so I could watch the gate and keep my papers where no one would think to look: above a man who mends watches, who never asks the time of anyone. Sit. The frames are for the questions. There are five. You will learn them one at a time, the way I did.",
    "e2-1-c1": "The first question is the simplest, and men get it wrong every day. Is it a thing done, or a thing promised? A promise to agree is not an agreement. A handshake for the cameras is not an agreement. Slide each page under the first frame and see.",
    "e2-1-sunset": "Here the day does not begin at midnight. It begins when the sun goes. Watch it go. When it is gone, it is the eleventh of Av, and for seventeen days I will be watching harder than I have ever watched anything.",
  };
  function yoel(id) {
    const text = LINES[id]; if (!text) return;
    if (Lamp.narr && HAVE.has(id)) Lamp.narr.play("fsy-" + id);
    subtitles(text, "Yoel · the second book");
    E().f["heard:" + id] = 1; save();
  }
  /* inside a card flow, Yoel's words are a card of their own, so they are never hidden behind one */
  function yoelCard(id, then, btn) {
    const text = LINES[id];
    if (Lamp.narr && HAVE.has(id)) Lamp.narr.play("fsy-" + id);
    E().f["heard:" + id] = 1; save();
    K.card('<div class="kick">Yoel \u00b7 the second book</div><div class="e2-yoel"><img src="' + PP + 'yoel.jpg" alt=""><p>\u201c' + esc(text) + '\u201d</p></div>' +
      '<button class="cta" data-act="x">' + (btn || "Go on") + "</button>", { x: () => then && then() });
  }
  const ITEMS = {
    rods: ["Two rods", "Yours, and the one Yoel left leaning on the wall at the Eastern Gate. The same length, the same notches, the same small lamp in each handle. His is worn smooth."],
    book2: ["The second book", "A long strip of very thin paper from the hollow of Yoel's rod, folded into twenty small pages. Not the journal: a calendar."],
    coffee: ["Haller's coffee", "Untouched."],
    seventy: ["The seventy weeks page", "Torn from the second book and kept apart. Handed to you at the Wall by an old woman, without a word."],
    key: ["Yoel's key", "On a loop of string, from the watchmaker on the Street of the Chain."],
  };
  const BOOKP = [
    ["pro", "The first page", "A drawing of a brass instrument with one part missing. “You know where. This is when. Come back on the ninth of Av. Bring the rod.”"],
    ["book1", "The ninth of Av", "“Both houses burned on this day… A people that remembers the day its house was destroyed is a people that has not given up on the house.”"],
    ["book2", "Seventeen days", "“I have marked seventeen days after it. I will tell you why when you have earned it. First, learn to see what is finished, and what is only promised.”"],
    ["address", "An address", "“The Street of the Chain. The room above the man who puts the hours back in order. Ask for the key in my name.”"],
    ["seventy", "Seventy weeks", "Seven, threescore and two, and one. “And he shall confirm the covenant with many for one week.” Daniel 9:27"],
    ["c1", "The first question: Done", "Is it a thing done, or a thing promised? A promise to negotiate stays dark. A completed agreement, announced, lights from the day it was announced (Yoel's rule D1, provisional). Grey is not dark: grey means we do not know."],
    ["trumpet", "The trumpeting place", "A drawing of a carved stone, and three words: The trumpeting place. The rest of his instrument is somewhere in the city."],
  ];

  /* ------------------------------------------------------------ the scenes ------------------------------------------------------------ */
  /* each view: img (stand-in), cap, hots [{box:[x,y,w,h], label, text | act}], go {fwd,left,right,back}, who [{id, name, act}] */
  const SC = [
    { id: "pro", title: "Home · the sixth night", act: "Prologue", music: "theme", amb: "indoor",
      task: () => (flag("handle") ? "Read the second book." : "Look at the two rods."),
      views: [{ id: "table", img: "home-table", cap: "A table at home, at night: the journal open on its drawing of the hanukkiah, and two rods side by side",
        hots: [{ box: [64, 32, 32, 36], label: "The two rods", text: "The same length, the same notches. Yours is new. His is worn smooth where a hand has held it for years." },
          { box: [72, 70, 24, 22], label: "Yoel's handle", act: "handle" }] }] },
    { id: "desk", title: "The Lamplighter's desk", act: "Scene 1", music: "theme", amb: "indoor",
      task: () => "The Lamplighter's desk. Look around.",
      views: [{ id: "desk", img: "desk-day", cap: "The desk where Episode 1 began, in daylight. The chair is pushed in",
        hots: [{ box: [20, 21, 16, 24], label: "The lamp", text: "Cold. The wick has been trimmed, cleanly, and never lit again.", f: "lamp" },
          { box: [34, 48, 34, 36], label: "The chair", text: "Pushed in, square to the desk. He always left it pulled out, as if he were coming back.", f: "chair" },
          { box: [69, 8, 21, 20], label: "A wall calendar", act: "calendar" },
          { box: [72, 49, 21, 9], label: "The drawer", text: "Locked. A card taped to it in his hand: “Not this time.”", f: "drawer" },
          { box: [66, 32, 18, 11], label: "The telephone", act: "phone" }] }] },
    { id: "airport", title: "Ben Gurion · the eve of the fast", act: "Scene 2", music: "m9", amb: "airport",
      task: () => (has("coffee") ? "Done here." : "Through passport control, into the arrivals hall."),
      views: [{ id: "control", img: "passport-control", cap: "Passport control. This time the officer only stamps and nods", go: { fwd: "hall" } },
        { id: "hall", img: "airport-1", cap: "The arrivals hall in August: heat at the doors, families meeting soldiers home on leave", go: { back: "control" },
          who: [{ id: "haller", name: "By the pillars", act: "haller" }] }] },
    { id: "city", title: "Up to Jerusalem", act: "Scene 3", music: "m10", amb: "train",
      task: () => (!flag("bookread") ? "On the train: open the second book." : !flag("taxi") ? "Take a taxi from the station rank." : "Walk down to the steps above the Wall."),
      views: [{ id: "train", img: "train-board", cap: "The airport train, half empty now", go: { fwd: "rank" },
          hots: [{ box: [30, 40, 40, 30], label: "The second book", act: "book" }] },
        { id: "rank", img: "taxi-rank", cap: "Jerusalem's central station. A taxi waits at the rank, engine running", go: { back: "train", fwd: "jaffa" },
          hots: [{ box: [60, 50, 38, 24], label: "The taxi driver", act: "taxi" }] },
        { id: "jaffa", img: "jaffa-dusk", cap: "Jaffa Gate at about six. Some shutters are coming down; some shops are still open", go: { back: "rank", fwd: "lanes" }, need: "taxi" },
        { id: "lanes", img: "jq-cardo", cap: "Down through the Jewish Quarter, the map in your hand", go: { back: "jaffa", fwd: "steps" } },
        { id: "steps", img: "jewish-wallsteps", cap: "The steps above the Western Wall plaza, as the sun touches the roofs", go: { back: "lanes" }, end: 1 }] },
    { id: "wall", title: "The Wall · the night of 9 Av", act: "Scene 4", music: null, amb: null,
      task: () => (has("seventy") ? "Done here." : "Watch, from the back of the plaza."),
      views: [{ id: "plaza", img: "wall-9av", cap: "From the back: thousands sitting on the stone and on low stools, small lights, the Wall lit from below", go: { fwd: "edge" },
          hots: [{ box: [8, 66, 84, 26], label: "The people on the ground", text: "They sit on the ground, the way mourners do. Shoes of canvas, not leather. No one is talking.", f: "w1" },
            { box: [28, 33, 52, 13], label: "The Wall", text: "The stones Herod's men laid, the lowest courses of the platform Yoel measured. Tonight nobody is measuring anything.", f: "w3" }] },
        { id: "edge", img: "wall-9av-edge", cap: "Closer, from the edge: people reading by candle and phone light", go: { back: "plaza" },
          hots: [{ box: [20, 45, 60, 35], label: "The reading", text: "The book of Lamentations, chanted low in a dozen groups at once, so the sounds overlap like water.", f: "w2" }] }] },
    { id: "chain", title: "The Street of the Chain · 9 Av", act: "Scene 5", music: "m13", amb: "market",
      task: () => (!has("key") ? "Find the room above the man who puts the hours back in order." : !flag("room") ? "Go up to the room." : "Yoel's room. Look at everything."),
      views: [{ id: "street", img: "chain-street", cap: "The Street of the Chain, looking down toward the Mount's Chain Gate", go: { fwd: "shops" } },
        { id: "shops", img: "chain-shops", cap: "Three shops close together, each with a door to an upstairs room", go: { back: "street", fwd: "room" },
          hots: [{ box: [3, 37, 32, 48], label: "The clock stall", act: "shop:clocks" }, { box: [37, 37, 31, 48], label: "The souvenir shop", act: "shop:sand" },
            { box: [70, 38, 27, 46], label: "The watch-repair shop", act: "shop:watch" }] },
        { id: "room", img: "yoel-room", cap: "Yoel's room: a window, a bed, a kettle, and a table with five empty brass frames in a row", go: { back: "shops" }, need: "key",
          hots: [{ box: [36, 9, 30, 30], label: "The window", text: "It looks straight down the street to the Chain Gate of the Mount. He could see who went up, and when.", f: "r1" },
            { box: [0, 44, 30, 40], label: "The bed", text: "Made tight, corners squared, the way soldiers make them. Or men who were soldiers once.", f: "r2" },
            { box: [38, 42, 15, 10], label: "The kettle and one cup", text: "One cup. Washed. Upside down to dry. He did not expect company until you.", f: "r3" },
            { box: [54, 38, 12, 6], label: "A photograph, face down", act: "photo" },
            { box: [82, 24, 11, 10], label: "A postcard by the door", text: "From the Lamplighter, in his hand, years old: \u201cCome for Shabbat. Bring nothing.\u201d Never answered. A pin through the corner.", f: "r5" },
            { box: [70, 40, 22, 15], label: "The five frames", act: "frames" }] }] },
    { id: "table", title: "Yoel's table", act: "Scene 6", music: "m14", amb: "indoor",
      task: () => (flag("c1") ? "Done here." : "The first frame: slide each page under it."),
      views: [{ id: "table", img: "yoel-room", cap: "Under the frames, a folder in Yoel's hand: The first question",
        hots: [{ box: [62, 54, 30, 12], label: "The folder", act: "c1" }] }] },
    { id: "roof", title: "Sunset · 13 August", act: "Scene 7", music: "olives", amb: "olives",
      task: () => (!flag("ring") ? "Mark the seventeen days on Yoel's instrument." : !flag("open") ? "Up to the roof. Watch the sun go." : "Done."),
      views: [{ id: "inst", img: "yoel-room", cap: "On the end of the table, Yoel's calendar instrument, incomplete", go: { fwd: "roof" },
          hots: [{ box: [62, 54, 30, 12], label: "The instrument", act: "ring" }] },
        { id: "roof", img: "roof-sunset", cap: "The flat roof: the Old City's roofs, the domes, the hills going gold", go: { back: "inst" }, need: "ring",
          hots: [{ box: [12, 66, 76, 14], label: "Set the instrument on the parapet", act: "sunset" }] }] },
  ];
  const byId = (id) => SC.find((s) => s.id === id);
  const idx = (id) => SC.findIndex((s) => s.id === id);
  const DONE = {
    pro: () => flag("pro"), desk: () => flag("calendar") && (flag("lamp") || flag("chair")), airport: () => has("coffee"),
    city: () => flag("bookread") && flag("taxi") && flag("steps"), wall: () => has("seventy"), chain: () => has("key") && flag("room") && flag("heard:e2-1-room"),
    table: () => flag("c1"), roof: () => flag("open"),
  };
  const isDone = (id) => !!E().done[id];

  /* ------------------------------------------------------------ the screen ------------------------------------------------------------ */
  let scene = null, view = null;
  const ICON = {
    j: '<svg viewBox="0 0 24 24"><path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6z M6 3v18 M10 8h6 M10 12h6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    b: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6z M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    w: '<svg viewBox="0 0 24 24"><path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lamp: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 14c0-2 3-3 7-3h6c2 0 3 1 4 2l-3 1c-2 2-5 3-8 3-3 0-6-1-6-3z" fill="currentColor"/><path d="M19 13c1-3 0-6-1-8 2 2 3 5 1 8z" fill="#FFD27A"/></svg>',
  };
  const arrow = (dir, to) => to ? '<button class="farrow ' + dir + '" data-go="' + to + '" aria-label="' + ({ fwd: "Walk forward", left: "Look left", right: "Look right", back: "Go back" })[dir] + '">' + ({ fwd: "▲", left: "◀", right: "▶", back: "▼" })[dir] + "</button>" : "";

  function walk(v) {
    if (v.need && !flag(v.need) && !has(v.need)) {
      K.say(v.need === "key" ? "The stair door is locked. You need the key." : v.need === "taxi" ? "It is a long walk in this heat. The taxi rank is right here." : "Not yet.", "", 3200);
      return;
    }
    view = v; E().view = v.id; save();
    F.M(scene.music, scene.amb);
    const done = isDone(scene.id), next = SC[idx(scene.id) + 1];
    const pic = '<img class="fwimg" draggable="false" src="' + IMG + v.img + '.jpg" alt="' + esc(v.cap) + '">';
    const hots = (v.hots || []).map((h, i) => '<button class="fhit fwhot" data-h="' + i + '" aria-label="' + esc(h.label) + '" style="left:' + h.box[0] + "%;top:" + h.box[1] + "%;width:" + h.box[2] + "%;height:" + h.box[3] + '%"><span></span></button>').join("");
    const who = v.who ? '<div class="fwho">' + v.who.map((p, i) => '<button class="fwhob" data-w="' + i + '"><img class="fface" src="' + PP + p.id + '.jpg" alt=""><span>' + esc(p.name) + "</span></button>").join("") + "</div>" : "";
    const g = v.go || {};
    const task = done ? (next ? "Done here. Walk on to " + next.title + "." : "Act 1 complete.") : scene.task();
    const el = F.stage('<div class="fwalk e2">' +
      '<div class="fwbg" style="background-image:url(' + IMG + v.img + '.jpg)"></div>' +
      '<button class="fwtask' + (done ? " done" : "") + '" id="fwtask"><span>' + (done ? "✓ " : "") + esc(task) + "</span></button>" +
      '<div class="fwarea" id="fwarea"><div class="fwview" id="fwv">' + pic + hots + who + arrow("fwd", g.fwd) + arrow("back", g.back) +
        (Lamp.tester && !REAL.has(v.img) ? '<span class="e2-stand">Stand-in picture</span>' : "") +
        '<button class="fwlamp" id="fwlamp" aria-label="Yoel’s second book">' + ICON.lamp + "</button>" +
        '<div class="fwsub" id="fwsub" aria-live="polite"></div></div></div>' +
      '<nav class="fwbar"><button class="fwtool" data-j="1">' + ICON.j + '<span>Journal</span></button><button class="fwtool" data-b="1">' + ICON.b + "<span>Backpack</span></button>" +
        (done && next ? '<button class="fwtool go" data-n="1">' + ICON.w + "<span>Walk on</span></button>" : "") + "</nav></div>", null);
    const ttl = $("adv-ttl"); if (ttl) { ttl.textContent = scene.title; ttl.onclick = () => K.say(v.cap, "", 4200); }
    fit(el);
    $("fwtask").onclick = () => { K.sfx("click"); $("fwtask").classList.toggle("open"); };
    $("fwlamp").onclick = () => { K.sfx("click"); const last = Object.keys(LINES).filter((k) => flag("heard:" + k)).pop(); if (last) yoel(last); else K.say(v.cap, "", 4200); };
    el.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { F.S("step", "click", 0.5); walk(scene.views.find((x) => x.id === b.dataset.go)); }));
    el.querySelectorAll("[data-h]").forEach((b) => (b.onclick = () => {
      const h = v.hots[+b.dataset.h]; K.sfx("click");
      if (h.act) return ACT[h.act.split(":")[0]](h.act.split(":")[1]);
      if (h.f) set(h.f);
      K.card('<div class="kick">' + esc(scene.title) + "</div><h2>" + esc(h.label) + "</h2><p>" + esc(h.text) + '</p><button class="cta" data-act="x">Back</button>', { x: () => after() });
    }));
    el.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => { K.sfx("click"); ACT[v.who[+b.dataset.w].act](); }));
    el.querySelector("[data-j]").onclick = () => { K.sfx("click"); journal(); };
    el.querySelector("[data-b]").onclick = () => { K.sfx("click"); backpack(); };
    const n = el.querySelector("[data-n]"); if (n) n.onclick = () => { K.sfx("click"); go(next.id); };
    if (v.end && !flag(v.end === 1 ? "steps" : v.end)) set("steps");
    if (scene.id === "chain" && v.id === "room" && !flag("room")) { set("room"); setTimeout(() => { if (!K.root()) return; yoel("e2-1-room"); check(); }, 500); }
    if (scene.id === "wall" && !flag("wallLeave")) wallCheck();
    check();
  }
  /* size the picture to the space, keeping its shape, so the tap spots stay on their marks */
  function fit(el) {
    const area = el.querySelector("#fwarea"), box = el.querySelector("#fwv"), img = box.querySelector(".fwimg");
    const doFit = () => {
      if (!area.isConnected) return;
      const cs = getComputedStyle(area), aw = area.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), ah = area.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const r = img.naturalWidth ? Math.min(img.naturalWidth / img.naturalHeight, 1.1) : 3 / 4;
      let w = aw, h = aw / r; if (h > ah) { h = ah; w = ah * r; }
      box.style.width = Math.round(w) + "px"; box.style.height = Math.round(h) + "px";
      img.style.objectFit = "cover";
    };
    if (img.complete && img.naturalWidth) doFit(); else img.addEventListener("load", doFit, { once: true });
    window.addEventListener("resize", doFit, { once: true });
  }
  let subT = null;
  function subtitles(text, who) {
    const box = $("fwsub"); if (!box) { K.say(text, who, Math.max(5000, text.length * 60)); return; }
    const parts = []; let cur = "";
    text.split(/(?<=[.!?:;])\s+/).forEach((s) => { if ((cur + " " + s).trim().length > 110 && cur) { parts.push(cur.trim()); cur = s; } else cur = (cur + " " + s).trim(); });
    if (cur) parts.push(cur);
    let i = 0;
    const show = () => {
      clearTimeout(subT);
      if (i >= parts.length || !box.isConnected) { box.classList.remove("on"); return; }
      box.innerHTML = "<span>" + esc(parts[i]) + "</span><small>" + esc(who) + (parts.length > 1 ? " · " + (i + 1) + "/" + parts.length : "") + "</small>";
      box.classList.add("on");
      subT = setTimeout(() => { i++; show(); }, Math.max(4200, parts[i].length * 64));
    };
    box.onclick = (e) => { e.stopPropagation(); i++; show(); };
    show();
  }
  /* finish a scene when its list is met; a card says so the first time */
  function check() {
    if (!scene || isDone(scene.id) || !DONE[scene.id]()) return;
    E().done[scene.id] = 1; save();
    const fin = FINISH[scene.id];
    if (fin) setTimeout(() => K.root() && fin(), 700); else setTimeout(() => K.root() && walk(view), 700);
  }
  const after = () => { if (scene && scene.id === "wall") wallCheck(); check(); };
  function go(id) {
    scene = byId(id); E().at = id; save();
    const first = scene.views[0];
    if (!flag("seenAct:" + id)) { set("seenAct:" + id); actCard(scene, () => walk(first)); } else walk(first);
  }
  function actCard(s, then) {
    if (s.id === "pro") { then(); return; }
    K.card('<div class="kick">Act 1 · The Ninth of Av · ' + esc(s.act) + '</div><h2>' + esc(s.title) + "</h2>" + '<button class="cta" data-act="x">Go on</button>', { x: then });
  }

  /* ------------------------------------------------------------ the actions ------------------------------------------------------------ */
  const ACT = {};
  /* Prologue: the handle */
  ACT.handle = () => {
    if (flag("handle")) return book2();
    let tight = 0;
    const draw = () => K.card('<div class="kick">Yoel’s rod</div><h2>The handle</h2>' + rodSVG(true, tight) +
      "<p>The small lamp scratched in the wood, spout to the right. Under it, a seam no wider than a hair.</p>" +
      '<div class="fchoices two"><button data-act="l">⟲ Twist left</button><button data-act="r">Twist right ⟳</button></div><button class="cta alt" data-act="x">Leave it</button>',
      { l: () => { tight++; F.S("rod", "click", 0.5); K.say(tight > 1 ? "Tighter still. It will not go that way." : "It tightens.", "", 2400); draw(); },
        r: () => { F.S("lock", "click", 0.8); K.buzz("success"); set("handle"); give("rods"); book2(); }, x: () => {} });
    draw();
  };
  function book2() {
    give("book2"); set("book:pro");
    K.card('<div class="kick">Inside the handle</div><h2>The second book</h2>' +
      "<p>Rolled tight inside the hollow handle, a long strip of very thin paper. Unrolled and folded along its creases, it makes a small book of twenty pages. Not the journal: a second book. No stones, no cubits. A drawing of a brass instrument with a part missing, and a line of writing.</p>" +
      '<button class="cta" data-act="x">Read it</button>',
      { x: () => yoelCard("e2-pro-1", candle, "The sixth candle") });
  }
  function candle() {
    const hk = Lamp.fsyWalk && Lamp.fsyWalk.hanukkiahHTML ? Lamp.fsyWalk.hanukkiahHTML(6) : "";
    K.card('<div class="kick">The sixth night of Hanukkah</div><h2>The sixth candle</h2>' + hk +
      "<p>The sixth night. Two more after this, and you will be at home for both.</p>" + '<button class="cta" data-act="x">Close the journal</button>',
      { x: () => { set("pro"); K.card('<div class="kick">&nbsp;</div><h2 class="e2-later">Eight months later.</h2><p class="fsmall">From here on, the journal’s drawn hanukkiah is a marker in the story. The feast itself is in winter.</p>' +
        '<div class="e2-acttitle"><small>The Final Seven Years · Episode 2 · The Appointed Time</small><b>Act 1 · The Ninth of Av</b></div><button class="cta" data-act="x">Begin</button>', { x: () => { E().done.pro = 1; save(); go("desk"); } }); } });
  }
  /* Scene 1 */
  ACT.calendar = () => {
    set("calendar");
    K.card('<div class="kick">On the wall by the desk</div><h2>A calendar, open at August</h2>' + calendarHTML() +
      "<p>Every day of Av is crossed out in his small hand, except a block of seventeen: the 11th to the 27th. Two of those are circled. A tiny shelter is drawn on the 15th.</p>" +
      '<button class="cta" data-act="x">Back</button>', { x: after });
  };
  ACT.phone = () => {
    const n = (E().f.calls || 0) + 1; set("calls", n);
    K.say(n < 3 ? "You call his number. It rings, and rings, and rings out." : "A recorded voice: the number you have called is not in service.", "", 3600);
  };
  const FINISH = {};
  FINISH.desk = () => K.card('<div class="kick">Leaving</div><h2>Seventeen days</h2><p>Seventeen days left blank. Two of them circled. One with a little drawing of a shelter. He knew about the seventeen days. You still don’t know how.</p>' +
    '<button class="cta" data-act="x">To the airport</button>', { x: () => { note("lamplighter", "His desk is empty. He marked seventeen days of Av."); walk(view); } });
  /* Scene 2: Haller */
  ACT.haller = () => {
    if (has("coffee")) { K.say("He has gone. The second coffee is in your bag.", "", 3000); return; }
    const face = '<img class="e2-face" src="' + PP + 'haller.jpg" alt="Haller">';
    const said = (t) => '<p class="e2-said"><b>Haller</b> “' + esc(t) + "”</p>";
    K.card('<div class="kick">The arrivals hall</div>' + face + "<h2>Haller</h2><p>Waiting by the pillars, not hiding. The grey coat over his arm in the heat. Two paper coffees.</p>" +
      said("Iced. I guessed. You may want something before sunset. A great many people will be fasting tonight.") + said("We are both waiting for the same seventeen days.") +
      '<p class="fsmall">A pause.</p>' + said("The difference is, I know what happens if the page is filled.") +
      '<div class="fsay"><button data-act="a">“What page?”</button><button data-act="b">“How did you know I was coming?”</button><button data-act="c">Say nothing.</button></div>',
      { a: () => q2("The one your old man left blank, and mine wants written. You have seen it. You will see it again."),
        b: () => q2("You bought the ticket in March. I am not a magician. I read."),
        c: () => q2("Good. He taught you that, at least.", true) });
    const q2 = (reply, silent) => K.card('<div class="kick">The arrivals hall</div>' + face + (silent ? '<p class="fsmall">He waits, then smiles.</p>' : "") + said(reply) +
      said("Tell me only this. What does he believe belongs on the Mount? Not where. You found where. What.") +
      '<div class="fsay"><button data-act="a">“I don’t know.”</button><button data-act="b">“Ask him yourself.”</button></div>',
      { a: () => q3('<p class="fsmall">It is true, and he believes you. That is worse.</p>'), b: () => q3(said("I would, if anyone could find him.")) });
    const q3 = (h) => K.card('<div class="kick">The arrivals hall</div>' + h + "<p>He puts the second coffee down on the ledge beside you, nods, and is gone into the crowd at the doors.</p>" +
      '<button class="cta" data-act="x">Pick up the cup</button>',
      { x: () => { give("coffee"); note("haller", "At the airport: “We are both waiting for the same seventeen days.”");
        K.card('<div class="e2-cup"><svg viewBox="0 0 120 150" aria-hidden="true"><path d="M20 20h80l-8 120H28z" fill="#EFE7D6" stroke="#B9AD92" stroke-width="2"/><path d="M14 10h92v14H14z" fill="#3A3A3A"/><text x="60" y="88" text-anchor="middle" font-family="Marker Felt, Comic Sans MS, cursive" font-size="17" fill="#1F2A6B" transform="rotate(-6 60 88)">' + esc(playerName()) + "</text></svg></div>" +
          '<button class="cta" data-act="x">Go on</button>', { x: () => K.card('<div class="kick">The arrivals hall</div><p>He does not know what Yoel wants on the Mount. Neither do you.</p><button class="cta" data-act="x">On to Jerusalem</button>', { x: after }) }); } });
  };
  const playerName = () => (Lamp.state.name || "your name").slice(0, 14);
  /* Scene 3 */
  ACT.book = () => {
    set("book:book1"); set("book:book2"); set("book:address"); set("bookread");
    K.card('<div class="kick">On the train</div><h2>The second book</h2><p>Three pages are readable now. The rest is in a shorthand you cannot yet follow.</p>' +
      '<button class="cta" data-act="x">Read</button>', { x: () => yoelCard("e2-1-book1", () => yoelCard("e2-1-book2", () =>
        K.card('<div class="kick">The second book</div><h2>The third page</h2>' + F.wnote("The Street of the Chain. The room above the man who puts the hours back in order. Ask for the key in my name.") +
          "<p>The journal marks it on your map with a question mark.</p>" + '<button class="cta" data-act="x">Close the book</button>', { x: after }))) });
  };
  ACT.taxi = () => {
    set("taxi");
    K.card('<div class="kick">The station taxi rank</div><img class="e2-face" src="' + PP + 'taxidriver.jpg" alt=""><h2>A driver heading home before sunset</h2>' +
      '<p class="e2-said"><b>Driver</b> “Tonight many people will be fasting. Some businesses close, some don’t. The Wall will be full.”</p>' +
      '<p class="e2-said"><b>Driver</b> “Go and see it, if you can do so respectfully. You’ll understand something about this city.”</p>' +
      "<p>He drops you at Jaffa Gate. The map shows the way down through the Jewish Quarter.</p>" + '<button class="cta" data-act="x">Get out at Jaffa Gate</button>',
      { x: () => { after(); walk(byId("city").views.find((x) => x.id === "jaffa")); } });
  };
  FINISH.city = () => { walk(view); };
  /* Scene 4: watch; then the page */
  function wallCheck() {
    if (["w1", "w2", "w3"].every(flag) && !flag("heard:e2-1-wall")) { setTimeout(() => K.root() && yoel("e2-1-wall"), 400); }
    if (["w1", "w2", "w3"].every(flag) && !has("seventy")) {
      const v = $("fwv"); if (v && !v.querySelector(".e2-leave")) {
        const b = document.createElement("button"); b.className = "fwpz e2-leave"; b.textContent = "Leave"; v.appendChild(b);
        b.onclick = () => { K.sfx("click"); K.card('<div class="kick">The steps, as people leave</div><h2>A folded page</h2>' +
          "<p>As you turn to go, an old woman, one of the readers, stops beside you on the steps and holds out a folded page without a word. It bears Yoel’s mark, a small lamp with its spout to the right. She is gone into the crowd before you can thank her.</p>" +
          "<p>A page of the second book, torn out and kept apart. Seventy small marks, in no order.</p>" + '<button class="cta" data-act="x">Keep it</button>', { x: () => { give("seventy"); after(); } }); };
      }
    }
  }
  /* Scene 5: the shops */
  ACT.shop = (which, reply) => {
    set("shop:" + which);
    const S = {
      clocks: ["The clock stall", "Wall clocks for sale, every one set to a different time.", "\u201cI sell them. If they break, you take them to someone else.\u201d", "\u201cA man in a grey coat asked me that last week. I told him nothing. I tell you nothing too.\u201d", "left", "The clock seller"],
      sand: ["The souvenir shop", "Brass hourglasses, olive-wood boxes, postcards.", "\u201cSand and wood. Nothing that ticks.\u201d She points vaguely down the street.", "She shrugs. \u201cOld men come and go.\u201d", null, "The souvenir seller"],
      watch: ["The watch-repair shop", "Opened watches under glass, tiny tools. A clock face painted on the shutter, its hands fixed.", "The watchmaker looks up, and says nothing until he is asked the right thing.", null, "right", "The watchmaker"],
    }[which];
    const FACE = { clocks: "clockseller", sand: "souvenir", watch: "watchmaker" }[which];
    K.card('<div class="kick">The Street of the Chain</div><img class="e2-face" src="' + PP + FACE + '.jpg" alt=""><h2>' + S[0] + "</h2><p>" + S[1] + "</p>" + (reply ? '<p class="e2-said"><b>' + S[5] + "</b> " + esc(reply) + "</p>" : "") +
      '<div class="fsay"><button data-act="t">Talk to the keeper</button>' + (which !== "watch" ? '<button data-act="y">Ask about an old man with a stick</button>' : '<button data-act="y">Ask about Yoel</button><button data-act="c">Look at the painted clock</button>') +
      '<button data-act="d">Look at the door to the upstairs room</button></div><button class="cta alt" data-act="x">Back to the street</button>',
      { t: () => ACT.shop(which, S[2]),
        y: () => (which === "watch" ? watchmaker() : ACT.shop(which, S[3])),
        c: () => clock(),
        d: () => door(which, S[4]), x: () => {} });
  };
  function door(which, spout) {
    if (spout) set("mark:" + spout);
    K.card('<div class="kick">The door to the upstairs room</div>' + (spout ? lampMark(spout) : "") +
      "<p>" + (spout === "left" ? "Scratched small into the wood beside the door: a lamp. The lamp’s spout points left. Yoel’s pointed right." : spout === "right" ? "Scratched small into the wood beside the stair door: a lamp, its spout to the right." : "Plain wood, a brass number, nothing scratched in it.") + "</p>" +
      (spout === "left" ? '<p class="fsmall">The door is locked. The stallholder shrugs.</p>' : "") + '<button class="cta" data-act="x">Back</button>', { x: () => ACT.shop(which) });
  }
  function clock() {
    set("clock");
    K.card('<div class="kick">The painted shutter</div><h2>A clock that does not move</h2>' + clockSVG() +
      '<div class="fsay"><button data-act="a">Ask about it</button></div><button class="cta alt" data-act="x">Back</button>',
      { a: () => { set("clockAsk"); K.card('<div class="kick">The watchmaker</div><img class="e2-face" src="' + PP + 'watchmaker.jpg" alt=""><p class="e2-said"><b>The watchmaker</b> “Nine twenty-seven. He asked me to paint it. He said it was not a time. It was a verse.”</p><p class="fsmall">Daniel 9:27.</p><button class="cta" data-act="x">Back</button>', { x: () => ACT.shop("watch") }); },
        x: () => ACT.shop("watch") });
  }
  function watchmaker(miss) {
    if (has("key")) { K.say("He nods at the stair door. “It is open for you.”", "", 3000); return; }
    K.card('<div class="kick">The watch-repair shop</div><img class="e2-face" src="' + PP + 'watchmaker.jpg" alt=""><h2>The watchmaker</h2>' + (miss ? '<p class="e2-said"><b>The watchmaker</b> \u201cThat one is new. He never owned anything new.\u201d</p>' : "<p>He puts down his loupe.</p>") +
      '<p class="e2-said"><b>The watchmaker</b> “He said you would come on the fast. He said you would carry two rods. Show me his.”</p>' +
      '<div class="e2-rods"><button class="e2-rod" data-act="a">' + rodSVG(false) + "<span>The first rod</span></button>" +
      '<button class="e2-rod" data-act="b">' + rodSVG(true) + "<span>The second rod</span></button></div>" +
      '<p class="fsmall">Look closely at the grips before you choose.</p><button class="cta alt" data-act="x">Not yet</button>',
      { a: () => { K.snd("bad"); K.buzz("error"); set("rodMiss", (E().f.rodMiss || 0) + 1); watchmaker(true); },
        b: () => { F.S("rod", "click", 0.6); K.buzz("success"); give("key");
          K.card('<div class="kick">The watch-repair shop</div><p>He turns it once, nods, and gives it back with a key on a loop of string.</p><button class="cta" data-act="x">Up the stair</button>',
            { x: () => walk(byId("chain").views.find((x) => x.id === "room")) }); },
        x: () => {} });
  }
  ACT.photo = () => { set("r4"); K.card('<div class="kick">On the sill</div><h2>A photograph, face down</h2><p>Turned over: a young woman laughing on the steps of a building you recognise, the Temple Institute. No name on the back.</p><p class="fsmall">You put it back face down, the way he left it.</p><button class="cta" data-act="x">Back</button>', { x: after }); };
  ACT.frames = () => {
    K.card('<div class="kick">On the table</div><h2>Five brass frames</h2><div class="e2-frames">' + [0, 1, 2, 3, 4].map(() => '<i class="e2-frame"></i>').join("") + "</div>" +
      "<p>Brass, empty, each the size of a page, in a row along the table. A word engraved under each, in Hebrew. You cannot read them yet.</p>" +
      (has("seventy") && !flag("seventyDone") ? '<div class="fsay"><button data-act="s">Open the seventy weeks page here</button></div>' : "") +
      '<button class="cta" data-act="x">Back</button>', { s: seventy, x: after });
  };
  FINISH.chain = () => walk(view);
  /* the seventy weeks (optional) */
  function seventy() {
    const t = E().f.trays || [0, 0, 0];
    const left = 70 - t[0] - t[1] - t[2];
    const dots = (n) => '<span class="e2-dots">' + Array.from({ length: n }, () => "<i></i>").join("") + "</span>";
    const tray = (i, name) => '<div class="e2-tray"><b>' + name + "</b>" + dots(t[i]) + '<div class="e2-step"><button data-act="m7' + i + '">−7</button><button data-act="m1' + i + '">−1</button><em>' + t[i] +
      '</em><button data-act="p1' + i + '">+1</button><button data-act="p7' + i + '">+7</button></div></div>';
    const acts = { x: () => {}, h: () => K.say("Daniel counts them in three parts: seven weeks, threescore and two weeks, and one week.", "Daniel 9:25–27", 5200) };
    [0, 1, 2].forEach((i) => {
      acts["p1" + i] = () => mv(i, 1); acts["p7" + i] = () => mv(i, 7); acts["m1" + i] = () => mv(i, -1); acts["m7" + i] = () => mv(i, -7);
    });
    function mv(i, d) { const T = E().f.trays || [0, 0, 0]; const free = 70 - T[0] - T[1] - T[2]; d = d > 0 ? Math.min(d, free) : Math.max(d, -T[i]); T[i] += d; set("trays", T); K.sfx("click");
      if (T[0] === 7 && T[1] === 62 && T[2] === 1) return solved(); seventy(); }
    function solved() {
      set("seventyDone"); set("book:seventy"); F.S("lock", "click", 0.8); K.buzz("success");
      K.card('<div class="kick">The seventy weeks</div><h2>Seven, threescore and two, and one</h2><div class="e2-locked"><span>seven weeks</span><span>threescore and two weeks</span><span>one week</span></div>' +
        '<div class="fverse">“Seventy weeks are determined upon thy people and upon thy holy city… Know therefore and understand, that from the going forth of the commandment to restore and to build Jerusalem unto the Messiah the Prince shall be seven weeks, and threescore and two weeks… And he shall confirm the covenant with many for one week.”<small>Daniel 9:24–27 · KJV</small></div>' +
        '<p class="fsmall">The last week is underlined twice. The arithmetic, and the arguments about it, are on an optional journal page.</p><button class="cta" data-act="x">Back</button>', { x: after });
    }
    K.card('<div class="kick">Optional · the seventy weeks page</div><h2>Seventy marks</h2><p class="fsmall">Set the marks into the three groups Daniel names. ' + left + " left loose.</p>" +
      dots(left) + tray(0, "First") + tray(1, "Second") + tray(2, "Third") + '<div class="fsay"><button data-act="h">What does Daniel say?</button></div><button class="cta alt" data-act="x">Put it away</button>', acts);
  }
  /* Scene 6: the first frame */
  const DOCS = {
    A: ["Treaty between the Republic of the North and the Coastal Kingdom", "Signed by both heads of government, dated, with two witnesses.", "lit", "Concluded and signed. A thing done."],
    B: ["Joint Declaration", "The two governments “will begin negotiations toward a framework” on trade and borders.", "dark", "A promise to talk. Nothing is agreed yet."],
    C: ["Joint Statement", "The parties announce that an agreement “has been concluded” and “will be signed” on a date two weeks later.", "rule", ""],
    D: ["(a torn page)", "The top of a page, the rest torn away. “Joint Statement.” The two parties’ names. “The parties have held talks concerning a framework for…” No date, no signature, nothing to say whether anything was concluded or announced.", "grey", "Grey is not dark. Grey means we do not know. Yoel never turns a grey into a dark because he wishes it."],
  };
  ACT.c1 = () => {
    if (!flag("heard:e2-1-c1")) return yoelCard("e2-1-c1", ACT.c1, "Open the folder");
    const r = E().f.c1r || {};
    const order = ["A", "B", "C"].concat(r.A && r.B && r.C ? ["D"] : []);
    const state = (k) => r[k] ? '<i class="e2-st ' + r[k] + '">' + ({ lit: "lit", dark: "dark", grey: "grey" })[r[k]] + "</i>" : "";
    K.card('<div class="kick">Yoel’s table · the first frame</div><h2>Is it a thing done, or a thing promised?</h2>' +
      '<div class="e2-frames">' + [0, 1, 2, 3, 4].map((i) => '<i class="e2-frame' + (i === 0 ? " on" : "") + '">' + (i === 0 ? "<small>נעשה</small><b>Done</b>" : "") + "</i>").join("") + "</div>" +
      '<div class="e2-docs">' + order.map((k) => '<button class="e2-doc" data-act="d' + k + '"><b>' + esc(DOCS[k][0]) + "</b><span>" + esc(DOCS[k][1]) + "</span>" + state(k) + "</button>").join("") + "</div>" +
      '<p class="fsmall">Tap a page to slide it under the first frame.</p><button class="cta alt" data-act="x">Leave the table</button>',
      { dA: () => slide("A"), dB: () => slide("B"), dC: () => slide("C"), dD: () => slide("D"), x: () => {} });
    function slide(k) {
      const D = DOCS[k]; K.sfx("click");
      if (D[2] === "rule" && !r.C) return rule();
      r[k] = D[2] === "rule" ? "lit" : D[2]; set("c1r", r); F.S(r[k] === "lit" ? "harp" : "knock", null, 0.5);
      K.card('<div class="kick">Under the first frame</div><h2>' + esc(D[0]) + "</h2>" + '<div class="e2-frames"><i class="e2-frame on ' + r[k] + '"><small>נעשה</small><b>Done</b></i></div>' +
        '<p class="e2-jline">' + esc(D[3] || "") + "</p>" + '<button class="cta" data-act="x">Back to the table</button>', { x: () => {
          if (r.A && r.B && r.C && !r.D && !flag("torn")) { set("torn"); K.card('<div class="kick">Yoel’s table</div><p>A fourth slip falls out of the folder: the top of a page, the rest torn away.</p><button class="cta" data-act="x">Look at it</button>', { x: ACT.c1 }); return; }
          if (r.A && r.B && r.C && r.D) return c1Done(); ACT.c1(); } });
    }
    function rule() {
      K.card('<div class="kick">The third page</div><h2>Joint Statement</h2><p>' + esc(DOCS.C[1]) + "</p>" +
        F.wnote("A man may tell you he has an agreement when all he has is a promise to make one. Learn the difference before you believe him.") +
        '<p class="fsmall">The warning makes you think of Haller, and the page he wants written.</p><h2 class="e2-q">Does it count from the day it was announced, or the day it is signed?</h2>' +
        '<div class="fsay"><button data-act="a">From the day it was announced</button><button data-act="s">From the day it is signed</button></div>',
        { a: () => ruling(true), s: () => ruling(false) });
    }
    function ruling(ok) {
      set("c1guess", ok ? "announced" : "signed");
      K.card('<div class="kick">The folder’s last page · Yoel’s rule, written in advance <span class="e2-prov">provisional</span></div>' +
        F.wnote("For my test, if the parties announce that the agreement is already complete, I record the announcement. A later ceremony does not change that date.") +
        (ok ? "" : '<p class="fsmall">Not how Yoel rules. He wrote his rule before any of these existed. That is the point of writing it first.</p>') +
        '<button class="cta" data-act="x">Slide it under the frame</button>', { x: () => { r.C = "lit"; set("c1r", r); F.S("harp", null, 0.5);
          K.card('<div class="kick">Under the first frame</div><h2>Joint Statement</h2><div class="e2-frames"><i class="e2-frame on lit"><small>נעשה</small><b>Done</b></i></div><p class="e2-jline">Lit, dated the day of the statement.</p><button class="cta" data-act="x">Back to the table</button>',
            { x: () => { if (r.A && r.B && !flag("torn")) { set("torn"); K.card('<div class="kick">Yoel’s table</div><p>A fourth slip falls out of the folder: the top of a page, the rest torn away.</p><button class="cta" data-act="x">Look at it</button>', { x: ACT.c1 }); return; } ACT.c1(); } }); } });
    }
    function c1Done() {
      set("c1"); set("book:c1"); K.buzz("success");
      K.card('<div class="kick">The journal · a new page</div><h2>The first question</h2><p>Is it a thing done, or a thing promised? A promise to talk stays dark. A completed agreement, announced, lights from the day of the announcement. And grey is not dark: grey means we do not know.</p>' +
        '<button class="cta" data-act="x">Close the folder</button>', { x: after });
    }
  };
  FINISH.table = () => walk(view);
  /* Scene 7: the ring, then the roof */
  const AV = Array.from({ length: 30 }, (_, i) => i + 1);
  ACT.ring = () => {
    let at = E().f.ringAt || 1; const m = E().f.ringMarks || [];
    const draw = () => K.card('<div class="kick">Yoel’s instrument · a model, not a machine</div><h2>The ring of Av</h2>' + ringSVG(at, m) +
      '<div class="e2-step big"><button data-act="b7">«</button><button data-act="b1">‹</button><em>' + at + ' Av</em><button data-act="f1">›</button><button data-act="f7">»</button></div>' +
      '<p class="fsmall">' + (m.length === 0 ? "The second book’s drawing marks seventeen days on this ring. Turn it, and mark where they begin." : m.length === 1 ? "Now turn to where they end, and mark it." : "") + "</p>" +
      '<div class="fsay"><button data-act="mk">Mark this day</button></div>' +
      '<p class="fsmall e2-slot">Beside it, an empty slot, labelled in his hand: <i>the days, as men count them.</i> The Hebrew calendar is calculated; this instrument only shows what he worked out.</p>' +
      '<button class="cta alt" data-act="x">Leave it</button>',
      { b7: () => step(-7), b1: () => step(-1), f1: () => step(1), f7: () => step(7), x: () => {},
        mk: () => { K.sfx("click");
          if (m.length === 0) { if (at !== 11) { K.say("The Lamplighter left seventeen days blank. Where did his block begin?", "", 3800); return draw(); } m.push(11); set("ringMarks", m); return draw(); }
          if (at !== 27) { K.say("Seventeen days, counting the eleventh itself.", "", 3600); return draw(); }
          m.push(27); set("ringMarks", m); set("ring"); F.S("lock", "click", 0.8); K.buzz("success"); set("book:trumpet");
          K.card('<div class="kick">Yoel’s instrument</div>' + ringSVG(27, m) + "<p>Seventeen days. Without the missing part you can mark them, but not place them. Somewhere in this city is the rest of his instrument.</p>" +
            "<p>The second book’s next page shows a drawing of a carved stone, and three words: <i>The trumpeting place.</i></p>" + '<button class="cta" data-act="x">Back</button>', { x: () => walk(view) }); } });
    const step = (d) => { at = ((at - 1 + d + 30) % 30) + 1; set("ringAt", at); K.sfx("click"); draw(); };
    draw();
  };
  ACT.sunset = () => {
    if (flag("open")) return endAct();
    if (!flag("heard:e2-1-sunset")) return yoelCard("e2-1-sunset", ACT.sunset, "Watch the sun go");
    let at = 27, sun = 0, gone = false, timer = 0, pressed = false;
    const box = document.createElement("div"); box.className = "e2-sunset";
    box.innerHTML = '<div class="e2-sky"><div class="e2-sun" id="e2sun"></div><div class="e2-roofs"></div><div class="e2-sunstate" id="e2state">The sun is still up.</div></div>' +
      '<div class="e2-inst"><div id="e2ring"></div><div class="e2-step big"><button data-s="-1" aria-label="One day back">\u2039</button><em id="e2at"></em><button data-s="1" aria-label="One day on">\u203a</button></div>' +
      '<button class="e2-now" id="e2now">now</button><small>The brass marker, worn bright</small></div>' +
      '<button class="cta alt" id="e2leave">Leave the roof</button>';
    const ring = () => { box.querySelector("#e2ring").innerHTML = ringSVG(at, [11, 27]); box.querySelector("#e2at").textContent = at + " Av"; };
    const sky = () => { box.querySelector("#e2sun").style.top = (16 + sun * 0.7) + "%"; box.querySelector("#e2state").textContent = gone ? "The sun has gone." : "The sun is still up."; box.classList.toggle("dusk", gone); };
    box.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => { if (pressed) return; at = ((at - 1 + +b.dataset.s + 30) % 30) + 1; K.sfx("click"); ring(); }));
    const spring = (msg) => { const b = box.querySelector("#e2now"); b.classList.add("spring"); setTimeout(() => b.classList.remove("spring"), 400); K.say(msg, "", 3000); };
    box.querySelector("#e2now").onclick = () => {
      if (pressed) return;
      if (!gone) return spring("Not yet. The sun is still up.");
      if (at !== 11) return spring("The marker gives, and springs back. Which day begins now?");
      pressed = true; F.S("lock", "click", 0.9); K.buzz("success"); set("open");
      box.querySelector(".e2-sky").insertAdjacentHTML("beforeend", '<div class="e2-opened">11 Av. The window is open.</div>');
      setTimeout(() => { F.S("door", null, 0.9); K.say("From the street below, a car door closes.", "", 3600); }, 2200);
      setTimeout(() => { box.remove(); endAct(); }, 5600);
    };
    box.querySelector("#e2leave").onclick = () => { clearInterval(timer); box.remove(); };
    const root = K.root(); if (!root) return; root.appendChild(box); ring(); sky();
    timer = setInterval(() => { if (!box.isConnected) return clearInterval(timer); sun = Math.min(100, sun + 2); if (sun >= 100) { gone = true; clearInterval(timer); } sky(); }, 300);
  };
  function endAct() {
    E().done.roof = 1; save();
    K.card('<div class="kick">The Final Seven Years · Episode 2</div><div class="e2-acttitle"><small>Act 1 · The Ninth of Av</small><b>Complete</b></div>' +
      "<p>Seventeen days of watching. Two of them circled.</p>" +
      '<p class="fsmall">Prototype: Act 2, The Trumpeting Stone, is next to be built.</p><button class="cta" data-act="x">Back to the episodes</button><button class="cta alt" data-act="again">Play Act 1 again from the start</button>',
      { x: () => K.shut(), again: () => { Lamp.state.ep2 = null; save(); start(); } });
  }

  /* ------------------------------------------------------------ journal and backpack ------------------------------------------------------------ */
  const NOTES = { haller: [], lamplighter: [], yoel: [] };
  function note(who, text) { const n = E().f.notes || {}; n[who] = n[who] || []; if (!n[who].includes(text)) n[who].push(text); set("notes", n); }
  function journal() {
    const pages = BOOKP.filter((p) => flag("book:" + p[0]));
    const n = E().f.notes || {};
    const people = [["haller", "Victor Haller"], ["lamplighter", "The Lamplighter"]].filter((p) => (n[p[0]] || []).length);
    K.card('<div class="kick">The journal</div><h2>The second book</h2>' +
      (pages.length ? pages.map((p) => '<div class="e2-page"><b>' + esc(p[1]) + "</b><p>" + esc(p[2]) + "</p></div>").join("") : "<p>Nothing yet.</p>") +
      (people.length ? '<h2 class="e2-q">People</h2>' + people.map((p) => '<div class="e2-page"><b>' + p[1] + "</b>" + n[p[0]].map((t) => "<p>" + esc(t) + "</p>").join("") + "</div>").join("") : "") +
      '<p class="fsmall">No verdicts. Those are yours.</p><button class="cta" data-act="x">Close</button>', { x: () => {} });
  }
  function backpack() {
    const its = Object.keys(ITEMS).filter(has);
    K.card('<div class="kick">Your backpack</div><h2>What you carry</h2>' + (its.length ? its.map((k) => '<div class="e2-page"><b>' + esc(ITEMS[k][0]) + "</b><p>" + esc(ITEMS[k][1]) + "</p></div>").join("") : "<p>Nothing yet.</p>") +
      '<button class="cta" data-act="x">Close</button>', { x: () => {} });
  }

  /* ------------------------------------------------------------ drawings ------------------------------------------------------------ */
  function rodSVG(worn, tight) {
    const grip = worn ? '<rect x="12" y="14" width="70" height="22" rx="10" fill="#8A6A44"/><rect x="16" y="17" width="62" height="16" rx="8" fill="#B08A5E" opacity=".9"/><path d="M20 25h54" stroke="#D9BE93" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
      '<line x1="56" y1="12" x2="56" y2="38" stroke="#2B1D10" stroke-width="1"/>'
      : '<rect x="12" y="14" width="70" height="22" rx="10" fill="#6E4A26"/><rect x="16" y="17" width="62" height="16" rx="8" fill="#8E5E30"/>';
    const lamp = '<path d="M36 28 Q36 23 42 23 L50 23 Q53 23 54 25 L51 27 Q47 30 41 29 Q36 29 36 28Z" fill="none" stroke="#2B1D10" stroke-width="1.2"/><path d="M53 24 Q55 20 54 18 Q52 21 53 24Z" fill="#2B1D10"/>';
    const shaft = '<rect x="80" y="20" width="200" height="10" fill="#9B7A4A"/>' + [110, 140, 170, 200, 230, 260].map((x) => '<line x1="' + x + '" y1="18" x2="' + x + '" y2="32" stroke="#3B2A16" stroke-width="1.5"/>').join("");
    return '<svg class="e2-rodsvg' + (tight ? " tight" : "") + '" viewBox="0 0 290 50" aria-hidden="true">' + shaft + grip + lamp + "</svg>";
  }
  function lampMark(spout) {
    const flip = spout === "left" ? ' transform="translate(120 0) scale(-1 1)"' : "";
    return '<svg class="e2-mark" viewBox="0 0 120 70" aria-hidden="true"><rect width="120" height="70" fill="#7A5A3A"/><g' + flip + ' stroke="#2A1A0C" stroke-width="2.4" fill="none">' +
      '<path d="M22 44 Q22 32 40 32 L66 32 Q78 32 82 38 L72 42 Q58 52 38 50 Q22 49 22 44Z"/><path d="M80 36 Q86 24 82 14 Q78 24 80 36Z" fill="#2A1A0C"/></g></svg>';
  }
  function clockSVG() {
    const ticks = Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * 2 * Math.PI, r1 = i % 5 ? 88 : 80; return '<line x1="' + (100 + r1 * Math.sin(a)).toFixed(1) + '" y1="' + (100 - r1 * Math.cos(a)).toFixed(1) + '" x2="' + (100 + 94 * Math.sin(a)).toFixed(1) + '" y2="' + (100 - 94 * Math.cos(a)).toFixed(1) + '" stroke="#1C1C1C" stroke-width="' + (i % 5 ? 1.2 : 3) + '"/>'; }).join("");
    const nums = [12, 3, 6, 9].map((n) => { const a = (n / 12) * 2 * Math.PI; return '<text x="' + (100 + 66 * Math.sin(a)).toFixed(1) + '" y="' + (106 - 66 * Math.cos(a)).toFixed(1) + '" text-anchor="middle" font-size="18" font-weight="700" fill="#1C1C1C">' + n + "</text>"; }).join("");
    const hand = (deg, len, w) => '<line x1="100" y1="100" x2="' + (100 + len * Math.sin((deg * Math.PI) / 180)).toFixed(1) + '" y2="' + (100 - len * Math.cos((deg * Math.PI) / 180)).toFixed(1) + '" stroke="#111" stroke-width="' + w + '" stroke-linecap="round"/>';
    /* 9:27 — minute hand at 27 min (162°), hour hand at 9 h 27 min (283.5°) */
    return '<svg class="e2-clock" viewBox="0 0 200 250" role="img" aria-label="A painted clock at 9:27"><circle cx="100" cy="100" r="96" fill="#F4EEDC" stroke="#2B2B2B" stroke-width="4"/>' + ticks + nums +
      hand(283.5, 50, 7) + hand(162, 78, 4) + '<circle cx="100" cy="100" r="5" fill="#111"/>' +
      '<text x="100" y="222" text-anchor="middle" font-size="26" font-weight="800" fill="#F3E9CE">9:27</text><text x="100" y="244" text-anchor="middle" font-size="12" fill="#C9A24A" letter-spacing="2">Dan.</text></svg>';
  }
  function calendarHTML() {
    /* the thirty days of Av 5787 (August 2027), as he crossed them out */
    let h = '<div class="e2-cal">';
    for (let d = 1; d <= 30; d++) {
      const keep = d >= 11 && d <= 27, circ = d === 13 || d === 25, booth = d === 15;
      h += '<span class="' + (keep ? "keep" : "x") + (circ ? " circ" : "") + '">' + d + (booth ? '<i title="a small shelter">⌂</i>' : "") + "</span>";
    }
    return h + '</div><p class="fsmall">Av 5787 · August 2027</p>';
  }
  function ringSVG(at, marks) {
    const items = AV.map((d, i) => {
      const a = ((i - (at - 1)) / 30) * 2 * Math.PI, x = 110 + 86 * Math.sin(a), y = 110 - 86 * Math.cos(a);
      const inWin = marks.length === 2 && d >= 11 && d <= 27, isMark = marks.includes(d);
      return '<text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="middle" font-size="' + (d === at ? 15 : 11) + '" font-weight="' + (d === at ? 800 : 600) + '" fill="' + (isMark ? "#B23A2A" : inWin ? "#7A5A12" : "#3A3020") + '">' + d + "</text>";
    }).join("");
    return '<svg class="e2-ring" viewBox="0 0 220 220" aria-hidden="true"><circle cx="110" cy="110" r="104" fill="#E3BC5C" stroke="#7A5A12" stroke-width="3"/><circle cx="110" cy="110" r="68" fill="#C9A24A" stroke="#7A5A12" stroke-width="2"/>' +
      '<path d="M110 2 l-7 14 h14z" fill="#B23A2A"/>' + items + '<text x="110" y="106" text-anchor="middle" font-size="14" font-weight="800" fill="#2A2010">אב</text><text x="110" y="124" text-anchor="middle" font-size="11" fill="#2A2010">Av 5787</text></svg>';
  }

  /* ------------------------------------------------------------ hints ------------------------------------------------------------ */
  function hint() {
    if (!scene) return;
    const f = flag, id = scene.id, rm = E().f.rodMiss || 0;
    let t = "Look at everything here.";
    if (id === "pro") t = flag("hintH") ? "Turn the handle to the right, the way the spout points." : (set("hintH"), "Look at the lamp scratched in the handle.");
    else if (id === "desk") t = f("calendar") ? "Look at the lamp or the chair, then you can go." : "Look at the calendar on the wall.";
    else if (id === "airport") t = "Go through to the arrivals hall. Someone is waiting by the pillars.";
    else if (id === "city") t = !f("bookread") ? "Tap the second book on the train." : !f("taxi") ? "Walk forward to the station and take the taxi." : "Walk on down to the steps above the Wall.";
    else if (id === "wall") t = "Look at the people, the reading and the Wall. When you have, you may leave.";
    else if (id === "chain") t = has("key") ? "Go up to the room and look around." : !f("shop:watch") ? "Who would put hours back in order? Not someone who only sells clocks." : !(f("mark:left") && f("mark:right")) && rm === 0 ? "Look for Yoel’s lamp on the doors, and remember which way his spout points." : "The watch-repair shop. Show him Yoel’s rod: the worn one with the seam under the lamp.";
    else if (id === "table") { const r = E().f.c1r || {}; t = !r.A || !r.B ? "Is it finished, or only planned? A plan to negotiate stays dark." : !r.C ? "A finished, announced agreement lights." : "A lit, B dark, C lit from the day it was announced, the torn page grey."; }
    else if (id === "roof") t = !f("ring") ? "The Lamplighter left seventeen days blank: mark the 11th, then the 27th." : "Turn the ring to 11 Av. When the sun has gone, press the marker.";
    K.say(t, "", 5600);
  }

  /* ------------------------------------------------------------ start, tester skip ------------------------------------------------------------ */
  function start() {
    K.open("The Final Seven Years · Episode 2", { hint }, "ep2");
    const e = E(); if (!e.began) { e.began = 1; save(); }
    const id = SC.find((s) => !isDone(s.id)) ? (byId(e.at) && !isDone(e.at) ? e.at : SC.find((s) => !isDone(s.id)).id) : "roof";
    scene = byId(id);
    if (id === "pro" && !flag("pro")) { K.card('<div class="kick">Tester build · prototype</div><h2>Episode 2, Act 1</h2><p>Pictures are stand-ins from Episode 1. Yoel’s lines show as subtitles until they are voiced. Your Episode 1 progress is not touched.</p><button class="cta" data-act="x">Begin</button>', { x: () => go("pro") }); return; }
    go(id);
  }
  function devSkip() {
    const sh = document.querySelector("#adv .asheet"); if (sh) { const b = sh.querySelector("[data-act]"); b && b.click(); return; }
    if (!scene) return;
    const e = E(), id = scene.id;
    const fill = { pro: () => { set("handle"); give("rods"); give("book2"); set("book:pro"); set("pro"); }, desk: () => { set("calendar"); set("lamp"); },
      airport: () => give("coffee"), city: () => ["bookread", "taxi", "steps", "book:book1", "book:book2", "book:address"].forEach((k) => set(k)),
      wall: () => { ["w1", "w2", "w3"].forEach((k) => set(k)); give("seventy"); }, chain: () => { give("key"); set("room"); set("heard:e2-1-room"); },
      table: () => { set("c1r", { A: "lit", B: "dark", C: "lit", D: "grey" }); set("c1"); set("book:c1"); }, roof: () => { set("ring"); set("ringMarks", [11, 27]); set("open"); } };
    fill[id](); e.done[id] = 1; save();
    const nx = SC[idx(id) + 1]; if (nx) go(nx.id); else endAct();
  }
  Lamp.ep2 = { play: start, devSkip, state: E, scenes: SC };
})();
