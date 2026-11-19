/* The Final Seven Years · Episode 2: The Appointed Time (PROTOTYPE). Tester builds only: it opens from the Episodes screen when js/dev.js has TESTER on.
   Act 1, The Ninth of Av (scenes pro … roof): built from the Claude Doc "Episode 2, Act 1: The Ninth of Av — Script" (10 Nov 2026).
     It has its own pictures, clips, music and Yoel's seven lines; a few places reuse Episode 1's pictures on purpose.
   Act 2, The Trumpeting Stone (scenes b1 … b6, further down): built from the Claude Doc "Episode 2, Act 2: The Trumpeting Stone — Script" (12 Nov 2026).
     It has its own pictures, clips, music and voice lines. The second frame follows the protocol's rule D2.
   Act 3, The Cottage in the Vineyard (scenes c1 … c7): prototype from the Claude Doc "Episode 2, Act 3 — Outline and Script" (17 Nov 2026), temporary pictures, no voice yet.
   Acts 4 and 5 are outlines only (the Claude Doc "Episode 2: The Appointed Time — The Plot (third draft)").
   Its own save: Lamp.state.ep2. It reuses Episode 1's screen styles (fwalk, fwview, fwbar …) and adds e2-* ones. */
(function () {
  const K = Lamp.adv && Lamp.adv.kit, F = Lamp.fsy && Lamp.fsy.parts;
  if (!K || !F) return;
  const esc = K.esc, $ = (id) => document.getElementById(id);
  const IMG = "img/fsy/w/", PP = "img/fsy/people/";
  /* pictures made for Episode 2 (the rest are stand-ins from Episode 1, labelled in tester builds) */
  const REAL = new Set(["jq-cardo", "v4-cafe", "v4-gate", "v3-press", "v3-wall", "v3-roof", "../ti-hall", "v3-hutin", "v3-haller", "v3-dance", "yoel-room-cup", "yoel-room-moon", "v3-steps", "v3-track", "v3-terraces", "v3-hut", "jaffa-celebration", "jaffa-preacher", "fallen-stones", "excavation-street", "excavation-ticket", "chain-shops-night", "yoel-room-sabbath", "yoel-room-night", "yoel-room-dusk", "home-table", "desk-day", "taxi-rank", "jaffa-dusk", "wall-9av", "wall-9av-edge", "chain-street", "chain-shops", "yoel-room", "roof-sunset", "airport-hall-august", "wallsteps-dusk", "passport-control", "train-board", "jq-cardo"]);
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
  const HAVE = new Set(Object.keys({ "e2-pro-1": 1, "e2-1-book1": 1, "e2-1-book2": 1, "e2-1-wall": 1, "e2-1-room": 1, "e2-1-c1": 1, "e2-1-sunset": 1, "e2-2-stone": 1, "e2-2-c2": 1, "e2-2-plate": 1, "e2-2-thirteen": 1, "e2-2-radio": 1, "e2-3-hut": 1, "e2-3-jar": 1, "e2-3-wheel": 1, "e2-3-three": 1 }));
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
    A: ["Treaty between the Republic of the North and the Kingdom of Dedan", "Signed by both heads of government, dated, with two witnesses.", "lit", "Concluded and signed. A thing done."],
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
  const JX = {};   /* drawings that belong to a journal page, by page id */
  function note(who, text) { const n = E().f.notes || {}; n[who] = n[who] || []; if (!n[who].includes(text)) n[who].push(text); set("notes", n); }
  function journal() {
    const pages = BOOKP.filter((p) => flag("book:" + p[0]));
    const n = E().f.notes || {};
    const people = [["haller", "Victor Haller"], ["lamplighter", "The Lamplighter"], ["yoel", "For Yoel"]].filter((p) => (n[p[0]] || []).length);
    K.card('<div class="kick">The journal</div><h2>The second book</h2>' +
      (pages.length ? pages.map((p) => '<div class="e2-page"><b>' + esc(p[1]) + "</b><p>" + esc(p[0] === "meas" ? "From the stone to Yoel’s lamp: " + (MEAS[E().f["b:meas"]] || "not measured") + "." : p[2]) + "</p>" + (p[0] === "diagram" ? dialSVG(4) : "") + (JX[p[0]] ? JX[p[0]]() : "") + "</div>").join("") : "<p>Nothing yet.</p>") +
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
  const actOf = (id) => (A2.includes(id) ? 2 : /^c\d/.test(id) ? 3 : /^d\d/.test(id) ? 4 : 1);
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
    ["table", "TABLE", "Haller raised a coffee at Jaffa Gate and left a second one on the stones by the gate. The label said TABLE. He knows where I sat."]
  );
  const MEAS = { "3.1": "three cubits and a hand", "4.2": "four cubits and two hands" };
  const SUNSET = { 11: ["Fri 13 August", "7:25"], 12: ["Sat 14 August", "7:24"], 13: ["Sun 15 August", "7:23"], 14: ["Mon 16 August", "7:22"], 15: ["Tue 17 August", "7:21"], 16: ["Wed 18 August", "7:20"], 17: ["Thu 19 August", "7:19"], 18: ["Fri 20 August", "7:18"], 19: ["Sat 21 August", "7:17"], 20: ["Sun 22 August", "7:16"], 21: ["Mon 23 August", "7:14"], 22: ["Tue 24 August", "7:13"], 23: ["Wed 25 August", "7:12"], 24: ["Thu 26 August", "7:11"], 25: ["Fri 27 August", "7:10"], 26: ["Sat 28 August", "7:08"], 27: ["Sun 29 August", "7:07"] }; /* sunset at Jerusalem (31.778 N, 35.235 E, sea-level horizon, Israel summer time), to the nearest minute; recalculated 17 Nov 2026 and checked against known dates */
  const HEB = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח"];

  SC.push(
    { id: "b1", title: "Yoel's room · the Sabbath, 11 Av", act: "Scene 1", music: "e2-sabbath", amb: "indoor",
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
    { id: "b5", title: "The thirteenth of Av", act: "Scene 5", music: "e2-feast", amb: "market",
      task: () => (!has("sheet") ? "The first circled day. Go and listen." : !flag("b:t13") ? "Take the sheet back to Yoel's table and test it." : "Done."),
      views: [{ id: "gate", img: "jaffa-celebration", cap: "Jaffa Gate: white bunting, olive branches, strangers shaking hands", go: { fwd: "table" },
          who: [{ id: "avi", name: "Avi's booth", act: "bavi" }],
          hots: [{ box: [0, 48, 55, 34], label: "The crowd", text: "A man is pouring wine into paper cups. Children run in a ring round the grown-ups. Car horns, all the way down the Jaffa Road.", f: "b:crowd" },
            { box: [56, 50, 44, 48], label: "Two old men, embracing", text: "Two old men hold each other and do not let go. Someone beside you says: I never thought I would live to see this. A newspaper seller goes by. His front page is one word: PEACE.", f: "b:news" }] },
        { id: "table", img: "yoel-room", cap: "Yoel's table, the ring on 13 Av", go: { back: "gate" }, need: "sheet",
          hots: [{ box: [70, 40, 22, 15], label: "The frames", act: "btest" }, { box: [66, 56, 26, 8], label: "Yoel's instrument", act: "binst" }] }] },
    { id: "b6", title: "Jaffa Gate · Monday at sunset", act: "Scene 6", music: "e2-feast", amb: "market",
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
          K.card('<div class="kick">Outside Jaffa Gate</div><h2>The street preacher</h2><p>You shake his hand and thank him. He nods, and goes back to the verse.</p><p>You walk in through the gate, into the Old City, toward the Jewish Quarter.</p>' + (F.hasSong && F.hasSong("watching") ? '<button class="cta" data-act="s">Stop inside the gate and listen</button>' : "") + '<button class="cta' + (F.hasSong && F.hasSong("watching") ? " alt" : "") + '" data-act="x">Back to Yoel’s room</button>', { x: () => walk(byId("b1").views[0]), s: () => F.song("watching", "Inside Jaffa Gate · his voice follows you in", () => walk(byId("b1").views[0])) }); },
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
          K.card('<div class="kick">The watch-repair shop</div>' + (clip("watchmaker-loupe") || face) + OBJ("e2-pages") + "<p>He slides a flat packet across the glass, then takes the loupe off his own forehead and puts it on top.</p>" +
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
  ACT.bticket = () => { set("b:ticket"); K.card('<div class="kick">The ticket window</div><img class="e2-face" src="' + PP + 'ticket-student.jpg" alt=""><h2>A student, selling tickets</h2><p class="e2-said"><b>The student</b> “The stone with the writing? The real one is in the museum. Ours is a copy, set where the real one fell. Everyone photographs it.”</p><p class="fsmall">Forty shekels.</p><button class="cta" data-act="x">Go in</button>', { x: after }); };
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
    K.card('<div class="kick">The Ramparts ticket booth</div>' + (clip("avi-radio") || face) + "<h2>Avi, with the radio turned up</h2>" + said("Avi", "You again! You picked a day. Listen, listen.") +
      '<button class="cta" data-act="x">Listen</button>', { x: () => (Lamp.narr && HAVE.has("e2-2-radio") && Lamp.narr.play("fsy-e2-2-radio"), K.card('<div class="kick">The radio</div><h2>The President</h2>' +
        said("The President", "Today the Kingdom of Dedan, its neighbours and the State of Israel have concluded a framework of peace: the second phase of the accords that came before it. What was begun, I have made strong, and I will sign it before the month is out.") +
        '<p class="fsmall">His own voice, a little thin, with a crowd under it.</p><button class="cta" data-act="x">Go on</button>', { x: () => { set("b:radio"); set("book:strong");
          K.card('<div class="kick">The journal turns back</div><h2>Made strong</h2><p>' + (has("seventy") ? "The page the old woman gave you at the Wall:" : "A line from the second book:") +
            " 'And he shall confirm the covenant with many for one week.' Daniel 9:27. You have just heard a man say he made something strong.</p>" + '<button class="cta" data-act="x">Go on</button>', { x: () => { give("sheet");
          K.card('<div class="kick">The Ramparts ticket booth</div>' + face + said("Avi", "Peace! After everything. My mother is crying in the kitchen.") + "<p>He pushes a printed sheet under the glass.</p>" + said("Avi", "They are giving these out at the gate. Take one. Frame it.") +
            '<button class="cta" data-act="x">Take the sheet</button>', { x: after }); } }); } })) });
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
    K.card('<div class="kick">Jaffa Gate</div>' + (clip("haller-toast") || '<img class="e2-face" src="' + PP + 'haller.jpg" alt="Haller">') + '<h2>Haller</h2><p>Standing still in front of the gate, in the grey coat, with two iced coffees. He sees you. He does not come over.</p>' +
      "<p>He lifts one cup a few inches, the way a man raises a glass, and nods. Then he sets the other cup down on the stones, turns, and walks in through the gate.</p>" + '<button class="cta" data-act="x">Go to where he stood</button>',
      { x: () => { note("haller", "At Jaffa Gate, as 13 Av ended, he raised a coffee and said nothing. He left a second cup labelled TABLE."); set("book:table");
        K.card('<div class="e2-cup"><svg viewBox="0 0 120 160" aria-hidden="true"><defs><linearGradient id="e2cf2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9773A"/><stop offset="1" stop-color="#5A2E14"/></linearGradient></defs>' +
          '<path d="M64 2l-3 30" stroke="#2A2A2A" stroke-width="4" stroke-linecap="round"/><path d="M22 30h76l-9 122H31z" fill="url(#e2cf2)" stroke="#D8D2C4" stroke-width="2.5"/><path d="M17 22h86v10H17z" fill="#EDE7D8" stroke="#C9C1AE" stroke-width="1.5"/>' +
          '<rect x="30" y="78" width="60" height="32" rx="3" fill="#FBF8EF" stroke="#C9C1AE"/><text x="60" y="101" text-anchor="middle" font-family="Marker Felt, Comic Sans MS, cursive" font-size="18" fill="#1F2A6B" transform="rotate(-5 60 96)">TABLE</text></svg></div>' +
          '<p>On the stones where he stood: the second coffee, untouched. The label says <b>TABLE</b>.</p><p class="fsmall">He knows where you sat last night. The journal notes it either way.</p>' +
          '<div class="fchoices two"><button data-act="t">Take it</button><button data-act="l">Leave it</button></div>',
          { t: () => { give("coffee2"); set("b:cup", "taken"); last(); }, l: () => { set("b:cup", "left"); last(); } }); } });
    const last = () => K.card('<div class="kick">Jaffa Gate</div><h2>The sun goes</h2><p>Behind the towers the light goes out of the stone. By Yoel’s plate, the sun went at <b>7:22</b>.</p>' +
      "<p>It is the fourteenth of Av now. The band has not stopped. The city is still celebrating the thirteenth, and nobody dancing has noticed that it is over.</p>" + '<p class="fsmall">The day turns when the sun goes.</p><button class="cta" data-act="x">Go on</button>', { x: last2 });
    const last2 = () => K.card('<div class="kick">&nbsp;</div><h2 class="e2-later">Two frames lit. Three unopened.</h2><p style="text-align:center"><i>Lit is not the same as finished.</i></p><button class="cta" data-act="x">Go on</button>', { x: () => { set("b:end"); E().done.b6 = 1; save(); endAct2(); } });
  };
  FINISH.b6 = () => endAct2();
  function endAct2() {
    K.card('<div class="kick">The Final Seven Years · Episode 2</div><div class="e2-acttitle"><small>Act 2 · The Trumpeting Stone</small><b>Complete</b></div>' +
      "<p>The ring has turned to 14 Av. The little shelter Yoel drew is on the 15th, which begins at the next sunset.</p>" +
      '<button class="cta" data-act="n">Go on to Act 3 · The Cottage in the Vineyard</button><button class="cta alt" data-act="x">Back to the episodes</button><button class="cta alt" data-act="again">Play Act 2 again</button>',
      { n: () => go("c1"), x: () => K.shut(), again: () => { const e = E(); A2.forEach((id) => { delete e.done[id]; });
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

  /* ============================================================ ACT 3 · THE COTTAGE IN THE VINEYARD (prototype) ============================================================
     Script: the Claude Doc "Episode 2, Act 3 — Outline and Script" (second draft after Gerry's review, 17 Nov 2026).
     Temporary pictures (img/fsy/w/v3-*.jpg, made by app/tools/make_e2_act3_standins.py from the tap spots below); Yoel's four lines show as text until recorded.
     Scenes c1 … c7. Flags are prefixed "c:". The vineyard's geometry is one map (VG below), checked before any art was made. */
  const A3 = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];
  ACTNAME[3] = "Act 3 · The Cottage in the Vineyard";
  Object.assign(LINES, {
    "e2-3-hut": "A watchman's hut is the poorest building in the land. Four stones and a roof, and when the grapes are in, nobody mends it. Isaiah looked at Jerusalem and saw one. On the fifteenth of Av the daughters of Jerusalem went out to dance in the vineyards, and the watchman stayed on his roof. I kept one part of the instrument there. Go in daylight. Take the rod.",
    "e2-3-jar": "Jeremiah bought a field while the army stood at the gate. He signed, he sealed, he called witnesses, and he put the deed in a jar. Three kinds of hand on one page. The one who is bound. The one who stands behind him. And the one who only saw. When they show you a page crowded with seals, do not count the crowd. Count the bound. Daniel says the covenant is made strong with the many. I have set my line at Israel and three more.",
    "e2-3-wheel": "Now you have the days as men count them, laid against the days as they are. Every Hebrew day wears two dates. The people who will argue with you about this will have a calendar on their wall with one date in each square, and they will be very sure.",
    "e2-3-three": "Three. The first time a page passed three for me, I was happy for an hour. Then I saw what I was doing. I was reading the page I wanted. Daniel does not say with many. He says with the many, as if we should know them when we see them. You have counted them. You have not yet asked what they agreed to.",
  });
  Object.assign(ITEMS, {
    wheel: ["The wheel of days", "A toothed brass wheel, its rim engraved 1 to 31 and, in Yoel's hand, August. Each tooth is split by a fine line with a tiny sun."],
    lastpage: ["The Framework's last page", "The page of signatures and seals. From Haller, at noon on 15 Av, an hour before the newspapers had it."],
  });
  BOOKP.push(
    ["title", "The Tribulation Experiment", "The second book's own title, in Yoel's hand, on the outer edge of the roll."],
    ["hut", "The cottage in the vineyard", "A small stone hut on a terraced hillside: the shelter he drew on the fifteenth. “And the daughter of Zion is left as a cottage in a vineyard, as a lodge in a garden of cucumbers, as a besieged city.” Isaiah 1:8."],
    ["roof", "The roof of the hut", "A socket for the rod, and four notches. “The watchman keeps four watches. Stand where he stood, in the watch when the day turns. Then go to the press, and follow where the wine ran.” Mark 13:35: “…at even, or at midnight, or at the cockcrowing, or in the morning.”"],
    ["vplan", "Yoel's plan of the vineyard", "The hut, the press and the terrace walls, seen from above. The lines you sight are drawn here in pencil."],
    ["isa5", "The vineyard, the tower and the press", "“My wellbeloved hath a vineyard in a very fruitful hill: and he fenced it, and gathered out the stones thereof, and planted it with the choicest vine, and built a tower in the midst of it, and also made a winepress therein.” Isaiah 5:1–2."],
    ["c3", "The third question: With how many?", "לָרַבִּים. “I count states and governing bodies, never persons. One is counted if it is bound: as a party, by its signature; or as a guarantor, by its own act.” Israel and three more. Witnesses only saw. “And I subscribed the evidence, and sealed it, and took witnesses.” Jeremiah 32:10."],
    ["ten", "A margin, and a row of seals", "Beside the third question, in pencil: Dan. 7:24. Not this page's question. On the Framework's last page, among the witnesses: seven crowned seals, three empty rings, and one seal set apart."],
    ["foxes", "The little foxes", "“Take us the foxes, the little foxes, that spoil the vines: for our vines have tender grapes.” Song of Solomon 2:15. Shira's grandmother's name for men like Haller."],
    ["wheel", "The wheel of days", "Seated beside the ring. Every Hebrew day wears two dates: the evening of one and the daylight of the next. One part is still missing: the long count."],
    ["t15", "15 Av · With the many", "Lit. Israel and three more: Dedan, Sheba, and the Republic that guarantees it. It passes by one, and the one is the Republic of the man who made it strong. Two questions I have not been taught."],
    ["dance", "The fifteenth of Av", "“Young man, lift up your eyes, and see what you choose.” Mishnah Ta'anit 4:8, which pairs this day with the Day of Atonement."],
    ["three", "THREE", "An iced coffee on Yoel's table, behind a locked door, ice still floating under the lid. The label said THREE. The photograph he left face down was standing upright."]
  );
  const said = (w, t) => '<p class="e2-said"><b>' + w + "</b> “" + t + "”</p>";
  const face = (id) => '<img class="e2-face" src="' + PP + id + '.jpg" alt="">';
  const stamp = (t) => '<p class="e2-stamp">' + t + "</p>";

  /* ---- the vineyard on one map: metres east and north of the hut; bearings clockwise from north ---- */
  const VG = { press: [70, 14], pressBear: 265, cistern: [0, -32], walls: [30, 12, -5, -22, -38, -52, -65],
    notch: { morn: { b: 74, name: "the half sun on the city side" }, cock: { b: 20, name: "the cock" }, eve: { b: 286, name: "the half sun on the far side" }, moon: { b: 180, name: "the moon" } } };
  const vdir = (b) => [Math.sin(b * Math.PI / 180), Math.cos(b * Math.PI / 180)];
  function vcross(b) {
    const h = vdir(b), p = vdir(VG.pressBear), P = VG.press, det = h[0] * -p[1] + p[0] * h[1];
    if (Math.abs(det) < 1e-9) return null;
    const t = (P[0] * -p[1] + p[0] * P[1]) / det, s = (h[0] * P[1] - h[1] * P[0]) / det;
    return t > 0 && s > 0 ? [h[0] * t, h[1] * t] : null;
  }
  function planSVG(big) {
    const L = E().f["c:lines"] || [], pr = flag("c:press"), X = (x) => (x + 78) * 300 / 170, Y = (y) => (32 - y) * 300 / 170;
    const far = (b, d) => { const v = vdir(b); return [v[0] * d, v[1] * d]; };
    let s = '<svg class="e2-draw e2-vplan" viewBox="0 0 300 136" aria-hidden="true"><rect width="300" height="136" fill="#EFE6CC"/>';
    VG.walls.forEach((w, i) => { s += '<path d="M' + X(w) + " " + Y(30) + "V" + Y(-42) + '" stroke="#B9A27A" stroke-width="2"/><text x="' + (X(w) + 2) + '" y="9" font-size="6" fill="#8A744C">' + (i + 1) + "</text>"; });
    L.forEach((k) => { const e = far(VG.notch[k].b, 90); s += '<path d="M' + X(0) + " " + Y(0) + "L" + X(e[0]) + " " + Y(e[1]) + '" stroke="#4A4A4A" stroke-width="1.2" stroke-dasharray="4 2"/>'; });
    if (pr) { const e = far(VG.pressBear, 150); s += '<path d="M' + X(VG.press[0]) + " " + Y(VG.press[1]) + "L" + X(VG.press[0] + e[0]) + " " + Y(VG.press[1] + e[1]) + '" stroke="#7A1F3D" stroke-width="1.4" stroke-dasharray="4 2"/>'; }
    if (pr) L.forEach((k) => { const c = vcross(VG.notch[k].b); if (c) s += '<circle cx="' + X(c[0]) + '" cy="' + Y(c[1]) + '" r="4" fill="none" stroke="#9E2416" stroke-width="1.6"/>'; });
    s += '<rect x="' + (X(0) - 4) + '" y="' + (Y(0) - 4) + '" width="8" height="8" fill="#3A2A14"/><text x="' + (X(0) + 6) + '" y="' + (Y(0) + 12) + '" font-size="7" fill="#3A2A14">hut</text>' +
      '<rect x="' + (X(70) - 4) + '" y="' + (Y(14) - 4) + '" width="8" height="8" fill="none" stroke="#7A1F3D" stroke-width="1.5"/><text x="' + (X(70) - 12) + '" y="' + (Y(14) - 7) + '" font-size="7" fill="#7A1F3D">press</text>' +
      '<path d="M278 126h14m-5 -4l5 4l-5 4" fill="none" stroke="#3A2A14" stroke-width="1.2"/><text x="238" y="129" font-size="6.5" fill="#3A2A14">to the city</text></svg>';
    return s;
  }
  function roofPlanSVG() {
    const n = (b, ic) => { const v = vdir(b), x = 75 + v[0] * 48, y = 62 - v[1] * 48; return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9" fill="#EFE6CC" stroke="#3A2A14"/>' + ic(x, y); };
    const half = (x, y) => '<path d="M' + (x - 5) + " " + (y + 2) + "a5 5 0 0 1 10 0z" + '" fill="#3A2A14"/><path d="M' + (x - 7) + " " + (y + 2) + "h14" + '" stroke="#3A2A14"/>';
    const moon = (x, y) => '<path d="M' + (x + 2) + " " + (y - 5) + "a5 5 0 1 0 0 10a4 4 0 1 1 0 -10z" + '" fill="#3A2A14"/>';
    const cock = (x, y) => '<path d="M' + (x - 5) + " " + (y + 4) + "q1 -8 6 -6q1 -4 4 -3l-2 3q2 5 -3 6z" + '" fill="#3A2A14"/>';
    return '<svg class="e2-draw e2-roofplan" viewBox="0 0 150 124" aria-hidden="true"><rect width="150" height="124" fill="#EFE6CC"/><rect x="27" y="14" width="96" height="96" fill="none" stroke="#3A2A14" stroke-width="2"/>' +
      '<circle cx="75" cy="62" r="4" fill="none" stroke="#3A2A14" stroke-width="1.5"/>' + n(74, half) + n(286, half) + n(180, moon) + n(20, cock) +
      '<path d="M128 62h16m-5 -4l5 4l-5 4" fill="none" stroke="#3A2A14" stroke-width="1.2"/><text x="112" y="76" font-size="6.5" fill="#3A2A14">to the city</text></svg>';
  }
  JX.vplan = () => planSVG(); JX.roof = () => roofPlanSVG();

  SC.push(
    { id: "c1", title: "The thread · 14 Av", act: "Scene 1 · Tuesday 17 August, 6:40 p.m.", music: "e2-table", amb: "indoor",
      task: () => (!flag("c:sun") ? "The next strip is tied: not before the fifteenth. When is that?" : !flag("c:strip") ? "The sun has gone. Cut the thread." : !flag("c:photo") ? "“My granddaughter.” Look at the photograph on the sill again." : "Done."),
      views: [{ id: "room", get img() { return flag("c:sun") ? "yoel-room-moon" : "yoel-room-dusk"; }, get cap() { return flag("c:sun") ? "Yoel's room. The moon is up over the Mount of Olives" : "Yoel's room in the last light. The city has been celebrating for two days"; },
        get hots() { return flag("c:sun") ?
          [{ box: [35, 8, 32, 32], label: "The window", act: "cwindow" }, { box: [70, 50, 11, 5], label: "The second book", act: "cbook" },
            { box: [64, 41, 10, 9], label: "Yoel's instrument", act: "cinst" }, { box: [75, 42, 18, 12], label: "The five frames", act: "cframes" },
            { box: [38, 40, 26, 4], label: "The photograph on the sill", act: "cphoto" }] :
          [{ box: [36, 9, 30, 30], label: "The window", act: "cwindow" }, { box: [68, 51, 17, 6], label: "The second book", act: "cbook" },
            { box: [62, 42, 9, 9], label: "Yoel's instrument", act: "cinst" }, { box: [73, 40, 19, 10], label: "The five frames", act: "cframes" },
            { box: [52, 37, 14, 8], label: "The photograph on the sill", act: "cphoto" }]; } }] },
    { id: "c2", title: "Shira · 15 Av", act: "Scene 2 · Wednesday 18 August, 8:40 a.m.", music: "e2-chain", amb: "street",
      task: () => (!flag("c:shira") ? "Find the woman in the photograph." : "Done."),
      views: [{ id: "steps", img: "v3-steps", cap: "The top of the steps in the Jewish Quarter, early morning. White bunting across the lane", go: { fwd: "inst" },
          hots: [{ box: [5, 40, 36, 34], label: "The newspaper seller", text: "Today's headline is three words: PEACE AND SAFETY. Under it, smaller: “Signature page to be published at 1 p.m.”", f: "c:headline" }] },
        { id: "inst", img: "../ti-hall", cap: "The Temple Institute, as you left it in December", go: { back: "steps" },
          who: [{ id: "shiradesk", name: "At the desk", act: "cshira" }] }] },
    { id: "c3", title: "The vineyard · 15 Av", act: "Scene 3 · Wednesday 18 August, 10:15 a.m.", music: "e2-vineyard", amb: "olives",
      task: () => (!flag("c:vd") ? "A terraced vineyard west of the city. Look around, and ask about the hut." : !flag("c:hut") ? "Find the watchman's hut." : "Done."),
      views: [{ id: "track", img: "v3-track", cap: "Where the track ends. Crates of grapes in the shade", go: { fwd: "terr" },
          hots: [{ box: [62, 52, 38, 28], label: "Crates of grapes", text: "Dark grapes, picked this morning, stacked in the shade of a fig. The harvest has begun.", f: "c:crates" },
            { box: [60, 37, 18, 9], label: "Far down the road", text: "Where the road bends under the pines, something grey is parked.", f: "c:grey" },
            { box: [0, 20, 36, 9], label: "The ridge to the east", text: "Jerusalem, small and pale on the skyline. Shira points: “The city is that way. From the roof you can see the towers.”", f: "c:ridge" }] },
        { id: "terr", img: "v3-terraces", cap: "The terraces. White dresses on a line between two fig trees", go: { back: "track", fwd: "hut" },
          who: [{ id: "vinedresser", name: "On the third terrace", act: "cvd" }],
          hots: [{ box: [8, 44, 84, 28], label: "The dresses on the line", text: "A dozen white dresses hung out to air, none the same size. Somebody has left a basket for the thirteenth.", f: "c:line" },
            { box: [34, 15, 60, 9], label: "The ridge", text: "The city again, pale on the skyline to the east. From here the terraces fall away westward, toward the sea.", f: "c:ridge2" },
            { box: [84, 75, 16, 9], label: "A basket", text: "A picker’s basket, empty. Beyond the hut there is a winepress cut in the rock, the old man says, and a dry cistern below it.", f: "c:press0" }] },
        { id: "hut", img: "v3-hut", cap: "The watchman's hut: four rough walls, a flat roof, a stone stair up the outside", go: { back: "terr" },
          hots: [{ box: [38, 45, 12, 19], label: "The doorway", act: "chutin" }, { box: [34, 41, 18, 4], label: "The lintel", text: "Scratched on the lintel, very small: a lamp, spout to the right.", f: "c:lintel" },
            { box: [52, 32, 36, 42], label: "The stair to the roof", text: "A narrow stone stair up the outside wall. From the roof a watchman could see every terrace.", f: "c:stair" }] }] },
    { id: "c4", title: "The watchman's sighting", act: "Scene 4 · Wednesday 18 August, 10:45 a.m.", music: "e2-vineyard", amb: "olives",
      task: () => (!(E().f["c:lines"] || []).length ? "The watch when the day turns. Climb to the roof and sight with the rod." : !flag("c:press") ? "Now the press: follow where the wine ran." : !flag("c:atwall") ? "Open the plan and walk to where your lines cross." : !has("wheel") ? "Somewhere in this wall. Yoel's lamp has its spout to the right." : "Done."),
      views: [{ id: "hut", img: "v3-hut", cap: "The hut, the press and the terraces. Late morning",
          hots: [{ box: [52, 32, 36, 42], label: "The stair to the roof", act: "croof" }, { box: [0, 68, 34, 28], label: "Walk over to the winepress", act: "cpress" },
            { box: [64, 78, 36, 18], label: "Yoel's plan of the vineyard", act: "cplan" }] },
        { id: "roof", img: "v3-roof", cap: "The roof of the hut: a low wall with notches, and a stone with a socket in the middle", go: { back: "hut" },
          hots: [{ box: [37, 52, 26, 18], label: "The stone with the socket: stand the rod in it", act: "csight" },
            { box: [62, 12, 26, 8], label: "The city on the ridge", text: "Jerusalem, on the skyline to the east. Yoel’s roof plan has a small arrow at one side: to the city.", f: "c:roofcity" }] },
        { id: "wall", img: "v3-wall", cap: "The fourth terrace wall, where a fig grows out of the stones", go: { back: "hut" }, need: "c:atwall",
          hots: [{ box: [3, 26, 25, 10], label: "A stone", act: "cstone:1" }, { box: [10, 63, 19, 11], label: "A stone", act: "cstone:2" }, { box: [25, 42, 40, 12], label: "A stone", act: "cstone:3" },
            { box: [31, 29, 28, 11], label: "A stone", act: "cstone:4" }, { box: [67, 52, 14, 8], label: "A stone", act: "cstone:5" }, { box: [49, 67, 22, 12], label: "A stone", act: "cstone:6" },
            { box: [0, 80, 44, 15], label: "The earth at the foot of the wall", text: "A patch of earth that has been dug and trodden back. Recently, and badly.", f: "c:dug" }] }] },
    { id: "c5", title: "The little foxes · 15 Av, noon", act: "Scene 5 · Wednesday 18 August, noon", music: "e2-chain", amb: "olives",
      task: () => (!has("lastpage") ? "You are not alone on the terrace." : !flag("c:sorted") ? "In the hut, out of the sun: read the page of seals with the loupe." : "Done."),
      views: [{ id: "above", img: "v3-haller", cap: "The terrace wall above. A grey coat, folded", go: { fwd: "bench" },
          who: [{ id: "haller", name: "On the wall, eating grapes", act: "challer" }] },
        { id: "bench", img: "v3-hutin", cap: "Inside the hut: a stone bench, a water jar, an empty shelf. Cool and dark", go: { back: "above" }, need: "lastpage",
          who: [{ id: "shiradesk", name: "Shira", act: "cshira5" }],
          hots: [{ box: [31, 53, 49, 14], label: "The stone bench: lay the page out", act: "csort" }] }] },
    { id: "c6", title: "With how many? · 15 Av", act: "Scene 6 · Wednesday 18 August, 3:30 p.m.", music: "e2-table", amb: "indoor",
      task: () => (!flag("c:paper") ? "The one o'clock paper has the page. Compare it with Haller's." : !flag("c:wheel") ? "At Yoel's table: seat the wheel of days." : !flag("c:c3") ? "Ask the third question." : "Done."),
      views: [{ id: "steps", img: "v3-steps", cap: "The Quarter steps, mid-afternoon. The newspaper seller has the afternoon edition", go: { fwd: "room" },
          hots: [{ box: [5, 40, 36, 34], label: "The newspaper seller", act: "cpaper" }] },
        { id: "room", img: "yoel-room", cap: "Yoel's table. Shira waits on the stair; she will not come in", go: { back: "steps" },
          hots: [{ box: [66, 56, 26, 8], label: "Yoel's instrument", act: "cwheel" }, { box: [70, 40, 22, 15], label: "The frames", act: "ctest" }] }] },
    { id: "c7", title: "The dance · 15 Av", act: "Scene 7 · Wednesday 18 August, 6:50 p.m.", music: "e2-dance", amb: "olives",
      task: () => (!flag("c:believe") ? "It is the fifteenth for half an hour more. See what the day is for." : !flag("c:end") ? "Back to the Street of the Chain." : "Done."),
      views: [{ id: "dance", img: "v3-dance", cap: "The vineyard at sunset. Lanterns along the walls; a fiddle, a drum, a clarinet", go: { fwd: "room" },
          who: [{ id: "shirawhite", name: "Shira, in the borrowed dress", act: "cdance" }],
          hots: [{ box: [62, 13, 20, 12], label: "The roof of the hut", text: "The vinedresser is sitting on the roof with his back to the music, looking out over the vines.", f: "c:watch" },
            { box: [24, 42, 74, 40], label: "The dancing", text: "The girls in white, going round between the rows. None of the dresses is the dancer's own.", f: "c:danc" }] },
        { id: "room", img: "yoel-room-cup", cap: "Yoel's room, 9 p.m. The door was locked, as you left it", go: { back: "dance" }, need: "c:sun2",
          hots: [{ box: [69, 46, 9, 10], label: "On the table", act: "ccup" }, { box: [54, 36, 8, 7], label: "The photograph on the sill", act: "csill" }, { box: [79, 50, 12, 5], label: "The second book", act: "cbook7" }] }] }
  );
  Object.assign(DONE, {
    c1: () => flag("c:strip") && flag("c:photo"), c2: () => flag("c:shira"), c3: () => flag("c:vd") && flag("c:hut"), c4: () => has("wheel") && flag("c:jar"),
    c5: () => flag("c:sorted"), c6: () => flag("c:wheel") && flag("c:c3"), c7: () => flag("c:end"),
  });

  /* the five frames in Act 3 */
  function frames3(third) {
    const st = ["lit", "lit", third === undefined ? (flag("c:c3") ? "lit" : flag("c:jar") ? "" : "shut") : third, "shut", "shut"], lab = [["נעשה", "Done"], ["הגביר", "Strong"], ["לרבים", "Many"]];
    return '<div class="e2-frames a2">' + st.map((s, i) => '<i class="e2-frame on ' + s + '">' + (s === "shut" ? "<small>•</small><b>shut</b>" : "<small>" + lab[i][0] + "</small><b>" + lab[i][1] + "</b>") + "</i>").join("") + "</div>";
  }
  ACT.cframes = () => K.card('<div class="kick">On the table</div><h2>Five brass frames</h2>' + frames3() + "<p>Two are lit by the Framework of Peace. The other three are covered with small brass shutters.</p>" +
    '<p class="fsmall">A shut frame is a question you have not been taught. It is not a failed test.</p><button class="cta" data-act="x">Back</button>', { x: after });
  /* the instrument in Act 3: with the wheel seated, every day shows both counts */
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const nextSun = (at) => { const n = SUNSET[at + 1]; return n ? n[0].replace("August", "Aug") + ", " + n[1] + " p.m." : "the next sunset"; };
  function inst3(at0, onSee) {
    let at = at0;
    const draw = () => {
      const s = SUNSET[at]; if (onSee) onSee(at);
      K.card('<div class="kick">Yoel’s instrument</div><h2>The ring of Av</h2>' + ringSVG(at, [11, 27]) +
        '<div class="e2-step big"><button data-act="l" aria-label="One day back">‹</button><em>' + at + ' Av</em><button data-act="r" aria-label="One day on">›</button></div>' +
        '<p class="e2-sunline">' + (s ? (flag("c:wheel") ? "<b>" + at + " Av</b> · from " + s[0].replace("August", "Aug") + ", " + s[1] + " p.m., to " + nextSun(at) : "Sunset that begins " + at + " Av: <b>" + s[0] + ", " + s[1] + " p.m.</b>") : "Outside the seventeen days. The plate has no line for it.") + "</p>" +
        '<div class="e2-seats"><span class="in"><b>☀</b><em>where the day turns</em></span><span class="' + (flag("c:wheel") ? "in" : "") + '"><b>' + (flag("c:wheel") ? "⚙" : "") + "</b><em>the days, as men count them</em></span><span><b></b><em>the long count</em></span></div>" +
        '<p class="fsmall">' + (flag("c:wheel") ? "The first time is the sunset that begins the day. The second is the sunset that begins the next. One seat is still empty." : "The sunset plate is seated. Two seats are still empty.") + '</p><button class="cta" data-act="x">Back</button>',
        { l: () => { at = at <= 1 ? 30 : at - 1; draw(); }, r: () => { at = at >= 30 ? 1 : at + 1; draw(); }, x: after });
    };
    draw();
  }
  ACT.cinst = () => inst3(14, (at) => { if (at === 15 && !flag("c:asked")) set("c:asked"); });

  /* ---- Scene 1: the thread ---- */
  ACT.cwindow = () => {
    if (flag("c:sun")) return K.card('<div class="kick">The window · night</div><h2>The moon</h2><p>Over the Mount of Olives, very nearly full. The street below is still loud.</p><button class="cta" data-act="x">Back</button>', { x: after });
    const step = E().f["c:wait"] || 0;
    if (!step) { set("c:wait", 1); return K.card('<div class="kick">The window</div>' + stamp("Tuesday 17 August · 6:40 p.m.") + "<h2>The Street of the Chain</h2><p>White bunting across the lane. A radio in the watchmaker’s shop below: “…the full text, with its page of signatures, will be released tomorrow at one o’clock.”</p><p>The grey car is back.</p>" +
      '<button class="cta" data-act="w">Stay at the window</button><button class="cta alt" data-act="x">Back to the room</button>', { w: ACT.cwindow, x: after }); }
    if (step === 1) { set("c:wait", 2); return K.card('<div class="kick">The window</div>' + stamp("7:15 p.m.") + "<h2>The light is going</h2><p>The sun is on the rim of the roofs. The stone has gone the colour of honey.</p>" +
      '<button class="cta" data-act="w">Wait</button><button class="cta alt" data-act="x">Back to the room</button>', { w: ACT.cwindow, x: after }); }
    set("c:sun"); F.S("harp", null, 0.4);
    K.card('<div class="kick">The window</div>' + stamp("7:21 p.m. · the sun goes") + "<h2>The fifteenth of Av</h2><p>The light goes out of the stone. About twenty minutes later a moon very nearly full comes up over the Mount of Olives.</p>" +
      '<p class="e2-jline">The middle of the month. Nobody in the street has looked up.</p><button class="cta" data-act="x">Back to the table</button>', { x: after });
  };
  ACT.cbook = () => {
    if (flag("c:strip")) return strip3(true);
    K.card('<div class="kick">The second book</div><h2>A thread, and a tag</h2>' + F.wnote("not before the fifteenth") + '<p>Under it, smaller: <i>You will know when. I taught you on the roof.</i></p>' +
      (flag("c:sun") ? '<button class="cta" data-act="c">Cut the thread</button>' :
        '<div class="fsay"><button data-act="now">Cut it now</button><button data-act="am">Sleep, and cut it in the morning</button><button data-act="i">Ask the instrument when the fifteenth begins</button></div>') +
      '<button class="cta alt" data-act="x">Leave it</button>',
      { x: after, i: ACT.cinst, c: () => strip3(), now: () => { K.snd("bad"); K.say("Your hand stops. It is still the fourteenth. He asked you for one thing.", "", 3600); ACT.cbook(); },
        am: () => K.card('<div class="kick">The second book</div><h2>In the morning</h2><p>You could. You would lose a night he meant you to have.</p><div class="fchoices two"><button data-act="y">Sleep</button><button data-act="n">Stay up</button></div>',
          { n: ACT.cbook, y: () => { set("c:sun"); set("c:morning"); strip3(); } }) });
  };
  function strip3(again) {
    const pages = [
      () => K.card('<div class="kick">The outer edge of the roll</div><h2>A title</h2>' + (flag("c:morning") && !again ? stamp("Wednesday 18 August · dawn") : "") + "<p>For the first time enough is unrolled to read the title strip, in Yoel’s hand:</p>" + F.wnote("The Tribulation Experiment") + '<button class="cta" data-act="x">Unroll the strip</button>', { x: () => { set("book:title"); pages[1](); } }),
      () => K.card('<div class="kick">The strip</div><h2>A drawing</h2><p>A small stone hut with a flat roof on a terraced hillside. It is the shelter drawn on the fifteenth in the calendar.</p>' +
        '<p class="e2-jline">“And the daughter of Zion is left as a cottage in a vineyard, as a lodge in a garden of cucumbers, as a besieged city.”<br><small>Isaiah 1:8</small></p><button class="cta" data-act="x">Go on</button>', { x: () => { set("book:hut"); pages[2](); } }),
      () => K.card('<div class="kick">The strip</div><h2>The roof of the hut</h2>' + roofPlanSVG() + "<p>A socket in the middle, the width of the rod. Four notches in the low wall, each with a tiny carved picture: a half sun, a moon, a cock, a half sun. A small arrow at one side: <i>to the city</i>.</p>" +
        F.wnote("The watchman keeps four watches. Stand where he stood, in the watch when the day turns. Then go to the press, and follow where the wine ran.") +
        '<p class="fsmall">“Watch ye therefore: for ye know not when the master of the house cometh, at even, or at midnight, or at the cockcrowing, or in the morning.” Mark 13:35</p><button class="cta" data-act="x">Go on</button>', { x: () => { set("book:roof"); pages[3](); } }),
      () => K.card('<div class="kick">The strip</div><h2>The last line</h2>' + F.wnote("My granddaughter knows the way. She has known you longer than you have known her.") + '<button class="cta" data-act="x">Go on</button>',
        { x: () => { if (again) return after(); set("c:strip"); F.S("parchment", "click", 0.5); yoelCard("e2-3-hut", after, "Close the book"); } }),
    ];
    pages[0]();
  }
  ACT.cphoto = () => {
    if (!flag("c:strip")) return K.card('<div class="kick">On the sill</div><h2>A photograph, face down</h2>' + OBJ("e2-photo") + "<p>As Yoel left it, and as you left it. Turned over: a young woman laughing on the steps of the Temple Institute. No name on the back.</p>" + '<button class="cta" data-act="x">Back</button>', { x: after });
    set("c:photo");
    K.card('<div class="kick">On the sill</div><h2>“My granddaughter”</h2>' + OBJ("e2-photo") + "<p>You turn the photograph over once more: the steps of the Temple Institute.</p>" + '<button class="cta" data-act="x">Go on</button>',
      { x: () => K.card('<div class="kick">The journal turns back</div>' + face("shira") + "<h2>Episode 1</h2><p>The guide at the Temple Institute, who put the brass plate in your hand and never gave her name.</p><p><i>You have met her.</i></p>" + '<button class="cta" data-act="x">Close</button>', { x: after }) });
  };
  FINISH.c1 = () => walk(view);

  /* ---- Scene 2: Shira ---- */
  ACT.cdress = () => { set("c:dress"); K.card('<div class="kick">The Temple Institute</div><h2>A white dress</h2><p>In a dry-cleaner’s bag, on the door behind the desk.</p>' + (flag("c:met") ? said("Shira", "It is the fifteenth. It is not mine. That is the rule: every girl wears a borrowed one, so no one is shamed who has none.") : "") + '<button class="cta" data-act="x">Back</button>', { x: after }); };
  ACT.cshira = () => {
    if (flag("c:shira")) { K.say("“The car is at the back. Come.”", "Shira", 3000); return; }
    const asked = E().f["c:q"] || {}, all = asked.a && asked.b && asked.c;
    const ask = (k, t) => () => { asked[k] = 1; set("c:q", asked); K.card('<div class="kick">The Temple Institute</div>' + face("shiradesk") + t + '<button class="cta" data-act="x">Go on</button>', { x: ACT.cshira }); };
    const leave = () => K.card('<div class="kick">The Temple Institute</div>' + (clip("shira-cup") || face("shiradesk")) + "<h2>The cup</h2>" + (has("coffee2") ? "<p>She has seen the iced coffee in your bag, and its label.</p>" : said("Shira", "Has anyone been near the room?") + "<p>You open the journal at the page from Jaffa Gate.</p>") +
      said("Shira", "Table. Whose table?") + "<p>A pause.</p>" + said("Shira", "He has been in the room. Then we do not leave by the front, and you do not tell me where you keep the book. If I do not know, I cannot be made to say.") +
      '<button class="cta" data-act="x">Out by the back</button>', { x: () => K.card('<div class="kick">The road west</div>' + stamp("9:30 a.m.") + face("shiradesk") + "<h2>Her car is small, and full of harvest crates</h2>" +
        said("Shira, driving", "My grandmother’s family worked those terraces. He asked her to marry him at that hut, on the fifteenth of Av. He leaves that out when he tells people it was Isaiah.") +
        '<button class="cta" data-act="x">Go on</button>', { x: () => { set("c:shira"); after(); } }) });
    if (!flag("c:met")) { set("c:met"); return K.card('<div class="kick">The Temple Institute</div>' + (clip("shira-desk") || face("shiradesk")) + "<h2>The woman in the photograph</h2><p>A few years older. A white dress in a dry-cleaner’s bag hangs on the door behind her.</p>" +
      said("Shira", (flag("c:morning") ? "You waited for the morning. He will tease you about that. " : "") + "Eight months. He said you would take a year. I said you would never come.") + '<button class="cta" data-act="x">Go on</button>', { x: ACT.cshira }); }
    K.card('<div class="kick">The Temple Institute</div>' + face("shiradesk") + "<h2>" + (all ? "She picks up her keys" : "What do you say?") + '</h2><div class="fsay">' +
      '<button data-act="a"' + (asked.a ? ' class="asked"' : "") + ">“You are his granddaughter.”</button>" + '<button data-act="b"' + (asked.b ? ' class="asked"' : "") + ">“You could have told me in December.”</button>" + '<button data-act="c"' + (asked.c ? ' class="asked"' : "") + ">“Where is he?”</button></div>" +
      (all ? '<button class="cta" data-act="go">Go on</button>' : "") + '<button class="cta alt" data-act="d">Look at the white dress on the door behind her</button><button class="cta alt" data-act="x">Step back</button>',
      { x: after, go: leave, d: () => { set("c:dress"); K.card('<div class="kick">The Temple Institute</div>' + face("shiradesk") + "<h2>A white dress</h2><p>In a dry-cleaner’s bag, on the door behind the desk.</p>" + said("Shira", "It is the fifteenth. It is not mine. That is the rule: every girl wears a borrowed one, so no one is shamed who has none.") + '<button class="cta" data-act="x">Go on</button>', { x: ACT.cshira }); }, a: ask("a", said("Shira", "Shira. You may use it now.")),
        b: ask("b", said("Shira", "He asked me not to. He said anyone looking for him would come through this door sooner or later, and I was to help them and say nothing. He wanted to know whether you would follow the evidence or follow me. People will follow a granddaughter anywhere. They do not check her arithmetic.")),
        c: ask("c", said("Shira", "Watching. It is all he has ever done. He is well. He will see you when the page is filled, and not before. Please do not ask me twice. I am bad at saying no.")) });
  };
  FINISH.c2 = () => go("c3");

  /* ---- Scene 3: the vineyard ---- */
  ACT.cvd = () => {
    const asked = E().f["c:vq"] || {};
    const ask = (k, t) => () => { asked[k] = 1; set("c:vq", asked); if (asked.a && asked.b && asked.c) set("c:vd"); K.card('<div class="kick">The third terrace</div>' + face("vinedresser") + said("The vinedresser", t) + '<button class="cta" data-act="x">Go on</button>', { x: ACT.cvd }); };
    K.card('<div class="kick">The third terrace</div>' + face("vinedresser") + '<h2>An old man with a pruning hook</h2><div class="fsay">' +
      '<button data-act="a"' + (asked.a ? ' class="asked"' : "") + ">“Do you know the man who used this hut?”</button>" + '<button data-act="b"' + (asked.b ? ' class="asked"' : "") + ">“What does a watchman do up there?”</button>" + '<button data-act="c"' + (asked.c ? ' class="asked"' : "") + ">“Has anyone else been here?”</button></div>" +
      '<button class="cta alt" data-act="x">Leave him to his work</button>',
      { x: after, a: ask("a", "The old man? He paid me every year to leave it alone. I would have left it alone for nothing."),
        b: () => { asked.b = 1; set("c:vq", asked); if (asked.a && asked.b && asked.c) set("c:vd"); K.card('<div class="kick">The third terrace</div>' + (clip("vinedresser") || face("vinedresser")) + said("The vinedresser", "At harvest you sit on the roof all night. Foxes, boys, starlings. Mostly you watch nothing. That is the work. The night you sleep is the night they come.") + '<button class="cta" data-act="x">Go on</button>', { x: ACT.cvd }); },
        c: ask("c", "Two men, last week. City shoes. They walked about with a telephone and dug by the wall, and filled it in badly. I told them the grapes were not ripe. They were not looking at the grapes.") });
  };
  ACT.chutin = () => { set("c:hut"); set("book:isa5"); set("book:vplan"); K.card('<div class="kick">The watchman’s hut</div><h2>Inside</h2><p>A stone bench, a water jar, an empty shelf. Cool and dark. Nothing is hidden here: you can see every stone of it.</p><p class="fsmall">The journal has a new page: Yoel’s plan of the vineyard.</p><button class="cta" data-act="x">Back out into the sun</button>', { x: after }); };
  FINISH.c3 = () => walk(view);

  /* ---- Scene 4: the watchman's sighting ---- */
  ACT.croof = () => { F.S("step", "click", 0.5); walk(scene.views.find((v) => v.id === "roof")); };
  ACT.csight = () => {
    const root = K.root(); if (!root) return;
    let aim = 150, held = null;
    const box = document.createElement("div"); box.className = "e2-sunset e2-case e2-sight";
    box.innerHTML = '<div class="e2-casebox"><div id="e2sv"></div><p class="e2-casesay" id="e2ss"></p></div>' +
      '<div class="e2-inst"><small class="e2-engr">The rod stands in the socket. Turn until the rod, a notch and the land beyond stand in one line.</small>' +
      '<div class="e2-row wide"><div class="e2-step"><button data-t="-10" aria-label="Turn left">«</button><button data-t="-1" aria-label="A little left">‹</button></div><div class="e2-rg"><input type="range" min="0" max="359" value="150" id="e2sr" aria-label="Turn on the roof"></div><div class="e2-step"><button data-t="1" aria-label="A little right">›</button><button data-t="10" aria-label="Turn right">»</button></div></div>' +
      '<button class="cta" id="e2sm" disabled>Mark this line on the plan</button>' +
      '<button class="e2-jbtn" id="e2sj">Open the journal</button><div class="e2-jbox" id="e2sjb" hidden></div></div>' +
      '<div class="e2-caseend"><button class="cta alt" id="e2sl">Climb down</button></div>';
    const rel = (b) => ((b - aim + 540) % 360) - 180, PX = 5;
    const pano = () => {
      const X = (b) => 150 + rel(b) * PX, vis = (b, w) => Math.abs(rel(b)) * PX < 150 + (w || 20);
      let s = '<svg viewBox="0 0 300 190" class="e2-casesvg" aria-hidden="true"><defs><linearGradient id="e2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC3E6"/><stop offset="1" stop-color="#E8E2C8"/></linearGradient></defs><rect width="300" height="190" fill="url(#e2sky)"/>';
      /* far hills all round, in bands, so turning is felt */
      for (let b = 0; b < 360; b += 12) if (vis(b, 40)) s += '<path d="M' + (X(b) - 34) + " 86q34 " + (-10 - (b * 7 % 13)) + " 68 0V110H" + (X(b) - 34) + 'z" fill="#B9B48A"/>';
      s += '<rect y="96" width="300" height="60" fill="#8FA35E"/>';
      for (let b = 0; b < 360; b += 6) if (vis(b)) s += '<path d="M' + (X(b) - 14) + " " + (112 + (b % 18)) + 'h28" stroke="#6E8446" stroke-width="2"/>';
      if (vis(84, 60)) s += '<g transform="translate(' + X(84) + ' 78)"><path d="M-30 8h60v-6h-8v-5h-6v5h-10v-9h-5v9h-12v-4h-6v4h-13z" fill="#E9E1CC" stroke="#A89C7C" stroke-width=".8"/></g>';
      if (vis(79, 30)) s += '<rect x="' + (X(79) - 9) + '" y="118" width="18" height="9" fill="#7A6A52" stroke="#3A2A14"/>';
      if (vis(180, 30)) s += '<ellipse cx="' + X(180) + '" cy="132" rx="11" ry="4" fill="#5A5246" stroke="#2A2014"/>';
      if (vis(20, 30)) s += '<path d="M' + X(20) + " 128v-12m0 4l-6 -6m6 4l6 -5" + '" stroke="#5A4630" stroke-width="3" fill="none"/>';
      if (vis(270, 80)) s += '<path d="M' + (X(270) - 70) + " 90h140" + '" stroke="#F4F0DC" stroke-width="2" opacity=".8"/>';
      /* your own shadow at 10:45: it falls away from the sun, which is south of east */
      if (vis(292, 40)) s += '<path d="M' + X(292) + " 188L" + (X(292) + 6) + ' 150" stroke="#1A1206" stroke-width="7" stroke-linecap="round" opacity=".28"/>';
      /* the low wall of the roof, with its notches */
      s += '<rect y="150" width="300" height="40" fill="#C9BC9A"/><path d="M0 150h300" stroke="#6A5A3A" stroke-width="2"/>';
      Object.keys(VG.notch).forEach((k) => { const b = VG.notch[k].b; if (!vis(b, 30)) return; const x = X(b);
        const ix = x - 30;   /* the carved picture sits on the wall beside its notch, clear of the rod */
        s += '<path d="M' + (x - 11) + " 150v18h22v-18" + '" fill="#8FA35E" stroke="#6A5A3A" stroke-width="2"/><rect x="' + (ix - 11) + '" y="164" width="22" height="22" rx="3" fill="#E4D9B8" stroke="#6A5A3A"/>' +
          (k === "moon" ? '<path d="M' + (ix + 2) + " 170a5 5 0 1 0 0 10a4 4 0 1 1 0 -10z" + '" fill="#3A2A14"/>' : k === "cock" ? '<path d="M' + (ix - 5) + " 181q1 -8 6 -6q1 -4 4 -3l-2 3q2 5 -3 6z" + '" fill="#3A2A14"/>' : '<path d="M' + (ix - 5) + " 178a5 5 0 0 1 10 0z" + '" fill="#3A2A14"/><path d="M' + (ix - 8) + " 178h16" + '" stroke="#3A2A14"/>'); });
      s += '<path d="M150 190V40" stroke="#5A3A16" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="40" r="4" fill="#C9A24A" stroke="#3A2A14"/></svg>';
      return s;
    };
    const look = (b) => (b === 74 ? "Through this notch, over the ridge: Jerusalem." : b === 286 ? "Through this notch: the terraces falling away, and far off a pale line that may be the sea." : b === 180 ? "Through this notch: the dry cistern." : "Through this notch: up the slope, past an old almond stump.");
    const draw = () => {
      box.querySelector("#e2sv").innerHTML = pano(); held = null;
      Object.keys(VG.notch).forEach((k) => { if (Math.abs(rel(VG.notch[k].b)) <= 2) held = k; });
      const L = E().f["c:lines"] || [];
      box.querySelector("#e2ss").textContent = held ? "The rod, the notch and the land stand in one line. " + look(VG.notch[held].b) + (L.includes(held) ? " (Already on the plan.)" : "") : "The low wall of the roof runs all the way round. Keep turning.";
      box.querySelector("#e2sm").disabled = !held || L.includes(held);
    };
    const turn = (d) => { aim = (aim + d + 360) % 360; box.querySelector("#e2sr").value = aim; draw(); };
    box.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => { K.sfx("click"); turn(+b.dataset.t); }));
    const rg = box.querySelector("#e2sr"); rg.oninput = () => { aim = +rg.value; draw(); };
    rg.onchange = () => { Object.keys(VG.notch).forEach((k) => { if (Math.abs(rel(VG.notch[k].b)) <= 4) { aim = VG.notch[k].b; rg.value = aim; } }); draw(); };
    box.querySelector("#e2sm").onclick = () => { if (!held) return; const L = (E().f["c:lines"] || []).slice(); L.push(held); set("c:lines", L); set("book:vplan"); F.S("rod", "click", 0.6); K.buzz("success");
      box.querySelector("#e2ss").textContent = "A pencil line on Yoel’s plan: from the hut, through " + VG.notch[held].name + ", across the hillside."; box.querySelector("#e2sm").disabled = true;
      const j = box.querySelector("#e2sjb"); j.hidden = false; j.innerHTML = planSVG(); };
    box.querySelector("#e2sj").onclick = () => { const j = box.querySelector("#e2sjb"); j.hidden = !j.hidden; j.innerHTML = "<p><b>The roof of the hut</b></p>" + roofPlanSVG() + "<p><i>Stand where he stood, in the watch when the day turns.</i></p><p><b>The plan</b></p>" + planSVG(); };
    box.querySelector("#e2sl").onclick = () => { box.remove(); walk(scene.views[0]); };
    root.appendChild(box); draw();
    if (!flag("c:roofsaid")) { set("c:roofsaid"); K.say("Late morning. Your own shadow lies long across the roof.", "", 3600); }
  };
  ACT.cpress = () => {
    if (flag("c:press")) return K.card('<div class="kick">The winepress</div><h2>The way the wine ran</h2>' + planSVG() + '<p>The line is on the plan.</p><button class="cta" data-act="x">Back</button>', { x: after });
    K.card('<div class="kick">The winepress</div><h2>Lay the rod in the channel</h2><img class="e2-obj tall" src="img/fsy/w/v3-press.jpg" alt="A winepress cut in the rock: a treading floor, a stained channel, a deep round vat">' +
      "<p>The stained channel runs from the square floor to the deep vat. The rod lies in it exactly. It has two ends: which way do you sight along it?</p>" +
      '<div class="fsay"><button data-act="up">From the vat, back toward the floor</button><button data-act="dn">From the floor, on past the vat</button></div><button class="cta alt" data-act="x">Step back</button>',
      { x: after, up: () => { K.snd("bad"); K.say("The line runs uphill into the sky. Wine does not run uphill.", "", 3600); ACT.cpress(); },
        dn: () => { set("c:press"); set("book:vplan"); F.S("rod", "click", 0.6); K.buzz("success");
          K.card('<div class="kick">The winepress</div><h2>Where the wine ran</h2>' + planSVG() + "<p>From the floor, down the channel and on: the line runs west along the hillside, a little above the hut. It is drawn on the plan.</p>" + '<button class="cta" data-act="x">Go on</button>', { x: after }); } });
  };
  ACT.cplan = () => {
    const L = E().f["c:lines"] || [], pr = flag("c:press"), acts = { x: after }; let btn = "";
    if (pr) L.forEach((k) => { const c = vcross(VG.notch[k].b);
      if (c) { btn += '<button data-act="g' + k + '">Walk to where the line through ' + VG.notch[k].name + " meets the press line</button>"; acts["g" + k] = () => crossing(k); }
      else btn += '<button disabled>The line through ' + VG.notch[k].name + " and the press line never meet</button>"; });
    K.card('<div class="kick">The journal</div><h2>Yoel’s plan of the vineyard</h2>' + planSVG() +
      "<p>" + (!L.length && !pr ? "Nothing is drawn on it yet." : !pr ? "A line from the hut. One line alone does not say where." : !L.length ? "The press line. One line alone does not say where." : "Where two lines cross, there is a place.") + "</p>" +
      (btn ? '<div class="fsay">' + btn + "</div>" : "") + '<button class="cta alt" data-act="x">Close</button>', acts);
  };
  function crossing(k) {
    if (k === "eve") { set("c:atwall"); F.S("step", "click", 0.5); return walk(scene.views.find((v) => v.id === "wall")); }
    const T = { morn: ["The top of the track", "The lines cross under Shira’s car. He would not hide it under a road. And sunrise is not when the day turns."],
      cock: ["The almond stump", "A hornets’ nest in the hollow of the stump. You leave quickly."], moon: ["The cistern", "A rusted tin with a child’s marbles in it, forty years old. The lines do not meet. Not this watch."] }[k];
    K.snd("bad"); K.card('<div class="kick">Where the lines cross</div><h2>' + T[0] + "</h2><p>" + T[1] + '</p><p class="fsmall">The watch when the day turns. When does the day turn, and where does the sun do that?</p><button class="cta" data-act="x">Back to the hut</button>', { x: after });
  }
  const lampSVG = (left, fresh) => '<svg class="e2-draw e2-lampmark" viewBox="0 0 120 70" aria-hidden="true"><rect width="120" height="70" fill="#B9AD90"/><g transform="' + (left ? "translate(120 0) scale(-1 1)" : "") + '" fill="none" stroke="' + (fresh ? "#F4F0E2" : "#8E846C") + '" stroke-width="' + (fresh ? 2.4 : 1.6) + '"><path d="M30 42c0-8 8-10 20-10h18c8 0 12 3 16 7l-10 3c-6 6-16 9-26 9-10 0-18-3-18-9z"/><path d="M84 36c3-8 1-15-2-20"/></g></svg>';
  ACT.cstone = (n) => {
    n = +n;
    if (n === 2) { set("c:left"); return K.card('<div class="kick">The fourth terrace wall</div><h2>A lamp, spout to the left</h2>' + lampSVG(true, true) + "<p>The scratches are bright and new. The earth under the stone has been turned and trodden back. Behind it: nothing.</p>" +
      '<p class="e2-jline">Somebody had his mark and not his mind.</p><button class="cta" data-act="x">Back</button>', { x: after }); }
    if (n === 5) {
      if (has("wheel")) return K.card('<div class="kick">The fourth terrace wall</div><h2>The hollow</h2><p>Straw, and the ring where a jar stood for years.</p><button class="cta" data-act="x">Back</button>', { x: after });
      return K.card('<div class="kick">The fourth terrace wall</div><h2>A lamp, spout to the right</h2>' + lampSVG(false, false) + "<p>Worn almost smooth. The stone moves. Behind it, in a hollow lined with straw: a clay jar the height of a forearm, its lid sealed with pitch.</p>" + OBJ("e2-jar") +
        '<button class="cta" data-act="x">Break the seal</button>', { x: jar });
    }
    K.card('<div class="kick">The fourth terrace wall</div><h2>A stone</h2><p>' + ["Bare. Lichen, and a lizard that does not move.", "", "Bare. It does not shift.", "Bare, and warm from the sun.", "", "Bare. A snail shell in the joint."][n - 1] + '</p><button class="cta" data-act="x">Back</button>', { x: after });
  };
  function jar() {
    F.S("stone", "click", 0.6);
    K.card('<div class="kick">The jar</div><h2>Wrapped in linen</h2>' + OBJ("e2-wheel") +
      "<p>A toothed brass wheel a hand across, its rim engraved with the numbers 1 to 31 and, in Yoel’s small hand, <i>August</i>. Each tooth is split by a fine line with a tiny sun on it.</p><p>And a strip of the second book, cut off and stored here.</p>" +
      '<button class="cta" data-act="x">Read the strip</button>', { x: () => { give("wheel");
        K.card('<div class="kick">The strip from the jar</div><h2 class="e2-heb">לָרַבִּים · With how many?</h2><p class="e2-jline">“And I subscribed the evidence, and sealed it, and took witnesses.”<br><small>Jeremiah 32:10</small></p><p class="e2-jline">“Take these evidences… and put them in an earthen vessel, that they may continue many days.”<br><small>Jeremiah 32:14</small></p>' +
          '<button class="cta" data-act="x">Go on</button><button class="cta alt" data-act="m">Look at the margin with the loupe</button>',
          { m: () => { set("book:ten"); K.card('<div class="kick">The margin</div><h2>In pencil</h2>' + F.wnote("Dan. 7:24. Not this page's question.") + '<button class="cta" data-act="x">Go on</button>', { x: heard }); }, x: heard }); } });
    const heard = () => yoelCard("e2-3-jar", () => { set("c:jar"); set("book:c3"); K.buzz("success");
      K.card('<div class="kick">The journal · a new page</div><h2>The wheel of days</h2><p>Found in the jar at the fourth terrace. The third question: with how many? Israel and three more. Witnesses do not count.</p><button class="cta" data-act="x">Close</button>', { x: after }); }, "Go on");
  }
  FINISH.c4 = () => go("c5");

  /* ---- Scene 5: the little foxes ---- */
  ACT.challer = () => {
    if (has("lastpage")) { K.say("He has gone, down between the rows. The rest of the bunch is on the wall.", "", 3600); return; }
    const asked = E().f["c:hq"] || {}, n = Object.keys(asked).length;
    const ask = (k, t) => () => { asked[k] = 1; set("c:hq", asked); K.card('<div class="kick">The terrace wall</div>' + face("haller") + said("Haller", t) + '<button class="cta" data-act="x">Go on</button>', { x: ACT.challer }); };
    const give1 = () => K.card('<div class="kick">The terrace wall</div>' + (clip("haller-grapes") || face("haller")) + "<p>He takes a folded sheet from the coat and holds it out.</p>" +
      said("Haller", "The last page of the Framework. The signatures. The newspapers have it at one o’clock. You have it at noon, because my employer’s office drew up the page and I see every sheet before the printers do. Do not take my word for it. Lay it beside the newspaper this afternoon. His third question is how many. Count them. It will pass.") +
      said("Shira", "How do you know his third question?") + said("Haller", "Because I have read everything he published, before he stopped publishing. I am the only person who ever took him seriously. It is a strange thing to have in common with you.") +
      '<button class="cta" data-act="x">Take the page</button>', { x: () => { give("lastpage"); F.S("parchment", "click", 0.5);
        K.card('<div class="kick">The terrace wall</div>' + (clip("haller-vines") || face("haller")) + "<p>He stands and brushes off the coat. He leaves the rest of the bunch on the wall. He has carried nothing away.</p>" +
          said("Haller", "One thing, for the drive back. Ask yourself why he drew five frames, when three would have made him famous.") + "<p>He walks down between the rows. Nobody stops him.</p>" + said("Shira", "My grandmother had a name for men like that. The little foxes.") +
          '<p class="fsmall">The journal marks the page: From Haller. Not yet checked.</p><button class="cta" data-act="x">Go on</button>',
          { x: () => { set("book:foxes"); note("haller", "In the vineyard on 15 Av, eating grapes. He handed over the Framework's last page an hour before the papers: “It will pass.” And: “Ask yourself why he drew five frames, when three would have made him famous.”"); after(); } }); } });
    if (!flag("c:hmet")) { set("c:hmet"); return K.card('<div class="kick">The terrace wall above</div>' + stamp("Noon") + face("haller") + "<h2>Haller</h2><p>Sitting on the wall above you, his grey coat folded beside him, eating grapes.</p>" + said("Shira, quietly", "That is the man who came to the Institute asking for my grandfather. Twice.") + said("Haller", "Sit, if you like. I am not armed. I have grapes.") + '<button class="cta" data-act="x">Go on</button>', { x: ACT.challer }); }
    K.card('<div class="kick">The terrace wall</div>' + face("haller") + '<h2>What do you say?</h2><div class="fsay">' +
      [["a", "“You are stealing them.”"], ["b", "“Your men dug at the wrong stone.”"], ["c", "“Are you going to take it?”"], ["d", "“What do you want?”"]].map((q) => '<button data-act="' + q[0] + '"' + (asked[q[0]] ? ' class="asked"' : "") + ">" + q[1] + "</button>").join("") + "</div>",
      { a: ask("a", "The law of Moses allows it. A man may eat his fill in his neighbour’s vineyard. He may not carry any away in a vessel. I notice that you have a vessel."),
        b: ask("b", "They did. They had his mark and not his mind. You have his mind. It is why I am polite to you."),
        c: ask("c", "His brass? No. I do not need his instrument. I need his place, and he has not written that down for anyone yet. Not even for you."),
        d: () => { asked.d = 1; set("c:hq", asked); K.card('<div class="kick">The terrace wall</div>' + face("haller") + said("Haller", "Today, to save you an afternoon.") + '<button class="cta" data-act="x">Go on</button>', { x: give1 }); } });
  };
  ACT.cshira5 = () => K.say(flag("c:sorted") ? "“So we know what it says. We do not yet know that it is the page. He told us himself how to find out.”" : "“Out of the sun. Lay it on the bench. Read each one before you move it.”", "Shira", 4600);
  const SEALS = [
    ["isr", "THE PARTIES", "The State of Israel", "Sealed and signed."], ["ded", "THE PARTIES", "The Kingdom of Dedan", "Sealed and signed."], ["she", "THE PARTIES", "The Kingdom of Sheba", "Sealed and signed."],
    ["ked", "THE PARTIES", "The Emirate of Kedar", "Sealed. The signature line is empty. Typed beside it: to accede."], ["host", "HOST OF THE SIGNING", "The Kingdom of Dedan", "The same seal as above, a second time."],
    ["rep", "GUARANTEED BY", "The Republic, by its President", "The Republic’s seal. The line is empty, typed: to be signed. Typed above the seal: “The Republic guarantees the performance of this Framework.” Its President said on the thirteenth, in his own voice, “I have made strong.”"],
    ["tar", "IN THE PRESENCE OF", "The Merchant Republics of Tarshish", "Sealed and signed."],
    ["row", "IN THE PRESENCE OF", "A row of small seals", "Seven seals, each with a tiny crown. After them, three inked rings with nothing in them, as if places were being kept. Set a little apart, one more seal with no crown: under the loupe, a tiny seated woman. The heading: The Seven, and those who will sit with them, in the year of his chair."],
  ];
  const TRAYS = { b: "Bound", g: "Stands behind it", w: "Only saw", o: "Left off the count" };
  const rowSVG = () => '<svg class="e2-draw" viewBox="0 0 300 44" aria-hidden="true"><rect width="300" height="44" fill="#F4EBD2"/>' + Array.from({ length: 7 }, (_, i) => '<circle cx="' + (22 + i * 24) + '" cy="24" r="9" fill="#B23A2A" stroke="#6A1A10"/><path d="M' + (17 + i * 24) + " 13l2 -5l3 4l3 -4l2 5z" + '" fill="#C9A24A"/>').join("") +
    Array.from({ length: 3 }, (_, i) => '<circle cx="' + (190 + i * 24) + '" cy="24" r="9" fill="none" stroke="#3A2A14" stroke-dasharray="3 2"/>').join("") + '<circle cx="278" cy="24" r="9" fill="#7A6A9A" stroke="#3A2A5A"/><path d="M278 19a2 2 0 1 0 .1 0M274 30q4 -9 8 0z" fill="#F4EBD2"/></svg>';
  ACT.csort = () => {
    if (!has("lastpage")) return;
    const put = E().f["c:put"] || {}, read = E().f["c:read"] || {};
    if (flag("c:sorted")) return K.card('<div class="kick">The last page</div><h2>Counted</h2>' + frames3("") + "<p>Israel and three more: Dedan, Sheba, and the Republic that guarantees it.</p>" + '<p class="fsmall">From Haller. ' + (flag("c:paper") ? "Matches the page published at 1 p.m." : "Not yet checked.") + '</p><button class="cta" data-act="x">Back</button>', { x: after });
    const acts = { x: after };
    SEALS.forEach((s) => (acts["s" + s[0]] = () => { read[s[0]] = 1; set("c:read", read); F.S("parchment", "click", 0.3); const a2 = { x: ACT.csort };
      Object.keys(TRAYS).forEach((t) => (a2[t] = () => { put[s[0]] = t; set("c:put", put); K.sfx("click"); ACT.csort(); }));
      if (s[0] === "row" && !flag("book:ten")) set("book:ten");
      K.card('<div class="kick">Under the loupe · ' + s[1] + "</div><h2>" + esc(s[2]) + "</h2>" + (s[0] === "row" ? rowSVG() : "") + "<p>" + esc(s[3]) + "</p>" +
        (s[0] === "row" ? '<p class="e2-jline">Seven crowned seals. Then three empty rings. You count them together. Ten.</p>' + said("Shira, over your shoulder", "Grandfather calls it a table set for ten. Seven chairs filled. Three places kept. He has held the chair since the first of January. He has a page about that table. He never let me read it.") : "") +
        '<h2 class="e2-q">Where does it belong?</h2><div class="fsay">' + Object.keys(TRAYS).map((t) => '<button data-act="' + t + '"' + (put[s[0]] === t ? ' class="asked"' : "") + ">" + TRAYS[t] + "</button>").join("") + '</div><button class="cta alt" data-act="x">Put it back unsorted</button>', a2); }));
    acts.count = () => {
      const inn = (k) => put[k] === "b" || put[k] === "g"; let msg = "";
      if (SEALS.some((s) => !put[s[0]])) msg = "Read every entry with the loupe, and give each a place.";
      else if (inn("tar") || inn("row")) msg = "Too many. Yoel’s hand on the strip: a crowd at a wedding is not married.";
      else if (inn("ked")) msg = "A seal is furniture. Where is the hand?";
      else if (inn("host")) msg = "The same seal twice is one kingdom with two jobs.";
      else if (!inn("rep")) msg = "Israel and two. Whose President said, I have made it strong?";
      else if (!(inn("isr") && inn("ded") && inn("she"))) msg = "Signed and sealed under THE PARTIES: that one is bound.";
      if (msg) { K.snd("bad"); K.say(msg, "", 4800); return ACT.csort(); }
      set("c:sorted"); K.buzz("success"); F.S("harp", null, 0.5);
      K.card('<div class="kick">The count</div><h2>Israel and three more</h2><p>Dedan. Sheba. And the Republic that guarantees it.</p>' + said("Shira", "So it passes. By one. And the one is his.") + said("Shira", "So we know what it says. We do not yet know that it is the page. He told us himself how to find out.") +
        '<p class="fsmall">Counted, not yet trusted. The one o’clock paper will have it.</p><button class="cta" data-act="x">Go on</button>', { x: after });
    };
    const n = SEALS.filter((s) => put[s[0]] === "b" || put[s[0]] === "g").length;
    K.card('<div class="kick">In the hut · the Framework’s last page</div>' + OBJ("e2-lastpage") + '<div class="e2-paper"><b>Signed, sealed, witnessed</b>' +
      '<p class="fsmall" style="text-align:center"><i>I count states and governing bodies, never persons. One is counted if it is bound: as a party, by its signature; or as a guarantor, by its own act.</i></p>' +
      SEALS.map((s) => '<button class="e2-look' + (read[s[0]] ? " seen" : "") + '" data-act="s' + s[0] + '"><em>' + s[1] + "</em><span>" + esc(s[2]) + "</span>" + (put[s[0]] ? '<span class="q">→ ' + TRAYS[put[s[0]]] + "</span>" : '<span class="q">Tap to read with the loupe</span>') + "</button>").join("") + "</div>" +
      '<p class="e2-jline">In the count: <b>' + n + "</b>" + (n ? " (Israel and " + Math.max(0, n - 1) + " more, if Israel is among them)" : "") + '</p><button class="cta" data-act="count">Count them</button><button class="cta alt" data-act="x">Leave the bench</button>', acts);
  };
  FINISH.c5 = () => go("c6");

  /* ---- Scene 6: with how many? ---- */
  ACT.cpaper = () => {
    if (flag("c:paper")) { K.say("The afternoon edition. The page is the same.", "", 3000); return; }
    const seen = E().f["c:cmp"] || [0, 0, 0], L = [["The order of the seals", "The same, seal for seal, in both."], ["Kedar’s line", "Empty in the newspaper too. Typed beside it: to accede."], ["The row of small seals", "Seven with crowns, three empty rings, one set apart. The same."]];
    const acts = { x: after }; [0, 1, 2].forEach((i) => (acts["k" + i] = () => { const s = seen.slice(); s[i] = 1; set("c:cmp", s); F.S("parchment", "click", 0.3); ACT.cpaper(); }));
    acts.done = () => { set("c:paper"); K.buzz("success"); K.card('<div class="kick">The journal</div><h2>Checked</h2><p>Haller’s page is the page that was published. That does not show that every signature on it is genuine. The journal claims only what was checked:</p>' + F.wnote("From Haller. Matches the page published at 1 p.m.") + '<button class="cta" data-act="x">Close</button>', { x: after }); };
    K.card('<div class="kick">The Quarter steps</div>' + stamp("3:30 p.m.") + OBJ("e2-lastpage") + '<div class="e2-paper"><b>The one o’clock edition, beside Haller’s page</b>' +
      L.map((l, i) => '<button class="e2-look' + (seen[i] ? " seen" : "") + '" data-act="k' + i + '"><em>' + l[0] + "</em>" + (seen[i] ? "<span>" + l[1] + "</span>" : '<span class="q">Tap to compare with the loupe</span>') + "</button>").join("") + "</div>" +
      (seen[0] && seen[1] && seen[2] ? '<button class="cta" data-act="done">Write it in the journal</button>' : "") + '<button class="cta alt" data-act="x">Step back</button>', acts);
  };
  /* the wheel sits in half-tooth steps; p = 0 is true. Each Hebrew day takes the evening of one date and the daylight of the next. */
  const wheelSay = (av, p) => { const h = (av + 2) * 2 + 1 + p, d = Math.floor(h / 2); return h % 2 ? "from the evening of " + d + " August through the daylight of " + (d + 1) + " August" : "the whole of " + d + " August, midnight to midnight"; };
  ACT.cwheel = () => {
    if (flag("c:wheel")) return inst3(15);
    if (!has("wheel")) return inst3(15);
    let p = E().f["c:wp"]; if (p === undefined) p = -4;
    const draw = () => K.card('<div class="kick">Yoel’s instrument · the second seat</div><h2>The wheel of days</h2><p>It drops into the seat, but it turns freely. Engraved on its back: <i>Set it by a day you have lived.</i></p>' +
      '<div class="e2-step big"><button data-act="l" aria-label="Half a tooth back">‹</button><em>turn</em><button data-act="r" aria-label="Half a tooth on">›</button></div>' +
      '<div class="e2-paper"><b>What this position claims</b><p><b>13 Av:</b> ' + wheelSay(13, p) + "</p><p><b>15 Av:</b> " + wheelSay(15, p) + "</p></div>" +
      '<div class="e2-page"><b>From the journal: days you have lived</b><p>The sun went at 7:23 on Sunday 15 August, and the 13th of Av began.</p><p>The Framework says “concluded this day”, Monday 16 August, at noon: Yoel’s first frame dated it 13 Av.</p><p>Last night the sun went at 7:21 on Tuesday 17 August, and the thread could be cut: the 15th of Av.</p></div>' +
      '<button class="cta" data-act="s">Seat it here</button><button class="cta alt" data-act="x">Leave it loose</button>',
      { x: after, l: () => { p = Math.max(-8, p - 1); set("c:wp", p); K.sfx("click"); draw(); }, r: () => { p = Math.min(8, p + 1); set("c:wp", p); K.sfx("click"); draw(); },
        s: () => { if (p !== 0) { K.snd("bad"); K.say(p % 2 ? "A Hebrew day is not a civil day. It takes the evening of one date and the daylight of the next." : "It will not click. Check it against a day you lived: when did the 13th begin, and what date was its daylight?", "", 5200); return draw(); }
          set("c:wheel"); set("book:wheel"); F.S("lock", "click", 0.8); K.buzz("success"); yoelCard("e2-3-wheel", () => inst3(15), "Look at the ring"); } });
    draw();
  };
  ACT.ctest = () => {
    if (flag("c:c3")) return ACT.cframes();
    if (!flag("c:paper")) { K.snd("bad"); K.say("The third shutter lifts, but the frame will not take the page. You have one man’s word for this page. Whose? The newspaper seller is at the top of the steps.", "", 5200); return; }
    if (!flag("c:sorted")) { K.say("Count the page first.", "", 2600); return; }
    K.card('<div class="kick">Yoel’s table · 15 Av</div><h2 class="e2-heb">לָרַבִּים · With the many</h2>' + frames3("") + "<p>The brass shutter on the third frame has lifted. The Framework of Peace, with its last page clipped to it, lies on the table.</p>" +
      '<button class="cta" data-act="s">Slide it under the third frame</button><button class="cta alt" data-act="x">Not yet</button>',
      { x: after, s: () => { F.S("harp", null, 0.6); K.buzz("success"); K.card('<div class="kick">Under the third frame</div><h2>Framework of Peace</h2>' + frames3("lit") + '<p class="e2-jline">Lit. Israel, Dedan, Sheba, and the Republic that guarantees it.</p><button class="cta" data-act="x">Go on</button>',
        { x: () => yoelCard("e2-3-three", () => { set("c:c3"); set("book:t15");
          K.card('<div class="kick">The journal · a new page</div><h2>15 Av</h2><p>With the many: lit. Israel and three more. It passes by one, and the one is the Republic of the man who made it strong. Two questions I have not been taught.</p><button class="cta" data-act="x">Close</button>', { x: after }); }, "Go on") }); } });
  };
  FINISH.c6 = () => K.card('<div class="kick">At the foot of the stair</div>' + stamp("6:50 p.m.") + face("shirawhite") + "<h2>Shira, in the borrowed white dress</h2>" + said("Shira", "It is the fifteenth for half an hour more. You have been in that room since the Ninth of Av. Come and see what the day is for.") + '<button class="cta" data-act="x">Go with her</button>', { x: () => go("c7") });

  /* ---- Scene 7: the dance, and the third cup ---- */
  ACT.cdance = () => {
    if (flag("c:sun2")) { K.say("“Go. I will drive you to the gate.”", "Shira", 3000); return; }
    const sun = () => { set("c:sun2"); K.card('<div class="kick">The vineyard</div>' + stamp("7:20 p.m. · the sun goes") + "<h2>The sixteenth of Av</h2><p>The light leaves the top terrace last. By the wheel and the plate: Wednesday 18 August, 7:20 p.m.</p><p>The dance has not stopped. On the roof of the hut the old man has not turned round.</p>" + '<button class="cta" data-act="x">Go on</button>', { x: after }); };
    const ans = (k, t) => () => { set("c:believe", k); note("yoel", "At the dance on 15 Av, asked whom I believed, I said: " + { y: "her grandfather", h: "Haller was right today", p: "neither; the page" }[k] + "."); K.card('<div class="kick">The vineyard</div>' + face("shirawhite") + t + '<button class="cta" data-act="x">Go on</button>', { x: sun }); };
    if (flag("c:believe")) return sun();
    K.card('<div class="kick">The vineyard at sunset</div>' + clip("dance") + '<h2>The fifteenth of Av</h2><p class="e2-jline">“There were no days so glad for Israel as the fifteenth of Av and the Day of Atonement. On them the daughters of Jerusalem went out in white garments, borrowed, so as not to shame any who had none, and danced in the vineyards. And what did they say? <i>Young man, lift up your eyes, and see what you choose.</i>”<br><small>Mishnah Ta’anit 4:8</small></p>' +
      '<button class="cta" data-act="x">Go on</button>', { x: () => { set("book:dance"); K.card('<div class="kick">The vineyard</div>' + face("shirawhite") + said("Shira", "Lift up your eyes and see what you choose. So. The man with the grapes says it will pass. My grandfather says keep counting. Tonight, which of them do you believe?") +
        '<div class="fsay"><button data-act="y">“Your grandfather.”</button><button data-act="h">“Haller was right today.”</button><button data-act="p">“Neither. I believe the page.”</button></div>',
        { y: ans("y", said("Shira", "He will be pleased. He should not be. You have not checked him either.")), h: ans("h", said("Shira", "He was. That is what frightens me about him.")),
          p: ans("p", "<p>Shira looks at you for a moment.</p>" + said("Shira", "That is what he was waiting to hear someone say.")) }); } });
  };
  ACT.csill = () => { set("c:sill"); K.card('<div class="kick">On the sill</div><h2>The photograph</h2><p>Yoel left it face down. It is standing upright, facing the door.</p><button class="cta" data-act="x">Back</button>', { x: after }); };
  ACT.cbook7 = () => { set("c:tag"); K.card('<div class="kick">The second book</div><h2>Untouched</h2><p>Its next strip is tied with Yoel’s own thread, as it always was.</p>' + F.wnote("not before the twentieth") + '<button class="cta" data-act="x">Back</button>', { x: after }); };
  ACT.ccup = () => {
    if (flag("c:end")) return endAct3();
    set("book:three"); note("haller", "On the night of 15 Av, an iced coffee on Yoel's table behind a locked door, labelled THREE. He is counting too.");
    K.card('<div class="e2-cupph"><img src="img/fsy/pz/e2-cup3.jpg" alt="An iced coffee with a white label"><b>THREE</b></div>' +
      stamp("9 p.m.") + "<p>The door was locked, as you left it. The key turned.</p><p>On the table, beside the instrument, stands an iced coffee. Ice still floats beneath the lid. The label says <b>THREE</b>.</p>" +
      '<p class="fsmall">Nothing has been taken. The frames are as they were: three lit, two shut.</p><button class="cta" data-act="x">Go on</button>',
      { x: () => K.card('<div class="kick">&nbsp;</div><h2 class="e2-later">Three frames lit. Two unopened.</h2><p style="text-align:center"><i>He is counting too.</i></p><button class="cta" data-act="x">Go on</button>', { x: () => { set("c:end"); E().done.c7 = 1; save(); endAct3(); } }) });
  };
  FINISH.c7 = () => endAct3();
  function endAct3() {
    K.card('<div class="kick">The Final Seven Years · Episode 2</div><div class="e2-acttitle"><small>Act 3 · The Cottage in the Vineyard</small><b>Complete</b></div>' +
      "<p>The ring stands on 16 Av. The next strip is tied: <i>not before the twentieth</i>.</p>" +
      '<button class="cta" data-act="n">Go on to Act 4 · The Blank Annex</button><button class="cta alt" data-act="x">Back to the episodes</button><button class="cta alt" data-act="again">Play Act 3 again</button>',
      { n: () => go("d1"), x: () => K.shut(), again: () => { const e = E(); A3.forEach((id) => { delete e.done[id]; });
        Object.keys(e.f).forEach((k) => { if (/^(c:|book:(title|hut|roof|vplan|isa5|c3|ten|foxes|wheel|t15|dance|three)|heard:e2-3|seenAct:c)/.test(k)) delete e.f[k]; });
        ["wheel", "lastpage"].forEach((k) => delete e.items[k]); save(); go("c1"); } });
  }
  function hint3(id) {
    const f = flag, n = (k) => { const c = (E().f[k] || 0); set(k, c + 1); return c; }, L = E().f["c:lines"] || [];
    if (id === "c1") return !f("c:sun") ? ["The tag says the fifteenth. Ask the instrument when the fifteenth begins.", "A Hebrew day begins at sunset. Wait at the window."][Math.min(1, n("hint:c1"))] : !f("c:strip") ? "Cut the thread on the second book." : "Look at the photograph on the sill.";
    if (id === "c2") return "She works where you met her: the Temple Institute. Walk forward, and ask her everything.";
    if (id === "c3") return !f("c:vd") ? "Walk forward to the terraces and ask the old man all three questions." : "Walk on to the hut and look in at the door.";
    if (id === "c4") return !L.length ? ["Tap the stair, stand the rod in the socket and turn until a notch lines up.", "The day turns at sunset. Sunset is in the west. Which way is the city?"][Math.min(1, n("hint:c4a"))] : !f("c:press") ? "Walk over to the winepress. Look the way the wine ran: from the floor, on past the vat." :
      !f("c:atwall") ? (L.includes("eve") ? "Open Yoel’s plan and walk to where the far-side half sun line meets the press line." : "You have not sighted the watch when the day turns. The two half suns are alike: sunset is on the side away from the city.") : "Yoel’s lamp has its spout to the right. Try each stone.";
    if (id === "c5") return !has("lastpage") ? "Speak to the man on the wall. Ask him what he wants." : ["Walk forward into the hut and tap the bench. Read each seal with the loupe before you place it.", "Jeremiah’s page had three kinds of hand. Only two of them count.", "A seal without a signature is not on the page. A state whose President confirmed it in his own voice is."][Math.min(2, n("hint:c5"))];
    if (id === "c6") return !f("c:paper") ? "The newspaper seller, here on the steps: compare all three things." : !f("c:wheel") ? ["Tap the instrument. Turn the wheel until what it claims agrees with the journal.", "The 13th of Av began on the evening of 15 August, and its daylight was 16 August."][Math.min(1, n("hint:c6"))] : "Tap the frames and slide the page under the third.";
    return !f("c:believe") ? "Speak to Shira." : "Walk forward, back to Yoel’s room, and look at the table.";
  }

  /* ============================================================ ACT 4 · THE BLANK ANNEX (prototype) ============================================================
     Script: the Claude Doc "LAMP Episode 2, Act 4: The Blank Annex — Script" (second draft after Gerry's review, 18 Nov 2026).
     Rooms and streets reuse finished pictures; the café terrace is a temporary picture (img/fsy/w/v4-cafe.jpg, app/tools/make_e2_act4_standins.py). Yoel's four lines show as text until recorded.
     Scenes d1 … d7. Flags are prefixed "d:". The fifth frame has two halves: peace or safety above, the place and who holds it below. */
  const A4 = ["d1", "d2", "d3", "d4", "d5", "d6", "d7"];
  ACTNAME[4] = "Act 4 · The Blank Annex";
  Object.assign(LINES, {
    "e2-4-fourth": "Three questions you have asked of the page. Is it done. Who made it strong. With how many. Now ask the one that men skip, because they think the answer is plain. Is Israel in it? Not mentioned in passing. In it: as a party, or as the one its terms are about.",
    "e2-4-fifth": "The last question has two halves, and most pages answer only the first. Does it promise peace, or safety? That is the upper half. The lower half is harder. Does it name the place, and say who holds it?",
    "e2-4-king": "They came to Samuel and said, give us a king, like the nations. They did not stop praying. They did not burn the scrolls. They kept His name on their lips and put a man in His chair. That is how it begins. Not with men who hate God. With men who are tired of waiting for Him. People are rarely deceived by something that looks evil. If the one who is coming looked like ruin, who would follow him? He will look like the answer to prayer.",
    "e2-4-pointer": "The plate tells you when a day begins. The wheel tells you which day it is. The pointer tells you how far. It is the long count. Do not turn it yet. It turns only from a day that is fixed, and no day is fixed until the fifth frame is whole.",
  });
  Object.assign(ITEMS, {
    upkey: ["A small brass key", "Taped inside the back of the photograph. “The upper one. She keeps the lower. I did not trust myself with both.”"],
    lowkey: ["A second brass key", "From Shira, on a cord. Yoel gave it to her when she was nineteen."],
    annex: ["Annex C, from Haller", "One sheet of heavy paper, sealed at the foot. From Haller, on the bench, on 23 Av."],
    pointer: ["The pointer", "A slim brass hand as long as a forearm, with a tiny toothed counter at its hub. At its tip, engraved: 1,260."],
  });
  BOOKP.push(
    ["c4", "The fourth question: Is Israel in it?", "“A page can speak her name and not concern her at all. For my test she must be a party to it, or its terms must be laid on her by name. Her hand is not required. But her name in a list is not enough.” Above Daniel 9:27, in pencil, from 9:24: thy people."],
    ["t20", "20 Av · Is Israel in it?", "Lit. Israel is a party to it. Four lit. One covered, with two keyholes."],
    ["c5", "The fifth question, in two halves", "Peace, or safety? And the place: whose? “By the place I mean Jerusalem, or the Mount, by name. And naming it is not enough: the page must say who holds it. This is my test, not the prophet’s own wording. I have written it down so that I can be shown wrong. A door left open is not a house given.”"],
    ["t21", "21 Av · The last question", "Peace or safety: lit. The place and who holds it: dark. The Framework gives access. It gives the Mount to no one. Annex C is blank. Four and a half."],
    ["coin", "Haller’s coin", "A Temple coin. On one side a temple and a dove. On the other, under a lamp, two faces: Cyrus, and behind him a second face worn smooth. Round the rim, by his telling: “He hath charged me to build him an house at Jerusalem.” Ezra 1:2. He quoted Isaiah 44:28 and meant every word."],
    ["king", "Give us a king", "“They have not rejected thee, but they have rejected me, that I should not reign over them.” 1 Samuel 8:7. “If another shall come in his own name, him ye will receive.” John 5:43. “Because they received not the love of the truth… God shall send them strong delusion, that they should believe a lie.” 2 Thessalonians 2:10–11."],
    ["own", "By his own act", "“Do not ask me who he is. I will not write a name, and you must not. A man is revealed by what he does, by his own act, in the sight of all. Until the hand moves, you hold a question. Keep it a question.” In the margin: 2 Thess. 2:3. First the falling away. Then the revealing. Then That Day. In that order."],
    ["backs", "On the backs of three slips", "THE SERGEANT · AT THE SHUT GATE · ON THE TWENTY-FOURTH."],
    ["watch", "The watchman’s duty", "“But if the watchman see the sword come, and blow not the trumpet, and the people be not warned… his blood will I require at the watchman’s hand.” Ezekiel 33:6. Yoel: the one who carries the coin is not your enemy. Blow it, even for him."],
    ["annex", "Annex C, from Haller", "Custody of the holy esplanade to a Council of the Parties. A house of prayer for Israel on the place measured in the Schedule. The measure in the Schedule is Yoel’s own."],
    ["seal", "The seal on the annex", "Raised, hollow behind, and backwards. The Framework says every annex bears the same seals as its last page. This one does not. The seal is counterfeit. Who made the page, and whether its words are true, I cannot yet say."],
    ["t23a", "23 Av · I took Haller’s annex", "The lower half is grey. I wrote down what I did."],
    ["t23r", "23 Av · I gave it back", "Haller offered a page whose seal is not the Framework’s. It may be tomorrow’s words. It is not today’s proof. Dark."],
    ["warned", "Said to Haller", "I told him. Ezekiel 33:6. He did not hear it. It was still mine to say."],
    ["pointer", "The pointer", "From Sergeant Ben-Ami, at the Eastern Gate, on 24 Av. The long count. It will not turn until a day is fixed."],
    ["t24", "24 Av · Watching the sun", "The instrument is whole. The President speaks tonight, a little after seven. If he speaks before the sun goes, it is still the twenty-fourth. If after, the twenty-fifth."]
  );

  /* the five frames in Act 4: the fifth is two half frames */
  const pic4 = (id) => '<img class="e2-obj" src="' + PP + id + '.jpg" alt="">';
  const choice4 = () => E().f["d:choice"];
  function frames4(o) {
    o = o || {};
    const one = (s, l) => '<i class="e2-frame on ' + s + '">' + (s === "shut" ? "<small>•</small><b>shut</b>" : "<small>" + l[0] + "</small><b>" + l[1] + "</b>") + "</i>";
    const f4 = o.f4 !== undefined ? o.f4 : flag("d:c4") ? "lit" : flag("d:thread") ? "" : "shut";
    const up = !flag("d:up") ? "shut" : flag("d:c5") ? "lit" : "", low = !flag("d:low") ? "shut" : !flag("d:c5") ? "" : choice4() === "a" ? "grey" : "dark";
    return '<div class="e2-frames a2">' + one("lit", ["נעשה", "Done"]) + one("lit", ["הגביר", "Strong"]) + one("lit", ["לרבים", "Many"]) + one(f4, ["ישראל", "Israel"]) +
      '<i class="e2-frame on split"><span class="' + up + '">' + (up === "shut" ? "shut" : "Peace") + '</span><span class="' + low + '">' + (low === "shut" ? "shut" : "Place") + "</span></i></div>";
  }
  const count4 = () => (!flag("d:c4") ? "Three frames lit. Two under brass shutters." : !flag("d:c5") ? "Four lit. One covered." : "Four lit. Half lit. Half " + (choice4() === "a" ? "grey" : "dark") + ".");
  ACT.dframes = () => K.card('<div class="kick">On the table</div><h2>Five brass frames</h2>' + frames4() + "<p>" + count4() + "</p>" +
    (flag("d:c4") && !flag("d:up") ? '<p class="fsmall">The fifth shutter has no thread. It has two small keyholes, one above the other.</p>' : "") + '<button class="cta" data-act="x">Back</button>', { x: after });

  /* ---- drawings ---- */
  function coinSVG(back) {
    const rim = '<circle cx="80" cy="80" r="74" fill="#B9B4A6" stroke="#5E5A50" stroke-width="3"/><circle cx="80" cy="80" r="66" fill="none" stroke="#7E7A6E" stroke-width="1"/>';
    if (!back) return '<svg class="e2-draw e2-coin" viewBox="0 0 160 160" aria-hidden="true">' + rim +
      '<path d="M56 112V62h48v50M50 62h60l-6 -8H56zM64 112V70M74 112V70M86 112V70M96 112V70M46 112h68v6H46z" fill="none" stroke="#3E3A32" stroke-width="2.4"/>' +
      '<path d="M108 40q8 -8 16 -2q-6 2 -8 8q-6 2 -10 -2zM104 46l-8 6" fill="none" stroke="#3E3A32" stroke-width="2"/></svg>';
    return '<svg class="e2-draw e2-coin" viewBox="0 0 160 160" aria-hidden="true">' + rim +
      '<path d="M80 26v22M66 30q0 16 14 18q14 -2 14 -18M58 32q2 22 22 22q20 0 22 -22M72 28v10M88 28v10M74 54h12l3 8H71z" fill="none" stroke="#3E3A32" stroke-width="2"/>' +
      '<path d="M78 74q20 -4 28 12q4 12 -2 24q-2 10 -14 14h-18z" fill="#A9A498" stroke="#8E897C" stroke-width="1" opacity=".75"/>' +
      '<path d="M52 82q6 -12 20 -10l4 -6l4 7q8 4 8 14l-4 2l4 8l-6 2q0 10 -8 12q4 8 -2 14H52q-6 -24 0 -43z" fill="#CFCABB" stroke="#3E3A32" stroke-width="2"/>' +
      '<path d="M60 108q8 8 4 20M66 106q8 8 6 20" fill="none" stroke="#3E3A32" stroke-width="1.4"/><text x="50" y="142" font-size="9" font-weight="700" fill="#3E3A32" letter-spacing="1.5">CYRUS</text></svg>';
  }
  JX.coin = () => coinSVG(1);
  /* the Republic's seal. The crown leans toward the text (to the left) on the true press. mir: Haller's annex. tr: 0 none, 1 the tracing as traced, 2 the tracing turned over */
  function sealSVG(mir, tr, cap) {
    const crown = (f, s, d) => '<path d="M36 60l-14 -26l18 10l2 -22l12 18l12 -8l4 28z" fill="' + f + '" stroke="' + s + '" stroke-width="' + (d ? 1.6 : 1.2) + '"' + (d ? ' stroke-dasharray="4 2.5"' : "") + "/>";
    const flip = (g) => '<g transform="translate(120,0) scale(-1,1)">' + g + "</g>";
    const c0 = crown("#C9A24A", "#6A4A0E"), t0 = crown("none", "#2A4A9A", 1);
    return '<svg class="e2-draw e2-seal" viewBox="0 0 200 120" aria-hidden="true"><rect width="200" height="120" fill="#F4EBD2"/>' +
      '<path d="M8 30h62M8 42h54M8 54h60M8 66h46M8 78h58" stroke="#B9A98A" stroke-width="3"/>' +
      '<g transform="translate(78,0)"><circle cx="60" cy="56" r="44" fill="#B23A2A" stroke="#6A1A10" stroke-width="2"/><circle cx="60" cy="56" r="36" fill="none" stroke="#8A2A1C" stroke-width="1"/>' +
      (mir ? flip(c0) : c0) + '<path d="M40 70h40M44 80h32" stroke="#8A2A1C" stroke-width="3"/>' + (tr ? (tr === 2 ? flip(t0) : t0) : "") + "</g>" +
      (cap ? '<text x="100" y="114" text-anchor="middle" font-size="9" fill="#3A2A14">' + cap + "</text>" : "") + "</svg>";
  }
  const pointerSVG = () => '<svg class="e2-draw" viewBox="0 0 300 60" aria-hidden="true"><rect width="300" height="60" fill="#F4EBD2"/><path d="M28 30L270 24l18 6l-18 6z" fill="#C9A24A" stroke="#6A4A0E" stroke-width="1.5"/>' +
    '<circle cx="28" cy="30" r="14" fill="#B08A3A" stroke="#6A4A0E" stroke-width="1.5"/><circle cx="28" cy="30" r="4" fill="#F4EBD2" stroke="#6A4A0E"/>' + Array.from({ length: 22 }, (_, i) => '<path d="M' + (52 + i * 9) + " 27v6" + '" stroke="#6A4A0E" stroke-width=".8"/>').join("") +
    '<text x="250" y="18" font-size="10" font-weight="700" fill="#3A2A14">1,260</text></svg>';

  SC.push(
    { id: "d1", title: "Not before the twentieth · 20 Av", act: "Scene 1 · Monday 23 August, 8:10 a.m.", music: "e2-table", amb: "indoor",
      task: () => (!flag("d:thread") ? "The thread on the fourth shutter is tagged: not before the twentieth. It is the twentieth." : !flag("d:c4") ? "Is Israel in it? Stamp each page in the folder." : "Done."),
      views: [{ id: "room", img: "yoel-room", cap: "Yoel's room on Monday morning. Three frames lit, two under brass shutters",
        hots: [{ box: [70, 40, 22, 15], label: "The frames, and the thread on the fourth shutter", act: "dthread" }, { box: [62, 56, 30, 10], label: "The folder of old agreements", act: "dstamp" },
          { box: [54, 38, 12, 6], label: "The photograph", text: "Upright, facing the door, as you found it on the night of the fifteenth.", f: "d:ph0" },
          { box: [36, 9, 30, 30], label: "The window", text: "Monday morning. The bunting is still up. The grey car is not there.", f: "d:win0" }] }] },
    { id: "d2", title: "The two halves · 21 Av", act: "Scene 2 · Tuesday 24 August, 9:30 a.m.", music: "e2-table", amb: "indoor",
      task: () => (!has("upkey") ? "Two keyholes and no key. Yoel left one thing in this room that he turned face down." : !flag("d:up") ? "Try the key in the fifth shutter." : !flag("d:low") ? "“She keeps the lower.” Go to the Temple Institute." : !flag("d:c5") ? "Sort the Framework’s clauses with Shira." : !flag("d:cup") ? "Leave by the steps." : "Done."),
      views: [{ id: "room", img: "yoel-room", cap: "Yoel's room. The fifth shutter has two keyholes", go: { fwd: "inst" },
          hots: [{ box: [54, 38, 12, 6], label: "The photograph", act: "dphoto" }, { box: [70, 40, 22, 15], label: "The fifth shutter", act: "dfifth" }] },
        { id: "inst", img: "../ti-hall", cap: "The Temple Institute. Shira is at her desk with the printed sheet of the Framework", go: { back: "room", fwd: "steps" }, need: "d:up",
          who: [{ id: "shirakey", name: "Shira, at her desk", act: "dshira" }] },
        { id: "steps", img: "v3-steps", cap: "The steps outside, late morning", go: { back: "inst" }, need: "d:c5",
          hots: [{ box: [52, 68, 22, 14], label: "A paper cup on the step", act: "dcup4" }] }] },
    { id: "d3", title: "Haller’s coffee · 22 Av", act: "Scene 3 · Wednesday 25 August, 10:00 a.m.", music: "e2-chain", amb: "street",
      task: () => (!flag("d:coffee") ? "“Tomorrow, ten. The terrace above the Cardo. I’ll buy.”" : "Done."),
      views: [{ id: "cardo", img: "jq-cardo", cap: "The Cardo. A stair goes up to a terrace above the columns", go: { fwd: "cafe" } },
        { id: "cafe", img: "v4-cafe", cap: "A café terrace above the Cardo. Two coffees on the table. One is iced", go: { back: "cardo" },
          who: [{ id: "hallercoin", name: "Haller, already seated", act: "dhaller" }],
          hots: [{ box: [38, 54, 30, 11], label: "Two coffees", text: "One hot, his. One iced, where you would sit. The ice has not begun to melt.", f: "d:two" }] }] },
    { id: "d4", title: "Give us a king · 22 Av", act: "Scene 4 · Wednesday 25 August, 6:30 p.m.", music: "e2-table", amb: "indoor",
      task: () => (!flag("d:slips") ? "The second book has a page with a coin drawn at its head." : !flag("d:ezek") ? "Someone is calling in the street below." : "Done."),
      views: [{ id: "room", img: "yoel-room-dusk", cap: "Yoel's room in the last light. The twenty-third begins at about 7:12",
        hots: [{ box: [68, 51, 17, 6], label: "The second book", act: "dslips" }, { box: [36, 9, 30, 30], label: "The window", act: "dwindow" }, { box: [73, 40, 19, 10], label: "The five frames", act: "dframes" }] }] },
    { id: "d5", title: "The annex · 23 Av", act: "Scene 5 · Thursday 26 August, 4:15 p.m.", music: "e2-chain", amb: "street",
      task: () => (!has("annex") ? "Haller is on the bench outside the watch repairer, with an envelope." : !flag("d:seal") ? "Test the seal on the annex against the one you trust." : "Done."),
      views: [{ id: "shops", img: "chain-shops", cap: "The Street of the Chain. The bench outside the watch repairer, under the clock painted at 9:27",
        who: [{ id: "hallerbench", name: "Haller, on the bench", act: "dannex" }],
        hots: [{ box: [70, 62, 27, 22], label: "Your satchel: the loupe and the tracing paper", act: "dseal" }] }] },
    { id: "d6", title: "The choice · 23 Av", act: "Scene 6 · Thursday 26 August, 4:40 p.m.", music: "e2-chain", amb: "street",
      task: () => (!choice4() ? "Lay the tracing in front of him." : !flag("d:after") ? "One thing is still unexplained." : "Done."),
      views: [{ id: "shops", img: "chain-shops", cap: "The same bench. The tracing lies on the annex between you",
        who: [{ id: "hallerbench", name: "Haller", act: "dchoice" }] }] },
    { id: "d7", title: "The pointer · 24 Av", act: "Scene 7 · Friday 27 August, 4:30 p.m.", music: "e2-roof", amb: "olives",
      task: () => (!has("pointer") ? "The sergeant, at the shut gate, on the twenty-fourth." : !flag("d:seated") ? "Back to Yoel’s room. The instrument has one empty seat." : !flag("d:end") ? "The sun is going. Watch from the window." : "Done."),
      views: [{ id: "gate", img: "v4-gate", cap: "The Eastern Gate from below, late on Friday afternoon. Olives and graves on the slope", go: { fwd: "room" },
          who: [{ id: "benami", name: "Sergeant Ben-Ami", act: "dbenami" }] },
        { id: "room", img: "yoel-room-dusk", cap: "Yoel's room, 6:40 p.m. Twenty-fifth of Av begins at 7:10", go: { back: "gate" }, need: "pointer",
          hots: [{ box: [62, 42, 9, 9], label: "Yoel's instrument", act: "dpoint" }, { box: [36, 9, 30, 30], label: "The window", act: "dwin" }, { box: [73, 40, 19, 10], label: "The five frames", act: "dframes" }] }] }
  );
  Object.assign(DONE, { d1: () => flag("d:c4"), d2: () => flag("d:cup"), d3: () => flag("d:coffee"), d4: () => flag("d:ezek"), d5: () => flag("d:seal"), d6: () => flag("d:after"), d7: () => flag("d:end") });

  /* ---- Scene 1: not before the twentieth ---- */
  ACT.dthread = () => {
    if (flag("d:thread")) return ACT.dframes();
    K.card('<div class="kick">The fourth shutter</div>' + stamp("Monday 23 August · 8:10 a.m. · 20 Av") + "<h2>A thread, and a tag</h2>" + frames4() + F.wnote("not before the twentieth") + "<p>Until today it would not pull.</p>" +
      '<button class="cta" data-act="p">Pull the thread</button><button class="cta alt" data-act="x">Not yet</button>',
      { x: after, p: () => { set("d:thread"); F.S("lock", "click", 0.6); yoelCard("e2-4-fourth", () => { set("book:c4");
        K.card('<div class="kick">Behind the shutter · a page of the second book</div><h2 class="e2-heb">עַמְּךָ · thy people</h2><p>Daniel 9:27 again. Above the line, in pencil, two words from 9:24: <i>thy people</i>.</p>' +
          F.wnote("A page can speak her name and not concern her at all. For my test she must be a party to it, or its terms must be laid on her by name. Her hand is not required: men have divided her land in rooms where she had no chair, and those pages were about her all the same. But her name in a list is not enough.") +
          '<p class="fsmall">Under the frames, the folder of old agreements has three pages he marked for this question.</p><button class="cta" data-act="x">Go on</button>', { x: after }); }, "Read the page"); } });
  };
  const PAGES4 = [
    ["two", "Treaty of Friendship", "Between the Kingdom of Sheba and the Merchant Republics of Tarshish. Ships, harbours, a marriage. You read it twice with the loupe. Israel is not in it anywhere.", "abs"],
    ["trade", "The Coastal Air Accord", "New flights between Dedan and Tarshish. Israel appears once: in a schedule at the back, in a list of nine countries whose airspace the routes will cross.", "men"],
    ["res", "A Resolution of the Powers", "Five powers signed it. Israel is not among them. Its three articles set her borders by name, line by line, and say when she must withdraw behind them.", "sub"],
    ["fw", "The Framework’s last page", "Under THE PARTIES: The State of Israel. Sealed and signed.", "par"],
  ];
  const STAMPS4 = { par: "A party", sub: "The named subject", men: "Only mentioned", abs: "Absent" };
  ACT.dstamp = () => {
    if (!flag("d:thread")) { K.say("A folder of old agreements, in Yoel’s hand. Three pages are marked with a slip: for the fourth question.", "", 4200); return; }
    if (flag("d:c4")) return K.card('<div class="kick">The folder</div><h2>Stamped</h2>' + frames4() + "<p>Two pages light the fourth frame: the Resolution, where she is the named subject, and the Framework, where she is a party.</p>" + '<button class="cta" data-act="x">Back</button>', { x: after });
    const put = E().f["d:put"] || {}, read = E().f["d:read"] || {}, acts = { x: after };
    PAGES4.forEach((p) => (acts["p" + p[0]] = () => { read[p[0]] = 1; set("d:read", read); F.S("parchment", "click", 0.3); const a2 = { x: ACT.dstamp };
      Object.keys(STAMPS4).forEach((t) => (a2[t] = () => { put[p[0]] = t; set("d:put", put); F.S("stamp", "click", 0.5); ACT.dstamp(); }));
      K.card('<div class="kick">Under the loupe</div><h2>' + esc(p[1]) + "</h2><p>" + esc(p[2]) + '</p><h2 class="e2-q">Where is Israel in it?</h2><div class="fsay">' +
        Object.keys(STAMPS4).map((t) => '<button data-act="' + t + '"' + (put[p[0]] === t ? ' class="asked"' : "") + ">" + STAMPS4[t] + "</button>").join("") + '</div><button class="cta alt" data-act="x">Put it back unstamped</button>', a2); }));
    acts.chk = () => {
      let msg = ""; const w = PAGES4.find((p) => put[p[0]] !== p[3]);
      if (PAGES4.some((p) => !put[p[0]])) msg = "Read every page with the loupe, and stamp each one.";
      else if (w) msg = { two: "Read the Treaty of Friendship again. Is her name anywhere on it?", trade: put.trade === "abs" ? "She is on the Air Accord. Once. Look in the schedule." : "The Air Accord: her name in a list is not enough.",
        res: put.res === "par" ? "She signed nothing in the Resolution. Yet what is it about?" : "The Resolution: she had no chair in that room. The page was about her all the same.", fw: "The Framework: under THE PARTIES, sealed and signed." }[w[0]];
      if (msg) { K.snd("bad"); K.say(msg, "", 5000); return ACT.dstamp(); }
      set("d:c4"); set("book:t20"); K.buzz("success"); F.S("harp", null, 0.6);
      K.card('<div class="kick">Under the fourth frame</div><h2>Framework of Peace</h2>' + frames4({ f4: "lit" }) + '<p class="e2-jline">Lit. Israel is a party to it.</p><button class="cta" data-act="x">Go on</button>',
        { x: () => K.card('<div class="kick">The journal · a new page</div><h2>20 Av</h2><p>Is Israel in it? Lit. Israel is a party to it. Four lit. One covered.</p><p>The fifth shutter has no thread. It has two small keyholes, one above the other.</p>' +
          '<p class="e2-jline">Two keyholes. One frame. He never did anything twice without a reason.</p><button class="cta" data-act="x">Close</button>', { x: after }) });
    };
    K.card('<div class="kick">Yoel’s table · the fourth question</div><div class="e2-paper"><b>Is Israel in it?</b>' +
      '<p class="fsmall" style="text-align:center"><i>A party, or the one its terms are about: the frame lights. Only mentioned, or absent: it stays dark.</i></p>' +
      PAGES4.map((p) => '<button class="e2-look' + (read[p[0]] ? " seen" : "") + '" data-act="p' + p[0] + '"><em>' + esc(p[1]) + "</em>" + (put[p[0]] ? '<span class="q">Stamped: ' + STAMPS4[put[p[0]]] + "</span>" : '<span class="q">Tap to read with the loupe</span>') + "</button>").join("") + "</div>" +
      '<button class="cta" data-act="chk">Hold them to the frame</button><button class="cta alt" data-act="x">Leave the folder</button>', acts);
  };

  /* ---- Scene 2: the two halves ---- */
  ACT.dphoto = () => {
    if (has("upkey")) { K.say("Shira, laughing, on the Institute steps. The tape on the back is empty now.", "", 3600); return; }
    K.card('<div class="kick">On the sill</div>' + stamp("Tuesday 24 August · 9:30 a.m. · 21 Av") + "<h2>The photograph</h2>" + OBJ("e2-photo") + "<p>It has stood upright since the night of the fifteenth. You have looked at the front of it many times.</p>" +
      '<button class="cta" data-act="t">Take the back off the frame</button><button class="cta alt" data-act="x">Leave it</button>',
      { x: after, t: () => { give("upkey"); F.S("lock", "click", 0.5); K.card('<div class="kick">Inside the back</div><h2>A small brass key</h2><p>Taped to the card, with a line in Yoel’s hand:</p>' +
        F.wnote("The upper one. She keeps the lower. I did not trust myself with both.") + '<button class="cta" data-act="x">Take the key</button>', { x: after }); } });
  };
  ACT.dfifth = () => {
    if (flag("d:up")) return ACT.dframes();
    if (!has("upkey")) return K.card('<div class="kick">The fifth shutter</div><h2>Two keyholes</h2>' + frames4() + "<p>One above the other. No thread, no tag, and no key on the table.</p>" + '<button class="cta" data-act="x">Back</button>', { x: after });
    K.card('<div class="kick">The fifth shutter</div><h2>The upper keyhole</h2>' + frames4() + '<button class="cta" data-act="t">Turn the key</button><button class="cta alt" data-act="x">Not yet</button>',
      { x: after, t: () => { set("d:up"); F.S("lock", "click", 0.7); yoelCard("e2-4-fifth", () => K.card('<div class="kick">The fifth frame</div><h2>Half a question</h2>' + frames4() +
        "<p>The top half of the shutter folds down. Behind it, half a frame, and half a question: <i>peace, or safety?</i></p><p>The lower half stays shut.</p>" + '<button class="cta" data-act="x">Go on</button>', { x: after }), "Go on"); } });
  };
  const CLAUSES = [
    ["war", "The parties end every state of war between them.", "u"], ["sec", "The Republic guarantees the security of the parties’ borders.", "u"],
    ["fly", "Flights, trade and post shall open between the parties.", "n"], ["amb", "Ambassadors shall be exchanged within ninety days.", "n"],
    ["acc", "Worshippers of every faith shall have access to the holy places of Jerusalem.", "l"], ["anx", "Annex C. Arrangements concerning the holy esplanade: to be agreed.", "l"],
  ];
  const HALF = { u: "Upper: peace, or safety", l: "Lower: the place", n: "Neither" };
  function lowerTest(i) {
    const Q = [["acc", "Worshippers of every faith shall have access to the holy places of Jerusalem.", "Does it name the place?", "y", "It names Jerusalem. By Yoel’s rule that is the place."],
      ["acc", "Worshippers of every faith shall have access to the holy places of Jerusalem.", "Does it say who holds it?", "n", "It gives entry. It names no holder."],
      ["anx", "Annex C. Arrangements concerning the holy esplanade: to be agreed.", "Does it name the place?", "y", "The esplanade: the Mount, by name."],
      ["anx", "Annex C. Arrangements concerning the holy esplanade: to be agreed.", "Does it say who holds it?", "n", "A title over an empty page says nothing at all."]];
    if (i >= Q.length) {
      set("d:c5"); set("book:c5"); set("book:t21"); K.buzz("success"); F.S("harp", null, 0.5);
      return K.card('<div class="kick">The fifth frame</div><h2>Both halves</h2>' + frames4() + '<p class="e2-jline">Upper: lit. Lower: dark.</p>' + said("Shira", "So it fails.") +
        '<div class="fsay"><button data-act="a">“Half of it fails.”</button><button data-act="b">“It fails.”</button></div>',
        (() => { const nx = () => K.card('<div class="kick">The Temple Institute</div>' + face("shiradesk") + said("Shira", "Grandfather would say half is a no that has not finished speaking.") + "<p>She taps Annex C.</p>" + said("Shira", "And here is the page that has not finished speaking.") +
          '<button class="cta" data-act="x">Go on</button>', { x: () => K.card('<div class="kick">The journal · a new page</div><h2>21 Av</h2><p>The last question. Peace or safety: lit. The place and who holds it: dark. The Framework gives access. It gives the Mount to no one. Annex C is blank.</p><p class="e2-jline">Four and a half.</p><button class="cta" data-act="x">Close</button>', { x: after }) });
          return { a: nx, b: nx }; })());
    }
    const q = Q[i], ans = (k) => () => { if (k !== q[3]) { K.snd("bad"); K.say(i === 0 ? "Yoel’s page: by the place I mean Jerusalem, or the Mount, by name." : "Read it again. " + q[4], "", 4600); return lowerTest(i); } K.sfx("click"); K.say(q[4], "", 3200); lowerTest(i + 1); };
    K.card('<div class="kick">The lower half · ' + (i + 1) + " of 4</div>" + '<div class="e2-paper"><b>' + esc(q[1]) + "</b></div>" + '<h2 class="e2-q">' + q[2] + '</h2><div class="fchoices two"><button data-act="y">Yes</button><button data-act="n">No</button></div>', { y: ans("y"), n: ans("n") });
  }
  function clauses() {
    const put = E().f["d:cl"] || {}, acts = { x: after };
    CLAUSES.forEach((c) => (acts["c" + c[0]] = () => { const a2 = { x: clauses };
      Object.keys(HALF).forEach((t) => (a2[t] = () => { put[c[0]] = t; set("d:cl", put); K.sfx("click"); clauses(); }));
      K.card('<div class="kick">The printed sheet</div><div class="e2-paper"><b>' + esc(c[1]) + '</b></div><h2 class="e2-q">Which half of the question does it answer?</h2><div class="fsay">' +
        Object.keys(HALF).map((t) => '<button data-act="' + t + '"' + (put[c[0]] === t ? ' class="asked"' : "") + ">" + HALF[t] + "</button>").join("") + "</div>", a2); }));
    acts.chk = () => {
      let msg = ""; const w = CLAUSES.find((c) => put[c[0]] !== c[2]);
      if (CLAUSES.some((c) => !put[c[0]])) msg = "Give every clause a place.";
      else if (w) msg = { war: "An end to war. Which half asks about peace?", sec: "A guarantee of borders. Which half asks about safety?", fly: "Flights and post. Yoel: “Good. Not my question.”", amb: "Ambassadors. Good, and not his question.",
        acc: "The holy places of Jerusalem. It is the only clause that touches the place.", anx: "The holy esplanade. A title, at least, about the place." }[w[0]];
      if (msg) { K.snd("bad"); K.say(msg, "", 4800); return clauses(); }
      set("d:sorted"); K.buzz("success");
      K.card('<div class="kick">Yoel’s rule for the lower half</div>' + F.wnote("By the place I mean Jerusalem, or the Mount, by name. And naming it is not enough: the page must say who holds it. This is my test, not the prophet’s own wording. I have written it down so that I can be shown wrong. A door left open is not a house given. Access is a visitor’s word. I am waiting for a holder’s word: custody, governance, sovereignty.") +
        "<p>Two clauses went to the lower half. Each must answer two things.</p>" + '<button class="cta" data-act="x">Test them</button>', { x: () => lowerTest(0) });
    };
    if (flag("d:sorted")) return lowerTest(0);
    K.card('<div class="kick">Shira’s desk · the printed sheet</div><div class="e2-paper"><b>Framework of Peace · Second Phase</b>' +
      CLAUSES.map((c) => '<button class="e2-look' + (put[c[0]] ? " seen" : "") + '" data-act="c' + c[0] + '"><span>' + esc(c[1]) + "</span>" + (put[c[0]] ? '<span class="q">→ ' + HALF[put[c[0]]] + "</span>" : '<span class="q">Tap to place it</span>') + "</button>").join("") + "</div>" +
      '<button class="cta" data-act="chk">Read them against the frame</button><button class="cta alt" data-act="x">Step back</button>', acts);
  }
  ACT.dshira = () => {
    if (flag("d:c5")) { K.say("“Half is a no that has not finished speaking. Go carefully.”", "Shira", 3600); return; }
    if (flag("d:low")) return clauses();
    K.card('<div class="kick">The Temple Institute</div>' + pic4("shirakey") + "<h2>Shira</h2><p>The printed sheet of the Framework is open on her desk. She wears a small brass key on a cord, and she does not hand it over at once.</p>" +
      said("Shira", "He gave me this when I was nineteen and told me not to use it until someone came who had lit four. I thought he was being dramatic. He was being careful.") +
      '<button class="cta" data-act="x">Go on</button>', { x: () => { give("lowkey"); set("d:low"); F.S("lock", "click", 0.5);
        K.card('<div class="kick">The Temple Institute</div>' + face("shirakey") + "<p>She lifts the cord over her head and puts the key in your hand.</p>" + said("Shira", "I know what is behind it. He made me learn it, in case the key was lost. The whole question reads: Peace, or safety? And the place: whose?") +
          said("Shira", "You have the sheet they handed out at Jaffa Gate. So have I. Six clauses. Let us see which half each one answers.") + '<button class="cta" data-act="x">Lay out the sheet</button>', { x: clauses }); } });
  };
  ACT.dcup4 = () => {
    if (flag("d:cup")) { K.say("FOUR. He is still counting.", "", 2600); return; }
    set("d:cup"); note("haller", "On 21 Av, a cup on the Institute steps, labelled FOUR. Inside the lid: “Tomorrow, ten. The terrace above the Cardo. I’ll buy.”");
    K.card('<div class="e2-cupph"><img src="img/fsy/pz/e2-cup3.jpg" alt="An iced coffee with a white label"><b>FOUR</b></div>' + "<p>A paper cup, standing on the step where you would see it. Under the lid, ice.</p><p>Inside the lid, in neat capitals:</p>" +
      F.wnote("TOMORROW, TEN. THE TERRACE ABOVE THE CARDO. I’LL BUY.") + '<p class="e2-jline">He is still counting. He is half a frame behind you, or half a frame ahead.</p><button class="cta" data-act="x">Go on</button>', { x: after });
  };

  /* ---- Scene 3: Haller's coffee ---- */
  ACT.dhaller = () => {
    if (flag("d:coffee")) { K.say("He has gone. The money is under his saucer.", "", 3000); return; }
    const asked = E().f["d:hq"] || {}, mark = (k) => { asked[k] = 1; set("d:hq", asked); };
    const T = '<div class="kick">The terrace above the Cardo</div>';
    if (!flag("d:hmet")) { set("d:hmet"); return K.card(T + stamp("Wednesday 25 August · 10:00 a.m. · 22 Av") + pic4("hallercoin") + "<h2>Haller</h2><p>Already seated, jacket over the chair, two coffees on the table. One is iced.</p>" + said("Haller", "Iced. I no longer guess.") +
      said("Haller", "Four and a half. Don’t look surprised, I can count shutters through a window as well as anyone. The upper half lit, the lower half dark. The old man built a test that the best agreement in fifty years fails by half a frame.") +
      "<p>While he talks he turns a coin over and over on the table with one thumb.</p>" + '<button class="cta" data-act="x">Go on</button>', { x: ACT.dhaller }); }
    const coin = () => { mark("coin"); K.card(T + face("hallercoin") + said("Haller", "A Temple coin. They struck them a few years ago.") + "<p>He slides it across.</p>" + said("Haller", "Go on.") + '<button class="cta" data-act="f">Look at the front</button>',
      { f: () => K.card(T + "<h2>The front</h2>" + OBJ("e2-coin-front") + "<p>A temple with tall pillars, and a dove carrying an olive sprig. No face on this side.</p>" + '<button class="cta" data-act="b">Turn it over</button>',
        { b: () => { set("book:coin"); K.card(T + "<h2>The back</h2>" + OBJ("e2-coin-back") + "<p>A seven-branched lamp, and under it two faces in profile, one behind the other. The nearer is a bearded king in an ancient crown, with his name beneath: CYRUS.</p><p>The one behind him has been rubbed almost flat. A jaw. The line of a collar.</p>" +
          '<p class="fsmall">Round the rim the lettering is worn almost to nothing. Haller says it without looking: “He hath charged me to build him an house at Jerusalem.” Ezra 1:2.</p>' +
          '<div class="fsay"><button data-act="w">“Who is the one behind him?”</button></div><button class="cta alt" data-act="x">Slide it back</button>',
          { x: ACT.dhaller, w: () => { mark("who"); K.card(T + face("hallercoin") + said("Haller", "The one who finishes what the first began.") + "<p>He takes the coin back and closes his hand on it.</p>" + '<button class="cta" data-act="x">Go on</button>', { x: ACT.dhaller }); } }); } }) }); };
    const cyrus = () => { mark("cyrus"); K.card(T + face("hallercoin") + said("Haller", "You know your Isaiah. “That saith of Cyrus, He is my shepherd, and shall perform all my pleasure: even saying to Jerusalem, Thou shalt be built; and to the temple, Thy foundation shall be laid.” A pagan king. Not one of the faithful, and God called him my shepherd all the same, because He needed a house built and Cyrus could build it.") +
      '<button class="cta" data-act="x">Go on</button>', { x: () => K.card(T + face("hallercoin") + said("Haller", "I have waited my whole life for a man strong enough to do it again. So have a great many people who pray harder than I do. And now there is a page on a table with her seal on it and his word behind it. Peace. Safety. A house, if the last half-frame lights. Tell me what part of that I am supposed to fear.") +
        '<button class="cta" data-act="x">Go on</button>', { x: ACT.dhaller }) }); };
    const pres = () => { mark("pres"); note("haller", "On 22 Av I asked him whether the President is the one the clock is waiting for. He laughed. “The one you are afraid of comes to destroy. This one builds.”");
      K.card(T + pic4("hallerlaugh") + "<p>Haller laughs. It is not unkind, and it is not acted.</p>" + said("Haller", "The son of perdition? The man who gives Israel peace and her Temple? You have been alone with those pages too long. The one you are afraid of comes to destroy. This one builds.") +
        said("Haller", "It looks like salvation because it is.") + '<button class="cta" data-act="x">Go on</button>', { x: ACT.dhaller }); };
    const leave = () => K.card(T + face("hallercoin") + (asked.pres ? "" : said("Haller", "You have read the Framework. It looks like salvation because it is.")) +
      said("Haller", "My employer says Annex C will be filled by Friday. He is not often wrong. You should hear him speak. People come out saying he could call fire down from the sky.") + "<p>He stands and leaves money under his saucer.</p>" +
      said("Haller", "Half a frame. Think about how small that is. Think about what is on the other side of it.") + '<button class="cta" data-act="x">Go on</button>',
      { x: () => { set("d:coffee"); note("haller", "On 22 Av, on the terrace. He carries a Temple coin: Cyrus, and behind him a second face worn smooth. He quoted Isaiah 44:28 and meant every word.");
        K.card('<div class="kick">The journal</div><h2>22 Av</h2><p>Haller. He carries a Temple coin: Cyrus, and behind him a second face worn smooth. He quoted Isaiah 44:28 and meant every word.' + (asked.pres ? " I asked him about the President." : "") + '</p><p class="e2-jline">He laughed. Then he looked at the coin again.</p><button class="cta" data-act="x">Close</button>', { x: after }); } });
    K.card(T + face("hallercoin") + '<h2>What do you say?</h2><div class="fsay">' +
      '<button data-act="coin"' + (asked.coin ? ' class="asked"' : "") + ">Ask about the coin he keeps turning</button>" +
      (asked.coin ? '<button data-act="cyrus"' + (asked.cyrus ? ' class="asked"' : "") + ">“Why Cyrus?”</button>" : "") +
      (asked.cyrus ? '<button data-act="pres"' + (asked.pres ? ' class="asked"' : "") + ">“What if the President is the one the clock is waiting for?”</button>" : "") + "</div>" +
      (asked.cyrus ? '<button class="cta" data-act="go">Let him finish his coffee</button>' : ""), { coin, cyrus, pres, go: leave });
  };

  /* ---- Scene 4: give us a king ---- */
  const VERSES = [["1 Samuel 8:7", "…they have not rejected thee, but they have rejected ", ", that I should not reign over them.", "me"],
    ["John 5:43", "I am come in my Father’s name, and ye receive me not: if another shall come in ", ", him ye will receive.", "his own name"],
    ["2 Thessalonians 2:10–11", "…because they received not the love of the ", ", that they might be saved. And for this cause God shall send them strong delusion, that they should believe a lie.", "truth"]];
  const SLIPS = ["peace", "his own name", "Samuel", "truth", "the king’s name", "me", "the law", "my name", "the LORD"];
  const BACKS = ["THE SERGEANT", "AT THE SHUT GATE", "ON THE TWENTY-FOURTH"];
  ACT.dslips = () => {
    if (flag("d:slips")) return K.card('<div class="kick">The second book</div><h2>Give us a king</h2>' + VERSES.map((v) => '<p class="e2-jline">“' + v[1] + "<b>" + v[3] + "</b>" + v[2] + "”<br><small>" + v[0] + "</small></p>").join("") +
      F.wnote(BACKS.join(" · ")) + '<button class="cta" data-act="x">Back</button>', { x: after });
    const put = E().f["d:sl"] || {}, acts = { x: after };
    const done4 = () => yoelCard("e2-4-king", () => { set("book:king");
      K.card('<div class="kick">Lower on the page</div><h2>A second note</h2>' + F.wnote("Do not ask me who he is. I will not write a name, and you must not. A man is not revealed by what we suspect of him. He is revealed by what he does, by his own act, in the sight of all. That is why I taught you to ask whether the hand was his own. Until the hand moves, you hold a question. Keep it a question.") +
        '<p class="fsmall">In the margin, in pencil: 2 Thess. 2:3. First the falling away. Then the revealing. Then That Day. In that order.</p><button class="cta" data-act="x">Go on</button>',
        { x: () => { set("book:own"); K.card('<div class="kick">The three slips</div><h2>Faint pencil on the backs</h2><p>Each slip has something on its back. The six that would not stay are blank. The three that stayed, turned over in order:</p>' +
          BACKS.map((b) => F.wnote(b)).join("") + '<button class="cta" data-act="x">Write it in the journal</button>', { x: () => { set("d:slips"); set("book:backs"); F.S("parchment", "click", 0.5); after(); } }); } }); }, "Go on");
    VERSES.forEach((v, i) => (acts["v" + i] = () => { const a2 = { x: ACT.dslips }, used = Object.keys(put).filter((k) => +k !== i).map((k) => put[k]);
      SLIPS.forEach((s, j) => (a2["s" + j] = () => { put[i] = s; set("d:sl", put); F.S("parchment", "click", 0.3); ACT.dslips(); }));
      K.card('<div class="kick">' + v[0] + '</div><p class="e2-jline">“' + v[1] + "<b>______</b>" + v[2] + '”</p><h2 class="e2-q">Which slip belongs in the gap?</h2><div class="fchoices">' +
        SLIPS.map((s, j) => (used.includes(s) ? "" : '<button data-act="s' + j + '">' + s + "</button>")).join("") + '</div><button class="cta alt" data-act="x">Back to the page</button>', a2); }));
    acts.chk = () => {
      if (VERSES.some((v, i) => !put[i])) { K.say("Three gaps. Set a slip in each.", "", 3000); return ACT.dslips(); }
      const bad = VERSES.map((v, i) => i).filter((i) => put[i] !== VERSES[i][3]);
      if (bad.length) { bad.forEach((i) => delete put[i]); set("d:sl", put); K.snd("bad"); K.say((bad.length === 1 ? "One slip slides" : bad.length === 2 ? "Two slips slide" : "All three slide") + " out again. He wrote the verses as they stand in the book.", "", 4800); return ACT.dslips(); }
      set("d:set"); K.buzz("success"); F.S("harp", null, 0.4); done4();
    };
    if (flag("d:set")) return done4();
    K.card('<div class="kick">The second book</div>' + stamp("Wednesday 25 August · 6:30 p.m.") + "<h2>A page with a coin at its head</h2>" + '<div style="max-width:120px;margin:0 auto">' + coinSVG(1) + "</div>" +
      '<p class="e2-jline">He drew the coin. He knew what Haller carried. He knew what Haller would say.</p><div class="e2-paper"><b>Three verses, each with a gap</b>' +
      VERSES.map((v, i) => '<button class="e2-look' + (put[i] ? " seen" : "") + '" data-act="v' + i + '"><em>' + v[0] + "</em><span>" + v[1] + "<b>" + (put[i] ? put[i] : "______") + "</b>" + v[2] + "</span></button>").join("") + "</div>" +
      '<p class="fsmall">Nine loose slips lie in the fold of the book.</p><button class="cta" data-act="chk">Read the page</button><button class="cta alt" data-act="x">Close the book</button>', acts);
  };
  ACT.dwindow = () => {
    if (!flag("d:slips")) return K.card('<div class="kick">The window</div><h2>The Street of the Chain</h2><p>The shops are closing. The light is going out of the stone.</p><button class="cta" data-act="x">Back</button>', { x: after });
    if (flag("d:ezek")) { K.say("The street is empty. The twenty-third has begun.", "", 3000); return; }
    K.card('<div class="kick">The window</div>' + face("preacher") + "<h2>Below in the street</h2><p>The preacher from Jaffa Gate is walking home with his folded sign. He calls it up to nobody.</p>" + said("The street preacher", "Are you watching, or marching?") +
      '<button class="cta" data-act="x">Back to the page</button>', { x: () => K.card('<div class="kick">The second book</div><h2>The last line</h2><p>Turned sideways, as if added later.</p>' +
        F.wnote("And if you meet the one who carries the coin, remember he is not your enemy. Ezekiel 33:6. If the watchman sees the sword come and blows not the trumpet, the blood is on the watchman. You have seen. So blow it, even for him. Most of all for him.") +
        '<button class="cta" data-act="x">Go on</button>', { x: () => { set("d:ezek"); set("book:watch");
          K.card('<div class="kick">The journal</div><h2>22 Av</h2><p>Give us a king. Another, in his own name. The lie believed because the truth was not loved. Yoel will not write a name. Revealed by his own act.</p><p class="e2-jline">And a duty I did not want: warn Haller.</p><button class="cta" data-act="x">Close</button>', { x: after }); } }) });
  };

  /* ---- Scene 5: the annex, and the seal ---- */
  const annexHTML = () => '<div class="e2-paper"><b>Annex C. Arrangements concerning the holy esplanade</b><p>1. The esplanade shall be held by a Council of the Parties.</p><p>2. A house of prayer for Israel shall stand upon the esplanade, on the place measured in the Schedule.</p>' +
    '<p class="fsmall"><i>Schedule: a line of cubits and bearings.</i></p></div>';
  ACT.dannex = () => {
    if (flag("d:seal")) { K.say("He is watching you over the rim of his cup.", "", 2800); return; }
    if (has("annex")) { K.say("“Take your time. I have coffee.”", "Haller", 3000); return; }
    const T = '<div class="kick">The Street of the Chain</div>';
    K.card(T + stamp("Thursday 26 August · 4:15 p.m. · 23 Av") + pic4("hallerbench") + "<h2>The bench under the clock</h2><p>Two paper cups beside him, and a stiff envelope on his knee.</p>" +
      said("Haller", "Sit. Last week I gave you a page an hour before the newspapers, and it matched. I would like you to remember that.") + '<button class="cta" data-act="x">Take the envelope</button>',
      { x: () => { F.S("parchment", "click", 0.5); K.card(T + "<h2>One sheet of heavy paper</h2>" + OBJ("e2-annex") + annexHTML() + "<p>At the foot, the Republic’s seal, pressed into the paper.</p>" + '<button class="cta" data-act="x">Read the Schedule</button>',
        { x: () => K.card(T + "<h2>The Schedule</h2><p>Cubits and bearings from a corner of the platform. You know the line before you reach the end of it. It is the measure from Yoel’s first book: the one you found in the winter.</p>" +
          '<p class="e2-jline">Those are Yoel’s numbers. On a government page. You never gave them to anyone.</p>' + said("Haller", "Sealed in the capital on Tuesday. Announced tomorrow. It names the place. It says who holds it. Take it up the stairs and your half-frame lights tonight.") +
          '<button class="cta" data-act="x">Go on</button>', { x: () => { give("annex"); set("book:annex");
            K.card(T + "<p>You have the Framework’s last page in your satchel: the one that matched the newspaper, with the Republic’s true seal on it. And Yoel’s loupe, and a sheet of his tracing paper.</p>" + '<button class="cta" data-act="x">Open the satchel</button>', { x: ACT.dseal }); } }) }); } });
  };
  ACT.dseal = () => {
    if (!has("annex")) { K.say("The loupe, the tracing paper, the Framework’s last page, the newspaper, the printed sheet.", "", 3600); return; }
    if (flag("d:seal")) return K.card('<div class="kick">The journal</div><h2>The seal on the annex</h2>' + sealSVG(1, 2, "the tracing fits only when it is turned over") + "<p>Raised, hollow behind, and backwards. Not the Framework’s press.</p>" + '<button class="cta" data-act="x">Back</button>', { x: after });
    const st = E().f["d:st"] || {}, mark = (k) => { st[k] = 1; set("d:st", st); }, T = '<div class="kick">The seal test</div>', back = { x: ACT.dseal };
    const L = [["f", "The front", "Tilt both pages to the light", "Both raised. A shadow falls beside each."], ["b", "The back", "Turn both pages over", "Both hollow, where a press pushed through."], ["c", "The crown", "Trace the true seal and lay the tracing on the annex", "Mirrored. The tracing fits only when it is turned over."],
      ["n", "The newspaper of 15 Av", "Lay the tracing on the printed seal", "The tracing fits, the right way up."], ["s", "The sheet from Jaffa Gate", "Lay the tracing on the printed seal", "The tracing fits, the right way up."], ["l", "The Framework’s last page, to the bottom", "Read the line under the seals", "“Each Annex shall bear the same seals as this page.”"]];
    const acts = { x: after,
      f: () => { mark("f"); K.card(T + "<h2>The front</h2>" + sealSVG(0, 0, "the Framework’s last page") + sealSVG(1, 0, "Haller’s annex") + "<p>You tilt each page to the light. Each seal stands up from the paper, and a shadow falls beside it. The same.</p>" + '<button class="cta" data-act="x">Back</button>', back); },
      b: () => { mark("b"); K.card(T + "<h2>The back</h2><p>You turn each page over. Behind each seal the paper is hollow, where a press pushed through. The same.</p>" + '<button class="cta" data-act="x">Back</button>', back); },
      c: () => K.card(T + "<h2>The crown</h2>" + sealSVG(0, 1, "the true seal, and your tracing of its crown") + "<p>You lay Yoel’s tracing paper over the true seal and draw round the crown. It leans toward the text.</p>" + '<button class="cta" data-act="x">Slide the tracing onto the annex</button>',
        { x: () => K.card(T + "<h2>It does not fit</h2>" + sealSVG(1, 1, "Haller’s annex, under the tracing") + "<p>On the annex the crown leans away from the text.</p>" + '<button class="cta" data-act="x">Turn the tracing over</button>',
          { x: () => { mark("c"); K.card(T + "<h2>Now it fits</h2>" + sealSVG(1, 2, "the tracing, turned over") + '<p class="e2-jline">Mirrored. As if someone had copied a seal from the back of a page, where everything runs the other way. You cannot prove how it was made.</p>' +
            '<p class="fsmall">A different crown shows only that the two seals differ. Which one is right?</p><button class="cta" data-act="x">Back</button>', back); } }) }),
      n: () => { if (!st.c) { K.say("You have nothing to lay on it yet. Trace the crown first.", "", 3200); return ACT.dseal(); } mark("n"); K.card(T + "<h2>The newspaper of 15 Av</h2>" + sealSVG(0, 1, "the Republic’s seal, as printed") + "<p>The one o’clock edition printed the page of seals. Your tracing fits the Republic’s crown, the right way up.</p>" + '<button class="cta" data-act="x">Back</button>', back); },
      s: () => { if (!st.c) { K.say("You have nothing to lay on it yet. Trace the crown first.", "", 3200); return ACT.dseal(); } mark("s"); K.card(T + "<h2>The sheet from Jaffa Gate</h2>" + sealSVG(0, 1, "the seal at the foot of the printed sheet") + "<p>The sheet they handed out on the thirteenth. The tracing fits again. Three impressions, one press.</p>" + '<button class="cta" data-act="x">Back</button>', back); },
      l: () => { mark("l"); K.card(T + "<h2>The last line</h2><p>Under the seals, in small type, a line you have read past before:</p>" + F.wnote("Each Annex shall bear the same seals as this page.") + '<button class="cta" data-act="x">Back</button>', back); },
      j: () => { let msg = "";
        if (!st.c) msg = st.f && st.b ? "The seal looks right. A seal has more than a front and a back." : "Test the seal first.";
        else if (!(st.n && st.s)) msg = "The two seals differ. Which one is right? You carry two more impressions of the Republic’s seal.";
        else if (!st.l) msg = "Three agree and one does not. But what says an annex must match? Read the Framework’s last page to the bottom.";
        if (msg) { K.snd("bad"); K.say(msg, "", 5200); return ACT.dseal(); }
        set("d:seal"); set("book:seal"); K.buzz("success");
        K.card('<div class="kick">The journal · a new page</div><h2>23 Av</h2><p>Annex C from Haller. It names the place by Yoel’s own measure and gives custody to a Council of the Parties.</p><p>The seal is raised, hollow behind, and backwards. The Framework says every annex bears the same seals as its last page. This one does not.</p>' +
          '<p class="e2-jline">The seal is counterfeit. Who made the page, and whether its words are true, I cannot yet say.</p><button class="cta" data-act="x">Close</button>', { x: after }); } };
    K.card(T + '<div class="e2-paper"><b>Haller’s annex, beside what you trust</b>' + L.map((l) => '<button class="e2-look' + (st[l[0]] ? " seen" : "") + '" data-act="' + l[0] + '"><em>' + l[1] + "</em>" + (st[l[0]] ? "<span>" + l[3] + "</span>" : '<span class="q">' + l[2] + "</span>") + "</button>").join("") + "</div>" +
      '<button class="cta" data-act="j">Write the conclusion in the journal</button><button class="cta alt" data-act="x">Close the satchel</button>', acts);
  };
  FINISH.d5 = () => go("d6");

  /* ---- Scene 6: the choice ---- */
  ACT.dchoice = () => {
    const T = '<div class="kick">The bench</div>', c = choice4();
    if (flag("d:after")) { K.say(c === "a" ? "“Tomorrow, then.” He lifts his cup to you." : "The bench is empty. He took your coffee with him.", c === "a" ? "Haller" : "", 3600); return; }
    const end = () => K.card('<div class="kick">&nbsp;</div><h2 class="e2-later">Those were Yoel’s numbers</h2><p style="text-align:center"><i>Somebody gave them the measure. It was not you. It was not Yoel.</i></p><button class="cta" data-act="x">Go on</button>', { x: () => { set("d:after"); after(); } });
    if (c) return end();
    const menu = () => K.card(T + face("hallerbench") + '<h2>Wait for proof, or use a page that might be right because you want it to be?</h2><p class="fsmall">You cannot check his story about a second die. It may be true. This cannot be undone.</p><div class="fsay">' +
      (flag("d:warned") ? "" : '<button data-act="w">Warn him</button>') + '<button data-act="a">Take the annex up to the fifth frame</button><button data-act="r">Hand it back</button></div>',
      { w: warn, a: () => sure("a"), r: () => sure("r") });
    const sure = (k) => K.card(T + "<h2>" + (k === "a" ? "Carry Haller’s annex up to the frame?" : "Hand the annex back?") + '</h2><p>This cannot be undone.</p><div class="fchoices two"><button data-act="y">Yes</button><button data-act="n">Not yet</button></div>', { n: menu, y: () => decide(k) });
    const warn = () => { set("d:warned"); set("book:warned"); K.card(T + '<p class="e2-said"><b>You</b> “You quote Isaiah. Read the verse the test is built on. The one who makes it strong does one more thing. ‘In the midst of the week he shall cause the sacrifice and the oblation to cease.’”</p>' +
      said("Haller", "Cyrus did not stop the sacrifice. Cyrus began it.") + '<p class="e2-said"><b>You</b> “Cyrus is not in Daniel nine.”</p>' + "<p>A moment. He turns the coin once in his fingers, worn side up.</p>" + said("Haller", "You sound exactly like him.") +
      "<p>It is not an answer, and he knows it. He puts the coin away.</p>" + '<p class="e2-jline">I told him. Ezekiel 33:6. He did not hear it. It was still mine to say.</p><button class="cta" data-act="x">Go on</button>', { x: menu }); };
    const GO = '<button class="cta" data-act="x">Go on</button>';
    const decide = (k) => { set("d:choice", k); set(k === "a" ? "book:t23a" : "book:t23r"); F.S(k === "a" ? "parchment" : "step", "click", 0.5);
      note("haller", k === "a" ? "On 23 Av I took his annex, knowing its seal was not the Framework’s. He stayed and finished his coffee beside me." : "On 23 Av I handed his annex back. He carried my coffee away with him.");
      note("yoel", k === "a" ? "On 23 Av I carried up a page I did not know. The lower half went grey." : "On 23 Av I refused a page with a false seal. The lower half stayed dark.");
      K.card(k === "a" ? '<div class="kick">Yoel’s table</div><h2>The lower half</h2>' + frames4() + "<p>You slide the annex under the lower half of the fifth frame. It does not light. It does not stay dark. It goes grey.</p>" + F.wnote("Grey is not dark. Grey means we do not know. Ask yourself why you carried up a page you did not know.") + GO :
        T + "<h2>You hand it back</h2>" + frames4() + "<p>The lower half stays dark. Tucked in the second book, where the next strip begins:</p>" + F.wnote("A no that is true is worth more than a yes that is early.") + GO,
        { x: () => K.card(T + face("hallerbench") + (k === "a" ? "<p>Haller stays. He finishes his coffee beside you, in no hurry.</p>" + said("Haller", "Tomorrow, then, it becomes true, and no one will ever know which day you lit it.") :
          "<p>Haller stands. He picks up the second cup, the one he brought for you, and carries it away.</p>" + said("Haller", "Tomorrow you will light it anyway. You have only made yourself wait.")) + '<button class="cta" data-act="x">Go on</button>', { x: end }) }); };
    K.card(T + stamp("4:40 p.m.") + face("hallerbench") + "<p>You lay the tracing on the annex in front of him.</p>" + said("Haller", "A different die. Of course it is.") + "<p>He does not look caught.</p>" +
      said("Haller", "The office seals its advance drafts with a second die, so that no one can pass a draft off as the page. The words are final. The official page follows tomorrow, under the real press. I have only brought tomorrow to you one day early.") +
      '<button class="cta" data-act="x">Go on</button>', { x: () => K.card(T + face("hallerbench") + said("Haller", "Do you know how many people will not believe a president, and will believe an old man who was right about where? If his five frames are lit before the announcement, they will say God told the watchers first. And they will be glad, and they will come. Who is harmed by one day?") +
        said("Haller", "And if I am wrong by a word, it is a small untruth for a house of prayer on that hill. You want that half-frame lit as much as I do. I have watched you want it.") + '<button class="cta" data-act="x">Go on</button>', { x: menu }) });
  };

  /* ---- Scene 7: the pointer ---- */
  ACT.dbenami = () => {
    if (has("pointer")) { K.say("“Go. It is nearly Shabbat, and you have a sun to watch.”", "Sergeant Ben-Ami", 3600); return; }
    const T = '<div class="kick">The Eastern Gate</div>', a = choice4() === "a";
    const ask = () => K.card(T + face("benami") + said("Ben-Ami", "He also said to ask one question first. How many are lit?") + '<div class="fsay"><button data-act="five">“Five.”</button><button data-act="true">' + (a ? "“Four and a half, and a grey half I put there myself.”" : "“Four and a half. The last half is dark.”") + "</button></div>",
      { five: () => { K.snd("bad"); K.card(T + face("benami") + "<p>He does not move the parcel.</p>" + said("Ben-Ami", "He said someone would say five.") + '<button class="cta" data-act="x">Answer again</button>', { x: ask }); },
        true: () => K.card(T + pic4("benamiparcel") + (a ? "<p>He looks at you a moment longer.</p>" + said("Ben-Ami", "He said someone might say that too. He said give it to them anyway.") : "<p>He nods once.</p>") + "<p>He puts the parcel in your hands. Oilcloth, tied with Yoel’s thread.</p>" + '<button class="cta" data-act="x">Unwrap it</button>',
          { x: () => { give("pointer"); set("book:pointer"); F.S("parchment", "click", 0.5); K.card(T + "<h2>The pointer</h2>" + pointerSVG() + "<p>A slim brass hand as long as your forearm, with a tiny toothed counter at its hub. A row of fine marks along the blade, and at the tip a number: 1,260.</p>" + '<button class="cta" data-act="x">Go on</button>',
            { x: () => yoelCard("e2-4-pointer", () => K.card(T + face("benami") + said("Ben-Ami", "I have stood at this gate eleven years. They say it opens for one man only. I am in no hurry to see the wrong one try it.") + '<button class="cta" data-act="x">Back to the Street of the Chain</button>', { x: after }), "Go on") }); } }) });
    K.card(T + stamp("Friday 27 August · 4:30 p.m. · 24 Av") + face("benami") + "<h2>Sergeant Ben-Ami</h2><p>Where you first met him, in the shade of the sealed gate. He is off duty, and he holds a long narrow parcel wrapped in oilcloth.</p>" +
      said("Ben-Ami", "The old man left this with me in the winter. He said, not before the twenty-fourth, and not to anyone who arrives with a gentleman in a good jacket. You are alone. Good.") + '<button class="cta" data-act="x">Go on</button>', { x: ask });
  };
  const seats4 = () => '<div class="e2-seats"><span class="in"><b>☀</b><em>where the day turns</em></span><span class="in"><b>⚙</b><em>the days, as men count them</em></span><span class="' + (flag("d:seated") ? "in" : "") + '"><b>' + (flag("d:seated") ? "➤" : "") + "</b><em>the long count</em></span></div>";
  ACT.dpoint = () => {
    const radio = () => K.card('<div class="kick">From the stair below</div><h2>Avi’s radio, turned up</h2>' + said("The radio", "…the capital confirms that the President will speak at midday, his time. That is a little after seven this evening in Jerusalem. Officials say the Emirate of Kedar has now signed, and that the last annex of the Framework is complete.") +
      '<button class="cta" data-act="x">Go on</button>', { x: () => { set("d:radio"); after(); } });
    if (flag("d:seated")) return flag("d:radio") ? K.card('<div class="kick">Yoel’s instrument</div><h2>Whole</h2>' + ringSVG(24, [11, 27]) + seats4() + '<p class="e2-sunline">Sunset that begins 25 Av: <b>Fri 27 August, 7:10 p.m.</b></p><p class="fsmall">The pointer is seated. It will not turn.</p><button class="cta" data-act="x">Back</button>', { x: after }) : radio();
    K.card('<div class="kick">Yoel’s instrument · the third seat</div>' + stamp("6:40 p.m.") + "<h2>The pointer</h2>" + pointerSVG() + seats4() + "<p>The centre pin stands up through the sunset plate and the wheel of days.</p>" + '<button class="cta" data-act="s">Set the pointer on the pin</button><button class="cta alt" data-act="x">Not yet</button>',
      { x: after, s: () => { set("d:seated"); F.S("lock", "click", 0.8); K.buzz("success"); K.card('<div class="kick">Yoel’s instrument</div><h2>It seats with a click</h2>' + seats4() + "<p>You try it with one finger. It will not turn.</p>" +
        '<p class="e2-jline">The sunset plate. The wheel of days. The pointer. Nothing is missing now except a day to count from.</p><button class="cta" data-act="x">Go on</button>', { x: radio }); } });
  };
  ACT.dwin = () => {
    if (flag("d:end")) return endAct4();
    if (!flag("d:radio")) return K.card('<div class="kick">The window</div><h2>Friday afternoon</h2><p>The street is emptying for Shabbat. The sun is still well above the roofs.</p><button class="cta" data-act="x">Back</button>', { x: after });
    set("book:t24");
    K.card('<div class="kick">The window</div>' + stamp("6:55 p.m.") + "<h2>A hand’s width above the roofs</h2><p>The sun is going down toward the roofs. On the instrument, the sunset plate reads 7:10.</p>" +
      '<p class="e2-jline">Midday there. After seven here. If he speaks before the sun goes, it is still the twenty-fourth. If he speaks after, it is the twenty-fifth. Fifteen minutes.</p><button class="cta" data-act="x">Go on</button>',
      { x: () => K.card('<div class="kick">The journal</div><h2>24 Av</h2>' + frames4() + "<p>The pointer, from Sergeant Ben-Ami. The instrument is whole. The President speaks tonight. " + count4() + '</p><p class="e2-jline">I am watching the sun.</p><button class="cta" data-act="x">Go on</button>',
        { x: () => K.card('<div class="kick">&nbsp;</div><h2 class="e2-later">Four frames lit, and half of the fifth.</h2><p style="text-align:center"><i>He is counting too. Tonight you both find out what he has been counting toward.</i></p><button class="cta" data-act="x">Go on</button>', { x: () => { set("d:end"); E().done.d7 = 1; save(); endAct4(); } }) }) });
  };
  FINISH.d7 = () => endAct4();
  function endAct4() {
    K.card('<div class="kick">The Final Seven Years · Episode 2</div><div class="e2-acttitle"><small>Act 4 · The Blank Annex</small><b>Complete</b></div>' +
      "<p>The instrument is whole. The sun is a hand’s width above the roofs, and the twenty-fifth of Av begins at 7:10.</p>" +
      '<p class="fsmall">Prototype: Act 5, The Twenty-Fifth of Av, is not written yet.</p><button class="cta" data-act="x">Back to the episodes</button><button class="cta alt" data-act="again">Play Act 4 again</button>',
      { x: () => K.shut(), again: () => { const e = E(); A4.forEach((id) => { delete e.done[id]; });
        Object.keys(e.f).forEach((k) => { if (/^(d:|book:(c4|t20|c5|t21|coin|king|own|backs|watch|annex|seal|t23a|t23r|warned|pointer|t24)|heard:e2-4|seenAct:d|hint:d)/.test(k)) delete e.f[k]; });
        ["upkey", "lowkey", "annex", "pointer"].forEach((k) => delete e.items[k]); save(); go("d1"); } });
  }
  function hint4(id) {
    const f = flag, n = (k) => { const c = (E().f[k] || 0); set(k, c + 1); return c; }, st = E().f["d:st"] || {};
    if (id === "d1") return !f("d:thread") ? "Tap the frames and pull the thread on the fourth shutter." : ["Tap the folder. Read each page with the loupe, then stamp it.", "A party or the named subject lights the frame. A name in a list does not.", "The Resolution is about her borders, by name: she is its subject, though she did not sign."][Math.min(2, n("hint:d1"))];
    if (id === "d2") return !has("upkey") ? "The photograph on the sill. Take the back off." : !f("d:up") ? "Tap the fifth shutter and turn the key." : !f("d:low") ? "Walk forward to the Temple Institute and speak to Shira." :
      !f("d:c5") ? ["Speak to Shira and place all six clauses.", "Peace and safety go above. The two clauses about Jerusalem and the esplanade go below. The rest are not Yoel’s question.", "Both lower clauses name the place. Neither says who holds it."][Math.min(2, n("hint:d2"))] : "Walk forward to the steps. Something has been left for you.";
    if (id === "d3") return "Walk up to the terrace and speak to Haller. Ask about the coin, then why Cyrus.";
    if (id === "d4") return !f("d:slips") ? ["Tap the second book. Tap each verse and choose a slip for its gap.", "Whom did they reject? In whose name does the other come? What did they not love?", "me · his own name · truth."][Math.min(2, n("hint:d4"))] : "Look out of the window.";
    if (id === "d5") return !has("annex") ? "Speak to Haller on the bench." : !st.c ? ["Tap your satchel. Test the front, the back and the crown.", "A seal has more than a front and a back."][Math.min(1, n("hint:d5a"))] : !(st.n && st.s) ? "Lay your tracing on the newspaper’s seal and on the printed sheet’s." : !st.l ? "Read the Framework’s last page to the bottom." : "Write the conclusion in the journal.";
    if (id === "d6") return "Speak to Haller. The choice is yours; the game will not make it for you.";
    return !has("pointer") ? "Speak to Sergeant Ben-Ami. Tell him the true count." : !f("d:seated") ? "Walk forward to Yoel’s room and tap the instrument." : "Look out of the window.";
  }

  /* ------------------------------------------------------------ hints ------------------------------------------------------------ */
  function hint() {
    if (!scene) return;
    const f = flag, id = scene.id, rm = E().f.rodMiss || 0;
    let t = "Look at everything here.";
    if (actOf(id) === 2) t = hint2(id);
    else if (actOf(id) === 3) t = hint3(id);
    else if (actOf(id) === 4) t = hint4(id);
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
      (Lamp.tester ? '<p class="fsmall">Tester build: Acts 1 to 3 are finished. Act 4 is a prototype: one temporary picture, no clips, and no voice yet. Your Episode 1 progress is not touched.</p>' : "") + '<button class="cta" data-act="x">Begin</button>', { x: () => go("pro") }); return; }
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
      b5: () => { give("sheet"); set("t13", { 1: 1, 2: 1 }); set("b:t13"); set("book:t13"); set("book:phase"); set("book:strong"); }, b6: () => { set("b:end"); set("book:table"); },
      c1: () => ["c:sun", "c:asked", "c:strip", "c:photo", "book:title", "book:hut", "book:roof"].forEach((k) => set(k)), c2: () => { set("c:met"); set("c:shira"); },
      c3: () => ["c:vd", "c:hut", "book:isa5", "book:vplan"].forEach((k) => set(k)), c4: () => { set("c:lines", ["eve"]); set("c:press"); set("c:atwall"); give("wheel"); set("c:jar"); set("book:c3"); set("book:vplan"); },
      c5: () => { give("lastpage"); set("c:put", { isr: "b", ded: "b", she: "b", ked: "o", host: "o", rep: "g", tar: "w", row: "w" }); set("c:sorted"); set("book:foxes"); set("book:ten"); },
      c6: () => { set("c:paper"); set("c:wp", 0); set("c:wheel"); set("book:wheel"); set("c:c3"); set("book:t15"); }, c7: () => { set("c:believe", "p"); set("c:sun2"); set("c:end"); set("book:dance"); set("book:three"); },
      d1: () => ["d:thread", "d:c4", "book:c4", "book:t20"].forEach((k) => set(k)), d2: () => { give("upkey"); give("lowkey"); ["d:up", "d:low", "d:sorted", "d:c5", "d:cup", "book:c5", "book:t21"].forEach((k) => set(k)); },
      d3: () => { set("d:hmet"); set("d:coffee"); set("book:coin"); }, d4: () => ["d:set", "d:slips", "d:ezek", "book:king", "book:own", "book:backs", "book:watch"].forEach((k) => set(k)),
      d5: () => { give("annex"); set("d:st", { f: 1, b: 1, c: 1, n: 1, s: 1, l: 1 }); set("d:seal"); set("book:annex"); set("book:seal"); }, d6: () => { if (!E().f["d:choice"]) { set("d:choice", "r"); set("book:t23r"); } set("d:after"); },
      d7: () => { give("pointer"); ["d:seated", "d:radio", "d:end", "book:pointer", "book:t24"].forEach((k) => set(k)); } };
    fill[id](); e.done[id] = 1; save();
    const nx = SC[idx(id) + 1]; if (nx) go(nx.id); else endAct4();
  }
  Lamp.ep2 = { play: start, devSkip, state: E, scenes: SC };
})();
