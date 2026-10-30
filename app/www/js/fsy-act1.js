/* Lamp — The Final Seven Years, Episode 1: the adventure layer for Act 1.
   People you talk to, money, things you buy and carry, rides on the travel card, doors that stay shut until
   you have the key, Dudu's side quest, and the Daniel 9 reader. Hooks into js/fsy-route.js through Lamp.fsyWalk.H.
   Design: the Claude Doc "Episode 1, Act 1: The Adventure Design". Portraits: img/fsy/people/<id>.png (Richard's drawings;
   until one exists the person shows as a lettered medallion). */
(() => {
  const Lamp = window.Lamp; const FW = Lamp.fsyWalk; if (!FW) return;
  const H = FW.H, C = FW.core, W = FW.W, K = Lamp.adv.kit, F = Lamp.fsy.parts, esc = K.esc, $ = (id) => document.getElementById(id);
  const PP = "img/fsy/people/";
  const PORTRAITS = new Set(["clerk", "soldier", "cardseller", "grandma", "grandma2", "yosef", "gabriel", "guide", "violinist", "halva", "baker", "dudu", "coffeeman", "fishman", "officer", "deskclerk", "dayclerk", "bagelgirl", "haller"]);   /* the people Richard has drawn (img/fsy/people/<id>.jpg); the rest show as lettered medallions */
  const save = () => Lamp.save();
  /* adventure state, inside the episode's save */
  const A = () => { const w = W(); if (!w.a) w.a = { money: 100, items: {}, rides: 0, facts: [], asked: {}, q: {}, f: {}, rode: {} }; return w.a; };
  const has = (id) => !!A().items[id];
  const done = (sceneId, pz) => !!W().done[sceneId + ":" + pz];

  /* ------------------------------------------------------------ short clips (Richard's 8-second videos of the people) ------------------------------------------------------------ */
  /* one clip per person, at that person's key moment. The file is video/fsy/<id>.mp4 with a poster video/fsy/<id>.jpg. */
  const CLIPS = new Set(["yosef", "clerk", "soldier", "cardseller", "officer-stamp", "dudu", "baker", "halva", "violinist", "gabriel", "guide", "grandma2", "grandma", "coffeeman", "fishman", "deskclerk", "dayclerk", "ravkav", "bagelgirl", "haller"]);
  /* a person's clip: the music and the street dip while they speak, and come back when the clip ends or the card closes */
  const duckFor = (v) => {
    let on = false; const set = (x) => { if (x === on) return; on = x; Lamp.duck && Lamp.duck(x); };
    v.addEventListener("play", () => set(true)); v.addEventListener("pause", () => set(false)); v.addEventListener("ended", () => set(false));
    const watch = setInterval(() => { if (!v.isConnected) { clearInterval(watch); set(false); } }, 400);
  };
  H.clip = (id) => {
    if (!CLIPS.has(id)) return "";
    setTimeout(() => {
      const v = document.querySelector(".fclip video"); if (!v) return;
      duckFor(v);
      const p = v.play(); if (p && p.catch) p.catch(() => v.parentElement.classList.add("tap"));
      v.parentElement.onclick = () => { v.parentElement.classList.remove("tap"); v.currentTime = 0; v.play(); };
    }, 60);
    return '<div class="fclip"><video src="video/fsy/' + id + '.mp4" poster="video/fsy/' + id + '.jpg" playsinline preload="auto"></video><i>▶</i></div>';
  };

  /* ------------------------------------------------------------ money ------------------------------------------------------------ */
  H.duckFor = duckFor;
  H.money = () => '<div class="fmoney"><b>' + A().money + '</b> shekels' + (has("card") ? " · Rav-Kav, <b>" + A().rides + "</b> ride" + (A().rides === 1 ? "" : "s") + " left" : "") + "</div>";
  H.pay = (n, what, quiet) => {
    const a = A(); if (a.money < n) { K.say("Not enough. " + (what ? what[0].toUpperCase() + what.slice(1) : "That") + " costs " + n + " shekels and you have " + a.money + ".", "", 3600); return false; }
    a.money -= n; save(); if (!quiet) F.S("pay", "click", 0.8); return true;
  };
  H.earn = (n, from) => { const a = A(); a.money += n; save(); F.S("harp", null, 0.5); K.say("+" + n + " shekels" + (from ? ", from " + from : "") + ". You have " + a.money + ".", "", 3600); };

  /* ------------------------------------------------------------ things ------------------------------------------------------------ */
  const ITEMS = {
    slip: ["A blue entry slip", "Stamped at passport control. Israel no longer stamps the passport itself."],
    card: ["A Rav-Kav card", "Jerusalem's travel card, white and blue. The light rail and the buses take it: tap it on the reader. Four rides when new; top it up at the machines at the stops."],
    frankincense: ["A twist of frankincense", "Levonah, from Yosef. Pale resin tears in a twist of paper. Priests and the curious."],
    loaf: ["The good loaf", "From the stall with the blue awning. For Dudu's grandmother."],
    bagel: ["A Holy Bagel", "Sesame, still warm, from the cafe under the arch in the Jewish Quarter. Lunch."],
    bankcard: ["The Lamplighter’s bank card", "Blue, in the envelope with the money. On the back, a scrap in the Watchman’s hand: “Psalm 48:2”."],
    pizza: ["A slice from Pizza HaOr", "Wrapped in paper, still hot. Olives and za’atar."],
    roomkey: ["A room key card", "Room 412, the Jerusalem Hotel. Paid for by someone else."],
    hotelnote: ["A note pushed under your door", "Hotel notepaper, neat handwriting: “Welcome to Jerusalem. Rest well. The north is cold at this time of year.” No name."],
    coffee: ["A bag of coffee", "250 grams, from the coffee man. For Dudu's grandmother."],
    fish: ["A wrapped fish", "From the counter at the end of the lane. For Dudu's grandmother."],
    note: ["A folded prayer note", "Dudu's grandmother's prayer. To be put in the Wall opposite the Holy of Holies. “And when you are there, look up.”"],
    rod: ["The Watchman's cubit rod", "A wooden rod with notches, a lamp burned into one end. The long cubit, 52 centimetres. Gabriel kept it for whoever came with the book."],
    map: ["A map of the Old City", "Hand-drawn, folded. Gabriel: “or you will walk in circles like the man in grey.”"],
    kippah: ["A kippah", "Knitted, blue and white. For the Wall."],
    lamp: ["An oil lamp", "Clay, from Gabriel's shop. Empty. “Oil you get at the spring.”"],
    model: ["A model of the Third Temple", "Small, from Gabriel. The courts, the altar, the sanctuary."],
    museum: ["A museum ticket", "The Israel Museum, one entry."],
    greycard: ["A card the man in grey left", "No name, a phone number, and on the back in pencil: NOT NORTH."],
  };
  const give = (id, quiet) => { A().items[id] = 1; save(); if (!quiet) { F.S("parchment", "click"); K.say("✓ " + ITEMS[id][0] + " goes into your backpack.", "", 3000); } };
  H.give = give;
  H.has = (id) => !!A().items[id];
  H.items = () => Object.keys(ITEMS).filter(has).map((id) => [1, ITEMS[id][0], ITEMS[id][1]]);

  /* ------------------------------------------------------------ what you know (the journal) ------------------------------------------------------------ */
  const fact = (key, text) => { const a = A(); if (a.f[key]) return; a.f[key] = text; a.facts.push(key); save(); K.say("Noted in the journal: " + text, "", 3400); };
  H.journal = () => { const a = A(); return (a.facts.length ? a.facts.map((k) => "<p><b>Noted:</b> " + esc(a.f[k]) + "</p>").join("") : "") + (a.q.daniel ? '<button class="cta alt" data-act="dan">Read Daniel 9</button>' : ""); };
  H.journalActs = () => ({ dan: daniel9 });

  /* ------------------------------------------------------------ people ------------------------------------------------------------ */
  const portrait = (id, p) => PORTRAITS.has(id) ? '<img class="fface" src="' + PP + id + '.jpg" alt="">' : '<i class="fface fface-ph">' + esc(p.name.replace(/^The /, "")[0]) + "</i>";
  /* a reply card: what they say, then ask more or leave */
  function reply(pid, text, o) {
    const p = PEOPLE[pid]; o = o || {};
    K.card('<div class="ftalk">' + portrait(pid, p) + '<div><div class="kick">' + esc(p.name) + "</div>" + (o.h ? "<h2>" + esc(o.h) + "</h2>" : "") + "</div></div>" +
      (o.clip && H.clip ? H.clip(o.clip) : "") + '<div class="fhim">' + text + "</div>" + (o.extra || "") +
      (o.btn ? '<button class="cta" data-act="b">' + esc(o.btn) + "</button>" : "") +
      '<button class="cta' + (o.btn ? " alt" : "") + '" data-act="again">Ask something else</button><button class="cta alt" data-act="x">Leave</button>',
      { b: () => o.then && o.then(), again: () => talk(pid), x: () => o.leave && o.leave() });
  }
  function talk(pid) {
    const p = PEOPLE[pid], a = A();
    const lines = p.lines.filter((l) => !l.when || l.when(a));
    const acts = { x: () => {} };
    lines.forEach((l) => (acts[l.id] = () => { a.asked[pid + ":" + l.id] = 1; save(); l.run(); }));
    K.card('<div class="ftalk">' + portrait(pid, p) + '<div><div class="kick">' + esc(p.kick || "") + "</div><h2>" + esc(p.name) + "</h2></div></div><p>" + esc(p.desc) + "</p>" +
      '<div class="fsay">' + lines.map((l) => '<button data-act="' + l.id + '"' + (a.asked[pid + ":" + l.id] ? ' class="asked"' : "") + ">“" + esc(l.say) + "”</button>").join("") + "</div>" +
      '<button class="cta alt" data-act="x">Leave</button>', acts);
  }
  H.people = (scene, v) => {
    const who = (v.who || []).filter((id) => PEOPLE[id] && (!PEOPLE[id].when || PEOPLE[id].when(A())));
    return who.length ? '<div class="fwho">' + who.map((id) => '<button class="fwhob" data-who="' + id + '">' + portrait(id, PEOPLE[id]) + "<span>" + esc(PEOPLE[id].name) + "</span></button>").join("") + "</div>" : "";
  };
  H.wire = (el) => el.querySelectorAll("[data-who]").forEach((b) => (b.onclick = () => { K.sfx("click"); talk(b.dataset.who); }));

  const PEOPLE = {
    officer: { name: "The officer at the booth", kick: "Passport control", desc: "Dark hair tied back, a dark uniform shirt, a passport open in her hand. Polite, sharp, unsmiling.", lines: [
      { id: "step", say: "(Step up to the booth)", when: () => !W().flags.passport, run: () => C.PUZZLES.passport.run() },
      { id: "done", say: "Thank you.", when: () => W().flags.passport, run: () => reply("officer", "“Next.” She is already looking past you at the queue.") },
    ] },
    clerk: { name: "The ticket clerk", kick: "The airport station", desc: "A woman behind the glass, reading glasses on a chain, a paper cup of coffee. Bored, but kind.", lines: [
      { id: "which", say: "Which train goes to Jerusalem?", run: () => reply("clerk", "“All the way up? Yitzhak Navon. Twenty-five minutes, mostly tunnel. Seventeen shekels. Or the machine, if you prefer machines.”", { then: null }) },
      { id: "heb", say: "The machine only shows Hebrew.", when: () => !W().flags.ticket, run: () => reply("clerk", "“The English button? Broken since Pesach.” She leans to the grille. “Jerusalem is Yerushalayim. Look for the word that starts with the little letter like a raised hand, the yod: י. It is the last stop, at the top of the map.”") },
      { id: "grey", say: "Did a man in a grey coat come through here?", run: () => reply("clerk", "“Grey coat, no luggage. Bought a ticket to Jerusalem and asked me if anyone had been asking for him. I said no.” She looks at you over the glasses. “Now I have said yes.”", { clip: "clerk" }) },
      { id: "up", say: "What does ‘go up’ mean?", run: () => reply("clerk", "“You go up to Jerusalem. Always. Even from the north, you go up. It is on the mountains.” A shrug. “And it is Jerusalem.”") },
    ] },
    soldier: { name: "The soldier", kick: "The airport platform", desc: "A young man in a dusty green uniform, a short dark beard, a strap over one shoulder, a worn paperback in his hand. Friendly, homesick.", lines: [
      { id: "home", say: "Going home?", run: () => { A().q.eitan = 1; save(); reply("soldier", "“Jerusalem. My mother is at the shuk every Friday, the bread stall with the blue awning. Tell her Eitan sent you. She will give you the good loaf.”"); fact("eitan", "Eitan’s mother sells bread under the blue awning at the market. Say Eitan sent you."); } },
      { id: "book", say: "What’s the book?", run: () => reply("soldier", "“Psalms. For the train.” He finds the page. “‘I was glad when they said unto me, Let us go into the house of the LORD.’ You know it? They sang it going up the steps.”") },
      { id: "mount", say: "Do you know the Temple Mount?", run: () => reply("soldier", "“I stood guard up there, two months. Everyone argues about it. Nobody looks.” He closes the book. “You look.”", { clip: "soldier" }) },
    ] },
    cardseller: { name: "The card seller", kick: "The kiosk on Jaffa Road", desc: "A man with a thick moustache leaning out of a kiosk hung with phone chargers and lottery tickets. Talks fast.", lines: [
      { id: "card", say: "I need to take the light rail.", when: (a) => !a.items.card, run: () => reply("cardseller", "“Card! Ten shekels, four rides. No card, no ride, no arguing with the inspector.”", { clip: "cardseller", btn: "Buy the card (10 shekels)", then: () => { if (H.pay(10, "the travel card")) { A().rides = 4; give("card"); } } }) },
      { id: "topup", say: "I’m out of rides.", when: (a) => a.items.card && a.rides === 0, run: () => reply("cardseller", "“Everybody is out of rides. Five shekels, one ride.”", { btn: "Top up (5 shekels)", then: () => { if (H.pay(5, "a ride")) { A().rides = 1; save(); K.say("One ride on the card.", "", 2500); } } }) },
      { id: "market", say: "How do I get to the market?", run: () => { fact("stops", "The market is three stops down the red line."); reply("cardseller", "“Three stops. Mahane Yehuda. You will smell it before you see it.”"); } },
      { id: "kg", say: "Which way is King George Street?", run: () => reply("cardseller", "“Down Jaffa Road, two stops, then left. Big street. Ben Yehuda runs into it.”") },
    ] },
    grandma: { name: "The woman at the stop", kick: "Jaffa Road", desc: "A grandmother in a sun hat and cardigan with two heavy shopping bags. Talks to everyone.", lines: [
      { id: "line", say: "Is this the right line for the market?", run: () => reply("grandma", "“Only one line, dear. Red. Everything is on it: the shuk, the Old City, all of it.”") },
      { id: "carry", say: "Can I carry those?", run: () => { A().q.metGrandma = 1; save(); reply("grandma", "“You can. My grandson was supposed to meet me. Dudu. If you see a boy with a football and no sense, that is him.”", { clip: "grandma" }); fact("dudu", "The woman at the stop is waiting for her grandson Dudu: a boy with a football."); } },
    ] },
    yosef: { name: "Yosef, the spice seller", kick: "Machne Yehuda", desc: "A big man in an apron, white hair, forearms dusted red with paprika. Does not suffer fools. Likes an honest customer.", lines: [
      { id: "buy", say: "I’d like to buy some spice.", when: () => !done("market", "scales"), run: () => reply("yosef", "“First you weigh. Everyone who buys from Yosef weighs.” He sets a worn stone on the left pan. “One shekel. Make it match.”", { btn: "Weigh", then: () => C.PUZZLES.scales.run() }) },
      { id: "lev", say: "Do you sell frankincense?", when: (a) => done("market", "scales") && !a.items.frankincense, run: () => reply("yosef", "“Levonah. Ten shekels the twist. Nobody buys it except priests and the curious.” He looks at you. “Which are you?”", { btn: "Buy a twist (10 shekels)", then: () => { if (H.pay(10, "the frankincense")) give("frankincense"); } }) },
      { id: "grey", say: "Has a man in a grey coat been here?", run: () => reply("yosef", "“He weighed nothing and asked a lot. I told him nothing.” He jerks his head down the lane. “Ask the halva man. He talks to anyone.”") },
      { id: "sack", say: "What’s in that sack?", when: (a) => a.q.sack && done("market", "scales") && !W().done.market, run: () => reply("yosef", "He looks at the sack in the corner for a long moment. “Not mine. A man left it last winter and never came back. Every Friday for a year, and then nothing.” He pushes it toward you with his foot. “Take it. It is bad for business.”", { btn: "Look at the sack", then: () => C.PUZZLES.incense.run() }) },
    ] },
    baker: { name: "The bread seller", kick: "The blue awning", desc: "A woman in her forties, hair tied up in a scarf, flour on her hands. Loaves on a board behind her.", lines: [
      { id: "loaf", say: "A loaf, please.", when: (a) => !a.items.loaf, run: () => reply("baker", "“Eight shekels.”", { btn: "Buy a loaf (8 shekels)", then: () => { if (H.pay(8, "a loaf")) give("loaf"); } }) },
      { id: "eitan", say: "Eitan sent me.", when: (a) => a.q.eitan && !a.items.loaf, run: () => { reply("baker", "“My Eitan? On the train?” Her whole face changes. “Then you take the good loaf, and you take it for nothing.”", { clip: "baker" }); give("loaf"); } },
      { id: "spice", say: "Which way to the spices?", run: () => reply("baker", "“Down the lane, left at the fish, follow your nose.”") },
    ] },
    coffeeman: { name: "The coffee man", kick: "The coffee stall", desc: "Sacks of beans, a scoop in every tin, the smell of roasting. He does not look up from the grinder.", lines: [
      { id: "coffee", say: "250 grams of coffee.", when: (a) => !a.items.coffee, run: () => reply("coffeeman", "“Twelve.” He is already scooping.", { clip: "coffeeman", btn: "Buy the coffee (12 shekels)", then: () => { if (H.pay(12, "the coffee")) give("coffee"); } }) },
    ] },
    fishman: { name: "The man at the fish counter", kick: "The end of the lane", desc: "Smoked fish, herring, salads under the glass, and a man in a white coat with a cleaver.", lines: [
      { id: "fish", say: "One fish, please.", when: (a) => !a.items.fish, run: () => reply("fishman", "“Fifteen. Wrapped.”", { clip: "fishman", btn: "Buy the fish (15 shekels)", then: () => { if (H.pay(15, "the fish")) give("fish"); } }) },
      { id: "sell", say: "Would you buy this fish back?", when: (a) => a.items.fish && a.q.dudu !== 3, run: () => reply("fishman", "“Buy back a fish? Fifteen I sold it for, fifteen I give. I am not a thief.”", { btn: "Sell it back (15 shekels)", then: () => { delete A().items.fish; H.earn(15, "the fish counter"); } }) },
    ] },
    dudu: { name: "Dudu", kick: "The market lane", desc: "A boy of about ten with a football under his arm and a crumpled paper. Worried, trying not to show it.", lines: [
      { id: "lost", say: "Lost something?", when: (a) => !a.q.dudu, run: () => { A().q.dudu = 1; save(); reply("dudu", "“My grandmother’s list. I mean, I have the list. I lost the money. She said bread, coffee, and fish, and come straight back, and I went to look at the football shirts.”"); } },
      { id: "help", say: "I’ll help.", when: (a) => a.q.dudu === 1, run: () => { A().q.dudu = 2; save(); reply("dudu", "“You would?” He reads the list. “Bread from the blue stall. Coffee from the man with the sacks. Fish from the counter at the end. She is at the tram stop at the end of the lane. She is going to kill me.”", { clip: "dudu" }); fact("list", "Dudu’s list: bread (the blue awning), coffee (the man with the sacks), fish (the counter at the end). His grandmother waits at the market tram stop."); } },
      { id: "grey", say: "Who’s the man in the grey coat?", run: () => reply("dudu", "“He asked me if I had seen a man with a book. I said no. Then he gave me five shekels and I still said no.”") },
      { id: "thanks", say: "All right now?", when: (a) => a.q.dudu === 3, run: () => reply("dudu", "“She only shouted a little.” He grins. “Come back Friday, I will show you where the football shirts are.”") },
    ] },
    grandma2: { name: "Dudu’s grandmother", kick: "The tram stop by the market", when: (a) => a.q.dudu === 2 && a.items.loaf && a.items.coffee && a.items.fish, desc: "At the stop at the end of the lane, bags at her feet, looking for a boy with a football.", lines: [
      { id: "back", say: "I’ve brought Dudu. And the shopping.", run: () => { A().q.dudu = 3; delete A().items.loaf; delete A().items.coffee; delete A().items.fish; save();
        reply("grandma2", "(You hand her the bread, the coffee and the fish: they leave your backpack.) “You brought him back and you brought the fish.” She takes the bags, then takes your hand. “I will tell you something for that.” From her purse, a folded paper. “My prayer. I go to the tunnel every week, to the place opposite the Holy of Holies, and I put it in the Wall. This week you put it in for me.” She closes your fingers over it. “And when you are there, look up.”", { clip: "grandma2", leave: () => { H.earn(45, "Dudu’s grandmother"); give("note"); fact("note", "Put the grandmother’s prayer in the Wall opposite the Holy of Holies, in the tunnels. Then look up."); } }); } },
    ] },
    deskclerk: { name: "The night clerk", kick: "The Jerusalem Hotel", when: (a) => !a.q.slept, desc: "A young woman in a dark blazer, short dark curls, a brass name badge, a kind and tired smile. She has seen every kind of pilgrim.", lines: [
      { id: "checkin", say: "I'd like to check in.", when: (a) => !a.q.checkedIn, run: () => { A().q.checkedIn = 1; save(); give("roomkey"); reply("deskclerk", "“Welcome. Your name?” She types, and looks up. “Yes. Three nights, already paid. An older gentleman came by this afternoon and paid in cash. No name. He said you would be tired.” She slides a key card across the desk. “Room 412. The lift is on the left.”", { clip: "deskclerk" }); } },
      { id: "way", say: "How do I get to the Old City in the morning?", when: (a) => a.q.checkedIn, run: () => { A().q.hotelWay = 1; save(); reply("deskclerk", "“The bus from the stop outside, down to Jaffa Gate. Go early, before the tour buses. And put money on your Rav-Kav: the drivers take no cash.” She nods at the window. “And do the walls in the morning. There is a storm coming in the afternoon, a big one.”"); fact("storm", "The desk clerk: go up on the walls in the morning; a big storm is coming in the afternoon."); } },
      { id: "see", say: "What should I see first?", when: (a) => a.q.checkedIn, run: () => { A().q.hotelSee = 1; save(); reply("deskclerk", "“Go in at Jaffa Gate and up on the walls: the Ramparts Walk. The ticket office is beside the Tower of David. From up there you can count the towers and see the whole city.” She smiles. “And if you go down to the Wall, cover your head.”"); } },
      { id: "grey", say: "Has anyone asked for me?", when: (a) => a.q.checkedIn, run: () => { A().q.hotelGrey = 1; save(); reply("deskclerk", "She hesitates. “A man telephoned this evening. Very polite. He asked whether a guest had checked in carrying an old book. I told him we do not discuss our guests.” She lowers her voice. “He knew which flight you came on.”"); fact("greyhotel", "The man in grey telephoned the hotel asking for you. He knew your flight."); } },
    ] },
    dayclerk: { name: "The morning clerk", kick: "The Jerusalem Hotel", when: (a) => a.q.slept, desc: "A young man in a dark blazer, curly hair, two days of stubble, a coffee on the desk beside him. Cheerful at seven in the morning.", lines: [
      { id: "msg", say: "Good morning. Any messages for 412?", when: (a) => !a.items.hotelnote, run: () => { give("hotelnote"); reply("dayclerk", "“Good morning! Yes, this was left at the desk for you in the night. It was here when I came on at six.” He hands you an envelope: hotel notepaper, folded once, no name.<br><br><b>“Welcome to Jerusalem. Rest well. The north is cold at this time of year.”</b><br><br>Neat handwriting, no signature: the same polite hand as the card that said NOT NORTH.", { clip: "dayclerk", leave: () => { C.walk(C.V("desk")); K.say("A man in a grey coat by the window raises a hand, as if he knows you.", "", 3400); } }); } },
      { id: "who", say: "Who left it?", when: (a) => a.items.hotelnote, run: () => { A().q.whoNote = 1; save(); reply("dayclerk", "He checks the night book. “It says: a gentleman in a grey coat, very polite. He did not want a receipt.” He looks up. “Is everything all right?”"); } },
      { id: "way", say: "Which way to Jaffa Gate?", run: () => { A().q.hotelWay = 1; save(); reply("dayclerk", "“The bus from the stop outside goes down to Jaffa Gate. Check your Rav-Kav first: there is a machine at the stop, and the drivers take no cash.” He glances at the sky outside. “And the walls this morning, not this afternoon. They say a storm.”"); } },
    ] },
    /* the man in grey, met at last (Richard, Oct 29): Victor Haller, in the lobby the morning after. Polite, reasonable, half right. */
    haller: { name: "The man in the grey coat", kick: "The Jerusalem Hotel", when: (a) => a.q.slept && a.items.hotelnote, desc: "At a low table by the window, a man in a pale grey overcoat, silver at the temples, two cups of coffee in front of him, one of them for you. He stands when he sees you, like a host.", lines: [
      { id: "who", say: "You left me a note.", when: (a) => !a.q.metHaller, run: () => { A().q.metHaller = 1; save(); reply("haller", "“I did. Victor Haller.” He offers his hand, and the second cup. “Sit, please. You have had a long day and I have had a long night. I am not your enemy, whatever the spice sellers told you. I knew the man who wrote that book. Better than the old fellow who gave it to you, I suspect.”", { clip: "haller" }); fact("haller", "The man in grey has a name: Victor Haller. He says he knew the Watchman."); } },
      { id: "want", say: "What do you want?", when: (a) => a.q.metHaller, run: () => { A().q.hallerWant = 1; save(); reply("haller", "“The same thing you want: to know where the house of God stood. The difference is that I already know.” He turns his cup. “It stood where every rabbi, every pilgrim and every map for thirteen hundred years has said it stood: on the rock, under the gold dome. Our friend the Watchman spent years proving the world wrong, and died proving it. Or vanished. It comes to the same thing.”"); } },
      { id: "why", say: "Then why follow me?", when: (a) => a.q.hallerWant, run: () => { A().q.hallerWhy = 1; save(); reply("haller", "“Because a wrong answer, written down convincingly, is dangerous. The people I work for are closer than anyone alive to seeing a Temple built. Closer than the Institute, closer than the rabbis. It needs an agreement, and agreements need everyone to be looking at the same rock.” He smiles. “A journal that points somewhere else is a stone in the shoe. I would like to buy it. Name a figure.”"); fact("covenant", "Haller: the people he serves are close to an agreement that would allow a Temple on the rock. A journal pointing elsewhere is 'a stone in the shoe'. He wants to buy it."); } },
      { id: "no", say: "It isn’t for sale.", when: (a) => a.q.hallerWhy && !a.q.hallerDone, run: () => { A().q.hallerDone = 1; save(); reply("haller", "“No. He said you would say that.” He finishes his coffee and stands, and lays a few coins on the table for both cups. “Then do me one favour. When you are up on the walls today, look south, at the dome. Ask yourself honestly whether a man alone with a measuring rod is more likely to be right than thirteen centuries.” At the door he turns. “Mind the weather this afternoon.”", { leave: () => { if (!W().done.hotel) C.finish("hotel"); } }); fact("hallerwalls", "Haller: 'Look south at the dome from the walls, and ask whether one man with a rod is more likely right than thirteen centuries.'"); } },
      { id: "flight", say: "How did you know my flight?", when: (a) => a.q.metHaller, run: () => reply("haller", "He looks genuinely surprised by the question. “Someone told me. Someone who wanted me to know.” He lets that sit. “Not everyone who sends you somewhere tells you everything about why.”") },
      { id: "gone", say: "(He has gone.)", when: (a) => a.q.hallerDone, run: () => reply("haller", "The table by the window is empty. Two cups, a few coins, and the morning light on the stone.", { leave: () => { if (!W().done.hotel) C.finish("hotel"); } }) },
    ] },
    halva: { name: "The halva seller", kick: "Deeper in", desc: "A thin old man behind slabs of halva, a long knife in his hand, eyes everywhere.", lines: [
      { id: "piece", say: "Try a piece?", run: () => reply("halva", "“Pistachio. Two shekels.” The knife pauses. “Or free, if you tell me what you are looking for.”", { btn: "“A man’s journal.”", then: () => { A().q.greyKG = 1; save(); reply("halva", "He cuts you a piece. “Then you are the second person today. The first wore grey and did not buy halva. He went toward the city. King George Street, I think.” He wipes the knife. “Not a nice man.”"); fact("greykg", "The man in grey went toward King George Street."); } }) },
      { id: "book", say: "Who was the man with the book?", run: () => { A().q.sack = 1; A().q.daniel = 1; save(); reply("halva", "“He came every Friday for a year. Sat there with his book and read Daniel, chapter nine, every time, moving his lips. Weighed things at Yosef’s. Then he stopped coming.” He points the knife up the lane. “Yosef has his sack.”", { clip: "halva" }); fact("daniel", "The Watchman read Daniel, chapter 9, every Friday. Yosef has his sack. The Journal can show you Daniel 9."); } },
    ] },
    violinist: { name: "Shmuel, the violinist", kick: "Ben Yehuda Street", desc: "An old man with a white beard, a battered violin, an open case with a few coins. He plays with his eyes shut.", lines: [
      { id: "coin", say: "(Drop a shekel in the case)", when: (a) => !a.q.shmuel, run: () => { if (!H.pay(1, "a shekel for the case")) return; A().q.shmuel = 1; save(); reply("violinist", "He opens his eyes. “For a shekel, a song. For a question, also a song.”"); } },
      { id: "where", say: "Where is Gabriel’s shop on King George?", when: (a) => a.q.shmuel && !a.q.found26, run: () => reply("violinist", "“Which number?”", { extra: '<div class="fchoices" id="fnum">' + [7, 9, 26, 62, 70].map((n) => '<button data-n="' + n + '">' + n + "</button>").join("") + "</div>" }) },
      { id: "grey", say: "Do you know a man in a grey coat?", when: (a) => a.q.shmuel, run: () => reply("violinist", "“He does not give. Not a shekel. A man who does not give to music, what else does he not give?”") },
      { id: "again", say: "Play it again?", when: (a) => a.q.found26, run: () => reply("violinist", "He plays Jerusalem of Gold, and for a minute the street stops to listen.") },
    ] },
    gabriel: { name: "Gabriel", kick: "Number 26", desc: "Behind the glass counter, under shelves of menorahs: a small old man with a long white beard, round glasses, a dark kippah, and a big voice. He is already talking about the end of days.", lines: [
      { id: "shmuel", say: "Shmuel says he’s still alive.", when: (a) => !a.q.shopOpen, run: () => { A().q.shopOpen = 1; save(); reply("gabriel", "“Shmuel has been dying for thirty years. Come in, come in.” He taps the counter. “Everybody who comes in here wants to know when. You want to know where. Good.”"); } },
      { id: "journal", say: "I have a journal.", when: (a) => a.q.shopOpen && !a.items.rod, run: () => { reply("gabriel", "He goes quiet. He goes into the back, and comes out with a wooden rod with marks cut along it and a small lamp burned into one end. “He left this. He said someone would come with the book. A cubit, the long one, the Temple cubit: fifty-two centimetres. You measure with it. You do not argue with it.”", { clip: "gabriel" }); give("rod"); fact("cubit", "The Temple cubit is the long cubit: 52 centimetres. The Watchman’s rod is marked in them."); } },
      { id: "what", say: "What should I buy?", when: (a) => a.q.shopOpen, run: () => reply("gabriel", "“For the Old City? The map, or you will walk in circles like the man in grey. A kippah, or they will not let you near the Wall. A lamp, if you are going under the city. Oil you get at the spring; I do not sell oil.”", { btn: "Look at the counter", then: shop }) },
      { id: "souv", say: "Everyone takes a souvenir home.", when: (a) => a.q.shopOpen, run: () => reply("gabriel", "“Choose. But look first. Everything here, somebody put something into it.”", { btn: "Choose a souvenir", then: () => C.PUZZLES.souvenir.run() }) },
      { id: "grey", say: "Was the man in grey here?", when: (a) => a.q.shopOpen && !a.items.greycard, run: () => { reply("gabriel", "“Yesterday. Asked for a journal. I said I sell menorahs. He bought nothing and looked at everything.” He slides a card across the counter. “He looked at the model a long time. And he left this.”"); give("greycard"); fact("notnorth", "A card left by the man in grey: NOT NORTH."); } },
    ] },
    guide: { name: "The guide at the model", kick: "The Israel Museum", desc: "An older woman with grey hair in a bun, a museum lanyard, a wooden pointer. Precise, dry, delighted by a good question.", lines: [
      { id: "show", say: "Can you show me the Temple?", when: () => !done("model", "modelq"), run: () => reply("guide", "“I can show you where they put it. Whether that is where it was is a longer conversation.” She lifts the pointer. “Walk round. I will ask you three things.”", { btn: "Answer her questions", then: () => C.PUZZLES.modelq.run() }) },
      { id: "lev", say: "(Show her the frankincense) What was this for?", when: (a) => a.items.frankincense, run: () => { A().q.levShown = 1; save(); reply("guide", "“Levonah.” She does not touch it. “Burned on the golden altar inside the sanctuary, morning and evening. The altar stood here, before the veil.” The pointer taps the model. “Remember that: the incense was inside. The sacrifices were outside, in the middle of the court.”"); fact("incense", "The altar of incense was inside the sanctuary. The altar of sacrifice was outside, in the middle of the court."); } },
      { id: "man", say: "Did a man with a journal come here?", when: () => done("model", "modelq") && !W().done.model, run: () => reply("guide", "“Every Friday. He stood where you are standing and looked east.” She lowers the pointer to the rail. “He left something under there once. I have not touched it.”", { clip: "guide", btn: "Look under the rail", then: () => C.finish("model") }) },
    ] },
  };
  /* the violinist's number: wired after the reply card is on screen */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("#fnum [data-n]"); if (!b) return;
    const n = +b.dataset.n; K.sfx("click"); e.target.closest(".asheet").remove();
    if (n === 26) { A().q.found26 = 1; save(); fact("gabriel26", "Gabriel’s shop: 26 King George Street (Daniel 9:26)."); reply("violinist", "“Then you have read your Daniel.” He tucks the violin under his chin. “Past the corner, the window with the name in gold and the menorahs. Tell him Shmuel is still alive.” He plays Jerusalem of Gold.", { clip: "violinist" }); }
    else reply("violinist", "“No.” He closes his eyes again. “Read the page again. Who was the angel, and what did he bring?”");
  });

  /* ------------------------------------------------------------ Gabriel's counter ------------------------------------------------------------ */
  const SHOP = [["model", 30, "The model of the Third Temple", "The courts, the altar, the sanctuary. “Look first.”"], ["map", 8, "A map of the Old City", "Hand-drawn. Every gate, every quarter."], ["kippah", 5, "A kippah", "Knitted, blue and white."], ["lamp", 35, "An oil lamp", "Clay, like the one on the Lamplighter’s desk. Empty."], ["cup", 60, "A kiddush cup", "Silver, engraved with the walls. Beautiful, and no use to you."], ["mezuzah", 20, "A mezuzah", "Olive wood. For a doorpost you do not have."]];
  function shop() {
    const a = A();
    K.card('<div class="kick">Gabriel’s counter</div><h2>' + a.money + " shekels</h2>" +
      '<div class="fshop">' + SHOP.map(([id, price, name, desc]) => "<div" + (a.items[id] ? ' class="got"' : "") + "><b>" + esc(name) + "</b><small>" + esc(desc) + "</small>" + (a.items[id] ? "<em>✓ yours</em>" : '<button data-act="buy:' + id + '">' + price + " ₪</button>") + "</div>").join("") + "</div>" +
      (a.items.lamp && a.money < 25 ? '<button class="cta alt" data-act="selllamp">Sell the lamp back (30 shekels)</button>' : "") +
      '<button class="cta" data-act="x">Step back from the counter</button>',
      Object.assign({ x: () => {}, selllamp: () => { delete A().items.lamp; H.earn(30, "Gabriel, for the lamp"); shop(); } },
        Object.fromEntries(SHOP.map(([id, price, name]) => ["buy:" + id, () => { if (id === "cup" || id === "mezuzah") { K.say("Gabriel: “Lovely. And you will carry it where? Buy what you need.”", "", 3200); return shop(); } if (H.pay(price, name.toLowerCase())) give(id); shop(); }]))));
  }
  C.ACTS_FN.shop = () => (A().q.shopOpen ? shop() : talk("gabriel"));
  C.ACTS_FN.greyDoor = () => K.card('<div class="kick">King George Street</div><h2>The doorway</h2><p>A dark window, a step, a brass number plate that someone has painted over, badly, so it cannot be read. He came out of here. Whether this is the door you want, you cannot tell from the street.</p><button class="cta" data-act="x">Back</button>', { x: () => {} });
  H.souvenirGate = () => {
    if (has("model")) return true;
    const a = A();
    K.card('<div class="kick">Gabriel</div><h2>“Choose, yes. But the model you buy first.”</h2><p>He taps the glass over a small model of the Temple: the courts, the altar, the sanctuary. “Thirty shekels. Everything else on the counter is free to look at. That one, you buy, and then you look.”</p>' +
      (a.money >= 30 ? '<button class="cta" data-act="b">Buy the model (30 shekels)</button>' : "<p>You have " + a.money + " shekels. Sell the fish back, or finish Dudu’s errand, and come back.</p>") + '<button class="cta alt" data-act="x">Not yet</button>',
      { b: () => { if (H.pay(30, "the model")) { give("model"); setTimeout(() => K.root() && C.PUZZLES.souvenir.run(), 700); } }, x: () => {} });
    return false;
  };

  /* ------------------------------------------------------------ rides and doors ------------------------------------------------------------ */
  /* every ride in the city goes on the Rav-Kav (Richard, Oct 29): no card, no ride; no credit, no ride.
     Board, tap the card on the reader; an empty card means the Rav-Kav machine at the stop (no cash on Israeli buses). */
  const RIDE = { rail: ["tram", "The light rail: Navon station to Machne Yehuda"], benyehuda: ["tram", "The light rail to King George Street"],
    model: ["bus", "The number 66 bus to the Israel Museum", "66"], hotel: ["bus", "The number 18 bus to the city centre and the Jerusalem Hotel", "18"], jaffa: ["bus", "The number 38 bus down to Jaffa Gate", "38"],
    hebron: ["bus", "The 160 from the Central Bus Station: the armoured bus to Hebron, 40 minutes south", "160"] };
  function ride(key, then) {
    const a = A(), R = RIDE[key], isBus = R[0] === "bus";
    if (a.rode[key]) return true;
    if (!a.items.card) { K.card('<div class="kick">' + (isBus ? "The bus stop" : "The light rail") + '</div><h2>No card, no ride</h2><p>' + (isBus ? "Jerusalem buses take a Rav-Kav card, not cash." : "The tram takes a Rav-Kav card, not cash.") + " The kiosk at the stop on Jaffa Road sells one: ten shekels, four rides.</p><button class=\"cta\" data-act=\"x\">Back</button>", { x: () => {} }); return false; }
    K.card('<div class="kick">' + (isBus ? "The bus stop" : "The tram stop") + "</div><h2>" + esc(R[1]) + "</h2>" + (isBus ? '<img class="fbusimg" src="img/fsy/w/busfront-' + R[2] + '.jpg" alt="The number ' + R[2] + ' bus pulling in">' : "") +
      "<p>" + (isBus ? "The doors hiss open. Front door only: a card reader by the driver, a little green light on top." : "The tram glides in with a ring of its bell. A card reader by every door.") + "</p>" +
      '<button class="cta" data-act="t">Tap your Rav-Kav</button><button class="cta alt" data-act="x">Not yet</button>',
      { t: () => {
          if (a.rides > 0) {
            a.rides--; a.rode[key] = 1; save(); F.S("trambell", "click", isBus ? 0.4 : 0.7);
            K.card('<div class="kick">' + (isBus ? "The bus" : "The tram") + '</div><h2>✓ Beep. A green tick.</h2>' + (H.clip ? H.clip("ravkav") : "") + "<p>" + (a.rides ? a.rides + " ride" + (a.rides === 1 ? "" : "s") + " left on the card." : "That was the last ride on the card.") + "</p>" +
              '<button class="cta" data-act="r">Find a seat</button>', { r: then });
          } else {
            F.S("knock", null, 0.6); K.buzz && K.buzz("error");
            K.card('<div class="kick">' + (isBus ? "The bus" : "The tram") + '</div><h2>Beep beep. Red.</h2>' + (isBus ? '<img class="fbusimg" src="img/fsy/w/bus-inside.jpg" alt="Inside the bus: the card reader by the driver">' : "") +
              '<div class="fred">אין יתרה מספקת · Insufficient balance</div>' +
              (isBus ? "<p>The driver shakes his head without looking round. “Empty. And no cash on the bus, not for years now. The machine, at the stop.” The engine idles. He will wait, a little.</p>" : "<p>The reader by the door glows red. An inspector two seats down is watching. The Rav-Kav machine is on the platform.</p>") +
              '<button class="cta" data-act="m">Hop off to the machine</button><button class="cta alt" data-act="x">Get off</button>',
              { m: () => machine(() => ride(key, then)), x: () => {} });
          }
        }, x: () => {} });
    return false;
  }
  /* the Rav-Kav machine at the stop (Richard's picture): its screen shows each step; hold the card on the round reader */
  function machine(after) {
    const a = A();
    const scr = (body, btns, acts, reader) => K.card('<div class="kick">The Rav-Kav machine</div><div class="fmach"><img src="img/fsy/pz/ravkav-machine.jpg" alt="The Rav-Kav machine at the stop"><div class="fmach-scr">' + body + "</div>" +
      (reader ? '<button class="fmach-reader" data-act="c" aria-label="Hold the card on the reader"></button>' : "") + "</div>" + btns, acts);
    scr("<b>רב-קו</b>Rav-Kav<small>בחר שפה<br>Choose a language</small>",
      '<div class="fchoices two"><button data-act="he">עברית</button><button data-act="en">English</button><button data-act="ar">العربية</button><button data-act="ru">Русский</button></div>',
      { he: () => { K.say("The screen fills with Hebrew. You press Back.", "", 2400); machine(after); }, ar: () => { K.say("Arabic. You press Back.", "", 2400); machine(after); }, ru: () => { K.say("Russian. You press Back.", "", 2400); machine(after); },
        en: () => scr('Place your card on the reader<img src="img/fsy/pz/ravkav.jpg" alt="">', '<button class="cta" data-act="c">Hold your Rav-Kav on the reader</button>',
          { c: () => { F.S("dial", "click", 0.5);
            scr("Balance<b>₪0.00</b><small>Load stored value<br>One ride ₪5</small>",
              '<p>You have ' + a.money + ' shekels.</p><div class="fchoices"><button data-act="v5">₪5 · one ride</button><button data-act="v10">₪10 · two rides</button><button data-act="v20">₪20 · four rides</button><button data-act="x">Cancel</button></div>',
              { v5: () => load(5), v10: () => load(10), v20: () => load(20), x: () => {} }); } }, true) });
    function load(n) {
      if (!H.pay(n, "the Rav-Kav")) { machine(after); return; }
      a.rides += n / 5; save(); F.S("coin", "click", 0.8); setTimeout(() => F.S("ticket", null, 0.7), 300);
      scr("Loaded<b>₪" + n + "</b>" + a.rides + " ride" + (a.rides === 1 ? "" : "s") + "<small>Remove your card<br>הסר את הכרטיס</small>", '<button class="cta" data-act="x">Back to the stop</button>', { x: after });
    }
  }
  H.machine = machine;
  /* the cash machine by the hotel (Richard, Oct 30): Hebrew first; find the language button; the PIN is a verse reference */
  /* Pizza HaOr (Richard, Oct 30: his evenings at the pizza place in Jerusalem): a slice, a stool, and the Lamplighter's thoughts on the day */
  H.pizza = () => {
    const a = A();
    if (a.items.pizza) {
      K.card('<div class="kick">Pizza HaOr</div><h2>On the stool by the window</h2><p>You eat the slice watching the lane. The oven ticks. For a few minutes nobody is following anybody.</p><p>Your head clears: <b>a drop of oil</b> for your lamp.</p><button class="cta" data-act="x">Finish it</button>',
        { x: () => { delete a.items.pizza; save(); Lamp.state.oil = (Lamp.state.oil || 0) + 1; Lamp.save(); F.S("harp", null, 0.5); const h = document.getElementById("adv-hint"); if (h) { const sp = h.querySelector("span"); if (sp) sp.textContent = Lamp.state.oil; } K.say("+1 drop of oil. Hints cost one.", "", 3000); } });
      return;
    }
    K.card('<div class="kick">Pizza HaOr</div><h2>“Slice or a whole one?”</h2><p>Behind the counter a man in a flour-dusted apron slides a pizza out of the oven on a long paddle. Olives, za’atar, a lot of cheese.</p>' +
      '<div class="fchoices"><button data-act="s">A slice (10 shekels)</button><button data-act="w">A whole pizza (38 shekels)</button><button data-act="x">Just the smell, thanks</button></div>',
      { s: () => { if (H.pay(10, "a slice")) give("pizza"); }, w: () => { if (H.pay(38, "a whole pizza")) { give("pizza"); K.say("Half of it goes to the paratroopers at the next table. They send over a beer.", "", 3600); } }, x: () => {} });
  };
  H.atm = () => {
    const a = A(); const day = Math.max(1, Object.keys(W().done).filter((k) => !k.includes(":")).length);
    if (!a.items.bankcard) { a.items.bankcard = 1; save(); K.card('<div class="kick">The envelope</div><h2>Something else in it</h2><p>Feeling for coins at the bottom of the Lamplighter’s envelope, you find a blue bank card, and behind it a scrap of paper in the Watchman’s small hand: <b>“Psalm 48:2”</b>. Nothing else.</p><button class="cta" data-act="x">Try the machine</button>', { x: () => H.atm() }); return; }
    const scr = (lines, btns, acts) => K.card('<div class="kick">בנק · The cash machine</div><div class="fatm"><div class="fatm-scr">' + lines + "</div></div>" + btns, acts);
    const heb = () => scr("<b>ברוכים הבאים</b><small>בנק ירושלים</small><div class=\"fatm-row\"><span>משיכת מזומן</span><span>יתרה</span><span>הפקדה</span><span>שפה</span></div>",
      '<div class="fchoices two"><button data-act="w">משיכת מזומן</button><button data-act="b">יתרה</button><button data-act="d">הפקדה</button><button data-act="l">שפה</button></div><button class="cta alt" data-act="x">Walk away</button>',
      { w: () => { K.say("Hebrew menus, Hebrew prompts. You could guess, but a wrong guess might swallow the card.", "", 3200); heb(); }, b: () => { K.say("A screen of Hebrew and a number. You press back.", "", 2600); heb(); }, d: () => { K.say("It wants you to put money in. Not today.", "", 2600); heb(); },
        l: () => scr("<b>שפה · Language</b>", '<div class="fchoices two"><button data-act="he">עברית</button><button data-act="ar">العربية</button><button data-act="ru">Русский</button><button data-act="en">English</button></div>', { he: heb, ar: heb, ru: heb, en: card }), x: () => {} });
    const card = () => scr("Insert card<small>הכנס כרטיס</small>", '<button class="cta" data-act="c">Insert the Lamplighter’s card</button><button class="cta alt" data-act="x">Walk away</button>', { c: pin, x: () => {} });
    let tries = 0;
    const pin = (msg) => {
      let v = "";
      const draw = () => { const el = document.getElementById("fatm-pin"); if (el) el.textContent = "●".repeat(v.length) + "○".repeat(4 - v.length); };
      scr("Enter PIN<small>הקש קוד סודי</small>" + (msg ? '<em class="fatm-err">' + esc(msg) + "</em>" : "") + '<div class="fatm-pin" id="fatm-pin">○○○○</div>',
        '<div class="fpad" id="fpad">' + [1,2,3,4,5,6,7,8,9,"⌫",0,"OK"].map((k) => '<button data-k="' + k + '">' + k + "</button>").join("") + '</div><button class="cta alt" data-act="x">Take the card back</button>', { x: () => {} });
      document.querySelectorAll("#fpad [data-k]").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); const k = b.dataset.k; K.sfx("click");
        if (k === "⌫") v = v.slice(0, -1); else if (k === "OK") { if (v.length < 4) return; document.querySelectorAll(".asheet").forEach((x) => x.remove()); if (v === "4802") menu(); else { tries++; if (tries >= 3) { tries = 0; K.card('<div class="kick">The cash machine</div><h2>Card retained</h2><p>The machine thinks for a long moment and keeps the card. A slip prints: <i>Please contact your branch.</i></p><p>The hotel clerk, when you ask, makes a phone call and gets it back for you. “Try the Psalms,” she says, not looking up.</p><button class="cta" data-act="x">Try again later</button>', { x: () => {} }); } else pin("Incorrect PIN. " + (3 - tries) + " attempt" + (tries === 2 ? "" : "s") + " left"); } return; }
        else if (v.length < 4) v += k; draw(); }));
    };
    const menu = () => {
      const taken = a.f.atm === day;
      scr("Withdraw<small>משיכת מזומן · Daily limit ₪200 · Fee ₪6</small>" + (taken ? "<em class=\"fatm-err\">Daily limit reached. Try again tomorrow.</em>" : ""),
        (taken ? "" : '<div class="fchoices two"><button data-act="a50">₪50</button><button data-act="a100">₪100</button><button data-act="a150">₪150</button><button data-act="a200">₪200</button></div>') + '<button class="cta alt" data-act="x">Take the card</button>',
        { a50: () => take(50), a100: () => take(100), a150: () => take(150), a200: () => take(200), x: () => {} });
    };
    const take = (n) => { a.f.atm = day; a.money += n - 6; save(); if (!a.q.atmOnce) { a.q.atmOnce = 1; save(); fact("atm", "The cash machine by the hotel: the Lamplighter’s card, PIN 4802 (Psalm 48:2). ₪200 a day, ₪6 fee."); } F.S("ticket", null, 0.7); setTimeout(() => F.S("coin", null, 0.6), 400);
      scr("Please take your cash<small>אנא קח את המזומן</small><b>₪" + n + "</b><small>Fee ₪6 · You now have ₪" + a.money + "</small>", '<button class="cta" data-act="x">Take the cash and the card</button>', { x: () => K.say("+" + (n - 6) + " shekels, after the fee. You have " + a.money + ".", "", 3200) }); };
    heb();
  };
  /* Holy Bagel (Richard, Oct 30): lunch in the Jewish Quarter. Buy one, eat it on the red chair: a drop of oil for your lamp */
  H.bagel = () => {
    const a = A();
    if (a.items.bagel) {
      K.card('<div class="kick">Holy Bagel</div><h2>Lunch</h2><p>You sit on a red chair under the arch and eat. Sesame, still warm, a little salt. The Quarter goes by. Your head clears: <b>a drop of oil</b> for your lamp.</p><button class="cta" data-act="x">Finish it</button>',
        { x: () => { delete a.items.bagel; save(); Lamp.state.oil = (Lamp.state.oil || 0) + 1; Lamp.save(); F.S("harp", null, 0.5); const h = document.getElementById("adv-hint"); if (h) { const sp = h.querySelector("span"); if (sp) sp.textContent = Lamp.state.oil; } K.say("+1 drop of oil. Hints cost one.", "", 3000); } });
      return;
    }
    K.card('<div class="kick">Holy Bagel</div><h2>“Next!”</h2>' + (H.clip ? H.clip("bagelgirl") : "") + '<p>Behind the counter, a girl in a cap and a red apron with a tray of sesame bagels, still warm. “Bagel? Twelve. With a schmear, fourteen. Sesame is the best, take the sesame.”</p>' +
      '<div class="fchoices"><button data-act="b">Sesame bagel (12 shekels)</button><button data-act="s">With cream cheese (14 shekels)</button><button data-act="x">Just looking</button></div>',
      { b: () => { if (H.pay(12, "a bagel")) give("bagel"); }, s: () => { if (H.pay(14, "a bagel with cream cheese")) give("bagel"); }, x: () => {} });
  };
  /* the end of Part 1 (Richard, Oct 29): the bus pulls up at Jaffa Gate, the Lamplighter speaks, and the chapter closes.
     In the App Store release (Lamp.part1Only) the walls are "coming soon"; testers can walk on into Act 2. */
  function endPart1(then) {
    const w = W(), a = A();
    if (w.flags.part1End && !Lamp.part1Only) return then();
    w.flags.part1End = 1; save();
    F.M("cliff", "street");
    const pages = Object.keys(w.pages).length, met = new Set(Object.keys(a.asked || {}).map((k) => k.split(":")[0])).size;
    const el = F.stage('<div class="fend">' +
      '<img class="fend-img" src="img/fsy/w/jaffa-1.jpg" alt="Jaffa Gate and the Tower of David">' +
      '<div class="fkick">The Final Seven Years · Episode 1</div><h1>End of Part 1</h1><div class="fend-sub">Arrival</div>' +
      '<div class="fend-said"><span class="fend-who">The Lamplighter</span>“Jaffa Gate. Four pages in your bag, and a man in grey who knows which flight you came on. The Watchman walked these walls for years. Now it is your turn. Go up.”</div>' +
      '<div class="fend-stats"><div><b>' + pages + '</b> of 12 pages</div><div><b>' + a.money + '</b> shekels</div><div><b>' + Math.max(met, 1) + '</b> people met</div></div>' +
      '<p class="fend-next">The walls are next: the Ramparts, the storm, the Western Wall and the tunnels beneath it.</p>' +
      (Lamp.part1Only ? '<div class="fend-soon">Part 2 · The Walls · Coming soon</div><button class="cta" data-end="out">Back to the episodes</button>'
        : '<button class="cta" data-end="go">Go up: on to Part 2 (tester)</button><button class="cta alt" data-end="out">Back to the episodes</button>') +
      "</div>", "w/jaffa-1.jpg");
    { const t = document.getElementById("adv-ttl"); if (t) { t.textContent = "Jaffa Gate"; t.onclick = null; } }
    F.V("w-end-part1");
    el.querySelectorAll("[data-end]").forEach((b) => (b.onclick = () => { K.sfx("click"); if (b.dataset.end === "go") then(); else K.shut(); }));
  }

  H.slept = () => { A().q.slept = 1; save(); };
  H.canSleep = () => { if (A().q.checkedIn) return true; K.say("Check in at the front desk first.", "", 2600); return false; };
  H.before = (scene, v, prev) => {
    if (scene.id === "hotel" && v.id === "room" && !A().q.checkedIn) { K.say("You have no key yet: check in at the front desk.", "", 2800); return false; }
    if (scene.id === "gabriel" && v.id === "inside" && !(prev && ["inside", "shelf", "window"].includes(prev.id))) F.S("shopbell", null, 0.7);
    if (scene.id === "airport" && v.id !== "control" && !W().flags.passport) { K.say("The officer at the booth beckons: passport first.", "", 3000); return false; }
    if (scene.id === "rail" && v.id === "inside") return ride("rail", () => C.walk(v));
    return true;
  };
  H.gate = (s, from) => {
    if (!from || from.id === s.id) return true;   /* reopening the game, or the same place: no gate */
    if (s.id === "benyehuda") return ride("benyehuda", () => FW.go(s.id));
    if (s.id === "gabriel" && !A().q.found26) { K.card('<div class="kick">King George Street</div><h2>Which door?</h2><p>A long street of shops, and you do not know the number. The page gave you the street and a verse. The violinist on Ben Yehuda will tell you if you tell him the number.</p><button class="cta" data-act="x">Back</button>', { x: () => {} }); return false; }
    if (s.id === "model") {
      if (!ride("model", () => FW.go(s.id))) return false;
      if (!has("museum")) { K.card('<div class="kick">The Israel Museum</div><h2>The ticket desk</h2><p>“One adult? Twenty-five shekels. The model is outside, down the path, you cannot miss it.”</p><button class="cta" data-act="b">Buy a ticket (25 shekels)</button><button class="cta alt" data-act="x">Not now</button>', { b: () => { if (H.pay(25, "the museum ticket")) { give("museum", true); FW.go(s.id); } }, x: () => {} }); return false; }
    }
    if (s.id === "hotel") return ride("hotel", () => FW.go(s.id));
    if (s.id === "hebron") return ride("hebron", () => FW.go(s.id));
    if (s.id === "jaffa") {
      if (!has("map") || !has("kippah")) { K.card('<div class="kick">The Old City</div><h2>Not yet</h2><p>Gabriel was clear: not without the map, and not without a kippah. ' + (has("map") ? "You have the map." : "You have no map.") + " " + (has("kippah") ? "You have the kippah." : "You have no kippah.") + " His shop is at 26 King George Street.</p><button class=\"cta\" data-act=\"x\">Back</button>", { x: () => {} }); return false; }
      return ride("jaffa", () => endPart1(() => FW.go(s.id)));
    }
    return true;
  };

  /* ------------------------------------------------------------ what to do, and hints ------------------------------------------------------------ */
  /* Dudu's shopping, shown with the market's task (and after it) so it is never forgotten */
  function duduList(a) {
    if (a.q.dudu !== 2) return "";
    const L = [["bread", "loaf"], ["coffee", "coffee"], ["fish", "fish"]], left = L.filter((x) => !a.items[x[1]]).map((x) => x[0]);
    return left.length ? " · Dudu’s list: still " + left.join(", ") + (left.includes("coffee") ? " (the coffee man, not Yosef)" : "") + "." : " · Dudu’s list is done: take it to his grandmother at the tram stop, on the market street.";
  }
  /* the checklist for each Act 1 place: { t: what, ok: done yet, opt: an extra, where: a hint while not done } */
  H.list = (scene) => {
    const a = A(), w = W(), q = a.q, it = a.items, r = (t, ok, where, opt) => ({ t, ok: !!ok, where, opt: !!opt });
    const L = {
      airport: [r("Through passport control", w.flags.passport, "The officer at the booth"), r("Read page 1 of the journal", w.pages[1], "Tap Journal"), r("Buy a train ticket to Jerusalem", w.flags.ticket, "The machine by the platforms")],
      train: [r("Ride the train up to Jerusalem", w.done.train, "Down to the platform, then on"), r("Talk to the soldier", q.eitan, "On the airport platform", 1)],
      rail: [r("Buy a travel card", it.card || q.dudu, "The kiosk at the stop"), r("Ride the tram to the market", a.rode.rail, "Step on board"), r("Offer to carry the woman's bags", q.metGrandma, "At the tram stop", 1)],
      market: [r("Weigh at Yosef's spice stall", done("market", "scales"), "Yosef, the spice seller"), r("Find who knew the Watchman", q.sack, "The halva seller, deeper in"), r("Buy frankincense from Yosef", it.frankincense, "10 shekels: the sack will need it"), r("Open the Watchman's old sack", w.done.market, "Ask Yosef about the sack in his corner: the Temple incense, a like weight, and the torn page"),
        r("Help Dudu (the boy with the football)", q.dudu, "In the market lane", 1),
        ...(q.dudu ? [r("Bread", it.loaf || q.dudu === 3, "The blue awning", 1), r("Coffee", it.coffee || q.dudu === 3, "The coffee man", 1), r("Fish", it.fish || q.dudu === 3, "The fish counter at the end", 1), r("Take it all to his grandmother", q.dudu === 3, "The tram stop, on the market street", 1)] : []),
        ],
      benyehuda: [r("Find the number of Gabriel's shop", q.found26, "Shmuel the violinist knows"), r("Go on to the shop", w.done.benyehuda, "Past the corner")],
      gabriel: [r("Talk to Gabriel", q.shopOpen, "Behind the counter"), r("Show him the journal", it.rod, "Ask about the journal"), r("Buy the map of the Old City", it.map, "His shop"), r("Buy a kippah", it.kippah, "His shop"), r("Choose a souvenir and look at it closely", w.done.gabriel, "Ask about souvenirs")],
      hotel: [r("Check in at the front desk", q.checkedIn, "The desk clerk"), r("Ask how to get to the Old City", q.hotelWay, "The desk clerk"), r("Get some sleep", q.slept, "Your room, upstairs"), r("In the morning, ask at the desk for messages", it.hotelnote, "The morning clerk"), r("Hear the man in grey out", q.hallerWhy, "By the window in the lobby", 1), r("Find the cash machine and get it to speak English", a.f.atm, "Beside the hotel door; the PIN is in the envelope", 1),
        r("Ask what to see first", q.hotelSee, "The desk clerk", 1), r("Ask whether anyone asked for you", q.hotelGrey, "The desk clerk", 1)],
      model: [r("Buy a museum ticket", it.museum, "At the museum"), r("Answer the guide's three questions", done("model", "modelq"), "The guide at the model"), r("Ask her about the Watchman", w.done.model, "The guide at the model"), r("Show her the frankincense", q.levShown, "If you bought it", 1)],
    };
    return L[scene.id] || null;
  };
  H.side = (scene) => (scene.id === "market" ? duduList(A()) : "");
  H.task = (scene) => {
    const a = A();
    if (scene.id === "airport" && !W().flags.passport) return "Passport control first. Answer the officer’s questions: page 1 says where you are going.";
    if (scene.id === "airport" && !W().flags.ticket) return "Read the first page. Ask at the window if you like. Buy a ticket to Jerusalem.";
    if (scene.id === "rail" && !a.items.card) return "The tram takes a travel card. The kiosk sells them. Ask the way while you are there.";
    const dudu = () => duduList(a);
    if (scene.id === "hotel") return !a.q.checkedIn ? "Check in at the front desk, and ask the clerk about tomorrow." : !a.q.slept ? "Go up to your room and get some sleep." : (!a.items.hotelnote ? "Morning. Go down to the desk and ask for messages." : !a.q.hallerDone ? "A man in a grey coat is waiting by the window. Hear him out." : "Out to the bus stop: the 38 to Jaffa Gate.");
    if (scene.id === "market") { if (!done("market", "scales")) return "Find Yosef the spice seller and weigh." + dudu(); if (!a.q.sack) return "Someone in the market knew the Watchman. Ask around." + dudu(); if (!W().done.market) return "Go back to Yosef the spice seller and ask about the old sack in his corner." + dudu(); if (a.q.dudu === 2) return dudu().slice(3); }
    if (scene.id === "benyehuda") return a.q.found26 ? "Number 26 is past the corner. Go on to Gabriel’s." : "Find the number of Gabriel’s shop. The page gave you a verse; the halva seller gave you the chapter. The Journal can show it to you.";
    if (scene.id === "gabriel") { if (!a.q.shopOpen) return "Talk to Gabriel."; if (!a.items.rod) return "Show Gabriel the journal."; if (!a.items.map || !a.items.kippah) return "Buy the map and a kippah for the Old City. Then choose a souvenir."; if (!W().done.gabriel) return "Choose a souvenir: buy the model and look at it closely."; }
    if (scene.id === "model") { if (!done("model", "modelq")) return "Ask the guide to show you the Temple, and answer her three questions."; if (!W().done.model) return "Ask the guide about the Watchman."; }
    return null;
  };
  H.hint = (scene, v, n) => {
    const a = A();
    if (scene.id === "benyehuda" && !a.q.found26) return n === 1 ? "Which angel brought Daniel the seventy weeks? The halva seller knows which chapter the Watchman read." : n === 2 ? "Daniel 9. Open it from the Journal and find the verse where Messiah is cut off." : "Daniel 9:26. Tell the violinist: 26.";
    if (scene.id === "market" && done("market", "scales") && !a.q.sack) return "The halva seller talks to anyone. Ask him about the man with the book.";
    if (scene.id === "gabriel" && !W().done.gabriel) return a.items.model ? "Turn each thing over. One has a lamp drawn on its base." : "Buy the model of the Temple from the counter, then choose.";
    if (scene.id === "model" && done("model", "modelq") && !W().done.model) return "Ask the guide whether a man with a journal came here.";
    return null;
  };

  /* ------------------------------------------------------------ Daniel 9 ------------------------------------------------------------ */
  const DAN9 = [
    "In the first year of Darius the son of Ahasuerus, of the seed of the Medes, which was made king over the realm of the Chaldeans;",
    "In the first year of his reign I Daniel understood by books the number of the years, whereof the word of the LORD came to Jeremiah the prophet, that he would accomplish seventy years in the desolations of Jerusalem.",
    "And I set my face unto the Lord God, to seek by prayer and supplications, with fasting, and sackcloth, and ashes:",
    "And I prayed unto the LORD my God, and made my confession, and said, O Lord, the great and dreadful God, keeping the covenant and mercy to them that love him, and to them that keep his commandments;",
    "We have sinned, and have committed iniquity, and have done wickedly, and have rebelled, even by departing from thy precepts and from thy judgments:",
    "Neither have we hearkened unto thy servants the prophets, which spake in thy name to our kings, our princes, and our fathers, and to all the people of the land.",
    "O Lord, righteousness belongeth unto thee, but unto us confusion of faces, as at this day; to the men of Judah, and to the inhabitants of Jerusalem, and unto all Israel, that are near, and that are far off, through all the countries whither thou hast driven them, because of their trespass that they have trespassed against thee.",
    "O Lord, to us belongeth confusion of face, to our kings, to our princes, and to our fathers, because we have sinned against thee.",
    "To the Lord our God belong mercies and forgivenesses, though we have rebelled against him;",
    "Neither have we obeyed the voice of the LORD our God, to walk in his laws, which he set before us by his servants the prophets.",
    "Yea, all Israel have transgressed thy law, even by departing, that they might not obey thy voice; therefore the curse is poured upon us, and the oath that is written in the law of Moses the servant of God, because we have sinned against him.",
    "And he hath confirmed his words, which he spake against us, and against our judges that judged us, by bringing upon us a great evil: for under the whole heaven hath not been done as hath been done upon Jerusalem.",
    "As it is written in the law of Moses, all this evil is come upon us: yet made we not our prayer before the LORD our God, that we might turn from our iniquities, and understand thy truth.",
    "Therefore hath the LORD watched upon the evil, and brought it upon us: for the LORD our God is righteous in all his works which he doeth: for we obeyed not his voice.",
    "And now, O Lord our God, that hast brought thy people forth out of the land of Egypt with a mighty hand, and hast gotten thee renown, as at this day; we have sinned, we have done wickedly.",
    "O Lord, according to all thy righteousness, I beseech thee, let thine anger and thy fury be turned away from thy city Jerusalem, thy holy mountain: because for our sins, and for the iniquities of our fathers, Jerusalem and thy people are become a reproach to all that are about us.",
    "Now therefore, O our God, hear the prayer of thy servant, and his supplications, and cause thy face to shine upon thy sanctuary that is desolate, for the Lord’s sake.",
    "O my God, incline thine ear, and hear; open thine eyes, and behold our desolations, and the city which is called by thy name: for we do not present our supplications before thee for our righteousnesses, but for thy great mercies.",
    "O Lord, hear; O Lord, forgive; O Lord, hearken and do; defer not, for thine own sake, O my God: for thy city and thy people are called by thy name.",
    "And whiles I was speaking, and praying, and confessing my sin and the sin of my people Israel, and presenting my supplication before the LORD my God for the holy mountain of my God;",
    "Yea, whiles I was speaking in prayer, even the man Gabriel, whom I had seen in the vision at the beginning, being caused to fly swiftly, touched me about the time of the evening oblation.",
    "And he informed me, and talked with me, and said, O Daniel, I am now come forth to give thee skill and understanding.",
    "At the beginning of thy supplications the commandment came forth, and I am come to shew thee; for thou art greatly beloved: therefore understand the matter, and consider the vision.",
    "Seventy weeks are determined upon thy people and upon thy holy city, to finish the transgression, and to make an end of sins, and to make reconciliation for iniquity, and to bring in everlasting righteousness, and to seal up the vision and prophecy, and to anoint the most Holy.",
    "Know therefore and understand, that from the going forth of the commandment to restore and to build Jerusalem unto the Messiah the Prince shall be seven weeks, and threescore and two weeks: the street shall be built again, and the wall, even in troublous times.",
    "And after threescore and two weeks shall Messiah be cut off, but not for himself: and the people of the prince that shall come shall destroy the city and the sanctuary; and the end thereof shall be with a flood, and unto the end of the war desolations are determined.",
    "And he shall confirm the covenant with many for one week: and in the midst of the week he shall cause the sacrifice and the oblation to cease, and for the overspreading of abominations he shall make it desolate, even until the consummation, and that determined shall be poured upon the desolate.",
  ];
  function daniel9() {
    K.card('<div class="kick">The Journal · Scripture</div><h2>Daniel, chapter 9</h2><div class="fscripture">' + DAN9.map((t, i) => '<p><b>' + (i + 1) + "</b> " + esc(t) + "</p>").join("") + '</div><button class="cta" data-act="x">Close</button>', { x: () => {} });
  }

  /* ------------------------------------------------------------ the tester’s shortcut: Act 1 as if played ------------------------------------------------------------ */
  FW.devAct1 = () => {
    const a = A(), w = W();
    Object.assign(a.q, { eitan: 1, metGrandma: 1, sack: 1, daniel: 1, greyKG: 1, shmuel: 1, found26: 1, shopOpen: 1, dudu: 3 });
    ["card", "frankincense", "note", "rod", "map", "kippah", "model", "museum", "greycard"].forEach((id) => (a.items[id] = 1));
    a.rides = 1; a.money = 20; Object.assign(a.rode, { rail: 1, benyehuda: 1, model: 1, hotel: 1 }); a.rides = 0;
    w.flags.ticket = 1; w.flags.bekah = 1; w.flags.modelq = 1; w.flags.passport = 1; a.items.slip = 1; w.done["airport:passport"] = 1;
    ["airport", "train", "rail", "market", "benyehuda", "gabriel", "model", "hotel"].forEach((id) => (w.done[id] = 1)); Object.assign(a.q, { checkedIn: 1, hotelWay: 1, slept: 1, metHaller: 1, hallerWant: 1, hallerWhy: 1, hallerDone: 1 }); a.items.roomkey = 1; a.items.hotelnote = 1;
    ["airport:ticket", "train:board", "market:scales", "gabriel:souvenir", "model:modelq"].forEach((k) => (w.done[k] = 1));
    [1, 2, 3, 4].forEach((n) => (w.pages[n] = 1)); save();
  };
})();
