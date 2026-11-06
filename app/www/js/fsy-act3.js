/* Episode 1, Act 3: Down to the Water — the adventure layer (the morning envelope, six people, the tunnel in the dark, Haller at the pool, lamps 5 and 6, pages 9 and 10).
   Script: the Claude Doc "Episode 1, Act 3: Down to the Water — The Script" (fourth draft, 5 Nov 2026). Built on fsy-act1.js's machinery (FW.adv), after fsy-act2.js. */
(function () {
  const FW = Lamp.fsyWalk; if (!FW || !FW.adv) return;
  const H = FW.H, C = FW.core, W = FW.W, K = Lamp.adv.kit, F = Lamp.fsy.parts, esc = K.esc, $ = (id) => document.getElementById(id);
  const { PEOPLE, ITEMS, RIDE, PORTRAITS, CLIPS, A, has, done, give, reply, fact, portrait, ride } = FW.adv;
  const save = () => Lamp.save(), IMG = "img/fsy/w/", PZ = "img/fsy/pz/";
  const wrong = (m) => C.wrong(m);
  const clip = (id) => (H.clip && CLIPS.has(id) ? H.clip(id) : "");
  ["ori", "shimon", "yitzhak", "adler", "mahmoud", "avner", "hallerfront"].forEach((p) => PORTRAITS.add(p));
  ["haller-page", "flame-leans", "scrap-drifts", "avner-sing", "mahmoud-lamp"].forEach((c) => CLIPS.add(c));
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
  const pay = (n, what) => H.pay(n, what);

  /* ------------------------------------------------------------ things ------------------------------------------------------------ */
  Object.assign(ITEMS, {
    envelope2: ["The Lamplighter’s second envelope", "Cream paper, left at the hotel desk at six in the morning. “Hebron first, as he did… Then down to the water. Don’t stop at the pool.” On the flap, a telephone number that rings and rings."],
    codticket: ["A City of David ticket", "Thirty shekels, from Dr Adler’s desk. On the back, in her hand: the authorisation for the last tunnel passage of the day."],
    oil: ["Olive oil, from Mahmoud’s trees", "A lamp’s worth, from an old water bottle at the spring. Twelve shekels."],
    forgery: ["A page that is not his", "From Haller’s coat, on the steps of the pool. The lamp in the corner faces the wrong way. Struck through in the journal."],
    brasstube: ["A small brass tube", "Wax-stoppered, the Watchman’s lamp scratched on it, from under the water at the foot of the great steps. It held page 10."],
  });
  RIDE.zion = ["bus", "The 160 back to Jerusalem, and the 1 up to Mount Zion", "160"];

  /* ------------------------------------------------------------ people ------------------------------------------------------------ */
  Object.assign(PEOPLE, {
    ori: { name: "Ori, a paratrooper", kick: "On the bus to Hebron", desc: "Nineteen, red beret folded under his shoulder strap, earphones round his neck, the top of a rifle between his knees. He is the one who talks.", lines: [
      { id: "going", say: "Where are you going?", run: () => { A().q.ori = 1; save(); reply("ori", "“Back. Four days at home, now back. Hebron is the quietest posting in the country and the only one my mother cries about.”"); } },
      { id: "cave", say: "Do people visit the cave?", run: () => reply("ori", "“Every day. Jews on one side, Muslims on the other, the same tombs through the bars. Everyone wants to stand near Abraham. Nobody agrees about anything else.”") },
    ] },
    shimon: { name: "Reb Shimon", kick: "The Cave of the Patriarchs", desc: "The caretaker of the Jewish section: seventies, a long white beard, a black hat, a wool coat over a long black kapote, a heavy ring of old keys in one hand. Speaks slowly. Likes exact things.", lines: [
      { id: "cave", say: "Is this really the cave?", run: () => { A().q.shimon = 1; save(); fact("hebronwall", "The Watchman measured Herod's wall at Hebron three times last month: the only building of Herod's still standing whole."); reply("shimon", "“The cave is under your feet, eleven metres down. These are markers, so that you know where to stand. Herod built the wall so that nobody would forget where the cave was, and nobody has. Two thousand years.” He taps the floor with his key. “That is what a wall is for. The old man with the rod measured it, outside, three times last month. The guards thought he was a surveyor.”"); } },
      { id: "why", say: "Why did the Lamplighter want me to see this?", when: (a) => a.q.envelope2, run: () => { fact("shimonprice", "Reb Shimon: the Watchman asked what the cave cost. Four hundred shekels of silver, weighed in front of everyone. 'Then no one can say Abraham took it without payment.'"); reply("shimon", "“I do not know your Lamplighter. I know the old man with the stick. He stood at Abraham’s marker and asked me how much the cave cost. Four hundred shekels of silver, I told him, weighed in front of everyone. He said: <i>then no one can say Abraham took it without payment.</i>”"); } },
      { id: "grey", say: "Did a man in a grey coat come?", run: () => reply("shimon", "“No.” He is sure. “Not here. Whatever he wants, he did not want this.”") },
    ] },
    yitzhak: { name: "Yitzhak, the psalm-reader", kick: "David’s Tomb", desc: "A man of forty in a black hat and a prayer shawl, a worn book of Psalms in his hands, standing by the great cenotaph under its blue and gold cover. A tired, kind voice; he has been reading since dawn.", lines: [
      { id: "reading", say: "What are you reading?", run: () => { A().q.yitzhak = 1; save(); fact("sidesnorth", "Yitzhak, at Psalm 48: 'The sides of the north. People read it for the music. Your old man read it for the direction.'"); reply("yitzhak", "“The psalms, all of them, in order, every day. Today I am at forty-eight.” He finds the place. “‘Beautiful for situation, the joy of the whole earth, is mount Zion, on the sides of the north, the city of the great King.’” He looks up. “The sides of the north. People read it for the music. Your old man read it for the direction.”"); } },
      { id: "here", say: "Is David here?", run: () => reply("yitzhak", "“The Bible says he was buried in the city of David, which is down there.” He nods east, toward the slope. “This is where people have come to remember him for a thousand years. Both things are true. You can stand on a tradition and still read a map. And the city down there he did not buy. He took it. The floor above it, he paid for.”") },
      { id: "grey", say: "Did a man in grey come?", run: () => reply("yitzhak", "“This morning, early. He asked me to show him the cover of the cenotaph, and read what is stitched on it, and he photographed it.” He frowns. “People photograph it all day. He photographed only the one line.”") },
    ] },
    adler: { name: "Dr Adler", kick: "The City of David", desc: "The dig’s site archaeologist: a woman in her fifties in a sun hat and a field jacket with too many pockets, a trowel in one, a phone in her hand. Brisk, amused, not easily impressed.", lines: [
      { id: "rod", say: "Did you know the man with the cubit rod?", run: () => { A().q.adler = 1; W().flags.watchmanName = 1; save(); fact("yoel", "The Watchman has a name: Yoel. Dr Adler: he volunteered on the dig for four seasons. 'He would not have given you that rod. So he must have left it for you.'"); reply("adler", "“Yoel? Of course. He volunteered on the dig for four seasons. He was the only volunteer I ever had who measured a wall before I asked him to.” She looks at the rod in your hand. “That is his. He would not have given it to you.” A pause. “So he must have left it for you. That is a different thing.”", { h: "“Yoel?”" }); } },
      { id: "place", say: "What is this place?", run: () => reply("adler", "“The Jerusalem David took. Fifteen acres on a ridge, with the only spring for miles at the bottom of it. The Temple Mount is the hill behind you. Everyone who comes here looks up there. They should look down. Everything up there started down here.”") },
      { id: "last", say: "When did you last see him?", when: (a) => a.q.adler, run: () => { fact("charcoalask", "Dr Adler: Yoel came out of the tunnel three weeks ago at closing time, wet to the knee, and asked her for charcoal."); reply("adler", "“He came down the Siloam steps three weeks ago at closing time, from the tunnel, wet to the knee, which at his age is a stupid thing to do alone. He asked me for charcoal.” She stops. “I gave him some. I did not ask what for.”"); } },
      { id: "grey", say: "A man in a grey coat?", run: () => reply("adler", "“Yesterday. He wanted to know whether the tunnel comes out anywhere except the pool. It does not.” She shrugs. “Odd question for a tourist.”") },
      { id: "parker", say: "The sign about the Ark?", when: () => W().flags.arksign, run: () => reply("adler", "“Parker bribed the guards and dug under the Mount at night with picks, looking for the Ark. He dug in exactly the wrong place. He had a map from a man who read the Bible with a ruler.” A dry look. “Everybody has a map.”") },
    ] },
    mahmoud: { name: "Mahmoud", kick: "The Gihon Spring", desc: "A Silwan man of sixty with a grey moustache and a white knitted cap, at a kiosk of a few shelves by the spring: olive oil in old water bottles, a kettle, a cat. Patient, dry, very funny when he decides to be.", lines: [
      { id: "oil", say: "Do you sell oil?", when: () => !has("oil"), run: () => reply("mahmoud", "“I sell oil from my own trees on the hill above your head. Tourists buy it for salad.” He looks at the clay lamp. “You do not want it for salad.”", { btn: "Fill the lamp (12 shekels)", then: () => { if (pay(12, "oil for the lamp")) { give("oil"); A().q.oilIn = 1; save(); } } }) },
      { id: "why", say: "Why here?", run: () => reply("mahmoud", "“Because here is where the water is, and where the water is, people were. Three thousand years, this spring. The city was built for the water. Everything above grew from the city.” He pours tea. “Now the water is a museum, and I sell oil to tourists.”") },
      { id: "today", say: "Has anyone gone into the tunnel today?", run: () => { A().q.dryshoes = 1; save(); fact("dryshoes", "Mahmoud: Haller went into the tunnel this morning and came back out the same way ten minutes later. Dry shoes, dry trousers."); reply("mahmoud", "“One. Grey coat, this morning.” He waits. “He came back out the same way ten minutes later. Dry. Dry shoes, dry trousers.” His eyebrows say what he thinks of a man who will not get wet."); } },
      { id: "yoel", say: "The old man with the stick?", run: () => reply("mahmoud", "“Yoel.” He says it like a neighbour’s name. “He bought oil from me for four years. Three weeks ago, a whole bottle, more than a lamp takes.” He pours more tea. “I think he was going to be in the dark for a long time.”") },
    ] },
    hallerpool: { name: "Victor Haller", kick: "The steps of the pool", desc: "The man in the grey coat, sitting on the broad Second Temple steps with the coat’s collar up, hands loose in his lap, the Pilgrim Road rising behind him. He has been waiting for you.", lines: [
      { id: "sit", say: "(Sit down)", when: (a) => !a.q.bench3, run: () => hallerPool() },
      { id: "gone", say: "(The steps are empty)", when: (a) => a.q.bench3, run: () => reply("hallerpool", "The steps, and the lit road climbing away above them. He went up it fast, dry-shod, and did not look back.") },
    ] },
    avner: { name: "Rabbi Avner and the boys", kick: "The Southern Steps", desc: "A young bearded rabbi with a guitar and a bar-mitzvah party of twelve-year-olds in white shirts, on the broad steps, singing. You heard them before you saw them.", lines: [
      { id: "singing", say: "What are they singing?", run: () => { A().q.avner = 1; save(); reply("avner", "“A hundred and twenty to a hundred and thirty-four. The pilgrims’ songs. One a step, fifteen steps, and then the gate.” He grins. “They know three of them. We will be here a while.”", { clip: "avner-sing" }); } },
      { id: "yoel", say: "Did the old man with the stick come here?", run: () => reply("avner", "“Every Friday. He stood on the top step and did not go in, because there is nowhere to go in to.” He points up at the blocked gates in the wall. “He said he was waiting for the gate to open. I thought he meant the Messiah. Now I think he meant something else.”") },
    ] },
  });

  /* ------------------------------------------------------------ the morning: the second envelope ------------------------------------------------------------ */
  function morning(then) {
    const a = A(), p = PEOPLE.dayclerk;
    K.card('<div class="kick">The Jerusalem Hotel · the third morning</div><div class="ftalk">' + portrait("dayclerk", p) + '<div><div class="kick">The morning clerk</div><h2>“Left at six.”</h2></div></div>' +
      '<div class="fhim">He holds up a cream envelope. “An old man, a walking cane, a hat. He would not wait and he would not give a name.”</div>' +
      '<button class="cta" data-act="o">Open it</button>', { o: () => {
        F.S("parchment", null, 0.7);
        K.card('<div class="kick">The envelope</div><h2>Two hundred shekels, and a half-sheet</h2><img class="fphoto1" src="' + PZ + 'envelope2.jpg" alt="A cream envelope on the hotel desk, banknotes inside, an L in the corner">' +
          F.wnote("“Hebron first, as he did. Everything there was bought, and he wanted you to see the price. Then come back and go down to where the city began, and down to the water. Don’t stop at the pool.”<small>— L.</small>") +
          "<p>On the flap, in the same hand, a telephone number. The same number as on the first envelope.</p>" +
          '<button class="cta" data-act="r">Ask the clerk to ring the number</button><button class="cta alt" data-act="x">Put it away</button>', { r: () => ring(then), x: () => after(then) });
        a.money += 200; a.q.envelope2 = 1; save(); give("envelope2", true); F.V("w-hotel-envelope");
        fact("envelope2", "The Lamplighter's second envelope, left at six: 200 shekels, and 'down to the water. Don't stop at the pool.' His number rings and nobody answers.");
      } });
    const ring = (then) => K.card('<div class="kick">The front desk</div><h2>It rings.</h2><p>The clerk dials, listens, and holds the receiver out so you can hear it: ring, and ring, and ring. Nobody.</p><p>“Shall I try again later?” He will, if you ask. It will not answer.</p>' +
      '<button class="cta" data-act="x">The bus to Hebron</button>', { x: () => after(then) });
    const after = (then) => { K.say("+200 shekels, from the envelope. You have " + A().money + ".", "", 3200); then(); };
  }

  /* ------------------------------------------------------------ Haller on the steps of the pool ------------------------------------------------------------ */
  function hallerPool() {
    const a = A(), p = PEOPLE.hallerpool;
    const card = (h, text, choices, o) => { o = o || {};
      K.card('<div class="ftalk">' + portrait("hallerpool", p) + '<div><div class="kick">Victor Haller</div>' + (h ? "<h2>" + esc(h) + "</h2>" : "") + "</div></div>" + (o.clip ? clip(o.clip) : "") +
        '<div class="fhim">' + text + "</div>" + '<div class="fsay">' + choices.map((c, i) => '<button data-act="c' + i + '">' + esc(c[0]) + "</button>").join("") + "</div>", Object.fromEntries(choices.map((c, i) => ["c" + i, c[1]]))); };
    const s1 = () => card("“Everyone comes out here.”", "“The tunnel comes out here. Everyone comes out here.” He makes room on the step. “Sit. You are wet and I have been cold for an hour, so we are even.” Then, before you can ask: “You were told: down to the water, and don’t stop at the pool. Yet here I am.” He lets that land. “Ask yourself who heard those words before you did.”",
      [["“Why are you here?”", s2]]);
    const s2 = () => { fact("heardfirst", "Haller, on the pool steps, knew the envelope's words: 'down to the water, and don't stop at the pool. Yet here I am. Ask yourself who heard those words before you did.'");
      card(null, "“To make the offer once more, in daylight, where you can see my face.” <b>Five thousand.</b> “Not for the book. For the trouble it will cause people who do not deserve it. Your grandmother friend. The Armenian with the boy. The old man who sent you, who has not slept since Tuesday.”",
        [["“That sounds like a threat.”", s3]]); };
    const s3 = () => card(null, "“No. A threat promises what will happen. I am telling you what already has.”",
      [["“It isn’t for sale.”", s4]]);
    const s4 = () => card("“Then I will give you something instead.”", "He nods as if he expected it. “Since you will not take money.” From the inside of the folded coat, a page: the Watchman’s hand, or near enough; the paper right; a lamp drawn in the corner. “I found it first. In the tunnel, a week ago. It is yours; I am not a thief.” He stands. “Read it. Then decide which of us has been honest with you today.”",
      [["Take the page", forged]], { clip: "haller-page" });
    const forged = () => { a.q.bench3 = 1; save(); give("forgery", true); F.S("journal");
      K.card('<div class="kick">A page · from Haller’s coat</div><h2>Blue ink, and a small drawn lamp</h2><img class="fphoto1" src="' + PZ + 'forgery.jpg" alt="A journal page on a wet step, a lamp drawn in the corner">' +
        F.wnote("“The water comes out at the pool and the answer is above it, where everyone has always said: on the rock, under the gold. Go up by the ramp and measure nothing. It is finished.”") +
        "<p>The paper is right. The hand is close. The journal opens by itself to the drawing you made in the tunnel an hour ago, and lays the two lamps side by side.</p>" +
        '<button class="cta" data-act="x">Which is his?</button>', { x: proof }); };
    s1();
  }
  function proof() {
    const a = A();
    const judge = (right) => {
      a.q.proof = 1; delete a.items.forgery; save();
      fact("forgery", "Haller's page from the pool steps: FORGED. The lamp faces the wrong way. " + (right ? "You saw it at once." : "You believed it for a minute. So would most people. That is what it is for."));
      if (right) { ok(); K.card('<div class="kick">The journal</div><h2>Forged</h2><p>His lamp points to the right. Always. The lamp on Haller’s page points to the left, and the hand that drew it does not shake. The page is struck through in the journal: <b>FORGED — the lamp faces the wrong way. Haller.</b></p>' +
          "<p>He watches you see it, and nods once, as if you had passed something, and turns to go up the road. His shoes, you notice, are completely dry.</p>" +
          '<button class="cta" data-act="x">“He does not answer his telephone, does he.”</button>', { x: last }); }
      else { F.S("knock", null, 0.6); K.card('<div class="kick">The journal</div><h2>“Good.”</h2><p>That is all he says, and he turns and walks up the Pilgrim Road. A screen later the journal catches what you did not: his lamp points to the right. Always. The one on Haller’s page points to the left. The page is struck through: <b>FORGED — the lamp faces the wrong way. Haller.</b></p>' +
          "<p><i>You believed it for a minute. So would most people. That is what it is for.</i> His shoes, as he went, were completely dry.</p>" +
          '<button class="cta" data-act="x">“He does not answer his telephone, does he.”</button>', { x: last }); }
    };
    const last = () => K.card('<div class="ftalk">' + portrait("hallerpool", PEOPLE.hallerpool) + '<div><div class="kick">Victor Haller · from the road, not turning round</div><h2>“He never does.”</h2></div></div>' +
      '<div class="fhim">“He does not answer his telephone, does he. He never does. He waits to be visited.” And he is gone up the hill, fast, dry-shod, the grey coat small against the lit steel of the Pilgrim Road.</div>' +
      "<p>Dry shoes. He has searched these steps for a week. He has never once stood in the water.</p>" +
      '<button class="cta" data-act="x">Look at the water at the foot of the steps</button>', { x: () => C.walk(C.V("pool")) });
    K.card('<div class="kick">The journal · two lamps</div><h2>Which is his?</h2>' +
      '<div class="fproof"><button data-act="l"><img src="' + PZ + 'forgery.jpg" alt="The lamp on Haller’s page"><span>Haller’s page</span></button><button data-act="r"><img src="' + PZ + 'charcoal-tunnel.jpg" alt="The charcoal lamp in the tunnel"><span>The tunnel wall</span></button></div>' +
      '<p class="fsmall">Tap the one the Watchman drew.</p>', { l: () => judge(false), r: () => judge(true) });
  }
  C.ACTS_FN.tubeDown = () => {
    const a = A();
    if (!a.q.proof) { K.say("Clear water over old stone. Nothing to see from here, and a man on the steps who has been waiting for you.", "", 3200); return; }
    if (W().pages[10]) { K.say("Where the brass tube was. The water has already smoothed the place.", "", 2600); return; }
    K.card('<div class="kick">The foot of the steps</div><h2>Under the water</h2><img class="fphoto1" src="' + PZ + 'brasstube.jpg" alt="A small brass tube under clear water in a crack between two stones">' +
      "<p>You step down into the pool, wet to the knee again, and the lamp’s reflection shows it: in a crack between two stones, a small brass tube with a waxed stopper, and scratched on it, a lamp, spout to the right.</p>" +
      "<p>Where the forgery told you not to look. Where a man who will not get wet could never have looked.</p>" +
      '<button class="cta" data-act="x">Break the wax</button>', { x: () => { give("brasstube", true); ok(); C.page(10, () => C.finish("siloam")); } });
  };

  /* ------------------------------------------------------------ gates, before, lists, tasks, hints ------------------------------------------------------------ */
  const gate2 = H.gate, before2 = H.before, list2 = H.list, task2 = H.task, hint2 = H.hint, dev2 = H.devDone;
  H.gate = (s, from) => {
    if (!from || from.id === s.id) return true;
    if (s.id === "hebron" && !A().q.envelope2) { morning(() => FW.go(s.id)); return false; }
    if (s.id === "zion") return ride("zion", () => FW.go(s.id));
    if (s.id === "cod" && !has("codticket")) {
      K.card('<div class="kick">The City of David</div><h2>The ticket desk</h2><p>“One adult? Thirty shekels. That covers the water system and the tunnel, if you are going through. It closes at four.”' + (A().money < 30 ? '</p><p class="fwarn">You count your money: ' + A().money + ' shekels. Not enough.' : "") + '</p><button class="cta" data-act="b">Buy a ticket (30 shekels)</button><button class="cta alt" data-act="x">Not now</button>',
        { b: () => { if (pay(30, "the City of David ticket")) { give("codticket", true); FW.go(s.id); } }, x: () => {} }); return false;
    }
    if (s.id === "hezekiah") {
      if (!A().q.tunnelOk) { K.say("The guard at the tunnel mouth shakes his head: last passage of the day, and only with the dig’s say-so. Dr Adler, up on the walkway.", "", 3600); return false; }
      if (!W().flags.lit) { K.say("You will not get ten metres in there without a light. Fill the lamp: Mahmoud, by the spring.", "", 3200); return false; }
    }
    return gate2 ? gate2(s, from) : true;
  };
  H.before = (scene, v, prev) => {
    if (scene.id === "zion" && v.id === "up") { A().q.pit = 1; save(); }
    if (scene.id === "siloam" && v.id === "pool" && !A().q.sawHaller) {
      A().q.sawHaller = 1; save();
      setTimeout(() => K.root() && W().at === "siloam" && K.card('<div class="kick">The path to the great pool</div><div class="ftalk">' + portrait("hallerfront", PEOPLE.hallerpool) + '<div><div class="kick">From above</div><h2>He is waiting.</h2></div></div>' +
        "<p>Before you reach it you can see, from above, the broad stone steps of the Second Temple pool, and on them, with his coat folded beside him, a man sitting and watching the way you must come. He has been there a while.</p>" +
        '<button class="cta" data-act="x">Down the path</button>', { x: () => {} }), 500);
    }
    if (scene.id === "steps" && v.id === "candle3" && !done("steps", "ascents")) { K.say("The boys are still singing. Climb the steps with them first.", "", 2600); return false; }
    return before2 ? before2(scene, v, prev) : true;
  };
  const r = (t, ok, where, opt) => ({ t, ok: !!ok, where, opt: !!opt });
  const L3 = {
    hebron: (a, w) => [r("Ask Reb Shimon about the cave", a.q.shimon, "The old caretaker in the hall"), r("Set the three payments", done("hebron", "bought"), "Abraham’s marker"), r("Talk to the soldier on the bus", a.q.ori, "The bus", 1)],
    zion: (a, w) => [r("Ask Yitzhak what he is reading", a.q.yitzhak, "By the cenotaph"), r("Set the compass: the sides of the north", done("zion", "north"), "David’s Tomb"), r("Go down into the pit, and look up", a.q.pit, "The House of Caiaphas, down the slope")],
    cod: (a, w) => [r("Ask Dr Adler about the man with the rod", a.q.adler, "The walkway above the dig"), r("Pin Zion on the ridge", done("cod", "zionq"), "The view over the excavations"), r("Read the sign about the Ark", w.flags.arksign, "By the entrance", 1)],
    gihon: (a, w) => [r("Buy oil from Mahmoud", has("oil"), "The kiosk by the spring"), r("Find the Watchman’s mark by the water", done("gihon", "lampstone"), "The rock wall by the spring"), r("Ask Mahmoud who went in today", a.q.dryshoes, "Mahmoud", 1)],
    hezekiah: (a, w) => [r("Through the tunnel, in the dark", done("hezekiah", "darktunnel"), "Follow the water")],
    siloam: (a, w) => [r("Open the watercourse: sent, and came seeing", done("siloam", "siloamq"), "The Byzantine pool, where the tunnel comes out"), r("Sit down with the man on the steps", a.q.bench3, "The great pool"), r("Which lamp is his?", a.q.proof, "The journal"), r("Look under the water at the foot of the steps", w.pages[10], "Where he would not go")],
    steps: (a, w) => [r("Ask the rabbi what they are singing", a.q.avner, "The broad steps"), r("Climb the fifteen steps with them", done("steps", "ascents"), "The stair"), r("The third candle", w.done.steps, "From the top step, across the valley")],
  };
  H.list = (scene) => (L3[scene.id] ? L3[scene.id](A(), W()) : list2 ? list2(scene) : null);
  H.devDone = (id) => {
    const a = A(), w = W(), q = a.q, it = a.items, pz = (k) => (w.done[k] = 1);
    const D = {
      hebron: () => { q.envelope2 = 1; q.shimon = 1; it.envelope2 = 1; pz("hebron:bought"); },
      zion: () => { q.yitzhak = 1; q.pit = 1; pz("zion:north"); w.pages[9] = 1; },
      cod: () => { q.adler = 1; q.tunnelOk = 1; it.codticket = 1; w.flags.watchmanName = 1; pz("cod:zionq"); },
      gihon: () => { it.oil = 1; q.oilIn = 1; w.flags.lit = 1; pz("gihon:lampstone"); },
      hezekiah: () => { pz("hezekiah:darktunnel"); w.flags.watchmanAlive = 1; },
      siloam: () => { pz("siloam:siloamq"); q.sawHaller = 1; q.bench3 = 1; q.proof = 1; it.brasstube = 1; w.pages[10] = 1; },
      steps: () => { q.avner = 1; pz("steps:ascents"); },
    };
    if (D[id]) D[id](); else if (dev2) dev2(id);
  };
  H.task = (scene) => {
    const a = A();
    const WHY = {
      hebron: "Hebron first, as he did. The old caretaker in the hall knows what the cave cost.",
      zion: "Mount Zion, where they say David lies. Page 9 is in the cover of the tomb, and the psalm-reader has the line.",
      cod: "Down to where the city began. The archaeologist on the walkway knew the Watchman.",
      gihon: "Down to the spring. Abu Sami said: oil where the king was anointed.",
      hezekiah: "Five hundred and thirty-three metres in the dark. The water knows the way.",
      siloam: "Out into the light. Don’t stop at the pool, he wrote. Someone is waiting at it.",
      steps: "The pilgrims’ stair. Fifteen steps, fifteen songs, and the third candle.",
    };
    if (scene.id === "hezekiah" && !done("hezekiah", "darktunnel")) return WHY.hezekiah;
    if (scene.id === "siloam" && a.q.bench3 && !a.q.proof) return "Two lamps in the journal. Which is his?";
    if (scene.id === "siloam" && a.q.proof && !W().pages[10]) return "His shoes were dry. Where would a man who will not get wet never look?";
    if (L3[scene.id]) { const left = H.left(scene) || ""; const need = L3[scene.id](a, W()).filter((x) => !x.opt); const fresh = need.filter((x) => !x.ok).length === need.length; return ((fresh && WHY[scene.id]) ? WHY[scene.id] + " " : "") + left || null; }
    return task2 ? task2(scene) : null;
  };
  H.hint = (scene, v, n) => {
    if (scene.id === "hebron" && !done("hebron", "bought")) return n === 1 ? "Each marker carries a Scripture reference. The payments are in those verses." : "Silver for the cave, money for the field at Shechem, gold for Ornan’s place.";
    if (scene.id === "zion" && !done("zion", "north")) return n === 1 ? "Yitzhak read you the line: the sides of the north. Turn the compass until north is up." : "Each tap turns the card 45 degrees. Eight taps round.";
    if (scene.id === "cod" && !done("cod", "zionq")) return n === 1 ? "David’s city is the narrow ridge below the Mount, not the Mount." : "The spring is on the ridge’s eastern side. Pin the ridge, halfway down.";
    if (scene.id === "gihon" && !done("gihon", "lampstone")) return n === 1 ? "Carry the light slowly along the whole wall, low and high." : "The marked stone is on the right, low.";
    if (scene.id === "hezekiah") return n === 1 ? "Which way does the water go?" : n === 2 ? "Listen. Lower the lamp. Drop something on the water. The water runs toward Siloam." : "The true opening is the one the water flows into. The dry one is a dead end.";
    if (scene.id === "siloam" && !done("siloam", "siloamq")) return "Begin where the water rises: the spring, then the tunnel, then the pool.";
    if (scene.id === "siloam" && A().q.bench3 && !A().q.proof) return n === 1 ? "Look at the two little lamps. Which way does the spout point on each?" : "The Watchman draws his lamp with the spout to the right. Always.";
    if (scene.id === "siloam" && A().q.proof && !W().pages[10]) return "Mahmoud said: dry shoes. The water at the foot of the great steps.";
    return hint2 ? hint2(scene, v, n) : null;
  };

  /* ------------------------------------------------------------ the puzzles ------------------------------------------------------------ */
  /* 1. Bought, not taken: the Hebron puzzle, with Ornan's place stated both ways */
  C.PUZZLES.bought = { label: "Set the three payments", run: () => {
    const want = ["400 shekels of silver", "100 pieces of money", "600 shekels of gold"], placed = [0, 0, 0]; let held = -1;
    screen("Bought, not taken", "The Cave of Machpelah",
      verse("And Abraham weighed to Ephron the silver… four hundred shekels of silver, current money with the merchant.", "Genesis 23:16") +
      q("Three deed stones stand beside the cave. Place each payment on the land it purchased. The inscriptions give you the witnesses.") +
      '<div class="fdeeds">' + [["Machpelah", "Genesis 23:16"], ["Shechem", "Genesis 33:19"], ["Ornan’s place", "1 Chronicles 21:25"]].map((x, i) => '<button class="fdeed" data-d="' + i + '"><b>' + x[0] + '</b><small>' + x[1] + '</small><span id="fdeed-' + i + '">empty</span></button>').join("") + '</div>' +
      '<div class="fcoins">' + want.map((x, i) => '<button data-pay="' + i + '"><i>' + (i === 1 ? "◉" : "●") + '</i>' + x + '</button>').join("") + '</div><div class="fsmall" id="fpayread">Pick up a payment, then touch its deed stone.</div>', "abraham", "indoor");
    const redraw = () => document.querySelectorAll("[data-pay]").forEach((b) => { const i = +b.dataset.pay; b.classList.toggle("held", i === held); b.disabled = placed.includes(i + 1); });
    document.querySelectorAll("[data-pay]").forEach((b) => (b.onclick = () => { held = +b.dataset.pay; F.S("coin", "click", 0.6); redraw(); }));
    document.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => {
      const d = +b.dataset.d; if (held < 0 || placed[d]) return;
      if (held !== d) { wrong("The inscription and metal do not agree. Check the Scripture reference cut into the stone."); return; }
      placed[d] = held + 1; $("fdeed-" + d).textContent = "✓ " + want[held]; b.classList.add("on"); held = -1; F.S("lock", null, 0.55); redraw();
      if (placed.every(Boolean)) setTimeout(() => { W().flags.bought = 1; save(); fact("ornan", "Ornan's place: 600 shekels of gold (1 Chronicles 21:25). The threshing floor and the oxen: 50 shekels of silver (2 Samuel 24:24). Two accounts, one purchase, before witnesses.");
        K.card('<div class="kick">The Cave of Machpelah</div><h2>Three purchases, before witnesses</h2><p>Machpelah, Shechem, and Ornan’s place were bought publicly, and the price was written down. The third became the place of the Temple: “in mount Moriah… in the threshingfloor of Ornan the Jebusite” (2 Chronicles 3:1).</p>' +
          '<p class="fsmall">A note for the journal: Chronicles gives 600 shekels of gold for <i>the place</i>; Samuel gives 50 shekels of silver for <i>the threshing floor and the oxen</i>. Two accounts of one purchase. Both were paid.</p>' +
          '<button class="cta" data-act="x">The Lamplighter</button>', { x: () => { F.V("w-hebron-prices"); K.card('<div class="kick">The Lamplighter</div><h2>The witnesses</h2><div class="fend-said">“Remember the witnesses.”</div><button class="cta" data-act="x">Back to Jerusalem</button>', { x: () => C.pzDone("bought", () => C.finish("hebron")) }); } }); }, 700);
    }));
    redraw();
  } };

  /* 2. The sides of the north: the unpicked stitching, then the compass; page 9 */
  C.PUZZLES.north = { label: "The cover of the cenotaph", run: () => {
    let deg = 180;
    screen("The sides of the north", "David’s Tomb", q("One line of the embroidered psalm on the cover has been unpicked: the line Haller photographed. Under the loose threads, a small brass compass, its card turned round. Set north upright.") +
      '<div class="fcompass"><div class="fcompass-card" id="fcompass-card"><b>N</b><span>E</span><i>S</i><em>W</em><u>▲</u></div></div>' +
      '<div class="fdial2"><button id="fcleft">↶</button><button id="fcright">↷</button></div>' + verse("Beautiful for situation… is mount Zion, on the sides of the north, the city of the great King.", "Psalm 48:2"), "tomb", "indoor", "zion-tomb");
    const draw = () => { $("fcompass-card").style.transform = "rotate(" + deg + "deg)"; };
    const turn = (d) => { deg = (deg + d + 360) % 360; draw(); F.S("step", "click", 0.45); if (!deg) setTimeout(() => { ok(); K.card('<div class="kick">Psalm 48</div><h2>North</h2><p>With the compass true, north points up the ridge: toward the Temple Mount’s northern summit, not the gold dome. Folded inside the cover where the stitching was opened, a page.</p><button class="cta" data-act="x">Take the page</button>', { x: () => C.pzDone("north", () => C.page(9, () => C.walk(C.V("tomb")))) }); }, 500); };
    $("fcleft").onclick = () => turn(-45); $("fcright").onclick = () => turn(45); draw();
  } };

  /* 3. Pin Zion on the ridge, then Dr Adler's authorisation on the back of the ticket */
  const zionq1 = C.PUZZLES.zionq.run;
  C.PUZZLES.zionq = { label: "Pin Zion on the ridge", run: () => {
    screen("The strong hold of Zion", "The City of David", q("The trader’s old map has lost its brass location pin. Put the pin on David’s original city: the narrow ridge south of the Temple Mount.") +
      '<div class="fzionmap"><img src="' + PZ + 'citymap.jpg" alt="Old map of the City of David and Temple Mount"><button data-z="0" style="left:49%;top:22%">A</button><button data-z="1" style="left:54%;top:62%">B</button><button data-z="2" style="left:24%;top:50%">C</button></div>' + verse("Nevertheless David took the strong hold of Zion: the same is the city of David.", "2 Samuel 5:7"), "view", "street");
    document.querySelectorAll("[data-z]").forEach((b) => (b.onclick = () => {
      if (+b.dataset.z !== 1) { wrong(+b.dataset.z === 0 ? "That is Mount Moriah, the Temple hill north of David’s first city." : "That is outside the narrow ridge. Follow the spring and the old walls."); return; }
      b.classList.add("on"); F.S("lock", null, 0.55); setTimeout(() => K.card('<div class="kick">The City of David</div><h2>The ridge below the Mount</h2><p>The pin sits on Zion, David’s city: the city he took. Immediately north is the higher Temple hill, the floor he later paid for. The city grew uphill toward the house of God.</p><button class="cta" data-act="x">Down to the spring</button>',
        { x: () => C.pzDone("zionq", () => authorise(() => C.finish("cod", () => C.walk(C.V("descent"))))) }), 600);
    }));
  } };
  function authorise(then) {
    A().q.tunnelOk = 1; save();
    K.card('<div class="ftalk">' + portrait("adler", PEOPLE.adler) + '<div><div class="kick">Dr Adler</div><h2>“It closes at four.”</h2></div></div>' +
      '<div class="fhim">Without being asked, she takes your ticket, turns it over and writes on the back. “You will be the last one in. Show that to Mahmoud at the spring, and tell him I said so. The staff at the pool will know you are inside. Nobody is left in that tunnel. Ever.”</div>' +
      '<button class="cta" data-act="x">“Thank you.”</button>', { x: then });
  }

  /* 4. The anointing: the one marked stone by the spring; Lamp 5 */
  const lamp1 = C.PUZZLES.lampstone.run;
  C.PUZZLES.lampstone = { label: "Look along the rock", run: () => {
    if (!has("oil")) { K.say("Too dark to search the wall without a light, and a lamp with no oil in it. Mahmoud sells oil.", "", 3200); return; }
    C.find({ title: "The anointing of Solomon", kick: "The Gihon Spring", dark: true, img: "pz:gihon-wall", scene: "The rock wall by the spring", intro: verse("And Zadok the priest took an horn of oil out of the tabernacle, and anointed Solomon. And they blew the trumpet; and all the people said, God save king Solomon.", "1 Kings 1:39"),
      q: "Mahmoud lights the lamp from his kettle flame. Drag your finger to carry the light along the wall. One stone carries the Watchman’s lamp: the oldest mark he left in the city.", counter: "Found", last: "The lamp",
      spots: [{ label: "A wet stone", at: [8, 70], w: 16, h: 14, decoy: true, text: "Wet, green, nothing on it." }, { label: "A flat stone", at: [30, 74], w: 16, h: 14, decoy: true, text: "Flat and dry. Nothing." }, { label: "A cracked stone", at: [52, 70], w: 16, h: 14, decoy: true, text: "Cracked through. Nothing." }, { label: "A stone with a mark", at: [80, 56], w: 16, h: 14, text: "Scratched into the stone above the water, small and worn: a lamp, spout to the right. Where Solomon was anointed. The oldest mark he left anywhere in the city." }, { label: "A rounded stone", at: [40, 50], w: 14, h: 12, decoy: true, text: "Round and smooth. Nothing." }],
      done: () => { W().flags.lit = 1; save(); fact("gihonlamp", "The Watchman's lamp scratched above the Gihon Spring, where Solomon was anointed: his oldest mark."); FW.lightLamp(5, () => K.card('<div class="kick">The Gihon Spring</div><h2>Lit</h2>' + clip("mahmoud-lamp") + '<p>Mahmoud reads Dr Adler’s note on the ticket, lights the lamp from his kettle flame, and picks up his telephone to tell the pool. “They will count you out the other end. Keep it low. The air is good but the roof is not. And do not stop for anything that is not his.”</p><button class="cta" data-act="x">To the tunnel mouth</button>', { x: () => C.pzDone("lampstone", () => C.finish("gihon", () => C.walk(C.V("mouth")))) })); } });
  } };

  /* 5. The water knows the way: three forks in the dark, then the meeting point, then the charcoal. Lamp 6. */
  C.PUZZLES.darktunnel = { label: "Go in", run: () => {
    const w = W(); let dim = w.flags.tunnelDim || 0;
    const FORKS = [
      { img: "tunnel-fork-left2", truth: "l", tool: "Listen", used: "You stand still. The water is louder on the left: it is going somewhere. On the right, nothing moves.", sfx: "water", buzz: "l" },
      { img: "tunnel-fork-right", truth: "r", tool: "Lower the lamp", used: "You hold the lamp at the water. The flame leans to the right, steady, pulled by the draught that follows the water.", clip: "flame-leans" },
      { img: "tunnel-fork-left", truth: "l", tool: "Drop a scrap of the envelope", used: "You tear a corner from the Lamplighter’s envelope and set it on the water. It turns once, and drifts left, and is gone into the dark.", clip: "scrap-drifts" },
    ];
    const shade = () => '<div class="ftun-dim" style="opacity:' + (dim * 0.16) + '"></div>';
    const fork = (i) => {
      const f = FORKS[i]; let shown = false;
      const el = screen("Hezekiah’s Tunnel", "In the dark", (i === 0 ? verse("This same Hezekiah also stopped the upper watercourse of Gihon, and brought it straight down to the west side of the city of David.", "2 Chronicles 32:30") : "") +
        (i === 0 ? '<p class="fsmall">The real tunnel is one long winding channel. The forks here are adapted from the abandoned cuttings the diggers left, not a map of it.</p>' : "") + q(i === 0 ? "The tunnel forks. The diggers cut false starts and turned back; the water did not. The water runs toward Siloam." : i === 1 ? "A second fork. The lamp knows the draught that follows the water." : "A third fork, the last. You have one thing left in your pocket that floats.") +
        '<div class="ftun"><img src="' + IMG + f.img + '.jpg" alt="A fork in the tunnel">' + shade() + '<button class="fhit ftun-l" data-go="l" aria-label="The left opening"></button><button class="fhit ftun-r" data-go="r" aria-label="The right opening"></button></div>' +
        '<div class="ftun-tools"><button class="fbtn" id="ftool">' + esc(f.tool) + '</button><span class="fsmall" id="ftoolsay"></span></div>', null, "chamber", f.img);
      $("ftool").onclick = () => {
        shown = true; $("ftoolsay").textContent = f.used; if (f.sfx) F.S(f.sfx, null, 0.7); K.buzz && K.buzz("success");
        if (f.clip && CLIPS.has(f.clip)) { K.card('<div class="kick">In the dark</div>' + clip(f.clip) + "<p>" + esc(f.used) + "</p>" + '<button class="cta" data-act="x">Choose</button>', { x: () => {} }); }
      };
      el.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => {
        if (b.dataset.go === f.truth) { F.S("water", "click", 0.5); if (i < 2) fork(i + 1); else meeting(); }
        else dead(i);
      }));
    };
    const dead = (i) => {
      dim = Math.min(dim + 1, 3); w.flags.tunnelDim = dim; save(); F.S("knock", null, 0.5); K.buzz && K.buzz("error");
      screen("A dead end", "In the dark", q("A few metres, and the roof comes down and the rock closes. The water on the floor is still and black. The flame bends, and shrinks, and does not go out. You back out the way you came." + (dim >= 2 ? " The light is smaller than it was." : "")) +
        '<div class="ftun"><img src="' + IMG + 'tunnel-deadend.jpg" alt="A dead end in the tunnel">' + shade() + '</div><button class="fbtn" id="fback">Back to the fork</button>', null, "chamber", "tunnel-deadend");
      $("fback").onclick = () => fork(i);
    };
    const meeting = () => {
      screen("The meeting point", "Hezekiah’s Tunnel", q("The roof rises and the walls change. Here the two teams met, cutting toward each other by the sound of each other’s picks. The marks slant one way on the left wall and the other way on the right.") +
        '<div class="ftun"><img src="' + IMG + 'tunnel-meeting.jpg" alt="The meeting point of the two tunnels">' + shade() + '<button class="fhit" style="left:8%;top:30%;width:34%;height:40%" id="finscr" aria-label="The wall where the inscription was cut"></button></div>' +
        '<button class="fbtn" id="flow">Hold the lamp low</button>', null, "chamber", "tunnel-meeting");
      $("finscr").onclick = () => K.card('<div class="kick">The meeting point</div><h2>The Siloam inscription</h2><img class="fphoto1" src="' + PZ + 'siloam-inscription.jpg" alt="A pencil copy of the Siloam inscription in a notebook">' +
        "<p>The inscription was cut here in Hezekiah’s time, in the late eighth century BC; the stone itself is in Istanbul. A copy is in the journal: “…and while there were still three cubits to be cut through, there was heard the voice of a man calling to his fellow… and on the day of the breakthrough the quarrymen struck, each man toward his fellow, axe against axe, and the water flowed.”</p>" +
        '<button class="cta" data-act="x">Close</button>', { x: () => {} });
      $("flow").onclick = recess;
    };
    const recess = () => {
      screen("Low on the wall", "Hezekiah’s Tunnel", q("At knee height, beside the meeting point, a shallow dry recess in the wet rock. Something is drawn in it.") +
        '<div class="ftun"><img src="' + IMG + 'tunnel-recess.jpg" alt="A recess in the tunnel wall with a drawing in it">' + shade() + '<button class="fhit" style="left:60%;top:40%;width:34%;height:34%" id="frecess" aria-label="The recess"></button></div>', null, "chamber", "tunnel-recess");
      $("frecess").onclick = charcoal;
    };
    const charcoal = () => {
      K.card('<div class="kick">The dry recess</div><img class="fphoto1 fcharcoal" src="' + PZ + 'charcoal-tunnel.jpg" alt="Charcoal on dry stone: a lamp, a date, three words">' +
        '<div class="fend-said fcharcoal-words">A lamp, spout to the right.<br>A date: this week. Six days ago.<br><b>Still watching. Hurry.</b></div>' +
        '<button class="cta" data-act="x">…</button>', { x: () => {
          w.flags.watchmanAlive = 1; save(); fact("alive", "Charcoal in a dry recess at the meeting point of Hezekiah's Tunnel, dated six days ago: his lamp, and three words. 'Still watching. Hurry.' The Watchman, Yoel, is alive.");
          K.card('<div class="kick">Hezekiah’s Tunnel</div><h2 class="falive">He is alive.</h2><p>Six days ago he stood where you are standing, with a lamp, and wrote three words for whoever came next. The pages were never a dead man’s last word. Someone is waiting at the end of them.</p><button class="cta" data-act="x">The sixth lamp</button>',
            { x: () => FW.lightLamp(6, () => K.card('<div class="kick">The journal</div><h2>Six of seven</h2><p>Six of seven lamps found. The last is still his to show you.</p><p>The rest of the tunnel is short, and the water deeper, and then light.</p><button class="cta" data-act="x">Out to the pool</button>', { x: () => C.pzDone("darktunnel", () => C.finish("hezekiah", () => FW.go("siloam"))) })) });
        } });
    };
    fork(0);
  } };

  /* 6. Sent, and came seeing: at the Byzantine pool; the place of page 10, not the page */
  C.PUZZLES.siloamq = { label: "Open the watercourse", run: () => {
    let n = 0;
    screen("Sent through the rock", "The Pool of Siloam", q("Three stone sluices show the path of the water. Open them in the direction the water was sent: spring, tunnel, pool.") +
      '<div class="fwaterpath"><button data-w="0"><i>♨</i><b>Gihon Spring</b></button><span>→</span><button data-w="1"><i>▰</i><b>Hezekiah’s Tunnel</b></button><span>→</span><button data-w="2"><i>≈</i><b>Pool of Siloam</b></button><div id="fwaterfill"></div></div>' +
      verse("Go, wash in the pool of Siloam, (which is by interpretation, Sent.) He went… and came seeing.", "John 9:7"), "water", "olives", "siloam-water");
    document.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => {
      const i = +b.dataset.w; if (i !== n) { wrong("The water cannot reach that stone yet. Begin where it rises."); return; }
      b.classList.add("on"); n++; $("fwaterfill").style.width = (n * 33.34) + "%"; F.S("water", "click", 0.55);
      if (n === 3) setTimeout(() => { ok(); K.card('<div class="kick">The Pool of Siloam</div><h2>Sent, and came seeing</h2><p>The water runs from the spring, through the dark rock, into the pool. This is the place of the tenth page: the water’s end. The page itself is not here, not on any step you can see. The great pool is a little further on.</p><button class="cta" data-act="x">On to the great pool</button>', { x: () => C.pzDone("siloamq", () => C.walk(C.V("pool"))) }); }, 700);
    }));
  } };

  /* 7. The fifteen steps: a coda, not a puzzle. Tap the steps in time with the boys; no wrong answers. */
  const PSALMS = ["In my distress I cried unto the LORD", "I will lift up mine eyes unto the hills", "I was glad when they said unto me", "Unto thee lift I up mine eyes", "If it had not been the LORD who was on our side", "They that trust in the LORD shall be as mount Zion", "When the LORD turned again the captivity of Zion", "Except the LORD build the house", "Blessed is every one that feareth the LORD", "Many a time have they afflicted me from my youth", "Out of the depths have I cried unto thee", "LORD, my heart is not haughty", "LORD, remember David", "Behold, how good and how pleasant it is", "Behold, bless ye the LORD, all ye servants of the LORD"];
  C.PUZZLES.ascents = { label: "Climb the fifteen steps", run: () => {
    let n = 0;
    screen("The Songs of Ascents", "The Southern Steps", q("Fifteen psalms, 120 to 134, one for each step. The boys sing the first words of each as you climb. Tap the next step in time with them.") +
      '<div class="fascents" id="fascents"><div class="fpilgrim" id="fpilgrim">♟</div>' + Array.from({ length: 15 }, (_, i) => '<button data-step="' + i + '"><span>' + (134 - i) + '</span></button>').join("") + '</div>' +
      '<div class="fsmall fsung" id="fstepread">Psalm 120 · “' + esc(PSALMS[0]) + '…”</div>', "steps", "olives", "steps-steps");
    document.querySelectorAll("[data-step]").forEach((b) => (b.onclick = () => {
      if (n >= 15) return;
      document.querySelectorAll("[data-step]")[n].classList.add("on"); n++; $("fpilgrim").style.bottom = (5 + n * 5.55) + "%"; F.S("step", "click", 0.45);
      $("fstepread").textContent = n < 15 ? "Psalm " + (120 + n) + " · “" + PSALMS[n] + "…”" : "Psalm 134 · the gate";
      if (n === 15) setTimeout(() => { ok(); K.card('<div class="kick">The Southern Steps</div><h2>Within thy gates</h2>' + clip("avner-sing") + '<p>Fifteen rises, fifteen songs. Pilgrims climbed toward the Huldah Gates and went in to the house. The gates are blocked now, and the boys are on their fourth psalm of three. Across the valley, the light is going.</p><button class="cta" data-act="x">The top step</button>', { x: () => C.pzDone("ascents", () => C.walk(C.V("candle3"))) }); }, 600);
    }));
  } };

  /* ------------------------------------------------------------ the end of the act ------------------------------------------------------------ */
  C.ACTS_FN.endAct3 = () => {
    const a = A(), w = W();
    if (w.done.steps) { K.card('<div class="kick">Act 3</div><h2>The third night</h2>' + FW.hanukkiahHTML(3) + '<button class="cta" data-act="x">Close</button>', { x: () => {} }); return; }
    F.S("harp", null, 0.6); F.V("w-act3-end");
    K.card('<div class="kick">Act 3 · Down to the Water</div><h2>The third candle</h2>' + FW.hanukkiahHTML(3) +
      '<div class="fend-said"><span class="fend-who">The Lamplighter</span>“Three candles. Six lamps, and the seventh is his.<br><br>You have a question for me. Hold it until the garden, and I will answer it there, with the tree between us, because I am not brave enough to answer it anywhere else.<br><br>Tomorrow: everything is ready but one thing.”</div>' +
      '<button class="cta" data-act="n">The night</button>', { n: () => {
        F.S("harp", null, 0.4);
        K.card('<div class="kick">The third night · the hotel</div><h2>The lamp on the desk is still warm.</h2>' +
          '<p>You write one line in the journal, under the page that is not his: <i>He said: ask yourself who heard those words before you did.</i></p>' +
          '<p>Then you turn the Lamplighter’s envelope over again, and look at the number on the flap for a long time, and do not ring it.</p>' +
          '<button class="cta" data-act="x">End of Act 3</button>', { x: () => C.finish("steps") });
      } });
  };

  /* the tester's shortcut: Act 3 as if played */
  FW.devAct3 = () => {
    if (FW.devAct2) FW.devAct2();
    ["hebron", "zion", "cod", "gihon", "hezekiah", "siloam", "steps"].forEach((id) => { H.devDone(id); W().done[id] = 1; });
    const w = W(); if (FW.lamps) { const L = FW.lamps(); L[5] = 1; L[6] = 1; } w.flags.actcard3 = 1; save();
  };
})();
