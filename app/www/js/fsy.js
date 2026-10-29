/* Lamp — "The Final Seven Years": the prophecy investigation, based on Richard J. Allinson's book.
   Episode 1, "The Jerusalem Mystery". The route through the city (31 scenes, walked Myst-style) is in js/fsy-route.js;
   this file holds the puzzles built first, which that route calls in their new places:
     - the airport opening and the Watchman's first card;
     - the Temple Institute — the Ark (Exodus 25), Walk the Courts (Psalm 100:4), the instrument lock (Psalm 150:3),
       the vessels, a parchment read with the letter wheel (Ezekiel 43:2), and the postcard;
     - the Tombs of the Prophets on the Mount of Olives, and the view of the sealed gate (Zechariah 14:4);
     - Robinson's Arch (Matthew 24:2);
     - the Temple Mount — five clues, the verdict, the Measuring Reed (Revelation 11:1–2), and the Waqf official;
     - the Eastern Gate, from inside — "this gate shall be shut" (Ezekiel 44:2–3), and the cliffhanger.
   Richard's films are no longer played in the game (Oct 27): stills from them are in img/fsy/w/ instead.
   Progress lives in Lamp.state.adv.p.fsy. */
(function () {
  "use strict";
  const Lamp = window.Lamp;
  if (!Lamp || !Lamp.adv || !Lamp.adv.kit) return;
  const K = Lamp.adv.kit, esc = K.esc, $ = (id) => document.getElementById(id);
  const BOOK = "The Final Seven Years", EP = "The Jerusalem Mystery";

  const CHAPTERS = [
    { id: "temple", n: 1, title: EP, tease: "A Temple will stand again in Jerusalem. Follow the clues from the Temple Institute to the sealed Eastern Gate.", play: !!Lamp.fsyOpen },
    { id: "weeks", n: 2, title: "The Seventy Weeks", tease: "Sixty-nine weeks are fulfilled. One week remains. When does it begin?" },
    { id: "horns", n: 3, title: "The Ten Horns", tease: "Daniel saw ten kings rise together. Are they rising now?" },
    { id: "babylon", n: 4, title: "Mystery, Babylon the Great", tease: "A woman rides the beast and reigns over the kings of the earth. Who is she?" },
    { id: "witnesses", n: 5, title: "The Two Witnesses", tease: "Two olive trees, two lampstands, standing before the God of the earth." },
    { id: "tishri", n: 6, title: "The Tishri Corridor", tease: "The appointed times hold a pattern. Daniel's numbers point to one feast." },
    { id: "seals", n: 7, title: "The Scroll with Seven Seals", tease: "Who is worthy to open the book, and to loose the seals thereof?" },
    { id: "king", n: 8, title: "The King Returns", tease: "The gate that is shut shall be opened. His feet shall stand upon the mount of Olives." },
  ];

  K.A(); // make sure the adventure state exists
  function P() { const a = K.A(); a.p.fsy = a.p.fsy || { clues: {} }; a.p.fsy.clues = a.p.fsy.clues || {}; a.p.fsy.ti = a.p.fsy.ti || {}; return a.p.fsy; }
  const save = () => Lamp.save();
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

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

  /* ---------- the five clues on the Temple Mount ---------- */
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
      learned: "The middle of the court had to stay open for offerings. The Dome of the Rock stands in that middle, so the Temple could not have stood there.",
      note: "When I showed this verse to a guide at the Temple Institute in Jerusalem, after asking him about the brazen altar, he said: “This is First Temple times. This is remarkable.”" },
  ];

  /* Richard's own photographs from Jerusalem (December 2023 and 2024) */
  const photo = (f, cap, by) => '<figure class="fphoto' + (/vessel-garments/.test(f) ? " tall" : "") + '"><img src="img/fsy/' + f + '" alt="' + esc(cap) + '"><figcaption>' + esc(cap) + "</figcaption></figure>";
  const TI = "Photo: Richard J. Allinson, at the Temple Institute";
  CLUES[0].photo = ["bedrock.jpg", "The bedrock inside the Dome of the Spirits: flat, level, natural rock"];
  /* where each clue is found on the Mount, in Richard's photographs */
  CLUES[0].scene = ["tm-bedrock.jpg", "Inside the Dome of the Spirits: the bedrock, flat and level, with its seam"];
  CLUES[1].scene = ["tm-north.jpg", "The northern end of the platform: the Dome of the Spirits stands alone on the open paving"];
  CLUES[2].scene = ["tm-line.jpg", "From the Dome of the Spirits, looking east: the Eastern Gate’s dome, and the Mount of Olives behind it"];
  CLUES[3].scene = ["tm-gate-wide.jpg", "The Eastern Gate from inside the Mount: the place to start counting"];
  CLUES[4].scene = ["tm-dome-rock.jpg", "The Dome of the Rock, in the middle of the great court"];
  CLUES[2].photo = ["gate-inside.jpg", "The Eastern Gate, sealed, seen from inside the Temple Mount"];
  CLUES[4].photo = ["dome-rock.jpg", "The Dome of the Rock, in the middle of the court"];
  /* the Watchman signs every note with a small drawn lamp */
  const WLAMP = '<svg class="fwl" viewBox="0 0 40 24" aria-label="a small drawn lamp"><path d="M4 15 Q4 9 14 9 L28 9 Q34 9 36 13 L30 15 Q22 20 12 19 Q4 18 4 15Z" fill="none" stroke="#2A3A7A" stroke-width="1.8"/><path d="M33 12 Q36 5 34 1 Q31 6 33 12Z" fill="#2A3A7A"/><circle cx="18" cy="12" r="1.6" fill="#2A3A7A"/></svg>';
  const wnote = (html) => '<div class="fwnote">' + html + WLAMP + "</div>";
  let st = null;   // this visit: misses and hints, for the rewards
  let cur = "";    // which stop is open, for the hint
  function hint() {
    if (cur === "walk" && Lamp.fsyWalk) return Lamp.fsyWalk.hint();
    st.hints++;
    const p = P();
    if (cur === "hall") { const left = EXHIBITS.filter((e) => !P().ti[e.id]); K.say(left.length ? "Try “" + left[0].title + "”. Tap its glint in the photograph." : "Look at the postcard stand by the door. One card stands out.", "", 4600); }
    else if (cur === "ark") K.say(p.ti.wings ? "The staves stay where God put them: in the rings, never taken out." : "Tap each cherub so its wings stretch out over the mercy seat, and its face looks to the other.", "", 5200);
    else if (cur === "courts") K.say("Begin at the Eastern Gate: the Court of the Women first, then the men of Israel, then the priests, the altar, the sanctuary, and last of all the Holy of Holies.", "", 6000);
    else if (cur === "lock") K.say(P().ti.psalter ? "Verse 3 names exactly three, in this order: the trumpet, the psaltery and the harp." : "The last psalm is Psalm 150. There is a book of Psalms on the shelves in the entrance hall.", "", 5200);
    else if (cur === "vessels") K.say("Read each vessel’s card first. Exodus 40: the table on the north side, the lampstand on the south, the golden altar before the veil.", "", 6000);
    else if (cur === "scroll") K.say("The glory came from the way of the EAST, with a voice like many WATERS, and the earth shined with his GLORY.", "", 5600);
    else if (cur === "verdict") K.say("Turn the plan so its gate faces east (right), then lay its gate on the Eastern Gate. The Holy of Holies should rest on the small northern dome.", "", 6400);
    else if (cur === "case") K.say("Pick evidence from Scripture, history and measurement, not impressions.", "", 4000);
    else if (cur === "seal") K.say("Turn over each note in the tombs: Haggai 1:1 is the sixth month, Zechariah 1:1 the eighth, and Malachi has no date: he is last. Outermost ring first.", "", 6400);
    else if (cur === "robinson") K.say("“There shall not be left here one STONE upon ANOTHER, that shall not be THROWN down.”", "Matthew 24:2", 5200);
    else if (cur === "sign") K.say("The rusty sign in the hedge: tap it.", "", 3000);
    else if (cur === "tombs") { const q = P(), l = PROPHETS.filter((x) => !(q.prophets || {})[x.id]); K.say(!q.tombOil ? "Your lamp needs oil: look high on the right, in a niche no visitor would reach." : l.length ? "Sweep the lamp slowly across the whole wall. " + l[0].hint : "All three are found: go into the central chamber.", "", 5600); }
    else if (cur === "olives") K.say("Look across the valley at the city wall. The sealed gate is the one straight ahead, below the domes.", "", 4600);
    else if (cur === "gate") K.say("“This gate shall be SHUT… because the LORD hath ENTERED in by it… It is for the PRINCE.”", "Ezekiel 44:2–3", 5600);
    else {
      const left = CLUES.filter((c) => !p.clues[c.id]);
      if (left.length) K.say("Open the clue “" + left[0].title + "” in your journal. Every clue is in the Scripture or the history it quotes.", "", 5200);
      else K.say("All five clues point the same way. Place the Holy of Holies where the flat summit, the gate's line and the cubits meet.", "", 5600);
    }
  }
  /* Hank's narration (audio/narration/fsy-*.mp3): only the lines recorded so far play; the rest stay silent */
  const HAVE = new Set(["01-open", "02-outside", "02b-hall", "03-ark-verse", "04-staves", "05-courts-verse", "06-courts", "07-instruments-verse", "07b-instruments", "07c-vessels",
    "08-parchment-verse", "09-parchment", "09b-postcard", "10-olives", "11-olives-gate", "12-mount-open", "13-theory", "14-journal", "15-floor", "16-summit", "17-line", "18-cubits",
    "19-middle", "20-verdict", "21-reveal", "22-gate-open", "23-gate-verse", "24-cliffhanger", "guide-welcome", "guide-souvenir", "guide-ark", "waqf-1", "waqf-2"]);
  /* music and background sound for each place (audio/music/fsy-*.js); a track not made yet falls back to one that is */
  const HAVE_M = new Set(["theme", "hall", "puzzle", "olives", "investigation", "reveal", "gate", "cliff", "amb-street", "amb-indoor", "amb-olives", "amb-platform", "amb-chamber", "m9", "m10", "m11", "amb-airport", "amb-train", "amb-market", "amb-tram"]);
  const HAVE_S = new Set(["wings", "wingsflap", "staves", "lock", "dial", "step", "parchment", "postcard", "journal", "knock", "harp", "stone", "shofar", "door", "rod", "stamp", "coin", "ticket", "pay", "trambell", "shopbell"]);
  /* a prop sound from Richard's recordings, or the game's own sound if that one isn't recorded yet */
  function S(name, fallback, vol) { if (Lamp.score && HAVE_S.has(name)) Lamp.score.sfx("fsy-sfx-" + name, vol); else if (fallback) K.sfx(fallback); }
  const preS = (...n) => Lamp.score && Lamp.score.preload(n.filter((x) => HAVE_S.has(x)).map((x) => "fsy-sfx-" + x));
  const FALL = { reveal: "theme", gate: "hall", cliff: "theme", "amb-platform": "amb-olives", "amb-chamber": null, "amb-airport": "amb-street", "amb-train": "amb-street", "amb-market": "amb-street", "amb-tram": "amb-street",
    /* the new tracks for the walking route (M9–M25 in the doc): until Richard makes them, the nearest finished track plays */
    m9: "theme", m10: "hall", m11: "theme", m12: "olives", m13: "investigation", m14: "hall", m15: "puzzle", m16: "olives", m17: "theme", m18: "puzzle",
    m19: "olives", m20: "hall", m21: "investigation", m22: "olives", m23: "olives", m24: "investigation", m25: "reveal" };
  function M(music, amb) {
    if (!Lamp.score) return;
    let m = HAVE_M.has(music) ? music : FALL[music]; if (m && !HAVE_M.has(m)) m = FALL[m] || null;
    const a0 = amb ? "amb-" + amb : null, a = a0 && (HAVE_M.has(a0) ? a0 : FALL[a0]);
    Lamp.score.set(m ? "fsy-" + m : null, a ? "fsy-" + a : null);
  }
  function V(name, then) { if (Lamp.narr && HAVE.has(name)) Lamp.narr.play("fsy-" + name, then); }
  function stage(html, bg) {
    Lamp.narr && Lamp.narr.stop();
    const sb = $("adv-say"); if (sb) sb.classList.remove("on");
    $("adv-scene").innerHTML = '<div class="fsy"><div class="bgp" style="background-image:url(' + (bg ? "img/fsy/" + bg : "img/start/fsy-cover.jpg") + ')"></div>' + html + "</div>";
    $("adv-scene").scrollTop = 0;
    return $("adv-scene").querySelector(".fsy");
  }
  const wrong = (msg) => { st.misses++; if (HAVE_S.has("knock")) S("knock", null, 0.9); else K.snd("bad"); K.buzz("error"); K.say(msg, "", 4600); };
  const back = (label) => '<button class="fback" data-back="1">‹ ' + esc(label) + "</button>";
  function wire(s, fn) { const b = s.querySelector("[data-back]"); if (b) b.onclick = () => { K.sfx("click"); fn(); }; }

  /* ================================================================ the episode ================================================================ */
  function episode() {
    st = { misses: 0, hints: 0, t0: Date.now() };
    K.open(BOOK + " · Episode 1", { hint: hint }, "fsy");
    const p = P();
    if (!p.began || !p.watchCard) { p.began = 1; save(); return intro(); }
    stops();
  }
  /* the route map (js/fsy-route.js) replaces the old list of four stops */
  function stops() { if (Lamp.fsyWalk) Lamp.fsyWalk.map(); }
  /* The opening: the Lamplighter at his desk hands you the Watchman's journal (like Atrus in Riven).
     Richard will film it. Until then the words show on screen. When the film is ready, put it in
     video/fsy/ and set INTRO_FILM to its name, e.g. "video/fsy/lamplighter-desk.mp4". */
  const INTRO_FILM = null;
  const INTRO_WORDS = [
    "You came. Good. Sit down. I haven’t much time, and neither, I think, have you.",
    "This journal belonged to a man I knew only as the Watchman. He spent years in Jerusalem, walking its walls, going down into its tunnels, measuring its stones. He was looking for one thing. The one thing everyone says they already know: <b>where the Temple stood.</b>",
    "The Bible says a Temple will stand again in Jerusalem, in the last seven years. The vessels are ready. The priests are trained. The plans are drawn. Only one thing is missing: the place. For thirteen centuries the world has assumed it knew. The Watchman was not so sure.",
    "Before he disappeared, he tore out the pages and left them in the city, one at each place that mattered, each signed with a small drawn lamp. One page he left with me: the first. <b>The other eleven are out there.</b>",
    "I can’t go. There is a man in a grey coat who has been at the edges of my days for some weeks now. I don’t know who sent him. But I know he wants the pages.",
    "So it falls to you. Find the pages. Read them in the places he left them. Look at the evidence with your own eyes. And when you have all twelve, stand on the Mount and decide for yourself where the house of God once stood, and where it will stand again.",
    "“I have set watchmen upon thy walls, O Jerusalem, which shall never hold their peace day nor night.” He kept his watch. Now keep yours. <b>Go up to Jerusalem.</b>",
  ];
  function intro() {
    cur = ""; M("theme", "chamber");
    const film = INTRO_FILM ? '<video class="ffilm" src="' + INTRO_FILM + '" playsinline controls autoplay></video>' :
      '<div class="fdesk">' + INTRO_WORDS.map((t) => "<p>" + t + "</p>").join("") + "<small>The Lamplighter · his film will play here</small></div>";
    const credit = '<div class="fcredit">Every photograph and painting in this episode is by Richard J. Allinson, taken and made in Israel.</div>';
    stage('<div class="fkick">' + BOOK + ' · Episode 1</div><h1>The Lamplighter’s desk</h1>' + (INTRO_FILM ? "" : '<img class="fdeskimg" src="img/fsy/w/intro-desk.jpg" alt="The Lamplighter’s desk at night: an oil lamp, a journal tied with cord, a map of Jerusalem">') + film + credit +
      '<button class="fbtn glow" id="fgo">Take the journal</button>', "w/intro-desk.jpg");
    $("fgo").onclick = () => {
      K.sfx("click"); const p = P(); p.watchCard = 1; save(); S("parchment");
      const W = Lamp.fsyWalk && Lamp.fsyWalk.W(); if (W) { W.pages[1] = 1; save(); }
      K.card('<div class="kick">The Watchman’s journal · page 1 of 12</div><h2>Blue ink, and a small drawn lamp</h2>' +
        wnote("“If you are reading this, he gave you the book. Then he trusts you, and so must I.<br><br>Do not believe what you are told about the Mount. Believe what you can see and measure. The city has been rebuilt on its own ruins so many times that the stones lie to the careless. They do not lie to the patient.<br><br>Begin where every pilgrim began: go <i>up</i>. Take the train from the airport to Jerusalem. When you come up out of the earth into the light, go to the market, where everything is weighed.<br><br>Trust the man with the angel’s name, at the number of the verse where Messiah is cut off. Be wary of the man in grey.”") +
        "<p>The rest of the pages have been torn out. You put the journal in your backpack.</p>" +
        '<button class="cta" data-act="x">To passport control</button>', { x: () => { if (Lamp.fsyWalk) Lamp.fsyWalk.go("airport", "control"); } });
    };
  }
  /* which of the kept puzzles are finished (for the route map) */
  function keptDone(k) { const p = P(); return k === "intro" ? !!p.watchCard : k === "institute" ? !!p.ti.postcard : k === "prophets" ? !!p.tombs : k === "olives" ? !!p.olives : k === "robinson" ? !!p.robinson : k === "mount" ? !!(p.done && p.waqf) : k === "gate" ? !!p.gateDone : false; }
  const walkDone = (id) => Lamp.fsyWalk && Lamp.fsyWalk.keptDone(id);

  /* ================================================================ 1. the Temple Institute ================================================================ */
  const EXHIBITS = [
    { id: "ark", title: "The Ark of the Covenant", ref: "Exodus 25:15, 20", run: ark },
    { id: "courts", title: "Walk the Courts", ref: "Psalm 100:4", run: courts },
    { id: "lock", title: "The instrument case", ref: "A lock of three dials", run: lock },
    { id: "vessels", title: "The Temple vessels", ref: "Exodus 25–30", run: vessels },
    { id: "scroll", title: "The parchment", ref: "Ezekiel 43:2", run: scroll, needs: "lock" },
  ];
  function institute() {
    cur = ""; const p = P(); M("hall", "street");
    if (!p.ti.entered) {
      const s = stage('<div class="fkick">Act 4 · The Jewish Quarter</div><h1>The Temple Institute</h1>' +
        photo("ti-sign.jpg", "The Temple Institute Visitors’ Center, in the Jewish Quarter", TI) +
        '<div class="fnarr">“Here the vessels of the Temple have been made again, ready for the day it stands: the Ark, the menorah, the harps and trumpets. Everything is prepared. <b>Everything but the place.</b> Go in, and look closely at five things.”<small>The Lamplighter</small></div>' +
        '<button class="fbtn glow" id="fgo">Go inside</button>' + back("The map"));
      wire(s, stops); $("fgo").onclick = () => { S("door", "stone"); p.ti.entered = 1; save(); institute(); }; V("02-outside");
      return;
    }
    hall();
  }
  /* the entrance hall is the main room: tap something in the photograph to walk to it; every exhibit leads back here */
  const HALL = [
    { k: "vessels", label: "The display cases of Temple vessels", box: [0, 15, 13, 60], dot: [6, 40] },
    { k: "lock", label: "The case of Temple instruments", box: [13, 18, 10, 52], dot: [18, 44] },
    { k: "ark", label: "The pictures of the Ark on the far wall", box: [24.5, 31, 15, 12], dot: [31.5, 37] },
    { k: "priest", label: "The priest’s white garments", box: [25, 44, 8, 25] },
    { k: "desk", label: "The guide at the front desk", box: [34, 52, 39, 21] },
    { k: "courts", label: "The painting of the Temple", box: [79, 14, 13, 22], dot: [85.5, 25] },
    { k: "books", label: "The bookshelves", box: [74, 36, 16, 30] },
    { k: "cards", label: "The postcard stand", box: [91, 27, 9, 62] },
  ];
  function hall() {
    cur = "hall"; const p = P(); M("hall", "indoor");
    const all = EXHIBITS.every((e) => p.ti[e.id]), left = EXHIBITS.filter((e) => !p.ti[e.id]);
    const s = stage('<div class="fkick">Act 4 · The Temple Institute</div><h1>The entrance hall</h1>' +
      '<div class="fq">' + (p.ti.postcard ? "You have the postcard. The Mount of Olives is waiting." : all ? "Every exhibit is solved. Before you leave, look around the hall once more." : "Tap anything in the room to walk over to it. You can leave a puzzle and come back to it at any time.") + "</div>" +
      '<div class="fark fhall" id="fhall"><img src="img/fsy/ti-hall.jpg" alt="The entrance hall of the Temple Institute">' +
      HALL.map((h) => '<button class="fhit" data-h="' + h.k + '" aria-label="' + esc(h.label) + '" style="left:' + h.box[0] + "%;top:" + h.box[1] + "%;width:" + h.box[2] + "%;height:" + h.box[3] + '%"></button>' +
        (h.dot ? (p.ti[h.k] ? '<span class="fdone" style="left:' + h.dot[0] + "%;top:" + h.dot[1] + '%">✓</span>' : '<span class="fglint" style="left:' + h.dot[0] + "%;top:" + h.dot[1] + '%"></span>') : "")).join("") +
      (all && !p.ti.postcard ? '<span class="fglint big" style="left:96.5%;top:43%"></span>' : "") + "</div>" +
      '<div class="fprog">' + EXHIBITS.map((x) => '<button data-e="' + x.id + '" class="' + (p.ti[x.id] ? "done" : x.needs && !p.ti[x.needs] ? "locked" : "") + '">' + (p.ti[x.id] ? "✓ " : "") + esc(x.title.replace(/^The /, "")) + "</button>").join("") + "</div>" +
      (p.ti.postcard ? '<button class="fbtn glow" id="fgo">Leave: out by the Dung Gate</button>' : "") + back("The map"), "ti-hall.jpg");
    wire(s, stops);
    const go = $("fgo"); if (go) go.onclick = () => { K.sfx("click"); walkDone("institute"); };
    const openEx = (id) => {
      const x = EXHIBITS.find((e) => e.id === id);
      if (x.needs && !p.ti[x.needs]) { K.say("The parchment lies inside the instrument case. Open the case first.", "", 3200); return; }
      x.run();
    };
    s.querySelectorAll("[data-e]").forEach((b) => (b.onclick = () => { K.sfx("click"); openEx(b.dataset.e); }));
    s.querySelectorAll("[data-h]").forEach((b) => (b.onclick = () => {
      const h = b.dataset.h; K.sfx("click");
      if (h === "vessels" || h === "lock" || h === "ark" || h === "courts") { if (h === "courts") K.say("The painting shows the Temple on its mountain. Beside it, a plan of the courts.", "", 2200); openEx(h); return; }
      if (h === "priest") K.say("The white linen of an ordinary priest: “thou shalt embroider the coat of fine linen, and thou shalt make the mitre of fine linen.”", "Exodus 28:39", 5200);
      else if (h === "books") {
        if (p.ti.lock) { K.say("Books on the Temple, its vessels and its service. Everything has been studied. Only the place is still argued over.", "", 4600); return; }
        S("parchment", "click"); p.ti.psalter = 1; save();
        K.card('<div class="kick">On the bookshelf</div><h2>A Psalter, left open</h2>' +
          "<p>Among the books on the Temple, a well-worn Book of Psalms lies open at the very last psalm: the song the Levites sang in the courts.</p>" +
          '<div class="fpsalm"><b>Psalm 150</b><span><i>1</i> Praise ye the LORD. Praise God in his sanctuary: praise him in the firmament of his power.</span><span><i>2</i> Praise him for his mighty acts: praise him according to his excellent greatness.</span><span class="hi"><i>3</i> Praise him with the sound of the trumpet: praise him with the psaltery and harp.</span><span><i>4</i> Praise him with the timbrel and dance: praise him with stringed instruments and organs.</span><span><i>5</i> Praise him upon the loud cymbals: praise him upon the high sounding cymbals.</span><span><i>6</i> Let every thing that hath breath praise the LORD. Praise ye the LORD.</span></div>' +
          '<button class="cta" data-act="x">Remember verse 3</button>', { x: () => {} });
        V("07-instruments-verse");
      }
      else if (h === "desk") {
        if (all) { K.say("The guide smiles. “Did you find what you came for? Everyone takes a souvenir home.”", "", 5200); V("guide-souvenir"); }
        else if (!p.ti.ark && !p.ti.greeted) { p.ti.greeted = 1; save(); K.say("The guide smiles. “Shalom! Take your time. Everything here was made for the Temple.”", "", 4600); V("guide-welcome", () => { K.say("“The Ark? The pictures are on the far wall. Start there, if you like.” He hands you a little map of the hall, drawn by hand in blue ink.", "", 5600); V("guide-ark"); }); }
        else if (!p.ti.ark) { K.say("“The Ark? The pictures are on the far wall. Start there, if you like.”", "", 4600); V("guide-ark"); }
        else K.say("The guide smiles. “Take your time. " + (left.length === 1 ? "One exhibit is left: " : left.length + " exhibits are left, starting with ") + left[0].title.replace(/^The /, "the ") + ".”", "", 5200);
      }
      else if (h === "cards") { if (all) postcard(); else K.say("Postcards of the menorah, the Western Wall and the Temple model. Nothing stands out yet.", "", 3600); }
    }));
    if (p.ti.postcard) return;
    if (all) K.say("Before you leave: the guide said everyone takes a souvenir home.", "", 3600);
    else if (left.length === EXHIBITS.length) { if (!p.ti.heardHall) { p.ti.heardHall = 1; save(); V("02b-hall"); } } if (!all && left.length === EXHIBITS.length) K.say("The glints mark the exhibits. Start wherever you like: the pictures of the Ark on the far wall are a good place.", "", 4600);
  }
  function exhibitDone(id, html, acts) {
    const p = P(); p.ti[id] = 1; save(); S("harp", null, 0.8); K.buzz("success");
    if (id === "scroll") V("08-parchment-verse", () => V("09-parchment")); else V({ courts: "06-courts", lock: "07b-instruments", vessels: "07c-vessels" }[id]);
    K.card(html + '<button class="cta' + (acts ? " alt" : "") + '" data-act="x">Back to the entrance hall</button>', Object.assign({ x: hall }, acts || {}));
  }
  function exhibit(x, html, bg) {
    M("puzzle", "indoor"); preS("wings", "wingsflap", "staves", "step", "dial", "lock", "harp", "knock", "parchment");
    const s = stage('<div class="fkick">The Temple Institute · ' + esc(x.ref) + "</div><h1>" + esc(x.title) + "</h1>" + html + back("Back to the entrance hall"), bg);
    wire(s, hall);
    const open = { ark: "03-ark-verse", courts: "05-courts-verse" }[x.id]; if (open) V(open);
    return s;
  }

  /* 1a. the Ark: fold the cherubim's wings over the mercy seat, and leave the staves in the rings */
  function ark() {
    cur = "ark"; const x = EXHIBITS[0], p = P(), w = p.ti.wingState || { l: 0, r: 0 };
    const img = () => "ark-" + (w.l && w.r ? "both" : w.l ? "left" : w.r ? "right" : "open") + ".jpg";
    const s = exhibit(x, '<div class="fverse">“And the cherubims shall stretch forth their wings on high, covering the mercy seat with their wings, and their faces shall look one to another; toward the mercy seat shall the faces of the cherubims be.”<small>Exodus 25:20</small></div>' +
      '<div class="fq">The model’s cherubim are set wrong. Tap each cherub to set its wings as Moses was told.</div>' +
      '<div class="fark" id="fark"><img src="img/fsy/' + img() + '" alt="A model of the Ark of the Covenant"><button class="fhit" data-w="l" aria-label="The cherub on the left" style="left:4%;top:2%;width:40%;height:38%"></button><button class="fhit" data-w="r" aria-label="The cherub on the right" style="left:56%;top:2%;width:40%;height:38%"></button></div>' +
      '<div id="fstaves"></div>', "ark.jpg");
    const draw = () => { $("fark").querySelector("img").src = "img/fsy/" + img(); };
    s.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => {
      if (p.ti.wings) return;
      w[b.dataset.w] = w[b.dataset.w] ? 0 : 1; p.ti.wingState = w; save(); S("wings", "stone"); draw();
      if (w.l && w.r) {
        p.ti.wings = 1; save(); K.snd("word"); K.buzz("success"); setTimeout(() => S("wingsflap"), 350);
        K.say("Wings on high, covering the mercy seat, face to face. Now the staves.", "", 3400);
        setTimeout(() => K.root() && staves(), 1200);
      } else if (w.l || w.r) K.say("One cherub is set. Now the other, so their faces look one to another.", "", 3000);
    }));
    function staves() {
      $("fstaves").innerHTML = '<div class="fverse">“The staves shall be in the rings of the ark: they shall not be taken from it.”<small>Exodus 25:15</small></div><div class="fq">The guide offers to draw the carrying staves out of the rings, so you can see the Ark on its own. What do you say?</div>' +
        '<div class="fchoices"><button data-a="0">Draw them out</button><button data-a="1">Leave them in the rings</button></div>';
      V("04-staves");
      $("fstaves").querySelectorAll("[data-a]").forEach((c) => (c.onclick = () => {
        if (c.dataset.a !== "1") { wrong("Read Exodus 25:15 again. Were the staves ever to come out?"); return; }
        S("staves", "click");
        exhibitDone("ark", '<div class="kick">Exhibit 1 · Exodus 25</div><h2>The Ark of the Covenant</h2>' + photo("ark.jpg", "The Ark of the Covenant, as made ready by the Temple Institute", TI) +
          '<p><b>What it shows.</b> God gave Moses every detail of the Ark: the wings of the cherubim stretched over the mercy seat, their faces one to another, and the staves never to leave the rings. The Ark was always ready to be carried, always ready to move. <b>It was made for a place.</b></p>' +
          '<p><b>What was inside.</b> The tables of the covenant, the golden pot of manna and Aaron’s rod that budded (Hebrews 9:4). It stood in the Holy of Holies behind the veil, and the high priest entered once a year, on the Day of Atonement, to sprinkle blood on the mercy seat (Leviticus 16:14–15).</p>' +
          '<p class="fgo">Go deeper: <i>' + BOOK + "</i>, chapter 3.</p>");
      }));
      $("fstaves").scrollIntoView({ behavior: "smooth", block: "end" });
    }
    if (p.ti.wings) staves();
  }

  /* 1b. walk the courts in order from the Eastern Gate */
  const COURTS = [["The Court of the Women", "135 cubits"], ["The Court of Israel", "for the men of Israel"], ["The Court of the Priests", "for the priests"], ["The Altar", "and the steps up"], ["The Sanctuary", "the Holy Place"], ["The Holy of Holies", "20 cubits square"]];
  function courts() {
    cur = "courts"; const x = EXHIBITS[1]; let at = 0;
    const order = shuffle(COURTS.map((c, i) => i));
    const s = exhibit(x, '<div class="fverse">“Enter into his gates with thanksgiving, and into his courts with praise.”<small>Psalm 100:4</small></div>' +
      photo("ti-plan.jpg", "The plan of the Temple and its courts, at the Temple Institute", TI) +
      '<div class="fq">Walk the Temple as a pilgrim did: in at the Eastern Gate, then court by court, inward. Tap the courts in order.</div>' +
      '<div class="fpath" id="fpath"><span class="fstep done">The Eastern Gate</span></div>' +
      '<div class="fchips" id="fchips">' + order.map((i) => '<button data-i="' + i + '"><b>' + esc(COURTS[i][0]) + "</b><small>" + esc(COURTS[i][1]) + "</small></button>").join("") + "</div>", "ti-plan.jpg");
    s.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => {
      const i = +b.dataset.i;
      if (i !== at) { b.classList.add("bad"); setTimeout(() => b.classList.remove("bad"), 400); wrong(at === 0 ? "A pilgrim came in at the gate and stood first in the largest court, open to all." : i < at ? "You have walked that court already." : "Not yet. Which court comes next, going inward?"); return; }
      S("step", "stone"); b.classList.add("used"); at++;
      const sp = document.createElement("span"); sp.className = "fstep"; sp.textContent = COURTS[i][0]; $("fpath").appendChild(sp);
      if (at === COURTS.length) setTimeout(() => K.root() && exhibitDone("courts", '<div class="kick">Exhibit 2 · Psalm 100:4</div><h2>Walk the Courts</h2>' + photo("ti-model.jpg", "A model of the Temple, at the Temple Institute", TI) +
        "<p><b>What it shows.</b> From the Eastern Gate a pilgrim walked west, inward: the Court of the Women, 135 cubits; then the Court of Israel, the Court of the Priests and the altar, another 52 cubits. <b>187 cubits from the gate stood the sanctuary.</b> Remember that number: it will be paced out on the Temple Mount.</p>" +
        '<p class="fgo">Go deeper: <i>' + BOOK + "</i>, chapter 3.</p>"), 700);
      else K.say(at === 1 ? "Through the Court of the Women, 135 cubits long. Now the men of Israel's court." : at === 4 ? "Past the altar. Only the house itself is left." : "", "", 2800);
    }));
  }

  /* 1c. the instrument case: pick the three instruments of Psalm 150:3 */
  const INSTR = [["Trumpet", 1], ["Timbrel", 0], ["Psaltery", 1], ["Cymbals", 0], ["Harp", 1], ["Organ", 0]];
  /* what stands in the case: each instrument, its purpose in the Temple, and its Scripture */
  const CASE = [
    { id: "trumpets", name: "The silver trumpets", heb: "chatzotzrot", box: [0.03, 0.01, 0.33, 0.47], ref: "Numbers 10:2, 10",
      v: "Make thee two trumpets of silver; of a whole piece shalt thou make them: that thou mayest use them for the calling of the assembly, and for the journeying of the camps.",
      what: "The only instruments the Torah itself commands. Each is beaten from one piece of silver. In the Temple the priests, not the Levites, blow them: over the daily offerings, at the new moons and feasts, and when the Levites’ song pauses, so the people bow. The Mishnah says never fewer than two (Arakhin 2:5). The Temple Institute has made silver trumpets like these, ready for the priests." },
    { id: "nevel", name: "The harps", heb: "nevel · the KJV’s “psaltery”", box: [0.1, 0.42, 0.42, 0.82], ref: "Psalm 33:2",
      v: "Praise the LORD with harp: sing unto him with the psaltery and an instrument of ten strings.",
      what: "The nevel is the larger, deeper-voiced harp of the Levites. Harps of this kind are being built in Jerusalem for the Temple Institute; one modern Temple nevel has twenty-two strings, one for each letter of the Hebrew alphabet. In the Temple the Mishnah allowed never fewer than two nor more than six (Arakhin 2:3)." },
    { id: "kinnor", name: "The great lyre", heb: "kinnor · the KJV’s “harp”", box: [0.39, 0.06, 0.6, 0.76], ref: "1 Chronicles 15:16",
      v: "And David spake to the chief of the Levites to appoint their brethren to be the singers with instruments of musick, psalteries and harps and cymbals, sounding, by lifting up the voice with joy.",
      what: "The kinnor is David’s own instrument, the one he played before Saul (1 Samuel 16:23). It was the Levites’ main instrument: never fewer than nine in the Temple, and no upper limit (Arakhin 2:5). This great kinnor, carved with the star of David, was made for the Levites to play when the Temple stands again." },
    { id: "shofar", name: "The shofar", heb: "the ram’s horn", box: [0.56, 0.27, 0.69, 0.72], ref: "Psalm 81:3",
      v: "Blow up the trumpet in the new moon, in the time appointed, on our solemn feast day.",
      what: "The shofar is the ram’s horn, remembering the ram caught in the thicket on this very mountain (Genesis 22:13). In the Temple it was blown with the silver trumpets on the Feast of Trumpets (Mishnah Rosh Hashanah 3:3). Here it rests on the covered stand." },
    { id: "trumpets2", name: "More silver trumpets", heb: "chatzotzrot", box: [0.67, 0.08, 0.95, 0.47], ref: "2 Chronicles 29:27–28",
      v: "And when the burnt offering began, the song of the LORD began also with the trumpets, and with the instruments ordained by David king of Israel. And all the congregation worshipped, and the singers sang, and the trumpeters sounded.",
      what: "Hezekiah’s Temple service shows the order: the offering begins, the song begins, the trumpets sound, and all the congregation bows. The Temple Institute has made trumpets for the priests of the Third Temple to do the same." },
    { id: "lyres", name: "The small lyres", heb: "kinnor", box: [0.67, 0.48, 0.95, 0.75], ref: "Psalm 137:2",
      v: "We hanged our harps upon the willows in the midst thereof.",
      what: "By the rivers of Babylon the captives hung up their kinnorot and could not sing the LORD’s song in a strange land. These small lyres are the same instrument, made again. In the Temple the Levites sang to the kinnor every day (Psalm 92:3), and the song was never to be silent." },
  ];
  function lock() {
    cur = "lock"; const x = EXHIBITS[2]; const got = [], p = P(); p.ti.seen = p.ti.seen || {};
    const seenN = () => Object.keys(p.ti.seen).length;
    const s = exhibit(x, (p.ti.psalter ? '<div class="fverse">“Praise him with the sound of the trumpet: praise him with the psaltery and harp.”<small>Psalm 150:3 · from the Psalter in the hall</small></div>' : "") +
      '<div class="fq">Every instrument in this case has been made for the Third Temple. Tap each one to learn what it is for.</div>' +
      '<div class="fark fcase" id="fcase"><img src="img/fsy/ti-instruments.jpg" alt="Harps, lyres, silver trumpets and a shofar made for the Temple, at the Temple Institute">' +
      CASE.map((c) => '<button class="fhit' + (p.ti.seen[c.id] ? " seen" : "") + '" data-k="' + c.id + '" aria-label="' + esc(c.name) + '" style="left:' + c.box[0] * 100 + "%;top:" + c.box[1] * 100 + "%;width:" + (c.box[2] - c.box[0]) * 100 + "%;height:" + (c.box[3] - c.box[1]) * 100 + '%"></button>').join("") + "</div>" +
      '<div class="fsmall" id="fseen"></div>' +
      '<div class="fchips three" id="fnames">' + CASE.map((c) => '<button data-k="' + c.id + '"' + (p.ti.seen[c.id] ? ' class="seen"' : "") + "><b>" + esc(c.name) + "</b></button>").join("") + "</div>" +
      (p.ti.lock ? '<div class="fok">The case stands open. A rolled parchment lies inside.</div><button class="fbtn glow" id="fparch">' + (p.ti.scroll ? "Read the parchment again" : "Read the parchment") + "</button>" :
      '<div class="fq">The case is locked with three brass dials, each engraved with instruments. A small plate beneath them reads:</div>' +
      '<div class="fplate">“The song of the Levites: the last psalm, the third verse.”</div>' +
      '<div id="flockhere"></div>' +
      '<button class="fbtn" id="ftry">Try the lock</button>' +
      (p.ti.psalter ? "" : '<div class="fsmall">Which psalm is the last? Perhaps something in the entrance hall will tell you.</div>')), "ti-instruments.jpg");
    const fp = $("fparch"); if (fp) fp.onclick = () => { S("parchment", "click"); scroll(); };
    const seenLine = () => { $("fseen").innerHTML = seenN() >= CASE.length ? "You have looked at every instrument in the case." : "Looked at " + seenN() + " of " + CASE.length + "."; };
    seenLine();
    s.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => {
      const c = CASE.find((y) => y.id === b.dataset.k); K.sfx("click");
      p.ti.seen[c.id] = 1; save(); s.querySelectorAll('[data-k="' + c.id + '"]').forEach((e) => e.classList.add("seen")); seenLine();
      K.card('<div class="kick">In the case · ' + esc(c.heb) + "</div><h2>" + esc(c.name) + '</h2><div class="v">“' + esc(c.v) + '”</div><div class="r">' + esc(c.ref) + " · KJV</div>" +
        "<p><b>Its purpose in the Temple.</b> " + esc(c.what) + "</p>" + '<button class="cta" data-act="x">Back to the case</button>', { x: () => {} });
    }));
    const dials = p.ti.dials || [1, 3, 5]; let tries = 0;
    const lh = $("flockhere");
    if (lh && Lamp.fsyWalk) { const L = Lamp.fsyWalk.lockUI({ faces: INSTR.map((x) => x[0]), words: true, v: dials, onTurn: () => { p.ti.dials = dials.slice(); save(); } }); lh.innerHTML = L.html; L.wire(lh); }
    const tr = $("ftry"); if (tr) tr.onclick = () => {
      const want = ["Trumpet", "Psaltery", "Harp"], got2 = dials.map((i) => INSTR[i][0]);
      if (got2.join() !== want.join()) {
        tries++;
        wrong(!p.ti.psalter ? "The lock does not move. You need the words of that verse: look around the entrance hall." : tries < 2 ? "The lock does not move. Read the verse again, and set the dials in its order." : "Psalm 150:3, in order: the trumpet, the psaltery, the harp.");
        return;
      }
      got.push(...got2);
      S("lock");
      setTimeout(() => K.root() && exhibitDone("lock", '<div class="kick">Exhibit 3 · Psalm 150:3</div><h2>The case opens</h2>' +
        "<p>Trumpet, psaltery and harp: the three dials turn, and the lock gives way. Inside, beneath a silver trumpet, lies a <b>rolled parchment</b>. Tied to it is a slip of paper with nothing on it but a small drawn lamp, in blue ink: the same lamp as the card in your luggage.</p>" +
        "<p><b>What it shows.</b> Every instrument here is waiting for a building. The priests have their trumpets, the Levites their harps and lyres, the choir its songs. The psalms will be sung again in the courts you just walked. <b>Only the place is missing.</b></p>" +
        '<p class="fgo">Go deeper: <i>' + BOOK + "</i>, chapter 3.</p>" + '<button class="cta" data-act="parch">Read the parchment</button>', { parch: () => { S("parchment"); scroll(); } }), 600);
    };
    if (!seenN()) K.say("Silver trumpets, harps, a great lyre, a shofar. Tap them in the photograph.", "", 3600);
  }

  /* 1c2. the Temple vessels: what each was for, and its Scripture */
  const VESSELS = [
    { id: "menorah", name: "The menorah", heb: "the golden lampstand", photo: ["menorah.jpg", "The golden menorah in the Jewish Quarter, recreated by the Temple Institute", "Photo: Richard J. Allinson, Jewish Quarter, Jerusalem"], ref: "Exodus 25:31, 37",
      v: "And thou shalt make a candlestick of pure gold: of beaten work shall the candlestick be made… And thou shalt make the seven lamps thereof: and they shall light the lamps thereof, that they may give light over against it.",
      what: "One piece of beaten gold, with seven lamps. It stood in the Holy Place, on the south side, and the priests lit it every evening and trimmed it every morning (Exodus 27:20–21; 30:7–8). Its light was the only light in the sanctuary. The plaque beside this one says it was recreated for the first time since the destruction of the Second Temple, according to the Temple Institute’s research.",
      tie: "Zechariah saw it with two olive trees beside it (Zechariah 4:2–3), and Revelation 11:4 names the Two Witnesses: “These are the two olive trees, and the two candlesticks standing before the God of the earth.”" },
    { id: "incense", name: "The golden altar of incense", heb: "mizbach hazahav", photo: ["vessel-incense.jpg", "The golden altar of incense, before the veil", "Painting: Richard J. Allinson"], ref: "Exodus 30:7–8",
      v: "And Aaron shall burn thereon sweet incense every morning: when he dresseth the lamps, he shall burn incense upon it. And when Aaron lighteth the lamps at even, he shall burn incense upon it, a perpetual incense before the LORD throughout your generations.",
      what: "A small golden altar, a cubit square and two cubits high, standing just before the veil that hides the Holy of Holies. A priest burned sweet incense on it every morning and every evening, when the lamps were tended. Each morning the ashes were cleared from it by hand.",
      tie: "David prayed: “Let my prayer be set forth before thee as incense” (Psalm 141:2), and in Revelation 8:3–4 the smoke of the incense goes up with the prayers of the saints." },
    { id: "table", name: "The table of showbread", heb: "shulchan", photo: ["vessel-table.jpg", "The table of showbread: twelve loaves in two rows of six", "Painting: Richard J. Allinson"], ref: "Leviticus 24:5–8",
      v: "And thou shalt take fine flour, and bake twelve cakes thereof… And thou shalt set them in two rows, six on a row, upon the pure table before the LORD… Every sabbath he shall set it in order before the LORD continually.",
      what: "A golden table in the Holy Place, opposite the menorah. Twelve loaves, one for each tribe of Israel, stood in two rows of six, and the priests set out fresh bread every Sabbath. The bread was never absent: “thou shalt set upon the table shewbread before me alway” (Exodus 25:30).",
      tie: "The twelve loaves say that all twelve tribes stand before God, always. The Temple Institute has completed this table." },
    { id: "altar", name: "The brazen altar", heb: "mizbach haolah", photo: ["vessel-altar.jpg", "The brazen altar in the court, with its ramp", "Painting: Richard J. Allinson"], ref: "Exodus 27:1–2",
      v: "And thou shalt make an altar of shittim wood, five cubits long, and five cubits broad; the altar shall be foursquare: and the height thereof shall be three cubits… and thou shalt overlay it with brass.",
      what: "The great altar of the court, overlaid with brass, where the daily offering was burned: a lamb every morning and every evening, without fail (Exodus 29:38–39). Its fire was never to go out. Solomon’s altar in the Temple was far larger, twenty cubits square (2 Chronicles 4:1), and still “was not able to receive the burnt offerings”, so he hallowed the middle of the court (2 Chronicles 7:7). That is Clue 5, on the Temple Mount.",
      tie: "Where this altar stood is the question the whole mystery turns on." },
    { id: "garments", name: "The High Priest’s garments", heb: "bigdei kehunah", photo: ["vessel-garments.jpg", "The High Priest in his garments: the breastplate of twelve stones, the robe with bells and pomegranates, and the gold plate", "Painting: Richard J. Allinson"], ref: "Exodus 28:36–38",
      v: "And thou shalt make a plate of pure gold, and grave upon it, like the engravings of a signet, HOLINESS TO THE LORD.",
      what: "Eight garments for the High Priest, with a gold plate on his forehead and a breastplate of twelve stones, each engraved with the name of a tribe (Exodus 28:15–21). He wore them to serve in the sanctuary, and on the Day of Atonement he entered the Holy of Holies. The Temple Institute says it has completed the breastplate, the ephod and the gold plate.",
      tie: "He carried the names of Israel “upon his heart” whenever he went in before the LORD (Exodus 28:29)." },
  ];
  function vessels() {
    cur = "vessels"; const x = EXHIBITS[3], p = P(); p.ti.vseen = p.ti.vseen || {};
    const n = () => Object.keys(p.ti.vseen).length;
    const s = exhibit(x, '<div class="fverse">“And thou shalt make a candlestick of pure gold… And thou shalt make the seven lamps thereof.”<small>Exodus 25:31, 37</small></div>' +
      '<div class="fq">Every vessel of the Temple had a purpose, and Scripture says what it was. Tap each one in turn.</div>' +
      '<div class="fchips three vess" id="fnames">' + VESSELS.map((c) => '<button data-k="' + c.id + '"' + (p.ti.vseen[c.id] ? ' class="seen"' : "") + "><b>" + esc(c.name) + "</b></button>").join("") + "</div>" +
      '<div class="fsmall" id="fseen"></div><div id="fvq"></div>', "menorah.jpg");
    const line = () => { $("fseen").textContent = "Looked at " + n() + " of " + VESSELS.length + "."; };
    const question = () => {
      if (n() < VESSELS.length || p.ti.vessels || $("fvq").innerHTML) return;
      const PL = { menorah: ["The menorah", "S"], table: ["The table", "N"], incense: ["The incense altar", "W"] }, at = {}; let pick = null;
      $("fvq").innerHTML = '<div class="fq">Now set three of them in the Holy Place, where Moses put them in the tabernacle. Tap a vessel, then its place.</div>' +
        '<div class="fholy" id="fholy"><svg viewBox="0 0 320 200" aria-hidden="true"><rect x="40" y="20" width="250" height="160" fill="#2A2418" stroke="#C9A24A" stroke-width="3"/><rect x="40" y="20" width="18" height="160" fill="url(#fveil)"/>' +
        '<defs><linearGradient id="fveil" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2A4A9A"/><stop offset=".5" stop-color="#7A2A7A"/><stop offset="1" stop-color="#A02A2A"/></linearGradient></defs>' +
        '<text x="10" y="104" class="fl">THE VEIL</text><text x="300" y="104" class="fl" text-anchor="middle" transform="rotate(90 300 104)">ENTRANCE · EAST</text><text x="165" y="14" class="fl" text-anchor="middle">NORTH</text><text x="165" y="196" class="fl" text-anchor="middle">SOUTH</text></svg>' +
        '<button class="fslot" data-p="N" style="left:42%;top:14%">?</button><button class="fslot" data-p="S" style="left:42%;top:66%">?</button><button class="fslot" data-p="W" style="left:20%;top:40%">?</button></div>' +
        '<div class="fchips three" id="fvch">' + Object.keys(PL).map((k) => '<button data-v="' + k + '"><b>' + PL[k][0] + "</b></button>").join("") + "</div>";
      $("fvq").querySelectorAll("[data-v]").forEach((b) => (b.onclick = () => { pick = b.dataset.v; K.sfx("click"); $("fvq").querySelectorAll("[data-v]").forEach((e) => e.classList.toggle("sel", e === b)); }));
      $("fvq").querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => {
        if (!pick) { K.say("First tap a vessel, then the place it belongs.", "", 2400); return; }
        Object.keys(at).forEach((k) => { if (at[k] === pick) delete at[k]; });
        at[b.dataset.p] = pick; S("step", "click", 0.5); pick = null;
        $("fvq").querySelectorAll("[data-v]").forEach((e) => e.classList.remove("sel"));
        $("fvq").querySelectorAll("[data-p]").forEach((e) => (e.textContent = at[e.dataset.p] ? PL[at[e.dataset.p]][0] : "?"));
        if (Object.keys(at).length < 3) return;
        const bad = Object.keys(at).filter((pl) => PL[at[pl]][1] !== pl);
        if (bad.length) {
          const v = at[bad[0]];
          wrong(v === "menorah" ? "The lampstand stood “on the side of the tabernacle southward” (Exodus 40:24)." : v === "table" ? "The table stood “upon the side of the tabernacle northward, without the vail” (Exodus 40:22)." : "The golden altar stood “in the tent of the congregation before the vail” (Exodus 40:26).");
          bad.forEach((pl) => delete at[pl]); $("fvq").querySelectorAll("[data-p]").forEach((e) => (e.textContent = at[e.dataset.p] ? PL[at[e.dataset.p]][0] : "?"));
          return;
        }
        S("lock", null, 0.6);
        exhibitDone("vessels", '<div class="kick">Exhibit 4 · Exodus 25–30</div><h2>Everything is ready</h2>' + photo("temple-painting.jpg", "The Temple, as it will stand again", "Painting: Richard J. Allinson") +
          "<p>Table to the north, lampstand to the south, the golden altar before the veil: the Holy Place is set as Moses set it (Exodus 40:22–26).</p><p><b>What it shows.</b> The lampstand, the incense altar, the table, the altar of the court and the High Priest’s garments: each has a purpose Scripture gave it, and each has been made again. The vessels are ready. <b>The place is the missing piece.</b></p>" +
          '<p class="fgo">Go deeper: <i>' + BOOK + "</i>, chapter 3.</p>");
      }));
      $("fvq").scrollIntoView({ behavior: "smooth", block: "end" });
    };
    line(); question();
    s.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => {
      const c = VESSELS.find((y) => y.id === b.dataset.k); K.sfx("click");
      p.ti.vseen[c.id] = 1; save(); b.classList.add("seen"); line();
      K.card('<div class="kick">Temple vessel · ' + esc(c.heb) + "</div><h2>" + esc(c.name) + "</h2>" + photo(c.photo[0], c.photo[1], c.photo[2]) +
        '<div class="v">“' + esc(c.v) + '”</div><div class="r">' + esc(c.ref) + " · KJV</div>" +
        "<p><b>Its purpose in the Temple.</b> " + esc(c.what) + "</p>" + "<p>" + esc(c.tie) + "</p>" + '<button class="cta" data-act="x">Back to the vessels</button>', { x: question });
    }));
    if (!n()) K.say("Five vessels, each with a purpose. Start with the menorah.", "", 3600);
  }

  /* 1d. the parchment: Ezekiel 43:2, read with the letter wheel */
  const SCROLL = { text: ["And, behold, the glory of the God of Israel came from the way of the ", "EAST", ": and his voice was like a noise of many ", "WATERS", ": and the earth shined with his ", "GLORY", "."], rounds: [["WATERS", ["EAST", "WATERS"]], ["GLORY", ["GLORY"]]] };
  function scroll() {
    cur = "scroll"; const x = EXHIBITS[4]; const found = new Set(); let round = 0;
    const s = exhibit(x, '<div class="fq">The parchment is a verse of Ezekiel, but three words have faded. Spell them from the letters on the wheel: tap or drag the letters in order.</div>' +
      '<div class="fscroll" id="fscroll"></div>' + '<div class="fwordrow"><button class="fmini" id="fclr" aria-label="Clear letters">✕</button><div class="fword" id="fword">&nbsp;</div><button class="fmini go" id="fgo" aria-label="Check word">✓</button></div>' +
      '<div class="fwheel" id="fwheel"><svg id="flines"></svg></div><div class="fsmall" id="fhow">Three words are missing. This wheel spells two of them.</div>', "ark.jpg");
    const drawScroll = () => { $("fscroll").innerHTML = SCROLL.text.map((t, i) => i % 2 ? '<b class="' + (found.has(t) ? "got" : "gap") + '">' + (found.has(t) ? t : "_".repeat(t.length)) + "</b>" : esc(t)).join("") + '<small>Ezekiel 43:2</small>'; };
    drawScroll();
    const startRound = () => {
      const [letters, targets] = SCROLL.rounds[round];
      $("fhow").textContent = round === 0 ? "Three words are missing. This wheel spells two of them." : "One word left. A new wheel for it.";
      wheel($("fwheel"), $("flines"), $("fword"), $("fgo"), $("fclr"), shuffle(letters.split("")), (w) => {
        if (targets.includes(w) && !found.has(w)) {
          found.add(w); K.snd("word"); K.buzz("success"); drawScroll(); K.say("✓ " + w, "", 1400);
          if (targets.every((t) => found.has(t))) { round++; if (round < SCROLL.rounds.length) setTimeout(startRound, 700); else setTimeout(scrollDone, 900); }
          return true;
        }
        if (found.has(w)) { K.say("Already found.", "", 1600); return false; }
        wrong(w.length < 3 ? "Longer words." : "Not a faded word. Read the verse around the gap."); return false;
      });
    };
    const scrollDone = () => K.root() && exhibitDone("scroll", '<div class="kick">Exhibit 5 · Ezekiel 43:2</div><h2>The glory from the east</h2>' +
      '<div class="v">“And, behold, the glory of the God of Israel came from the way of the east: and his voice was like a noise of many waters: and the earth shined with his glory.”</div><div class="r">Ezekiel 43:2 · KJV</div>' +
      "<p><b>What it shows.</b> Ezekiel saw the glory of God enter the Temple <b>from the east</b>, through the east gate (Ezekiel 43:4). The Temple faced east, toward the Mount of Olives. If you want to know where the Temple stood, stand on that mountain and look back.</p>" +
      '<p class="fgo">The parchment points east. Somewhere in this building is a clue to where you go next.</p>');
    startRound();
  }
  /* a small letter wheel of our own (the game's wheel belongs to the level screen) */
  function wheel(wh, lines, wordEl, goBtn, clrBtn, letters, submit) {
    wh.querySelectorAll(".lt").forEach((n) => n.remove());
    let sel = [], drag = false, moved = false, downHit = null, undoTap = false;
    letters.forEach((c, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / letters.length, d = document.createElement("div");
      d.className = "lt"; d.textContent = c; d.style.left = 50 + 34 * Math.cos(a) + "%"; d.style.top = 50 + 34 * Math.sin(a) + "%"; d.dataset.i = i; wh.appendChild(d);
    });
    const nodes = [...wh.querySelectorAll(".lt")];
    const hitAt = (e) => { let best = null; nodes.forEach((n) => { const b = n.getBoundingClientRect(); if (Math.hypot(e.clientX - b.left - b.width / 2, e.clientY - b.top - b.height / 2) < b.width * 0.62) best = +n.dataset.i; }); return best; };
    const draw = (px, py) => {
      const r = wh.getBoundingClientRect();
      nodes.forEach((n) => n.classList.toggle("sel", sel.includes(+n.dataset.i)));
      const pts = sel.map((i) => { const b = nodes[i].getBoundingClientRect(); return [b.left + b.width / 2 - r.left, b.top + b.height / 2 - r.top]; });
      if (drag && pts.length && px != null) pts.push([px, py]);
      lines.setAttribute("viewBox", "0 0 " + r.width + " " + r.height);
      lines.innerHTML = pts.length > 1 ? '<polyline points="' + pts.map((p) => p.join(",")).join(" ") + '" fill="none" stroke="#C9A24A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>' : "";
      wordEl.innerHTML = sel.map((i) => letters[i]).join("") || "&nbsp;";
      goBtn.classList.toggle("on", sel.length > 0); clrBtn.classList.toggle("on", sel.length > 0);
    };
    const go = () => { const w = sel.map((i) => letters[i]).join(""); sel = []; draw(); if (w) { const ok = submit(w); wordEl.textContent = w; wordEl.classList.toggle("ok", !!ok); setTimeout(() => { if (wordEl.isConnected && !sel.length) { wordEl.innerHTML = "&nbsp;"; wordEl.classList.remove("ok"); } }, 900); } };
    wh.onpointerdown = (e) => {
      drag = true; moved = false; undoTap = false; wh.setPointerCapture(e.pointerId);
      const h = hitAt(e); downHit = h;
      if (h != null) { if (sel.length && sel[sel.length - 1] === h) undoTap = true; else if (!sel.includes(h)) { sel.push(h); Lamp.sound && Lamp.sound("tap", sel.length - 1); } }
      draw();
    };
    wh.onpointermove = (e) => {
      if (!drag) return; const h = hitAt(e);
      if (h != null && h !== downHit) moved = true;
      if (moved && h != null) { if (sel[sel.length - 2] === h) sel.pop(); else if (!sel.includes(h)) { sel.push(h); Lamp.sound && Lamp.sound("tap", sel.length - 1); } }
      const r = wh.getBoundingClientRect(); draw(moved ? e.clientX - r.left : null, moved ? e.clientY - r.top : null);
    };
    const end = () => { if (!drag) return; drag = false; if (moved) go(); else { if (undoTap) sel.pop(); draw(); } };
    wh.onpointerup = end; wh.onpointercancel = end;
    goBtn.onclick = go; clrBtn.onclick = () => { sel = []; draw(); };
    draw();
  }

  /* 1e. the postcard stand by the door: the clue to the next stop (it stands out once every exhibit is solved) */
  const POSTCARD_FRONT = '<svg viewBox="0 0 300 190" class="fpost" role="img" aria-label="A postcard: Greetings from the Mount of Olives">' +
    '<defs><linearGradient id="psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2A65A"/><stop offset=".6" stop-color="#F7D9A0"/><stop offset="1" stop-color="#E9DDBF"/></linearGradient></defs>' +
    '<rect width="300" height="190" fill="#F6EFDD"/><rect x="8" y="8" width="284" height="174" fill="url(#psky)"/>' +
    '<circle cx="250" cy="96" r="13" fill="#FFF3C8"/>' +
    '<path d="M8 120 L60 112 L130 110 L200 108 L292 114 L292 182 L8 182Z" fill="#B9A27A"/>' +
    '<rect x="40" y="100" width="220" height="22" fill="#D9C7A0" stroke="#7A5A2A"/><path d="M96 100 A20 20 0 0 1 136 100Z" fill="#E3B54F" stroke="#7A5A2A"/><rect x="141" y="104" width="18" height="18" fill="#B9A27A" stroke="#7A5A2A"/>' +
    '<path d="M8 182 L8 150 Q60 136 120 148 Q190 160 292 144 L292 182Z" fill="#6E7E42"/>' +
    [28, 70, 112, 210, 256].map((x) => '<ellipse cx="' + x + '" cy="152" rx="13" ry="9" fill="#8A9A52"/><rect x="' + (x - 1.5) + '" y="152" width="3" height="11" fill="#5A4318"/>').join("") +
    '<text x="150" y="34" text-anchor="middle" font-family="Georgia,serif" font-size="12" font-style="italic" fill="#5A3A10">Greetings from the</text>' +
    '<text x="150" y="60" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-weight="700" letter-spacing="2" fill="#7A2A10">MOUNT OF OLIVES</text>' +
    '<text x="150" y="78" text-anchor="middle" font-family="Georgia,serif" font-size="9" letter-spacing="3" fill="#5A3A10">JERUSALEM</text></svg>';
  const POSTCARD_BACK = '<svg viewBox="0 0 300 190" class="fpost" role="img" aria-label="The back of the postcard, with a handwritten note">' +
    '<rect width="300" height="190" fill="#F6EFDD" stroke="#C9B48A"/><line x1="160" y1="20" x2="160" y2="170" stroke="#C9B48A"/>' +
    '<rect x="238" y="16" width="44" height="52" fill="none" stroke="#C9B48A" stroke-dasharray="3 2"/><text x="260" y="46" text-anchor="middle" font-size="8" fill="#9A8A6A">STAMP</text>' +
    [100, 122, 144].map((y) => '<line x1="172" y1="' + y + '" x2="282" y2="' + y + '" stroke="#C9B48A"/>').join("") +
    '<g font-family="Snell Roundhand,Segoe Script,Bradley Hand,cursive" font-size="13" fill="#2A3A7A">' +
    '<text x="16" y="40">Stand where His feet</text><text x="16" y="62">shall stand, and look</text><text x="16" y="84">back at the gate.</text>' +
    '<text x="16" y="120" font-size="11">Zechariah 14:4</text><text x="16" y="150" font-size="12">Then you will see</text><text x="16" y="168" font-size="12">where it stood.</text></g>' +
    '<g transform="translate(118 150) scale(.9)"><path d="M4 15 Q4 9 14 9 L28 9 Q34 9 36 13 L30 15 Q22 20 12 19 Q4 18 4 15Z" fill="none" stroke="#2A3A7A" stroke-width="1.8"/><path d="M33 12 Q36 5 34 1 Q31 6 33 12Z" fill="#2A3A7A"/></g></svg>';
  function postcard() {
    const p = P(); p.ti.postcardSeen = 1; save(); S("postcard");
    K.card('<div class="kick">The postcard stand</div><h2>One card stands out</h2>' +
      "<p>As you reach the stand, a man in a grey coat lets go of the rack and walks out into the street without a word. The rack is still turning. Rows of postcards: the menorah, the Western Wall, the Temple model. But one is turned the other way, as if someone left it for you.</p>" +
      '<div class="fpostwrap" id="fpw" role="button" tabindex="0" aria-label="Turn the postcard over">' + POSTCARD_FRONT + "</div>" +
      '<div class="fsmall" id="fpsm" style="color:#6B5A2A">Tap the postcard to turn it over.</div>' +
      '<button class="cta" data-act="take" id="ftake" style="display:none">Take the postcard</button><button class="cta alt" data-act="x">Put it back</button>',
      { take: () => { p.ti.postcard = 1; if (Lamp.fsyWalk) Lamp.fsyWalk.W().pages[11] = 1; save(); S("journal"); setTimeout(() => S("harp", null, 0.6), 300); K.buzz("success");
          K.card('<div class="kick">Clue found · Zechariah 14:4</div><h2>The next stop</h2><div class="v">“And his feet shall stand in that day upon the mount of Olives, which is before Jerusalem on the east.”</div><div class="r">Zechariah 14:4 · KJV</div>' +
            "<p>The postcard is the eleventh page: blue ink, and a small drawn lamp. Someone, a watchman, wants you on the Mount of Olives, looking back at the gate. <b>The Temple faced east, toward that mountain.</b> The way there is out by the Dung Gate and down to the valley.</p><p>And the man in the grey coat was at this stand before you.</p>" +
            '<button class="cta" data-act="x">Out by the Dung Gate</button>', { x: () => walkDone("institute") }); },
        x: () => {} });
    const pw = $("fpw"); let back2 = false;
    const flip = () => { back2 = !back2; K.sfx("click"); pw.innerHTML = back2 ? POSTCARD_BACK : POSTCARD_FRONT; pw.classList.toggle("back", back2); if (back2) { $("ftake").style.display = ""; $("fpsm").textContent = "A note, in blue ink."; V("09b-postcard"); } };
    pw.onclick = flip; pw.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") flip(); };
  }

  /* ================================================================ 2. the Mount of Olives ================================================================ */
  /* ---- on the Mount of Olives: the Tombs of the Prophets (Haggai, Zechariah, Malachi, by tradition) ---- */
  const PROPHETS = [
    { id: "haggai", name: "Haggai", ref: "Haggai 2:9", v: "The glory of this latter house shall be greater than of the former, saith the LORD of hosts: and in this place will I give peace.",
      hint: "This prophet spoke to old men who remembered Solomon’s house, and wept at how small the new one was.", at: [22, 30],
      date: "In the second year of Darius the king, in the sixth month, in the first day of the month, came the word of the LORD by Haggai the prophet.", dref: "Haggai 1:1" },
    { id: "zechariah", name: "Zechariah", ref: "Zechariah 6:12", v: "Behold the man whose name is The BRANCH; and he shall grow up out of his place, and he shall build the temple of the LORD.",
      hint: "This prophet also wrote the verse on your postcard: his feet shall stand upon the mount of Olives.", at: [63, 44],
      date: "In the eighth month, in the second year of Darius, came the word of the LORD unto Zechariah.", dref: "Zechariah 1:1" },
    { id: "malachi", name: "Malachi", ref: "Malachi 3:1", v: "Behold, I will send my messenger, and he shall prepare the way before me: and the Lord, whom ye seek, shall suddenly come to his temple.",
      hint: "This is the last prophet of the Old Testament: he speaks of a messenger sent ahead.", at: [36, 70],
      date: "The burden of the word of the LORD to Israel by Malachi. (No year, no month: the last voice, after them all.)", dref: "Malachi 1:1" },
  ];
  function olivesSign() {
    cur = "sign"; M("olives", "olives");
    const s = stage('<div class="fkick">Act 4 · The Mount of Olives · a side path</div><h1>A sign in the ivy</h1>' +
      '<div class="fq">Halfway up the path from the Kidron tombs, before you can see the top, something catches your eye in the hedge. You could walk on. Or you could look.</div>' +
      '<div class="fviewwrap fphotoview" id="fsg"><img src="img/fsy/olives-sign.jpg" alt="A rusty sign in the ivy: Tombs of the Prophets"><button class="fhit" data-h="sign" aria-label="The rusty sign" style="left:10%;top:52%;width:70%;height:30%"></button><span class="fglint" style="left:45%;top:66%"></span></div>' +
      '<button class="fwtool" id="fwalkon">Walk on up the hill ›</button>' + back("The map"));
    wire(s, stops); $("fwalkon").onclick = () => { K.sfx("click"); Lamp.fsyWalk && Lamp.fsyWalk.go("olives"); };
    s.querySelector("[data-h=sign]").onclick = () => {
      S("door", "stone", 0.6);
      K.card('<div class="kick">The Tombs of the Prophets</div><h2>Down into the rock</h2>' + photo("tombs-plan.jpg", "A hand-drawn plan at the entrance: about fifty tombs, in two rings, around a central passage", "Photo: Richard J. Allinson, in the Tombs of the Prophets") +
        "<p>A little-known place on the Mount of Olives: a burial cave cut into the rock, with about fifty tombs. By an old tradition, three prophets lie here: <b>Haggai, Zechariah and Malachi</b>, the last prophets of the Old Testament, who preached to the people rebuilding the Temple.</p>" +
        "<p>It is dark below, and the steps are wet. <b>Carry your lamp along the passage</b> and look for the prophets’ tombs.</p>" +
        '<button class="cta" data-act="go">Go down the steps</button>', { go: tombs });
    };
    K.say("A rusty sign, half hidden in the hedge. Tap it.", "", 3200);
  }
  function tombs() {
    cur = "tombs"; M("puzzle", "chamber"); preS("parchment", "harp", "knock", "journal", "stone", "lock");
    const p = P(); p.prophets = p.prophets || {};
    const left = () => PROPHETS.filter((x) => !p.prophets[x.id]);
    const first = !p.tombIn; p.tombIn = 1; save();
    const s = stage('<div class="fkick">The Tombs of the Prophets · underground</div><h1>Carry your lamp</h1>' +
      '<div class="fq" id="ftq">' + (first ? "Fresh footprints in the dust run ahead of you. At the far end of the passage, a light moves… and goes out." : "Drag your finger across the rock. Prayer notes have been tucked into three of the niches.") + "</div>" +
      '<div class="fdarkwrap" id="fdk"><img draggable="false" src="img/fsy/tombs-passage.jpg" alt="A rock-cut passage with tomb niches">' +
      PROPHETS.map((x) => '<button class="fnote' + (p.prophets[x.id] ? " found" : "") + '" data-n="' + x.id + '" aria-label="A folded prayer note" style="left:' + x.at[0] + "%;top:" + x.at[1] + '%">' + (p.prophets[x.id] ? "✓" : "") + "</button>").join("") +
      (p.tombOil ? "" : '<button class="foil" id="foil" aria-label="A small clay flask" style="left:80%;top:20%"></button>') +
      '<button class="fpried" id="fpried" aria-label="A niche, pried open" style="left:16%;top:56%"></button>' +
      (first ? '<span class="fghost" style="left:66%;top:9%"></span>' : "") +
      '<div class="fdark" id="fdark"></div></div>' +
      '<div class="fsmall" id="ftc"></div><div id="fsealgo"></div>' + back("Up to the path"), "tombs-passage.jpg");
    wire(s, olivesSign);
    const wrap = $("fdk"), dark = $("fdark");
    const light = (e) => { const r = wrap.getBoundingClientRect(); dark.style.setProperty("--x", ((e.clientX - r.left) / r.width) * 100 + "%"); dark.style.setProperty("--y", ((e.clientY - r.top) / r.height) * 100 + "%"); };
    wrap.addEventListener("pointermove", light); wrap.addEventListener("pointerdown", light);
    /* the lamp is running dry: the light shrinks until the oil is found */
    let rad = p.tombOil ? 24 : 21; dark.style.setProperty("--rad", rad + "%");
    const tick = setInterval(() => {
      if (!document.body.contains(dark)) { clearInterval(tick); return; }
      if (p.tombOil) { rad = Math.min(24, rad + 1); dark.style.setProperty("--rad", rad + "%"); return; }
      if (rad > 9) { rad -= 0.25; dark.style.setProperty("--rad", rad + "%"); if (Math.abs(rad - 13) < 0.13) K.say("Your lamp is guttering. The oil is nearly gone.", "", 3200); }
    }, 1000);
    const count = () => {
      $("ftc").textContent = "Prophets’ tombs found: " + Object.keys(p.prophets).length + " of 3";
      if (!left().length && !$("fseal")) { $("fsealgo").innerHTML = '<button class="fbtn glow" id="fseal">Go into the central chamber</button>'; $("fseal").onclick = () => { K.sfx("stone"); seal(); }; }
    };
    count();
    const oil = $("foil"); if (oil) oil.onclick = () => {
      p.tombOil = 1; save(); S("parchment", "click"); oil.remove();
      K.card('<div class="kick">In a niche · a small clay flask</div><h2>Oil for the lamp</h2>' +
        "<p>Wedged into a niche, where no visitor would leave it, is a small clay flask of olive oil, stoppered with wax. Tied around its neck:</p>" +
        wnote("“Behold a candlestick all of gold… and two olive trees by it… Not by might, nor by power, but by my spirit, saith the LORD of hosts.”<small>Zechariah 4:2–3, 6</small>") +
        "<p>Zechariah’s own vision of the lampstand, fed by two olive trees, here in Zechariah’s tomb. You fill your lamp, and the light grows strong again.</p>" +
        '<button class="cta" data-act="x">Go on</button>', { x: () => {} });
      V("10c-oil");
    };
    $("fpried").onclick = () => {
      K.sfx("stone");
      if (!p.pried) { p.pried = 1; save(); S("knock", null, 0.6); }
      K.say("A niche has been pried open. The stone at its mouth is freshly scratched, and it is empty. Someone was here before you, and guessed wrong.", "", 5600);
    };
    s.querySelectorAll("[data-n]").forEach((b) => (b.onclick = () => {
      const x = PROPHETS.find((y) => y.id === b.dataset.n);
      if (p.prophets[x.id]) { dated(x); return; }
      S("parchment", "click"); match(x);
    }));
    function match(x) {
      const names = shuffle(left().map((y) => y.name).concat(PROPHETS.filter((y) => p.prophets[y.id]).map((y) => y.name)));
      K.card('<div class="kick">A prayer note in the niche</div><h2>Whose tomb is this?</h2>' + photo("w/tombs-niche-2.jpg", "Prayer notes left in a tomb niche", "Photo: Richard J. Allinson, in the Tombs of the Prophets") +
        '<div class="v">“' + esc(x.v) + "”</div><p>Among the prayers, one note in blue ink: a verse by the prophet who lies here. Which prophet wrote it?</p>" +
        '<div class="fpick">' + names.map((n) => '<button data-act="' + n + '"' + (PROPHETS.some((y) => y.name === n && p.prophets[y.id]) ? " disabled" : "") + ">" + n + "</button>").join("") + "</div>" +
        '<button class="cta alt" data-act="x">Put it back</button>',
        Object.assign({ x: () => {} }, Object.fromEntries(PROPHETS.map((y) => [y.name, () => answer(x, y)]))));
    }
    function dated(x) {
      K.card('<div class="kick">The tomb of ' + esc(x.name) + '</div><h2>On the back of the note</h2>' + photo("w/tombs-niche-3.jpg", "A burial niche cut into the rock", "Photo: Richard J. Allinson, in the Tombs of the Prophets") +
        wnote("“" + esc(x.date) + "”<small>" + esc(x.dref) + "</small>") +
        "<p>The front carries his word about the Temple (" + esc(x.ref) + "). The back carries the day he began to speak.</p>" +
        '<button class="cta" data-act="x">Back to the passage</button>', { x: () => {} });
    }
    function answer(x, y) {
      if (x.id !== y.id) { wrong(x.hint); setTimeout(() => K.root() && match(x), 900); return; }
      p.prophets[x.id] = 1; save(); S("harp", null, 0.7); K.buzz("success");
      const b = s.querySelector('[data-n="' + x.id + '"]'); if (b) { b.classList.add("found"); b.textContent = "✓"; }
      count(); dated(x);
    }
    if (first) { S("step", null, 0.5); V("10b-tombs"); setTimeout(() => K.root() && K.say("Someone is down here ahead of you. Drag your finger to carry the lamp.", "", 4200), 2600); }
    else if (!Object.keys(p.prophets).length) K.say("It is dark down here. Drag your finger to carry the lamp.", "", 3600);
  }
  /* the central chamber: a round stone seal with three rings */
  const RINGS = ["Haggai", "Zechariah", "Malachi"];
  function seal() {
    cur = "seal"; const p = P(); const rg = p.rings || [2, 0, 1];
    const ring = (i, rr) => '<g class="fring" data-r="' + i + '"><circle cx="150" cy="150" r="' + rr + '" class="fr' + i + '"/><text x="150" y="' + (150 - rr + 22) + '" text-anchor="middle" id="frt' + i + '">' + RINGS[rg[i]] + "</text></g>";
    const s = stage('<div class="fkick">The Tombs of the Prophets · the central chamber</div><h1>The stone seal</h1>' +
      '<div class="fq">In the middle of the round chamber, set into the floor, is a stone disc cut in three rings, each carved with a prophet’s name. Beside it, pressed into the dust, a note:</div>' +
      wnote("“Count as the prophets counted. The first, outermost.”") +
      '<div class="fsealwrap"><svg class="fsealsvg" viewBox="0 0 300 300">' + ring(0, 140) + ring(1, 100) + ring(2, 60) + '<circle cx="150" cy="150" r="22" class="fhub"/></svg></div>' +
      '<div class="fsmall">Tap a ring to turn it. The notes in the prophets’ tombs carry their dates.</div>' +
      '<button class="fbtn" id="fturn">Turn the seal</button>' + back("Back to the passage"), "tombs-passage.jpg");
    wire(s, tombs);
    s.querySelectorAll("[data-r]").forEach((g) => (g.onclick = (e) => {
      e.stopPropagation(); const i = +g.dataset.r; rg[i] = (rg[i] + 1) % 3; p.rings = rg.slice(); save(); S("stone", "click", 0.45); $("frt" + i).textContent = RINGS[rg[i]];
    }));
    let tries = 0;
    $("fturn").onclick = () => {
      if (rg.join() !== "0,1,2") { tries++; wrong(tries < 2 ? "The seal will not turn. Read the dates on the backs of the notes." : "Haggai spoke in the sixth month, Zechariah in the eighth, and Malachi last of all. Outermost first."); return; }
      S("stone", "stone", 0.8); setTimeout(() => S("lock", null, 0.7), 500); K.buzz("success");
      p.flax = 1; p.tombs = 1; save();
      setTimeout(() => {
        if (!K.root()) return; S("journal");
        K.card('<div class="kick">The seal turns · Ezekiel 40:3</div><h2>A line of flax</h2>' +
          "<p>Stone grinds on stone, and the disc sinks a hand’s breadth into the floor. In the hollow beneath lies a coiled cord of flax, knotted along its length: <b>a knot for every cubit</b>.</p>" +
          '<div class="v">“There was a man, whose appearance was like the appearance of brass, with a line of flax in his hand, and a measuring reed; and he stood in the gate.”</div><div class="r">Ezekiel 40:3 · KJV</div>' +
          "<p>A measuring line for the Temple. Whoever pried open the niche in the passage did not know the order, and missed it. Wound around the cord is one more note:</p>" +
          wnote("“He is looking too. Go quickly.”") +
          '<button class="cta" data-act="x">Climb back up to the light</button>', { x: afterTombs });
        V("10d-flax");
      }, 1300);
    };
    function afterTombs() {
      K.card('<div class="kick">Out into the light</div><h2>“They face the Temple Mount”</h2>' + photo("w/tombs-light.jpg", "The stairs up out of the tombs, into the daylight", "Photo: Richard J. Allinson, in the Tombs of the Prophets") +
        "<p>The prophets’ tombs, and their followers’ around them, were cut to face the Temple Mount. <b>So should you.</b> You climb out into the evening, the line of flax in your pocket.</p>" +
        '<button class="cta" data-act="x">On up to the top</button>', { x: () => walkDone("prophets") });
    }
  }
  function olives() {
    cur = "olives"; const p = P(); M("olives", "olives");
    const s = stage('<div class="fkick">Act 4 · The top of the Mount of Olives</div><h1>The Mount of Olives</h1>' +
      '<div class="fverse">“And his feet shall stand in that day upon the mount of Olives, which is before Jerusalem on the east.”<small>Zechariah 14:4</small></div>' +
      '<div class="fq">The whole city lies across the valley. You came up past the tombs; the gate the police were guarding is somewhere in that wall. Find the sealed gate and tap it.</div>' +
      '<div class="fviewwrap fphotoview" id="fv"><img src="img/fsy/olives-view.jpg" alt="Sunset over Jerusalem from the Mount of Olives: the Kidron Valley, the eastern wall and the Dome of the Rock">' +
      '<button class="fhit" data-h="sky" aria-label="The city skyline" style="left:0;top:0;width:100%;height:22%"></button>' +
      '<button class="fhit" data-h="dome" aria-label="The golden dome" style="left:37%;top:26%;width:13%;height:20%"></button>' +
      '<button class="fhit" data-h="gate" aria-label="The sealed gate in the wall" style="left:45%;top:56%;width:12%;height:13%"></button>' +
      '<button class="fhit" data-h="wall" aria-label="The city wall" style="left:0;top:56%;width:45%;height:13%"></button>' +
      '<button class="fhit" data-h="valley" aria-label="The Kidron Valley" style="left:0;top:70%;width:100%;height:30%"></button></div>' +
      '<div class="fsmall">Tap the sealed gate in the wall.</div>' + back("The map"));
    wire(s, stops); V("10-olives");
    s.querySelectorAll("[data-h]").forEach((b) => (b.onclick = () => {
      const h = b.dataset.h;
      if (h === "dome") { K.say("The Dome of the Rock, the golden dome. Not a gate. Look lower, in the wall below it.", "", 3600); return; }
      if (h === "sky") { K.say("The new city, and the sun going down behind it. The gate is nearer: in the old wall.", "", 3600); return; }
      if (h === "wall") { K.say("The eastern wall of the Temple Mount. Follow it along to the right, below the golden dome: one block stands out from it.", "", 4200); return; }
      if (h === "valley") { K.say("The Kidron Valley: the tombs you passed, olive trees and old graves. Look across it to the wall.", "", 4600); return; }
      S("stone", "stone", 0.6); const mk = document.createElement("span"); mk.className = "fmark"; mk.style.cssText = "left:45%;top:56%;width:12%;height:13%"; $("fv").appendChild(mk);
      setTimeout(() => {
        if (!K.root()) return;
        p.olives = 1; save(); S("journal"); setTimeout(() => S("harp", null, 0.6), 300); K.buzz("success"); V("11-olives-gate");
        K.card('<div class="kick">Stop 2 · The Mount of Olives</div><h2>The sealed gate</h2>' + photo("olives-view.jpg", "Sunset over the city from the Mount of Olives: the sealed gate is in the wall below the golden dome", "Photo: Richard J. Allinson, from the Mount of Olives") +
          "<p>Straight across the valley, in the city wall, is the <b>Eastern Gate</b>: the only gate into the Temple Mount from the east, and it is sealed with stone. Jesus will return to this mountain, and the gate faces him.</p>" +
          photo("w/olives-cemetery.jpg", "In daylight from the Mount of Olives: the graves running down the slope, the eastern wall, the golden dome, and the city beyond", "Photo: Richard J. Allinson, on the Mount of Olives") +
          "<p><b>What it shows.</b> The Temple faced this gate, and the gate faces this mountain. From the sanctuary, through the gate, to the Mount of Olives: one straight line. Hold that line in your mind. It is about to matter.</p>" +
          '<p class="fgo">Down the hill, at the foot of the mountain, is a garden. The last page is there.</p><button class="cta" data-act="x">Down to Gethsemane</button>', { x: () => walkDone("olives") });
      }, 900);
    }));
  }

  /* ================================================================ 3. the Temple Mount ================================================================ */
  function chapter() {
    cur = "";
    const p = P();
    if (p.done) return board(true);
    if (!p.theory) return opening();
    board();
  }
  /* at the foot of the Mount, before going up: the stones the Romans threw down (Matthew 24:2) */
  const STONES = { text: ["Verily I say unto you, There shall not be left here one ", "STONE", " upon ", "ANOTHER", ", that shall not be ", "THROWN", " down."], chips: ["STONE", "TEMPLE", "ANOTHER", "ALTAR", "THROWN", "RAISED"] };
  function robinson() {
    cur = "robinson"; M("m24", "platform"); const p = P(); let at = 1;
    const s = stage('<div class="fkick">Act 3 · Below the southwest corner</div><h1>The stones of the Temple</h1>' +
      photo("robinson-stones.jpg", "Beneath Robinson’s Arch: great stones from the Temple Mount, lying where they fell on the street below", "Photo: Richard J. Allinson, at the southwest corner of the Temple Mount") +
      '<div class="fverse">“And Jesus went out, and departed from the temple: and his disciples came to him for to shew him the buildings of the temple. And Jesus said unto them, See ye not all these things?”<small>Matthew 24:1–2</small></div>' +
      '<div class="fq">What did Jesus say would happen to the Temple? Fill in his words.</div>' +
      '<div class="fscroll" id="fscroll"></div>' +
      '<div class="fchips six" id="fchips">' + shuffle(STONES.chips).map((w) => '<button data-w="' + w + '"><b>' + w + "</b></button>").join("") + "</div>" + back("Back to the steps"), "robinson-stones.jpg");
    wire(s, () => Lamp.fsyWalk && Lamp.fsyWalk.go("steps"));
    const draw = () => { $("fscroll").innerHTML = STONES.text.map((t, i) => i % 2 ? '<b class="' + (i < at ? "got" : i === at ? "gap now" : "gap") + '">' + (i < at ? t : "_".repeat(t.length)) + "</b>" : esc(t)).join("") + "<small>Matthew 24:2</small>"; };
    draw();
    s.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => {
      const w = b.dataset.w;
      if (w !== STONES.text[at]) { b.classList.add("bad"); setTimeout(() => b.classList.remove("bad"), 400); wrong(w === "RAISED" ? "The opposite: look at the stones lying in the street." : w === "TEMPLE" || w === "ALTAR" ? "Smaller than that: the very pieces it was built from." : "That word fits another gap. Fill the gaps in order."); return; }
      S("stone", "stone", 0.6); b.classList.add("used"); at += 2; draw();
      if (at < STONES.text.length) return;
      setTimeout(() => {
        if (!K.root()) return;
        p.robinson = 1; save(); S("journal"); setTimeout(() => S("harp", null, 0.6), 300); K.buzz("success");
        K.card('<div class="kick">Clue found · Matthew 24:2</div><h2>Not one stone upon another</h2>' + photo("robinson-stones.jpg", "The stones still lie where they fell, nearly two thousand years later") +
          "<p>In AD 70 the Roman legions destroyed the Temple and threw its stones down from the Mount onto this street, just as Jesus said forty years before. Some are the size of a car. You can still see where they cracked the paving when they landed.</p>" +
          "<p><b>The Temple Jesus spoke of is gone.</b> The Bible says another will stand. But where? Everything for it is ready, a few streets away, at the Temple Institute. Everything but the place.</p>" +
          '<button class="cta" data-act="x">To the Temple Institute</button>', { x: () => walkDone("steps") });
      }, 700);
    }));
  }
  function opening() {
    M("m24", "platform");
    const s = stage('<div class="fkick">Act 5 · The Temple Mount</div><h1>Where Was the Temple?</h1>' +
      '<div class="fnarr">“The Bible says the Temple will stand where the first Temple stood. <b>But where was that?</b> For thirteen centuries the world has assumed it knew. Look at the evidence, and decide for yourself.”<small>The Lamplighter</small></div>' +
      photo("tm-dome-rock.jpg", "The Dome of the Rock. Most people believe the Temple stood here.") +
      '<div class="fq">Before you look at the clues: where do you think the Holy of Holies stood?</div>' +
      '<div class="fchoices"><button data-t="rock">Under the golden Dome of the Rock</button><button data-t="spirits">On the small northern rise</button><button data-t="unsure">I don’t know yet</button></div>');
    V("12-mount-open", () => V("13-theory"));
    s.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => {
      P().theory = b.dataset.t; save(); K.sfx("click");
      K.say(b.dataset.t === "rock" ? "Most people think so. Hold on to that thought, and test it." : b.dataset.t === "spirits" ? "An unusual answer. Let's see if the evidence agrees." : "A good place to start: let the evidence decide.", "", 3600);
      setTimeout(() => K.root() && board(), 500);
    }));
  }

  function board(finished) {
    cur = ""; M("m24", "platform");
    const p = P(), found = CLUES.filter((c) => p.clues[c.id]).length;
    const s = stage('<div class="fkick">Where Was the Temple? · Clues ' + found + " of 5</div>" +
      '<div class="fmapwrap">' + mapSVG({ measure: finished }) + "</div>" +
      '<div class="fjournal">' + CLUES.map((c, i) => '<button class="fclue fthumb' + (p.clues[c.id] ? " done" : "") + '" data-c="' + i + '"><img src="img/fsy/' + c.scene[0] + '" alt=""><i>' + (p.clues[c.id] ? "✓" : i + 1) + "</i><span><b>" + esc(c.title) + "</b><small>" + esc(c.ref) + "</small></span></button>").join("") + "</div>" +
      (finished ? '<button class="fbtn" id="fend">' + (p.gateDone ? "What comes next" : p.waqf ? "On to the Eastern Gate" : "The Temple Mount today") + "</button>" : found === 5 ? '<button class="fbtn glow" id="fplace">Place the Holy of Holies</button>' : '<div class="fsmall">Open a clue. Each one is a piece of evidence.</div>') +
      back("The map"));
    wire(s, stops);
    s.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => {
      const c = CLUES[+b.dataset.c]; K.sfx("click");
      if (p.clues[c.id]) { K.card('<div class="kick">Clue · ' + esc(c.ref) + "</div><h2>" + esc(c.title) + '</h2><div class="v">“' + esc(c.v) + '”</div>' + (c.photo ? photo(c.photo[0], c.photo[1]) : "") + '<p><b>What it shows.</b> ' + esc(c.learned) + "</p>" + (c.note ? '<p class="fnote">' + esc(c.note) + "</p>" : "") + '<button class="cta" data-act="x">Back to the journal</button>', { x: () => {} }); return; }
      c.run(c);
    }));
    const pl = $("fplace"); if (pl) pl.onclick = place;
    const en = $("fend"); if (en) en.onclick = () => (p.gateDone ? ending() : p.waqf ? walkDone("mount") : today());
    if (!finished && found === 0) { K.say("Five clues are hidden in Scripture and history. Gather them, then decide.", "", 4200); V("14-journal"); }
  }
  function solved(c) {
    P().clues[c.id] = 1; save(); S("journal"); setTimeout(() => S("harp", null, 0.6), 300); K.buzz("success");
    K.card('<div class="kick">Clue found · ' + esc(c.ref) + "</div><h2>" + esc(c.title) + '</h2><div class="v">“' + esc(c.v) + '”</div>' + (c.photo ? photo(c.photo[0], c.photo[1]) : "") + '<p><b>What it shows.</b> ' + esc(c.learned) + "</p>" + (c.note ? '<p class="fnote">' + esc(c.note) + "</p>" : "") +
      '<p class="fgo">Go deeper: <i>' + BOOK + "</i>, chapter 3.</p>" + '<button class="cta" data-act="x">Add to the journal</button>',
      { x: () => board() });
  }
  function clueScreen(c, html) {
    M("puzzle", "platform"); preS("journal", "harp", "knock", "stone", "rod", "step");
    const s = stage('<div class="fkick">Clue · ' + esc(c.ref) + "</div><h1>" + esc(c.title) + "</h1>" + photo(c.scene[0], c.scene[1]) + '<div class="fverse">“' + esc(c.v) + "”</div>" + html +
      '<button class="fback" id="fback">‹ Journal</button>');
    $("fback").onclick = () => { K.sfx("click"); board(); };
    V({ floor: "15-floor", summit: "16-summit", line: "17-line", cubits: "18-cubits", middle: "19-middle" }[c.id]);
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
    const s = clueScreen(c, '<div class="fq">You are standing at the Dome of the Spirits, looking east. Slide the sighting rod along the wall until it stands on the Eastern Gate’s dome.</div>' +
      '<div class="fsight" id="fsight"><img draggable="false" src="img/fsy/tm-line.jpg" alt="From the Dome of the Spirits looking east to the Eastern Gate"><span class="frod" id="frod"></span></div>' +
      '<div class="fmapwrap small" id="fm" style="display:none">' + mapSVG({}) + "</div>");
    s.querySelector(".fphoto").remove();
    const sight = $("fsight"), rod = $("frod"); let rx = 0.15, done = false;
    const place = (cx) => { const r = sight.getBoundingClientRect(); rx = Math.max(0.03, Math.min(0.97, (cx - r.left) / r.width)); rod.style.left = rx * 100 + "%"; };
    rod.style.left = rx * 100 + "%";
    const up = () => {
      if (done) return;
      if (Math.abs(rx - 0.455) < 0.06) {
        done = true; rod.style.left = "45.5%"; rod.classList.add("on"); S("stone", "stone", 0.55);
        K.say("The gate’s dome, and the Mount of Olives rising straight behind it. You are standing on the line.", "", 4200);
        setTimeout(() => { if (!K.root()) return; sight.insertAdjacentHTML("afterend", '<div class="fq">Now see it from above. Tap the Eastern Gate on the map and look straight west.</div>'); $("fm").style.display = ""; mapWire(); $("fm").scrollIntoView({ behavior: "smooth", block: "end" }); }, 1600);
      } else K.say(rx < 0.455 ? "Further right, toward the small dome in the wall." : "Back a little to the left.", "", 1800);
    };
    let drag = false;
    sight.addEventListener("pointerdown", (e) => { drag = true; sight.setPointerCapture(e.pointerId); place(e.clientX); });
    sight.addEventListener("pointermove", (e) => { if (drag && !done) place(e.clientX); });
    sight.addEventListener("pointerup", () => { if (drag) { drag = false; up(); } });
    sight.addEventListener("pointercancel", () => { if (drag) { drag = false; up(); } });
    function mapWire() {
    const go = () => {
      $("fm").innerHTML = mapSVG({ line: true }); S("stone", "stone", 0.55);
      setTimeout(() => {
        const q = document.createElement("div"); q.innerHTML = '<div class="fq">Which building does the line cross?</div><div class="fchoices"><button data-a="0">The Dome of the Rock</button><button data-a="1">The Dome of the Spirits</button></div>';
        s.insertBefore(q, $("fback"));
        q.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => { if (b.dataset.a !== "1") { wrong("Follow the line with your finger. Where does it go?"); return; } solved(c); }));
      }, 900);
    };
    s.querySelector(".gatemk").addEventListener("click", go, { once: true });
    const hit = document.createElement("button"); hit.className = "fgatehit"; hit.setAttribute("aria-label", "The Eastern Gate"); hit.onclick = go; $("fm").appendChild(hit);
    }
  }
  /* 4. pace out the cubits from the gate */
  function clueCubits(c) {
    let v = 0;
    const s = clueScreen(c, '<div class="fq">' + (P().flax ? "Take out the line of flax from the tomb: a knot for every cubit. " : "Take out the measuring line from your satchel. ") + "You walked these courts at the Institute: the Court of the Women, 135 cubits, then the courts of Israel and the priests, the altar and the steps, another 52. Pay out the line from the Eastern Gate.</div>" +
      '<div class="fmapwrap small" id="fm">' + mapSVG({ pace: 0 }) + '</div><div class="fpace"><button id="fminus">−</button><b id="fval">0 cubits</b><button id="fplus">+</button></div><button class="fbtn" id="fstop">Stop here</button>');
    const draw = () => { $("fm").innerHTML = mapSVG({ pace: v }); $("fval").textContent = v + " cubits"; };
    $("fplus").onclick = () => { v = Math.min(300, v + 11); if (v > 180 && v < 194) v = 187; S("rod", "click", 0.7); draw(); };
    $("fminus").onclick = () => { v = Math.max(0, v - 11); if (v > 180 && v < 194) v = 187; S("rod", "click", 0.7); draw(); };
    $("fstop").onclick = () => {
      if (v !== 187) { wrong(v < 187 ? "Not far enough. Add the two parts together: 135 and 52." : "Too far. 135 and 52 make the whole distance."); return; }
      S("step", "stone"); K.say("187 cubits from the gate, and you stand on the flat northern bedrock.", "", 3600); setTimeout(() => K.root() && solved(c), 1400);
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
  /* the Temple plan you built at the Institute, to scale (0.6417 map units to the cubit): its gate at (0,0), facing east */
  const CU = 0.6417, PLAN = { women: 135 * CU, inner: 52 * CU, hoh: 20 * CU };
  function planSVG() {
    const w = PLAN.women, i = PLAN.inner, h = PLAN.hoh;
    return '<g id="fplan" class="fplan">' +
      '<rect class="pw" x="' + -w + '" y="' + -w / 2 + '" width="' + w + '" height="' + w + '"/>' +
      '<rect class="pi" x="' + -(w + i) + '" y="' + -w / 3 + '" width="' + i + '" height="' + (w * 2) / 3 + '"/>' +
      '<rect class="pa" x="' + -(w + i * 0.55) + '" y="-6" width="11" height="12"/>' +
      '<rect class="ph" x="' + -(w + i + h) + '" y="' + -h / 2 + '" width="' + h + '" height="' + h + '"/>' +
      '<rect class="pg" x="-3" y="-9" width="5" height="18"/>' +
      '<text x="' + -w / 2 + '" y="4" text-anchor="middle">WOMEN’S COURT</text><text x="' + -(w + i + h / 2) + '" y="' + (-h / 2 - 3) + '" text-anchor="middle">HOLY OF HOLIES</text></g>';
  }
  const PT = (x, y, r) => { const a = (r * Math.PI) / 180; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]; };
  function place() {
    M("m24", "platform"); cur = "verdict";
    const s = stage('<div class="fkick">The verdict</div><h1>Lay the Temple on the Mount</h1><div class="fq">You built the Temple plan at the Institute, court by court. Now drag it onto the Mount, and turn it, until everything fits.</div>' +
      '<div class="fmapwrap" id="fm">' + mapSVG({ extra: planSVG() }) + "</div>" +
      '<div class="fplanbar"><button id="frot">⟳ Turn the plan</button><button class="fbtn" id="fset">Set it here</button></div>' +
      '<button class="fback" id="fback">‹ Journal</button>');
    $("fback").onclick = () => board();
    const svg = $("fm").querySelector("svg"), g = $("fplan");
    let tx = 120, ty = 330, r = 180, drag = null;
    const draw = () => g.setAttribute("transform", "translate(" + tx + " " + ty + ") rotate(" + r + ")");
    draw();
    const pt = (e) => { const q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(svg.getScreenCTM().inverse()); };
    g.addEventListener("pointerdown", (e) => { const q = pt(e); drag = [q.x - tx, q.y - ty]; g.setPointerCapture(e.pointerId); g.classList.add("drag"); });
    g.addEventListener("pointermove", (e) => { if (!drag) return; const q = pt(e); tx = q.x - drag[0]; ty = q.y - drag[1]; draw(); });
    g.addEventListener("pointerup", () => { drag = null; g.classList.remove("drag"); S("step", "click", 0.4); });
    $("frot").onclick = () => { r = (r + 90) % 360; S("stone", "click", 0.4); draw(); };
    $("fset").onclick = () => {
      const hohL = -(PLAN.women + PLAN.inner + PLAN.hoh / 2), hp = PT(hohL, 0, r), hoh = [tx + hp[0], ty + hp[1]];
      const corners = [[0, -PLAN.women / 2], [0, PLAN.women / 2], [-(PLAN.women + PLAN.inner + PLAN.hoh), -PLAN.women / 2], [-(PLAN.women + PLAN.inner + PLAN.hoh), PLAN.women / 2]].map((c) => { const q = PT(c[0], c[1], r); return [tx + q[0], ty + q[1]]; });
      const off = corners.some((c) => c[0] < 44 || c[0] > 268 || c[1] < 30 || c[1] > 412);
      const near = (a, b, d) => Math.hypot(a[0] - b[0], a[1] - b[1]) < d;
      if (r !== 0) { wrong("The Temple faced east: turn the plan until its gate looks toward the Eastern Gate and the Mount of Olives."); return; }
      if (near([tx, ty], SPOT.gate, 20) && near(hoh, SPOT.spirits, 20)) { tx = SPOT.gate[0]; ty = SPOT.gate[1]; draw(); g.classList.add("fit"); S("lock", null, 0.7); setTimeout(() => K.root() && makeCase(), 1600); return; }
      if (off) { wrong("Part of the Temple hangs off the edge of the Mount. Move it back onto the platform."); return; }
      if (near(hoh, SPOT.rock, 26)) { wrong("Here the Holy of Holies sits on the jagged rock, and the Temple’s gate stands far from the Eastern Gate. The courts would cover the middle Solomon kept open."); return; }
      if (!near([tx, ty], SPOT.gate, 26)) { wrong("The Temple’s gate must open onto the Eastern Gate: the line from the Mount of Olives runs straight through both."); return; }
      wrong("Close. Slide it along the line until the Holy of Holies rests on flat bedrock.");
    };
    K.say("Drag the plan onto the Mount, and turn it to face east.", "", 3600); V("20-verdict");
  }
  /* before the reveal: answer a sceptic with the three strongest pieces of evidence */
  const CASEV = [
    ["floor", "The Temple was built on a threshing floor, and only the northern bedrock is flat (2 Chronicles 3:1)", 1],
    ["shade", "It is a quiet, shady corner of the Mount", 0],
    ["summit", "Josephus says the Temple stood on the very top of the mountain: the northern rise", 1],
    ["line", "The line west from the Eastern Gate runs to the Dome of the Spirits", 1],
    ["small", "The little dome over it looks old and simple", 0],
    ["cubits", "The Mishnah’s 187 cubits from the Eastern Gate end at the northern bedrock", 1],
    ["middle", "The Dome of the Rock stands in the middle of the court Solomon kept open (2 Chronicles 7:7)", 1],
    ["crowd", "Fewer tourists go there", 0],
  ];
  function makeCase() {
    cur = "case"; const p = P(); let chosen = [];
    const s = stage('<div class="fkick">The verdict · make your case</div><h1>“Convince me”</h1>' +
      '<div class="fq">You look up from the map. The man in the grey coat is standing a few paces away. He has been watching you.</div>' +
      '<div class="fhim">“So you say the Temple stood up here, at that little dome? Most people would point at the golden one. Give me your three best reasons.”<small>The man in the grey coat</small></div>' +
      '<div class="fq">Choose the three strongest pieces of evidence from your journal.</div>' +
      '<div class="fjournal" id="fcase">' + shuffle(CASEV).map((c) => '<button class="fclue" data-e="' + c[0] + '"><i></i><span><b>' + esc(c[1]) + "</b></span></button>").join("") + "</div>" +
      '<button class="fbtn" id="fargue">Make the case</button>' + '<button class="fback" id="fback">‹ Back to the map</button>');
    $("fback").onclick = place; V("grey-1");
    s.querySelectorAll("[data-e]").forEach((b) => (b.onclick = () => {
      const k = b.dataset.e; K.sfx("click");
      if (chosen.includes(k)) chosen = chosen.filter((x) => x !== k); else { if (chosen.length >= 3) chosen.shift(); chosen.push(k); }
      s.querySelectorAll("[data-e]").forEach((e) => { const on = chosen.includes(e.dataset.e); e.classList.toggle("done", on); e.querySelector("i").textContent = on ? "✓" : ""; });
    }));
    $("fargue").onclick = () => {
      if (chosen.length < 3) { K.say("Choose three.", "", 1800); return; }
      const weak = chosen.filter((k) => !CASEV.find((c) => c[0] === k)[2]);
      if (weak.length) { wrong("“" + (weak[0] === "shade" ? "Shade? That’s a feeling, not evidence." : weak[0] === "small" ? "Old and simple? So is half of Jerusalem." : "Fewer tourists? That proves nothing.") + " Try again.”"); return; }
      p.case = chosen.slice(); save(); S("journal");
      const d = document.createElement("div"); d.innerHTML = '<div class="fhim">' + "He walks over to the Dome of the Spirits, looks east to the gate, and is quiet for a while. Then he smiles. “Thank you. That’s all I needed.”<small>The man in the grey coat</small></div>" +
        '<p class="fq">He turns and walks quickly toward the Mughrabi Gate, and does not look back. You have just told him where it is.</p>';
      s.insertBefore(d, $("fargue")); $("fargue").remove(); d.scrollIntoView({ behavior: "smooth", block: "end" }); V("grey-2"); S("step", null, 0.5);
      setTimeout(() => K.root() && reveal(), 5200);
    };
  }
  function reveal() {
    const p = P(), first = !p.done;
    p.done = 1; save(); S("shofar", "stone"); K.buzz("success");
    const ev = (p.case || []).map((k) => (CASEV.find((c) => c[0] === k) || [])[1]).filter(Boolean);
    const was = '<div class="fjrnl"><b>From your journal</b>' + (p.theory === "rock" ? "<p>You came thinking the Temple stood under the golden Dome of the Rock, as most people do.</p>" : p.theory === "spirits" ? "<p>You came already suspecting the northern rise.</p>" : "<p>You came with an open mind.</p>") +
      (ev.length ? "<p>What made the case:</p><ul>" + ev.map((e) => "<li>" + esc(e) + "</li>").join("") + "</ul>" : "") + "</div>";
    const s = stage('<div class="fkick">Revealed</div><h1>The northern summit</h1><div class="fmapwrap" id="fm">' + mapSVG({ measure: true }) + "</div>" +
      '<div class="fverse">“Rise, and measure the temple of God, and the altar, and them that worship therein. But the court which is without the temple leave out, and measure it not; for it is given unto the Gentiles.”<small>Revelation 11:1–2</small></div>' + photo("dome-spirits.jpg", "The Dome of the Spirits, on the northern summit: where the Holy of Holies stood"));
    void s;
    V("21-reveal"); M("m25", "platform");
    K.say("Measure the temple and the altar. Leave out the outer court. The Dome of the Rock stays where it is, in the court given to the Gentiles.", "Revelation 11:2", 7000);
    setTimeout(() => {
      if (!K.root()) return;
      if (first) { K.A().relics.reed = 1; save(); }
      const stats = { misses: st.misses, hints: st.hints, secs: (Date.now() - st.t0) / 1000 };
      let oil = 0; if (first && !stats.hints && stats.misses <= 1) { oil = 2; Lamp.state.oil += 2; save(); }
      K.card('<div class="kick">The Temple Mount solved · Relic found</div><div class="freed">' + REED_SVG + "</div><h2>The Measuring Reed</h2>" +
        '<div class="v">“And there was given me a reed like unto a rod.”</div><div class="r">Revelation 11:1 · KJV</div>' + was +
        '<div class="fview"><b>The author’s view.</b> Scripture, Josephus, the Mishnah and the bedrock agree: the Holy of Holies stood on the northern summit, beneath today’s Dome of the Spirits. A Third Temple can be rebuilt there without touching the Dome of the Rock, exactly as Revelation 11 describes.<small>From <i>' + BOOK + "</i> by Richard J. Allinson, chapter 3</small></div>" +
        '<div class="fview"><b>From the author.</b> I first read that the Holy of Holies stood at the Dome of the Spirits in Grant R. Jeffrey’s <i>Armageddon: Appointment with Destiny</i>. I spent years investigating it afterwards. I walked the Temple Mount many times, on my own and with my wife, and once with a guide, to confirm that the floor inside the Dome of the Spirits is bedrock, not paving stone laid by Herod. What you have just seen is where that investigation led.<small>Richard J. Allinson</small></div>' + photo("dome-spirits.jpg", "The Dome of the Spirits today") +
        (oil ? '<div class="rewards"><div>' + Lamp.ICON.oil + " <b>Sharp investigator</b> · +2 oil</div></div>" : "") +
        '<p><b>And now the man in the grey coat knows it too.</b></p>' +
        '<button class="cta" data-act="next">The Temple Mount today</button>', { next: today });
    }, 4200);
  }

  function today() {
    K.card('<div class="kick">The Temple Mount today</div><h2>The visitors</h2>' + photo("tm-visitors.jpg", "Jewish visitors on the Temple Mount, keeping to the edge of the platform") +
      '<p>Jewish visitors may come up only by the Mughrabi bridge, in groups, at set times, and may not pray aloud. Many keep to the edges of the platform, so as not to walk where the Holy of Holies once stood: and most of them think that place is under the golden dome.</p>' +
      photo("tm-spirits.jpg", "The Dome of the Spirits, on the flat bedrock of the northern summit") +
      '<p>You walk back to the small dome on the northern rise and stand on the bedrock, in line with the gate. Footsteps behind you on the stone.</p>' +
      '<button class="cta" data-act="x">Turn round</button>', { x: waqf });
  }
  /* the Waqf: what happened to Richard at the Dome of the Spirits (an official of the Jordanian Waqf, which administers the Mount) */
  function waqf() {
    const p = P(); p.waqf = 1; save();
    Lamp.score && Lamp.score.set(null, "fsy-amb-platform");
    const s = stage('<div class="fkick">The Temple Mount · a moment later</div><h1>“What are you doing up here?”</h1>' +
      photo("tm-south.jpg", "Looking south from the Dome of the Spirits. Someone is walking over.", "Photo: Richard J. Allinson, on the Temple Mount") +
      '<div class="fnarr" id="fwq"><i>Footsteps on the stone. A man in a dark jacket. As soon as I see him, I know who he is: an official of the Waqf, which keeps the Mount.</i></div>' +
      '<div id="fwa"></div>', "tm-south.jpg");
    const line = (html) => { const d = document.createElement("div"); d.className = "fwline"; d.innerHTML = html; $("fwa").appendChild(d); d.scrollIntoView({ behavior: "smooth", block: "end" }); return d; };
    const choices = (opts, then) => {
      const d = line('<div class="fchoices">' + opts.map((o, i) => '<button data-o="' + i + '">' + esc(o[0]) + "</button>").join("") + "</div>");
      d.querySelectorAll("[data-o]").forEach((b) => (b.onclick = () => { K.sfx("click"); const o = opts[+b.dataset.o]; d.innerHTML = '<div class="fme">“' + esc(o[0]) + "”</div>"; then(o[1]); }));
    };
    setTimeout(() => {
      if (!K.root()) return;
      S("step", "stone", 0.6); setTimeout(() => S("step", "stone", 0.6), 500);
      setTimeout(() => {
        if (!K.root()) return;
        line('<div class="fhim">“What are you doing up here? You know, this area is not for tourists right now.”<small>The official</small></div>');
        V("waqf-1", () => {
          choices([["I’m filming for friends.", 1], ["I’m looking for the Temple.", 0], ["Just taking pictures of the view.", 1]], (ok) => {
            if (!ok) { line('<div class="fhim">“The Temple?” <i>His face hardens.</i></div>'); }
            choices([["Could I get a selfie with you?", 1], ["Thank you anyway. I’ll go.", 2]], (k) => {
              if (k === 1) { line('<div class="fhim">“No, no. No photo. Please, you must respect the rules. It’s for your own safety, my friend. We don’t want any trouble, do we? Just head back down. It’s much better.”<small>The official</small></div>'); V("waqf-2", () => choices([["Thanks anyway.", 2]], done)); }
              else done();
            });
          });
        });
      }, 1300);
    }, 600);
    function done() {
      line('<p class="fq">I thanked him, and quickly left the Temple Mount.</p>' +
        '<div class="fview"><b>From the author.</b> That was the end of my time on the Mount that day. I had just finished at the Dome of the Spirits when he came over.<small>Richard J. Allinson, Jerusalem</small></div>' +
        '<button class="fbtn glow" id="fwgo">One place remains: the Eastern Gate</button>');
      $("fwgo").onclick = () => { K.sfx("click"); walkDone("mount"); };
    }
  }

  /* ================================================================ 4. the Eastern Gate, from inside ================================================================ */
  const GATE = { text: ["Then said the LORD unto me; This gate shall be ", "SHUT", ", it shall not be opened, and no man shall enter in by it; because the LORD, the God of Israel, hath ", "ENTERED", " in by it, therefore it shall be shut. It is for the ", "PRINCE", "; the prince, he shall sit in it to eat bread before the LORD."],
    chips: ["SHUT", "OPENED", "ENTERED", "DEPARTED", "PRINCE", "PRIEST"] };
  function gate() {
    cur = "gate"; M("gate", "chamber"); const p = P(); let at = 1;
    const s = stage('<div class="fkick">Act 5 · Inside the Temple Mount</div><h1>The Eastern Gate</h1>' +
      photo("tm-gate-wide.jpg", "The Eastern Gate, from inside the Temple Mount: the stairs down to the sealed arches", "Photo: Richard J. Allinson, inside the Temple Mount") +
      '<div class="fnarr">“You have walked the whole city, stood on the mountain, and found the place. One gate is left: the one the police were guarding, from the other side. Ezekiel saw it shut, and wrote down why. <b>Fill in his words.</b>”<small>The Lamplighter</small></div>' +
      '<div class="fscroll" id="fscroll"></div>' +
      '<div class="fchips six" id="fchips">' + shuffle(GATE.chips).map((w) => '<button data-w="' + w + '"><b>' + w + "</b></button>").join("") + "</div>" + back("The map"), "gate-inside.jpg");
    wire(s, stops);
    const note = (then) => {
      if (p.gateNote) { then(); return; }
      p.gateNote = 1; save(); S("parchment");
      K.card('<div class="kick">Tucked into a crack in the stairs</div><h2>The Watchman’s last note</h2>' +
        "<p>Halfway down the steps, pushed into a crack between two stones, is a folded paper. Blue ink. A small drawn lamp.</p>" +
        wnote("“You found the place. Now so has he. Those he serves will put it on the table. Read Daniel 9:27.”") +
        "<p>Whoever the Watchman is, he knew the grey coat would follow you. And he knew you would come here last.</p>" +
        '<button class="cta" data-act="x">Fill in Ezekiel’s words</button>', { x: then });
      V("22b-watchman");
    };
    note(() => V("22-gate-open"));
    const drawScroll = () => { $("fscroll").innerHTML = GATE.text.map((t, i) => i % 2 ? '<b class="' + (i < at ? "got" : i === at ? "gap now" : "gap") + '">' + (i < at ? t : "_".repeat(t.length)) + "</b>" : esc(t)).join("") + "<small>Ezekiel 44:2–3</small>"; };
    drawScroll();
    s.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => {
      const w = b.dataset.w;
      if (w !== GATE.text[at]) { b.classList.add("bad"); setTimeout(() => b.classList.remove("bad"), 400); wrong(w === "OPENED" ? "The very opposite. Why has no one passed through this gate for five hundred years?" : w === "DEPARTED" ? "Read on: the gate is shut because of what the LORD did at it, not what he will do." : w === "PRIEST" ? "Not a priest. A ruler, who eats bread before the LORD." : "That word fits another gap. Fill the gaps in order."); return; }
      S("stone", "stone", 0.5); b.classList.add("used"); at += 2; drawScroll();
      if (at >= GATE.text.length) {
        setTimeout(() => {
          if (!K.root()) return;
          const first = !p.gateDone; p.gateDone = 1; save(); S("shofar", null, 0.7); K.buzz("success"); V("23-gate-verse");
          K.card('<div class="kick">Episode 1 solved</div><h2>The gate is shut</h2>' + photo("gate-inside.jpg", "The Eastern Gate, sealed, seen from inside the Temple Mount", "Photo: Richard J. Allinson, inside the Temple Mount") +
            "<p>Ezekiel saw the glory of the LORD enter by this gate from the east, and heard the command: <b>shut it</b>. The Turks walled it with stone in 1541, and it has stayed shut. It waits for one person: <b>the Prince</b>.</p>" +
            '<div class="fview"><b>The author’s view.</b> The Temple will stand again on the northern summit, in line with this gate. The Prince for whom the gate waits is the Messiah, and he will come to the Mount of Olives, exactly where you stood. The place is found. <b>The question now is when.</b><small>From <i>' + BOOK + "</i> by Richard J. Allinson, chapters 3 and 15</small></div>" +
            (first && !st.hints && st.misses <= 1 ? '<div class="rewards"><div>' + Lamp.ICON.oil + " <b>Sharp investigator</b> · +1 oil</div></div>" : "") +
            '<button class="cta" data-act="next">What comes next</button>', { next: () => (Lamp.fsyWalk ? Lamp.fsyWalk.finish("gate", ending) : ending()) });
          if (first && !st.hints && st.misses <= 1) { Lamp.state.oil += 1; save(); }
        }, 800);
      } else K.say(at === 3 ? "Shut. And the reason follows." : "Entered in by it. And one more: for whom is the gate kept?", "", 3200);
    }));
  }
  function ending() {
    V("24-cliffhanger"); M("cliff");
    K.card('<div class="kick">Coming soon · Episode 2</div><h2>The Seventy Weeks</h2>' +
      '<div class="v">“And he shall confirm the covenant with many for one week: and in the midst of the week he shall cause the sacrifice and the oblation to cease.”</div><div class="r">Daniel 9:27 · KJV</div>' +
      "<p>The place is found, and now it is known. The gate is shut, waiting for the Prince. But before the King comes, another will come first, and confirm a covenant with many: and the Temple Mount will be on the table.</p>" +
      "<p>Sixty-nine of Daniel’s seventy weeks are fulfilled. <b>One week remains.</b> And somewhere in Jerusalem, a watchman with blue ink and a small drawn lamp is waiting to tell you when.</p>" +
      '<p class="fgo">The investigation continues in new episodes, coming soon. Follow <b>THE FINAL SEVEN YEARS</b> on Facebook to hear first.</p>' +
      '<button class="cta" data-act="list">See the episodes ahead</button><button class="cta alt" data-act="x">Back to the journey</button>',
      { list: hub, x: () => K.shut() });
  }

  /* ---------- the episode list ---------- */
  function hub() {
    if (!K.root()) K.open(BOOK, {}, "fsy-hub");
    M("theme");
    const p = P();
    stage('<img class="fcover" src="img/start/fsy-cover.jpg" alt="The Final Seven Years, by Richard Allinson"><div class="fsub">The investigation through Daniel and Revelation, from the book by Richard J. Allinson</div><div class="fchap">' +
      CHAPTERS.map((c) => '<button class="fch' + (c.play ? "" : " soon") + '" data-ch="' + c.id + '"><i>' + c.n + "</i><span><b>" + esc(c.title) + (c.play && p.gateDone ? " ✓" : "") + "</b><small>" + esc(c.tease) + "</small>" + (c.play ? "" : "<em>Coming soon</em>") + "</span></button>").join("") + "</div>");
    $("adv-scene").querySelectorAll("[data-ch]").forEach((b) => (b.onclick = () => {
      const c = CHAPTERS.find((x) => x.id === b.dataset.ch);
      if (c.play) { K.sfx("click"); episode(); return; }
      K.say("“" + c.title + "” is coming soon. Follow THE FINAL SEVEN YEARS on Facebook to hear when it arrives.", "", 4200);
    }));
  }
  const REED_SVG = '<svg viewBox="0 0 200 60" aria-hidden="true"><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#8A6A2A"/><stop offset=".5" stop-color="#E8C66A"/><stop offset="1" stop-color="#8A6A2A"/></linearGradient></defs><rect x="8" y="24" width="184" height="12" rx="6" fill="url(#rg)"/>' +
    [30, 52, 74, 96, 118, 140, 162].map((x) => '<rect x="' + x + '" y="22" width="3" height="16" fill="#5A4318"/>').join("") + "</svg>";

  Lamp.fsy = {
    chapters: CHAPTERS,
    open: hub,
    play: episode,
    /* tester tools only: finish the next unfinished stop of the episode, no oil earned */
    devSkip() {
      const p = P(); const sh = document.querySelector("#adv .asheet"); if (sh) sh.remove();
      if (!p.began) p.began = 1;
      if (Lamp.fsyWalk && Lamp.fsyWalk.devSkip()) return;
      const nx = Lamp.fsyWalk && Lamp.fsyWalk.next(); const k = nx && nx.kept;
      if (k === "intro") { p.watchCard = 1; Lamp.fsyWalk.W().pages[1] = 1; }
      else if (k === "institute") { Object.assign(p.ti, { entered: 1, ark: 1, courts: 1, lock: 1, vessels: 1, scroll: 1, postcard: 1 }); Lamp.fsyWalk.W().pages[11] = 1; }
      else if (k === "prophets") { p.tombs = 1; p.tombIn = 1; p.tombOil = 1; p.flax = 1; p.prophets = { haggai: 1, zechariah: 1, malachi: 1 }; }
      else if (k === "olives") p.olives = 1;
      else if (k === "robinson") p.robinson = 1;
      else if (k === "mount") { CLUES.forEach((c) => (p.clues[c.id] = 1)); p.theory = p.theory || "unsure"; p.done = 1; p.waqf = 1; K.A().relics.reed = 1; }
      else if (k === "gate") p.gateDone = 1;
      if (nx) Lamp.fsyWalk.W().done[nx.id] = 1;
      save(); stops();
    },
    /* what js/fsy-route.js needs from here */
    parts: { P, keptDone, cur: (v) => (cur = v), M, V, S, stage, wnote, photo, wrong: (m) => wrong(m), back, wire, shuffle, verse: null,
      intro, institute, prophets: olivesSign, olives, robinson, chapter, gate, ending },
    card() {
      const p = P();
      return '<button class="fsycard" data-fsy="1"><span class="k">' + (Lamp.fsyOpen ? "Daniel · Revelation" : "Coming soon · Daniel · Revelation") + '</span><b>' + BOOK + '</b><span class="rule"></span>' +
        "<small>" + (!Lamp.fsyOpen ? "Coming soon: a prophecy investigation through Daniel and Revelation, from the book by Richard J. Allinson." : p.gateDone ? "Episode 1 solved. Episode 2, The Seventy Weeks, is coming soon." : "New: a prophecy investigation. Play Episode 1, “The Jerusalem Mystery”.") + '</small><span class="go">' + (!Lamp.fsyOpen ? "See what’s coming" : p.gateDone ? "See the episodes" : p.began ? "Continue the investigation" : "Begin the investigation") + "</span></button>";
    },
  };
})();
