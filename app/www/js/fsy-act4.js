/* Episode 1, Act 4: Everything But the Place — the adventure layer (the stones at dawn, the plates at the Institute, Moses' line, the sealed package and the
   date lock at the Eastern Gate, Noor and Haller's call on the Mount, Brother Matteo and the letter in Gethsemane, the fourth candle).
   Script: the Claude Doc "Episode 1, Act 4: Everything But the Place — The Script" (third draft, 6 Nov 2026, approved by Gerry). Built on fsy-act1.js's machinery (FW.adv), after fsy-act3.js.
   The Institute's plates live in fsy.js (the kept Institute), and talk to this file through H.act4. */
(function () {
  const FW = Lamp.fsyWalk; if (!FW || !FW.adv) return;
  const H = FW.H, C = FW.core, W = FW.W, K = Lamp.adv.kit, F = Lamp.fsy.parts, esc = K.esc, $ = (id) => document.getElementById(id);
  const { PEOPLE, ITEMS, PORTRAITS, CLIPS, A, has, done, give, reply, fact, portrait } = FW.adv;
  const save = () => Lamp.save(), IMG = "img/fsy/w/", PZ = "img/fsy/pz/";
  const wrong = (m) => C.wrong(m);
  const clip = (id) => (H.clip && CLIPS.has(id) ? H.clip(id) : "");
  /* portraits and clips to come (Richard, 7 Nov): add each id here when its file is in; until then a lettered medallion / no clip */
  ["shira", "benami", "noor", "matteo", "hallerphone", "moses"].forEach((p) => PORTRAITS.add(p));
  ["plate-drops", "benami-package", "noor-photo"].forEach((c) => CLIPS.add(c));   /* to come: haller-phone, matteo-gap */
  function screen(title, kick, html, backTo, amb, bg) {
    F.M("puzzle", amb || "chamber");
    const ttl = document.getElementById("adv-ttl"), same = ttl && ttl.textContent.trim() === kick;
    const el = F.stage((same ? "" : '<div class="fkick">' + esc(kick) + "</div>") + "<h1>" + esc(title) + "</h1>" + html + (backTo ? F.back("Back") : ""), bg ? "w/" + bg + ".jpg" : "temple-painting.jpg");
    if (backTo) F.wire(el, () => C.walk(C.V(backTo)));
    return el;
  }
  const q = (t) => '<div class="fq">' + esc(t) + "</div>";
  const verse = (t, ref) => '<div class="fverse">“' + esc(t) + "”<small>" + esc(ref) + "</small></div>";
  const ok = () => { F.S("harp", null, 0.6); K.buzz("success"); };
  const said = (who, text) => '<div class="fend-said"><span class="fend-who">' + esc(who) + "</span>" + text + "</div>";

  /* ------------------------------------------------------------ things ------------------------------------------------------------ */
  Object.assign(ITEMS, {
    plates: ["Four brass plates", "Daniel 9:27, a clause on each: with many · one week · the midst · the sacrifice cease. They belong in the frame beside the menorah window at the Institute."],
    package: ["A sealed brown package", "Your name on it in a neat hand, taped at every edge. Left at the police station by a man in a grey coat. Sergeant Ben-Ami: “If you want it opened, you open it.”"],
    photo1: ["A photograph of page 1", "The first page of the journal on an inspection table, shot through glass from above. A timestamp: the morning you landed. On the back: With your friend’s compliments."],
    accords: ["A map of the region", "The nations of the Abraham Accords in gold, each with a dated tab. A separate sheet, Phase 2, with question marks. Across the top: Many."],
    annex: ["Annex: the Holy Sites", "A page with a heading and nothing under it. A paperclip mark where something was. Pressed into the sleeve behind it, a small gold seal: a crown over a broken ring."],
    letter: ["The Lamplighter’s letter", "In his hand, from the hollow of the oldest tree. “I told him you were coming… I never gave him a page… Forgive me. He knows. Go up anyway. — L.”"],
  });

  /* ------------------------------------------------------------ people ------------------------------------------------------------ */
  Object.assign(PEOPLE, {
    shira: { name: "Shira, the guide", kick: "The Temple Institute", desc: "A woman of thirty-five in a long skirt and a headscarf, an Institute lanyard, a bunch of keys. Quick, proud of the work, kind to visitors who know nothing.", lines: [
      { id: "all", say: "What is all this?", run: () => { A().q.shira = 1; save(); reply("shira", "“Everything the Temple needs, made again by hand, by the book. The menorah outside is gold. The garments are woven from the threads the Torah names. The priests are trained. The vessels are ready.” She smiles. “We have been ready for a long time.”"); } },
      { id: "missing", say: "Then what is missing?", run: () => { fact("shiraplace", "Shira, at the Institute: 'Everyone agrees there was a house. Nobody agrees where to put it back. Not to the metre.'"); reply("shira", "“The place.” She does not smile now. “Everyone agrees there was a house. Nobody agrees where to put it back. Not to the metre. And this is a city where a metre can start a war.”"); } },
      { id: "grey", say: "Did a man in grey come?", run: () => { fact("shiragrey", "Shira: Haller came at closing yesterday and asked one question: how long, after an agreement, before the altar could be used."); reply("shira", "“Yesterday, at closing. He did not look at anything. He asked me one question: how long, after an agreement, before the altar could be used.” She frowns. “I told him the altar is not the hard part.”"); } },
      { id: "week", say: "Some say Daniel’s last week already happened.", when: (a) => a.q.plates4, run: () => reply("shira", "“Some do. Many Christians read the seventieth week as fulfilled at the cross. Your old man did not. He stood here with that rod and said: a sacrifice that has not begun yet needs an altar, and an altar needs its proper place.” She shrugs. “I am only the guide.”") },
    ] },
    moses: { name: "Moses", kick: "The Dung Gate", desc: "The old man at the edge of the valley, in his worn jacket, back in the shade of the wall with a string of worry beads. He enjoys his name.", when: (a) => W().done["dung:moses"], lines: [
      { id: "anyone", say: "Has anyone come this way?", run: () => { A().q.mosesgrey = 1; save(); fact("mosesgrey", "Moses: Haller asked the way to the Golden Gate. 'It is shut.' He said: 'For now.'"); reply("moses", "“One man, early. Grey coat. He asked me the way to the Golden Gate, and I told him what I tell everyone: it is shut. He said, <i>‘For now.’</i>” Moses rolls a bead. “Then he went the wrong way, down the road. You go up. Between the graves. Come round from above.”"); } },
    ] },
    benami: { name: "Sergeant Ben-Ami", kick: "The Eastern Gate", desc: "A police officer of fifty, broad, sunglasses pushed up on his head, a radio, a thermos. Tired of tourists and secretly fond of them.", lines: [
      { id: "again", say: "What did the man in grey say?", when: (a) => a.q.benami, run: () => reply("benami", "“That someone would come to this gate, sooner or later, and try. That they always do.” He shrugs. “He was right about you.”") },
    ] },
    noor: { name: "Noor", kick: "The Mount of Olives", desc: "A woman of thirty from Dubai in a cream abaya and white trainers, sunglasses on her head, a phone held up for a photograph of the gold dome. Her small son sits on the wall beside her. She is on holiday.", lines: [
      { id: "first", say: "Is this your first time here?", run: () => { A().q.noor = 1; save(); reply("noor", "“First time. Six years ago I could not have flown here directly.” She laughs and points at the panorama. “My grandmother told me about this view. She never saw it. I am sending her photographs every five minutes. She says, <i>‘Enough, I am crying.’</i>”", { clip: "noor-photo" }); } },
      { id: "gran", say: "What does she think of it?", when: (a) => a.q.noor, run: () => { fact("noorgran", "Noor's grandmother: 'Be careful of men who promise peace. The ones who promise it loudest want something for it.'"); reply("noor", "“She says the old men made the borders and the young people are walking across them.” Her son tugs her sleeve. “She also says to be careful of men who promise peace. She says the ones who promise it loudest want something for it.” She shrugs. “Grandmothers.”"); } },
    ] },
    matteo: { name: "Brother Matteo", kick: "Gethsemane", desc: "A Franciscan of sixty in a brown habit and a straw hat, secateurs in hand, earth on his knees. He has kept these trees for thirty years. Gentle, and he notices things.", lines: [
      { id: "tree", say: "Has anyone been at the oldest tree?", run: () => { A().q.matteo = 1; save(); fact("matteo", "Brother Matteo: the old man with the cane put his hand inside the oldest tree 'like a man posting a letter'. Haller walked round it three times and could not see in. There is a gap at the back, low down."); reply("matteo", "“Two men. Yesterday evening an old man with a walking cane, slowly, who stood at the tree a long time, and put his hand inside it like a man posting a letter. And this morning a man in a grey coat, who walked round it three times and could not see into it for the mesh.” He clips a shoot. “The old man knew there is a gap at the back, low down. Gardeners know it. So do the cats.”", { clip: "matteo-gap" }); } },
      { id: "old", say: "These trees are old.", run: () => reply("matteo", "“Nine hundred years, the scientists say, from the Crusaders’ time. But they grow again from the root, you see, so the roots may be older. Nobody knows if they are the ones. Cut them down and they come back.” He looks across at the sealed gate. “Like some promises.”") },
    ] },
  });

  /* ------------------------------------------------------------ the Institute's plates (called from fsy.js) ------------------------------------------------------------ */
  /* the exhibits give the plates: courts → 2, the parchment → 3, the vessels → 4; the map of the Mount in the hall → 1; the fifth position stays empty */
  const PLATES = { 1: ["he shall confirm the covenant with many", "many, and one who confirms. With whom?"], 2: ["for one week", "seven years: Daniel’s weeks are weeks of years (9:24–26)"], 3: ["in the midst of the week", "three and a half years: 1,260 days (Revelation 11:3, 12:6)"], 4: ["he shall cause the sacrifice and the oblation to cease", "sacrifice must be running before it can stop: so an altar"] };
  H.act4 = {
    plateFor: { courts: 2, scroll: 3, vessels: 4 },
    held: () => { const a = A(); a.plates = a.plates || {}; return a.plates; },
    /* an exhibit is done: hand over its plate */
    give(n, then) {
      const held = H.act4.held(); if (held[n]) { then && then(); return; }
      held[n] = 1; if (!has("plates")) give("plates"); save(); F.S("stone", null, 0.6);
      K.card('<div class="kick">The Temple Institute</div><h2>A brass plate</h2><p>' + (n === 1 ? "Beside the map of the Mount, on a hook, a loose brass plate the size of your hand, engraved:" : "Shira takes a brass plate the size of your hand from the drawer under the exhibit and holds it out. “This goes with what you have just done.” Engraved on it:") + "</p>" +
        '<div class="fplate"><b>' + esc(PLATES[n][0]) + "</b><small>Daniel 9:27 · " + esc(PLATES[n][1]) + "</small></div>" +
        "<p>" + (Object.keys(held).length === 4 ? "Four plates. The frame beside the menorah window has five positions." : "It belongs in the dark wood frame beside the menorah window. " + (4 - Object.keys(held).length) + " more to find.") + "</p>" +
        '<button class="cta" data-act="x">Keep it</button>', { x: () => then && then() });
    },
    /* the frame: four plates in, the fifth position empty; behind it, page 11 */
    frame(back) {
      const held = H.act4.held(), a = A(), set = (a.platesSet = a.platesSet || {});
      const el = F.stage('<div class="fkick">The Temple Institute · Daniel 9:27</div><h1>Everything but one thing</h1>' +
        verse("And he shall confirm the covenant with many for one week: and in the midst of the week he shall cause the sacrifice and the oblation to cease.", "Daniel 9:27") +
        q(Object.keys(held).length < 4 ? "A dark wood frame with five positions for brass plates. The card beside it prints the verse. The exhibits give the plates: " + (4 - Object.keys(held).length) + " still to find." : "Set each plate in its position. Tap a position.") +
        '<div class="fframe" id="fframe">' + [1, 2, 3, 4, 5].map((n) => '<button class="fplateslot' + (set[n] ? " on" : "") + (n === 5 ? " empty" : "") + '" data-slot="' + n + '">' + (set[n] ? "<b>" + esc(PLATES[n][0]) + "</b>" : n === 5 ? "<i>?</i>" : "<i>" + n + "</i>") + "</button>").join("") + "</div>" +
        '<div class="fsmall" id="fframesay">' + (a.q.plates4 ? "Page 11 was behind the fifth position." : "") + "</div>" + F.back("Back to the entrance hall"), "ti-hall.jpg");
      F.wire(el, back);
      el.querySelectorAll("[data-slot]").forEach((b) => (b.onclick = () => {
        const n = +b.dataset.slot;
        if (n === 5) { K.say(a.q.plates4 ? "Empty. An altar needs its place, and nobody has agreed on it." : "The fifth position. Nothing fits it; there is no fifth plate. Set the other four first.", "", 3600); return; }
        if (set[n]) return;
        if (!held[n]) { wrong("You do not have that plate yet. " + ({ 1: "Look at the map of the Mount in the hall.", 2: "Walk the courts.", 3: "The parchment, in the instrument case.", 4: "The vessels." })[n]); return; }
        set[n] = 1; save(); F.S("stone", "click", 0.6); b.classList.add("on"); b.innerHTML = "<b>" + esc(PLATES[n][0]) + "</b>";
        if ([1, 2, 3, 4].every((k) => set[k]) && !a.q.plates4) setTimeout(() => {
          a.q.plates4 = 1; { const P = Lamp.fsy.parts.P && Lamp.fsy.parts.P(); if (P) P.ti.page11 = 1; } save(); ok(); F.S("lock", null, 0.7);
          const e5 = el.querySelector('[data-slot="5"]'); if (e5) e5.classList.add("drop");
          $("fframesay").textContent = "The frame clicks. The backing of the empty fifth position drops forward.";
          setTimeout(() => K.root() && K.card('<div class="kick">The frame</div><h2>The fifth position</h2>' + clip("plate-drops") +
            "<p>Four plates in. The frame clicks, and the backing of the empty fifth position drops forward on a hinge. Blank wood. And slid in behind it, folded once, a page: blue ink, and a small drawn lamp.</p>" +
            '<button class="cta" data-act="x">Take it</button>', { x: () => C.page(11, () => {
              F.V("w-institute-plates");
              K.card('<div class="kick">The Lamplighter</div><h2>You cannot stop what never started.</h2>' + said("The Lamplighter", "“You cannot stop a sacrifice that never started. That is the whole secret of the verse. Before anyone can stop it in the middle of the week, someone must build an altar, and before anyone can build an altar, someone must decide where. That decision is worth more than every gold vessel in this room.”") +
                '<button class="cta" data-act="x">Back to the hall</button>', { x: back });
              fact("plate1", "Plate 1 of the frame: 'he shall confirm the covenant with many.' With whom?");
            }) }), 900);
        }, 500);
      }));
      return el;
    },
    shira: () => FW.adv.talk("shira"),
    entry: () => H.pay(35, "the Temple Institute"),
  };

  /* ------------------------------------------------------------ the Eastern Gate: Ben-Ami, the package, the lock ------------------------------------------------------------ */
  function benami() {
    const a = A(), p = PEOPLE.benami;
    const card = (h, text, choices, o) => { o = o || {};
      K.card('<div class="ftalk">' + portrait("benami", p) + '<div><div class="kick">Sergeant Ben-Ami</div>' + (h ? "<h2>" + esc(h) + "</h2>" : "") + "</div></div>" + (o.clip ? clip(o.clip) : "") +
        '<div class="fhim">' + text + "</div>" + '<div class="fsay">' + choices.map((c, i) => '<button data-act="c' + i + '">' + esc(c[0]) + "</button>").join("") + "</div>", Object.fromEntries(choices.map((c, i) => ["c" + i, c[1]]))); };
    const s1 = () => card("“Stop there.”", q("You climb the last few steps and stand under the sealed arches. Stone, filled with stone. Behind you, down the slope, a car door, and a broad man in uniform walking up without hurry, a thermos in one hand.") + "“Did you touch the gate?”",
      [["“No. I only looked.”", s2], ["“I put my hand on it.”", () => { C.wrong("“Show me your hands.” He looks. No paint. “Hm.”"); s2(); }]]);
    const s2 = () => { a.q.benami = 1; save(); fact("benamigrey", "Sergeant Ben-Ami: Haller came to the station yesterday and said someone would come to this gate, sooner or later, and try. 'They always do.' He did not know when. He knew where.");
      card(null, "“Good. A man in a grey coat came to the station yesterday. He said someone would come to this gate, sooner or later, and try. He said they always do.” He looks at you over the sunglasses. “He left this for you.”<br><br>A sealed brown package, your name on it in a neat hand, taped at every edge.",
        [["“Did you open it?”", s3]], { clip: "benami-package" }); };
    const s3 = () => card(null, "“We scanned it at the station. Paper. Nothing else.” He holds it out. “He left this for you. If you want it opened, you open it.”",
      [["Take the package", () => { give("package", true); F.S("parchment", null, 0.6);
        K.card('<div class="kick">The journal</div><h2>He knew where.</h2><p>' + F.wnote("He did not know <i>when</i> I would come. He knew <i>where</i>. The trail has to pass this gate, and he waited for it.") +
          '<button class="cta" data-act="x">Open the package</button>', { x: opened }); }]]);
    s1();
  }
  function opened() {
    const a = A();
    K.card('<div class="kick">The package</div><h2>A photograph</h2><img class="fphoto1" src="' + PZ + 'photo1.jpg" onerror="this.style.display=\'none\'" alt="A photograph of the first page of the journal on an inspection table, through glass">' +
      "<p>Page 1 of the journal, the page with the lamp, lying on an inspection table. On the back, in the same neat hand: <i>With your friend’s compliments.</i></p>" +
      '<button class="cta" data-act="l">Look again</button>', { l: () => { give("photo1", true);
        K.card('<div class="kick">The photograph</div><h2>Through glass</h2><p>It is taken through glass, from above. A timestamp in the corner: the morning you landed. The table is the bag check at Ben Gurion, and you remember the minute the bag was out of your sight.</p>' +
          F.wnote("He did not get it from the Lamplighter. He got it through the glass.") + "<p>How much the Lamplighter <i>did</i> tell him, the photograph cannot say.</p>" +
          '<button class="cta" data-act="x">The next page</button>', { x: () => { fact("photo1", "Haller's package: a photograph of page 1 marked 'With your friend's compliments'. Taken through glass at the Ben Gurion bag check, the morning you landed. Not from the Lamplighter.");
            K.card('<div class="kick">The package</div><h2>A map of the region</h2><img class="fphoto1" src="' + PZ + 'accords.jpg" onerror="this.style.display=\'none\'" alt="A map of the Middle East with gold tabs on four nations and a separate sheet of question marks">' +
              "<p>The nations of the Abraham Accords in gold, each with a dated tab. On a separate clipped sheet headed <i>Phase 2</i>, one more nation, and others hatched in grey with question marks. Across the top, in the neat hand: <b>Many.</b></p><p>Under the map, a stiff grey sleeve, closed with a small four-dial lock. The gold tabs have come loose in the package.</p>" +
              '<button class="cta" data-act="x">The tabs and the lock</button>', { x: () => { give("accords", true); datelock(); } }); } }); } });
  }
  /* Puzzle 3: In order. The four original agreements back in date order; their months open the lock. Phase 2 stands apart. */
  const TABS = [
    { id: "uae", name: "United Arab Emirates", date: "15 September 2020", m: "09", k: 1 },
    { id: "bah", name: "Bahrain", date: "15 September 2020", m: "09", k: 1 },
    { id: "sud", name: "Sudan", date: "October 2020", m: "10", k: 2 },
    { id: "mor", name: "Morocco", date: "December 2020", m: "12", k: 3 },
  ];
  function datelock() {
    const a = A(); let placed = [], order = F.shuffle(TABS.map((t, i) => i));
    const el = screen("In order", "The Eastern Gate", q("Put the gold tabs back on the map in the order the agreements were made. The lock takes four months.") +
      '<div class="ftabs" id="ftabs">' + order.map((i) => '<button class="ftab" data-t="' + i + '"><b>' + esc(TABS[i].name) + "</b><small>" + esc(TABS[i].date) + "</small></button>").join("") +
      '<button class="ftab ph2" data-t="p2"><b>Phase 2 · Kazakhstan</b><small>November 2025 · and others: ?</small></button></div>' +
      '<div class="fdials" id="fdials">' + [0, 1, 2, 3].map(() => '<div class="fdial"><b>··</b></div>').join("") + "</div>" +
      '<div class="fsmall" id="ftabsay">The first agreement first.</div>', null, "olives", "egate-close");
    const dials = () => { el.querySelectorAll(".fdial b").forEach((d, i) => (d.textContent = placed[i] !== undefined ? TABS[placed[i]].m : "··")); };
    el.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => {
      if (b.dataset.t === "p2") { wrong("Phase 2 stands apart. Kazakhstan already had relations with Israel; its sheet is clipped on separately, and it is not part of the lock."); return; }
      const i = +b.dataset.t; if (placed.includes(i)) return;
      const want = Math.min(...TABS.map((t, j) => placed.includes(j) ? 99 : t.k));
      if (TABS[i].k !== want) { wrong(TABS[i].k > want ? "Earlier than that. Which agreement came first?" : "Later than that."); return; }
      placed.push(i); b.classList.add("on"); F.S("dial", "click", 0.5); dials();
      $("ftabsay").textContent = placed.length < 4 ? placed.length + " of 4 set." : "09 · 09 · 10 · 12";
      if (placed.length === 4) setTimeout(() => { F.S("lock", null, 0.8); ok(); C.pzDone("police", () => annex()); }, 700);
    }));
  }
  function annex() {
    K.card('<div class="kick">The sleeve</div><h2>Annex: the Holy Sites</h2><img class="fphoto1" src="' + PZ + 'annex.jpg" onerror="this.style.display=\'none\'" alt="A page headed Annex: the Holy Sites, blank, with a paperclip mark, and a small gold seal of a crown over a broken ring">' +
      "<p>The lock opens. Inside the sleeve, a page with a heading and nothing under it. A paperclip mark where something was, and was taken out. And behind it, pressed into the card, a small gold seal: a crown over a broken ring.</p>" +
      F.wnote("“he shall confirm the covenant with many” — With whom? The architecture for many already exists. The place is still blank.") +
      '<button class="cta" data-act="x">The Lamplighter</button>', { x: () => { give("annex", true); fact("annex", "Haller's package: a blank page headed 'Annex: the Holy Sites', a paperclip mark where something was taken out, and a gold seal: a crown over a broken ring."); F.V("w-egate-package");
        K.card('<div class="kick">The Lamplighter</div><h2>Many, with one to confirm them</h2>' + said("The Lamplighter", "“The covenant Daniel saw is not one treaty between two nations. It is many, with one man to confirm them. Six years ago the world learned how that is done: one at a time, each on its own, under one broker, until there are many. These agreements are not the covenant. But they have taught the world how the covenant will be made.”") +
          '<button class="cta" data-act="x">Down to the tombs</button>', { x: () => C.finish("egate") }); } });
  }

  /* ------------------------------------------------------------ the Mount of Olives: Noor, then the call ------------------------------------------------------------ */
  function mount(then) {
    const a = A();
    const noor = () => K.card('<div class="ftalk">' + portrait("noor", PEOPLE.noor) + '<div><div class="kick">The lookout</div><h2>“Enough, I am crying.”</h2></div></div>' +
      "<p>" + esc(PEOPLE.noor.desc) + "</p>" + '<div class="fsay"><button data-act="t">Talk to her</button></div><button class="cta alt" data-act="x">Walk on</button>', { t: () => { FW.adv.talk("noor"); setTimeout(waitNoor, 400); }, x: call });
    const waitNoor = () => { const t = setInterval(() => { if (!K.root()) return clearInterval(t); if (!document.querySelector("#adv .asheet")) { clearInterval(t); if (a.q.noor) call(); else noor(); } }, 400); };
    const call = () => {
      a.q.call = 1; save(); F.M("m22", "olives");
      K.card('<div class="kick">Among the graves</div><div class="ftalk">' + portrait("hallerphone", { name: "Haller" }) + '<div><div class="kick">Forty metres away</div><h2>A grey coat, a telephone</h2></div></div>' + clip("haller-phone") +
        "<p>You turn to go down, and among the graves a man in a grey coat is standing with his back to you, a telephone at his ear. He does not see you. The wind brings his side of it, and no more:</p>" +
        '<div class="fcall">“Yes, sir. … The courier is still measuring. … Because the old man would never give it to us, and the courier will. Let them finish. … Seven years. … Your name stays out of the Holy Sites annex. For now.”</div>' +
        "<p>He ends the call, puts the phone in his coat, and walks away down the hill without looking round. The path is full of tour groups; you cannot follow.</p>" +
        '<button class="cta" data-act="x">The journal</button>', { x: () => { fact("call", "Haller, on the telephone on the Mount of Olives: 'Yes, sir. The courier is still measuring. Because the old man would never give it to us, and the courier will. Let them finish. Seven years. Your name stays out of the Holy Sites annex. For now.'");
          K.card('<div class="kick">The journal</div><h2>“Sir.”</h2>' + F.wnote("Haller says <i>sir</i>. And: <i>Let them finish.</i>") + "<p>Under the drawing of the seal. You do not write anything else. You go down the hill to the garden.</p>" +
            '<button class="cta" data-act="x">Down to Gethsemane</button>', { x: then }); } });
    };
    noor();
  }

  /* ------------------------------------------------------------ Gethsemane: the hollow, page 12, the letter, the fourth candle ------------------------------------------------------------ */
  C.PUZZLES.lastpage = { label: "Look in the hollow", run: () => {
    const a = A();
    if (!a.q.matteo) { K.card('<div class="kick">Gethsemane</div><h2>The oldest tree</h2><p>A vast hollow trunk inside a mesh guard, still green on top. You walk round it. The mesh goes all the way round, and you cannot see in. Someone who keeps this garden would know it better.</p><button class="cta" data-act="x">Back</button>', { x: () => {} }); return; }
    K.card('<div class="kick">Gethsemane</div><h2>The gap at the back</h2><p>Low down at the back, where the mesh meets the wall and the cats go through: a gap the width of a hand. Inside the hollow, wedged where no gardener would see it, a bundle in oilcloth.</p><button class="cta" data-act="x">Reach in</button>',
      { x: () => { F.S("parchment", null, 0.7); C.page(12, () => back12()); } });
  } };
  const back12 = () => K.card('<div class="kick">Page 12 · the back</div><h2>In the same hand, smaller</h2>' +
    F.wnote("“Haller is not the one. He carries the papers for the prince who shall come. The covenant reveals him. The middle reveals what he is.<br><br>Whoever chooses the place chooses where he will sit.”<small>Daniel 9:26–27 · 2 Thessalonians 2:4, in the margin</small>") +
    "<p>Folded inside the page, a second sheet. Not the Watchman’s hand. One you have seen on two envelopes.</p>" +
    '<button class="cta" data-act="x">The letter</button>', { x: letter });
  const letter = () => { give("letter", true); F.V("w-gethsemane-letter"); fact("letter", "The Lamplighter's letter: he and Haller drew maps for the same office thirty years ago. Haller rang the night before you landed; L. told him you were coming. On Tuesday he told him the trail went down to the water. Two things. He never gave him a page. 'Forgive me. He knows. Go up anyway.'");
    K.card('<div class="kick">The Lamplighter</div><h2>“You asked who heard the words before you did.”</h2>' +
      F.wnote("“I did. Thirty years ago Victor Haller and I drew maps for the same office, and I knew his voice the night he rang, the night before you landed. He said he knew about the journal. He said there were people who would be hurt. I told him you were coming. On Tuesday he rang again, and I told him the trail went down to the water. Two things. Then I was ashamed, and I said nothing else. I never gave him a page. The photograph was not mine; I think you know by now whose glass it was taken through. That is all of it. It is not small. Forgive me. He knows. Go up anyway.<small>— L.</small>") +
      '<button class="cta" data-act="x">Out of the garden</button>', { x: () => C.pzDone("lastpage", () => endAct4()) }); };

  C.ACTS_FN.endAct4 = () => endAct4();
  function endAct4() {
    const w = W();
    if (w.flags.act4end) { K.card('<div class="kick">Act 4</div><h2>The fourth night</h2>' + FW.hanukkiahHTML(4) + '<button class="cta" data-act="x">Close</button>', { x: () => {} }); return; }
    w.flags.act4end = 1; save(); F.S("harp", null, 0.6); F.V("w-act4-end");
    K.card('<div class="kick">Act 4 · Everything But the Place</div><h2>The fourth candle</h2>' + FW.hanukkiahHTML(4) +
      said("The Lamplighter", "“Four candles. You know now what I did, and what I did not do. You know what is ready, and what is missing, and who wants to choose it. Tomorrow you go up, by the only way up. He will be there. He has been waiting for you to finish. Take the rod. Take the pages. Take the lamp. And measure as if the place were not already decided, because it is not. Not yet.”") +
      '<button class="cta" data-act="n">The night</button>', { n: () => {
        F.S("harp", null, 0.4);
        K.card('<div class="kick">The fourth night · the hotel</div><h2>The package open on the bed, the seal under the lamp.</h2>' +
          "<p>Six lamps of seven. The last is on the Mount.</p>" + F.wnote("“…and he shall confirm the covenant with many for <b>one week</b>.”") +
          '<button class="cta" data-act="x">End of Act 4</button>', { x: () => C.finish("gethsemane") });
      } });
  }

  /* ------------------------------------------------------------ gates, before, lists, tasks, hints ------------------------------------------------------------ */
  const gate3 = H.gate, before3 = H.before, list3 = H.list, task3 = H.task, hint3 = H.hint, dev3 = H.devDone;
  H.gate = (s, from) => {
    if (!from || from.id === s.id) return true;
    if (s.id === "gethsemane" && !A().q.call && W().done.olives) { mount(() => FW.go(s.id)); return false; }
    return gate3 ? gate3(s, from) : true;
  };
  H.before = (scene, v, prev) => before3 ? before3(scene, v, prev) : true;
  const r = (t, ok, where, opt) => ({ t, ok: !!ok, where, opt: !!opt });
  const L4 = {
    dawn: (a, w) => { const P = Lamp.fsy.parts.P && Lamp.fsy.parts.P(); return [r("Read the stones: not one upon another", P && P.robinson, "The fallen stones")]; },
    dung: (a, w) => [r("The man at the gate across the path", done("dung", "moses"), "The road down"), r("Ask Moses who came this way", a.q.mosesgrey, "Moses")],
    egate: (a, w) => [r("Go up to the gate", a.q.benami, "Under the sealed arches"), r("The tabs, in order", done("egate", "police"), "The package")],
    kidron: (a, w) => [r("Whose tomb is it?", done("kidron", "whose"), "The monuments")],
    gethsemane: (a, w) => [r("Ask the gardener about the oldest tree", a.q.matteo, "Among the trees"), r("Look in the hollow", done("gethsemane", "lastpage"), "The oldest tree")],
  };
  H.list = (scene) => (L4[scene.id] ? L4[scene.id](A(), W()) : list3 ? list3(scene) : null);
  H.devDone = (id) => {
    const a = A(), w = W(), q = a.q, it = a.items, pz = (k) => (w.done[k] = 1), P = Lamp.fsy.parts.P && Lamp.fsy.parts.P();
    const D = {
      dawn: () => { if (P) P.robinson = 1; },
      institute: () => { a.plates = { 1: 1, 2: 1, 3: 1, 4: 1 }; a.platesSet = { 1: 1, 2: 1, 3: 1, 4: 1 }; q.plates4 = 1; q.shira = 1; it.plates = 1; w.pages[11] = 1; if (P) { Object.assign(P.ti, { entered: 1, ark: 1, courts: 1, lock: 1, vessels: 1, scroll: 1, page11: 1 }); } },
      dung: () => { q.mosesgrey = 1; pz("dung:moses"); },
      egate: () => { q.benami = 1; it.package = 1; it.photo1 = 1; it.accords = 1; it.annex = 1; pz("egate:police"); },
      kidron: () => pz("kidron:whose"),
      olives: () => { if (P) P.olives = 1; },
      gethsemane: () => { q.noor = 1; q.call = 1; q.matteo = 1; it.letter = 1; pz("gethsemane:lastpage"); w.pages[12] = 1; w.flags.act4end = 1; },
    };
    if (D[id]) D[id](); else if (dev3) dev3(id);
  };
  H.task = (scene) => {
    const a = A();
    const WHY = {
      dawn: "First light at the fallen stones. Last night it was too dark to read them.",
      dung: "Out by the gate and down the road. The man at the edge of the valley has seen someone.",
      egate: "Up the steps between the graves. The police are waiting at the gate, and so is something he left.",
      kidron: "Down in the valley. Whose tomb is it?",
      gethsemane: "The garden. The gardener knows the oldest tree; the last page is in it.",
    };
    if (L4[scene.id]) { const left = H.left(scene) || ""; const need = L4[scene.id](a, W()).filter((x) => !x.opt); const fresh = need.filter((x) => !x.ok).length === need.length; return ((fresh && WHY[scene.id]) ? WHY[scene.id] + " " : "") + left || null; }
    return task3 ? task3(scene) : null;
  };
  H.hint = (scene, v, n) => {
    if (scene.id === "egate" && A().q.benami && !done("egate", "police")) return n === 1 ? "The first agreement first. Two of them share a day." : "September, September, October, December. Phase 2 is not part of the lock.";
    if (scene.id === "gethsemane" && !done("gethsemane", "lastpage")) return A().q.matteo ? "Low down at the back, where the cats go through." : "The gardener has kept these trees for thirty years. Ask him.";
    return hint3 ? hint3(scene, v, n) : null;
  };

  /* the Eastern Gate's existing police puzzle becomes Ben-Ami and the package */
  C.PUZZLES.police = { label: "Go up to the gate", run: () => benami() };

  /* the tester's shortcut: Act 4 as if played */
  FW.devAct4 = () => {
    if (FW.devAct3) FW.devAct3();
    ["dawn", "institute", "dung", "egate", "kidron", "olives", "gethsemane"].forEach((id) => { H.devDone(id); W().done[id] = 1; });
    const w = W(); w.pages[11] = 1; w.pages[12] = 1; w.flags.actcard4 = 1; save();
  };
})();
