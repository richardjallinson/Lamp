/* The Final Seven Years · Episode 2: The Appointed Time (PROTOTYPE). Tester builds only: it opens from the Episodes screen when js/dev.js has TESTER on.
   Act 1, The Ninth of Av (scenes pro … roof): built from the Claude Doc "Episode 2, Act 1: The Ninth of Av — Script" (10 Nov 2026).
     It has its own pictures, clips, music and Yoel's seven lines; a few places reuse Episode 1's pictures on purpose.
   Act 2, The Trumpeting Stone (scenes b1 … b6, further down): built from the Claude Doc "Episode 2, Act 2: The Trumpeting Stone — Script" (12 Nov 2026).
     Stand-in pictures from Episode 1, labelled in tester builds; no voice yet. The second frame follows the protocol's rule D2.
   Acts 3 to 5 are outlines only (the Claude Doc "Episode 2: The Appointed Time — The Plot (third draft)").
   Its own save: Lamp.state.ep2. It reuses Episode 1's screen styles (fwalk, fwview, fwbar …) and adds e2-* ones. */
(function () {
  const K = Lamp.adv && Lamp.adv.kit, F = Lamp.fsy && Lamp.fsy.parts;
  if (!K || !F) return;
  const esc = K.esc, $ = (id) => document.getElementById(id);
  const IMG = "img/fsy/w/", PP = "img/fsy/people/";
  /* pictures made for Episode 2 (the rest are stand-ins from Episode 1, labelled in tester builds) */
  const REAL = new Set(["jaffa-celebration", "jaffa-preacher", "fallen-stones", "excavation-street", "excavation-ticket", "chain-shops-night", "yoel-room-sabbath", "yoel-room-night", "yoel-room-dusk", "home-table", "desk-day", "taxi-rank", "jaffa-dusk", "wall-9av", "wall-9av-edge", "chain-street", "chain-shops", "yoel-room", "roof-sunset", "airport-hall-august", "wallsteps-dusk", "passport-control", "train-board", "jq-cardo"]);
  const save = () => Lamp.save();
  const E = () => {
    const s = Lamp.state;
    if (!s.ep2) s.ep2 = { at: "pro", view: null, done: {}, items: {}, f: {}, began: 0 };
    return s.ep2;
  };
  const has = (k) => !!E().items[k];
  const OBJ = (n) => '<img class="e2-obj" src="img/fsy/pz/' + n + '.jpg" alt="">';
  const give = (k) => { E().items[k] = 1; save(); };
  const flag = (k) => !!E().f[k];
  const set = (k, v) => { E().f[k] = v === undefined ? 1 : v; save(); };
  /* Yoel's lines: subtitles now; they play aloud once the files exist (audio/narration/fsy-e2-*.mp3, listed here) */
  const HAVE = new Set(Object.keys({ "e2-pro-1": 1, "e2-1-book1": 1, "e2-1-book2": 1, "e2-1-wall": 1, "e2-1-room": 1, "e2-1-c1": 1, "e2-1-sunset": 1 }));
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
    ["pro", "The first page", "A drawing of a brass instrument with parts missing. “You know where. This is when. Come back on the ninth of Av. Bring the rod.”"],
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
        { id: "hall", img: "airport-hall-august", cap: "The arrivals hall in August: heat at the doors, families meeting soldiers home on leave", go: { back: "control" },
          who: [{ id: "haller", name: "By the pillars", act: "haller" }] }] },
    { id: "city", title: "Up to Jerusalem", act: "Scene 3", music: "m10", amb: "train",
      task: () => (!flag("bookread") ? "On the train: open the second book." : !flag("taxi") ? "Take a taxi from the station rank." : "Walk down to the steps above the Wall."),
      views: [{ id: "train", img: "train-board", cap: "The airport train, half empty now", go: { fwd: "rank" },
          hots: [{ box: [30, 40, 40, 30], label: "The second book", act: "book" }] },
        { id: "rank", img: "taxi-rank", cap: "Jerusalem's central station. A taxi waits at the rank, engine running", go: { back: "train", fwd: "jaffa" },
          hots: [{ box: [60, 50, 38, 24], label: "The taxi driver", act: "taxi" }] },
        { id: "jaffa", img: "jaffa-dusk", cap: "Jaffa Gate at about six. Some shutters are coming down; some shops are still open", go: { back: "rank", fwd: "lanes" }, need: "taxi" },
        { id: "lanes", img: "jq-cardo", cap: "Down through the Jewish Quarter, the map in your hand", go: { back: "jaffa", fwd: "steps" } },
        { id: "steps", img: "wallsteps-dusk", cap: "The steps above the Western Wall plaza, as the sun touches the roofs", go: { back: "lanes" }, end: 1 }] },
    { id: "wall", title: "The Wall · the night of 9 Av", act: "Scene 4", music: "e2-wall", amb: null,
      task: () => (has("seventy") ? "Done here." : "Watch, from the back of the plaza."),
      views: [{ id: "plaza", img: "wall-9av", cap: "From the back: thousands sitting on the stone and on low stools, small lights, the Wall lit from below", go: { fwd: "edge" },
          hots: [{ box: [8, 66, 84, 26], label: "The people on the ground", text: "They sit on the ground, the way mourners do. Shoes of canvas, not leather. No one is talking.", f: "w1" },
            { box: [28, 33, 52, 13], label: "The Wall", text: "The stones Herod's men laid, the lowest courses of the platform Yoel measured. Tonight nobody is measuring anything.", f: "w3" }] },
        { id: "edge", img: "wall-9av-edge", cap: "Closer, from the edge: people reading by candle and phone light", go: { back: "plaza" },
          hots: [{ box: [20, 45, 60, 35], label: "The reading", text: "The book of Lamentations, chanted low in a dozen groups at once, so the sounds overlap like water.", f: "w2" }] }] },
    { id: "chain", title: "The Street of the Chain · 9 Av", act: "Scene 5", music: "e2-chain", amb: "market",
      task: () => (!has("key") ? "Find the room above the man who puts the hours back in order." : !flag("room") ? "Go up to the room." : "Yoel's room. Look at everything."),
      views: [{ id: "street", img: "chain-street", cap: "The Street of the Chain, looking down toward the Mount's Chain Gate", go: { fwd: "shops" } },
        { id: "shops", img: "chain-shops", cap: "Three shops close together. Each has a narrow stair at the back, up to the shuttered room above it", go: { back: "street", fwd: "room" },
          hots: [{ box: [3, 37, 32, 48], label: "The clock stall", act: "shop:clocks" }, { box: [37, 37, 31, 48], label: "The souvenir shop", act: "shop:sand" },
            { box: [70, 38, 27, 46], label: "The watch-repair shop", act: "shop:watch" }] },
        { id: "room", img: "yoel-room", cap: "Yoel's room: a window, a bed, a kettle, and a table with five empty brass frames in a row", go: { back: "shops" }, need: "key",
          hots: [{ box: [36, 9, 30, 30], label: "The window", text: "It looks straight down the street to the Chain Gate of the Mount. He could see who went up, and when.", f: "r1" },
            { box: [0, 44, 30, 40], label: "The bed", text: "Made tight, corners squared, the way soldiers make them. Or men who were soldiers once.", f: "r2" },
            { box: [38, 42, 15, 10], label: "The kettle and one cup", text: "One cup. Washed. Upside down to dry. He did not expect company until you.", f: "r3" },
            { box: [54, 38, 12, 6], label: "A photograph, face down", act: "photo" },
            { box: [82, 24, 11, 10], label: "A postcard by the door", img: "e2-postcard", text: "From the Lamplighter, in his hand, years old: \u201cCome for Shabbat. Bring nothing.\u201d Never answered. A pin through the corner.", f: "r5" },
            { box: [70, 40, 22, 15], label: "The five frames", act: "frames" }] }] },
    { id: "table", title: "Yoel's table", act: "Scene 6", music: "e2-table", amb: "indoor",
      task: () => (flag("c1") ? "Done here." : "The first frame: slide each page under it."),
      views: [{ id: "table", img: "yoel-room", cap: "Under the frames, a folder in Yoel's hand: The first question",
        hots: [{ box: [62, 54, 30, 12], label: "The folder", act: "c1" }] }] },
    { id: "roof", title: "Sunset · 13 August", act: "Scene 7", music: "e2-roof", amb: "olives",
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
    const task = done ? (next ? "Done here. Walk on to " + next.title + "." : "Act " + actOf(scene.id) + " complete.") : scene.task();
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
      K.card('<div class="kick">' + esc(scene.title) + "</div><h2>" + esc(h.label) + "</h2>" + (h.img ? OBJ(h.img) : "") + "<p>" + esc(h.text) + '</p><button class="cta" data-act="x">Back</button>', { x: () => after() });
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
    K.card('<div class="kick">' + ACTNAME[actOf(s.id)] + " · " + esc(s.act) + '</div><h2>' + esc(s.title) + "</h2>" + '<button class="cta" data-act="x">Go on</button>', { x: then });
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
    K.card('<div class="kick">Inside the handle</div><h2>The second book</h2>' + OBJ("e2-book2") +
      "<p>Rolled tight inside the hollow handle, a long strip of very thin paper. Unrolled and folded along its creases, it makes a small book of twenty pages. Not the journal: a second book. No stones, no cubits. A drawing of a brass instrument with parts missing, and a line of writing.</p>" +
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
  /* Richard's clips: reuse Episode 1's player (tap to replay, music dips while it plays) */
  const clip = (id) => { const fw = Lamp.fsyWalk; if (!fw || !fw.adv || !fw.H || !fw.H.clip) return ""; fw.adv.CLIPS.add(id); return fw.H.clip(id); };
  ACT.haller = () => {
    if (has("coffee")) { K.say("He has gone. The second coffee is in your bag.", "", 3000); return; }
    const face = '<img class="e2-face" src="' + PP + 'haller.jpg" alt="Haller">';
    const said = (t) => '<p class="e2-said"><b>Haller</b> “' + esc(t) + "”</p>";
    K.card('<div class="kick">The arrivals hall</div>' + (clip("haller-coffee") || face) + "<h2>Haller</h2><p>Waiting by the pillars, not hiding. The grey coat on, even in this heat. Two iced coffees.</p>" +
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
    const q3 = (h) => K.card('<div class="kick">The arrivals hall</div>' + h + clip("haller-leaves") + "<p>He puts the second coffee down on the ledge beside you, nods, and is gone into the crowd at the doors.</p>" +
      '<button class="cta" data-act="x">Pick up the cup</button>',
      { x: () => { give("coffee"); note("haller", "At the airport: “We are both waiting for the same seventeen days.”");
        K.card('<div class="e2-cup"><svg viewBox="0 0 120 160" aria-hidden="true"><defs><linearGradient id="e2cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9773A"/><stop offset="1" stop-color="#5A2E14"/></linearGradient></defs>' +
          '<path d="M64 2l-3 30" stroke="#2A2A2A" stroke-width="4" stroke-linecap="round"/><path d="M22 30h76l-9 122H31z" fill="url(#e2cf)" stroke="#D8D2C4" stroke-width="2.5"/><path d="M22 30h76l-1.6 22H23.6z" fill="#E9E2D2" opacity=".55"/>' +
          '<rect x="34" y="40" width="13" height="12" rx="3" fill="#F4EEE0" opacity=".7" transform="rotate(-12 40 46)"/><rect x="56" y="44" width="13" height="12" rx="3" fill="#F4EEE0" opacity=".6" transform="rotate(9 62 50)"/><rect x="76" y="39" width="12" height="11" rx="3" fill="#F4EEE0" opacity=".65" transform="rotate(-6 82 44)"/>' +
          '<path d="M17 22h86v10H17z" fill="#EDE7D8" stroke="#C9C1AE" stroke-width="1.5"/><rect x="36" y="78" width="48" height="32" rx="3" fill="#FBF8EF" stroke="#C9C1AE"/><text x="60" y="101" text-anchor="middle" font-family="Marker Felt, Comic Sans MS, cursive" font-size="20" fill="#1F2A6B" transform="rotate(-5 60 96)">23A</text></svg></div>' +
          '<p>In marker on the label: <b>23A</b>. Your seat on the flight.</p>' +
          '<button class="cta" data-act="x">Go on</button>', { x: () => K.card('<div class="kick">The arrivals hall</div><p>He does not know what Yoel wants on the Mount. Neither do you.</p><button class="cta" data-act="x">On to Jerusalem</button>', { x: after }) }); } });
  };
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
      '<button data-act="d">Look at the stair door at the back of the shop</button></div><button class="cta alt" data-act="x">Back to the street</button>',
      { t: () => ACT.shop(which, S[2]),
        y: () => (which === "watch" ? watchmaker() : ACT.shop(which, S[3])),
        c: () => clock(),
        d: () => door(which, S[4]), x: () => {} });
  };
  function door(which, spout) {
    if (spout) set("mark:" + spout);
    K.card('<div class="kick">At the back of the shop \u00b7 the stair door</div>' + (spout ? lampMark(spout) : "") +
      "<p>" + (spout === "left" ? "A low door at the back, with a stair behind it going up to the room over the shop. Scratched small into the wood beside it: a lamp. The lamp’s spout points left. Yoel’s pointed right." : spout === "right" ? "A low door at the back, behind his bench, with a stair going up to the room over the shop. Scratched small into the wood beside it: a lamp, its spout to the right." : "A low door at the back, with a stair going up to the room over the shop. Plain wood, a brass number, nothing scratched in it.") + "</p>" +
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
    if (has("key")) { K.say("He nods at the stair door behind his bench. “It is open for you.”", "", 3000); return; }
    K.card('<div class="kick">The watch-repair shop</div><img class="e2-face" src="' + PP + 'watchmaker.jpg" alt=""><h2>The watchmaker</h2>' + (miss ? '<p class="e2-said"><b>The watchmaker</b> \u201cThat one is new. He never owned anything new.\u201d</p>' : "<p>He puts down his loupe.</p>") +
      '<p class="e2-said"><b>The watchmaker</b> “He said you would come on the fast. He said you would carry two rods. Show me his.”</p>' +
      '<div class="e2-rods"><button class="e2-rod" data-act="a">' + rodSVG(false) + "<span>The first rod</span></button>" +
      '<button class="e2-rod" data-act="b">' + rodSVG(true) + "<span>The second rod</span></button></div>" +
      '<p class="fsmall">Look closely at the grips before you choose.</p><button class="cta alt" data-act="x">Not yet</button>',
      { a: () => { K.snd("bad"); K.buzz("error"); set("rodMiss", (E().f.rodMiss || 0) + 1); watchmaker(true); },
        b: () => { F.S("rod", "click", 0.6); K.buzz("success"); give("key");
          K.card('<div class="kick">The watch-repair shop</div>' + clip("watchmaker-key") + '<p>He turns it once, nods, and gives it back with a key on a loop of string. He tips his head at the low door behind his bench.</p><button class="cta" data-act="x">Up the stair</button>',
            { x: () => walk(byId("chain").views.find((x) => x.id === "room")) }); },
        x: () => {} });
  }
  ACT.photo = () => { set("r4"); K.card('<div class="kick">On the sill</div><h2>A photograph, face down</h2>' + OBJ("e2-photo") + '<p>Turned over: a young woman laughing on the steps of a building you recognise, the Temple Institute. No name on the back.</p><p class="fsmall">You put it back face down, the way he left it.</p><button class="cta" data-act="x">Back</button>', { x: after }); };
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
  /* what the player finds on each page when they look closely: the wording, the date, the signatures */
  const LOOK = {
    A: ["“…have this day concluded and signed the present Treaty.” Past tense. Finished.", "Dated in full: day, month and year.", "Two signatures, two witnesses, two seals."],
    B: ["“…will begin negotiations toward a framework.” Future tense. A plan to talk.", "Dated. A date on a promise is still a promise.", "Signed by two ministers. What they signed is a promise."],
    C: ["“An agreement has been concluded,” and then, “it will be signed.” Both, in one sentence.", "Dated the day of the statement. The ceremony is set for two weeks later.", "No signatures yet. Only the announcement."],
    D: ["“The parties have held talks concerning a framework for…” and then the tear.", "Where the date would be, there is no paper.", "Torn away with the rest."],
  };
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
      '<p class="fsmall">Pick up a page. Read it closely, judge it, then slide it under the first frame.</p><button class="cta alt" data-act="x">Leave the table</button>',
      { dA: () => page("A"), dB: () => page("B"), dC: () => page("C"), dD: () => page("D"), x: () => {} });
    /* a page in the hand: look at the wording, the date and the signatures, then make the call before the frame does */
    function page(k, seen) {
      const D = DOCS[k], L = LOOK[k]; seen = seen || [0, 0, 0]; K.sfx("click");
      if (r[k]) return slide(k);
      const all = seen[0] && seen[1] && seen[2], names = ["The wording", "The date", "The signatures"];
      const acts = { x: ACT.c1 };
      [0, 1, 2].forEach((i) => (acts["k" + i] = () => { const n = seen.slice(); n[i] = 1; F.S("parchment", "click", 0.4); page(k, n); }));
      const call = (v) => () => { set("c1call:" + k, v); if (D[2] === "rule") return rule(); slide(k, v); };
      acts.vl = call("lit"); acts.vd = call("dark"); acts.vg = call("grey");
      K.card('<div class="kick">In your hand</div><div class="e2-paper' + (k === "D" ? " torn" : "") + '"><b>' + esc(D[0]) + "</b>" +
        [0, 1, 2].map((i) => '<button class="e2-look' + (seen[i] ? " seen" : "") + '" data-act="k' + i + '"><em>' + names[i] + "</em>" + (seen[i] ? "<span>" + esc(L[i]) + "</span>" : "<span class=\"q\">Tap to look closely</span>") + "</button>").join("") + "</div>" +
        (all ? '<h2 class="e2-q">What is it?</h2><div class="e2-calls"><button data-act="vl">A thing done</button><button data-act="vd">Only promised</button><button data-act="vg">Cannot tell</button></div>'
          : '<p class="fsmall">Look at all three before you judge it.</p>') +
        '<button class="cta alt" data-act="x">Put it down</button>', acts);
    }
    function slide(k, called) {
      const D = DOCS[k]; K.sfx("click");
      if (D[2] === "rule" && !r.C) return rule();
      r[k] = D[2] === "rule" ? "lit" : D[2]; set("c1r", r); F.S(r[k] === "lit" ? "harp" : "knock", null, 0.5);
      const SAID = { lit: "a thing done", dark: "only promised", grey: "impossible to tell" }, DOES = { lit: "The frame lights.", dark: "The frame stays dark.", grey: "The frame goes grey." };
      const verdict = !called ? "" : '<p class="fsmall">' + (called === r[k] ? "You called it " + SAID[called] + ". " + DOES[r[k]] : "You called it " + SAID[called] + ". " + DOES[r[k]] + " Look again at why.") + "</p>";
      K.card('<div class="kick">Under the first frame</div><h2>' + esc(D[0]) + "</h2>" + '<div class="e2-frames"><i class="e2-frame on ' + r[k] + '"><small>נעשה</small><b>Done</b></i></div>' + verdict +
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
    if (!flag("instSeen")) { set("instSeen"); return K.card('<div class="kick">On the end of the table</div><h2>Yoel\u2019s instrument</h2>' + OBJ("e2-instrument") +
      "<p>Brass, the size of a dinner plate. A ring that turns around a centre plate, a small red pointer at the top, a worn push-button, and beside it three empty seats where parts are missing.</p>" +
      '<button class="cta" data-act="x">Turn the ring</button>', { x: ACT.ring }); }
    let at = E().f.ringAt || 1; const m = E().f.ringMarks || [];
    const draw = () => K.card('<div class="kick">Yoel’s instrument · a model, not a machine</div><h2>The ring of Av</h2>' + ringSVG(at, m) +
      '<div class="e2-step big"><button data-act="b7">«</button><button data-act="b1">‹</button><em>' + at + ' Av</em><button data-act="f1">›</button><button data-act="f7">»</button></div>' +
      '<p class="fsmall">' + (m.length === 0 ? "The second book’s drawing marks seventeen days on this ring. Turn it, and mark where they begin." : m.length === 1 ? "Now turn to where they end, and mark it." : "") + "</p>" +
      '<div class="fsay"><button data-act="mk">Mark this day</button></div>' +
      '<p class="fsmall e2-slot">Beside it, three empty seats. One is labelled in his hand: <i>the days, as men count them.</i> The Hebrew calendar is calculated; this instrument only shows what he worked out.</p>' +
      '<button class="cta alt" data-act="x">Leave it</button>',
      { b7: () => step(-7), b1: () => step(-1), f1: () => step(1), f7: () => step(7), x: () => {},
        mk: () => { K.sfx("click");
          if (m.length === 0) { if (at !== 11) { K.say("The Lamplighter left seventeen days blank. Where did his block begin?", "", 3800); return draw(); } m.push(11); set("ringMarks", m); return draw(); }
          if (at !== 27) { K.say("Seventeen days, counting the eleventh itself.", "", 3600); return draw(); }
          m.push(27); set("ringMarks", m); set("ring"); F.S("lock", "click", 0.8); K.buzz("success"); set("book:trumpet");
          K.card('<div class="kick">Yoel’s instrument</div>' + ringSVG(27, m) + "<p>Seventeen days. Without the three missing parts you can mark them, but not place them. Somewhere in this city is the rest of his instrument.</p>" +
            "<p>The second book’s next page shows a drawing of a carved stone, and three words: <i>The trumpeting place.</i></p>" + '<button class="cta" data-act="x">Back</button>', { x: () => walk(view) }); } });
    const step = (d) => { at = ((at - 1 + d + 30) % 30) + 1; set("ringAt", at); K.sfx("click"); draw(); };
    draw();
  };
  ACT.sunset = () => {
    if (flag("open")) return endAct();
    if (!flag("heard:e2-1-sunset")) return yoelCard("e2-1-sunset", ACT.sunset, "Watch the sun go");
    let at = 27, sun = 0, gone = false, timer = 0, pressed = false;
    const box = document.createElement("div"); box.className = "e2-sunset";
    box.innerHTML = '<div class="e2-sky"><video class="e2-skyv" src="video/fsy/roof-sunset.mp4" poster="video/fsy/roof-sunset.jpg" muted playsinline preload="auto"></video><div class="e2-sun" id="e2sun"></div><div class="e2-roofs"></div><div class="e2-sunstate" id="e2state">The sun is still up.</div></div>' +
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
    /* the sun goes down in Richard's clip, played at half speed; the sun is under the hills by 2.6 s of the clip.
       If the clip cannot play, the drawn sky does the same job. */
    const v = box.querySelector(".e2-skyv"); let drawn = false;
    const drawSky = () => { if (drawn || gone) return; drawn = true; v.remove(); box.classList.remove("vid");
      timer = setInterval(() => { if (!box.isConnected) return clearInterval(timer); sun = Math.min(100, sun + 2); if (sun >= 100) { gone = true; clearInterval(timer); } sky(); }, 300); };
    box.classList.add("vid");
    v.addEventListener("error", drawSky);
    v.addEventListener("timeupdate", () => { if (!gone && v.currentTime >= 2.6) { gone = true; sky(); } });
    v.addEventListener("loadedmetadata", () => { v.playbackRate = 0.5; });
    const p = v.play(); if (p && p.catch) p.catch(drawSky); else if (!p) setTimeout(() => { if (v.paused) drawSky(); }, 1500);
    v.playbackRate = 0.5;
  };
  function endAct() {
    E().done.roof = 1; save();
    K.card('<div class="kick">The Final Seven Years · Episode 2</div><div class="e2-acttitle"><small>Act 1 · The Ninth of Av</small><b>Complete</b></div>' +
      "<p>Seventeen days of watching. Two of them circled.</p>" +
      '<button class="cta" data-act="n">Go on to Act 2 · The Trumpeting Stone</button><button class="cta alt" data-act="x">Back to the episodes</button><button class="cta alt" data-act="again">Play Act 1 again from the start</button>',
      { n: () => go("b1"), x: () => K.shut(), again: () => { Lamp.state.ep2 = null; save(); start(); } });
  }

  /* ------------------------------------------------------------ journal and backpack ------------------------------------------------------------ */
  const NOTES = { haller: [], lamplighter: [], yoel: [] };
  function note(who, text) { const n = E().f.notes || {}; n[who] = n[who] || []; if (!n[who].includes(text)) n[who].push(text); set("notes", n); }
  function journal() {
    const pages = BOOKP.filter((p) => flag("book:" + p[0]));
    const n = E().f.notes || {};
    const people = [["haller", "Victor Haller"], ["lamplighter", "The Lamplighter"]].filter((p) => (n[p[0]] || []).length);
    K.card('<div class="kick">The journal</div><h2>The second book</h2>' +
      (pages.length ? pages.map((p) => '<div class="e2-page"><b>' + esc(p[1]) + "</b><p>" + esc(p[0] === "meas" ? "From the stone to Yoel’s lamp: " + (MEAS[E().f["b:meas"]] || "not measured") + "." : p[2]) + "</p>" + (p[0] === "diagram" ? dialSVG(4) : "") + "</div>").join("") : "<p>Nothing yet.</p>") +
      (people.length ? '<h2 class="e2-q">People</h2>' + people.map((p) => '<div class="e2-page"><b>' + p[1] + "</b>" + n[p[0]].map((t) => "<p>" + esc(t) + "</p>").join("") + "</div>").join("") : "") +
      (scrollHeld() ? '<button class="cta alt" data-act="s">The torn scroll</button>' : "") +
      '<p class="fsmall">No verdicts. Those are yours.</p><button class="cta" data-act="x">Close</button>', { x: () => {}, s: scrollPage });
  }
  /* the torn scroll has its own page (Richard, 12 Nov 2026). The halves come from Episode 1; the clock is found here, at the watchmaker's. */
  function scrollHeld() { try { const s = Lamp.fsyWalk.scrollState(); return s.n > 0 || s.clock; } catch (e) { return flag("b:clock"); } }
  function scrollPage() {
    let h = ""; try { h = Lamp.fsyWalk.scrollHTML(); } catch (e) {}
    K.card('<div class="kick">The journal</div><h2>The torn scroll</h2>' + h + '<button class="cta alt" data-act="j">Back to the journal</button><button class="cta" data-act="x">Close</button>', { x: () => {}, j: journal });
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
      return '<text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="middle" font-size="' + (d === at ? 15 : 11) + '" font-weight="' + (d === at ? 800 : 600) + '" fill="' + (isMark ? "#9E2416" : inWin ? "#5A3F0C" : "#2E2208") + '" font-family="Georgia, serif">' + d + "</text>";
    }).join("");
    const ticks = AV.map((d, i) => { const a = ((i - (at - 1)) / 30) * 2 * Math.PI, s = Math.sin(a), c = Math.cos(a); return '<path d="M' + (110 + 99 * s).toFixed(1) + " " + (110 - 99 * c).toFixed(1) + "L" + (110 + 103 * s).toFixed(1) + " " + (110 - 103 * c).toFixed(1) + '" stroke="#5A3F0C" stroke-width="1.4"/>'; }).join("");
    return '<svg class="e2-ring" viewBox="0 0 220 220" aria-hidden="true"><defs>' +
      '<radialGradient id="e2br" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#F3DA8C"/><stop offset=".55" stop-color="#C99A3C"/><stop offset="1" stop-color="#8A6418"/></radialGradient>' +
      '<radialGradient id="e2bi" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#D9B458"/><stop offset=".7" stop-color="#A97C26"/><stop offset="1" stop-color="#7A5712"/></radialGradient></defs>' +
      '<circle cx="110" cy="110" r="107" fill="#4A3308"/><circle cx="110" cy="110" r="104" fill="url(#e2br)" stroke="#6A4A0E" stroke-width="2"/>' + ticks +
      '<circle cx="110" cy="110" r="70" fill="#4A3308"/><circle cx="110" cy="110" r="68" fill="url(#e2bi)" stroke="#6A4A0E" stroke-width="1.5"/><circle cx="110" cy="110" r="60" fill="none" stroke="#6A4A0E" stroke-width=".8" opacity=".6"/>' +
      '<circle cx="110" cy="150" r="5" fill="#8A6418" stroke="#4A3308"/><circle cx="110" cy="150" r="1.6" fill="#3A2806"/>' +
      '<path d="M110 2 l-7 14 h14z" fill="#B23A2A" stroke="#6A1E14" stroke-width="1"/>' + items + '<text x="110" y="106" text-anchor="middle" font-size="15" font-weight="800" fill="#3A2806">אב</text><text x="110" y="124" text-anchor="middle" font-size="11" font-weight="600" fill="#3A2806">Av 5787</text></svg>';
  }

  /* ============================================================ ACT 2 · THE TRUMPETING STONE (prototype) ============================================================
     Script: the Claude Doc "Episode 2, Act 2: The Trumpeting Stone — Script" (second draft, Gerry 8.5/10, 12 Nov 2026).
     Stand-in pictures from Episode 1 (the Robinson's Arch and Jaffa Gate photographs); Yoel's four lines and the President's radio line show as text until recorded. */
  const A2 = ["b1", "b2", "b3", "b4", "b5", "b6"];
  const actOf = (id) => (A2.includes(id) ? 2 : 1);
  const ACTNAME = { 1: "Act 1 · The Ninth of Av", 2: "Act 2 · The Trumpeting Stone" };
  Object.assign(LINES, {
    "e2-2-stone": "They found this stone where it fell, at the foot of the south-west corner. It says: to the place of trumpeting. A priest stood up there and sounded the trumpet when the Sabbath came in, and again when it went out. Josephus tells it. Some say the stone was that priest's very place. It is proposed, not proven. But I needed somewhere to keep the part that tells where the day turns, and I could think of no better address.",
    "e2-2-c2": "The verse does not say he makes a covenant. It says he makes one strong. So the second question is not who is named. Any clerk can type a name. It is whose hand made it strong. Look at each page the way my friend downstairs looks at a watch. Then tell me whether the man himself did this.",
    "e2-2-plate": "Midnight is a clerk's invention. Here the day turns when the sun goes, and the minute of sunset changes through the season. I wrote down the minute for each of the seventeen days. When the news comes, you will need to know which side of the line it fell on.",
    "e2-2-thirteen": "I circled this day and I was afraid of it. A whole city can be wrong together, and happy. Two frames are lit. You do not know the other three questions yet, so you do not know the answer. Neither do they.",
  });
  ITEMS.coffee = ["Haller's coffee, 23A", "From the airport. Untouched."];
  Object.assign(ITEMS, {
    loupe: ["The watchmaker's loupe", "Off his own forehead. “A signature is like a watch. From across the room they all look the same.”"],
    pages: ["Four signed pages", "Left with the watchmaker by Yoel, for the second frame."],
    bcase: ["A brass case", "Flat, the size of a book. On its lid, a small model of the corner of the Mount. No keyhole."],
    plate: ["The sunset plate", "Seated beside the ring. Seventeen lines: the minute the sun goes, for each day Yoel marked."],
    sheet: ["Framework of Peace · Second Phase", "The printed sheet they were handing out at Jaffa Gate on 13 Av."],
    coffee2: ["Haller's coffee, TABLE", "From Jaffa Gate at sunset on Monday, as 13 Av ended. Untouched. He knows where you sat."],
  });
  BOOKP.push(
    ["stone", "The stone", "A squared stone with a niche cut in one corner. “From the cut corner, along the kerb, to my lamp. Measure it. You will need the number.”"],
    ["diagram", "Yoel's diagram", "A plan of the corner with eight ticks, each marked with a Hebrew letter. His line runs to the tick marked ה (he)."],
    ["comfort", "The Sabbath of Comfort", "Shabbat Nachamu, the Sabbath after the Ninth of Av. “Comfort ye, comfort ye my people, saith your God.” Isaiah 40:1–2. The seventeen days open on it."],
    ["preacher", "The street preacher", "Outside Jaffa Gate, a man with a Bible in his hand: “And when these things begin to come to pass, then look up, and lift up your heads; for your redemption draweth nigh.” Luke 21:28."],
    ["clock", "The preacher's clock", "Left at the watchmaker's by the man from Jaffa Gate. It does not run. Three marks before twelve, and a paper in the back: 2 Thessalonians 2:3. A falling away first; that man of sin revealed; then that day. The hand stands a hair short of the second mark."],
    ["c2", "The second question: Who made it strong?", "Not a machine. Not a deputy. His own hand, or his own voice on the record. “A pen, a seal, a voice on a reel: I do not ask which. I ask whether the act was his own.”"],
    ["meas", "The measurement", ""],
    ["plate", "The sunset plate", "The day turns at sunset, and the minute changes every evening. Each line is the sunset that begins a Hebrew day. Two parts are still missing."],
    ["strong", "Made strong", "'And he shall confirm the covenant with many for one week.' Daniel 9:27. On 13 Av the President said: 'What was begun, I have made strong.'"],
    ["phase", "Second Phase", "The sheet calls it the second phase of the accords of the preceding years, now strengthened. The map on Haller's wall had a clipped sheet headed Phase 2, with question marks. The question marks are gone."],
    ["t13", "13 Av · the Framework of Peace", "Done: lit. Made strong: lit, by his own voice. Three questions I have not been taught. Not confirmed under Yoel's test."],
    ["table", "TABLE", "Haller raised a coffee at Jaffa Gate and left a second one on the ledge. The label said TABLE. He knows where I sat."]
  );
  const MEAS = { "3.1": "three cubits and a hand", "4.2": "four cubits and two hands" };
  const SUNSET = { 11: ["Fri 13 August", "7:26"], 12: ["Sat 14 August", "7:25"], 13: ["Sun 15 August", "7:24"], 14: ["Mon 16 August", "7:23"], 15: ["Tue 17 August", "7:22"], 16: ["Wed 18 August", "7:20"], 17: ["Thu 19 August", "7:19"], 18: ["Fri 20 August", "7:18"], 19: ["Sat 21 August", "7:17"], 20: ["Sun 22 August", "7:16"], 21: ["Mon 23 August", "7:15"], 22: ["Tue 24 August", "7:14"], 23: ["Wed 25 August", "7:13"], 24: ["Thu 26 August", "7:11"], 25: ["Fri 27 August", "7:10"], 26: ["Sat 28 August", "7:09"], 27: ["Sun 29 August", "7:08"] }; /* provisional: to be checked against a published table */
  const HEB = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"];

  SC.push(
    { id: "b1", title: "Yoel's room · the Sabbath, 11 Av", act: "Scene 1", music: null, amb: "indoor",
      task: () => (!flag("b:book") ? "The Sabbath. The watchmaker is closed until dark. Read." : !flag("b:preacher") ? "Hours until dark. Walk out as far as Jaffa Gate." : !flag("b:stars") ? "Back in Yoel’s room: wait at the window for three stars." : "Done."),
      views: [{ id: "room", img: "yoel-room-sabbath", cap: "Yoel's room on the Sabbath morning. The street below is quiet", go: { fwd: "gate" },
        hots: [{ box: [36, 9, 30, 30], label: "The window", act: "bwindow" }, { box: [68, 51, 17, 6], label: "The second book", act: "bbook" },
          { box: [73, 40, 19, 10], label: "The five frames", act: "bframes" }, { box: [63, 42, 9, 9], label: "Yoel's instrument", act: "binst" },
          { box: [91, 12, 9, 60], label: "The stair door", act: "bstair" }] },
        { id: "gate", img: "jaffa-preacher", cap: "Outside Jaffa Gate on the Sabbath afternoon. A man with a Bible in his hand is preaching", go: { back: "room" }, need: "b:book",
          hots: [{ box: [48, 18, 46, 78], label: "The street preacher", act: "bpreacher" }] }] },
    { id: "b2", title: "After the Sabbath", act: "Scene 2", music: "e2-table", amb: "indoor",
      task: () => (!has("pages") ? "Three stars. Go down to the watchmaker." : !flag("c2") ? "At Yoel's table: the second frame." : "Done."),
      views: [{ id: "shops", img: "chain-shops-night", cap: "The street after dark. The watchmaker's shutter is half up, his lamp lit", go: { fwd: "room" },
          hots: [{ box: [70, 38, 27, 46], label: "The watch-repair shop", act: "bwatch" }] },
        { id: "room", img: "yoel-room-night", cap: "Yoel's table at night", go: { back: "shops" }, need: "pages",
          hots: [{ box: [72, 40, 20, 14], label: "The second frame", act: "c2" }, { box: [64, 43, 7, 8], label: "Yoel's instrument", act: "binst" }] }] },
    { id: "b3", title: "The fallen stones · 12 Av", act: "Scene 3", music: "e2-chain", amb: "street",
      task: () => (!flag("b:lamp") ? "Find the stone in the drawing. Follow the kerb to Yoel's lamp." : !flag("b:meas") ? "Measure from the stone to the lamp with the rod." : !has("bcase") ? "Take what is hidden under the lamp." : "Done."),
      views: [{ id: "ticket", img: "excavation-ticket", cap: "The excavations at the south-west corner of the Mount", go: { fwd: "street" },
          hots: [{ box: [0, 42, 22, 38], label: "The ticket window", act: "bticket" }] },
        { id: "street", img: "excavation-street", cap: "The paved street under the wall. High up, the stub of Robinson's Arch", go: { back: "ticket", fwd: "stones" },
          hots: [{ box: [50, 0, 20, 40], label: "The corner above", text: "The south-west corner of the Mount, against the sky. The sun is over your shoulder. Up there, they say, a priest stood with a trumpet.", f: "b:corner" }] },
        { id: "stones", img: "fallen-stones", cap: "The heap of fallen stones, left where they fell", go: { back: "street" },
          hots: [{ box: [2, 44, 38, 44], label: "The inscribed stone", act: "bstone" }, { box: [2, 90, 36, 9], label: "The sign beside it", act: "bsign" },
            { box: [41, 75, 15, 11], label: "A fallen block", act: "bblock:1" }, { box: [57, 74, 11, 10], label: "A fallen block", act: "bblock:2" }, { box: [68, 73, 11, 9], label: "A fallen block", act: "bblock:3" },
            { box: [79, 72, 10, 8], label: "A fallen block", act: "bblock:4" }, { box: [89, 70, 9, 8], label: "A fallen block", act: "bblock:5" },
            { box: [40, 86, 58, 6], label: "The kerb: measure with the rod", act: "bmeasure" }] }] },
    { id: "b4", title: "The brass case · 12 Av, late afternoon", act: "Scene 4", music: "e2-table", amb: "indoor",
      task: () => (!flag("b:open") ? "Open the brass case. How far. Which way. When." : !flag("b:plate") ? "Seat the plate beside the ring." : "Done."),
      views: [{ id: "table", img: "yoel-room-dusk", cap: "Back at Yoel's table, the brass case in the last of the light",
        hots: [{ box: [69, 48, 12, 6], label: "The brass case", act: "bcase" }, { box: [62, 42, 7, 6], label: "Yoel's instrument", act: "binst" }] }] },
    { id: "b5", title: "The thirteenth of Av", act: "Scene 5", music: "e2-chain", amb: "market",
      task: () => (!has("sheet") ? "The first circled day. Go and listen." : !flag("b:t13") ? "Take the sheet back to Yoel's table and test it." : "Done."),
      views: [{ id: "gate", img: "jaffa-celebration", cap: "Jaffa Gate: white bunting, olive branches, strangers shaking hands", go: { fwd: "table" },
          who: [{ id: "avi", name: "Avi's booth", act: "bavi" }],
          hots: [{ box: [0, 48, 55, 34], label: "The crowd", text: "A man is pouring wine into paper cups. Children run in a ring round the grown-ups. Car horns, all the way down the Jaffa Road.", f: "b:crowd" },
            { box: [56, 50, 44, 48], label: "Two old men, embracing", text: "Two old men hold each other and do not let go. Someone beside you says: I never thought I would live to see this. A newspaper seller goes by. His front page is one word: PEACE.", f: "b:news" }] },
        { id: "table", img: "yoel-room", cap: "Yoel's table, the ring on 13 Av", go: { back: "gate" }, need: "sheet",
          hots: [{ box: [70, 40, 22, 15], label: "The frames", act: "btest" }, { box: [66, 56, 26, 8], label: "Yoel's instrument", act: "binst" }] }] },
    { id: "b6", title: "Jaffa Gate · Monday at sunset", act: "Scene 6", music: "e2-chain", amb: "market",
      task: () => (!flag("b:end") ? "Nothing more at the table tonight. Walk through the celebration." : "Done."),
      views: [{ id: "gate", img: "jaffa-dusk", cap: "The last of the sun on the gate. Lanterns being lit, a band, dancing in the square",
        who: [{ id: "haller", name: "At the edge of the crowd", act: "bhaller" }],
        hots: [{ box: [20, 45, 50, 30], label: "The dancing", text: "A ring of dancers, hands on shoulders, going round faster than the band. Somebody pulls you in for half a turn and lets you go.", f: "b:dance" }] }] }
  );
  Object.assign(DONE, {
    b1: () => flag("b:book") && flag("b:preacher") && flag("b:stars"), b2: () => flag("c2"), b3: () => has("bcase") && flag("b:meas"),
    b4: () => flag("b:plate"), b5: () => flag("b:t13"), b6: () => flag("b:end"),
  });

  /* the five frames as they stand in Act 2: 1 lit, 2 as learned, 3 to 5 covered (unopened, not dark) */
  function framesRow(two, one) {
    const st = [one || "lit", two === undefined ? (flag("c2") || flag("c2open") ? "" : "shut") : two, "shut", "shut", "shut"], lab = [["נעשה", "Done"], ["הגביר", "Strong"]];
    return '<div class="e2-frames a2">' + st.map((s, i) => '<i class="e2-frame on ' + s + '">' + (s === "shut" ? "<small>•</small><b>shut</b>" : "<small>" + lab[i][0] + "</small><b>" + lab[i][1] + "</b>") + "</i>").join("") + "</div>";
  }
  ACT.bframes = () => K.card('<div class="kick">On the table</div><h2>Five brass frames</h2>' + framesRow() +
    "<p>The first frame is open. The others are covered with small brass shutters. " + (flag("c2") ? "The second shutter has lifted: <i>Who made it strong?</i>" : "They do not move.") + "</p>" +
    '<p class="fsmall">A shut frame is a question you have not been taught. It is not a failed test.</p><button class="cta" data-act="x">Back</button>', { x: after });
  /* the instrument in Act 2: the ring, and three seats for the missing parts */
  ACT.binst = () => {
    let at = flag("b:end") ? 14 : flag("b:t13") || has("sheet") ? 13 : 11;
    const draw = () => {
      const s = SUNSET[at];
      K.card('<div class="kick">Yoel’s instrument</div><h2>The ring of Av</h2>' + ringSVG(at, [11, 27]) +
        '<div class="e2-step big"><button data-act="l" aria-label="One day back">‹</button><em>' + at + ' Av</em><button data-act="r" aria-label="One day on">›</button></div>' +
        (flag("b:plate") ? '<p class="e2-sunline">' + (s ? "Sunset that begins " + at + " Av: <b>" + s[0] + ", " + s[1] + " p.m.</b>" : "Outside the seventeen days. The plate has no line for it.") + "</p>" : "") +
        '<div class="e2-seats"><span class="' + (flag("b:plate") ? "in" : "") + '"><b>' + (flag("b:plate") ? "☀" : "") + "</b><em>where the day turns</em></span><span><b></b><em>the days, as men count them</em></span><span><b></b><em>the long count</em></span></div>" +
        '<p class="fsmall">' + (flag("b:plate") ? "The sunset plate is seated. Two seats are still empty." : "Three empty seats beside the ring, each a different shape, labelled in his hand.") + '</p><button class="cta" data-act="x">Back</button>',
        { l: () => { at = at <= 1 ? 30 : at - 1; draw(); }, r: () => { at = at >= 30 ? 1 : at + 1; draw(); }, x: after });
    };
    draw();
  };
  /* Scene 1: the Sabbath */
  ACT.bwindow = () => {
    if (flag("b:book") && flag("b:preacher") && !flag("b:stars")) return stars();
    set("b:w");
    const comfort = () => { if (flag("book:comfort")) return after(); set("book:comfort");
      K.card('<div class="kick">Through the window</div><h2>The Sabbath of Comfort</h2><p>From a synagogue down the street, a single voice reading. Today is the Sabbath after the Ninth of Av. They call it Shabbat Nachamu, after the first words of the reading:</p>' +
        F.wnote("Comfort ye, comfort ye my people, saith your God. Speak ye comfortably to Jerusalem, and cry unto her, that her warfare is accomplished, that her iniquity is pardoned.") +
        '<p class="fsmall">Isaiah 40:1–2. The seventeen days open on the Sabbath of Comfort.</p><button class="cta" data-act="x">Back</button>', { x: after }); };
    K.card('<div class="kick">The window</div><h2>The Street of the Chain</h2><p>Quiet. The watchmaker’s shutter is down, and so are most of the others. The painted clock still reads 9:27. Further along, one café has its door open.</p>' +
      "<p>A grey car is parked where no car should be. Nobody is in it.</p><p class=\"fsmall\">You heard its door last night.</p>" + '<button class="cta" data-act="x">' + (flag("book:comfort") ? "Back" : "Listen") + "</button>", { x: comfort });
  };
  /* the street preacher outside Jaffa Gate (Richard's own meeting; he is never named) */
  ACT.bpreacher = () => {
    const verse = F.wnote("And when these things begin to come to pass, then look up, and lift up your heads; for your redemption draweth nigh.") + '<p class="fsmall">Luke 21:28</p>';
    if (flag("b:preacher")) { K.card('<div class="kick">Outside Jaffa Gate</div><img class="e2-face" src="' + PP + 'preacher.jpg" alt=""><h2>The street preacher</h2><p>He is still there, the Bible open in his hand, preaching to whoever passes.</p>' + verse + '<button class="cta" data-act="x">Back</button>', { x: after }); return; }
    K.card('<div class="kick">Outside Jaffa Gate</div><img class="e2-face" src="' + PP + 'preacher.jpg" alt=""><h2>A street preacher</h2><p>A man stands by the wall outside the gate with a Bible in his hand, preaching to whoever passes. Most do not stop. He does not seem to mind.</p>' + verse + (scrollHeld() && !flag("b:clock") ? "<p>The margins of his Bible are full of pencil. The hand looks like the hand on the torn scroll.</p>" : "") +
      '<div class="fsay"><button data-act="h">Shake his hand and thank him</button></div><button class="cta alt" data-act="x">Walk on</button>',
      { h: () => { set("b:preacher"); set("book:preacher"); K.buzz("success");
          K.card('<div class="kick">Outside Jaffa Gate</div><h2>The street preacher</h2><p>You shake his hand and thank him. He nods, and goes back to the verse.</p><p>You walk in through the gate, into the Old City, toward the Jewish Quarter.</p><button class="cta" data-act="x">Back to Yoel’s room</button>', { x: () => walk(byId("b1").views[0]) }); },
        x: () => { set("b:preacher"); set("book:preacher"); K.say("His voice follows you in through the gate.", "", 3000); walk(byId("b1").views[0]); } });
  };
  function stars() {
    let n = 0;
    const draw = () => K.card('<div class="kick">The window, at dusk</div><h2>Three stars</h2><div class="e2-dusk">' + [0, 1, 2].map((i) => '<i class="' + (i < n ? "on" : "") + '" style="left:' + [22, 58, 78][i] + "%;top:" + [30, 18, 44][i] + '%"></i>').join("") + "</div>" +
      "<p>" + ["The light goes out of the stone. Over the Mount, the sky is still pale.", "One.", "Two.", "Three. Below you, a shutter rattles up."][n] + "</p>" +
      (n < 3 ? '<button class="cta" data-act="s">Look for a star</button>' : '<button class="cta" data-act="x">Go down</button>'),
      { s: () => { n++; K.sfx("click"); if (n === 3) { set("b:stars"); F.S("door", null, 0.5); } draw(); }, x: after });
    draw();
  }
  ACT.bstair = () => {
    set("b:note");
    K.card('<div class="kick">The stair door</div><h2>A note, pushed under it</h2>' + F.wnote("After the Sabbath. Three stars. Bring the book.") +
      '<p>The watchmaker’s hand.</p><p class="fsmall">The excavations are closed until tomorrow in any case.</p><button class="cta" data-act="x">Back</button>', { x: after });
  };
  function stoneSVG() {
    return '<svg class="e2-draw" viewBox="0 0 300 150" aria-hidden="true"><rect width="300" height="150" fill="#F1E7CC"/><path d="M40 50h190v60H40z" fill="none" stroke="#3A2A14" stroke-width="2.5"/>' +
      '<path d="M40 50h34v26H40z" fill="#E0D2AE" stroke="#3A2A14" stroke-width="2"/><text x="150" y="88" text-anchor="middle" font-size="19" fill="#3A2A14" font-family="serif">לבית התקיעה לה…</text>' +
      '<path d="M228 50l8 12-6 10 8 14-8 12 6 12" fill="none" stroke="#3A2A14" stroke-width="2"/><path d="M40 122h230" stroke="#8A6A3A" stroke-width="3"/><path d="M40 116v12" stroke="#3A2A14" stroke-width="1.5"/><text x="44" y="142" font-size="11" fill="#5A4420" font-style="italic">the cut corner</text><text x="262" y="142" text-anchor="end" font-size="11" fill="#5A4420" font-style="italic">the kerb →</text></svg>';
  }
  function dialSVG(sel, big) {
    const ticks = HEB.map((h, i) => { const a = (-90 + i * 45) * Math.PI / 180, x = 100 + 74 * Math.cos(a), y = 100 + 74 * Math.sin(a);
      return '<line x1="' + (100 + 56 * Math.cos(a)).toFixed(1) + '" y1="' + (100 + 56 * Math.sin(a)).toFixed(1) + '" x2="' + (100 + 62 * Math.cos(a)).toFixed(1) + '" y2="' + (100 + 62 * Math.sin(a)).toFixed(1) + '" stroke="#3A2A14" stroke-width="2"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 6).toFixed(1) + '" text-anchor="middle" font-size="17" font-family="serif" fill="' + (sel === i ? "#9E2416" : "#3A2A14") + '" font-weight="' + (sel === i ? 800 : 500) + '">' + h + "</text>"; }).join("");
    const a = sel == null ? null : (-90 + sel * 45) * Math.PI / 180;
    return '<svg class="e2-draw dial' + (big ? " big" : "") + '" viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" fill="#F1E7CC"/><circle cx="100" cy="100" r="56" fill="none" stroke="#8A6A3A" stroke-width="1.5"/>' + ticks +
      '<path d="M100 100h-56v-10h46v-46h10z" fill="#D9C79A" stroke="#3A2A14" stroke-width="1.5"/><circle cx="100" cy="100" r="4" fill="#3A2A14"/>' +
      (a == null ? "" : '<line x1="100" y1="100" x2="' + (100 + 54 * Math.cos(a)).toFixed(1) + '" y2="' + (100 + 54 * Math.sin(a)).toFixed(1) + '" stroke="#9E2416" stroke-width="2.5"/>') + "</svg>";
  }
  ACT.bbook = () => {
    const show = () => K.card('<div class="kick">The second book · the next strip</div><h2>A stone, and a plan</h2>' + stoneSVG() +
      F.wnote("From the cut corner, along the kerb, to my lamp. Measure it. You will need the number.") + dialSVG(4) +
      '<p class="fsmall">Beside it, a small plan of the corner seen from above, with eight ticks, each marked with a Hebrew letter. His line runs to one of them. The journal copies both.</p>' +
      '<button class="cta" data-act="x">Back</button>', { x: after });
    if (flag("b:book")) return show();
    set("b:book"); set("book:stone"); set("book:diagram");
    yoelCard("e2-2-stone", show, "Look at the drawing");
  };
  /* Scene 2: the watchmaker, and the second frame */
  ACT.bwatch = () => {
    const face = '<img class="e2-face" src="' + PP + 'watchmaker.jpg" alt="">', said = (t) => '<p class="e2-said"><b>The watchmaker</b> “' + t + "”</p>";
    if (has("pages")) { K.card('<div class="kick">The watch-repair shop</div>' + face + said("Go up. Look at them the way I look at a watch.") +
      '<div class="fsay"><button data-act="k">' + (flag("b:clock") ? "Look at the preacher’s clock again" : "Ask about the clock on the shelf that is not running") + '</button></div><button class="cta" data-act="x">Back</button>', { x: () => {}, k: ACT.bclock }); return; }
    K.card('<div class="kick">The watch-repair shop</div>' + face + "<h2>The watchmaker</h2>" + said("He left me four pages and one instruction. Do not give them until the first frame has been used.") + "<p>He looks up.</p>" + said("Has it?") +
      '<div class="fsay"><button data-act="y">“It has.”</button><button data-act="c">Ask about the grey car</button><button data-act="k">Ask about the clock on the shelf that is not running</button></div>',
      { k: ACT.bclock, c: () => K.card('<div class="kick">The watch-repair shop</div>' + face + said("Since Thursday. A man who buys coffee and does not drink it.") + '<button class="cta" data-act="x">Back</button>', { x: ACT.bwatch }),
        y: () => { give("pages"); give("loupe"); F.S("parchment", "click", 0.5);
          K.card('<div class="kick">The watch-repair shop</div>' + face + OBJ("e2-pages") + "<p>He slides a flat packet across the glass, then takes the loupe off his own forehead and puts it on top.</p>" +
            said("You will need this more than I will tonight. A signature is like a watch. From across the room they all look the same.") + '<button class="cta" data-act="x">Up the stair</button>', { x: () => walk(byId("b2").views[1]) }); } });
  };
  /* The preacher's clock (Richard, 12 Nov 2026). The street preacher from Jaffa Gate wrote the torn scroll of Episode 1 and left this clock at the
     watchmaker's. It answers the scroll's question with 2 Thessalonians 2:1-3: a falling away first, that man of sin revealed, then that day and our
     gathering together unto him. Optional: the act does not wait for it. Who the preacher was is never told. */
  ACT.bclock = () => {
    const face = '<img class="e2-face" src="' + PP + 'watchmaker.jpg" alt="">', said = (t) => '<p class="e2-said"><b>The watchmaker</b> “' + t + "”</p>";
    let ep1 = false; try { ep1 = Lamp.fsyWalk.scrollState().n > 0; } catch (e) {}
    const met = flag("b:preacher");
    const open = () => { set("b:clock"); set("book:clock"); F.S("parchment", "click", 0.5); K.buzz("success");
      K.card('<div class="kick">The back of the clock</div><h2>A folded paper</h2><p>There is no movement inside, and there never was. Only a folded paper, written in pencil' + (ep1 ? ", in the same hand as the torn scroll." : ".") + "</p>" +
        F.wnote("Now we beseech you, brethren, by the coming of our Lord Jesus Christ, and by our gathering together unto him,") + '<p class="fsmall">2 Thessalonians 2:1</p>' +
        F.wnote("Let no man deceive you by any means: for that day shall not come, except there come a falling away first, and that man of sin be revealed, the son of perdition;") + '<p class="fsmall">2 Thessalonians 2:3</p>' +
        '<p>Under the verses, three lines, one for each mark on the face:</p><ol class="e2-three"><li>A falling away first.</li><li>That man of sin revealed.</li><li>That day: our gathering together unto him.</li></ol>' +
        "<p>You turn the clock over again. The hand has passed the first mark. It stands a hair short of the second.</p>" +
        said("I asked him how long. He said: ask who is about to sign.") +
        '<p class="fsmall">' + (ep1 ? "The scroll asked when. This is his answer, as far as he gives one. " : "") + 'It goes into the journal.</p><button class="cta" data-act="x">Put the clock back</button>', { x: () => {} }); };
    K.card('<div class="kick">The watch-repair shop</div>' + face + "<h2>The clock that is not running</h2>" +
      said("That one is not mine. A man with a Bible in his hand left it on Friday, before the Sabbath." + (met ? " You have seen him. He preaches outside Jaffa Gate." : "")) +
      said("He paid me and told me not to mend it. He said it is not broken. He said it shows the right time.") + OBJ("e2-clock") +
      "<p>A small brass mantel clock with one plain face and one hand. No hours, only three marks cut before twelve. It does not tick.</p>" +
      said("I asked his name. He said it did not matter. My wife says Elijah. My neighbour says Moses. I say a man who pays in advance.") +
      '<div class="fsay"><button data-act="o">Open the back of the clock</button></div><button class="cta alt" data-act="x">Leave it</button>', { x: () => {}, o: open });
  };
  /* what the loupe finds on each page, and the right call */
  const SIG = {
    A: { t: "Decree, page one", looks: [["The signature", "Ink that pools where the pen stopped and thins where it hurried. One blot."], ["The back of the sheet", "The pen pressed through. You can feel the line with a fingernail."], ["The line under it", "His name and his office, typed. Nothing else."]], call: "hand", st: "lit", why: "His own hand. The frame lights, and it is closed." },
    B: { t: "Decree, two sheets clipped together", looks: [["The stamps", "ORIGINAL 1 of 2. ORIGINAL 2 of 2. These are not copies of each other. Each was signed."], ["One laid over the other", "Every stroke matches. Every loop, every tremor, the same. No hand signs the same way twice.", "over"], ["Clipped behind them", "A signing-office slip: “Device 3. Two originals. Pattern on file.”"]], call: "machine", st: "dark", why: "A machine wrote it. The frame stays dark." },
    C: { t: "Decree, page three", looks: [["The signature", "Firm, quick, real. A pen in a hand."], ["The line under it", "“For and on behalf of.” Then his name."], ["The small type", "A different name: a deputy secretary."]], call: "deputy", st: "dark", why: "Another man’s hand. The frame stays dark." },
    D: { t: "Transcript", looks: [["Where a signature would be", "Nothing. It was never a page for signing."], ["The stamp", "RECORDED STATEMENT. A reel number, a date, a room."], ["The words", "In his own voice: “I have made this strong.”"]], call: "voice", st: "lit", why: "His own voice, on a reel with a number and a date. A recorded statement is his own act. The frame lights." },
  };
  const CALLS = [["hand", "His own hand"], ["machine", "A machine"], ["deputy", "Another man’s hand"], ["voice", "His own voice"]];
  function sigSVG(over, blot) {
    const p = "M20 44 C30 10 44 62 54 34 S70 12 82 40 S100 58 112 30 S132 20 150 38 L176 30";
    return '<svg class="e2-sig" viewBox="0 0 200 64" aria-hidden="true"><rect width="200" height="64" fill="#FBF8EF"/><path d="M16 54h170" stroke="#B9AD92"/>' +
      '<path d="' + p + '" fill="none" stroke="#1F2A6B" stroke-width="2.2" stroke-linecap="round"/>' + (over ? '<path d="' + p + '" fill="none" stroke="#9E2416" stroke-width="1" stroke-linecap="round" opacity=".9"/>' : "") +
      (blot ? '<circle cx="82" cy="40" r="3.4" fill="#1F2A6B"/>' : "") + "</svg>";
  }
  ACT.c2 = () => {
    if (!flag("heard:e2-2-c2")) { set("c2open"); return yoelCard("e2-2-c2", ACT.c2, "Open the packet"); }
    const r = E().f.c2r || {}; if (r.D === "open2") { r.D = "lit"; set("c2r", r); }
    const st = (k) => (r[k] ? '<i class="e2-st ' + r[k] + '">' + r[k] + "</i>" : "");
    const acts = { x: () => {} }; Object.keys(SIG).forEach((k) => (acts["d" + k] = () => page(k)));
    K.card('<div class="kick">Yoel’s table · the second frame</div><h2>Who made it strong?</h2>' + framesRow("") +
      '<div class="e2-docs">' + Object.keys(SIG).map((k) => '<button class="e2-doc" data-act="d' + k + '"><b>' + esc(SIG[k].t) + "</b><span>Page " + k + "</span>" + st(k) + "</button>").join("") + "</div>" +
      '<p class="fsmall">Pick up a page and put the loupe to it. Then say whether the man himself did this.</p><button class="cta alt" data-act="x">Leave the table</button>', acts);
    function page(k, seen) {
      const S = SIG[k]; seen = seen || [0, 0, 0]; K.sfx("click");
      if (r[k]) return result(k);
      const all = seen[0] && seen[1] && seen[2], acts = { x: ACT.c2 };
      [0, 1, 2].forEach((i) => (acts["k" + i] = () => { const n = seen.slice(); n[i] = 1; F.S("parchment", "click", 0.4); page(k, n); }));
      CALLS.forEach((c) => (acts["v" + c[0]] = () => { set("c2call:" + k, c[0]); result(k, c[0]); }));
      K.card('<div class="kick">Under the loupe · page ' + k + '</div><div class="e2-paper"><b>' + esc(S.t) + "</b>" + (k === "D" ? "" : sigSVG(k === "B" && seen[1], k === "A")) +
        S.looks.map((L, i) => '<button class="e2-look' + (seen[i] ? " seen" : "") + '" data-act="k' + i + '"><em>' + esc(L[0]) + "</em>" + (seen[i] ? "<span>" + esc(L[1]) + "</span>" : '<span class="q">Put the loupe here</span>') + "</button>").join("") + "</div>" +
        (all ? '<h2 class="e2-q">Who did this?</h2><div class="e2-calls four">' + CALLS.map((c) => '<button data-act="v' + c[0] + '">' + c[1] + "</button>").join("") + "</div>"
          : '<p class="fsmall">' + (k === "B" ? "You cannot say yet who signed this. Look at all three." : "Look at all three before you judge it.") + "</p>") +
        '<button class="cta alt" data-act="x">Put it down</button>', acts);
    }
    function result(k, called) {
      const S = SIG[k]; r[k] = S.st; set("c2r", r); F.S(S.st === "dark" ? "knock" : "harp", null, 0.5);
      const name = (c) => (CALLS.find((x) => x[0] === c) || [0, ""])[1].toLowerCase();
      K.card('<div class="kick">Under the second frame</div><h2>' + esc(S.t) + "</h2>" + framesRow(S.st) +
        (called ? '<p class="fsmall">' + (called === S.call ? "You called it " + name(called) + "." : "You called it " + name(called) + ". Look again at why.") + "</p>" : "") + '<p class="e2-jline">' + esc(S.why) + "</p>" +
        (k === "D" ? F.wnote("A pen, a seal, a voice on a reel: I do not ask which. I ask whether the act was his own.") : "") +
        '<button class="cta" data-act="x">Back to the table</button>', { x: () => { if (["A", "B", "C", "D"].every((x) => r[x])) return c2Done(); ACT.c2(); } });
    }
    function c2Done() {
      if (flag("c2")) return ACT.c2();
      set("c2"); set("book:c2"); K.buzz("success");
      K.card('<div class="kick">The journal · a new page</div><h2>The second question</h2><p>Who made it strong? Not a machine. Not a deputy. His own hand, or his own voice on the record: the act must be his own.</p>' +
        '<button class="cta" data-act="x">Close the packet</button>', { x: after });
    }
  };
  FINISH.b2 = () => walk(view);
  /* Scene 3: the fallen stones */
  ACT.bticket = () => { set("b:ticket"); K.card('<div class="kick">The ticket window</div><img class="e2-face" src="' + PP + 'ticket-student.jpg" alt=""><h2>A student, selling tickets</h2><p class="e2-said"><b>The student</b> “The stone with the writing? The real one is in the museum. Ours is a copy, set where the real one fell. Everyone photographs it.”</p><p class="fsmall">Twenty shekels.</p><button class="cta" data-act="x">Go in</button>', { x: after }); };
  ACT.bstone = () => { set("b:stone"); K.card('<div class="kick">The fallen stones</div><h2>The inscribed stone</h2>' + OBJ("e2-stone") + "<p>One corner has been cut away into a niche. Three words in Hebrew run along the edge and stop at a break. A low kerb runs along the paving from the cut corner.</p>" + '<button class="cta" data-act="x">Back</button>', { x: after }); };
  ACT.bsign = () => { set("b:sign"); K.card('<div class="kick">The sign</div><h2>“To the place of trumpeting to…”</h2><p>The last word is lost.</p><p class="fsmall">“Thought to have fallen from the top of the corner above. Its exact position is not certain.”</p><button class="cta" data-act="x">Back</button>', { x: after }); };
  ACT.bblock = (n) => {
    if (+n !== 5) { K.card('<div class="kick">Along the kerb</div><h2>A fallen block</h2><p>Squared, drafted at the edges, tipped on its side. Nothing scratched on it.</p><button class="cta" data-act="x">Back</button>', { x: after }); return; }
    set("b:lamp");
    K.card('<div class="kick">Along the kerb</div><h2>The fifth block</h2>' + lampMark("right") + "<p>Scratched very small into its face: a lamp, spout to the right.</p>" +
      (has("bcase") ? '<p class="fsmall">The gap behind it is empty now.</p>' : "<p>Behind a wedge of rubble under the mark, something flat and brass.</p>") +
      (has("bcase") ? "" : '<div class="fsay"><button data-act="t">Reach into the gap</button></div>') + '<button class="cta alt" data-act="x">Back</button>',
      { t: () => { give("bcase"); F.S("stone", "click", 0.6); K.card('<div class="kick">In the gap</div><h2>A brass case</h2>' + OBJ("e2-case") + '<p>Flat, the size of a book. On its lid, two small dials, a blank window and a sliding brass sun. No keyhole. It will not open.</p>' +
          '<p class="e2-said"><b>The ticket student, calling over</b> “Did you drop something? An old man was always dropping something just there.”</p><button class="cta" data-act="x">Back</button>', { x: after }); }, x: after });
  };
  /* the player lays the rod themselves and counts; nothing is counted for them */
  ACT.bmeasure = (then) => {
    const back = typeof then === "function" ? then : after;
    if (!flag("b:lamp")) { K.say("Measure to what? The book says: to my lamp. Look along the kerb first.", "", 3600); return; }
    K.card('<div class="kick">The kerb</div><h2>Where do you start the rod?</h2>' + stoneSVG() +
      (flag("b:meas") ? '<p class="fsmall">The journal has: ' + MEAS[E().f["b:meas"]] + ". A new measurement replaces it.</p>" : "") +
      '<div class="fsay"><button data-act="c">The cut corner, with the niche</button><button data-act="f">The far corner, by the break</button></div><button class="cta alt" data-act="x">Not now</button>',
      { c: () => lay("3.1"), f: () => lay("4.2"), x: back });
    function lay(truth) {
      const full = +truth[0], hands = +truth[2]; let n = 0, h = 0, miss = false;
      const draw = () => {
        const W = 54, rods = Array.from({ length: n }, (_, i) => '<rect x="' + (24 + i * W) + '" y="34" width="' + (W - 3) + '" height="8" rx="2" fill="#9B7A4A" stroke="#3B2A16"/>').join("");
        const hx = 24 + n * W, hand = Array.from({ length: h }, (_, i) => '<rect x="' + (hx + i * 13) + '" y="35" width="11" height="6" fill="#C9A24A" stroke="#3B2A16"/>').join("");
        const lampX = 24 + full * W + hands * 13 + 2;
        const atLamp = n === full && h === hands, canRod = n < full, over = n === full && !atLamp;
        K.card('<div class="kick">The kerb</div><h2>Lay the rod</h2><svg class="e2-draw" viewBox="0 0 300 70" aria-hidden="true"><rect width="300" height="70" fill="#D8CDB4"/><path d="M10 48h280" stroke="#8A7A5A" stroke-width="4"/>' +
          '<rect x="6" y="14" width="18" height="30" fill="#BFAF8A" stroke="#3A2A14"/>' + rods + hand + '<path d="M' + lampX + ' 18v26" stroke="#9E2416" stroke-width="2"/><text x="' + lampX + '" y="13" text-anchor="middle" font-size="10" fill="#9E2416">lamp</text></svg>' +
          "<p>" + (atLamp ? "The mark on the grip touches the lamp." : miss ? "Another full length would pass the lamp. Use the short marks on the grip." : n === 0 ? "The rod’s end is against the stone." : "End to end. The lamp is still ahead.") + "</p>" +
          (atLamp ? '<h2 class="e2-q">What did you count?</h2><div class="fsay"><button data-act="a31">Three cubits and a hand</button><button data-act="a30">Three cubits</button><button data-act="a42">Four cubits and two hands</button><button data-act="a41">Four cubits and a hand</button></div>'
            : '<div class="fchoices two"><button data-act="r">Lay a full length</button><button data-act="h">Add a hand mark</button></div>') +
          '<button class="cta alt" data-act="x">Start again</button>',
          { r: () => { if (canRod) { n++; miss = false; F.S("rod", "click", 0.5); } else { miss = true; K.snd("bad"); } draw(); },
            h: () => { if (over && h < hands) { h++; F.S("rod", "click", 0.4); } else if (!over) { K.snd("bad"); K.say("The hand marks are for the last short step.", "", 2600); } draw(); },
            a31: () => answer("3.1"), a30: () => answer("3.0"), a42: () => answer("4.2"), a41: () => answer("4.1"), x: () => ACT.bmeasure(then) });
      };
      const answer = (a) => {
        if (a !== truth) { K.snd("bad"); K.say("That is not what lies on the kerb. Count the lengths again.", "", 3200); n = 0; h = 0; return draw(); }
        set("b:meas", truth); set("book:meas"); K.buzz("success");
        K.card('<div class="kick">The journal</div><h2>The measurement</h2><p>From the stone to Yoel’s lamp: <b>' + MEAS[truth] + '</b>.</p><button class="cta" data-act="x">Close</button>', { x: back });
      };
      draw();
    }
  };
  /* Scene 4: the brass case. Three settings, in any order; the shadow shows which is wrong. A model, not a clock. */
  ACT.bcase = () => {
    if (flag("b:open")) return plate();
    const root = K.root(); if (!root) return;
    let cub = 1, hand = 0, dir = 0, sun = 10, opened = false;
    const box = document.createElement("div"); box.className = "e2-sunset e2-case";
    box.innerHTML = '<div class="e2-casebox"><div id="e2cm"></div><p class="e2-casesay" id="e2cs"></p></div>' +
      '<div class="e2-inst"><small class="e2-engr">How far. Which way. When does the trumpet sound?</small>' +
      '<div class="e2-row"><b>How far</b><div class="e2-step"><button data-c="-1">‹</button><em id="e2cc"></em><button data-c="1">›</button></div></div>' +
      '<div class="e2-row"><b>and</b><div class="e2-step"><button data-h="-1">‹</button><em id="e2ch"></em><button data-h="1">›</button></div></div>' +
      '<div class="e2-row"><b>Which way</b><div class="e2-step"><button data-d="-1">‹</button><em id="e2cd"></em><button data-d="1">›</button></div></div>' +
      '<div class="e2-row"><b>When</b><div class="e2-rg"><input type="range" min="0" max="100" value="10" id="e2cr" aria-label="Slide the brass sun"><div class="e2-marks"><span style="left:15%">☀ high</span><span style="left:62%">☀ on the hills</span><span style="left:92%">•••</span></div></div></div>' +
      '<button class="e2-jbtn" id="e2cj">Open the journal</button><div class="e2-jbox" id="e2cjb" hidden></div></div>' +
      '<div class="e2-caseend"><button class="cta alt" id="e2cmz">Go and measure again</button><button class="cta alt" id="e2cl">Put the case down</button></div>';
    const snap = () => (Math.abs(sun - 15) <= 5 ? "noon" : Math.abs(sun - 62) <= 5 ? "sunset" : Math.abs(sun - 92) <= 6 ? "stars" : "");
    const model = () => {
      const f = sun <= 62 ? 0.35 + 0.65 * Math.max(0, (sun - 15) / 47) : Math.max(0, 1 - (sun - 62) / 22);
      const len = 150 * ((cub * 4 + hand) / 13) * Math.max(0.12, f), ang = (28 + (dir - 4) * 13) * Math.PI / 180;
      const x2 = 70 + len * Math.cos(ang), y2 = 52 + len * Math.sin(ang), op = sun > 84 ? 0 : sun > 62 ? 1 - (sun - 62) / 22 : 1;
      const sx = 30 + sun * 2.4, sy = 14 + Math.pow((sun - 10) / 90, 2) * 70;
      return '<svg viewBox="0 0 300 170" class="e2-casesvg" aria-hidden="true"><defs><linearGradient id="e2cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9CF86"/><stop offset="1" stop-color="#A97C26"/></linearGradient></defs>' +
        '<rect width="300" height="170" rx="8" fill="url(#e2cg)" stroke="#6A4A0E" stroke-width="3"/><path d="M26 16 Q150 -10 276 96" fill="none" stroke="#6A4A0E" stroke-width="1.5" stroke-dasharray="3 4"/>' +
        '<path d="M14 40h56v118H14z" fill="#C9B079" stroke="#4A3308" stroke-width="2"/><path d="M14 60h56M14 82h56M14 104h56M14 126h56" stroke="#8A6A3A" stroke-width="1"/>' +
        '<path d="M70 158h216" stroke="#4A3308" stroke-width="2"/><path d="M70 52 L205 124" stroke="#4A3308" stroke-width="1" stroke-dasharray="2 3" opacity=".7"/>' +
        '<rect x="196" y="118" width="34" height="20" fill="#D9C79A" stroke="#4A3308"/><rect x="196" y="118" width="10" height="9" fill="#8A6A3A"/>' +
        '<line x1="70" y1="52" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#1A1206" stroke-width="5" stroke-linecap="round" opacity="' + (0.75 * op).toFixed(2) + '"/>' +
        '<circle cx="70" cy="44" r="6" fill="#4A3308"/><path d="M70 44l' + (14 * Math.cos(ang)).toFixed(1) + " " + (14 * Math.sin(ang) - 4).toFixed(1) + '" stroke="#4A3308" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="10" fill="' + (sun > 84 ? "#6A4A0E" : "#FFE9A8") + '" stroke="#6A4A0E" stroke-width="2"/></svg>';
    };
    const say = () => {
      if (opened) return;
      const s = snap(), okD = cub === 3 && hand === 1, okW = dir === 4;
      if (s === "sunset" && okD && okW) return open();
      let t = "The shadow-marker swings as you move the parts.";
      if (s === "noon") t = "At noon the shadow is short. Nothing moves.";
      else if (s === "stars") t = "Night. The shadow has gone. Three stars is how you know the day has gone out. The trumpet at the corner told the city it was coming in.";
      else if (s === "sunset") {
        const d = cub * 4 + hand;
        if (!okD && flag("b:meas") && E().f["b:meas"] === "4.2" && cub === 4 && hand === 2) t = "The shadow is too long. The first setting is wrong. Yoel said the cut corner.";
        else if (!okD && !okW) t = "The shadow is " + (d < 13 ? "too short" : "too long") + " and falls wide of the niche. Check how far, and which way.";
        else if (!okD) t = "The shadow is " + (d < 13 ? "too short" : "too long") + ". Check how far.";
        else t = "The shadow falls wide of the niche. Check which way.";
      }
      box.querySelector("#e2cs").textContent = t;
    };
    const draw = () => { box.querySelector("#e2cm").innerHTML = model(); box.querySelector("#e2cc").textContent = cub + (cub === 1 ? " cubit" : " cubits"); box.querySelector("#e2ch").textContent = hand + (hand === 1 ? " hand" : " hands"); box.querySelector("#e2cd").textContent = HEB[dir]; say(); };
    const open = () => {
      opened = true; set("b:open"); F.S("lock", "click", 0.9); K.buzz("success");
      box.querySelector("#e2cs").textContent = "The shadow lies exactly along the line to the niche. The lid lifts.";
      box.querySelectorAll("button,input").forEach((b) => (b.disabled = true));
      setTimeout(() => { box.remove(); plate(); }, 2200);
    };
    box.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => { cub = Math.min(6, Math.max(1, cub + +b.dataset.c)); K.sfx("click"); draw(); }));
    box.querySelectorAll("[data-h]").forEach((b) => (b.onclick = () => { hand = Math.min(2, Math.max(0, hand + +b.dataset.h)); K.sfx("click"); draw(); }));
    box.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => { dir = (dir + +b.dataset.d + 8) % 8; K.sfx("click"); draw(); }));
    const rg = box.querySelector("#e2cr"); rg.oninput = () => { sun = +rg.value; draw(); };
    rg.onchange = () => { const s = snap(); if (s) { sun = { noon: 15, sunset: 62, stars: 92 }[s]; rg.value = sun; draw(); } };
    box.querySelector("#e2cj").onclick = () => { const j = box.querySelector("#e2cjb"); j.hidden = !j.hidden;
      j.innerHTML = '<p><b>The measurement</b> ' + (flag("b:meas") ? "From the stone to Yoel’s lamp: " + MEAS[E().f["b:meas"]] + "." : "Not measured yet.") + "</p><p><b>Yoel’s diagram</b></p>" + dialSVG(4); };
    box.querySelector("#e2cl").onclick = () => box.remove();
    box.querySelector("#e2cmz").onclick = () => { box.remove(); ACT.bmeasure(() => ACT.bcase()); };
    root.appendChild(box); draw();
  };
  function plate() {
    if (flag("b:plate")) return ACT.binst();
    const seat = () => K.card('<div class="kick">Inside the case</div><h2>The sunset plate</h2>' + OBJ("e2-plate") + '<p>A thin brass plate, curved to sit against the ring, engraved with seventeen short lines of figures. A slip of paper in Yoel’s hand:</p>' + F.wnote("where the day turns") +
      '<button class="cta" data-act="x">Seat it beside the ring</button>', { x: () => { give("plate"); set("b:plate"); set("book:plate"); F.S("lock", "click", 0.7); ACT.binst(); } });
    if (!flag("heard:e2-2-plate")) return yoelCard("e2-2-plate", seat, "Lift the plate out");
    seat();
  }
  FINISH.b4 = () => walk(view);
  /* Scene 5: 13 Av */
  ACT.bavi = () => {
    if (has("sheet")) { K.say("“Peace! Go, go, show it to somebody.”", "Avi", 3000); return; }
    const face = '<img class="e2-face" src="' + PP + 'avi.jpg" alt="">', said = (w, t) => '<p class="e2-said"><b>' + w + "</b> “" + t + "”</p>";
    K.card('<div class="kick">The Ramparts ticket booth</div>' + face + "<h2>Avi, with the radio turned up</h2>" + said("Avi", "You again! You picked a day. Listen, listen.") +
      '<button class="cta" data-act="x">Listen</button>', { x: () => K.card('<div class="kick">The radio</div><h2>The President</h2>' +
        said("The President", "Today the Coastal Kingdom, its neighbours and the State of Israel have concluded a framework of peace: the second phase of the accords that came before it. What was begun, I have made strong, and I will sign it before the month is out.") +
        '<p class="fsmall">His own voice, a little thin, with a crowd under it.</p><button class="cta" data-act="x">Go on</button>', { x: () => { set("b:radio"); set("book:strong");
          K.card('<div class="kick">The journal turns back</div><h2>Made strong</h2><p>' + (has("seventy") ? "The page the old woman gave you at the Wall:" : "A line from the second book:") +
            " 'And he shall confirm the covenant with many for one week.' Daniel 9:27. You have just heard a man say he made something strong.</p>" + '<button class="cta" data-act="x">Go on</button>', { x: () => { give("sheet");
          K.card('<div class="kick">The Ramparts ticket booth</div>' + face + said("Avi", "Peace! After everything. My mother is crying in the kitchen.") + "<p>He pushes a printed sheet under the glass.</p>" + said("Avi", "They are giving these out at the gate. Take one. Frame it.") +
            '<button class="cta" data-act="x">Take the sheet</button>', { x: after }); } }); } }) });
  };
  ACT.btest = () => {
    const r = E().f.t13 || {};
    const LOOKS = [["The first line", "“Concluded this day.” Announced as complete."], ["Under the title", "“Second Phase.” It calls itself the second phase of “the accords of the preceding years”, now strengthened. The word is there twice."], ["The signature line", "Blank. A printed name under it, and nothing above."]];
    const seen = E().f.t13seen || [0, 0, 0], all = seen[0] && seen[1] && seen[2];
    const acts = { x: () => {} };
    [0, 1, 2].forEach((i) => (acts["k" + i] = () => { const n = seen.slice(); n[i] = 1; set("t13seen", n); F.S("parchment", "click", 0.4);
      if (i === 1 && !flag("book:phase")) { set("book:phase"); return K.card('<div class="kick">The journal turns back</div><h2>Phase 2</h2><p>Episode 1: the map on Haller’s wall, the nations in gold, and a clipped sheet headed <i>Phase 2</i>, with question marks.</p><p><i>The question marks are gone.</i></p><button class="cta" data-act="x">Back to the sheet</button>', { x: ACT.btest }); }
      ACT.btest(); }));
    [1, 2, 3, 4, 5].forEach((n) => (acts["f" + n] = () => {
      if (n > 2) { K.snd("bad"); K.say("The shutter does not lift. You have not learned this question yet. You cannot answer what you have not been asked.", "", 4200); return ACT.btest(); }
      r[n] = 1; set("t13", r); F.S("harp", null, 0.5);
      K.card('<div class="kick">Under the ' + (n === 1 ? "first" : "second") + ' frame</div><h2>Framework of Peace</h2>' + framesRow(n === 2 ? "lit" : (r[2] ? "lit" : ""), "lit") +
        '<p class="e2-jline">' + (n === 1 ? "Lit, dated 13 Av. Announced as concluded: by Yoel’s rule, a thing done." : "Lit. His own voice on the radio: his own act. The signature line is still blank; he has said he will sign.") + "</p>" +
        '<button class="cta" data-act="x">Back</button>', { x: () => { if (r[1] && r[2] && !flag("b:t13")) return yoelCard("e2-2-thirteen", () => { set("b:t13"); set("book:t13"); K.buzz("success");
          K.card('<div class="kick">The journal · a new page</div><h2>13 Av</h2><p>The Framework of Peace. Done: lit. Made strong: lit, by his own voice. Three questions I have not been taught.</p><p class="fsmall">Not confirmed under Yoel’s test.</p><button class="cta" data-act="x">Close</button>', { x: after }); }, "Go on"); ACT.btest(); } });
    }));
    K.card('<div class="kick">Yoel’s table · 13 Av</div><div class="e2-paper"><b>Framework of Peace</b>' +
      LOOKS.map((L, i) => '<button class="e2-look' + (seen[i] ? " seen" : "") + '" data-act="k' + i + '"><em>' + L[0] + "</em>" + (seen[i] ? "<span>" + esc(L[1]) + "</span>" : '<span class="q">Tap to look closely</span>') + "</button>").join("") + "</div>" +
      (all ? '<h2 class="e2-q">Slide it under a frame</h2><div class="e2-calls five">' + [1, 2, 3, 4, 5].map((n) => '<button data-act="f' + n + '"' + (r[n] ? ' class="did"' : "") + ">" + n + "</button>").join("") + "</div>" : '<p class="fsmall">Read it closely before you test it.</p>') +
      '<button class="cta alt" data-act="x">Leave the table</button>', acts);
  };
  FINISH.b5 = () => walk(view);
  /* Scene 6: Haller raises a coffee */
  ACT.bhaller = () => {
    if (flag("b:end")) return endAct2();
    K.card('<div class="kick">Jaffa Gate</div><img class="e2-face" src="' + PP + 'haller.jpg" alt="Haller"><h2>Haller</h2><p>Standing still at the edge of the crowd, in the grey coat, with two iced coffees. He sees you. He does not come over.</p>' +
      "<p>He lifts one cup a few inches, the way a man raises a glass, and holds it there. Then a line of dancers passes between you, and when it has gone, so has he.</p>" + '<button class="cta" data-act="x">Go to where he stood</button>',
      { x: () => { note("haller", "At Jaffa Gate, as 13 Av ended, he raised a coffee and said nothing. He left a second cup labelled TABLE."); set("book:table");
        K.card('<div class="e2-cup"><svg viewBox="0 0 120 160" aria-hidden="true"><defs><linearGradient id="e2cf2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9773A"/><stop offset="1" stop-color="#5A2E14"/></linearGradient></defs>' +
          '<path d="M64 2l-3 30" stroke="#2A2A2A" stroke-width="4" stroke-linecap="round"/><path d="M22 30h76l-9 122H31z" fill="url(#e2cf2)" stroke="#D8D2C4" stroke-width="2.5"/><path d="M17 22h86v10H17z" fill="#EDE7D8" stroke="#C9C1AE" stroke-width="1.5"/>' +
          '<rect x="30" y="78" width="60" height="32" rx="3" fill="#FBF8EF" stroke="#C9C1AE"/><text x="60" y="101" text-anchor="middle" font-family="Marker Felt, Comic Sans MS, cursive" font-size="18" fill="#1F2A6B" transform="rotate(-5 60 96)">TABLE</text></svg></div>' +
          '<p>On the ledge: the second coffee, untouched. The label says <b>TABLE</b>.</p><p class="fsmall">He knows where you sat last night. The journal notes it either way.</p>' +
          '<div class="fchoices two"><button data-act="t">Take it</button><button data-act="l">Leave it</button></div>',
          { t: () => { give("coffee2"); set("b:cup", "taken"); last(); }, l: () => { set("b:cup", "left"); last(); } }); } });
    const last = () => K.card('<div class="kick">Jaffa Gate</div><h2>The sun goes</h2><p>Behind the towers the light goes out of the stone. By Yoel’s plate, the sun went at <b>7:23</b>.</p>' +
      "<p>It is the fourteenth of Av now. The band has not stopped. The city is still celebrating the thirteenth, and nobody dancing has noticed that it is over.</p>" + '<p class="fsmall">The day turns when the sun goes.</p><button class="cta" data-act="x">Go on</button>', { x: last2 });
    const last2 = () => K.card('<div class="kick">&nbsp;</div><h2 class="e2-later">Two frames lit. Three unopened.</h2><p style="text-align:center"><i>Lit is not the same as finished.</i></p><button class="cta" data-act="x">Go on</button>', { x: () => { set("b:end"); E().done.b6 = 1; save(); endAct2(); } });
  };
  FINISH.b6 = () => endAct2();
  function endAct2() {
    K.card('<div class="kick">The Final Seven Years · Episode 2</div><div class="e2-acttitle"><small>Act 2 · The Trumpeting Stone</small><b>Complete</b></div>' +
      "<p>The ring has turned to 14 Av. The little shelter Yoel drew is on the 15th, which begins at the next sunset.</p>" +
      '<p class="fsmall">Prototype: Act 3, The Cottage in the Vineyard, is not written yet.</p><button class="cta" data-act="x">Back to the episodes</button><button class="cta alt" data-act="again">Play Act 2 again</button>',
      { x: () => K.shut(), again: () => { const e = E(); A2.forEach((id) => { delete e.done[id]; });
        Object.keys(e.f).forEach((k) => { if (/^(b:|c2|t13|book:(stone|diagram|comfort|preacher|clock|c2|meas|plate|strong|phase|t13|table)|heard:e2-2|seenAct:b)/.test(k)) delete e.f[k]; });
        ["loupe", "pages", "bcase", "plate", "sheet", "coffee2"].forEach((k) => delete e.items[k]); save(); go("b1"); } });
  }
  function hint2(id) {
    const f = flag, n = (k) => { const c = (E().f[k] || 0); set(k, c + 1); return c; };
    if (id === "b1") return !f("b:book") ? "Open the second book on the table." : !f("b:preacher") ? "Walk forward, out to Jaffa Gate. Someone is preaching there." : "Go back to the room, tap the window and wait for three stars.";
    if (id === "b2") return !has("pages") ? "The watch-repair shop: his lamp is lit now." : ["Use the loupe on each page: look at all three places before you judge.", "For the two clipped sheets: read the stamps, lay one over the other, and look behind them.", "His own hand lights the frame, and so does his own recorded voice. A machine and a deputy stay dark."][Math.min(2, n("hint:b2"))];
    if (id === "b3") return !f("b:lamp") ? ["Follow the kerb from the corner of the stone that has been cut away. Look at each block.", "One block has Yoel’s lamp scratched on it: the last one along."][Math.min(1, n("hint:b3a"))] : !f("b:meas") ? "Tap the kerb. Lay the rod from the cut corner to the lamp and count the lengths yourself." : "Go back to the fifth block and reach into the gap.";
    if (id === "b4") return f("b:open") ? "Seat the plate beside the ring." : ["Three questions are engraved on the case. You measured the answer to the first.", "Yoel’s diagram in the journal answers the second. Match the letter his line points to.", "When did the priest sound the trumpet to begin the Sabbath? Slide the sun there."][Math.min(2, n("hint:b4"))];
    if (id === "b5") return !has("sheet") ? "Find Avi’s booth at Jaffa Gate." : "At the table, read the sheet closely, then slide it under the first and second frames.";
    return "Look at the edge of the crowd.";
  }

  /* ------------------------------------------------------------ hints ------------------------------------------------------------ */
  function hint() {
    if (!scene) return;
    const f = flag, id = scene.id, rm = E().f.rodMiss || 0;
    let t = "Look at everything here.";
    if (actOf(id) === 2) t = hint2(id);
    else if (id === "pro") t = flag("hintH") ? "Turn the handle to the right, the way the spout points." : (set("hintH"), "Look at the lamp scratched in the handle.");
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
    const id = SC.find((s) => !isDone(s.id)) ? (byId(e.at) && !isDone(e.at) ? e.at : SC.find((s) => !isDone(s.id)).id) : SC[SC.length - 1].id;
    scene = byId(id);
    if (id === "pro" && !flag("pro")) { K.card('<div class="kick">Episode 2 · The Appointed Time</div><h2>A work of fiction</h2><p>This episode imagines an agreement confirmed during a proposed future window, in an imagined 2027. Its characters and the agreement are fictional. Yoel’s calendar and test reflect an interpretation of prophecy and can be wrong.</p>' +
      (Lamp.tester ? '<p class="fsmall">Tester build: Act 1 is finished; Act 2 is a prototype with stand-in pictures and no voice yet. Your Episode 1 progress is not touched.</p>' : "") + '<button class="cta" data-act="x">Begin</button>', { x: () => go("pro") }); return; }
    go(id);
  }
  function devSkip() {
    const sh = document.querySelector("#adv .asheet"); if (sh) { const b = sh.querySelector("[data-act]"); b && b.click(); return; }
    if (!scene) return;
    const e = E(), id = scene.id;
    const fill = { pro: () => { set("handle"); give("rods"); give("book2"); set("book:pro"); set("pro"); }, desk: () => { set("calendar"); set("lamp"); },
      airport: () => give("coffee"), city: () => ["bookread", "taxi", "steps", "book:book1", "book:book2", "book:address"].forEach((k) => set(k)),
      wall: () => { ["w1", "w2", "w3"].forEach((k) => set(k)); give("seventy"); }, chain: () => { give("key"); set("room"); set("heard:e2-1-room"); },
      table: () => { set("c1r", { A: "lit", B: "dark", C: "lit", D: "grey" }); set("c1"); set("book:c1"); }, roof: () => { set("ring"); set("ringMarks", [11, 27]); set("open"); },
      b1: () => { ["b:book", "b:preacher", "b:stars", "book:stone", "book:diagram", "book:comfort", "book:preacher"].forEach((k) => set(k)); }, b2: () => { give("pages"); give("loupe"); set("c2r", { A: "lit", B: "dark", C: "dark", D: "lit" }); set("c2"); set("book:c2"); },
      b3: () => { set("b:lamp"); set("b:meas", "3.1"); set("book:meas"); give("bcase"); }, b4: () => { set("b:open"); give("plate"); set("b:plate"); set("book:plate"); },
      b5: () => { give("sheet"); set("t13", { 1: 1, 2: 1 }); set("b:t13"); set("book:t13"); set("book:phase"); set("book:strong"); }, b6: () => { set("b:end"); set("book:table"); } };
    fill[id](); e.done[id] = 1; save();
    const nx = SC[idx(id) + 1]; if (nx) go(nx.id); else endAct2();
  }
  Lamp.ep2 = { play: start, devSkip, state: E, scenes: SC };
})();
