/* Episode 1, Act 2: Watchmen on the Walls — the adventure layer (people, money, the ten puzzles, the two paths, lamps 3 and 4).
   Script: the Claude Doc "Episode 1, Act 2: Watchmen on the Walls — The Script" (1 Nov 2026). Built on js/fsy-act1.js's machinery (FW.adv). */
(function () {
  const FW = Lamp.fsyWalk; if (!FW || !FW.adv) return;
  const H = FW.H, C = FW.core, W = FW.W, K = Lamp.adv.kit, F = Lamp.fsy.parts, esc = K.esc, $ = (id) => document.getElementById(id);
  const { PEOPLE, ITEMS, PORTRAITS, CLIPS, A, has, done, give, reply, fact, portrait } = FW.adv;
  const save = () => Lamp.save(), IMG = "img/fsy/w/", PZ = "img/fsy/pz/";
  const wrong = (m) => C.wrong(m);
  const clip = (id) => (H.clip && CLIPS.has(id) ? H.clip(id) : "");
  ["avi", "avi2", "hagop", "kasparian", "talia", "grandmawall", "eliezer", "noa", "hollis", "hallerbench", "trader", "abusami"].forEach((p) => PORTRAITS.add(p));
  ["eliezer-covenant", "abusami", "kasparian", "lampstall", "forgerystone", "bench", "footprints"].forEach((c) => CLIPS.add(c));
  /* the puzzle screen, as fsy-route's screen(): title, kick, html, a Back button to the view */
  function screen(title, kick, html, backTo, amb, bg) {
    F.M("puzzle", amb || "street");
    const ttl = document.getElementById("adv-ttl"), same = ttl && ttl.textContent.trim() === kick;
    const el = F.stage((same ? "" : '<div class="fkick">' + esc(kick) + "</div>") + "<h1>" + esc(title) + "</h1>" + html + F.back("Back"), bg ? "w/" + bg + ".jpg" : "temple-painting.jpg");
    F.wire(el, () => C.walk(C.V(backTo)));
    return el;
  }
  const q = (t) => '<div class="fq">' + esc(t) + "</div>";
  const verse = (t, ref) => '<div class="fverse">“' + esc(t) + "”<small>" + esc(ref) + "</small></div>";
  const ok = () => { F.S("harp", null, 0.6); K.buzz("success"); };

  /* ------------------------------------------------------------ things ------------------------------------------------------------ */
  Object.assign(ITEMS, {
    rticket: ["A Ramparts Walk ticket", "From Avi's booth at Jaffa Gate. Twenty shekels. South section open; north locked."],
    key: ["A large iron key", "Avi's key to the north section of the wall, found wet under the doves' arch."],
    tile: ["A painted Armenian tile", "Blue and white, from Mr Kasparian, for bringing Hagop's kite down. A keepsake."],
    charcoal: ["A stick of charcoal", "Half of Talia's drawing charcoal, from the Burnt House. For rubbings."],
    citymap: ["An old map of the City of David", "Drawn in 1910. A narrow ridge like a thumb pointing south, two valleys meeting at its tip, a spring marked halfway down the eastern one. From the trader, for the bekah."],
    hallernote: ["Haller's note", "Folded in the parcel with the journal: “Keep it. I have what I needed. — V.H.”"],
  });

  /* ------------------------------------------------------------ people ------------------------------------------------------------ */
  const pay = (n, what) => H.pay(n, what);
  Object.assign(PEOPLE, {
    avi: { name: "Avi, the ticket man", kick: "The Ramparts booth", desc: "A man in his sixties in a flat cap and a cardigan, leaning out of a small wooden booth with an old radio on the shelf. Talks to everyone, loses everything.", lines: [
      { id: "ticket", say: "One ticket for the Ramparts.", when: () => !has("rticket"), run: () => reply("avi", "“Twenty shekels. South is open. North is locked, because I lost the key.” He pats his pockets, one after another. “Again.”", { btn: "Buy a ticket (20 shekels)", then: () => { if (pay(20, "the Ramparts ticket")) give("rticket"); } }) },
      { id: "lost", say: "Where did you lose the key?", when: () => has("rticket") && !A().q.keyQuest, run: () => { A().q.keyQuest = 1; save(); fact("avikey", "Avi lost the key to the north wall up on the walk, this morning, 'where the doves sit': an arch the doves love. Find it and he pays forty."); reply("avi", "“Up there, this morning, checking the doors. Where the doves sit. There is an arch; the doves love it.” He shrugs. “Find it and I give you your twenty back, and twenty more.”"); } },
      { id: "grey", say: "Did a man in a grey coat come through?", when: () => has("rticket") && !A().q.aviGrey, run: () => { A().q.aviGrey = 1; save(); fact("aviname", "Haller came back down from the wall and asked Avi whether a tourist with a backpack had been through. He said your name."); reply("avi", "“Went up this morning. No ticket. I shouted, he did not turn round.” He looks at you properly for the first time. “He came back down ten minutes later and asked me if a tourist with a backpack had been through. He said your name.” A beat. “I said I do not remember names. I remember faces.” He taps his temple. “I remember his.”" + (A().q.sold ? "<br><br>“He was carrying a parcel when he went up and not when he came down. I did not ask.”" : ""), { clip: "avi" }); } },
      { id: "north", say: "How do I get onto the north wall?", when: () => has("rticket"), run: () => reply("avi", "“With my key, which I do not have. The door is on the wall past the doves. When the rain stops I go up and try every key I own.”") },
    ] },
    avi2: { name: "Avi, at the north door", kick: "On the wall", desc: "Avi, out of breath, a ring of keys in his hand, trying each one in the iron door across the walk.", lines: [
      { id: "key", say: "(Give him the key)", when: () => has("key"), run: () => { delete A().items.key; A().q.northOpen = 1; save(); H.earn(40, "Avi, for his key"); reply("avi2", "“My key!” He holds it up to the light like a coin. “You are a good person. Forty shekels, as I said, and the north is yours.” The lock turns with a sound like a cough, and the iron door swings in. “Mind the wet stones. And mind that one.” He nods along the wall. “He went through before the rain. Without a ticket.”", { leave: () => C.walk(C.V("clear")) }); } },
      { id: "luck", say: "Any luck?", when: () => !has("key") && !A().q.northOpen, run: () => reply("avi2", "“Nineteen keys and none of them mine.” He wipes rain off his cap. “The doves' arch, I am sure of it. Where would a key go in the rain? Where a dove would go.”") },
      { id: "after", say: "Thank you, Avi.", when: () => A().q.northOpen, run: () => reply("avi2", "“Go, go. Before the light goes. And when you find whatever you are looking for, come and tell an old man at a booth.”") },
    ] },
    hagop: { name: "Hagop", kick: "On the wall", desc: "A boy of about nine with dark curly hair, holding the string of a homemade paper kite that is snagged on the battlements, upset and trying hard not to show it.", lines: [
      { id: "stuck", say: "Stuck?", when: () => !A().q.hagop, run: () => { A().q.hagop = 1; save(); reply("hagop", "“My grandfather made it. If I lose it he will make another one, and he will tell me about it for a year.” He pulls the string. The kite does not move. It is a hand's breadth beyond anyone's reach."); } },
      { id: "rod", say: "(Reach the string with the cubit rod)", when: (a) => a.q.hagop && has("rod") && !a.q.kite, run: () => { A().q.kite = 1; save(); F.S("harp", null, 0.5); reply("hagop", "You slide the Watchman's rod up between the stones and lift the string clear. The kite comes down in a long swoop and lands at his feet. “You got it!” He is already running. “Come to my father's shop, by Jaffa Gate. The one with the blue tiles!”", { clip: "hagop" }); fact("kite", "Hagop's kite: his father's shop is the one with the blue tiles, just inside Jaffa Gate."); } },
      { id: "again", say: "All right?", when: (a) => a.q.kite, run: () => reply("hagop", "He is halfway down the stairs with the kite under his arm, and does not hear you.") },
    ] },
    kasparian: { name: "Mr Kasparian", kick: "The tile shop", when: (a) => a.q.kite, desc: "A potter in his fifties with blue paint on his fingers and a canvas apron, a kind tired face. The walls behind him are blue and white from floor to ceiling.", lines: [
      { id: "found", say: "I found Hagop's kite.", when: (a) => !a.q.kasparianPaid, run: () => { A().q.kasparianPaid = 1; save(); H.earn(15, "Mr Kasparian"); give("tile"); reply("kasparian", "“Then my father will not have to make another, and I will not have to listen.” He presses fifteen shekels and a small painted tile into your hand before you can refuse. “For the wall of your house. Every house should have one thing from Jerusalem that was made by hand.”"); } },
      { id: "here", say: "How long have you been here?", run: () => reply("kasparian", "“Armenians have lived inside these walls for sixteen hundred years. We have seen everyone come looking for the Temple.” He wipes a brush. “Most of them were looking in the wrong place.”", { clip: "kasparian" }) },
      { id: "ararat", say: "The mountain on your tiles?", run: () => reply("kasparian", "“Ararat. Where the ark came to rest.” He does not look at it. “My grandfather painted it from memory. I paint it from his tiles. None of us has seen it. It is sixty kilometres across a border nobody will open.” A shrug. “So we paint it. A thing you cannot go to, you keep by making it.”") },
    ] },
    talia: { name: "Talia", kick: "The Burnt House", desc: "A young woman in her twenties, an archaeology student, dark hair tied up, dust on her shirt, a sketchbook and a stick of charcoal in her hands.", lines: [
      { id: "what", say: "What happened here?", run: () => { A().q.taliaWhat = 1; save(); reply("talia", "“The family of Kathros. Priests. Their house burned a month after the Temple did.” She closes the sketchbook on her finger. “We found a girl's arm by the stairs, a spear, and a stone weight with the family's name on it. Everything in the room is exactly where it fell. Go in and look. Brush, don't dig.”"); } },
      { id: "draw", say: "What are you drawing?", when: (a) => !a.q.charcoal, run: () => { A().q.charcoal = 1; save(); give("charcoal"); reply("talia", "“The ash layer. A metre deep in places.” She snaps her charcoal in two and holds out half. “Here. Everyone should draw something in Jerusalem. Or rub something. Charcoal on paper over a stone and the stone tells you things.”"); } },
      { id: "watchman", say: "Did an old man with a journal come here?", when: () => done("jewish", "burnt"), run: () => reply("talia", "“The Watchman? That is what the guards called him. He sat where you are sitting and wrote for an hour, and he left that page on the stone table for whoever came next.” She looks at you. “Nobody came. Until today.”") },
      { id: "asked", say: "Has anyone else asked about him?", when: (a) => done("jewish", "burnt") && !a.q.taliaPhoto, run: () => { A().q.taliaPhoto = 1; save(); fact("photo", "Haller showed Talia a photograph on his phone of a journal page with a drawn lamp: page 1. He had it this morning, before he had anything of yours."); reply("talia", "She hesitates. “A man, this morning. Grey coat. Very polite. He showed me a photograph on his telephone, a page with writing and a little lamp drawn on it, and asked whether the old man had left anything like it here.” She shrugs. “I said no. It was true then.”", { clip: "talia" }); } },
    ] },
    grandmawall: { name: "Dudu's grandmother", kick: "The Western Wall", desc: "The same grandmother from the tram stop, in her sun hat, a prayer book in her hand, standing by the screen of the women's section.", lines: [
      { id: "prayer", say: "I still have your prayer.", when: (a) => !a.q.gmWall, run: () => { A().q.gmWall = 1; save(); reply("grandmawall", "“Good.” She takes your hand in both of hers. “Not here. In the tunnel, opposite the place. Find a crack that is empty, there are not many. And when you have put it in, look up.”"); } },
      { id: "fear", say: "Is something wrong?", when: (a) => a.q.gmWall && !a.q.gmFear, run: () => { A().q.gmFear = 1; save(); fact("dudu", "Haller came to the tram stop this morning and asked the grandmother whether a tourist had carried her bags. He knew Dudu's name. She is frightened."); reply("grandmawall", "She holds your sleeve. “A man came to the stop this morning while I was waiting for the tram. He asked whether a tourist had carried my bags. He knew Dudu's name.” Her hand is not steady. “I told him I am an old woman and I do not remember. Then I came here to pray, because that is what I do when I am frightened.” She lets go. “Put my prayer in the Wall. Then go and finish whatever this is, so that he stops asking about my grandson.”", { clip: "grandma-wall" }); } },
      { id: "sorry", say: "I'm sorry he frightened you.", when: (a) => a.q.gmFear, run: () => reply("grandmawall", "“Pff. I have been frightened by better men than him.” But she looks along the plaza as she says it.") },
    ] },
    eliezer: { name: "Rav Eliezer", kick: "Under Wilson's Arch", desc: "An old man with a long white beard, a black hat and a dark coat, a large old book open on a wooden stand, a small clay lamp burning beside it. He does not look up until you speak.", lines: [
      { id: "ask", say: "May I ask you something?", when: (a) => !a.q.riddle, run: () => riddle() },
      { id: "reading", say: "What are you reading?", when: (a) => a.q.riddle && !a.q.covenant, run: () => { A().q.covenant = 1; save(); reply("eliezer", "“Daniel. The ninth chapter. I read it every year at this season, and every year it is worse.” He turns the book so you can see the line. “‘And he shall confirm the covenant with many for one week.’ A covenant over this place. Men are talking about it now, in rooms with good chairs. They think a covenant is a thing you sign.” He closes the book. “The prophet thought it was a thing you break.”", { clip: "eliezer-covenant", btn: "The third lamp", then: () => FW.lightLamp(3, () => {}) }); fact("covenant9", "Rav Eliezer, on Daniel 9:27: men are talking now, in rooms with good chairs, about a covenant over this place. 'They think a covenant is a thing you sign. The prophet thought it was a thing you break.'"); } },
      { id: "floor", say: "What is under the floor?", when: (a) => a.q.riddle, run: () => { A().q.floor = 1; save(); reply("eliezer", "“More wall. Herod's wall, going down to the street of his day.” He points without looking. “The glass by the door shows you. Count it. But count only his stones: the ones with the smooth border. The rough ones above are later men's work, and later men do not count.”"); } },
      { id: "grey", say: "Did a man in a grey coat come in?", when: (a) => a.q.riddle, run: () => reply("eliezer", "“He stood at the back for a long time and did not pray. Then he asked me the same question you asked, about the covenant. I gave him the same answer.” A dry look over the book. “He smiled as if I had agreed with him.”") },
    ] },
    noa: { name: "Noa, the guide", kick: "The tunnels", desc: "A woman in her thirties with short dark hair, a headset microphone and a torch, a proud brisk smile. She loves every stone down here.", lines: [
      { id: "watchman", say: "You knew the Watchman?", when: (a) => a.q.noaRod, run: () => reply("noa", "“He stood at the Master Course for an hour with that rod and a notebook. The tour went on without him and he did not notice.” She clicks her torch. “He said something I wrote down afterwards. ‘The stones are honest. The signs are not.’”") },
      { id: "holy", say: "Why is this place holy?", run: () => { A().q.noaHoly = 1; save(); reply("noa", "“Tradition says the Holy of Holies stood just there, behind the Wall, on the rock under the Dome. People pray at the plaque because it is the closest they can come.” She shrugs with one shoulder. “That is the tradition. I show the stones. The stones I can measure.”"); } },
      { id: "grey", say: "A man in grey came through?", run: () => reply("noa", "“This morning. He asked to see the plaque and Warren's Gate and nothing else, which nobody does, and he stood at the gate a long time with his back to me.” She frowns. “I do not like a visitor whose back I cannot see past.”") },
      { id: "forgery", say: "(Show her the stone by Warren's Gate)", when: (a) => a.q.rubbed && !a.q.noaForgery, run: () => { A().q.noaForgery = 1; save(); reply("noa", "She shines her torch on the chalk line and goes very still. “That was not there last week. I would know. I clean this stone with my own hands.” She looks at the old scratched line above it, and then at you. “Two lines. One of them is lying. Which one did you believe?”", { clip: "noa-forgery" }); } },
    ] },
    hollis: { name: "Mr Hollis", kick: "The Garden Tomb", desc: "An elderly Englishman in a grey cardigan with a lanyard, white hair, gentle and precise. He has told the story a thousand times and still means it.", lines: [
      { id: "tomb", say: "Is this the tomb?", run: () => { A().q.hollisTomb = 1; save(); reply("hollis", "“We don't say it is. We say it might be.” He smiles. “And whether it is or not, he is not here.”", { clip: "hollis" }); } },
      { id: "stone", say: "How did the stone work?", run: () => reply("hollis", "“A great wheel of rock, in that groove. You will notice the groove is not level.” He lets that sit. “Whoever cut it meant the stone to be easy to close and hard to open. Think about which way it wants to roll before you touch anything.”") },
      { id: "grey", say: "Did a man in grey come through?", when: () => done("gtomb", "stone"), run: () => { A().q.hollisGrey = 1; save(); reply("hollis", "“Your friend? An hour ago. He asked me which tomb was the real one, this or the Sepulchre.” A small shake of the head. “I told him neither is the point. He did not like that at all. Then he sat on the bench by the path for a long time, as if he were waiting for someone.”"); } },
    ] },
    hallerbench: { name: "Victor Haller", kick: "The bench by the path", desc: "The man in the grey coat, the coat folded over the arm of the bench beside him, his hands loose in his lap. He has been waiting for you.", lines: [
      { id: "sit", say: "(Sit down)", when: (a) => !a.q.bench, run: () => hallerBench() },
      { id: "gone", say: "(The bench is empty)", when: (a) => a.q.bench, run: () => reply("hallerbench", "The bench, the folded shadow where the coat was, a few olive leaves on the path. He goes out of gardens the way he comes into them: without anyone quite seeing.") },
    ] },
    trader: { name: "The trader", kick: "The bazaar street", desc: "An old man in a dark waistcoat in a doorway hung with maps and brass, a small balance on the table in front of him, shrewd friendly eyes.", lines: [
      { id: "map", say: "That map?", run: () => reply("trader", "“The City of David, drawn in 1910, before the English dug it up and the arguments started.” He taps the balance. “Half a shekel. The Temple tax. Pay me the old way, weighed, and it is yours.”", { btn: "Weigh it out", then: () => C.PUZZLES.falseweight.run() }) },
      { id: "model", say: "(Offer Gabriel's Temple model)", when: (a) => has("model") && a.money < 30 && !has("lamp"), run: () => reply("trader", "He turns the little model over. “Gabriel's? He makes them well. Twenty shekels.”", { btn: "Sell it (20 shekels)", then: () => { delete A().items.model; save(); H.earn(20, "the trader, for the model"); } }) },
    ] },
    abusami: { name: "Abu Sami", kick: "The lamp stall", desc: "An old man with a white moustache and a checked keffiyeh, a small clay lamp in his open hand, a kettle steaming beside him on a little stove. He has all the time in the world.", lines: [
      { id: "lamp", say: "A lamp, please.", when: () => !has("lamp"), run: () => reply("abusami", "“Clay, like the old ones.” He holds it out on his palm so you can see the weight of it. “Thirty. Empty: the oil you find yourself.”", { clip: "abusami", btn: "Buy the lamp (30 shekels)", then: () => { if (pay(30, "the lamp")) give("lamp"); } }) },
      { id: "have", say: "I have a lamp already.", when: () => has("lamp"), run: () => reply("abusami", "He looks at it and nods slowly. “Clay. Good. Then you need only oil, and a reason to go into the dark.”") },
      { id: "oil", say: "Where do I find oil?", run: () => { A().q.oil = 1; save(); fact("oil", "Abu Sami: oil for the lamp is at the spring where the king was anointed, down the valley. The Gihon."); reply("abusami", "“Where the king was anointed. At the spring. Down the valley.” He pours tea into a glass you did not ask for and puts it in front of you. “Drink. The valley is a long way down and all of it is up again after.”"); } },
    ] },
  });

  /* Rav Eliezer's riddle: fifteen steps, the Songs of Ascents */
  function riddle() {
    K.card('<div class="ftalk">' + portrait("eliezer", PEOPLE.eliezer) + '<div><div class="kick">Rav Eliezer</div><h2>“First I ask.”</h2></div></div>' + clip("eliezer-riddle") +
      '<div class="fhim">He does not look up from the book. “How many steps did the Levites sing on, going up to the house?”</div>' +
      '<div class="fsay"><button data-act="a7">“Seven.”</button><button data-act="a12">“Twelve.”</button><button data-act="a15">“Fifteen.”</button><button data-act="a40">“Forty.”</button></div>',
      { a15: () => { A().q.riddle = 1; save(); ok(); reply("eliezer", "“Good.” Now he looks up. “Fifteen steps from the court of the women to the court of Israel, and a psalm for each one: the Songs of Ascents. Then you may ask.”"); },
        a7: () => { wrong("“No.” He turns a page. “Go and count the psalms that say ‘of ascents’. Come back.”"); riddle(); }, a12: () => { wrong("“Tribes, not steps.” He turns a page. “Count the psalms of ascents.”"); riddle(); }, a40: () => { wrong("“Years in the desert. Not steps.” He does not look up. “The psalms of ascents. Count them.”"); riddle(); } });
  }

  /* ------------------------------------------------------------ Victor Haller on the bench ------------------------------------------------------------ */
  function hallerBench() {
    const a = A(), p = PEOPLE.hallerbench;
    const card = (h, text, choices, o) => { o = o || {};
      K.card('<div class="ftalk">' + portrait("hallerbench", p) + '<div><div class="kick">Victor Haller</div>' + (h ? "<h2>" + esc(h) + "</h2>" : "") + "</div></div>" + (o.clip ? clip(o.clip) : "") +
        '<div class="fhim">' + text + "</div>" + '<div class="fsay">' + choices.map((c, i) => '<button data-act="c' + i + '">' + esc(c[0]) + "</button>").join("") + "</div>", Object.fromEntries(choices.map((c, i) => ["c" + i, c[1]]))); };
    const s1 = () => card("“He is not here.”", "“On that, at least, we agree.” He makes room on the bench. " + (a.q.sold ? "“Sit. You have your book back. You see that I keep my word, even when nobody asks me to.”" : "“Sit. I will not offer to buy anything. You have made your position clear, and I respect a position.”"),
      [["“You asked for me by name.”", s2], ["“You wrote on the stone.”", s3]]);
    const s2 = () => card(null, "“I did. I also asked a frightened old woman about her grandson, which I regret, and will not do again. I wanted you to understand that I can find anyone you have spoken to.” He looks at the garden. “Now you understand it. There is no need for anyone to be upset.”",
      [["“You wrote on the stone.”", s3], ["“Why do you care where I go?”", s4]]);
    const s3 = () => card(null, "He does not deny it. “I corrected it. The old man's line points north. North is a hillside with no history, a garden that might be a tomb, and a theory in a notebook. South is the City of David, the spring, three thousand years of digging.” He opens his hands. “I sent you where the evidence is. You should thank me.”",
      [["“Why do you care where I go?”", s4], ["“That was a lie, not a correction.”", () => card(null, "“A lie is a thing you say knowing it is false.” He considers. “I do not know it is false. Neither do you. That is rather my point.”", [["“Why do you care where I go?”", s4]])]]);
    const s4 = () => { fact("secondanswer", "Haller: when the agreement is signed there must be one answer about where the house stood. The journal is a second answer. 'I am asking you, politely, to let it be wrong.'");
      card(null, "“Because when the agreement is signed, and it will be signed, there must be one answer in the world about where the house stood. Not two. A man who has walked every stone with a measuring rod and written it down in a book with a lamp on the cover is a second answer.” He stands, and takes the coat from the arm of the bench. “You are carrying the second answer around Jerusalem in a backpack. I am asking you, politely, to let it be wrong.”",
        [["“And if I don't?”", s5], ["(Say nothing)", s5]], { clip: "haller-bench" }); };
    const s5 = () => { a.q.bench = 1; save(); fact("flight", "Haller, leaving: 'Who do you think told me your flight? Ask the old man who gave you the book how he and I know each other. Ask him what he was, before he sat at a desk with a lamp.'");
      card("“One more thing.”", "He turns to go, and turns back. “Since you like questions. Who do you think told me your flight?” He lets it hang. “Ask the old man who gave you the book how he and I know each other. Ask him what he was, before he sat at a desk with a lamp. Then decide whose errand you are running.” He goes out through the garden gate without hurrying.",
        [["He goes.", () => { F.V("w-gtomb-bench"); C.finish("gtomb"); }]], { clip: "haller-flight" }); };
    s1();
  }

  /* ------------------------------------------------------------ the sold path: Scene 0, the parcel ------------------------------------------------------------ */
  function parcel() {
    const a = A(), w = W();
    K.card('<div class="ftalk">' + portrait("avi", PEOPLE.avi) + '<div><div class="kick">Avi, the ticket man</div><h2>“You are the one with the backpack?”</h2></div></div>' +
      '<div class="fhim">He leans out of his booth with a parcel in brown paper. “A man left this. Grey coat, very polite. He said you would come, and you would look exactly like that.”</div>' +
      '<button class="cta" data-act="x">Open the parcel</button>', { x: () => {
        F.S("parchment", null, 0.7);
        K.card('<div class="kick">The parcel</div><h2>The journal</h2><img class="fphoto1" src="' + PZ + 'parcel.jpg" alt="A parcel in brown paper with a folded note">' +
          "<p>Inside, the Watchman's journal. On the cover, the small drawn lamp has a single line through it, in blue ink. A folded note in a neat hand:</p>" + '<div class="fhim" style="text-align:center">“Keep it. I have what I needed. — V.H.”</div>' +
          "<p>You open it. Page 3, Gabriel's page, is gone. Torn out cleanly, along the stitching.</p>" +
          '<button class="cta" data-act="x">“He gave it back.”</button>', { x: () => {
            give("hallernote", true); F.V("w-jaffa-parcel"); K.say("He gave it back. That is worse than keeping it. He has read every page you had, and he has kept the one he wanted you to feel. Gabriel gave you that page. Go and tell him.", "", 6000);
            setTimeout(() => K.root() && K.card('<div class="kick">King George Street · one stop back on the tram</div><div class="ftalk">' + portrait("gabriel", PEOPLE.gabriel) + '<div><div class="kick">Gabriel</div><h2>“You sold it.”</h2></div></div>' +
              '<div class="fhim">A long pause. “To him.” He takes off his glasses and cleans them, which is what he does instead of shouting. “The Watchman sat where you are standing and wrote that page twice, because his hand shook. I kept the first one.” From under the counter, a sheet of the same paper, the same ink, a lamp drawn in the corner, spout to the right. “This one you do not sell. Not for five hundred, not for five thousand. A thing like this is only worth something to a person who would never sell it. That is the whole trick of it.” He slides it across. “Now go up. And this time, when a man is kind to you, ask yourself why.”</div>' +
              '<button class="cta" data-act="x">Take the page, and go back to the gate</button>', { x: () => { a.q.parcel = 1; w.flags.journalSold = 0; w.flags.journalBack = 1; save(); ok(); K.say("Page 3 is back in the journal. The two paths are one again.", "", 3600); } }), 6200);
          } });
      } });
  }

  /* ------------------------------------------------------------ gates, before, lists, tasks, hints ------------------------------------------------------------ */
  const gate1 = H.gate, before1 = H.before, list1 = H.list, task1 = H.task, hint1 = H.hint;
  H.gate = (s, from) => {
    if (!from || from.id === s.id) return true;
    if (s.id === "ramparts" && !has("rticket")) { K.card('<div class="kick">The Ramparts Walk</div><h2>The iron gate is locked</h2><p>At the top of the stair, a turnstile and a locked gate. A sign: tickets at the booth by the citadel.</p><button class="cta" data-act="x">Back</button>', { x: () => {} }); return false; }
    if (s.id === "tunnels" && !A().q.noaIn) { noaGate(() => FW.go(s.id)); return false; }
    return gate1 ? gate1(s, from) : true;
  };
  function noaGate(then) {
    K.card('<div class="ftalk">' + portrait("noa", PEOPLE.noa) + '<div><div class="kick">Noa, the guide</div><h2>“Thirty shekels.”</h2></div></div><div class="fhim">“Tours every hour. The next one is mine.” She looks at your backpack the way guides look at backpacks.</div>' +
      '<button class="cta" data-act="p">Pay 30 shekels</button>' + (has("rod") ? '<button class="cta alt" data-act="r">Show her the cubit rod</button>' : "") + '<button class="cta alt" data-act="x">Not now</button>',
      { p: () => { if (pay(30, "the tunnel tour")) { A().q.noaIn = 1; A().q.noaPaid = 1; save(); then(); } },
        r: () => { A().q.noaIn = 1; A().q.noaRod = 1; save(); fact("noarod", "Noa knew the rod: the Watchman measured the Master Course with it. She took you in for nothing."); reply("noa", "She stops. Her torch comes up and finds the lamp burned into the end of the rod. “Where did you get this?” Quieter: “He measured the Master Course with this rod. Come. No ticket.”", { clip: "noa-rod", leave: then, btn: "Go in", then }); }, x: () => {} });
  }
  H.before = (scene, v, prev) => {
    if (scene.id === "jaffa" && A().q.sold && !A().q.parcel) setTimeout(() => K.root() && !A().q.parcel && parcel(), 700);
    if (scene.id === "wallagain" && v.id === "clear" && !A().q.northOpen) { K.say("The iron door across the walk is locked. Avi is at it with his keys.", "", 3000); return false; }
    if (scene.id === "gtomb" && v.id === "bench" && !done("gtomb", "stone")) { K.say("The bench is empty for now. The tomb first.", "", 2600); return false; }
    return before1 ? before1(scene, v, prev) : true;
  };
  const r = (t, ok, where, opt) => ({ t, ok: !!ok, where, opt: !!opt });
  const L2 = {
    jaffa: (a, w) => [r("Buy a Ramparts ticket", has("rticket"), "Avi's booth by the citadel"), r("Ask Avi where he lost the key", a.q.keyQuest, "The booth"), r("Ask Avi about the man in grey", a.q.aviGrey, "The booth"), r("Bring Hagop's kite news to his father", a.q.kasparianPaid, "The tile shop inside the gate, after the wall", 1)],
    ramparts: (a, w) => [r("Match the journal's sketch through the telescope", done("ramparts", "telescope"), "The telescope above Jaffa Gate"), r("Talk to the boy with the kite", a.q.hagop, "Along the wall"), r("Get his kite down", a.q.kite, "Use something from your backpack"), r("Read the storm", done("ramparts", "storm"), "At the far end of the wall")],
    jewish: (a, w) => [r("Ask Talia what happened here", a.q.taliaWhat, "The step of the Burnt House"), r("Ask what she is drawing", a.q.charcoal, "Talia"), r("Brush the ash and put the night in order", done("jewish", "burnt"), "Inside the Burnt House"), r("Ask whether anyone else asked about him", a.q.taliaPhoto, "Talia, after")],
    wall: (a, w) => [r("Find Dudu's grandmother", a.q.gmWall, "By the great hanukkiah"), r("Ask her what is wrong", a.q.gmFear, "She is holding your sleeve")],
    wilson: (a, w) => [r("Answer Rav Eliezer's question", a.q.riddle, "The old man at the book"), r("Ask what he is reading", a.q.covenant, "Rav Eliezer"), r("Ask what is under the floor", a.q.floor, "Rav Eliezer"), r("Count Herod's courses and open the grille", done("wilson", "courses"), "The glass shaft")],
    tunnels: (a, w) => [r("Get into the tunnels", a.q.noaIn, "Noa, at the entrance"), r("Measure the great stone", done("tunnels", "measure"), "The Master Course"), r("Put the prayer in the Wall and look up", done("tunnels", "lookup"), "Opposite the Holy of Holies"), r("Rub the stone by Warren's Gate", a.q.rubbed, "Warren's Gate, with the charcoal"), r("Copy the true line into the journal", done("tunnels", "rubbing"), "Which lamp is his?"), r("Show Noa the stone", a.q.noaForgery, "Noa"), r("Ask Noa why this place is holy", a.q.noaHoly, "Noa")],
    wallagain: (a, w) => [r("Find Avi's key", has("key") || a.q.northOpen, "Under the doves' arch"), r("Give it to Avi", a.q.northOpen, "The north door")],
    gtomb: (a, w) => [r("Ask Mr Hollis about the tomb", a.q.hollisTomb, "The volunteer by the path"), r("Roll the stone", done("gtomb", "stone"), "The groove in front of the tomb"), r("Ask him about the man in grey", a.q.hollisGrey, "Mr Hollis, after"), r("Sit down with the man on the bench", a.q.bench, "Coming out of the tomb")],
    bazaar: (a, w) => [r("Buy an oil lamp", has("lamp"), "Abu Sami's stall"), r("Ask him where to find oil", a.q.oil, "Abu Sami"), r("Weigh out the trader's half shekel", has("citymap"), "The trader, with your bekah")],
  };
  H.list = (scene) => (L2[scene.id] ? L2[scene.id](A(), W()) : list1 ? list1(scene) : null);
  H.task = (scene) => {
    const a = A();
    if (scene.id === "jaffa" && a.q.sold && !a.q.parcel) return "Avi has something for you.";
    if (scene.id === "ramparts" && !done("ramparts", "telescope")) return "There is a sketch in the margin of page 4. The telescope above the gate will show you what it is of.";
    if (scene.id === "wilson" && !a.q.riddle) return "The old man will not talk until you answer him. Psalms 120 to 134 are called something.";
    if (scene.id === "tunnels" && a.q.rubbed && !done("tunnels", "rubbing")) return "Two lines on one stone. Look at every lamp you have seen since the Lamplighter's desk.";
    if (L2[scene.id]) return H.left(scene);
    return task1 ? task1(scene) : null;
  };
  H.hint = (scene, v, n) => {
    if (scene.id === "ramparts" && v && v.id === "jaffa" && !done("ramparts", "telescope")) return n === 1 ? "Open the Journal and look at page 4. Something is drawn beside the words." : n === 2 ? "Four little pictures in a row, and a lamp over one of them. Turn the telescope until the city is in that order." : "The lamp is over the iron arches with the birds. Put them in the middle of the glass and look closer.";
    if (scene.id === "ramparts" && v && v.id === "storm") return n === 1 ? "Light travels faster than sound. The gap between the flash and the thunder tells you how far away the storm is." : n === 2 ? "Three seconds to a kilometre. Is the gap getting longer or shorter?" : "The storm comes from the west, over Damascus Gate. Go the other way: back to the stair by the arch.";
    if (scene.id === "wallagain" && !has("key") && !A().q.northOpen) return n === 1 ? "The rain came in from the west. Where does a dove shelter from a west wind?" : "On the side away from the wind. The east face of the arch.";
    if (scene.id === "wilson" && !A().q.riddle) return n === 1 ? "The Levites sang one psalm on each step. The psalms have a name: ‘A Song of Ascents’." : "Psalms 120 to 134. Count them.";
    if (scene.id === "wilson" && A().q.riddle && !done("wilson", "courses")) return n === 1 ? "Rav Eliezer said: count only Herod's stones. His have the smooth border round a raised middle." : n === 2 ? "Lower the lamp slowly. The rough stones near the top are later work: skip them." : "Seventeen. The grille takes two numbers.";
    if (scene.id === "tunnels" && A().q.rubbed && !done("tunnels", "rubbing")) return n === 1 ? "One line is scratched into the stone, old. One is chalk, fresh." : n === 2 ? "Look at the two little lamps. Which way does the spout point on each?" : "The Watchman draws his lamp with the spout to the right. Always. Copy that line.";
    if (scene.id === "gtomb" && !done("gtomb", "stone")) return n === 1 ? "Mr Hollis said the groove is not level." : "The stone wants to roll downhill, to the right. Pull the wedge on that side.";
    if (scene.id === "bazaar" && !has("citymap")) return n === 1 ? "Three weights, all stamped as half a shekel. Yosef's bekah is a true one." : "Put each of his on the pan against your bekah. The light one tips the beam.";
    return hint1 ? hint1(scene, v, n) : null;
  };

  /* ------------------------------------------------------------ the puzzles ------------------------------------------------------------ */
  /* a scratch-off layer: a canvas you wipe with your finger; onProgress(fraction cleared) */
  function scratch(canvas, colour, onProgress) {
    const ctx = canvas.getContext("2d"); let W0 = 0, H0 = 0, cleared = 0, total = 0, down = false, last = null, tick = 0;
    const size = () => { const r = canvas.getBoundingClientRect(); W0 = canvas.width = Math.round(r.width); H0 = canvas.height = Math.round(r.height); ctx.fillStyle = colour; ctx.fillRect(0, 0, W0, H0);
      for (let i = 0; i < 1400; i++) { ctx.fillStyle = "rgba(" + (i % 2 ? "0,0,0" : "255,255,255") + "," + (Math.random() * 0.12) + ")"; ctx.fillRect(Math.random() * W0, Math.random() * H0, 2 + Math.random() * 6, 2 + Math.random() * 6); }
      total = Math.ceil(W0 / 12) * Math.ceil(H0 / 12); grid.clear(); };
    const grid = new Set();
    const wipe = (x, y) => { ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = "source-over";
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) grid.add(((x / 12 | 0) + dx) + ":" + ((y / 12 | 0) + dy)); cleared = Math.min(1, grid.size / total); if (++tick % 6 === 0) onProgress(cleared); };
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener("pointerdown", (e) => { down = true; canvas.setPointerCapture(e.pointerId); const [x, y] = pos(e); wipe(x, y); last = [x, y]; e.preventDefault(); });
    canvas.addEventListener("pointermove", (e) => { if (!down) return; const [x, y] = pos(e); if (last) { const d = Math.hypot(x - last[0], y - last[1]), n = Math.ceil(d / 6); for (let i = 1; i <= n; i++) wipe(last[0] + (x - last[0]) * i / n, last[1] + (y - last[1]) * i / n); } last = [x, y]; });
    const up = () => { down = false; last = null; onProgress(cleared); };
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
    requestAnimationFrame(size);
    return { cleared: () => cleared };
  }

  Object.assign(C.PUZZLES, {
    /* 1. The telescope: match the sketch in the margin of page 4 */
    telescope: { label: "Look through the telescope", run: () => {
      const strip = ["ramparts-tower", "ramparts-jaffa", "ramparts-north", "ramparts-arch"], target = 3;
      const el = screen("The telescope on the wall", "The Ramparts Walk", q("A coin telescope on an iron post. In the margin of page 4 of the journal, beside the words, the Watchman drew four small pictures in a row, and over one of them his lamp. Turn the telescope until the city is in the order he drew it, then put the picture with the lamp in the middle of the glass.") +
        '<div class="fsketch" aria-label="The sketch in the journal: a tower, a gate, domes, and iron arches with birds, with a small lamp drawn over the arches">' +
          '<svg viewBox="0 0 400 90"><g fill="none" stroke="#2a3b7a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M20 70V34h8v-8h8v8h8v-8h8v8h8v-8h8v8h8V70z M44 70V52h8v18"/>' +
          '<path d="M120 70V40a22 22 0 0 1 44 0v30 M132 70V50h20v20 M108 70h68"/>' +
          '<path d="M214 70V52a16 16 0 0 1 32 0v18 M250 70V56a12 12 0 0 1 24 0v14 M206 70h76 M230 36v-8 M262 44v-6"/>' +
          '<path d="M316 70V40a24 24 0 0 1 48 0v30 M308 70h64 M324 70V48a16 16 0 0 1 32 0v22"/>' +
          '<path d="M333 33l4-3 4 3 M349 31l4-3 4 3"/>' +
          '<path d="M332 16c6-4 14-4 18 0 2 2 0 4-2 5h-14c-2-1-4-3-2-5z M352 18l6 1 M341 12v-3"/>' +
          '</g></svg></div>' +
        '<div class="ftele" id="ftele"><div class="ftele-strip" id="fstrip">' + strip.map((s) => '<img src="' + IMG + s + '.jpg" alt="" draggable="false">').join("") + '</div><div class="ftele-ring"></div><div class="ftele-hair"></div></div>' +
        '<div class="fsmall">Drag to turn the telescope.</div><button class="fbtn" id="flook">Look closer</button>', "jaffa", "olives", "ramparts-jaffa");
      const tele = $("ftele"), st = $("fstrip"); let x = 0.4, px = null;
      const draw = () => { const w = tele.clientWidth; st.style.transform = "translateX(" + (-x * w) + "px)"; };
      tele.addEventListener("pointerdown", (e) => { px = e.clientX; tele.setPointerCapture(e.pointerId); e.preventDefault(); });
      tele.addEventListener("pointermove", (e) => { if (px === null) return; x = Math.max(0, Math.min(strip.length - 1, x - (e.clientX - px) / tele.clientWidth)); px = e.clientX; draw(); });
      const up = () => { px = null; }; tele.addEventListener("pointerup", up); tele.addEventListener("pointercancel", up);
      requestAnimationFrame(draw);
      $("flook").onclick = () => {
        if (Math.abs(x - target) > 0.35) { F.S("dial", "click", 0.4); wrong(x < target - 0.35 ? "Through the glass: not the picture with the lamp over it. Turn further." : "Too far. Back a little."); return; }
        tele.classList.add("zoom"); ok(); A().q.teleDone = 1; save(); fact("doves", "The sketch on page 4: the lamp is drawn over the iron arches where the doves sit. 'Where the doves sit' is where Avi lost his key.");
        setTimeout(() => K.card('<div class="kick">Through the telescope</div><h2>The iron arches, and the doves</h2><p>Two turtledoves on the first arch, exactly as he drew them, and above them, in the sketch, his lamp. “Where the doves sit,” Avi said. That is where the key is. You could go and look now; but the sky to the west has gone the colour of slate, and the arch is in the open.</p>' +
          '<button class="cta" data-act="x">Walk on along the wall</button>', { x: () => C.pzDone("telescope", () => C.walk(C.V("north1"))) }), 900);
      };
    } },

    /* 2. The storm: flash, count, thunder; then choose the stair the storm reaches last */
    storm: { label: "Read the storm", run: () => {
      setTimeout(() => F.M("m13", "olives"), 50);
      const GAPS = [6.0, 4.2, 2.4]; let round = 0, flashAt = 0, thunderAt = 0, timer = 0, got = [];
      const el = screen("The storm", "The Ramparts Walk", q("The sky goes black over Damascus Gate. Lightning, and then, some seconds later, thunder. Every three seconds between the flash and the thunder is a kilometre. Watch the flash. Tap when you hear the thunder. Three times.") +
        '<div class="fstorm" id="fstorm"><div class="fstorm-sky"></div><div class="fstorm-flash" id="fflash"></div><div class="fstorm-read" id="fsread">Watch the sky.</div></div>' +
        '<button class="fbtn glow" id="fthunder" disabled>Thunder!</button><div class="fsmall" id="fgaps"></div>', "sky", "olives", "ramparts-storm");
      const say = (t) => { $("fsread").textContent = t; };
      const go = () => {
        if (round >= GAPS.length) return decide();
        say("Round " + (round + 1) + " of 3. Watch the sky."); $("fthunder").disabled = false;
        timer = setTimeout(() => { $("fflash").classList.add("on"); setTimeout(() => $("fflash").classList.remove("on"), 180); flashAt = performance.now(); thunderAt = 0; say("Flash. Count.");
          timer = setTimeout(() => { thunderAt = performance.now(); $("fstorm").classList.add("shake"); F.S("door", null, 0.9); setTimeout(() => $("fstorm").classList.remove("shake"), 700); say("Thunder.");
            timer = setTimeout(() => { if (thunderAt) { say("You missed it. Again."); round = Math.max(0, round); go(); } }, 2600); }, GAPS[round] * 1000); }, 1200 + Math.random() * 1500);
      };
      $("fthunder").onclick = () => {
        if (!flashAt) return;
        if (!thunderAt) { F.S("knock", null, 0.6); say("That was before the thunder. Watch again."); clearTimeout(timer); flashAt = 0; return go(); }
        clearTimeout(timer); const gap = (performance.now() - flashAt) / 1000, km = Math.round(gap / 3 * 10) / 10; got.push(km); F.S("step", "click", 0.5);
        $("fgaps").textContent = got.map((k, i) => "Flash " + (i + 1) + ": about " + k + " km").join(" · "); round++; flashAt = 0; thunderAt = 0; setTimeout(go, 900);
      };
      const decide = () => {
        $("fthunder").disabled = true; say("Closer each time. It is coming from the west, over Damascus Gate.");
        K.card('<div class="kick">The storm</div><h2>Off the wall. Which way?</h2><p>Your count: ' + got.map((k) => k + " km").join(", then ") + '. Ahead, where the walk goes down to Damascus Gate, two men stand across the path with their hands up: “Not this way. Not today.” The rain is already slanting in from the west behind them.</p>' +
          '<div class="fsay"><button data-act="on">Push on to the Damascus Gate stair, 150 metres ahead</button><button data-act="back">Back to the stair by the doves’ arch, 400 metres</button><button data-act="tower">Shelter in the tower here and wait</button></div>',
          { back: () => after(true), on: () => after(false, "You push on. The men do not move, and the rain reaches the wall before you reach them: thrown gravel, then a wall of water. You turn back soaked to the skin, and the arch stair is a river. In your bag, page 4 has taken the water: the ink has run at one corner."),
            tower: () => after(false, "You shelter in the tower. The storm sits on the wall for forty minutes as if it had come for you. When it moves on, the light has changed and the bag at your feet is in a puddle: page 4 has taken the water, and the ink has run at one corner.") });
      };
      const after = (good, text) => {
        if (!good) { W().flags.wetpage = 1; save(); }
        K.card('<div class="kick">The storm</div><h2>' + (good ? "Down the arch stair, dry" : "Soaked") + "</h2><p>" + (good ? "You are at the bottom of the arch stair and under the Quarter's first arch when the storm reaches the wall: a wall of water where you were standing a minute ago. You measured it right." : esc(text)) + "</p>" +
          "<p>He told you to mind the weather. He did not read it in the sky. He read it on his telephone this morning, and he said it to you like a prophet. Remember that. Men like him deal in things that are already certain.</p>" +
          '<button class="cta" data-act="x">Down into the Jewish Quarter</button>', { x: () => { F.V("w-ramparts-storm"); C.pzDone("storm", () => C.finish("ramparts")); } });
      };
      go();
    } },

    /* 3. The doves' arch: the key is on the lee side */
    doves: { label: "Look under the arch", run: () => {
      const el = screen("Where the doves sit", "Back on the wall", q("The doves are back on their arch, puffed up and damp. The rain came in slanting from the west. A dove shelters on the side away from the wind, and so would anything that fell in the rain and was kicked into the lee by a man hurrying past. Which face of the arch?") +
        '<div class="fdoves"><img src="' + IMG + 'ramparts-arch.jpg" alt="">' +
          '<button class="fhit" data-f="w" style="left:8%;top:30%;width:28%;height:45%"><span>The west face</span></button>' +
          '<button class="fhit" data-f="u" style="left:38%;top:55%;width:24%;height:35%"><span>Under the arch</span></button>' +
          '<button class="fhit" data-f="e" style="left:64%;top:30%;width:28%;height:45%"><span>The east face</span></button></div>', "arch2", "olives", "ramparts-arch");
      let busy = false;
      el.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => {
        if (busy) return;
        if (b.dataset.f !== "e") { busy = true; F.S("wingsflap", "wings", 0.8); wrong("The doves burst out of the arch all at once and wheel over the Quarter. Nothing on the stone but wet. Wait for them to settle."); setTimeout(() => (busy = false), 3000); return; }
        ok(); give("key"); K.card('<div class="kick">The east face of the arch</div><h2>Iron</h2><img class="fphoto1" src="' + PZ + 'key.jpg" alt="A large old iron key, wet with rain"><p>Tucked into the angle where the arch meets the wall, out of the wind, under a dove that does not want to move: a large iron key on a ring, wet and cold. Avi’s. The north door is along the wall; so, you can hear, is Avi.</p><button class="cta" data-act="x">Take it to him</button>', { x: () => C.pzDone("doves", () => C.walk(C.V("northdoor"))) });
      }));
    } },

    /* 4. The Burnt House: brush the ash, then the night in order by depth */
    burnt: { label: "Go in: the Burnt House", run: () => {
      const FINDS = [{ id: "coin", x: 22, y: 28, t: "A coin", s: "Bronze. Year four of the revolt: AD 69. Nothing in this room is older than the fire that followed." }, { id: "spear", x: 68, y: 36, t: "A spear", s: "Iron, leaning in the corner where it was dropped." }, { id: "weight", x: 42, y: 62, t: "A stone weight", s: "Round, with letters: D’BAR KATHROS, ‘of the house of Kathros’. The family named in the Talmud." }, { id: "arm", x: 78, y: 74, t: "An arm bone", s: "By the kitchen step. A young woman, reaching for the step when the roof came down." }];
      const found = new Set();
      const el = screen("The Burnt House", "The Jewish Quarter", verse("For the days shall come upon thee, that thine enemies shall cast a trench about thee, and compass thee round… and they shall not leave in thee one stone upon another.", "Luke 19:43–44") +
        q("A room six metres below the street, under two metres of ash. Talia: “Brush, don’t dig. What lies deeper fell first.” Wipe the ash away with your finger.") +
        '<div class="fash" id="fash"><div class="fash-floor">' + FINDS.map((f) => '<button class="fash-find" data-id="' + f.id + '" style="left:' + f.x + "%;top:" + f.y + '%" aria-label="' + esc(f.t) + '"><i></i><span>' + esc(f.t) + "</span></button>").join("") + '</div><canvas id="fashc"></canvas></div>' +
        '<div class="fsmall" id="fashn">0 of 4 found</div>', "burnt", "indoor", "jewish-burnt");
      const c = $("fashc");
      /* a find shows through only once the ash over it is cleared; then it can be picked up */
      const check = () => { const ctx = c.getContext("2d"), r = c.getBoundingClientRect(); if (!r.width) return; el.querySelectorAll(".fash-find:not(.clear)").forEach((b) => { const br = b.getBoundingClientRect(); const px = ctx.getImageData(Math.max(0, Math.round(br.left - r.left + br.width / 2)), Math.max(0, Math.round(br.top - r.top + br.height / 2)), 1, 1).data; if (px[3] < 60) { b.classList.add("clear"); F.S("step", "click", 0.3); } }); };
      scratch(c, "#2b2622", check);
      el.querySelectorAll(".fash-find").forEach((b) => (b.onclick = () => {
        const f = FINDS.find((x) => x.id === b.dataset.id); if (found.has(f.id) || !b.classList.contains("clear")) return;
        found.add(f.id); b.classList.add("on"); F.S("stone", "stone", 0.5); K.say(f.t + ". " + f.s, "", 4200); $("fashn").textContent = found.size + " of 4 found";
        if (found.size === 4) setTimeout(() => K.root() && orderNight(), 1200);
      }));
      function orderNight() {
        const items = [["Jesus weeps over the city", "“thine enemies shall compass thee round”, about AD 30"], ["The coin is struck", "year four of the revolt, AD 69"], ["The legions surround Jerusalem", "Titus, spring of AD 70"], ["The Temple burns", "the ninth of Av, AD 70"], ["The Upper City falls and this house burns", "a month later: the spear dropped, the girl on the step"], ["The stones are thrown down into the street", "“not one stone upon another”"]];
        let at = 0;
        const el2 = screen("What lies deeper fell first", "The Burnt House", q("Four things in the ash, each at its depth. Put the night, and the years before it, in order."), "burnt", "indoor", "jewish-burnt");
        el2.querySelector("h1").insertAdjacentHTML("afterend", '<div class="fpath" id="fpath"></div><div class="fchips" id="fchips">' + F.shuffle(items.map((x, i) => i)).map((i) => '<button data-i="' + i + '"><b>' + esc(items[i][0]) + "</b><small>" + esc(items[i][1]) + "</small></button>").join("") + "</div>");
        el2.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => {
          const i = +b.dataset.i; if (i !== at) { b.classList.add("bad"); setTimeout(() => b.classList.remove("bad"), 400); wrong(i < at ? "That one is already placed." : "Not yet. What had to happen before that?"); return; }
          F.S("step", "stone"); b.classList.add("used"); at++; const sp = document.createElement("span"); sp.className = "fstep"; sp.textContent = items[i][0]; $("fpath").appendChild(sp);
          if (at === items.length) setTimeout(() => K.root() && K.card('<div class="kick">The Burnt House</div><h2>Forty years</h2><p>Jesus spoke; forty years later it was done, to the letter. The Temple he wept over is gone. But the stones that held up its platform are still here, under the streets. On the stone table, weighed down with the Kathros weight, a page.</p><button class="cta" data-act="x">Take the page</button>', { x: () => C.pzDone("burnt", () => C.finish("jewish")) }), 700);
        }));
      }
    } },

    /* 5. The courses: lower the lamp, count only Herod's stones, open the grille */
    courses: { label: "Look down the shaft", run: () => {
      /* 22 courses: the top 5 are later, rougher work (no drafted margin); 17 below are Herod's */
      const COURSES = []; for (let i = 0; i < 22; i++) COURSES.push(i < 5 ? "rough" : "drafted");
      let y = 0, py = null;
      const el = screen("Follow the stones down", "Under Wilson’s Arch", q("You hold your lamp over the glass and lower it on its chain. Below the floor the Wall goes on down into black water. Rav Eliezer said: count only Herod’s stones, the ones with the smooth border round a raised middle. The rough ones are later men’s work.") +
        '<div class="fshaft" id="fshaft"><div class="fshaft-wall">' + COURSES.map((k, i) => '<div class="fcourse ' + k + '"><i></i><i></i></div>').join("") + '</div><div class="fshaft-dark" id="fdark"></div><div class="fshaft-lamp" id="flamp">🪔</div></div>' +
        '<div class="fsmall">Drag the lamp down. The iron grille beside the shaft takes a two-figure number.</div><button class="fbtn" id="fgrille">The iron grille</button>', "shaft", "indoor", "wilson-shaft");
      const sh = $("fshaft"), lamp = $("flamp"), dark = $("fdark");
      const draw = () => { const h = sh.clientHeight; lamp.style.top = (y * (h - 40)) + "px"; dark.style.background = "radial-gradient(circle at 50% " + (y * (h - 40) + 20) + "px, rgba(0,0,0,0) 0, rgba(0,0,0,0) 70px, rgba(0,0,0,.92) 150px)"; };
      sh.addEventListener("pointerdown", (e) => { py = e.clientY; sh.setPointerCapture(e.pointerId); e.preventDefault(); });
      sh.addEventListener("pointermove", (e) => { if (py === null) return; y = Math.max(0, Math.min(1, y + (e.clientY - py) / (sh.clientHeight - 40))); py = e.clientY; draw(); });
      const up = () => (py = null); sh.addEventListener("pointerup", up); sh.addEventListener("pointercancel", up);
      requestAnimationFrame(draw);
      const v = [0, 0], faces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const grille = () => {
        K.card('<div class="kick">The iron grille</div><h2>Two figures</h2><p>A number lock on the grille: two wheels. How many of Herod’s courses lie below the floor?</p>' +
          '<div class="fdial2">' + v.map((_, i) => '<div class="fdial2-w"><button data-up="' + i + '">▲</button><b id="fd' + i + '">0</b><button data-dn="' + i + '">▼</button></div>').join("") + "</div>" +
          '<button class="cta" data-act="t">Try the grille</button><button class="cta alt" data-act="x">Back to the shaft</button>',
          { t: () => { if (v.join("") !== "17") { F.S("knock", null, 0.6); wrong("The grille does not move. Count again: only the stones with the smooth border."); grille(); return; }
              F.S("lock", null, 0.7); ok(); W().flags.courses = 17; save(); fact("courses17", "Seventeen courses of Herod's stones below the floor under Wilson's Arch. The number opened the grille to the tunnels.");
              K.card('<div class="kick">Under Wilson’s Arch</div><h2>Seventeen</h2><p>The grille swings in. Seventeen courses of Herod’s stone below your feet, each as tall as a man, and the later work above them that does not count. On the door frame, in the gap between the iron and the stone, a page.</p><button class="cta" data-act="x">Take the page</button>', { x: () => C.pzDone("courses", () => C.finish("wilson")) }); }, x: () => {} });
        document.querySelectorAll(".asheet [data-up],.asheet [data-dn]").forEach((b) => (b.onclick = () => { const i = +(b.dataset.up ?? b.dataset.dn), d = b.dataset.up !== undefined ? 1 : -1; v[i] = (v[i] + d + 10) % 10; $("fd" + i).textContent = faces[v[i]]; F.S("dial", "click", 0.4); }));
        $("fd0").textContent = v[0]; $("fd1").textContent = v[1];
      };
      $("fgrille").onclick = grille;
    } },

    /* 6. The great stone: lay the rod along it, 26 times */
    measure: { label: "Measure the great stone", run: () => {
      const N = 26; let lays = 0;
      const el = screen("The Master Course", "The Western Wall tunnels", q("Noa’s torch lights the Western Stone. Lay the cubit rod against it and move it along, end to end; each lay leaves a chalk tick. The far end is in the dark, so you will have to go to it. Count your lays.") +
        '<div class="frodw" id="frodw"><div class="frodstrip" id="frodstrip"><div class="frod-end l"></div><div class="frod-end r"></div></div><div class="frod" id="frod">🪵</div></div>' +
        '<button class="fbtn" id="flay">Lay the rod</button><button class="fbtn" id="fcount" hidden>How many lays?</button>', "master", "chamber", "tunnel-great");
      const strip = $("frodstrip"), wrap = $("frodw"), rod = $("frod"), unit = 64;
      strip.style.width = (N * unit + 80) + "px";
      const draw = () => { const vw = wrap.clientWidth, x = lays * unit + 40; strip.style.transform = "translateX(" + Math.min(0, Math.max(vw - strip.offsetWidth, vw / 2 - x)) + "px)"; rod.style.left = Math.min(vw - 70, Math.max(10, Math.min(x, vw / 2))) + "px"; };
      requestAnimationFrame(draw);
      $("flay").onclick = () => {
        if (lays >= N) return;
        lays++; F.S("stone", "stone", 0.4); const t = document.createElement("i"); t.className = "ftick"; t.style.left = (lays * unit + 40) + "px"; strip.appendChild(t); draw();
        if (lays === N) { F.S("harp", null, 0.5); strip.classList.add("end"); $("flay").hidden = true; $("fcount").hidden = false; K.say("The end of the stone. Dark beyond it, and the next course.", "", 3000); }
      };
      let v = 20;
      const countCard = () => {
        K.card('<div class="kick">The Western Stone</div><h2>How many cubits long?</h2><p>Count your chalk ticks.</p><div class="fdial2"><div class="fdial2-w"><button data-up="0">▲</button><b id="fd0">20</b><button data-dn="0">▼</button></div></div><button class="cta" data-act="t">That many</button><button class="cta alt" data-act="x">Count again</button>',
          { t: () => { if (v !== N) { wrong(v < N ? "More than that. Count the ticks again." : "Fewer. Count the ticks again."); countCard(); return; }
              ok(); fact("cubits26", "The Western Stone is 26 long cubits: longer than the Holy of Holies, which was 20 cubits square (1 Kings 6:20).");
              K.card('<div class="kick">The Western Stone</div><h2>Twenty-six cubits</h2><p>Longer than the Holy of Holies, which was twenty cubits square. Noa comes along the stone with her torch and stops where you stopped. “Look.” Under your fresh chalk, older ticks in the same places, worn almost away. Above the last one, small, a lamp, its spout to the right. “He did exactly what you just did. Then he wrote for a long time.”</p><button class="cta" data-act="x">On along the tunnel</button>',
                { x: () => C.pzDone("measure", () => C.walk(C.V("warren"))) }); }, x: () => {} });
        document.querySelectorAll(".asheet [data-up],.asheet [data-dn]").forEach((b) => (b.onclick = () => { v = Math.max(1, Math.min(60, v + (b.dataset.up !== undefined ? 1 : -1))); $("fd0").textContent = v; F.S("dial", "click", 0.4); }));
        $("fd0").textContent = v;
      };
      $("fcount").onclick = countCard;
    } },

    /* 7. Look up: the prayer in the Wall, then page 7 high on the stone */
    lookup: { label: "Opposite the Holy of Holies", run: () => {
      const CRACKS = [[18, 58], [36, 66], [55, 60], [70, 70], [48, 76]], empty = 3; let placed = !has("note"), up = false;
      const el = screen("Opposite the Holy of Holies", "The Western Wall tunnels", q(placed ? "The plaque, and the Wall above it going up into the dark. The grandmother said: look up." : "The cracks of the Wall here are stuffed with folded prayers. The grandmother said: find one that is empty, put mine in, and look up.") +
        '<div class="flookup" id="flookup"><div class="flookup-img" id="flimg"><img src="' + IMG + 'tunnel-plaque.jpg" alt="">' +
          CRACKS.map((c, i) => '<button class="fcrack' + (placed ? " off" : "") + '" data-c="' + i + '" style="left:' + c[0] + "%;top:" + c[1] + '%"><i></i></button>').join("") +
          '<div class="fchalklamp" id="fchalk"><svg viewBox="0 0 60 30"><path d="M8 18c6-6 20-6 28 0 3 2 0 5-3 6H12c-4-1-7-4-4-6z M36 20l12 1 M24 11v-4" fill="none" stroke="#f3e9ce" stroke-width="2.2" stroke-linecap="round"/></svg><button class="fpage7" id="fpage7" aria-label="A folded page in the crack">✉</button></div>' +
          '<div class="flookup-dark" id="fldark"></div></div></div>' +
        '<button class="fbtn" id="flup"' + (placed ? "" : " disabled") + '>Look up</button><button class="fbtn" id="fllamp" hidden>Hold up the lamp</button>', "sign", "chamber", "tunnel-plaque");
      el.querySelectorAll(".fcrack").forEach((b) => (b.onclick = () => {
        if (placed) return;
        if (+b.dataset.c !== empty) { wrong("Full. Somebody’s prayer is already there, folded tight. Not that one."); return; }
        placed = true; delete A().items.note; save(); F.S("parchment", null, 0.6); b.classList.add("done"); el.querySelectorAll(".fcrack").forEach((x) => x.classList.add("off")); $("flup").disabled = false;
        K.say("You fold her prayer small and push it into the crack. It goes in as if the crack were made for it.", "", 3600);
      }));
      $("flup").onclick = () => { up = true; $("flimg").classList.add("up"); $("fldark").classList.add("on"); $("flup").hidden = true; $("fllamp").hidden = false; K.say("Above the plaque the Wall goes up into the dark. Nothing to see. Unless you have a light.", "", 3400); };
      $("fllamp").onclick = () => {
        if (!has("lamp") && !W().flags.lit) { $("fldark").classList.add("torch"); } else $("fldark").classList.add("torch");
        $("fchalk").classList.add("on"); $("fllamp").hidden = true; F.S("harp", null, 0.5); F.V("w-tunnels-sign");
        K.say("She said look up. People pray here because they believe the house stood just beyond this stone. The Watchman came here too. And he looked up.", "", 5000);
      };
      $("fpage7").onclick = () => { if (!$("fchalk").classList.contains("on")) return; ok(); K.card('<div class="kick">High on the Wall</div><h2>A lamp in chalk, and a page</h2><p>Four metres up, where nobody looks, a small chalk lamp, spout to the right, and above it a page folded into a crack. You reach it with the rod.</p><button class="cta" data-act="x">Take the page</button>', { x: () => C.pzDone("lookup", () => { C.page(7, () => C.walk(C.V("prayer"))); }) }); };
    } },

    /* 8. The rubbing and the forgery: two lines on one stone, copy one */
    rubbing: { label: "The stone by the gate", run: () => {
      if (!has("charcoal")) { K.card('<div class="kick">Warren’s Gate</div><h2>Something is scratched here</h2><p>Lines on the stone beside the gate, too faint for the torch. A rubbing would bring them up, if you had something to rub with.</p><button class="cta" data-act="x">Back</button>', { x: () => {} }); return; }
      const el = screen("Warren’s Gate", "The Western Wall tunnels", q("Hold the paper to the stone and rub Talia’s charcoal across it with your finger. What is cut into the stone comes up through the paper.") +
        '<div class="frub" id="frub"><img src="' + IMG + 'tunnel-forgery.jpg" alt=""><canvas id="frubc"></canvas></div><div class="fsmall" id="frubn">Rub.</div>' +
        '<div id="frubchoice" hidden><button class="fbtn" id="fcompare">Lay both copies on Gabriel’s map</button><div class="fq">Two lines. One is scratched into the stone, old and faint. One is chalk, fresh. Beside each, a small lamp. The journal has room for one of them. Which do you copy in?</div>' +
          '<div class="fsay"><button class="fbtn" id="ftop">The scratched line (top)</button><button class="fbtn" id="fbot">The chalk line (bottom)</button></div></div>', "warren", "chamber", "tunnel-warren");
      const c = $("frubc");
      scratch(c, "#1a1512", (fr) => { if (fr > 0.55 && !A().q.rubbed) { A().q.rubbed = 1; save(); $("frubn").textContent = "The stone speaks."; $("frubchoice").hidden = false; F.S("parchment", null, 0.6);
        setTimeout(() => K.say("Two lines on one stone. One scratched by a man with a shaking hand, years ago. One in chalk, this morning, by a man with a steady one.", "", 5200), 400); } });
      $("fcompare").onclick = () => compareOnMap();
      $("ftop").onclick = () => { ok(); A().q.lamp4 = 1; delete A().f.falseline; save(); fact("warren", "Scratched by the Watchman at Warren's Gate: 'Close to the house, but not the house. Where David bought the floor. 2 Chr 3:1.' His lamp, spout to the right.");
        F.V("w-tunnels-warren"); FW.lightLamp(4, () => K.card('<div class="kick">Warren’s Gate</div><h2>The true line</h2><p>“Close to the house, but not the house. Where David bought the floor.” The chalk line below it says the opposite, in a hand that does not shake, beside a lamp drawn the wrong way round. The Watchman draws his lamp with the spout to the right. Always. Look at every lamp you find from now on.</p><button class="cta" data-act="x">Show Noa</button>', { x: () => C.pzDone("rubbing", () => C.finish("tunnels")) })); };
      $("fbot").onclick = () => { F.S("knock", null, 0.6); W().flags.falseline = 1; save(); fact("falseline", "Copied from the stone at Warren's Gate: 'NOT NORTH. SOUTH, TO THE SPRING.'");
        K.card('<div class="kick">Warren’s Gate</div><h2>You copy it in</h2><p>“NOT NORTH. SOUTH, TO THE SPRING.” It goes into the journal in your own hand, under the Watchman’s. Something about the little lamp beside it bothers you, and you cannot say what. The stone is still there. So is the other line.</p><button class="cta" data-act="x">Back to the tunnel</button>', { x: () => C.walk(C.V("warren")) }); };
    } },

    /* the two lamp copies laid on Gabriel's map of the Old City (Gerry, Nov 3): the old spout points at the northern summit, the fresh one at the spring */
    /* 9. The stone of the tomb: the groove slopes; pull the downhill wedge */
    stone: { label: "Roll the stone", run: () => {
      let state = "held", jammed = false;
      const el = screen("The stone is rolled away", "The Garden Tomb", verse("And when they looked, they saw that the stone was rolled away: for it was very great.", "Mark 16:4") +
        q("A great wheel of rock sits in the groove across the front of the tomb, held by a wedge on each side. The groove is not level: it runs downhill to the right. Pull one wedge.") +
        '<div class="ftombs" id="ftombs"><img src="' + IMG + 'gtomb-2.jpg" alt=""><div class="ftomb-stone" id="ftstone"></div><button class="ftomb-wedge l" id="fwl" aria-label="The left wedge, uphill">◢ uphill wedge</button><button class="ftomb-wedge r" id="fwr" aria-label="The right wedge, downhill">downhill wedge ◣</button></div>' +
        '<button class="fbtn" id="flever" hidden>Lever the stone back</button>', "tomb", "olives", "gtomb-2");
      const stone = $("ftstone");
      $("fwl").onclick = () => { if (state !== "held") return; F.S("stone", "stone", 0.6); $("fwl").disabled = true; jammed = true; stone.classList.add("lean"); wrong("You pull the uphill wedge. The stone settles its whole weight downhill onto the other wedge and jams it in the groove: it will not come out now. Mr Hollis, from the path: “Easy to close. Hard to open. You will have to lever it back.”"); $("flever").hidden = false; };
      $("flever").onclick = () => { F.S("stone", "stone", 0.8); jammed = false; stone.classList.remove("lean"); $("fwl").disabled = false; $("flever").hidden = true; K.say("Both shoulders and a long minute. The stone eases back uphill and the wedge comes loose. Think about which way it wants to roll.", "", 4200); };
      $("fwr").onclick = () => { if (state !== "held") return; if (jammed) { wrong("Jammed under the stone’s weight. Lever it back first."); return; }
        state = "rolling"; F.S("stone", "stone", 0.9); stone.classList.add("roll"); setTimeout(() => { ok(); K.card('<div class="kick">The Garden Tomb</div><h2>He is not here</h2><p>The stone rolls downhill along its groove and comes to rest against the end stop, and the doorway is open. Inside: a weeping chamber, and a bench cut in the rock. Empty. On the bench, weighed down with a pebble, a page.</p><button class="cta" data-act="x">Take the page</button>', { x: () => C.pzDone("stone", () => C.page(8, () => C.walk(C.V("inside")))) }); }, 1400); };
    } },

    /* 10. The trader's false weight */
    falseweight: { label: "Weigh the half shekel", run: () => {
      const WTS = [["Half shekel, stamped", 10], ["Half shekel, worn", 8], ["Half shekel, new", 10]]; let on = null;
      const el = screen("Half a shekel", "The bazaar street", verse("A false balance is abomination to the LORD: but a just weight is his delight.", "Proverbs 11:1") +
        q("Three of the trader’s weights, each stamped as half a shekel. Your bekah from Yosef is a true half shekel. Put each of his on the pan against it. One of them is lying.") +
        '<div class="fscale" id="fscale" style="--tilt:0deg"><img class="fsc-stand" src="' + PZ + 'bal-stand.png" alt=""><div class="fsc-beam"><img src="' + PZ + 'bal-beam.png" alt="">' +
          '<div class="fsc-hang l"><img class="fsc-pan" src="' + PZ + 'bal-pan.png" alt=""><div class="fsc-load"><span class="fsc-stone"><img src="' + PZ + 'weight-3.png" alt=""><b>Your bekah</b></span></div></div>' +
          '<div class="fsc-hang r"><img class="fsc-pan" src="' + PZ + 'bal-pan.png" alt=""><div class="fsc-load" id="fload-r"></div></div></div><div class="fsc-read" id="fread">Nothing on his pan</div></div>' +
        '<div class="fsc-tray" id="ftray">' + WTS.map((w, i) => '<button class="fsc-w" data-i="' + i + '"><img src="' + PZ + 'weight-' + (i + 1) + '.png" alt=""><small>' + esc(w[0]) + "</small></button>").join("") + "</div>" +
        '<button class="fbtn" id="ffalse" disabled>“This one is false.”</button>', "trader", "street", "bazaar-trader");
      const draw = () => { const d = on === null ? 0 : WTS[on][1] - 10; $("fscale").style.setProperty("--tilt", (d * 1.8) + "deg"); $("fload-r").innerHTML = on === null ? "" : '<span class="fsc-stone"><img src="' + PZ + 'weight-' + (on + 1) + '.png" alt=""></span>'; $("fread").textContent = on === null ? "Nothing on his pan" : (d === 0 ? "Level." : "The beam tips: his is light."); el.querySelectorAll("[data-i]").forEach((b) => b.classList.toggle("used", +b.dataset.i === on)); $("ffalse").disabled = on === null; };
      el.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => { on = +b.dataset.i; F.S("step", "click", 0.5); draw(); }));
      $("ffalse").onclick = () => { if (on === null) return; if (WTS[on][1] === 10) { wrong("He frowns. “That one is honest. Weigh it again if you doubt me.”"); return; }
        ok(); give("citymap"); fact("falseweight", "The trader in the bazaar keeps a light half-shekel weight. Caught, he laughed and sold the 1910 map of the City of David for the bekah alone.");
        K.card('<div class="kick">The trader</div><h2>“Caught.”</h2><p>He laughs so hard he has to sit down. “Forty years and nobody weighs the weights. Everyone weighs the goods.” He pushes the light one into a drawer. “Your bekah, then. For the map. And nothing else, because you have shamed me.” The old map goes into your backpack.</p><img class="fphoto1" src="' + PZ + 'citymap.jpg" alt="An old hand-drawn map of a narrow ridge city"><button class="cta" data-act="x">Thank him</button>', { x: () => C.pzDone("falseweight", () => C.walk(C.V("end"))) }); };
      draw();
    } },
  });

  function compareOnMap() {
    let step = 0;
    const draw = () => '<div class="fcmap"><img src="' + IMG + 'map-old.jpg" alt="Gabriel’s map of the Old City">' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="fcarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="currentColor"/></marker></defs>' +
      (step >= 1 ? '<g class="old"><line x1="53" y1="29" x2="62" y2="23" stroke="#2A3A7A" stroke-width="1.2" marker-end="url(#fcarr)"/><circle cx="62" cy="23" r="2.2" fill="none" stroke="#2A3A7A" stroke-width=".8"/></g>' : "") +
      (step >= 2 ? '<g class="new"><line x1="53" y1="29" x2="69" y2="61" stroke="#c9c9c9" stroke-width="1.2" stroke-dasharray="2 1.5" marker-end="url(#fcarr)"/><circle cx="70" cy="63" r="2.2" fill="none" stroke="#c9c9c9" stroke-width=".8"/></g>' : "") +
      '<circle cx="53" cy="29" r="1.6" fill="#F6C453"/></svg>' +
      (step >= 1 ? '<span class="fclab" style="left:63%;top:17%;color:#2A3A7A">the northern summit</span>' : "") + (step >= 2 ? '<span class="fclab" style="left:60%;top:65%;color:#555">the spring, down the valley</span>' : "") +
      '<span class="fclab" style="left:38%;top:30%;color:#8a6a1a">Warren’s Gate</span></div>';
    const show = () => K.card('<div class="kick">Warren’s Gate · on Gabriel’s map</div><h2>' + (step === 0 ? "Where does each lamp point?" : step === 1 ? "The scratched lamp" : "The chalk lamp") + "</h2>" + draw() +
      "<p>" + (step === 0 ? "You put the rubbing on the map at Warren’s Gate, and turn each copy so its base lies along the Wall, the way it does on the stone. The spout is the pointer." : step === 1 ? "The old scratched lamp, spout to the right as you face the stone: it points up the Mount, to the high ground at its northern end." : "The fresh chalk lamp, spout the other way: it points down, out of the city, to the spring in the valley. The two lines disagree, and so do the two lamps. Someone has turned the spout round.") + "</p>" +
      (step < 2 ? '<button class="cta" data-act="n">' + (step === 0 ? "Lay the scratched copy" : "Lay the chalk copy") + "</button>" : '<button class="cta" data-act="x">Back to the stone</button>'),
      { n: () => { step++; F.S("parchment", null, 0.5); show(); }, x: () => { A().q.compared = 1; save(); fact("twolamps", "On Gabriel's map: the scratched lamp at Warren's Gate points to the northern summit of the Mount; the fresh chalk lamp points south to the spring. Someone turned the spout round."); } });
    show();
  }

  /* ------------------------------------------------------------ the end of Act 2: the second candle ------------------------------------------------------------ */
  const CANDLE_X = [17.6, 25.2, 33.2, 41, 58.4, 66.2, 74.2, 82], SERVANT = [49.8, 14];
  function hanukkiahHTML(lit) {
    return '<div class="fhan"><img src="' + IMG + 'hanukkiah.jpg" alt="A hanukkiah on a stone ledge over the Old City at dusk">' +
      '<span class="fhan-flame servant" style="left:' + SERVANT[0] + "%;top:" + SERVANT[1] + '%"></span>' +
      CANDLE_X.slice(CANDLE_X.length - lit).map((x) => '<span class="fhan-flame" style="left:' + x + '%;top:19.5%"></span>').join("") + "</div>";
  }
  FW.hanukkiahHTML = hanukkiahHTML;
  C.ACTS_FN.endAct2 = () => {
    const a = A(), w = W();
    if (w.done.bazaar) { K.card('<div class="kick">Act 2</div><h2>The second night</h2>' + hanukkiahHTML(2) + '<button class="cta" data-act="x">Close</button>', { x: () => {} }); return; }
    F.S("harp", null, 0.6);
    K.card('<div class="kick">Act 2 · Watchmen on the Walls</div><h2>The second candle</h2>' + hanukkiahHTML(2) +
      '<div class="fend-said"><span class="fend-who">The Lamplighter</span>' + (a.q.sold ? "“Two candles. Four lamps. The book is back in your hands, and a page of it is back because an old shopkeeper kept a copy and would not sell it. Learn from him. Tomorrow: Zion, where David lies.”" : "“Two candles. Four lamps. Four pages more than yesterday, and a man who sat in a garden and asked you whose errand you are running. It is a fair question. I will answer it when you ask me. Tomorrow: Zion, where David lies. Go down, to go up.”") + "</div>" +
      '<button class="cta" data-act="x">The night, and tomorrow</button>', { x: () => C.finish("bazaar") });
  };
  C.ACTS_FN.rampartsUp = () => { if (!has("rticket")) K.say("The iron gate at the top of the stair is locked. Avi sells tickets.", "", 2800); else FW.go("ramparts"); };

  /* the tester's shortcut: Act 2 as if played */
  FW.devAct2 = () => {
    if (FW.devAct1) FW.devAct1();
    const a = A(), w = W();
    Object.assign(a.q, { parcel: 1, keyQuest: 1, aviGrey: 1, hagop: 1, kite: 1, kasparianPaid: 1, taliaWhat: 1, charcoal: 1, taliaPhoto: 1, gmWall: 1, gmFear: 1, riddle: 1, covenant: 1, floor: 1, noaIn: 1, noaRod: 1, noaHoly: 1, rubbed: 1, lamp4: 1, noaForgery: 1, northOpen: 1, hollisTomb: 1, hollisGrey: 1, bench: 1, oil: 1, teleDone: 1 });
    ["rticket", "tile", "charcoal", "citymap", "lamp"].forEach((id) => (a.items[id] = 1)); delete a.items.note;
    ["ramparts:telescope", "ramparts:storm", "jewish:burnt", "wilson:courses", "tunnels:measure", "tunnels:lookup", "tunnels:rubbing", "wallagain:doves", "gtomb:stone", "bazaar:falseweight"].forEach((k) => (w.done[k] = 1));
    ["jaffa", "ramparts", "jewish", "wall", "wilson", "tunnels", "wallagain", "gtomb", "bazaar"].forEach((id) => (w.done[id] = 1));
    [5, 6, 7, 8].forEach((n) => (w.pages[n] = 1)); w.flags.courses = 17; w.flags.actcard2 = 1; a.money = Math.max(a.money, 27); save();
    if (FW.lamps && FW.lightLamp) { const L = FW.lamps(); if (!L[3]) w.lamps = Object.assign({}, L, { 3: 1, 4: 1 }); save(); }
  };
})();
