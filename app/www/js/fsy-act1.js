/* Lamp — The Final Seven Years, Episode 1: the adventure layer for Act 1.
   People you talk to, money, things you buy and carry, rides on the travel card, doors that stay shut until
   you have the key, Dudu's side quest, and the Daniel 9 reader. Hooks into js/fsy-route.js through Lamp.fsyWalk.H.
   Design: the Claude Doc "Episode 1, Act 1: The Adventure Design". Portraits: img/fsy/people/<id>.png (Richard's drawings;
   until one exists the person shows as a lettered medallion). */
(() => {
  const Lamp = window.Lamp; const FW = Lamp.fsyWalk; if (!FW) return;
  const H = FW.H, C = FW.core, W = FW.W, K = Lamp.adv.kit, F = Lamp.fsy.parts, esc = K.esc, $ = (id) => document.getElementById(id);
  const PP = "img/fsy/people/";
  const PORTRAITS = new Set(["clerk", "soldier", "cardseller", "grandma", "grandma2", "yosef", "gabriel", "guide", "violinist", "halva", "baker", "dudu", "coffeeman", "fishman"]);   /* the people Richard has drawn (img/fsy/people/<id>.jpg); the rest show as lettered medallions */
  const save = () => Lamp.save();
  /* adventure state, inside the episode's save */
  const A = () => { const w = W(); if (!w.a) w.a = { money: 100, items: {}, rides: 0, facts: [], asked: {}, q: {}, f: {}, rode: {} }; return w.a; };
  const has = (id) => !!A().items[id];
  const done = (sceneId, pz) => !!W().done[sceneId + ":" + pz];

  /* ------------------------------------------------------------ short clips (Richard's 8-second videos of the people) ------------------------------------------------------------ */
  /* one clip per person, at that person's key moment. The file is video/fsy/<id>.mp4 with a poster video/fsy/<id>.jpg. */
  const CLIPS = new Set(["yosef"]);
  H.clip = (id) => {
    if (!CLIPS.has(id)) return "";
    setTimeout(() => {
      const v = document.querySelector(".fclip video"); if (!v) return;
      const p = v.play(); if (p && p.catch) p.catch(() => v.parentElement.classList.add("tap"));
      v.parentElement.onclick = () => { v.parentElement.classList.remove("tap"); v.currentTime = 0; v.play(); };
    }, 60);
    return '<div class="fclip"><video src="video/fsy/' + id + '.mp4" poster="video/fsy/' + id + '.jpg" playsinline preload="auto"></video><i>▶</i></div>';
  };

  /* ------------------------------------------------------------ money ------------------------------------------------------------ */
  H.money = () => '<div class="fmoney"><b>' + A().money + '</b> shekels' + (has("card") ? " · travel card, <b>" + A().rides + "</b> ride" + (A().rides === 1 ? "" : "s") + " left" : "") + "</div>";
  H.pay = (n, what) => {
    const a = A(); if (a.money < n) { K.say("Not enough. " + (what ? what[0].toUpperCase() + what.slice(1) : "That") + " costs " + n + " shekels and you have " + a.money + ".", "", 3600); return false; }
    a.money -= n; save(); F.S("step", "click", 0.5); return true;
  };
  H.earn = (n, from) => { const a = A(); a.money += n; save(); F.S("harp", null, 0.5); K.say("+" + n + " shekels" + (from ? ", from " + from : "") + ". You have " + a.money + ".", "", 3600); };

  /* ------------------------------------------------------------ things ------------------------------------------------------------ */
  const ITEMS = {
    card: ["A travel card", "Green plastic, four rides when new. The light rail and the buses take it."],
    frankincense: ["A twist of frankincense", "Levonah, from Yosef. Pale resin tears in a twist of paper. Priests and the curious."],
    loaf: ["The good loaf", "From the stall with the blue awning. For Dudu's grandmother."],
    coffee: ["A bag of coffee", "250 grams, from the man with the sacks. For Dudu's grandmother."],
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
      '<div class="fhim">' + text + "</div>" + (o.extra || "") +
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
    clerk: { name: "The ticket clerk", kick: "The airport station", desc: "A woman behind the glass, reading glasses on a chain, a paper cup of coffee. Bored, but kind.", lines: [
      { id: "which", say: "Which train goes to Jerusalem?", run: () => reply("clerk", "“All the way up? Yitzhak Navon. Twenty-five minutes, mostly tunnel. Seventeen shekels. Or the machine, if you prefer machines.”", { then: null }) },
      { id: "grey", say: "Did a man in a grey coat come through here?", run: () => reply("clerk", "“Grey coat, no luggage. Bought a ticket to Jerusalem and asked me if anyone had been asking for him. I said no.” She looks at you over the glasses. “Now I have said yes.”") },
      { id: "up", say: "What does ‘go up’ mean?", run: () => reply("clerk", "“You go up to Jerusalem. Always. Even from the north, you go up. It is on the mountains.” A shrug. “And it is Jerusalem.”") },
    ] },
    soldier: { name: "The soldier", kick: "The airport platform", desc: "A young man, nineteen or twenty, green uniform, a rifle slung, a paperback in his hand. Friendly, homesick.", lines: [
      { id: "home", say: "Going home?", run: () => { A().q.eitan = 1; save(); reply("soldier", "“Jerusalem. My mother is at the shuk every Friday, the bread stall with the blue awning. Tell her Eitan sent you. She will give you the good loaf.”"); fact("eitan", "Eitan’s mother sells bread under the blue awning at the market. Say Eitan sent you."); } },
      { id: "book", say: "What’s the book?", run: () => reply("soldier", "“Psalms. For the train.” He finds the page. “‘I was glad when they said unto me, Let us go into the house of the LORD.’ You know it? They sang it going up the steps.”") },
      { id: "mount", say: "Do you know the Temple Mount?", run: () => reply("soldier", "“I guarded it, two months. Everyone argues about it. Nobody looks.” He closes the book. “You look.”") },
    ] },
    cardseller: { name: "The card seller", kick: "The kiosk on Jaffa Road", desc: "A man with a thick moustache leaning out of a kiosk hung with phone chargers and lottery tickets. Talks fast.", lines: [
      { id: "card", say: "I need to take the light rail.", when: (a) => !a.items.card, run: () => reply("cardseller", "“Card. Ten shekels, four rides on it. No card, no ride, no arguing with the inspector.”", { btn: "Buy the card (10 shekels)", then: () => { if (H.pay(10, "the travel card")) { A().rides = 4; give("card"); } } }) },
      { id: "topup", say: "I’m out of rides.", when: (a) => a.items.card && a.rides === 0, run: () => reply("cardseller", "“Everybody is out of rides. Five shekels, one ride.”", { btn: "Top up (5 shekels)", then: () => { if (H.pay(5, "a ride")) { A().rides = 1; save(); K.say("One ride on the card.", "", 2500); } } }) },
      { id: "market", say: "How do I get to the market?", run: () => { fact("stops", "The market is three stops down the red line."); reply("cardseller", "“Three stops. Mahane Yehuda. You will smell it before you see it.”"); } },
      { id: "kg", say: "Which way is King George Street?", run: () => reply("cardseller", "“Down Jaffa Road, two stops, then left. Big street. Ben Yehuda runs into it.”") },
    ] },
    grandma: { name: "The woman at the stop", kick: "Jaffa Road", desc: "A grandmother in a sun hat and cardigan with two heavy shopping bags. Talks to everyone.", lines: [
      { id: "line", say: "Is this the right line for the market?", run: () => reply("grandma", "“Only one line, dear. Red. Everything is on it: the shuk, the Old City, all of it.”") },
      { id: "carry", say: "Can I carry those?", run: () => { A().q.metGrandma = 1; save(); reply("grandma", "“You can. My grandson was supposed to meet me. Dudu. If you see a boy with a football and no sense, that is him.”"); fact("dudu", "The woman at the stop is waiting for her grandson Dudu: a boy with a football."); } },
    ] },
    yosef: { name: "Yosef, the spice seller", kick: "Machne Yehuda", desc: "A big man in an apron, white hair, forearms dusted red with paprika. Does not suffer fools. Likes an honest customer.", lines: [
      { id: "buy", say: "I’d like to buy some spice.", when: () => !done("market", "scales"), run: () => reply("yosef", "“First you weigh. Everyone who buys from Yosef weighs.” He sets a worn stone on the left pan. “One shekel. Make it match.”", { btn: "Weigh", then: () => C.PUZZLES.scales.run() }) },
      { id: "lev", say: "Do you sell frankincense?", when: (a) => done("market", "scales") && !a.items.frankincense, run: () => reply("yosef", "“Levonah. Ten shekels the twist. Nobody buys it except priests and the curious.” He looks at you. “Which are you?”", { btn: "Buy a twist (10 shekels)", then: () => { if (H.pay(10, "the frankincense")) give("frankincense"); } }) },
      { id: "grey", say: "Has a man in a grey coat been here?", run: () => reply("yosef", "“He weighed nothing and asked a lot. I told him nothing.” He jerks his head down the lane. “Ask the halva man. He talks to anyone.”") },
      { id: "sack", say: "What’s in that sack?", when: (a) => a.q.sack && done("market", "scales") && !W().done.market, run: () => reply("yosef", "He looks at the sack in the corner for a long moment. “Not mine. A man left it last winter and never came back. Every Friday for a year, and then nothing.” He pushes it toward you with his foot. “Take it. It is bad for business.”", { btn: "Open the sack", then: () => C.finish("market") }) },
    ] },
    baker: { name: "The bread seller", kick: "The blue awning", desc: "A woman in her forties, hair tied up in a scarf, flour on her hands. Loaves on a board behind her.", lines: [
      { id: "loaf", say: "A loaf, please.", when: (a) => !a.items.loaf, run: () => reply("baker", "“Eight shekels.”", { btn: "Buy a loaf (8 shekels)", then: () => { if (H.pay(8, "a loaf")) give("loaf"); } }) },
      { id: "eitan", say: "Eitan sent me.", when: (a) => a.q.eitan && !a.items.loaf, run: () => { reply("baker", "“My Eitan? On the train?” Her whole face changes. “Then you take the good loaf, and you take it for nothing.”"); give("loaf"); } },
      { id: "spice", say: "Which way to the spices?", run: () => reply("baker", "“Down the lane, left at the fish, follow your nose.”") },
    ] },
    coffeeman: { name: "The man with the sacks", kick: "The coffee stall", desc: "Sacks of beans, a scoop in every tin, the smell of roasting. He does not look up from the grinder.", lines: [
      { id: "coffee", say: "250 grams of coffee.", when: (a) => !a.items.coffee, run: () => reply("coffeeman", "“Twelve.” He is already scooping.", { btn: "Buy the coffee (12 shekels)", then: () => { if (H.pay(12, "the coffee")) give("coffee"); } }) },
    ] },
    fishman: { name: "The man at the fish counter", kick: "The end of the lane", desc: "Smoked fish, herring, salads under the glass, and a man in a white coat with a cleaver.", lines: [
      { id: "fish", say: "One fish, please.", when: (a) => !a.items.fish, run: () => reply("fishman", "“Fifteen. Wrapped.”", { btn: "Buy the fish (15 shekels)", then: () => { if (H.pay(15, "the fish")) give("fish"); } }) },
      { id: "sell", say: "Would you buy this fish back?", when: (a) => a.items.fish && a.q.dudu !== 3, run: () => reply("fishman", "“Buy back a fish? Fifteen I sold it for, fifteen I give. I am not a thief.”", { btn: "Sell it back (15 shekels)", then: () => { delete A().items.fish; H.earn(15, "the fish counter"); } }) },
    ] },
    dudu: { name: "Dudu", kick: "The market lane", desc: "A boy of about ten with a football under his arm and a crumpled paper. Worried, trying not to show it.", lines: [
      { id: "lost", say: "Lost something?", when: (a) => !a.q.dudu, run: () => { A().q.dudu = 1; save(); reply("dudu", "“My grandmother’s list. I mean, I have the list. I lost the money. She said bread, coffee, and fish, and come straight back, and I went to look at the football shirts.”"); } },
      { id: "help", say: "I’ll help.", when: (a) => a.q.dudu === 1, run: () => { A().q.dudu = 2; save(); reply("dudu", "“You would?” He reads the list. “Bread from the blue stall. Coffee from the man with the sacks. Fish from the counter at the end. She is at the tram stop at the end of the lane. She is going to kill me.”"); fact("list", "Dudu’s list: bread (the blue awning), coffee (the man with the sacks), fish (the counter at the end). His grandmother waits at the market tram stop."); } },
      { id: "grey", say: "Who’s the man in the grey coat?", run: () => reply("dudu", "“He asked me if I had seen a man with a book. I said no. Then he gave me five shekels and I still said no.”") },
      { id: "thanks", say: "All right now?", when: (a) => a.q.dudu === 3, run: () => reply("dudu", "“She only shouted a little.” He grins. “Come back Friday, I will show you where the football shirts are.”") },
    ] },
    grandma2: { name: "Dudu’s grandmother", kick: "The tram stop by the market", when: (a) => a.q.dudu === 2 && a.items.loaf && a.items.coffee && a.items.fish, desc: "At the stop at the end of the lane, bags at her feet, looking for a boy with a football.", lines: [
      { id: "back", say: "I’ve brought Dudu. And the shopping.", run: () => { A().q.dudu = 3; delete A().items.loaf; delete A().items.coffee; delete A().items.fish; save();
        reply("grandma2", "“You brought him back and you brought the fish.” She takes the bags, then takes your hand. “I will tell you something for that.” From her purse, a folded paper. “My prayer. I go to the tunnel every week, to the place opposite the Holy of Holies, and I put it in the Wall. This week you put it in for me.” She closes your fingers over it. “And when you are there, look up.”", { leave: () => { H.earn(45, "Dudu’s grandmother"); give("note"); fact("note", "Put the grandmother’s prayer in the Wall opposite the Holy of Holies, in the tunnels. Then look up."); } }); } },
    ] },
    halva: { name: "The halva seller", kick: "Deeper in", desc: "A thin old man behind slabs of halva, a long knife in his hand, eyes everywhere.", lines: [
      { id: "piece", say: "Try a piece?", run: () => reply("halva", "“Pistachio. Two shekels.” The knife pauses. “Or free, if you tell me what you are looking for.”", { btn: "“A man’s journal.”", then: () => { A().q.greyKG = 1; save(); reply("halva", "He cuts you a piece. “Then you are the second person today. The first wore grey and did not buy halva. He went toward the city. King George Street, I think.” He wipes the knife. “Not a nice man.”"); fact("greykg", "The man in grey went toward King George Street."); } }) },
      { id: "book", say: "Who was the man with the book?", run: () => { A().q.sack = 1; A().q.daniel = 1; save(); reply("halva", "“He came every Friday for a year. Sat there with his book and read Daniel, chapter nine, every time, moving his lips. Weighed things at Yosef’s. Then he stopped coming.” He points the knife up the lane. “Yosef has his sack.”"); fact("daniel", "The Watchman read Daniel, chapter 9, every Friday. Yosef has his sack. The Journal can show you Daniel 9."); } },
    ] },
    violinist: { name: "Shmuel, the violinist", kick: "Ben Yehuda Street", desc: "An old man with a white beard, a battered violin, an open case with a few coins. He plays with his eyes shut.", lines: [
      { id: "coin", say: "(Drop a shekel in the case)", when: (a) => !a.q.shmuel, run: () => { if (!H.pay(1, "a shekel for the case")) return; A().q.shmuel = 1; save(); reply("violinist", "He opens his eyes. “For a shekel, a song. For a question, also a song.”"); } },
      { id: "where", say: "Where is Gabriel’s shop on King George?", when: (a) => a.q.shmuel && !a.q.found26, run: () => reply("violinist", "“Which number?”", { extra: '<div class="fchoices" id="fnum">' + [7, 9, 26, 62, 70].map((n) => '<button data-n="' + n + '">' + n + "</button>").join("") + "</div>" }) },
      { id: "grey", say: "Do you know a man in a grey coat?", when: (a) => a.q.shmuel, run: () => reply("violinist", "“He does not give. Not a shekel. A man who does not give to music, what else does he not give?”") },
      { id: "again", say: "Play it again?", when: (a) => a.q.found26, run: () => reply("violinist", "He plays Jerusalem of Gold, and for a minute the street stops to listen.") },
    ] },
    gabriel: { name: "Gabriel", kick: "Number 26", desc: "Behind the glass counter, under shelves of menorahs: a small old man with a long white beard, round glasses, a dark kippah, and a big voice. He is already talking about the end of days.", lines: [
      { id: "shmuel", say: "Shmuel says he’s still alive.", when: (a) => !a.q.shopOpen, run: () => { A().q.shopOpen = 1; save(); reply("gabriel", "“Shmuel has been dying for thirty years. Come in, come in.” He taps the counter. “Everybody who comes in here wants to know when. You want to know where. Good.”"); } },
      { id: "journal", say: "I have a journal.", when: (a) => a.q.shopOpen && !a.items.rod, run: () => { reply("gabriel", "He goes quiet. He goes into the back, and comes out with a wooden rod with marks cut along it and a small lamp burned into one end. “He left this. He said someone would come with the book. A cubit, the long one, the Temple cubit: fifty-two centimetres. You measure with it. You do not argue with it.”"); give("rod"); fact("cubit", "The Temple cubit is the long cubit: 52 centimetres. The Watchman’s rod is marked in them."); } },
      { id: "what", say: "What should I buy?", when: (a) => a.q.shopOpen, run: () => reply("gabriel", "“For the Old City? The map, or you will walk in circles like the man in grey. A kippah, or they will not let you near the Wall. A lamp, if you are going under the city. Oil you get at the spring; I do not sell oil.”", { btn: "Look at the counter", then: shop }) },
      { id: "souv", say: "Everyone takes a souvenir home.", when: (a) => a.q.shopOpen, run: () => reply("gabriel", "“Choose. But look first. Everything here, somebody put something into it.”", { btn: "Choose a souvenir", then: () => C.PUZZLES.souvenir.run() }) },
      { id: "grey", say: "Was the man in grey here?", when: (a) => a.q.shopOpen && !a.items.greycard, run: () => { reply("gabriel", "“Yesterday. Asked for a journal. I said I sell menorahs. He bought nothing and looked at everything.” He slides a card across the counter. “He looked at the model a long time. And he left this.”"); give("greycard"); fact("notnorth", "A card left by the man in grey: NOT NORTH."); } },
    ] },
    guide: { name: "The guide at the model", kick: "The Israel Museum", desc: "An older woman with grey hair in a bun, a museum lanyard, a wooden pointer. Precise, dry, delighted by a good question.", lines: [
      { id: "show", say: "Can you show me the Temple?", when: () => !done("model", "modelq"), run: () => reply("guide", "“I can show you where they put it. Whether that is where it was is a longer conversation.” She lifts the pointer. “Walk round. I will ask you three things.”", { btn: "Answer her questions", then: () => C.PUZZLES.modelq.run() }) },
      { id: "lev", say: "(Show her the frankincense) What was this for?", when: (a) => a.items.frankincense, run: () => { reply("guide", "“Levonah.” She does not touch it. “Burned on the golden altar inside the sanctuary, morning and evening. The altar stood here, before the veil.” The pointer taps the model. “Remember that: the incense was inside. The sacrifices were outside, in the middle of the court.”"); fact("incense", "The altar of incense was inside the sanctuary. The altar of sacrifice was outside, in the middle of the court."); } },
      { id: "man", say: "Did a man with a journal come here?", when: () => done("model", "modelq") && !W().done.model, run: () => reply("guide", "“Every Friday. He stood where you are standing and looked east.” She lowers the pointer to the rail. “He left something under there once. I have not touched it.”", { btn: "Look under the rail", then: () => C.finish("model") }) },
    ] },
  };
  /* the violinist's number: wired after the reply card is on screen */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("#fnum [data-n]"); if (!b) return;
    const n = +b.dataset.n; K.sfx("click"); e.target.closest(".asheet").remove();
    if (n === 26) { A().q.found26 = 1; save(); fact("gabriel26", "Gabriel’s shop: 26 King George Street (Daniel 9:26)."); reply("violinist", "“Then you have read your Daniel.” He tucks the violin under his chin. “Past the corner, the window with the name in gold and the menorahs. Tell him Shmuel is still alive.” He plays Jerusalem of Gold."); }
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
  H.souvenirGate = () => { if (has("model")) return true; K.say("Gabriel: “Choose, yes. But the model you buy first. Thirty shekels. Look at the counter.”", "", 3400); return false; };

  /* ------------------------------------------------------------ rides and doors ------------------------------------------------------------ */
  const RIDE = { rail: "Navon station to Machne Yehuda", benyehuda: "The tram to King George Street", model: "The number 66 bus to the Israel Museum", jaffa: "The tram to City Hall, and a walk to Jaffa Gate" };
  function ride(key, then) {
    const a = A();
    if (a.rode[key]) return true;
    if (!a.items.card) { K.card('<div class="kick">The light rail</div><h2>No card, no ride</h2><p>The tram takes a travel card, not cash. The kiosk at the stop on Jaffa Road sells one: ten shekels, four rides.</p><button class="cta" data-act="x">Back</button>', { x: () => {} }); return false; }
    if (a.rides <= 0) { K.card('<div class="kick">The travel card</div><h2>No rides left</h2><p>The card is empty. The kiosk on Jaffa Road tops it up: five shekels a ride. It is a walk back.</p>' + (a.money >= 5 ? '<button class="cta" data-act="t">Walk back and top up (5 shekels)</button>' : "<p>And you have " + a.money + " shekels. Sell something first.</p>") + '<button class="cta alt" data-act="x">Not now</button>', { t: () => { if (H.pay(5, "a ride")) { A().rides = 1; save(); ride(key, then); } }, x: () => {} }); return false; }
    K.card('<div class="kick">The travel card</div><h2>' + esc(RIDE[key]) + "</h2><p>One ride off the card. " + (a.rides - 1) + " left after this.</p>" + '<button class="cta" data-act="r">Ride</button><button class="cta alt" data-act="x">Not yet</button>',
      { r: () => { a.rides--; a.rode[key] = 1; save(); F.S("step", "click", 0.6); then(); }, x: () => {} });
    return false;
  }
  H.before = (scene, v) => {
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
    if (s.id === "jaffa") {
      if (!has("map") || !has("kippah")) { K.card('<div class="kick">The Old City</div><h2>Not yet</h2><p>Gabriel was clear: not without the map, and not without a kippah. ' + (has("map") ? "You have the map." : "You have no map.") + " " + (has("kippah") ? "You have the kippah." : "You have no kippah.") + " His shop is at 26 King George Street.</p><button class=\"cta\" data-act=\"x\">Back</button>", { x: () => {} }); return false; }
      return ride("jaffa", () => FW.go(s.id));
    }
    return true;
  };

  /* ------------------------------------------------------------ what to do, and hints ------------------------------------------------------------ */
  H.task = (scene) => {
    const a = A();
    if (scene.id === "airport" && !W().flags.ticket) return "Read the first page. Ask at the window if you like. Buy a ticket to Jerusalem.";
    if (scene.id === "rail" && !a.items.card) return "The tram takes a travel card. The kiosk sells them. Ask the way while you are there.";
    if (scene.id === "market") { if (!done("market", "scales")) return "Find Yosef the spice seller and weigh."; if (!a.q.sack) return "Someone in the market knew the Watchman. Ask around."; if (!W().done.market) return "Ask Yosef about the sack."; if (a.q.dudu === 2) return "Bread, coffee, fish: then Dudu’s grandmother at the tram stop at the end of the lane."; }
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
    a.rides = 1; a.money = 20; Object.assign(a.rode, { rail: 1, benyehuda: 1, model: 1 });
    w.flags.ticket = 1; w.flags.bekah = 1; w.flags.modelq = 1;
    ["airport", "train", "rail", "market", "benyehuda", "gabriel", "model"].forEach((id) => (w.done[id] = 1));
    ["airport:ticket", "train:board", "market:scales", "gabriel:souvenir", "model:modelq"].forEach((k) => (w.done[k] = 1));
    [1, 2, 3, 4].forEach((n) => (w.pages[n] = 1)); save();
  };
})();
