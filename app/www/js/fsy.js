/* Lamp — "The Final Seven Years": the prophecy investigation, based on Richard J. Allinson's book.
   Prototype: one playable chapter, "Where Was the Temple?" (the book's chapter 3), and the chapters to come.

   A chapter is a mystery: the Lamplighter asks a question, the player states a first theory, gathers five clues
   (each a small puzzle), places the answer on the map, and the reveal is confirmed from Scripture.
   Progress lives in Lamp.state.adv.p.fsy. */
(function () {
  "use strict";
  const Lamp = window.Lamp;
  if (!Lamp || !Lamp.adv || !Lamp.adv.kit) return;
  const K = Lamp.adv.kit, esc = K.esc, $ = (id) => document.getElementById(id);
  const BOOK = "The Final Seven Years";

  const CHAPTERS = [
    { id: "temple", n: 1, title: "Where Was the Temple?", tease: "The Third Temple will stand where the first one stood. But where was that?", play: true },
    { id: "weeks", n: 2, title: "The Seventy Weeks", tease: "Sixty-nine weeks are fulfilled. One week remains. When does it begin?" },
    { id: "horns", n: 3, title: "The Ten Horns", tease: "Daniel saw ten kings rise together. Are they rising now?" },
    { id: "babylon", n: 4, title: "Mystery, Babylon the Great", tease: "A woman rides the beast and reigns over the kings of the earth. Who is she?" },
    { id: "witnesses", n: 5, title: "The Two Witnesses", tease: "Two olive trees, two lampstands, standing before the God of the earth." },
    { id: "tishri", n: 6, title: "The Tishri Corridor", tease: "The appointed times hold a pattern. Daniel's numbers point to one feast." },
    { id: "seals", n: 7, title: "The Scroll with Seven Seals", tease: "Who is worthy to open the book, and to loose the seals thereof?" },
    { id: "king", n: 8, title: "The King Returns", tease: "The gate that is shut shall be opened. His feet shall stand upon the mount of Olives." },
  ];

  K.A(); // make sure the adventure state exists
  function P() { const a = K.A(); a.p.fsy = a.p.fsy || { clues: {} }; a.p.fsy.clues = a.p.fsy.clues || {}; return a.p.fsy; }
  const save = () => Lamp.save();

  /* ---------- the Temple Mount map (north at the top; drawn, not painted) ---------- */
  const SPOT = { gate: [262, 160], spirits: [138, 160], rock: [142, 236], south: [150, 372], olives: [292, 160] };
  function mapSVG(opts) {
    const o = opts || {}, cl = P().clues;
    const pin = (k, label) => '<g class="pin" transform="translate(' + SPOT[k][0] + "," + SPOT[k][1] + ')"><circle r="7"/><text y="-11">' + label + "</text></g>";
    return '<svg class="fmap" viewBox="0 0 320 420" role="img" aria-label="Map of the Temple Mount, north at the top">' +
      '<defs><pattern id="fpave" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 0H10V10" fill="none" stroke="rgba(120,90,40,.18)" stroke-width="1"/></pattern></defs>' +
      '<rect x="0" y="0" width="320" height="420" fill="#E9DDBF"/>' +
      '<path d="M290 20 C310 120 312 260 300 410" fill="none" stroke="#9BAE7A" stroke-width="26" opacity=".45"/><text class="ml" x="300" y="300" transform="rotate(90 300 300)">MOUNT OF OLIVES</text>' +
      '<polygon points="48,40 258,34 262,402 60,410" fill="url(#fpave)" stroke="#7A5A2A" stroke-width="3"/>' +
      '<text class="ml" x="66" y="58">THE TEMPLE MOUNT</text>' +
      (o.court ? '<rect class="court" x="70" y="200" width="160" height="80" rx="6"/>' : "") +
      (o.measure ? '<rect class="inner" x="118" y="140" width="40" height="40"/><rect class="outer" x="62" y="196" width="190" height="200"/><text class="ml g" x="70" y="392">OUTER COURT · GIVEN TO THE GENTILES</text>' : "") +
      '<g class="dome gold" transform="translate(' + SPOT.rock[0] + "," + SPOT.rock[1] + ')"><polygon points="-16,-7 -7,-16 7,-16 16,-7 16,7 7,16 -7,16 -16,7"/><circle r="8"/></g><text class="ml" x="' + (SPOT.rock[0] - 34) + '" y="' + (SPOT.rock[1] + 30) + '">Dome of the Rock</text>' +
      '<g class="dome small" transform="translate(' + SPOT.spirits[0] + "," + SPOT.spirits[1] + ')"><circle r="6"/></g><text class="ml" x="' + (SPOT.spirits[0] - 40) + '" y="' + (SPOT.spirits[1] - 14) + '">Dome of the Spirits</text>' +
      '<rect class="gatemk" x="254" y="150" width="12" height="20"/><text class="ml" x="214" y="146">Eastern Gate</text>' +
      '<text class="ml" x="150" y="425" text-anchor="middle">S</text><text class="ml n" x="152" y="28" text-anchor="middle">N ▲</text>' +
      (cl.line || o.line ? '<line class="sight" x1="' + SPOT.olives[0] + '" y1="160" x2="40" y2="160"/>' : "") +
      (cl.summit ? pin("spirits", "") : "") +
      (o.pace != null ? '<g class="pacer"><line x1="' + SPOT.gate[0] + '" y1="172" x2="' + (SPOT.gate[0] - o.pace * 0.6417) + '" y2="172"/><circle cx="' + (SPOT.gate[0] - o.pace * 0.6417) + '" cy="172" r="5"/></g>' : "") +
      (o.extra || "") + "</svg>";
  }

  /* ---------- the five clues ---------- */
  const CLUES = [
    { id: "floor", title: "The threshing floor", ref: "2 Chronicles 3:1", run: clueFloor,
      v: "Then Solomon began to build the house of the LORD at Jerusalem in mount Moriah, where the LORD appeared unto David his father, in the place that David had prepared in the threshingfloor of Ornan the Jebusite.",
      learned: "The Temple was built on a threshing floor: flat, level bedrock. The rock under the Dome of the Rock is jagged and uneven. The bedrock under the Dome of the Spirits is flat." },
    { id: "summit", title: "The top of the mountain", ref: "Josephus, Wars 5.184", run: clueSummit,
      v: "The Temple stood on the very top of the mountain, on ground that needed no preparation.",
      learned: "Josephus, a priest who served in the Temple, says it stood on the very top of the mountain. The natural summit is the northern rise." },
    { id: "line", title: "The line from the Eastern Gate", ref: "Josephus, Wars 5.222", run: clueLine,
      v: "The Temple faced east: from the sanctuary, through the Eastern Gate, to the Mount of Olives.",
      learned: "A straight line west from the Eastern Gate passes over the Dome of the Spirits, not the Dome of the Rock." },
    { id: "cubits", title: "The measuring cubits", ref: "Mishnah, Middot 2:5", run: clueCubits,
      v: "The Court of the Women was a hundred and thirty-five cubits long and a hundred and thirty-five cubits wide.",
      learned: "Walked out from the Eastern Gate, the Mishnah's courts add up to about 187 cubits to the sanctuary. That distance ends at the northern bedrock." },
    { id: "middle", title: "The middle of the court", ref: "2 Chronicles 7:7", run: clueMiddle,
      v: "Moreover Solomon hallowed the middle of the court that was before the house of the LORD: for there he offered burnt offerings, and the fat of the peace offerings, because the brasen altar which Solomon had made was not able to receive the burnt offerings.",
      learned: "The middle of the court had to stay open for offerings. The Dome of the Rock stands in that middle, so the Temple could not have stood there." },
  ];

  let st = null;   // this visit: misses and hints, for the rewards
  function chapter() {
    st = { misses: 0, hints: 0, t0: Date.now() };
    K.open(BOOK + " · Chapter 1", { hint: hint }, "fsy");
    const p = P();
    if (p.done) return board(true);
    if (!p.theory) return opening();
    board();
  }
  function hint() {
    st.hints++;
    const p = P(), left = CLUES.filter((c) => !p.clues[c.id]);
    if (left.length) K.say("Open the clue “" + left[0].title + "” in your journal. Every clue is in the Scripture or the history it quotes.", "", 5200);
    else K.say("All five clues point the same way. Place the Holy of Holies where the flat summit, the gate's line and the cubits meet.", "", 5600);
  }
  function stage(html, bg) {
    const sb = $("adv-say"); if (sb) sb.classList.remove("on");
    $("adv-scene").innerHTML = '<div class="fsy"><div class="bgp" style="background-image:url(img/start/' + (bg || "fsy-cover.jpg") + ')"></div>' + html + "</div>";
    return $("adv-scene").querySelector(".fsy");
  }

  function opening() {
    const s = stage('<div class="fkick">' + BOOK + ' · Chapter 1</div><h1>Where Was the Temple?</h1>' +
      '<div class="fnarr">“The Bible says a Temple will stand again in Jerusalem, in the last seven years. It will stand where the first Temple stood. <b>But where was that?</b> For thirteen centuries the world has assumed it knew. Look at the evidence, and decide for yourself.”<small>The Lamplighter</small></div>' +
      '<div class="fq">Before you look at the clues: where do you think the Holy of Holies stood?</div>' +
      '<div class="fchoices"><button data-t="rock">Under the golden Dome of the Rock</button><button data-t="spirits">On the small northern rise</button><button data-t="unsure">I don’t know yet</button></div>');
    s.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => {
      P().theory = b.dataset.t; save(); K.sfx("click");
      K.say(b.dataset.t === "rock" ? "Most people think so. Hold on to that thought, and test it." : b.dataset.t === "spirits" ? "An unusual answer. Let's see if the evidence agrees." : "A good place to start: let the evidence decide.", "", 3600);
      setTimeout(() => K.root() && board(), 500);
    }));
  }

  function board(finished) {
    const p = P(), found = CLUES.filter((c) => p.clues[c.id]).length;
    const s = stage('<div class="fkick">Where Was the Temple? · Clues ' + found + " of 5</div>" +
      '<div class="fmapwrap">' + mapSVG({ measure: finished }) + "</div>" +
      '<div class="fjournal">' + CLUES.map((c, i) => '<button class="fclue' + (p.clues[c.id] ? " done" : "") + '" data-c="' + i + '"><i>' + (p.clues[c.id] ? "✓" : i + 1) + "</i><span><b>" + esc(c.title) + "</b><small>" + esc(c.ref) + "</small></span></button>").join("") + "</div>" +
      (finished ? '<button class="fbtn" id="fend">The answer, and what comes next</button>' : found === 5 ? '<button class="fbtn glow" id="fplace">Place the Holy of Holies</button>' : '<div class="fsmall">Open a clue. Each one is a piece of evidence.</div>'));
    s.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => {
      const c = CLUES[+b.dataset.c]; K.sfx("click");
      if (p.clues[c.id]) { K.card('<div class="kick">Clue · ' + esc(c.ref) + "</div><h2>" + esc(c.title) + '</h2><div class="v">“' + esc(c.v) + '”</div><p><b>What it shows.</b> ' + esc(c.learned) + '</p><button class="cta" data-act="x">Back to the journal</button>', { x: () => {} }); return; }
      c.run(c);
    }));
    const pl = $("fplace"); if (pl) pl.onclick = place;
    const en = $("fend"); if (en) en.onclick = ending;
    if (!finished && found === 0) K.say("Five clues are hidden in Scripture and history. Gather them, then decide.", "", 4200);
  }
  function solved(c) {
    P().clues[c.id] = 1; save(); K.snd("word"); K.buzz("success");
    K.card('<div class="kick">Clue found · ' + esc(c.ref) + "</div><h2>" + esc(c.title) + '</h2><div class="v">“' + esc(c.v) + '”</div><p><b>What it shows.</b> ' + esc(c.learned) + "</p>" +
      '<p class="fgo">Go deeper: <i>' + BOOK + "</i>, chapter 3.</p>" + '<button class="cta" data-act="x">Add to the journal</button>', { x: () => board() });
  }
  const wrong = (msg) => { st.misses++; K.snd("bad"); K.buzz("error"); K.say(msg, "", 4600); };
  function clueScreen(c, html) {
    const s = stage('<div class="fkick">Clue · ' + esc(c.ref) + "</div><h1>" + esc(c.title) + '</h1><div class="fverse">“' + esc(c.v) + "”</div>" + html +
      '<button class="fback" id="fback">‹ Journal</button>');
    $("fback").onclick = () => { K.sfx("click"); board(); };
    return s;
  }

  /* 1. a threshing floor must be flat: which rock fits? */
  function clueFloor(c) {
    const s = clueScreen(c, '<div class="fq">A threshing floor was where grain was beaten and the chaff blown away. What kind of ground must it be?</div>' +
      '<div class="fchoices" id="fq1"><button data-a="0">High and jagged rock</button><button data-a="1">Flat, level bedrock</button><button data-a="0">A deep cave</button></div><div id="fq2"></div>');
    s.querySelectorAll("#fq1 [data-a]").forEach((b) => (b.onclick = () => {
      if (b.dataset.a !== "1") { wrong("Grain is threshed on a hard, flat floor. Think of what a threshing floor needed."); return; }
      K.sfx("click"); $("fq1").innerHTML = '<div class="fok">Flat, level bedrock.</div>';
      $("fq2").innerHTML = '<div class="fq">Two rocks on the Temple Mount. Which could be a threshing floor?</div><div class="frocks">' +
        '<button data-r="0"><svg viewBox="0 0 120 60"><path d="M4 56 L18 30 L28 40 L40 12 L52 34 L64 20 L78 44 L92 16 L104 38 L116 56Z"/></svg><span>The rock under the Dome of the Rock</span></button>' +
        '<button data-r="1"><svg viewBox="0 0 120 60"><path d="M4 56 L10 24 L110 24 L116 56Z"/></svg><span>The bedrock under the Dome of the Spirits</span></button></div>';
      s.querySelectorAll("[data-r]").forEach((r) => (r.onclick = () => {
        if (r.dataset.r !== "1") { wrong("That rock is irregular, jagged and rises sharply. Could grain be threshed on it?"); return; }
        solved(c);
      }));
    }));
  }
  /* 2. the summit: tap the highest point on the north–south profile */
  function clueSummit(c) {
    const s = clueScreen(c, '<div class="fq">This is the ground of the Temple Mount from north to south. Tap the very top of the mountain.</div>' +
      '<svg class="fprof" viewBox="0 0 320 150"><path class="land" d="M0 150 L0 70 L30 60 L60 34 L100 34 L125 52 L150 60 L165 48 L172 66 L180 50 L195 78 L230 92 L270 104 L320 112 L320 150Z"/>' +
      '<text x="6" y="146">NORTH</text><text x="314" y="146" text-anchor="end">SOUTH</text>' +
      '<g class="tap" data-p="1"><rect x="56" y="10" width="50" height="40" fill="transparent"/></g><g class="tap" data-p="0"><rect x="150" y="30" width="40" height="44" fill="transparent"/></g><g class="tap" data-p="0"><rect x="250" y="70" width="60" height="44" fill="transparent"/></g></svg>' +
      '<div class="fsmall">Herod enlarged the platform mostly to the south, filling it in to make it level.</div>');
    s.querySelectorAll("[data-p]").forEach((g) => (g.onclick = () => {
      if (g.dataset.p !== "1") { wrong("Not the top. The highest natural ground is elsewhere. Look again."); return; }
      solved(c);
    }));
  }
  /* 3. draw the line west from the Eastern Gate */
  function clueLine(c) {
    const s = clueScreen(c, '<div class="fq">Tap the Eastern Gate on the map to look straight west, as the Temple faced.</div><div class="fmapwrap small" id="fm">' + mapSVG({}) + "</div>");
    const go = () => {
      $("fm").innerHTML = mapSVG({ line: true }); K.sfx("stone");
      setTimeout(() => {
        const q = document.createElement("div"); q.innerHTML = '<div class="fq">Which building does the line cross?</div><div class="fchoices"><button data-a="0">The Dome of the Rock</button><button data-a="1">The Dome of the Spirits</button></div>';
        s.insertBefore(q, $("fback"));
        q.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => { if (b.dataset.a !== "1") { wrong("Follow the line with your finger. Where does it go?"); return; } solved(c); }));
      }, 900);
    };
    s.querySelector(".gatemk").addEventListener("click", go, { once: true });
    const hit = document.createElement("button"); hit.className = "fgatehit"; hit.setAttribute("aria-label", "The Eastern Gate"); hit.onclick = go; $("fm").appendChild(hit);
  }
  /* 4. pace out the cubits from the gate */
  function clueCubits(c) {
    let v = 0;
    const s = clueScreen(c, '<div class="fq">The Mishnah lists the courts from the Eastern Gate: the Court of the Women, 135 cubits, then the Court of Israel, the Court of the Priests, the altar and the steps, another 52 cubits. Pace out the whole distance.</div>' +
      '<div class="fmapwrap small" id="fm">' + mapSVG({ pace: 0 }) + '</div><div class="fpace"><button id="fminus">−</button><b id="fval">0 cubits</b><button id="fplus">+</button></div><button class="fbtn" id="fstop">Stop here</button>');
    const draw = () => { $("fm").innerHTML = mapSVG({ pace: v }); $("fval").textContent = v + " cubits"; };
    $("fplus").onclick = () => { v = Math.min(300, v + 11); if (v > 180 && v < 194) v = 187; K.sfx("click"); draw(); };
    $("fminus").onclick = () => { v = Math.max(0, v - 11); if (v > 180 && v < 194) v = 187; K.sfx("click"); draw(); };
    $("fstop").onclick = () => {
      if (v !== 187) { wrong(v < 187 ? "Not far enough. Add the two parts together: 135 and 52." : "Too far. 135 and 52 make the whole distance."); return; }
      K.sfx("stone"); K.say("187 cubits from the gate, and you stand on the flat northern bedrock.", "", 3600); setTimeout(() => K.root() && solved(c), 1400);
    };
  }
  /* 5. tap the middle of the court */
  function clueMiddle(c) {
    const s = clueScreen(c, '<div class="fq">Solomon kept the middle of the court open for offerings. Tap the middle of the court.</div><div class="fmapwrap small" id="fm">' + mapSVG({ court: true }) + "</div>");
    const hit = document.createElement("button"); hit.className = "fmidhit"; hit.setAttribute("aria-label", "The middle of the court");
    hit.onclick = () => {
      K.sfx("click");
      const q = document.createElement("div"); q.innerHTML = '<div class="fq">What stands in the middle of the court today?</div><div class="fchoices"><button data-a="1">The Dome of the Rock</button><button data-a="0">Nothing; it is open</button></div>';
      s.insertBefore(q, $("fback")); hit.remove();
      q.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => { if (b.dataset.a !== "1") { wrong("Look at the map again: what is in the middle?"); return; } solved(c); }));
    };
    $("fm").appendChild(hit);
  }

  /* ---------- the verdict ---------- */
  function place() {
    const s = stage('<div class="fkick">The verdict</div><h1>Place the Holy of Holies</h1><div class="fq">All five clues are in your journal. Where did the Holy of Holies stand?</div>' +
      '<div class="fmapwrap" id="fm">' + mapSVG({}) + "</div>" + '<button class="fback" id="fback">‹ Journal</button>');
    $("fback").onclick = () => board();
    [["rock", "The Dome of the Rock"], ["spirits", "The Dome of the Spirits"], ["south", "The southern end"]].forEach(([k, label]) => {
      const b = document.createElement("button"); b.className = "fspot"; b.setAttribute("aria-label", label);
      b.style.left = (SPOT[k][0] / 320) * 100 + "%"; b.style.top = (SPOT[k][1] / 420) * 100 + "%";
      b.onclick = () => {
        if (k === "rock") { wrong("The rock there is jagged, it is not the summit, the gate's line misses it, and it stands in the middle of the court Solomon kept open."); return; }
        if (k === "south") { wrong("The south is Herod's added platform, filled in to make it level: not the summit, and not a threshing floor."); return; }
        reveal();
      };
      $("fm").appendChild(b);
    });
    K.say("Tap the place on the map.", "", 2400);
  }
  function reveal() {
    const p = P(), first = !p.done;
    p.done = 1; save(); K.snd("level"); K.sfx("stone"); K.buzz("success");
    const was = p.theory === "rock" ? "<p>You first thought the Temple stood under the Dome of the Rock, as most people do. The evidence pointed north.</p>" : p.theory === "spirits" ? "<p>Your first guess was right: the evidence points north.</p>" : "";
    const s = stage('<div class="fkick">Revealed</div><h1>The northern summit</h1><div class="fmapwrap" id="fm">' + mapSVG({ measure: true }) + "</div>" +
      '<div class="fverse">“Rise, and measure the temple of God, and the altar, and them that worship therein. But the court which is without the temple leave out, and measure it not; for it is given unto the Gentiles.”<small>Revelation 11:1–2</small></div>', "fsy-cover.jpg");
    void s;
    K.say("Measure the temple and the altar. Leave out the outer court. The Dome of the Rock stays where it is, in the court given to the Gentiles.", "Revelation 11:2", 7000);
    setTimeout(() => {
      if (!K.root()) return;
      if (first) { K.A().relics.reed = 1; save(); }
      const stats = { misses: st.misses, hints: st.hints, secs: (Date.now() - st.t0) / 1000 };
      let oil = 0; if (first && !stats.hints && stats.misses <= 1) { oil = 2; Lamp.state.oil += 2; save(); }
      K.card('<div class="kick">Chapter 1 solved · Relic found</div><div class="freed">' + REED_SVG + "</div><h2>The Measuring Reed</h2>" +
        '<div class="v">“And there was given me a reed like unto a rod.”</div><div class="r">Revelation 11:1 · KJV</div>' + was +
        '<div class="fview"><b>The author’s view.</b> Scripture, Josephus, the Mishnah and the bedrock agree: the Holy of Holies stood on the northern summit, beneath today’s Dome of the Spirits. A Third Temple can be rebuilt there without touching the Dome of the Rock, exactly as Revelation 11 describes.<small>From <i>' + BOOK + "</i> by Richard J. Allinson, chapter 3</small></div>" +
        (oil ? '<div class="rewards"><div>' + Lamp.ICON.oil + " <b>Sharp investigator</b> · +2 oil</div></div>" : "") +
        '<button class="cta" data-act="next">What comes next</button>', { next: ending });
    }, 4200);
  }
  function ending() {
    K.card('<div class="kick">Coming soon · Chapter 2</div><h2>The Seventy Weeks</h2>' +
      '<div class="v">“And he shall confirm the covenant with many for one week: and in the midst of the week he shall cause the sacrifice and the oblation to cease.”</div><div class="r">Daniel 9:27 · KJV</div>' +
      "<p>The Temple can stand. But when? Sixty-nine of Daniel’s seventy weeks are fulfilled. <b>One week remains.</b></p>" +
      '<p class="fgo">The investigation continues in new chapters, coming soon. Follow <b>THE FINAL SEVEN YEARS</b> on Facebook to hear first.</p>' +
      '<button class="cta" data-act="list">See the chapters ahead</button><button class="cta alt" data-act="x">Back to the journey</button>',
      { list: hub, x: () => K.shut() });
  }

  /* ---------- the chapter list ---------- */
  function hub() {
    if (!K.root()) K.open(BOOK, {}, "fsy-hub");
    const p = P();
    stage('<img class="fcover" src="img/start/fsy-cover.jpg" alt="The Final Seven Years, by Richard Allinson"><div class="fsub">The investigation through Daniel and Revelation, from the book by Richard J. Allinson</div><div class="fchap">' +
      CHAPTERS.map((c) => '<button class="fch' + (c.play ? "" : " soon") + '" data-ch="' + c.id + '"><i>' + c.n + "</i><span><b>" + esc(c.title) + (c.play && p.done ? " ✓" : "") + "</b><small>" + esc(c.tease) + "</small>" + (c.play ? "" : "<em>Coming soon</em>") + "</span></button>").join("") + "</div>");
    $("adv-scene").querySelectorAll("[data-ch]").forEach((b) => (b.onclick = () => {
      const c = CHAPTERS.find((x) => x.id === b.dataset.ch);
      if (c.play) { K.sfx("click"); chapter(); return; }
      K.say("“" + c.title + "” is coming soon. Follow THE FINAL SEVEN YEARS on Facebook to hear when it arrives.", "", 4200);
    }));
  }
  const REED_SVG = '<svg viewBox="0 0 200 60" aria-hidden="true"><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#8A6A2A"/><stop offset=".5" stop-color="#E8C66A"/><stop offset="1" stop-color="#8A6A2A"/></linearGradient></defs><rect x="8" y="24" width="184" height="12" rx="6" fill="url(#rg)"/>' +
    [30, 52, 74, 96, 118, 140, 162].map((x) => '<rect x="' + x + '" y="22" width="3" height="16" fill="#5A4318"/>').join("") + "</svg>";

  Lamp.fsy = {
    chapters: CHAPTERS,
    open: hub,
    play: chapter,
    card() {
      const p = P();
      return '<button class="fsycard" data-fsy="1"><span class="k">Daniel · Revelation</span><b>' + BOOK + '</b><span class="rule"></span>' +
        "<small>" + (p.done ? "Chapter 1 solved. Chapter 2, The Seventy Weeks, is coming soon." : "New: a prophecy investigation. Play the first chapter, “Where Was the Temple?”") + '</small><span class="go">' + (p.done ? "See the chapters" : "Begin the investigation") + "</span></button>";
    },
  };
})();
