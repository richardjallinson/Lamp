/* Episode 1 extras (Gerry's notes, 6 Nov): the People page in the journal, the "Previously" recap after a day away, and the airport note under the journal's cord.
   Loads last, after fsy-act5.js. */
(function () {
  const FW = Lamp.fsyWalk; if (!FW || !FW.adv) return;
  const H = FW.H, C = FW.core, W = FW.W, K = Lamp.adv.kit, F = Lamp.fsy.parts, esc = K.esc;
  const { PEOPLE, ITEMS, A, has, give, fact, portrait } = FW.adv;
  const save = () => Lamp.save();
  const P = () => (F.P ? F.P() : {});

  /* ------------------------------------------------------------ the airport note ------------------------------------------------------------ */
  ITEMS.airnote = ["A slip of paper", "Folded small under the journal’s cord, found in the arrivals hall. Four words in a neat, old hand: He knows you have it."];
  const before5 = H.before;
  H.before = (scene, v, prev) => {
    if (scene.id === "airport" && v.id === "hall" && W().flags.passport && !W().flags.airnote) {
      W().flags.airnote = 1; save();
      setTimeout(() => K.root() && W().at === "airport" && K.card('<div class="kick">The arrivals hall</div><h2>Under the cord</h2>' +
        "<p>You stop by the pillars to put the bag straight after the search. The journal is where she put it back. Under the cord that ties it, folded small, a slip of paper you had not noticed. You did not put it there. It was there before the booth; it was there before the flight.</p>" +
        F.wnote("He knows you have it.") +
        "<p>Four words. A neat hand, an old one. You have seen the hand somewhere, and cannot think where.</p>" +
        '<button class="cta" data-act="x">Keep it</button>', { x: () => { give("airnote"); fact("airnote", "A note under the journal’s cord at the airport, in a neat old hand: 'He knows you have it.' It was there before the flight."); } }), 500);
    }
    return before5 ? before5(scene, v, prev) : true;
  };

  /* ------------------------------------------------------------ the People page ------------------------------------------------------------ */
  /* who the player has met: anyone they have spoken to, plus the people met in card scenes (flags), plus the Lamplighter always */
  const EXTRA = { lamplighter: () => true, haller: (a, w) => a.q.metHaller || w.flags.jaffaParcel, hallerpool: (a) => a.q.sawHaller || a.q.proof, benami: (a) => a.q.benami, noor: (a) => a.q.noor, tal: (a) => a.q.talSeen, yoel: (a) => a.q.yoel, moti: (w) => W().flags.passport };
  const NAMES = { lamplighter: { name: "The Lamplighter", kick: "The desk with the lamp", desc: "An old man at a desk with a lamp, who handed you the Watchman’s journal and sent you up." } };
  const nameOf = (k, p) => (k === "haller" && A().f.haller ? "Victor Haller" : p.name);
  /* one line each, updated only with what the player has actually found. Facts, not verdicts. */
  const NOTES = {
    lamplighter: [["envelope2", "A second envelope: two hundred shekels and “down to the water”. His number rang unanswered."], ["heardfirst", "Haller knew the envelope’s words: “Ask yourself who heard those words before you did.”"], ["letter", "His letter in the tree: he told Haller you were coming, and that the trail went down to the water. Two things. He never gave him a page."], ["yoelL", "Yoel: “He has been afraid for thirty years, and he was right to be, and he sent you anyway.”"]],
    haller: [["haller", "Victor Haller. Says he knew the Watchman."], ["flight", "The Garden Tomb: “I am asking you, politely, to let it be wrong.” He knew your flight."], ["forgery", "The pool: offered to buy your silence; gave you a forged page, lamp spout left."], ["dryshoes", "His shoes were dry. He will not go into the water or the dark."], ["call", "The Mount of Olives, on the telephone: “Yes, sir. … Let them finish.”"], ["hallertest", "The barrier: the forged page was his test of whether you could tell Yoel’s true turn from a false one."], ["shutter", "He photographed the finished overlay. “The annex cannot remain blank forever.”"]],
    hallerpool: [],
    yoel: [["alive", "Alive. In the dry recess in the tunnel, in charcoal: “Still watching. Hurry.”"], ["lamp7", "Under the grate at the northern outcrop: his lamp, a date, “You found the place. Now guard the truth.”"], ["witness", "At the gate before sunrise: “He needed a place. I needed a witness.”"]],
    adler: [["yoel", "Named the Watchman: Yoel. Authorised the last passage of the tunnel."]],
    mahmoud: [["oil", "Sold you the oil."], ["dryshoes", "Said the man in grey came out of the tunnel dry."]],
    shimon: [["shimonprice", "Hebron: the Watchman asked what the cave cost. A price paid leaves testimony."]],
    shira: [["shiragrey", "Haller came at closing and asked how long, after an agreement, before the altar could be used."], ["shiraplace", "“Everyone agrees there was a house. Nobody agrees where to put it back.”"]],
    benami: [["benamigrey", "Haller left a sealed package for you at the station: “He said they always do.”"]],
    noor: [["noorgran", "Her grandmother: “Be careful of men who promise peace.”"]],
    matteo: [["matteo", "The old man with the cane put his hand in the oldest tree “like a man posting a letter”. The gap is at the back."]],
    moses: [["mosesgrey", "Haller asked him the way to the Golden Gate. “It is shut.” He said: “For now.”"]],
    tal: [["tal", "“Do not measure anything with that in front of the Waqf. I did not see it.”"]],
  };
  const metIds = () => {
    const a = A(), w = W(), ids = new Set(Object.keys(a.asked || {}).map((k) => k.split(":")[0]));
    Object.keys(EXTRA).forEach((k) => { try { if (EXTRA[k](a, w)) ids.add(k); } catch (e) {} });
    if (ids.has("hallerpool") || ids.has("hallerfront")) { ids.add("haller"); ids.delete("hallerpool"); ids.delete("hallerfront"); }
    if (ids.has("grandma2")) { ids.add("grandma"); ids.delete("grandma2"); }
    return [...ids].filter((k) => PEOPLE[k] || NAMES[k]);
  };
  const firstSentence = (t) => (t || "").split(/(?<=[.!?])\s/)[0];
  H.peoplePage = () => {
    const a = A(), ids = metIds();
    if (!ids.length) return '<div class="fjevidence"><p>Nobody yet. Talk to someone.</p></div>';
    const row = (k) => { const p = PEOPLE[k] || NAMES[k], notes = (NOTES[k] || []).filter((n) => a.f[n[0]] || a.items[n[0]] || a.q[n[0]]).map((n) => n[1]);
      return '<div class="fperson">' + portrait(k === "haller" ? (a.q.sawHaller ? "hallerfront" : "haller") : k, p) + '<div><b>' + esc(nameOf(k, p)) + "</b><small>" + esc(p.kick || "") + "</small><p>" + esc(firstSentence(p.desc)) + "</p>" + notes.map((t) => '<p class="fpnote">' + esc(t) + "</p>").join("") + "</div></div>"; };
    return '<div class="fjevidence"><p class="fjlead">The people you have met, and what they told you. No verdicts; those are yours.</p>' + ids.map(row).join("") + "</div>";
  };
  H.peopleCount = () => metIds().length;

  /* ------------------------------------------------------------ the "Previously" recap ------------------------------------------------------------ */
  /* the story so far, in the order it happens; the recap shows the last three that are true */
  const MILESTONES = [
    [(a, w) => w.flags.passport, "You came through Ben Gurion with the Watchman’s journal and a question on its first page: where did the Temple stand?"],
    [(a, w) => w.flags.airnote, "Under the journal’s cord, a note: He knows you have it."],
    [(a, w) => w.pages[2], "The market: page 2, weighed out of a spice sack."],
    [(a, w) => a.q.metHaller, "A man in a grey coat, Victor Haller, says he knew the Watchman."],
    [(a, w) => w.pages[4], "Four pages. The first candle on the walls."],
    [(a, w) => a.f.flight, "The Garden Tomb: Haller asked you, politely, to let it be wrong."],
    [(a, w) => w.pages[8], "Eight pages. Haller is half a day ahead, then an hour."],
    [(a, w) => a.f.yoel, "The Watchman has a name: Yoel."],
    [(a, w) => w.flags.watchmanAlive || a.f.alive, "In the tunnel, in charcoal: Still watching. Hurry. He is alive."],
    [(a, w) => a.q.proof || a.f.forgery, "At the pool, Haller offered to buy your silence and gave you a forged page."],
    [(a, w) => w.pages[10], "Ten pages. Three candles. Tomorrow: everything is ready but one thing."],
    [(a, w) => w.pages[11], "The Institute: four plates of Daniel 9:27, and the fifth position empty. Page 11."],
    [(a, w) => a.items.annex, "Haller’s package: the Accords, a photograph through glass, a blank annex, a seal."],
    [(a, w) => a.q.call, "On the Mount of Olives, Haller on the telephone: Yes, sir. Let them finish."],
    [(a, w) => a.items.letter, "Gethsemane: the Lamplighter’s letter. He told Haller two things. Forgive me. Go up anyway."],
    [(a, w) => a.q.ramp, "The barrier: Haller made certain you reached the Mount. Ninety minutes."],
    [(a, w) => P().done, "The Mount: five witnesses, one place. Yoel’s reconstruction."],
    [(a, w) => (FW.lamps && FW.lamps()[7]), "The seventh lamp, under the grate. And a camera shutter."],
    [(a, w) => w.flags.page13, "Page 13: come down to the Eastern Gate before sunrise. Bring the rod. Come alone."],
  ];
  const DAY = 20 * 3600 * 1000;
  H.recapDue = () => { const w = W(); return !!(w.flags.seen && Date.now() - w.flags.seen > DAY && w.at && w.at !== "airport"); };
  H.recap = (then) => {
    const a = A(), w = W(), s = C.byId ? C.byId[w.at] : null;
    const lines = MILESTONES.filter((m) => { try { return m[0](a, w); } catch (e) { return false; } }).slice(-3).map((m) => m[1]);
    const where = s ? "Act " + s.act + " · " + s.title : "";
    K.card('<div class="kick">Previously</div><h2>The story so far</h2>' + (lines.length ? '<div class="frecap">' + lines.map((t) => "<p>" + esc(t) + "</p>").join("") + "</div>" : "<p>You have just begun.</p>") +
      (where ? '<p class="fsmall">You are at: ' + esc(where) + ".</p>" : "") + '<button class="cta" data-act="x">Go on</button>', { x: () => { w.flags.seen = Date.now(); save(); then && then(); } });
  };
  const extra5 = H.journalExtra;
  H.journalExtra = () => (extra5 ? extra5() : "") + '<button class="cta alt" data-act="recap">Previously…</button>';
  const acts5 = H.journalActs;
  H.journalActs = () => Object.assign(acts5 ? acts5() : {}, { recap: () => H.recap() });
})();
