/* Lamp — "The Final Seven Years", Episode 1 "The Jerusalem Mystery": the WALKING version (Richard, Oct 27, 2026).
   The whole route through Jerusalem, 31 scenes in five acts, built from Richard's own photographs, walked Myst-style:
   each scene is a set of viewpoints you tap through (forward, left, right, back); objects in the picture open cards;
   the puzzles are solved on the spot; the Watchman's journal collects twelve lamp-signed pages.
   A viewpoint whose photo has not been supplied yet shows a labelled placeholder, so the prototype can be played end to end.
   The puzzles built earlier (the Temple Institute, the Tombs of the Prophets, the view from the Mount of Olives, Robinson's Arch,
   the Temple Mount clues and verdict, the Eastern Gate) live in js/fsy.js and are called from here.
   Progress lives in Lamp.state.adv.p.fsy.w  = { done: {sceneId:1}, pages: {n:1}, at: sceneId, flags… } */
(function () {
  "use strict";
  const Lamp = window.Lamp;
  if (!Lamp || !Lamp.fsy || !Lamp.fsy.parts) return;
  const F = Lamp.fsy.parts, K = Lamp.adv.kit, esc = K.esc, $ = (id) => document.getElementById(id);
  const IMG = "img/fsy/w/";

  /* ------------------------------------------------------------ the journal: the Watchman's twelve pages ------------------------------------------------------------ */
  const PAGES = {
    1: { at: "airport", text: "Where did the Temple stand? Don’t trust the first answer.", ref: "" },
    2: { at: "market", text: "A just weight is his delight. Weigh everything you are told. Then go and see the city as it was: the model, at the museum.", ref: "Proverbs 11:1" },
    3: { at: "gabriel", text: "Everyone takes a souvenir home. Take the one that remembers the house. Then walk about Zion, and tell the towers thereof.", ref: "Psalm 48:12" },
    4: { at: "model", text: "Mark it well: the house faced the rising sun. Whatever stands in its way is not the house. Go in at Jaffa Gate and climb the wall.", ref: "Ezekiel 43:4" },
    5: { at: "jewish", text: "Not one stone upon another, he said. But they left the stones below the ground. Go down to the Wall, and then deeper.", ref: "Luke 19:44" },
    6: { at: "wilson", text: "The Wall goes deeper than you think. Follow the stones down. Count them: you will need the number again.", ref: "" },
    7: { at: "tunnels", text: "This is the first answer. Don’t believe it yet. When the sky clears, go back up on the wall and down to the garden.", ref: "" },
    8: { at: "gtomb", text: "He is not here. The answer is not where they told you either. Go through the market street to Zion, where David lies.", ref: "Mark 16:6" },
    9: { at: "zion", text: "On the sides of the north, the city of the great King. Go down to where the city began, and come up by the water.", ref: "Psalm 48:2" },
    10: { at: "siloam", text: "Sent, and came seeing. Climb the steps the pilgrims climbed. Then see what is ready at the Institute. Everything but one thing.", ref: "John 9:7" },
    11: { at: "institute", text: "Stand where His feet shall stand, and look back at the gate. Then you will see where it stood.", ref: "Zechariah 14:4" },
    12: { at: "gethsemane", text: "Go up. Measure. The answer is waiting. He is looking too.", ref: "" },
  };

  /* ------------------------------------------------------------ the route ------------------------------------------------------------ */
  /* A scene: { id, act, title, kick, music, amb, views:[…], puzzle, page, optional, kept }.
     A view: { id, img (file in img/fsy/w/, or null = placeholder), cap, hank (a line the Lamplighter says here), go:{fwd,left,right,back},
               hots:[{box:[l,t,w,h] in %, label, text | ref | act}], puzzle (key into PUZZLES), note (a card shown once) }. */
  const ACTS = [
    { n: 1, title: "Arrival", sub: "The airport, the train, the market, the museum" },
    { n: 2, title: "The walls", sub: "Jaffa Gate, the Ramparts, the Wall and the tunnels, the Garden Tomb" },
    { n: 3, title: "The City of David", sub: "Zion, the spring, the tunnel, the pool, the steps" },
    { n: 4, title: "The line from the east", sub: "The Institute, the gates, the tombs, the Mount of Olives" },
    { n: 5, title: "The Temple Mount", sub: "The Mughrabi Gate, the clues, the verdict, the sealed gate" },
  ];
  const R = [];
  const S = (o) => { R.push(o); return o; };

  /* ---- Act 1 ---- */
  S({ id: "airport", act: 1, title: "Ben Gurion Airport", kick: "Welcome to Israel", music: "m9", amb: "street", kept: "intro",
    views: [{ id: "hall", img: "airport-1", cap: "The arrivals hall at Ben Gurion. The investigation begins here." }] });
  S({ id: "train", act: 1, title: "The train to Jerusalem", kick: "Navon station", music: "m9", amb: "street",
    views: [
      { id: "board", img: "train-board", cap: "The platform at the airport station: flags down the hall, and the departures board on the pillar", hank: "Every pilgrim came up to Jerusalem. The word is always up, never down: the city sits on the mountains. Find your train.",
        go: { fwd: "platform" }, puzzle: "board" },
      { id: "platform", img: "train-platform", cap: "The platform: the fast train to Jerusalem, its sign lit on the front", go: { back: "board", fwd: "navon" },
        hots: [{ box: [55, 20, 35, 40], label: "A man in a grey coat on the far platform", text: "On the far platform a man in a grey coat is reading something small, folded, blue at the edges. He looks up, straight at you, and then the train comes between you." }] },
      { id: "navon", img: "train-navon", cap: "Yitzhak Navon station, Jerusalem: the deep escalators up to the light", hank: "Eighty metres underground, and now up. You have come to Jerusalem.", go: { back: "platform" } },
    ] });
  S({ id: "rail", act: 1, title: "The light rail", kick: "Jaffa Road", music: "m9", amb: "street",
    views: [
      { id: "stop", img: "rail-1", cap: "The light rail on Jaffa Road: the way you will move through the city", hank: "The red line runs along Jaffa Road, from the station to the Old City. Every stop you earn, lights up on the map. Tap the map whenever you want to move.",
        go: { fwd: "inside" }, hots: [{ box: [0, 60, 100, 25], label: "The tracks", text: "The tracks run straight down Jaffa Road to Jaffa Gate. The first stop is the market." }] },
      { id: "inside", img: "rail-2", cap: "On the tram, Jaffa Road: the city going past", go: { back: "stop", fwd: "machne" } },
      { id: "machne", img: "rail-3", cap: "The Mahane Yehuda stop: two trams, and the crowd heading for the market", go: { back: "inside" },
        hots: [{ box: [55, 30, 40, 45], label: "The crowd at the stop", text: "Everyone is getting off here. The market is just across the road, behind the shops." }] },
    ] });
  S({ id: "market", act: 1, title: "Machne Yehuda market", kick: "The shuk", music: "m10", amb: "street", page: 2,
    views: [
      { id: "street", img: "market-street", cap: "The main lane of the market, under its glass roof: sweets, spices, coffee, noise", hank: "Machne Yehuda. Everything in Jerusalem is weighed and argued over, and has been for three thousand years. Find the spice seller.",
        go: { fwd: "deeper", left: "bread", right: "juice" }, hots: [{ box: [60, 10, 38, 50], label: "A grey coat in the crowd", text: "For a moment, between the stalls, a grey coat. Then only shoppers." }] },
      { id: "bread", img: "market-bread", cap: "Down another lane: round loaves stacked by the counter, trays of pastries opposite", go: { right: "street" },
        hots: [{ box: [80, 30, 20, 20], label: "The loaves", text: "“Shabbat shalom! Bread? No? The spices are further in, my friend. Ask for a just weight.” The baker laughs." }] },
      { id: "juice", img: "market-stall", cap: "A sweet stall: ice cream, fruit and toppings in rows of little tubs", go: { left: "street" }, hots: [{ box: [50, 50, 45, 22], label: "The fruit", text: "Mango, figs, pomegranate seeds, grapes: the fruits of the land. “A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey” (Deuteronomy 8:8)." }] },
      { id: "deeper", img: "market-deeper", cap: "Deeper in: baklava and halva on one side, oranges and pomegranates on the other", go: { back: "street", fwd: "spice", left: "coffee", right: "kaldron" },
        hots: [{ box: [15, 30, 15, 10], label: "Rimon", text: "The sign says Rimon: Hebrew for pomegranate. “Upon the hem of it thou shalt make pomegranates of blue, and of purple, and of scarlet” (Exodus 28:33): the High Priest’s robe was hung with them." }] },
      { id: "coffee", img: "market-coffee", cap: "Tins of coffee beans, each with its handwritten card, and a scoop in every one", go: { right: "deeper" } },
      { id: "kaldron", img: "market-kaldron", cap: "Another lane: a bakery sign, dried fruit and nuts, shoppers with their trolleys", go: { left: "deeper", fwd: "fish" } },
      { id: "fish", img: "market-fish", cap: "A fish counter: smoked fish, herring and salads under the glass", go: { back: "kaldron" },
        hots: [{ box: [10, 30, 25, 50], label: "The fish", text: "“Cast the net on the right side of the ship, and ye shall find” (John 21:6). Galilee fishermen sold their catch in Jerusalem’s markets: one of the city’s gates was called the fish gate (Nehemiah 3:3)." }] },
      { id: "spice", img: "market-spice", cap: "The spice seller’s stall: bowls heaped with paprika, turmeric and herbs, and a balance on the counter", go: { back: "deeper" }, puzzle: "scales",
        hots: [{ box: [10, 45, 80, 20], label: "The bowls of spice", text: "Paprika, turmeric, cumin, zaatar, hyssop. “Purge me with hyssop, and I shall be clean” (Psalm 51:7)." }] },
    ] });
  S({ id: "gabriel", act: 1, title: "Gabriel’s shop", kick: "King George Street", music: "m10", amb: "indoor", page: 3,
    views: [
      { id: "street", img: "gabriel-street", go: { fwd: "inside", right: "synagogue" }, cap: "Number 26, King George Street, by Ben Yehuda: GABRIEL in gold on the window, and menorahs behind the glass", hank: "Downtown, where the city shops. A small souvenir shop, with a name in gold on the window. The owner is called Gabriel: the name of the angel who brought Daniel the seventy weeks." },
      { id: "inside", img: "gabriel-inside", cap: "The window: GABRIEL in gold, shelves of books and silver, a golden Ark on the top shelf, menorahs of every colour", go: { back: "street", left: "shelf" }, puzzle: "souvenir",
        hots: [{ box: [0, 60, 100, 30], label: "Gabriel, behind the counter", act: "gabrielTalk" },
          { box: [40, 24, 20, 8], label: "The golden Ark", text: "A little golden model of the Ark of the Covenant, the cherubim facing each other on its lid, up on the top shelf. Remember it: you will see the real-size one at the Temple Institute." }] },
      { id: "shelf", img: "gabriel-shelf", cap: "A shelf inside: a silver kiddush cup, a name in painted letters, Havdalah candles below", go: { right: "inside" },
        hots: [{ box: [12, 2, 28, 40], label: "The silver cup", text: "A kiddush cup, engraved with the walls of Jerusalem: the cup of blessing over wine on the Sabbath. “The cup of blessing which we bless” (1 Corinthians 10:16)." }] },
      { id: "synagogue", img: "synagogue", cap: "Up King George Street: the Jerusalem Great Synagogue", go: { back: "street", fwd: "doors" },
        hots: [{ box: [25, 15, 50, 55], label: "The building", text: "Number 56, King George Street, finished in 1982. Its architect, Alexander Friedman, modelled its style on the Temple in Jerusalem: a tall front, and a great gate. The synagogue is built to look like the house it is waiting for." }] },
      { id: "doors", img: "synagogue-doors", cap: "The great doors, panel after panel, and above them the tall windows", go: { back: "synagogue" } },
    ] });
  S({ id: "model", act: 1, title: "The Second Temple model", kick: "The Israel Museum", music: "m11", amb: "street", page: 4,
    views: [
      { id: "wide", img: "model-wide", cap: "The great model of Jerusalem in the year 66: the city packed inside its walls, Herod’s towers on the skyline", hank: "Jerusalem as it was in the last days of the Second Temple, to the scale of one in fifty. Walk round it. Learn the courts and the gates: you will pace them out on the Mount itself.",
        go: { fwd: "temple", left: "east", right: "south" } },
      { id: "east", img: "model-east", cap: "The eastern side of the model: the long eastern wall, its gate with the stair, and the sanctuary rising behind", go: { right: "wide", fwd: "temple" },
        hots: [{ box: [40, 52, 22, 20], label: "The eastern gate of the model", text: "One gate in the eastern wall, in line with the sanctuary. Through it, Ezekiel saw the glory of the LORD come in “by the way of the gate whose prospect is toward the east” (Ezekiel 43:4)." }] },
      { id: "south", img: "model-south", cap: "The south-west corner of the model: the Royal Stoa along the top of the wall, and the street below", go: { left: "wide" },
        hots: [{ box: [0, 28, 75, 25], label: "The Royal Stoa", text: "Herod’s great columned hall along the south side of the Temple Mount. Below its corner ran the street you will stand on at Robinson’s Arch, where its stones now lie." }] },
      { id: "temple", img: "model-temple", cap: "Close up from the east: the gate in the eastern wall, the Court of the Women behind it, and the sanctuary, white and gold", go: { back: "wide" }, puzzle: "modelq",
        hots: [{ box: [35, 12, 30, 25], label: "The sanctuary", text: "The house itself, white stone and gold, facing east. Behind its veil, the Holy of Holies: twenty cubits square, and empty, since the Ark was lost." }] },
    ] });

  /* ---- Act 2 ---- */
  S({ id: "jaffa", act: 2, title: "Jaffa Gate", kick: "Into the Old City", music: "m12", amb: "street",
    views: [
      { id: "approach", img: "jaffa-0", cap: "The bridge to Jaffa Gate, with the citadel and the Tower of David along the wall", go: { fwd: "outside" },
        hots: [{ box: [55, 50, 35, 25], label: "The great menorah", text: "A giant menorah stands in the square for Hanukkah: the feast that remembers the Temple cleansed and the lamp relit (John 10:22)." }] },
      { id: "outside", img: "jaffa-1", cap: "Jaffa Gate and the Tower of David", hank: "Jaffa Gate, where the road from the sea comes in. The wall you see was built by Suleiman in 1538, on older walls, on older walls still. Find the way up onto it.",
        go: { fwd: "inside", back: "approach" }, hots: [{ box: [55, 20, 40, 50], label: "The Tower of David", text: "The citadel, called the Tower of David, though Herod built it. The Ramparts Walk starts from its gate." }] },
      { id: "inside", img: "jaffa-2", cap: "Inside the gate: the square, the street down into the city", go: { back: "outside", right: "armenian" }, puzzle: "wayup" },
      { id: "armenian", img: "jaffa-3", cap: "Inside the gate, looking toward the Armenian Quarter: shops, shawarma, and the street running south", go: { left: "inside" },
        hots: [{ box: [0, 20, 45, 40], label: "The old buildings", text: "To the south lies the Armenian Quarter, the smallest of the four, where Armenian Christians have lived since the fourth century. Straight ahead, down David Street, the souk drops toward the Temple Mount." }] },
    ] });
  S({ id: "ramparts", act: 2, title: "The Ramparts Walk", kick: "On the city wall", music: "m12", amb: "olives",
    views: [
      { id: "stairs", img: "ramparts-stairs", cap: "The stone stairs up onto the wall: iron railings, an arch below the walkway, the battlements above", hank: "Walk about Zion, and go round about her: tell the towers thereof. Up you go.", go: { fwd: "jaffa" } },
      { id: "jaffa", img: "ramparts-jaffa", cap: "On the wall above Jaffa Gate: the gate below you, the square, and the citadel beyond", go: { back: "stairs", fwd: "north1", left: "tower" },
        hots: [{ box: [30, 40, 22, 22], label: "Jaffa Gate", text: "The gate you came in by, far below. From up here you can see why Suleiman built it with a bend inside: an enemy could not charge straight through." }] },
      { id: "tower", img: "ramparts-tower", cap: "Looking south along the wall: the Tower of David, and Mount Zion beyond", go: { right: "jaffa", fwd: "towerclose" },
        hots: [{ box: [0, 15, 20, 40], label: "The Tower of David", text: "The minaret is Ottoman, but the base of the citadel is Herod’s tower, Phasael, where the Roman garrison of the Upper City kept watch. Behind it, the dark cone roof on Mount Zion is the Church of the Dormition." }] },
      { id: "towerclose", img: "ramparts-tower-close", cap: "The Tower of David close up: Herod’s stones at the bottom, the Ottoman minaret on top", go: { back: "tower", fwd: "minaret" } },
      { id: "minaret", img: "ramparts-minaret", cap: "The minaret on top of the citadel, crows on its rail", go: { back: "towerclose" },
        hots: [{ box: [25, 25, 30, 50], label: "The minaret", text: "Built by the Ottomans in the 1600s on top of the citadel. Travellers saw it from far off and called the whole fortress the Tower of David, though David never saw it: the tower beneath is Herod’s." }] },
      { id: "north1", img: "ramparts-north", cap: "On the wall, walking north: the walkway between the battlements, the domes and bell towers of the Christian Quarter below", go: { back: "jaffa", fwd: "arch" }, puzzle: "landmarks" },
      { id: "arch", img: "ramparts-arch", cap: "Further along: iron arches over the walk, and two doves sitting on the first", go: { back: "north1", fwd: "golgotha" },
        hots: [{ box: [30, 0, 40, 30], label: "The two doves", text: "Two turtledoves, side by side on the arch. “A pair of turtledoves, or two young pigeons”: the offering Mary and Joseph brought to the Temple for Jesus (Luke 2:24)." }] },
      { id: "golgotha", img: "ramparts-golgotha", cap: "From the wall near Damascus Gate: Skull Hill, the place called Golgotha, across the road", go: { back: "arch", fwd: "sky" },
        hank: "Look across the road. The rock face with the hollows of a skull: Golgotha. “And he bearing his cross went forth into a place called the place of a skull.”",
        hots: [{ box: [15, 35, 70, 30], label: "Skull Hill", text: "“And he bearing his cross went forth into a place called the place of a skull, which is called in the Hebrew Golgotha” (John 19:17). Below it, a garden, and in the garden a tomb (John 19:41)." }] },
      { id: "sky", img: "ramparts-sky", cap: "The sky over the city turns: a great grey cloud rolling in over the rooftops, in October, out of the rainy season", go: { back: "golgotha", fwd: "storm" },
        hots: [{ box: [10, 10, 80, 50], label: "The cloud", text: "October: the dry season, months before the rains should come. And yet the sky over Jerusalem goes the colour of slate in a quarter of an hour. “He causeth the vapours to ascend from the ends of the earth; he maketh lightnings for the rain” (Psalm 135:7)." }] },
      { id: "storm", img: "ramparts-storm", cap: "The wall ahead, toward Damascus Gate: the sky has gone black", go: { back: "sky" }, puzzle: "storm" },
    ] });
  S({ id: "jewish", act: 2, title: "The Jewish Quarter", kick: "After the storm", music: "m14", amb: "street", page: 5,
    views: [
      { id: "streetsign", img: "jewish-sign", cap: "Jewish Quarter Street: a sign pointing the way to the Western Wall, the Hurva, the Burnt House and the Cardo", go: { fwd: "cardo" } },
      { id: "cardo", img: "jq-cardo-2", cap: "The Cardo: the columns of the Roman main street, below today’s street", hank: "The rain is easing. This was the main street of Roman Jerusalem, built after the Temple fell. The city has been rebuilt on its own ruins again and again.",
        go: { fwd: "hurva", left: "burnt", right: "cardosign", back: "streetsign" }, hots: [{ box: [35, 35, 15, 55], label: "The columns", text: "Columns of the Cardo Maximus, the street of Hadrian’s city, Aelia Capitolina, built in the second century on the levelled ruins." }] },
      { id: "cardosign", img: "jq-cardo-sign", cap: "The sign by the railing: “Western Cardo”, in Hebrew, Arabic and English", go: { left: "cardo", fwd: "columns" },
        hots: [{ box: [0, 40, 30, 30], label: "The English text", text: "“Remains of a magnificent main road from the Roman-Byzantine period, serving throughout time until today as a major thoroughfare for shopping.” The street Hadrian built over the ruins, still in use." }] },
      { id: "columns", img: "jq-cardo", cap: "Along the columns", go: { back: "cardosign" } },
      { id: "hurva", img: "jewish-hurva", cap: "The Hurva Synagogue, rebuilt in 2010, and the golden menorah in its glass case", go: { back: "cardo", fwd: "wallsteps", left: "spices", right: "bagel" },
        hots: [{ box: [28, 62, 34, 25], label: "The golden menorah", text: "Pure gold, seven lamps, made to the Temple Institute’s research for the Third Temple, waiting here in a glass case for the day it stands in the sanctuary. “Thou shalt make a candlestick of pure gold” (Exodus 25:31)." },
          { box: [15, 5, 70, 35], label: "The dome", text: "Hurva means “ruin”. It was destroyed in 1721, rebuilt in 1864, blown up in 1948, and rebuilt again in 2010. Jerusalem keeps rebuilding." }] },
      { id: "spices", img: "jewish-spices", cap: "A spice shop off the square: bowls heaped high, each with its handwritten card", go: { right: "hurva" },
        hots: [{ box: [0, 45, 100, 40], label: "The spices", text: "Cinnamon, cardamom, saffron, cumin. The holy anointing oil and the Temple incense were made of spices weighed out by the shekel of the sanctuary: “Take thou also unto thee principal spices” (Exodus 30:23)." }] },
      { id: "bagel", img: "jewish-bagel", cap: "Holy Bagel, under a stone arch: people queuing for lunch", go: { left: "hurva" },
        hots: [{ box: [10, 20, 80, 15], label: "The sign", text: "Even the bagels are holy in this quarter. Under the sign, in small Hebrew letters: “B’siyata dishmaya”, with the help of Heaven." }] },
      { id: "burnt", img: "jewish-burnt", cap: "The Burnt House Museum, Beit Katros: a white doorway under an old arch, the house of a priestly family burned in the year 70", go: { right: "cardo" }, puzzle: "burnt",
        hots: [{ box: [35, 30, 35, 10], label: "The name", text: "Beit Katros: the house of Kathros, a priestly family named in the Talmud, and found written on a stone weight in the ash here. The house lies below today’s street, under two metres of burnt debris." }] },
      { id: "wallsteps", img: null, cap: "The wide steps down from the Jewish Quarter to the Western Wall plaza", go: { back: "hurva" }, hank: "Down the steps, and there it is." },
    ] });
  S({ id: "wall", act: 2, title: "The Western Wall", kick: "The Kotel", music: "m14", amb: "street",
    views: [
      { id: "plaza", img: "wall-plaza", cap: "The Western Wall plaza, from above: the prayer courts, the great stones", hank: "The Western Wall. Not the Temple: the retaining wall Herod built to hold up the platform the Temple stood on. People have prayed at these stones for two thousand years. Go down to them.",
        go: { fwd: "stones" } },
      { id: "stones", img: "wall-mens", cap: "At the Wall: the men’s section, Herod’s great stones, men at prayer", go: { back: "plaza", left: "arch", right: "gold" },
        hots: [{ box: [0, 0, 100, 70], label: "The stones", text: "“If I forget thee, O Jerusalem, let my right hand forget her cunning” (Psalm 137:5). The lowest courses you can see are Herod’s: each stone with its smooth drafted margin. Seventeen more courses lie below the pavement: you will see them down the shaft under Wilson’s Arch." },
          { box: [0, 70, 100, 30], label: "A note in blue ink", text: "Among the thousands of prayers folded into the cracks, one is blue at the edges. You leave it where it is: prayers are not yours to read. But someone with blue ink was here." }] },
      { id: "arch", img: "wall-arch", cap: "To the left of the open Wall: the dark doorway into the covered prayer hall under Wilson’s Arch", go: { right: "stones" }, hank: "To the left, under the arch, the Wall goes on indoors. A man in a grey coat just went in.",
        hots: [{ box: [25, 38, 12, 9], label: "The doorway", text: "The arched doorway with the curved iron gate leads into the prayer hall under Wilson’s Arch. A man in a grey coat goes in ahead of you." }] },
      { id: "gold", img: "wall-gold", cap: "Further along: a golden menorah at the foot of the Wall, and the screen where the women’s section begins", go: { left: "stones", right: "womens" } },
      { id: "womens", img: "wall-womens", cap: "The women’s section, under the white umbrellas, and the wooden Mughrabi ramp beyond", go: { left: "gold", fwd: "ramp" } },
      { id: "ramp", img: "wall-ramp", cap: "The south end of the plaza: the covered ramp climbing to the Mughrabi Gate. Not yet: that is the last way up", go: { back: "womens" } },
    ] });
  S({ id: "wilson", act: 2, title: "Under Wilson’s Arch", kick: "The prayer hall", music: "m14", amb: "indoor", page: 6,
    views: [
      { id: "door", img: "wilson-plaza", cap: "From the plaza: the tall stone wall, and the dark arched doorway into the prayer hall", go: { fwd: "doorclose" } },
      { id: "doorclose", img: "wilson-door", cap: "The doorway under the arch, at the north end of the Wall: men coming and going", go: { back: "door", fwd: "hall" } },
      { id: "hall", img: "wilson-hall", cap: "The prayer hall under Wilson’s Arch: the great vault overhead, the Wall on the right, men at study", hank: "Wilson’s Arch. In the Temple’s day it carried a bridge from the Upper City straight across to the Mount. Speak softly here.",
        go: { fwd: "shaft", left: "scrolls", back: "door" } },
      { id: "scrolls", img: "wilson-scrolls", cap: "The Torah ark against the Wall, men at prayer before it", go: { right: "hall" }, hots: [{ box: [20, 10, 60, 70], label: "The scrolls", text: "“Thy word is a lamp unto my feet, and a light unto my path” (Psalm 119:105)." }] },
      { id: "shaft", img: "wilson-shaft", cap: "A glass-covered shaft in the floor: Herod’s stones going down and down below the hall", go: { back: "hall" }, puzzle: "courses" },
    ] });
  S({ id: "tunnels", act: 2, title: "The Western Wall tunnels", kick: "Beneath the city", music: "m15", amb: "chamber", page: 7,
    views: [
      { id: "entry", img: "tunnel-1", cap: "Into the tunnel: Herod’s Wall on the left, a narrow passage running north under the Muslim Quarter", hank: "Four hundred and eighty metres of Herod’s wall, buried under the streets. Keep your hand on the stones. The Watchman said: follow them down.",
        go: { fwd: "master" } },
      { id: "master", img: "tunnel-2", cap: "The Master Course: a row of giant stones along the Wall, each longer than a bus", go: { back: "entry", fwd: "warren", left: "great" }, puzzle: "measure",
        hots: [{ box: [30, 30, 60, 50], label: "The giant stones", text: "This row of stones, the Great Course, is the tallest and longest in the whole Wall. Its neighbours are 12 and 8 metres long. Ahead, a tour group stands where the Wall turns toward the place they call opposite the Holy of Holies." }] },
      { id: "great", img: "tunnel-great", cap: "The Western Stone close up: one block, its face pocked with holes, prayer notes pushed into them", go: { right: "master" },
        hots: [{ box: [10, 20, 80, 45], label: "The Western Stone", text: "One single stone: 13.6 metres long and 3.3 metres high. It was long reckoned at 570 tons; a radar survey in 2006 found it is less deep than thought, so nearer 250 to 300 tons. Either way, one of the largest building blocks ever set by human hands, and laid without mortar." },
          { box: [0, 65, 100, 30], label: "How did they move it?", text: "The stones were cut from the hills north of the city, where quarries of Herod’s day have been found at Ramat Shlomo: workers cut grooves round a block with picks and split it free with wedges. The quarries were higher than the Temple Mount, so the stones went downhill on rollers, hauled by oxen and men, then levered and craned into place. The final smoothing of the margins was done only once each stone was set. No one knows exactly how this one was lifted into its course." }] },
      { id: "warren", img: "tunnel-warren", cap: "A glass sign on the rock: “Entrance gate to the Temple Mount”, Warren’s Gate", go: { back: "master", fwd: "prayer" },
        hots: [{ box: [5, 25, 90, 50], label: "Read the sign", act: "warrenGate" }] },
      { id: "prayer", img: "tunnel-prayer", cap: "Under a low arch, a woman prays with her face to the stones, facing east", go: { back: "warren", right: "sign", fwd: "stairs" },
        hots: [{ box: [40, 30, 50, 40], label: "The woman at prayer", text: "She stands as close as anyone can come to where tradition places the Holy of Holies, just beyond this wall, under the Dome of the Rock. People come here to pray for hours. Leave her in peace." }] },
      { id: "sign", img: "tunnel-plaque", cap: "A lit glass plaque on the rock: “The site opposite the Holy of Holies”", go: { left: "prayer" }, puzzle: "firstanswer" },
      { id: "stairs", img: "tunnel-stairs", cap: "Further on, a metal stair climbs toward the far end of the tunnel and the light", go: { back: "prayer" } },
    ] });
  S({ id: "wallagain", act: 2, title: "Back on the wall", kick: "The sky is clear", music: "m12", amb: "olives",
    views: [
      { id: "clear", img: null, cap: "The same stretch of wall near Damascus Gate: sun on wet stone, the way ahead open", hank: "The storm has passed. The way that was closed is open. Down to Damascus Gate.",
        go: { fwd: "damascus" } },
      { id: "damascus", img: "wallagain-damascus", cap: "Damascus Gate: the grandest gate of the Old City, crowds going in and out under its battlements", go: { back: "clear", fwd: "road" },
        hots: [{ box: [20, 20, 60, 60], label: "The gate", text: "Suleiman’s grandest gate, 1537, built over Hadrian’s Roman gate, whose arch is still below. The road north to Damascus began here." }] },
      { id: "road", img: "wallagain-road", cap: "Up the Nablus Road: a tiled sign on an old stone wall, “The Garden Tomb”", go: { back: "damascus" } },
    ] });
  S({ id: "gtomb", act: 2, title: "The Garden Tomb", kick: "A garden, and a tomb", music: "m16", amb: "olives", page: 8,
    views: [
      { id: "garden", img: "gtomb-garden", cap: "The garden: a courtyard below a rock face, and in the rock a small doorway. After the storm, everything drips and shines", hank: "Many believe this is the garden, and that the tomb. Whether or not it is, what is true is true: he is not here.",
        go: { fwd: "tomb", left: "skullsign", right: "john40" } },
      { id: "skullsign", img: "gtomb-skullsign", cap: "A tiled sign on a post: “Skull Hill”, and an arrow", go: { right: "garden", fwd: "skull" } },
      { id: "skull", img: "gtomb-skull", cap: "From the viewing platform: the cliff called Skull Hill, its two hollow eyes in the rock", go: { back: "skullsign", left: "john16" },
        hots: [{ box: [25, 30, 40, 20], label: "The skull face", text: "General Charles Gordon saw a skull in this cliff in 1883 and called it the place of the skull (Matthew 27:33). In photos from the early 1900s the face is plain: two eyes and the bridge of a nose. Weather has worn it since, and a storm in February 2015 brought the bridge of the nose down. The eyes are still there." }] },
      { id: "john16", img: "gtomb-john19a", cap: "A stone plaque facing the hill: John 19:16–18", go: { right: "skull" },
        hots: [{ box: [5, 10, 90, 35], label: "Read the plaque", text: "“And he bearing his cross went forth into a place called the place of a skull, which is called in the Hebrew Golgotha: where they crucified him, and two other with him, on either side one, and Jesus in the midst” (John 19:17–18)." }] },
      { id: "john40", img: "gtomb-john19b", cap: "A stone plaque in the garden: John 19:40–42", go: { left: "garden" },
        hots: [{ box: [3, 10, 92, 30], label: "Read the plaque", text: "“Now in the place where he was crucified there was a garden; and in the garden a new sepulchre, wherein was never man yet laid. There laid they Jesus therefore because of the Jews’ preparation day; for the sepulchre was nigh at hand” (John 19:41–42)." }] },
      { id: "tomb", img: "gtomb-2", cap: "The tomb, cut into the rock, with the groove for a rolling stone across its front", go: { back: "garden", fwd: "door" }, puzzle: "stone",
        hots: [{ box: [62, 38, 12, 10], label: "The window above", text: "A small window cut high in the rock beside the door. Some think it was made so the first light of morning could fall into the tomb." }] },
      { id: "door", img: "gtomb-1", cap: "At the doorway: the trough in front, where the stone rolled", go: { back: "tomb", fwd: "inside" } },
      { id: "inside", img: "gtomb-inside", cap: "Inside, to the right: a burial place cut in the rock, a raised ledge at one end for the head", go: { back: "door", left: "cross" },
        hots: [{ box: [10, 30, 70, 40], label: "The burial place", text: "“And he… laid him in a sepulchre which was hewn out of a rock” (Mark 15:46). The women came early on the first day of the week, and found the stone rolled away. “He is not here: for he is risen, as he said. Come, see the place where the Lord lay” (Matthew 28:6)." }] },
      { id: "cross", img: "gtomb-cross", cap: "On the wall above: a cross painted in dark red, with Greek letters", go: { right: "inside" },
        hots: [{ box: [40, 10, 25, 25], label: "The cross", text: "IC XC: the first and last letters of “Jesus Christ” in Greek. Below them Alpha and Omega: “I am Alpha and Omega, the beginning and the ending, saith the Lord” (Revelation 1:8). Painted by early Christians who came here." }] },
    ] });
  S({ id: "bazaar", act: 2, title: "The bazaar street", kick: "Damascus Gate to the Western Wall", music: "m10", amb: "street",
    views: [
      { id: "steps", img: null, cap: "Inside Damascus Gate: the street drops in wide steps into the bazaar", hank: "From Damascus Gate one street runs straight down the old valley, along the western side of the Mount, to the Wall. The Street of the Valley: HaGai, El Wad. It has been a market since the Romans.",
        go: { fwd: "stalls" } },
      { id: "stalls", img: null, cap: "The bazaar: spices, sweets, scarves, lamps, the smell of coffee and cardamom", go: { back: "steps", fwd: "trader" },
        hots: [{ box: [0, 0, 50, 60], label: "The lamps", text: "Brass lamps, glass lamps, clay lamps like yours. “Thy word is a lamp unto my feet.”" }] },
      { id: "trader", img: null, cap: "A trader’s stall: olive-wood carvings, and a dish of old coins and weights", go: { back: "stalls", fwd: "end" }, puzzle: "halfshekel" },
      { id: "end", img: null, cap: "The end of the street: the checkpoint, and the Western Wall plaza beyond. From here, the bus south to Hebron", go: { back: "trader" } },
    ] });

  /* ---- Act 3 ---- */
  S({ id: "hebron", act: 3, title: "Hebron", kick: "The Cave of the Patriarchs", music: "m17", amb: "indoor",
    views: [
      { id: "bus", img: "hebron-building", cap: "Hebron: Herod’s great wall around the Cave of Machpelah, with its two minarets", hank: "Before Zion, Hebron. David was king here seven years before he ever took Jerusalem. And here Abraham bought the first piece of the land, with silver, weighed out in front of everyone.",
        go: { fwd: "pit", left: "sign" }, note: () => K.card('<div class="kick">On the bus south</div><h2>The only tourists</h2><p>The armoured bus to Hebron is full of young paratroopers going back to their posts. You and one other passenger are the only visitors aboard. The window beside your seat has a bullet hole in it, starred and old.</p><p>The soldiers joke, sleep, and look out of the windows. Nobody seems worried, and after a while neither are you.</p><button class="cta" data-act="x">Off the bus</button>', { x: () => {} }),
        hots: [{ box: [20, 30, 65, 45], label: "Herod’s wall", text: "Herod built this enclosure over the cave about 2,000 years ago, with the same drafted-margin stones as the Temple Mount walls. It is the only building of his still standing whole: what the Temple Mount walls looked like, all the way up." }] },
      { id: "sign", img: "hebron-sign", cap: "A welcome sign: “To the first Hebrew city, Hebron, site of the Tomb of the Forefathers and Mothers”", go: { right: "bus" },
        hots: [{ box: [5, 40, 90, 50], label: "Read the sign", text: "The sign tells how Abraham bought the field and the Cave of Machpelah from the Hittites, and that Abraham and Sarah, Isaac and Rebekah, Jacob and Leah are buried here. For centuries Jews were allowed no further than the seventh step of the outside stair; since 1967 the building has been open to visitors of every faith, at set times." }] },
      { id: "pit", img: "hebron-pit", cap: "Beside the great wall: a deep opening in the bedrock, fenced off", go: { back: "bus", fwd: "hall" },
        hots: [{ box: [25, 50, 50, 35], label: "The opening", text: "An old Jewish tradition says there are four couples in the caves below, not three: Adam and Eve as well. So the place is called Kiryat Arba, the city of the four (Genesis 23:2). The Midrash says Abraham chose this cave because he found Adam there; the Zohar calls it the passage to the Garden of Eden. A tradition, not Scripture, but an old one." }] },
      { id: "hall", img: "hebron-hall", cap: "Inside, in the Jewish section: a long vaulted hall, lamps hanging, bookcases between the pillars", go: { back: "pit", fwd: "abraham", right: "jacob", left: "arnon" } },
      { id: "abraham", img: "hebron-abraham", cap: "Behind the bars: the tomb monument of the Patriarch Abraham", go: { back: "hall" }, puzzle: "bought",
        hots: [{ box: [8, 15, 64, 22], label: "The plaque", text: "“Tomb Monument of the Patriarch Abraham.” The monuments are cenotaphs, memorial markers. The real graves are in the caves deep below the floor." }] },
      { id: "jacob", img: "hebron-jacob", cap: "Through the green bars: the tomb monument of the Patriarch Jacob, prayer notes on the floor", go: { left: "hall" },
        hots: [{ box: [20, 10, 55, 22], label: "Jacob", text: "“Bury me with my fathers in the cave that is in the field of Ephron the Hittite” (Genesis 49:29). Jacob, who was called Israel, made his sons promise to carry him here from Egypt." }] },
      { id: "arnon", img: "hebron-arnon", cap: "A sign on the wall: “Entering the Cave of the Machpela”", go: { right: "hall" },
        hots: [{ box: [3, 20, 94, 60], label: "Read the sign", text: "In 1968 Moshe Dayan had a 12-year-old girl, Michal, lowered through a hole 26 centimetres wide into a round room below: a corridor, and stairs, and a stone she could not move. In 1981 a group of men lifted the prayer rugs, found the stone, and went down: a corridor, the round room, and then a breeze from between the stones, and a cave of rock, with pottery from the days of Solomon and the kings of Judah. No one had stood so near the Patriarchs in thousands of years." }] },
    ] });
  S({ id: "zion", act: 3, title: "Mount Zion", kick: "David’s Tomb and the Upper Room", music: "m17", amb: "indoor", page: 9,
    views: [
      { id: "door", img: "zion-door", cap: "On Mount Zion: an arch carved in Hebrew, “Kever David”, and the bronze plaque: King David’s Tomb", go: { fwd: "tomb", right: "caiaphas" } },
      { id: "caiaphas", img: "caiaphas-above", cap: "Down the east slope of Zion, at the House of Caiaphas: a pit cut in the rock, seen from above through glass", go: { left: "door", fwd: "mosaic" },
        hank: "The church of Saint Peter in Gallicantu: the cock-crow. Tradition places the house of Caiaphas the high priest here, where Jesus was brought on the night he was betrayed, and where Peter denied him three times.",
        hots: [{ box: [50, 20, 30, 18], label: "The three crosses", text: "Three Byzantine crosses, engraved round the opening in the roof of the pit: Christians of the fifth century marked this place." }] },
      { id: "mosaic", img: "caiaphas-mosaic", cap: "A mosaic on the rail above the pit: “On m’a mis en fosse profonde”", go: { back: "caiaphas", fwd: "pitsign" },
        hots: [{ box: [20, 25, 60, 50], label: "The mosaic", text: "Jesus, bound, let down into the pit. Here, as the sign beside it records, Christians since the fifth century have remembered that Jesus was lowered into this pit on a rope and held overnight before his crucifixion, after his arrest in Gethsemane and his trial before Caiaphas (Matthew 26:57). The French words beneath are Psalm 88:6: “Thou hast laid me in the lowest pit, in darkness, in the deeps.”" }] },
      { id: "pitsign", img: "caiaphas-sign", cap: "The sign: “Sacred pit (dungeon)”", go: { back: "mosaic", fwd: "pit" },
        hots: [{ box: [0, 25, 90, 35], label: "Read the sign", text: "Excavations in 1889 found three Byzantine crosses engraved round the opening at the top, red and black crosses on the walls, and the outline of a praying figure. The Byzantines remembered here Jesus’ imprisonment overnight as he awaited trial before Caiaphas and the Sanhedrin (Matthew 26:57)." }] },
      { id: "pit", img: "caiaphas-pit", cap: "Down in the pit: bare rock walls, and a single stand with a book of the Psalms open on it", go: { back: "pitsign", fwd: "up" },
        hots: [{ box: [60, 30, 25, 12], label: "The open book", text: "Psalm 88, left open for whoever comes down: “I am shut up, and I cannot come forth” (Psalm 88:8)." }] },
      { id: "up", img: "caiaphas-up", cap: "Looking up: the round hole in the rock, and the light far above", go: { back: "pit" },
        hots: [{ box: [20, 12, 40, 20], label: "The opening", text: "The only way in or out was a rope through that hole. “And Peter went out, and wept bitterly” (Luke 22:62): somewhere above, the cock crowed." }] },
      { id: "tomb", img: "zion-tomb", cap: "David’s Tomb: men reading psalms before the great cenotaph under its blue and gold cover", hank: "By tradition, David lies here. In truth his tomb was in the City of David, below. But the people who come here are not wrong to remember him: he bought the threshing floor.",
        go: { fwd: "gatesign", back: "door", left: "sign" }, puzzle: "north" },
      { id: "sign", img: "zion-sign", cap: "The sign: “King David’s Tomb”", go: { right: "tomb" },
        hots: [{ box: [3, 35, 35, 20], label: "Read the sign", text: "“The place where King David was buried according to a Medieval tradition.” The Bible says David “was buried in the city of David” (1 Kings 2:10): the ridge below, which you will walk next. The real tomb has never been found." }] },
      { id: "gatesign", img: "zion-gatesign", cap: "A sign by Zion Gate: 1, King David’s Tomb; 2, the Room of the Last Supper; 3, the Dormition Abbey", go: { back: "tomb", fwd: "courtyard" } },
      { id: "courtyard", img: "zion-courtyard", cap: "From the roof: the courtyard of the old building on Mount Zion, David’s Tomb below and the Upper Room above it", go: { back: "gatesign", fwd: "passage" },
        hots: [{ box: [40, 55, 25, 25], label: "The courtyard", text: "One building holds both: David’s Tomb on the ground floor, the Upper Room on the floor above. Crusader stonework over older walls, a minaret added when it was a mosque, and now a place for everyone." }] },
      { id: "passage", img: "zion-passage", cap: "Through a stone arch, an old door open, a vaulted passage lit gold", go: { back: "courtyard", fwd: "upper" } },
      { id: "upper", img: "zion-upper", cap: "The Upper Room, the Cenacle: Gothic vaults and pillars, and the room full of pilgrims", go: { back: "passage" },
        hots: [{ box: [10, 10, 80, 70], label: "The room", text: "“And he will shew you a large upper room furnished: there make ready” (Luke 22:12). The room you see is Crusader work, built over older walls." }] },
    ] });
  S({ id: "cod", act: 3, title: "The City of David", kick: "Where Jerusalem began", music: "m17", amb: "street",
    views: [
      { id: "entrance", img: "cod-entrance", cap: "In the City of David: a sign pointing on, “To the Water Systems: Warren’s Shaft & Hezekiah’s Tunnel”", hank: "This narrow ridge, outside today’s walls, is the Jerusalem David took. The Temple Mount is the hill just north of it. Look for the sign about the Ark.",
        go: { fwd: "view", right: "sign" } },
      { id: "sign", img: "cod-ark-sign", cap: "A sign in the water system: “Raiders of the Lost Ark”, the Parker expedition, 1909–1911", go: { left: "entrance" }, puzzle: "arksign" },
      { id: "view", img: "cod-ruins", cap: "Over the excavations: the stone houses of David’s city, the great stepped wall, and the tower on top", go: { back: "entrance", fwd: "descent", left: "tower" }, puzzle: "zionq",
        hots: [{ box: [45, 25, 55, 55], label: "The stepped stone wall", text: "A huge stepped stone structure holds up the top of the ridge. Many archaeologists think it carried the fortress of Zion that David took, and the palace he built on it: “David dwelt in the fort, and called it the city of David” (2 Samuel 5:9)." }] },
      { id: "tower", img: "cod-tower", cap: "The Hasmonean tower at the top of the slope", go: { right: "view", fwd: "towersign" } },
      { id: "towersign", img: "cod-tower-sign", cap: "The sign at the tower: Nehemiah’s call to rebuild the wall", go: { back: "tower" },
        hots: [{ box: [10, 15, 80, 30], label: "Nehemiah 2:17", text: "“Ye see the distress that we are in, how Jerusalem lieth waste, and the gates thereof are burned with fire: come, and let us build up the wall of Jerusalem” (Nehemiah 2:17, KJV). The sign says the tower stood on the First Wall, which the Romans destroyed in AD 70, and may stand on Nehemiah’s wall. Nehemiah’s decree will matter in Episode 2." }] },
      { id: "descent", img: "cod-entrysign", cap: "A sign on the rock: “Entrance to the water system: Warren’s Shaft, the Gihon Spring, Hezekiah’s Tunnel”", go: { back: "view", fwd: "stairs" } },
      { id: "stairs", img: "cod-descent", cap: "Stairs down into the rock: the way to the ancient water system", go: { back: "descent", fwd: "passage" } },
      { id: "passage", img: "cod-passage", cap: "A rock-cut tunnel sloping down, a rail on the left, an old clay jar in a lit niche", go: { back: "stairs", fwd: "shaftsign", right: "watersign" } },
      { id: "watersign", img: "cod-watersign", cap: "A long sign on the wall: “Warren’s Shaft Water System”", go: { left: "passage" },
        hots: [{ box: [5, 10, 90, 30], label: "Read the top", text: "Named after Captain Charles Warren, who found it in 1867. The Gihon Spring, Jerusalem’s only water, lay in the valley outside the wall, so the people cut a tunnel through the bedrock to reach it in safety, in war and in peace. Water was drawn up with a rope and a bucket." },
          { box: [5, 60, 90, 35], label: "Read the bottom", text: "This shaft system was cut with bronze tools about 1800 BC. About a thousand years later, in the eighth century BC, Hezekiah replaced it with the Siloam tunnel, hewn with iron tools. Ceramic oil lamps were found inside: the diggers worked by lamplight." }] },
      { id: "shaftsign", img: "cod-shaft-sign", cap: "The sign: “The water system, Warren’s Shaft”", go: { back: "descent", fwd: "shaft" },
        hots: [{ box: [10, 10, 80, 30], label: "Charles Warren again", text: "Captain Charles Warren found this shaft in 1867: the same Warren whose name is on the blocked gate you passed in the Western Wall tunnels. He spent years under Jerusalem, tunnelling along the Temple Mount and down here to the spring." }] },
      { id: "shaft", img: "cod-shaft", cap: "Warren’s Shaft: a natural chasm in the rock, lit blue, dropping toward the spring", go: { back: "shaftsign" },
        hots: [{ box: [20, 20, 30, 20], label: "The dark opening", text: "From here the city’s people drew water from the spring below, with a rope and a vessel, without going outside the walls. Some think this is the “gutter” Joab climbed to take the city for David (2 Samuel 5:8). The way on leads down to the Gihon Spring." }] },
    ] });
  S({ id: "gihon", act: 3, title: "The Gihon Spring", kick: "The water of the city", music: "m17", amb: "chamber",
    views: [
      { id: "spring", img: "gihon-pool", cap: "Deep in the rock by the Gihon Spring: the Canaanite pool, lit blue, a dark doorway leading on", hank: "Gihon. Here Zadok the priest anointed Solomon king, the day Adonijah tried to take the throne. The king who built the Temple was made king at this water.",
        go: { fwd: "mouth", left: "gsign", right: "canaanite", back: "psign" }, puzzle: "lampstone" },
      { id: "psign", img: "gihon-pool-sign", cap: "The sign: “The Canaanite Pool”", go: { fwd: "spring" },
        hots: [{ box: [8, 25, 84, 60], label: "Read the sign", text: "Carved into the rock 3,800 years ago and fed by the Gihon Spring: Jerusalem’s water in time of siege. Some think Solomon was crowned king at this very spot (1 Kings 1:32–40). Late in the First Temple period it was filled with earth and houses were built on it; hundreds of clay seal impressions and thousands of fish bones were found in the fill." }] },
      { id: "gsign", img: "gihon-sign", cap: "The sign: “The Gihon Spring, Jerusalem’s beating heart”", go: { right: "spring" },
        hots: [{ box: [10, 20, 80, 30], label: "1 Kings 1:38–39", text: "“So Zadok the priest… caused Solomon to ride upon king David’s mule, and brought him to Gihon. And Zadok the priest took an horn of oil out of the tabernacle, and anointed Solomon” (1 Kings 1:38–39). The sign adds that the spring once pulsed, rising and falling, and that Hezekiah later sent its water through a tunnel to the Pool of Siloam (2 Chronicles 32:30)." }] },
      { id: "canaanite", img: "gihon-canaanite", cap: "The Canaanite channel: a dry, narrow cut in the rock, the older way the water ran, 1,000 years before Hezekiah", go: { left: "spring" },
        hots: [{ box: [25, 30, 50, 50], label: "The dry way", text: "Before Hezekiah’s tunnel, the Canaanites cut this channel along the slope to carry the spring water to their fields and a pool in the south. It is dry now. Visitors who do not want to wade through Hezekiah’s tunnel walk this way to the Pool of Siloam." }] },
      { id: "mouth", img: "gihon-mouth", cap: "The spring at the mouth of Hezekiah’s Tunnel: water running out of the rock, lit gold", go: { back: "spring" }, hank: "Hezekiah cut a tunnel from this spring through the hill to the pool inside his walls, before the Assyrians came. Five hundred and thirty-three metres, in the dark, in water. Light your lamp." },
    ] });
  S({ id: "hezekiah", act: 3, title: "Hezekiah’s Tunnel", kick: "533 metres in the dark", music: "m18", amb: "chamber",
    views: [
      { id: "tunnel", img: "hezekiah-tunnel", cap: "In the tunnel: a narrow cut in the rock, black ahead, the lamp the only light", puzzle: "darktunnel", go: { fwd: "water" } },
      { id: "water", img: "hezekiah-water", cap: "Look down: cold, clear water over the rock floor, ankle deep and running toward Siloam", go: { back: "tunnel" },
        hots: [{ box: [20, 20, 60, 50], label: "The water", text: "The same water Hezekiah sent through the hill 2,700 years ago still runs here, from the Gihon Spring to the Pool of Siloam. You come out soaked to the knee, like every visitor before you." }] },
    ] });
  S({ id: "siloam", act: 3, title: "The Pool of Siloam", kick: "Sent", music: "m17", amb: "olives", page: 10,
    views: [
      { id: "pool", img: "siloam-pool", cap: "The Pool of Siloam: the wide stone steps uncovered in 2004, running down to the pool floor", hank: "Out of the dark, into the light, at the pool. A blind man washed here and came back seeing. Sent, the name means.",
        go: { fwd: "road", left: "sign", right: "water" }, puzzle: "siloamq" },
      { id: "sign", img: "siloam-sign", cap: "The sign: “The Pool of Shiloah (Siloam), Second Temple splendour”", go: { right: "pool" },
        hots: [{ box: [5, 40, 90, 35], label: "Read the sign", text: "“…how he made the pool and the conduit and brought the water into the city” (2 Kings 20:20). In 2004 a very large pool from the Second Temple period was found here, about three quarters of an acre. Beside it, a stepped street: the road the pilgrims climbed from the pool to the Temple Mount. Under its paving, a drainage channel where the last rebels hid from the Romans in AD 70." }] },
      { id: "water", img: "siloam-water", cap: "Where Hezekiah’s Tunnel comes out: still water, three old column drums, the light again", go: { left: "pool" },
        hots: [{ box: [25, 30, 50, 25], label: "The column drums", text: "Stumps of columns from a Byzantine church built here, about AD 450, to remember the man born blind who washed and came back seeing (John 9:7)." }] },
      { id: "road", img: "siloam-road", cap: "The Pilgrim Road, dug out under the hill: the ancient stepped street climbing from the pool toward the Temple Mount, new steps beside it", go: { back: "pool" },
        hots: [{ box: [20, 0, 60, 60], label: "Up the road", text: "Pilgrims washed in the pool and climbed this street to the Temple. Far ahead, going up fast, a grey coat." }] },
    ] });
  S({ id: "steps", act: 3, title: "The Southern Steps", kick: "The Songs of Ascents", music: "m19", amb: "olives", doneBy: "robinson",
    views: [
      { id: "steps", img: "steps-steps", cap: "The Southern Steps: the broad stair along the south wall, the Mount of Olives beyond", hank: "The pilgrims’ stair. The steps are wide and narrow by turns, so no one could run up to the house of God. Fifteen songs for fifteen steps: the Songs of Ascents.",
        go: { fwd: "robinson" }, puzzle: "ascents" },
      { id: "robinson", img: "robinson-wide", cap: "Round the corner: the south-west corner of the Temple Mount, the fallen stones on the Herodian street, and the wooden Mughrabi ramp high above", go: { back: "steps", fwd: "wall", left: "above" }, hank: "Round the south-west corner, the stones the Romans threw down still lie where they fell.",
        hots: [{ box: [38, 26, 25, 12], label: "The wooden ramp above", text: "High above, the covered wooden Mughrabi bridge: the only way up onto the Mount for a Jew or a Christian today. You will climb it at the end." }] },
      { id: "above", img: "robinson-above", cap: "Looking down from the walkway: the stones piled where they landed against the Wall", go: { right: "robinson" } },
      { id: "wall", img: "robinson-wall", cap: "Along the Western Wall to the corner: the stump of Robinson’s Arch, and the heap of stones beneath it", go: { back: "robinson", fwd: "springer" } },
      { id: "springer", img: "robinson-springer", cap: "Robinson’s Arch: the first stones of a great arch, still jutting from the Wall", go: { back: "wall", fwd: "stones", right: "pier" },
        hots: [{ box: [10, 22, 70, 12], label: "The arch stones", text: "The arch carried a monumental stairway from the street up to the Royal Stoa on the Temple Mount. Edward Robinson noticed the curved stones in 1838. The rest of the arch lies in the street below." }] },
      { id: "pier", img: "robinson-pier", cap: "A sign by the pier: “A pier of large stones which originally supported the western springer of Robinson’s Arch”", go: { left: "springer" },
        hots: [{ box: [5, 25, 90, 20], label: "Read the sign", text: "The pier held up the far end of the arch, and inside it were four small shops opening onto the paved street. Pilgrims on their way up to the Temple bought here, under the stair." }] },
      { id: "stones", img: "robinson-fallen", cap: "On the street: the stones from the top of the Wall, lying where they fell", go: { back: "springer", right: "stonesign" }, puzzle: "robinson" },
      { id: "stonesign", img: "robinson-sign", cap: "A sign among the stones", go: { left: "stones" },
        hots: [{ box: [10, 35, 80, 25], label: "Read the sign", text: "“Collapsed on the paved street are stones of the western wall of the Temple Mount enclosure. They were hurled down by the soldiers of the Roman Legion after the destruction of the Temple on the ninth day of the month of Av, 70 CE.”" }] },
    ] });

  /* ---- Act 4 ---- */
  S({ id: "institute", act: 4, title: "The Temple Institute", kick: "Everything is ready", music: "hall", amb: "indoor", kept: "institute", page: 11,
    views: [{ id: "in", img: null, cap: "" }] });
  S({ id: "dung", act: 4, title: "The Dung Gate", kick: "Moses", music: "m20", amb: "street",
    views: [
      { id: "exit", img: "dung-exit", cap: "Out of the Western Wall plaza: the exit, the taxis, and the road to the Dung Gate", go: { fwd: "inner" } },
      { id: "inner", img: "dung-inner", cap: "The Dung Gate from inside the city: through the arch, the Kidron slopes and the village beyond", go: { back: "exit", fwd: "gate" } },
      { id: "gate", img: "dung-gate", cap: "The Dung Gate, the small gate in the south wall nearest the Western Wall", hank: "Nehemiah rode out by night past the dung port and viewed the walls. You are going out by it in daylight, to the valley of the tombs.",
        go: { fwd: "road", back: "inner" } },
      { id: "road", img: "dung-road", cap: "Outside the gate: the dirt path down toward the Kidron Valley, and the town of Silwan on the slope beyond", go: { back: "gate" }, puzzle: "moses",
        hots: [{ box: [0, 25, 100, 22], label: "The town of Silwan", text: "Silwan: the town that climbs the slope across the valley from the City of David. Its name comes from Siloam, the pool below. Its cliffs are full of tombs cut in the days of the kings of Judah." }] },
    ] });
  S({ id: "egate", act: 4, title: "The Eastern Gate, outside", kick: "The steps and the cemetery", music: "m21", amb: "olives",
    views: [
      { id: "steps", img: "egate-steps", cap: "The steps Moses pointed to: white stone stairs climbing between the graves, under the battlements of the eastern wall", hank: "Up the steps, as the man said. The wall on your left is the eastern wall of the Temple Mount. Somewhere ahead, in it, is the gate.", go: { fwd: "path" } },
      { id: "path", img: "egate-path", cap: "The paved path along the foot of the eastern wall, graves stepping up the slope on the left", go: { back: "steps", fwd: "gate", right: "olives" },
        hots: [{ box: [0, 35, 60, 30], label: "The graves", text: "Graves have been laid against this wall for centuries. Some say they were put here to keep the Messiah out: a priest may not walk through the dead. He will not be kept out." }] },
      { id: "olives", img: "egate-olives", cap: "Looking across the valley: the Jewish cemetery covering the Mount of Olives, the tour buses on the road below", go: { left: "path", fwd: "gethsemane" },
        hots: [{ box: [20, 25, 70, 25], label: "The cemetery", text: "The oldest Jewish cemetery in the world, used for three thousand years. People asked to be buried here to be first to rise when the Messiah comes to this mountain (Zechariah 14:4)." }] },
      { id: "gethsemane", img: "egate-gethsemane", cap: "Straight across the Kidron: the Church of All Nations and the garden of Gethsemane, and the gold onion domes of the Russian church above", go: { back: "olives" },
        hots: [{ box: [8, 55, 40, 15], label: "The church among the olives", text: "Gethsemane, straight below you across the valley. You will go down to it soon. From the gate to the garden is one straight line, and from the garden back to the gate." },
          { box: [70, 38, 20, 14], label: "The gold domes", text: "The Church of Mary Magdalene, built by the Russian Tsar in 1888. Moses pointed you this way: up past the Russian church." }] },
      { id: "gate", img: "egate-gate", cap: "The Eastern Gate from outside, above the olive terraces and the graves: two sealed arches, walled with stone since 1541", go: { back: "path", fwd: "close" } },
      { id: "close", img: "egate-close", cap: "Right under the gate: two blocked arches, stone filled with stone, the graves against its foot", go: { back: "gate" }, puzzle: "police",
        hots: [{ box: [15, 40, 70, 25], label: "The sealed arches", text: "Two arches, walled solid. Suleiman sealed the gate in 1541. Jewish tradition says the Messiah will enter by it; Muslim tradition says the same of the judgement. Ezekiel saw it shut (Ezekiel 44:2)." }] },
    ] });
  S({ id: "kidron", act: 4, title: "The Kidron Valley", kick: "Absalom and Zechariah", music: "m22", amb: "olives",
    views: [
      { id: "wide", img: "kidron-wide", cap: "Down in the valley: tombs cut from the cliff, and the Mount of Olives cemetery climbing behind", hank: "Down in the valley, the tombs. The names on them are older than the stones.",
        go: { fwd: "zechariah", right: "absalom" },
        hots: [{ box: [14, 40, 22, 18], label: "The porch with two columns", text: "The tomb of the sons of Hezir: a priestly family, named in its Hebrew inscription. Hezir was the head of the seventeenth course of priests in David’s day (1 Chronicles 24:15). Priests of the Temple were buried here, facing it." },
          { box: [62, 38, 22, 30], label: "The pyramid", text: "The monument called Zechariah’s Tomb. Walk over to it." }] },
      { id: "absalom", img: "kidron-absalom", cap: "Absalom’s Pillar: square below, a round drum and a tall spire on top", go: { left: "wide" }, puzzle: "whose" },
      { id: "zechariah", img: "kidron-zechariah", cap: "Zechariah’s Tomb: a solid block cut from the cliff, Greek columns, a pyramid on top, and no door", go: { back: "wide", right: "zsign" },
        hots: [{ box: [20, 20, 60, 60], label: "The monument", text: "“Whom ye slew between the temple and the altar” (Matthew 23:35; 2 Chronicles 24:21). Tradition gave this monument Zechariah’s name; it faces the Temple Mount across the valley." }] },
      { id: "zsign", img: "kidron-sign", cap: "The sign: “Zechariah’s Tomb”", go: { left: "zechariah" },
        hots: [{ box: [8, 60, 84, 30], label: "Read the sign", text: "Hewn entirely from the rock and never used for burial, because it has no room inside: it is a nefesh, a monument to the name of the dead. First century BC, with Greek columns and capitals. The name of Zechariah was given to it late in its history; it was probably the monument of a Judean noble of the Second Temple period. Its face bears inscriptions carved by Jewish pilgrims." }] },
    ] });
  S({ id: "prophets", act: 4, title: "The Tombs of the Prophets", kick: "A side path", music: "puzzle", amb: "chamber", kept: "prophets", optional: true,
    views: [{ id: "in", img: null, cap: "" }] });
  S({ id: "olives", act: 4, title: "The Mount of Olives", kick: "Where His feet shall stand", music: "olives", amb: "olives", kept: "olives",
    views: [{ id: "in", img: "olives-top", cap: "" }] });
  S({ id: "gethsemane", act: 4, title: "The Garden of Gethsemane", kick: "The olive press", music: "m23", amb: "olives", page: 12,
    views: [
      { id: "entrance", img: "gethsemane-sign", cap: "At the gate: “Hortus Gethsemani”, the Garden of Gethsemane, under the Jerusalem cross", go: { fwd: "trees" },
        hots: [{ box: [5, 45, 70, 25], label: "The inscription", text: "Latin for the Garden of Gethsemane. The Franciscans have kept this garden since 1681. The small plaque below reads: Holy Place, here Jesus began his Passion." }] },
      { id: "trees", img: "gethsemane-trees", cap: "Inside: gravel paths, flower beds, and the great old olive trunks", hank: "Gethsemane means the olive press. Some of these trees are among the oldest living things in the land. Sit a while. The last page is here somewhere.",
        go: { fwd: "ancient", right: "oldtree", left: "wide", back: "gate" } },
      { id: "ancient", img: "gethsemane-ancient", cap: "One of the oldest trees, split into two great trunks, the domes of the Church of All Nations behind", go: { back: "trees", fwd: "church", left: "path" } },
      { id: "path", img: "gethsemane-path", cap: "A gravel path between the olive trees, their old trunks twisted like rope", go: { right: "ancient" } },
      { id: "gate", img: "gethsemane-gate", cap: "Turn round: straight across the Kidron, the sealed Eastern Gate in the wall, the Temple Mount behind it", go: { fwd: "trees" },
        hots: [{ box: [38, 32, 30, 15], label: "The Eastern Gate", text: "From this garden the gate is straight across the valley, with the Temple Mount just behind the wall. Jesus came here often (Luke 22:39; John 18:2), and from here he could look across at the Temple. Whether that is why he chose this place the Bible does not say; but he prayed facing the house he had called “my Father’s house”, and the gate he will one day come back to." }] },
      { id: "wide", img: "gethsemane-wide", cap: "Across the garden: young trees among the old, and the beds the Franciscans keep", go: { right: "trees" },
        hots: [{ box: [75, 60, 12, 12], label: "The small sign", text: "“P.P. Franciscus, 26 May 2014”: an olive tree planted by Pope Francis on his visit. Pilgrims of every church come here." }] },
      { id: "oldtree", img: "gethsemane-oldtree", cap: "The oldest tree: a vast hollow trunk inside a mesh guard, still green on top", go: { left: "trees" }, puzzle: "lastpage",
        hots: [{ box: [20, 50, 60, 40], label: "The trunk", text: "Tested trees in this garden are about 900 years old, grown perhaps from roots far older still: olive trees spring up again from the stump. “There is hope of a tree, if it be cut down, that it will sprout again” (Job 14:7)." }] },
      { id: "church", img: "church-facade", cap: "Beside the garden: the Church of All Nations, its golden mosaic high above the columns", go: { back: "ancient", fwd: "churchdoor" },
        hots: [{ box: [0, 32, 100, 20], label: "The mosaic", text: "Christ praying for the world, the nations bringing their sorrows to him. The Latin beneath is Hebrews 5:7: “who… offered up prayers and supplications with strong crying and tears.” Built 1919–1924 with gifts from twelve nations." }] },
      { id: "churchdoor", img: "church-door", cap: "The doors, open: above them, “Sustinete hic et vigilate mecum”", go: { back: "church", fwd: "nave" },
        hots: [{ box: [33, 44, 34, 6], label: "The inscription", text: "“Tarry ye here, and watch with me” (Matthew 26:38): what Jesus asked of Peter, James and John in this garden." }] },
      { id: "nave", img: "church-interior", cap: "Inside: dim purple light, columns, gold domes, and the mosaic of the agony over the altar", go: { back: "churchdoor", fwd: "rock" } },
      { id: "rock", img: "church-altar", cap: "Before the altar: the bare rock of Gethsemane, ringed by a crown of thorns in iron", go: { back: "nave" },
        hots: [{ box: [5, 52, 70, 12], label: "The rock", text: "By tradition, the rock where he prayed: “And being in an agony he prayed more earnestly: and his sweat was as it were great drops of blood falling down to the ground” (Luke 22:44). The Latin above the altar is the same verse." },
          { box: [20, 5, 60, 40], label: "The mosaic", text: "“O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt” (Matthew 26:39). An angel comes down to strengthen him (Luke 22:43)." }] },
    ] });

  /* ---- Act 5 ---- */
  S({ id: "mughrabi", act: 5, title: "The Mughrabi Gate", kick: "The only way up", music: "m24", amb: "street",
    views: [
      { id: "below", img: "mughrabi-0", cap: "From the south-west corner: the fallen stones, the Wall, and the wooden Mughrabi ramp climbing to the gate", go: { fwd: "under" },
        hots: [{ box: [0, 12, 35, 20], label: "The ramp", text: "The covered wooden ramp runs from the Western Wall plaza up to the Mughrabi Gate. It was built as a temporary bridge after the old earth ramp collapsed in 2004, and it is still there." }] },
      { id: "under", img: "mughrabi-under", cap: "Under the covered bridge: it crosses over the women’s section on steel legs", go: { back: "below", fwd: "entrance" } },
      { id: "entrance", img: "mughrabi-1", cap: "The entrance to the wooden Mughrabi bridge, from the Western Wall plaza", hank: "The only gate by which a Jew or a Christian may go up onto the Temple Mount. Security, then the bridge. Go up.",
        go: { fwd: "security", back: "under" } },
      { id: "security", img: "mughrabi-security", cap: "The checkpoint inside the bridge: police on the benches, visitors waiting their turn to go up", go: { back: "entrance", fwd: "inside" },
        hots: [{ box: [55, 30, 40, 50], label: "The police", text: "Israeli police guard the bridge and walk every group across the Mount. Jews and Christians may visit at set hours, in groups, and may not pray aloud." }] },
      { id: "inside", img: "mughrabi-2", cap: "Inside the covered bridge, climbing above the plaza", go: { back: "security", fwd: "benches" },
        hots: [{ box: [0, 0, 100, 50], label: "The plaza below", text: "Through the slats, the Western Wall plaza falls away below you. You are climbing the height of the Wall." }] },
      { id: "benches", img: "mughrabi-benches", cap: "Long benches under the wooden roof, sunlight striping the floor", go: { back: "inside", fwd: "ramp" } },
      { id: "ramp", img: "mughrabi-3", cap: "The ramp climbs on toward the gate", go: { back: "benches", fwd: "open" } },
      { id: "open", img: "mughrabi-open", cap: "Out from under the roof: the open ramp, the minaret above the Mughrabi Gate ahead", go: { back: "ramp", fwd: "near", left: "down" } },
      { id: "down", img: "mughrabi-down", cap: "Looking down from the bridge: the Western Wall plaza, the men’s section, and the arch to Wilson’s prayer hall", go: { right: "open" },
        hots: [{ box: [42, 49, 14, 11], label: "The dark arch", text: "Under that arch, at the left end of the Wall, is the prayer hall under Wilson’s Arch, where you counted the stones going down. From here you are looking at it from above." }] },
      { id: "near", img: "mughrabi-near", cap: "The last few metres: the gate in the wall, under its minaret", go: { back: "open", fwd: "top" } },
      { id: "top", img: "mughrabi-4", cap: "Through the gate: the Temple Mount. Al-Aqsa on the right. And by the arcade, waiting, a man in a grey coat", go: { back: "near" }, puzzle: "greytop" },
    ] });
  S({ id: "mount", act: 5, title: "The Temple Mount", kick: "Where was the Temple?", music: "investigation", amb: "platform", kept: "mount",
    views: [{ id: "in", img: "tm-north-walk", cap: "" }] });
  S({ id: "gate", act: 5, title: "The Eastern Gate, inside", kick: "This gate shall be shut", music: "gate", amb: "chamber", kept: "gate",
    views: [{ id: "in", img: null, cap: "" }] });

  const byId = {}; R.forEach((s, i) => { s.n = i + 1; byId[s.id] = s; });

  /* ------------------------------------------------------------ progress ------------------------------------------------------------ */
  function W() { const p = F.P(); p.w = p.w || { done: {}, pages: {}, flags: {} }; p.w.done = p.w.done || {}; p.w.pages = p.w.pages || {}; p.w.flags = p.w.flags || {}; return p.w; }
  const save = () => Lamp.save();
  const isDone = (id) => !!W().done[id] || ((byId[id].kept || byId[id].doneBy) && F.keptDone(byId[id].kept || byId[id].doneBy));
  function nextScene() { for (const s of R) if (!isDone(s.id) && !s.optional) return s; return null; }
  function canOpen(s) { const nx = nextScene(); if (!nx) return true; if (isDone(s.id)) return true; if (s.n < nx.n) return true; if (s.n === nx.n) return true; if (s.optional && s.n === nx.n + 1) return false; return false; }
  let st = { misses: 0, hints: 0 };
  const wrong = (m) => F.wrong(m);

  /* ------------------------------------------------------------ the map: the light-rail line ------------------------------------------------------------ */
  function map() {
    F.cur("walk"); F.M("theme");
    const w = W(), nx = nextScene(), pages = Object.keys(w.pages).length;
    let h = '<div class="fkick">The Final Seven Years · Episode 1</div><h1>The Jerusalem Mystery</h1>' +
      '<div class="fsub">' + (nx ? "Scene " + nx.n + " of " + R.length + " · " + ACTS[nx.act - 1].title : "Episode 1 solved") + "</div>" +
      '<div class="fwtools"><button class="fwtool" data-j="1">' + journalIcon() + " Journal · " + pages + "/12</button></div>" +
      '<div class="fline">';
    ACTS.forEach((a) => {
      h += '<div class="fact"><b>Act ' + a.n + " · " + esc(a.title) + "</b><small>" + esc(a.sub) + "</small></div>";
      R.filter((s) => s.act === a.n).forEach((s) => {
        const d = isDone(s.id), open = canOpen(s), here = nx && nx.id === s.id;
        h += '<button class="fstop' + (d ? " done" : "") + (here ? " here" : "") + (!open && !d ? " locked" : "") + (s.optional ? " opt" : "") + '" data-s="' + s.id + '"><i>' + (d ? "✓" : s.n) + "</i><span><b>" + esc(s.title) + "</b><small>" + esc(s.kick) + (s.optional ? " · optional" : "") + "</small></span></button>";
      });
    });
    h += "</div>" + (nx ? "" : '<button class="fbtn" id="fend">What comes next</button>');
    const el = F.stage(h, "temple-painting.jpg");
    el.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => {
      const s = byId[b.dataset.s]; K.sfx("click");
      if (!canOpen(s) && !isDone(s.id)) { K.say("First finish “" + nx.title + "”.", "", 2800); return; }
      go(s);
    }));
    el.querySelector("[data-j]").onclick = () => journal();
    const en = $("fend"); if (en) en.onclick = F.ending;
    if (nx) { const b = el.querySelector(".fstop.here"); b && b.scrollIntoView({ block: "center" }); }
  }
  function journalIcon() { return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3V3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 7h7M8 11h7" stroke="currentColor" stroke-width="1.6"/></svg>'; }

  /* ------------------------------------------------------------ the journal ------------------------------------------------------------ */
  function page(n, then) {
    const w = W(); if (w.pages[n]) { then && then(); return; }
    w.pages[n] = 1; save(); F.S("journal"); setTimeout(() => F.S("harp", null, 0.6), 300); K.buzz("success");
    const pg = PAGES[n];
    K.card('<div class="kick">A page of the journal · ' + n + " of 12</div><h2>Blue ink, and a small drawn lamp</h2>" +
      F.wnote("“" + esc(pg.text) + "”" + (pg.ref ? "<small>" + esc(pg.ref) + "</small>" : "")) +
      "<p>The same hand as the card in your luggage. The page goes into the journal.</p>" +
      '<button class="cta" data-act="x">Go on</button>', { x: () => then && then() });
  }
  function journal() {
    const w = W(), p = F.P();
    const got = Object.keys(w.pages).map(Number).sort((a, b) => a - b);
    K.card('<div class="kick">The Watchman’s journal</div><h2>' + got.length + " of 12 pages</h2>" +
      (got.length ? got.map((n) => F.wnote("<b>" + n + ".</b> “" + esc(PAGES[n].text) + "”" + (PAGES[n].ref ? "<small>" + esc(PAGES[n].ref) + "</small>" : ""))).join("") : "<p>Nothing yet but the question on the first page.</p>") +
      (w.flags.courses ? "<p><b>Noted:</b> " + w.flags.courses + " courses of stone below the floor under Wilson’s Arch.</p>" : "") +
      (p.ti && p.ti.courts ? "<p><b>Noted:</b> 187 cubits from the Eastern Gate to the sanctuary.</p>" : "") +
      (p.olives ? "<p><b>Noted:</b> the line from the Mount of Olives, through the Eastern Gate, onto the Mount.</p>" : "") +
      (w.flags.bought ? "<p><b>Noted:</b> the Temple stood on the threshing floor David bought from Ornan (1 Chronicles 21:25; 2 Chronicles 3:1).</p>" : "") +
      (w.flags.arksign ? "<p><b>Noted:</b> a tradition that the Ark lies in a chamber under the Mount, near Warren’s Gate.</p>" : "") +
      '<button class="cta" data-act="x">Close the journal</button>', { x: () => {} });
  }

  /* ------------------------------------------------------------ walking a scene ------------------------------------------------------------ */
  let scene = null, view = null;
  const V = (id) => scene.views.find((x) => x.id === id) || scene.views[0];
  function go(s, vid) {
    scene = s; W().at = s.id; save();
    if (s.kept) return kept(s);
    const v = s.views.find((x) => x.id === vid) || s.views[0];
    walk(v);
  }
  function kept(s) {
    switch (s.kept) {
      case "intro": return F.intro();
      case "robinson": return F.robinson();
      case "institute": return F.institute();
      case "prophets": return F.prophets();
      case "olives": return F.olives();
      case "mount": return F.chapter();
      case "gate": return F.gate();
    }
  }
  const arrow = (dir, to) => to ? '<button class="farrow ' + dir + '" data-go="' + to + '" aria-label="' + ({ fwd: "Walk forward", left: "Look left", right: "Look right", back: "Go back" })[dir] + '">' + ({ fwd: "▲", left: "◀", right: "▶", back: "▼" })[dir] + "</button>" : "";
  function placeholder(v) {
    const hue = (scene.n * 37) % 360;
    return '<div class="fph" style="--h:' + hue + '"><div class="fphk">Photo to come</div><b>' + esc(scene.title) + "</b><span>" + esc(v.cap) + "</span><small>Scene " + scene.n + " · view “" + esc(v.id) + "” · " + esc(scene.id + "-" + v.id) + "</small></div>";
  }
  function walk(v) {
    view = v; F.cur("walk"); F.M(scene.music, scene.amb);
    const w = W(), done = isDone(scene.id), pz = v.puzzle && PUZZLES[v.puzzle], pzDone = pz && w.done[scene.id + ":" + v.puzzle];
    const nx = R[scene.n] || null, prev = R[scene.n - 2] || null;
    const pic = v.img ? '<img class="fwimg" draggable="false" src="' + IMG + v.img + '.jpg" alt="' + esc(v.cap) + '">' : placeholder(v);
    const hots = (v.hots || []).map((h, i) => '<button class="fhit fwhot" data-h="' + i + '" aria-label="' + esc(h.label) + '" style="left:' + h.box[0] + "%;top:" + h.box[1] + "%;width:" + h.box[2] + "%;height:" + h.box[3] + '%"><span></span></button>').join("");
    const g = v.go || {};
    const el = F.stage('<div class="fkick">Act ' + scene.act + " · scene " + scene.n + " of " + R.length + "</div><h1>" + esc(scene.title) + "</h1>" +
      '<div class="fwview" id="fwv">' + pic + hots + arrow("fwd", g.fwd) + arrow("left", g.left) + arrow("right", g.right) + arrow("back", g.back) +
      (pz && !pzDone ? '<button class="fwpz" id="fwpz">' + esc(pz.label) + "</button>" : "") + "</div>" +
      '<div class="fsmall">' + esc(v.cap) + (v.img ? "<small>Photo: Richard J. Allinson</small>" : "<small>Double-tap any picture for full screen</small>") + "</div>" +
      (v.hank && !w.flags["said:" + scene.id + ":" + v.id] ? '<div class="fnarr">“' + esc(v.hank) + '”<small>The Lamplighter</small></div>' : "") +
      '<div class="fwtools"><button class="fwtool" data-j="1">' + journalIcon() + ' Journal</button><button class="fwtool" data-m="1">Map</button>' +
      (done && nx ? '<button class="fwtool go" data-n="1">Walk on › ' + esc(nx.title) + "</button>" : "") +
      (!done && scene.optional && nx ? '<button class="fwtool" data-n="1">Walk on without it ›</button>' : "") + "</div>", v.img ? "w/" + v.img + ".jpg" : "temple-painting.jpg");
    if (v.hank) { w.flags["said:" + scene.id + ":" + v.id] = 1; save(); F.V("w-" + scene.id + "-" + v.id); }
    /* a scene with nothing to solve is finished once every viewpoint has been seen */
    w.flags["seen:" + scene.id + ":" + v.id] = 1; save();
    if (!done && !scene.views.some((x) => x.puzzle) && scene.views.every((x) => w.flags["seen:" + scene.id + ":" + x.id])) { setTimeout(() => K.root() && finish(scene.id), 600); return; }
    el.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { F.S("step", "click", 0.5); walk(scene.views.find((x) => x.id === b.dataset.go)); }));
    el.querySelectorAll("[data-h]").forEach((b) => (b.onclick = () => { const h = v.hots[+b.dataset.h]; K.sfx("click"); if (h.act) ACTS_FN[h.act](h); else K.card('<div class="kick">' + esc(scene.title) + "</div><h2>" + esc(h.label) + "</h2><p>" + esc(h.text) + '</p><button class="cta" data-act="x">Back</button>', { x: () => {} }); }));
    el.querySelector("[data-j]").onclick = journal;
    el.querySelector("[data-m]").onclick = () => { K.sfx("click"); map(); };
    const n = el.querySelector("[data-n]"); if (n) n.onclick = () => { K.sfx("click"); go(nx); };
    const pb = $("fwpz"); if (pb) pb.onclick = () => { K.sfx("click"); pz.run(); };
    fullscreen(el.querySelector(".fwimg"));
    if (v.note && !w.flags["note:" + scene.id + ":" + v.id]) { w.flags["note:" + scene.id + ":" + v.id] = 1; save(); v.note(); }
  }
  /* double-tap a picture to see it full screen; pinch to zoom */
  function fullscreen(img) {
    if (!img) return;
    let last = 0;
    img.parentElement.addEventListener("pointerup", (e) => {
      if (e.target !== img) return;
      const t = Date.now(); if (t - last < 320) { last = 0; openFull(img.src); } else last = t;
    });
  }
  function openFull(src) {
    const o = document.createElement("div"); o.className = "fwfull"; o.innerHTML = '<img src="' + src + '" alt="" draggable="false"><button class="fwx" aria-label="Close">✕</button><small>Pinch to zoom · tap ✕ to close</small>';
    K.root().appendChild(o);
    const im = o.querySelector("img"); let sc = 1, tx = 0, ty = 0, pts = {}, d0 = 0, s0 = 1, m0 = null;
    const draw = () => (im.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + sc + ")");
    o.addEventListener("pointerdown", (e) => { pts[e.pointerId] = [e.clientX, e.clientY]; const k = Object.keys(pts); if (k.length === 2) { const a = pts[k[0]], b = pts[k[1]]; d0 = Math.hypot(a[0] - b[0], a[1] - b[1]); s0 = sc; } else m0 = [e.clientX - tx, e.clientY - ty]; });
    o.addEventListener("pointermove", (e) => { if (!pts[e.pointerId]) return; pts[e.pointerId] = [e.clientX, e.clientY]; const k = Object.keys(pts); if (k.length === 2) { const a = pts[k[0]], b = pts[k[1]]; sc = Math.max(1, Math.min(5, s0 * Math.hypot(a[0] - b[0], a[1] - b[1]) / d0)); } else if (m0 && sc > 1) { tx = e.clientX - m0[0]; ty = e.clientY - m0[1]; } draw(); });
    const up = (e) => { delete pts[e.pointerId]; m0 = null; if (sc <= 1) { tx = 0; ty = 0; draw(); } };
    o.addEventListener("pointerup", up); o.addEventListener("pointercancel", up);
    o.querySelector(".fwx").onclick = () => o.remove();
  }
  function finish(sceneId, then) {
    const s = byId[sceneId], w = W(); const first = !w.done[sceneId]; w.done[sceneId] = 1; save();
    const after = () => { if (then) then(); else if (scene && scene.id === sceneId && !s.kept) walk(view); else map(); };
    if (s.page && first) page(s.page, after); else after();
  }
  function pzDone(key, then) { const w = W(); w.done[scene.id + ":" + key] = 1; save(); then(); }

  /* ------------------------------------------------------------ small puzzle makers ------------------------------------------------------------ */
  function screen(title, kick, html, bg) {
    F.M("puzzle", scene.amb);
    const el = F.stage('<div class="fkick">' + esc(kick || scene.title) + "</div><h1>" + esc(title) + "</h1>" + html + F.back("Back to " + scene.title), bg ? "w/" + bg + ".jpg" : "temple-painting.jpg");
    F.wire(el, () => walk(view));
    return el;
  }
  const verse = (t, ref) => '<div class="fverse">“' + esc(t) + "”<small>" + esc(ref) + "</small></div>";
  const q = (t) => '<div class="fq">' + esc(t) + "</div>";
  /* chips fill the gaps of a verse, in order */
  function fill(o) {
    let at = 1; const el = screen(o.title, o.kick, (o.intro || "") + q(o.q || "Fill in the missing words, in order.") + '<div class="fscroll" id="fscroll"></div>' +
      '<div class="fchips six" id="fchips">' + F.shuffle(o.chips).map((w) => '<button data-w="' + w + '"><b>' + w + "</b></button>").join("") + "</div>", o.bg);
    const draw = () => { $("fscroll").innerHTML = o.text.map((t, i) => i % 2 ? '<b class="' + (i < at ? "got" : i === at ? "gap now" : "gap") + '">' + (i < at ? t : "_".repeat(t.length)) + "</b>" : esc(t)).join("") + "<small>" + esc(o.ref) + "</small>"; };
    draw();
    el.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => {
      const w = b.dataset.w;
      if (w !== o.text[at]) { b.classList.add("bad"); setTimeout(() => b.classList.remove("bad"), 400); wrong(o.bad && o.bad[w] || "That word fits another gap, or none. Fill the gaps in order."); return; }
      F.S("stone", "stone", 0.5); b.classList.add("used"); at += 2; draw();
      if (at >= o.text.length) setTimeout(() => K.root() && o.done(), 700);
    }));
  }
  /* one or more multiple-choice questions, asked in turn */
  function ask(o) {
    let i = 0; const el = screen(o.title, o.kick, (o.intro || "") + '<div id="fask"></div>', o.bg);
    const next = () => {
      if (i >= o.qs.length) { o.done(); return; }
      const Q = o.qs[i];
      $("fask").innerHTML = q(Q.q) + '<div class="fchoices">' + Q.a.map((a, j) => '<button data-a="' + j + '">' + esc(a[0]) + "</button>").join("") + "</div>" + '<div class="fsmall" id="fprog">' + (o.qs.length > 1 ? "Question " + (i + 1) + " of " + o.qs.length : "") + "</div>";
      $("fask").querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => {
        const a = Q.a[+b.dataset.a];
        if (!a[1]) { wrong(a[2] || Q.no || "Not that. Look again at what you were shown."); return; }
        K.sfx("click"); F.S("step", "click", 0.5); if (a[2]) K.say(a[2], "", 3600); i++; setTimeout(next, a[2] ? 900 : 200);
      }));
    };
    next();
  }
  /* tap items in the right order */
  function order(o) {
    let at = 0; const items = o.items;
    const el = screen(o.title, o.kick, (o.intro || "") + q(o.q) + '<div class="fpath" id="fpath"></div>' +
      '<div class="fchips" id="fchips">' + F.shuffle(items.map((x, i) => i)).map((i) => '<button data-i="' + i + '"><b>' + esc(items[i][0]) + "</b>" + (items[i][1] ? "<small>" + esc(items[i][1]) + "</small>" : "") + "</button>").join("") + "</div>", o.bg);
    el.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => {
      const i = +b.dataset.i;
      if (i !== at) { b.classList.add("bad"); setTimeout(() => b.classList.remove("bad"), 400); wrong(i < at ? "That one is already placed." : o.no || "Not yet. Which comes next?"); return; }
      F.S("step", "stone"); b.classList.add("used"); at++;
      const sp = document.createElement("span"); sp.className = "fstep"; sp.textContent = items[i][0]; $("fpath").appendChild(sp);
      if (at === items.length) setTimeout(() => K.root() && o.done(), 700);
    }));
  }
  /* pick weights (or coins) that add up to a target */
  function weigh(o) {
    let picked = [];
    const el = screen(o.title, o.kick, (o.intro || "") + (o.q ? q(o.q) : "") +
      '<div class="fbalance" id="fbal"><div class="fpan l"><b>' + esc(o.left) + '</b><small>' + o.target + " " + esc(o.unit) + '</small></div><div class="fbeam"></div><div class="fpan r" id="fpanr"><b>0 ' + esc(o.unit) + "</b></div></div>" +
      '<div class="fchips three" id="fw">' + o.weights.map((w, i) => '<button data-i="' + i + '"><b>' + esc(w[0]) + "</b><small>" + w[1] + " " + esc(o.unit) + "</small></button>").join("") + "</div>" +
      '<button class="fbtn" id="fweigh">' + esc(o.btn || "Weigh") + "</button>", o.bg);
    const sum = () => picked.reduce((a, i) => a + o.weights[i][1], 0);
    const draw = () => { $("fpanr").innerHTML = "<b>" + sum() + " " + esc(o.unit) + "</b>"; const d = sum() - o.target; $("fbal").style.setProperty("--tilt", Math.max(-8, Math.min(8, d / 2)) + "deg"); el.querySelectorAll("[data-i]").forEach((b) => b.classList.toggle("sel", picked.includes(+b.dataset.i))); };
    el.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => { const i = +b.dataset.i; picked = picked.includes(i) ? picked.filter((x) => x !== i) : picked.concat(i); F.S("dial", "click", 0.5); draw(); }));
    $("fweigh").onclick = () => { if (sum() !== o.target) { wrong(sum() < o.target ? o.light || "Too light. Add more." : o.heavy || "Too heavy. Take some off."); return; } F.S("lock", null, 0.6); K.buzz("success"); setTimeout(() => K.root() && o.done(), 500); };
    draw();
  }
  /* a number: turn it up and down */
  function count(o) {
    let v = o.start || 0;
    const el = screen(o.title, o.kick, (o.intro || "") + q(o.q) + '<div class="fpace"><button id="fminus">−</button><b id="fval"></b><button id="fplus">+</button></div><button class="fbtn" id="fset">' + esc(o.btn || "That many") + "</button>", o.bg);
    const draw = () => ($("fval").textContent = v + " " + o.unit);
    $("fplus").onclick = () => { v = Math.min(o.max || 99, v + 1); F.S("dial", "click", 0.5); draw(); };
    $("fminus").onclick = () => { v = Math.max(0, v - 1); F.S("dial", "click", 0.5); draw(); };
    $("fset").onclick = () => { if (v !== o.target) { wrong(v < o.target ? o.low || "More than that. Count again." : o.high || "Fewer than that. Count again."); return; } F.S("lock", null, 0.6); K.buzz("success"); setTimeout(() => K.root() && o.done(v), 500); };
    draw();
  }
  /* find things in a picture (or in the dark, by lamplight) */
  function find(o) {
    const got = new Set();
    const pic = o.img ? '<img draggable="false" src="' + IMG + o.img + '.jpg" alt="">' : '<div class="fph ' + (o.dark ? "dark" : "grid") + '" style="--h:' + ((scene.n * 37) % 360) + '"><b>' + esc(o.title) + "</b><span>" + esc(o.scene || "") + "</span></div>";
    const el = screen(o.title, o.kick, (o.intro || "") + q(o.q) +
      '<div class="' + (o.dark ? "fdarkwrap" : "fark fwfind") + '" id="ffind">' + pic +
      o.spots.map((s, i) => '<button class="' + (o.dark ? "fnote" : "fhit fwspot") + '" data-i="' + i + '" aria-label="' + esc(s.label) + '" style="left:' + s.at[0] + "%;top:" + s.at[1] + "%" + (o.dark ? "" : ";width:" + (s.w || 16) + "%;height:" + (s.h || 12) + "%") + '"></button>').join("") +
      (o.dark ? '<div class="fdark" id="fdark"></div>' : "") + "</div>" +
      '<div class="fsmall" id="fcount"></div>', o.bg);
    const need = o.spots.filter((s) => !s.decoy).length;
    const cnt = () => ($("fcount").textContent = (o.counter || "Found") + ": " + got.size + " of " + need);
    cnt();
    if (o.dark) {
      const wrap = $("ffind"), dark = $("fdark"); dark.style.setProperty("--rad", "22%");
      const light = (e) => { const r = wrap.getBoundingClientRect(); dark.style.setProperty("--x", ((e.clientX - r.left) / r.width) * 100 + "%"); dark.style.setProperty("--y", ((e.clientY - r.top) / r.height) * 100 + "%"); };
      wrap.addEventListener("pointermove", light); wrap.addEventListener("pointerdown", light);
    }
    el.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => {
      const s = o.spots[+b.dataset.i];
      if (s.decoy) { wrong(s.text); return; }
      if (got.has(s.label)) return;
      got.add(s.label); b.classList.add("found"); if (o.dark) b.textContent = "✓"; F.S("parchment", "click"); cnt();
      K.card('<div class="kick">' + esc(o.title) + "</div><h2>" + esc(s.label) + "</h2><p>" + esc(s.text) + '</p><button class="cta" data-act="x">' + (got.size >= need ? esc(o.last || "Go on") : "Keep looking") + "</button>", { x: () => { if (got.size >= need) o.done(); } });
    }));
  }
  /* a short conversation with choices */
  function talk(o) {
    const el = screen(o.title, o.kick, (o.intro || "") + '<div id="ftalk"></div>', o.bg);
    const line = (html) => { const d = document.createElement("div"); d.className = "fwline"; d.innerHTML = html; $("ftalk").appendChild(d); d.scrollIntoView({ behavior: "smooth", block: "end" }); return d; };
    const him = (t, who) => line('<div class="fhim">' + t + "<small>" + esc(who || o.who) + "</small></div>");
    const choices = (opts, then) => {
      const d = line('<div class="fchoices">' + opts.map((x, i) => '<button data-o="' + i + '">' + esc(x[0]) + "</button>").join("") + "</div>");
      d.querySelectorAll("[data-o]").forEach((b) => (b.onclick = () => { K.sfx("click"); const x = opts[+b.dataset.o]; d.innerHTML = '<div class="fme">“' + esc(x[0]) + "”</div>"; then(x[1], x); }));
    };
    const end = (html, label, then) => { const d = line((html || "") + '<button class="fbtn glow" id="ftend">' + esc(label) + "</button>"); d.querySelector("#ftend").onclick = () => { K.sfx("click"); then(); }; };
    o.run({ him, line, choices, end, el });
  }
  /* drag something along a track */
  function slide(o) {
    const el = screen(o.title, o.kick, (o.intro || "") + q(o.q) + '<div class="fslide" id="fsl"><div class="ftrack"></div><div class="fknob" id="fkn">' + esc(o.knob || "") + "</div></div>" + '<div class="fsmall">' + esc(o.hint || "Drag it.") + "</div>", o.bg);
    const tr = $("fsl"), kn = $("fkn"); let x = 0, drag = false, ok = false;
    const set = (cx) => { const r = tr.getBoundingClientRect(); x = Math.max(0, Math.min(1, (cx - r.left - 30) / (r.width - 60))); kn.style.left = x * (r.width - 60) + "px"; if (!ok && x > 0.96) { ok = true; kn.classList.add("on"); F.S("stone", "stone", 0.8); K.buzz("success"); setTimeout(() => K.root() && o.done(), 600); } };
    tr.addEventListener("pointerdown", (e) => { drag = true; tr.setPointerCapture(e.pointerId); });
    tr.addEventListener("pointermove", (e) => { if (drag && !ok) set(e.clientX); });
    tr.addEventListener("pointerup", () => (drag = false)); tr.addEventListener("pointercancel", () => (drag = false));
  }

  /* ------------------------------------------------------------ the puzzles, scene by scene ------------------------------------------------------------ */
  const grey = (t) => '<div class="fhim">' + esc(t) + "<small>The man in the grey coat</small></div>";
  const PUZZLES = {
    board: { label: "Read the board", run: () => ask({ title: "The departures board", intro: q("Every pilgrim came UP to Jerusalem (Psalm 122:4). The board lists four trains."),
      qs: [{ q: "Which train do you take?", a: [["Tel Aviv – HaHagana", 0, "Down to the coast. The other way."], ["Jerusalem – Yitzhak Navon", 1], ["Haifa – Hof HaCarmel", 0, "North, along the sea. Not the mountains."], ["Be’er Sheva", 0, "South, to the desert."]] }],
      done: () => pzDone("board", () => finish("train", () => walk(V("platform")))) }) },
    scales: { label: "The spice seller’s scales", run: () => weigh({ title: "A just weight", kick: "The spice seller", intro: verse("Just balances, just weights, a just ephah, and a just hin, shall ye have: I am the LORD your God.", "Leviticus 19:36") +
      '<div class="fq">“You want to buy? First you must weigh,” says the spice seller, and sets a worn stone on the left pan. “One shekel. Make the other side match, in gerahs.”</div>' + q("A shekel is twenty gerahs (Exodus 30:13). Tap the weights for the right pan."),
      left: "The shekel stone", target: 20, unit: "gerahs", weights: [["A large weight", 12], ["A medium weight", 8], ["A small weight", 5], ["A smaller weight", 3], ["The smallest", 2]],
      light: "The pans do not level. Twenty gerahs to the shekel.", heavy: "Too heavy: the stone rises. A shekel is twenty gerahs, no more.",
      done: () => { K.card('<div class="kick">The spice seller</div><h2>“A just weight”</h2><p>The pans level. The seller nods, and tips a spoon of zaatar into a paper twist for you. “A just weight is his delight. You will need one of these.” He drops a small bronze weight into the twist: <b>one bekah, half a shekel</b>. Folded round it, blue at the edges, a page.</p><button class="cta" data-act="x">Unfold the page</button>',
        { x: () => { W().flags.bekah = 1; save(); pzDone("scales", () => finish("market")); } }); } }) },
    souvenir: { label: "Choose a souvenir", run: () => find({ title: "Everyone takes a souvenir home", kick: "Gabriel’s shop", q: "Six things on the counter. The Watchman’s page said: take the one that remembers the house. Tap each one to look closely.", counter: "Looked at", last: "This is the one",
      spots: [
        { label: "The kippah", at: [4, 10], w: 28, h: 30, decoy: true, text: "A knitted kippah, blue and white. Nothing on it but the stitches." },
        { label: "The prayer shawl", at: [36, 10], w: 28, h: 30, decoy: true, text: "A tallit with blue stripes and knotted fringes: “that ye may look upon it, and remember all the commandments of the LORD” (Numbers 15:39). No mark." },
        { label: "The menorah", at: [68, 10], w: 28, h: 30, decoy: true, text: "A small brass menorah, seven branches. Handsome. No lamp drawn on it: it is a lamp." },
        { label: "The shofar", at: [4, 55], w: 28, h: 30, decoy: true, text: "A ram’s horn, polished. Gabriel says, “Blow it on the Feast of Trumpets.” No mark." },
        { label: "The Jerusalem wall hanging", at: [68, 55], w: 28, h: 30, decoy: true, text: "A carved wooden picture of the city, filled with coloured stone chips, with the Home Blessing in the middle. The stones catch the light. No lamp." },
        { label: "The model of the Third Temple", at: [36, 55], w: 28, h: 30, text: "A little model of the Temple as it will be built: the courts, the altar, the sanctuary. Turn it over. On the base, in blue ink, a small drawn lamp, and a folded page tucked into the hollow." },
      ],
      done: () => { K.card('<div class="kick">Gabriel</div><h2>“That one. Yes.”</h2><p>Gabriel does not look surprised. “Someone left that for you this morning. He said you would know it. And a man in a grey coat asked for the same one an hour ago, and I told him it was sold.” He wraps the model in paper. “The house remembers where it stood. Go and see.”</p><button class="cta" data-act="x">Unfold the page</button>',
        { x: () => pzDone("souvenir", () => finish("gabriel")) }); } }) },
    modelq: { label: "Study the Temple", run: () => ask({ title: "The courts and the gates", kick: "The Second Temple model", intro: verse("And the glory of the LORD came into the house by the way of the gate whose prospect is toward the east.", "Ezekiel 43:4"),
      qs: [
        { q: "Which way does the sanctuary face?", a: [["North, toward the fortress", 0, "The fortress is at the corner, not in front of the house."], ["East, toward the Mount of Olives", 1, "East. Through the gate, across the valley, to the Mount of Olives."], ["West, toward the Upper City", 0, "The Holy of Holies is at the west end: the back of the house."]] },
        { q: "A pilgrim comes in at the Eastern Gate. Which court is first?", a: [["The Court of the Priests", 0, "The priests’ court is far inside, by the altar."], ["The Court of the Women", 1, "The largest court, open to all Israel: 135 cubits square."], ["The Holy of Holies", 0, "Only the High Priest, once a year."]] },
        { q: "What stands in the court before the sanctuary, where the smoke rises?", a: [["The altar of burnt offering", 1, "The great altar, in the open court, with its ramp."], ["The menorah", 0, "The menorah stood inside the Holy Place, out of the weather."], ["A fountain", 0, "The laver was for washing, not the smoke."]] },
      ],
      done: () => { K.card('<div class="kick">The model</div><h2>You know the house now</h2><p>Eastern Gate, Court of the Women, Court of Israel, the altar, the sanctuary, and at the back the Holy of Holies: a straight line from east to west. <b>Remember it.</b> On the model’s eastern wall, where the gate is, someone has stuck a page under the glass.</p><button class="cta" data-act="x">Take the page</button>',
        { x: () => pzDone("modelq", () => finish("model")) }); } }) },
    wayup: { label: "Find the way up", run: () => ask({ title: "The way onto the wall", kick: "Jaffa Gate", intro: q("Three ways out of the square: a street going down into the city, the citadel’s drawbridge, and a small door marked “Ramparts Walk”, with a stair behind it."),
      qs: [{ q: "Which way?", a: [["Down the street into the souk", 0, "Down takes you into the city. You want up."], ["The small door and the stair", 1], ["The citadel drawbridge", 0, "That is the museum. Locked today."]] }],
      done: () => pzDone("wayup", () => finish("jaffa")) }) },
    landmarks: { label: "Tell the towers", run: () => order({ title: "Tell the towers thereof", kick: "The Ramparts Walk", intro: verse("Walk about Zion, and go round about her: tell the towers thereof. Mark ye well her bulwarks, consider her palaces.", "Psalm 48:12–13"),
      q: "From the wall you can see four landmarks. Put them in order from nearest to farthest, as the journal’s old map shows them.", no: "Look along the wall again: which is nearer?",
      items: [["The Tower of David", "just behind you"], ["The grey domes of the Holy Sepulchre", "in the Christian Quarter"], ["The golden Dome of the Rock", "on the Temple Mount"], ["The Mount of Olives", "across the valley, beyond the city"]],
      done: () => pzDone("landmarks", () => walk(V("arch"))) }) },
    storm: { label: "The way ahead", run: () => { setTimeout(() => F.M("m13", "olives"), 50); talk({ title: "The storm", kick: "The Ramparts Walk", who: "The Lamplighter", run: (T) => {
      T.line('<div class="fq">It is October: the dry season, no rain due for weeks. The wind comes first, hot, then cold. Then the sky over Damascus Gate turns the colour of slate and the rain hits the wall like thrown gravel. Ahead, where the walk goes down to the gate, two men stand across the path with their hands up. Behind them, lightning.</div>');
      T.him("“Not this way. Not today.”", "A voice on the wall");
      T.choices([["Push on toward Damascus Gate", 0], ["Stop, and look at the cloud", 1]], (ok) => {
        if (!ok) { st.misses++; T.line('<div class="fq">You take three steps and the thunder is so close it has no echo. The men do not move. Neither, now, do you.</div>'); }
        T.line('<div class="fverse">“And the pillar of the cloud went from before their face, and stood behind them: and it came between the camp of the Egyptians and the camp of Israel; and it was a cloud and darkness to them, but it gave light by night to these.”<small>Exodus 14:19–20</small></div>');
        T.him("“A cloud that stands in the way is not always against you. Sometimes it stands between you and something. The way is closed. Turn back, and go down into the Jewish Quarter. When the sky clears, this stretch of wall will be here.”");
        T.end('<div class="fq">You turn back along the wall, the rain at your back, and come down inside the city.</div>', "Down into the Jewish Quarter", () => { W().flags.storm = 1; save(); pzDone("storm", () => finish("ramparts", () => go(byId.jewish))); });
      });
    } }); } },
    burnt: { label: "The Burnt House", run: () => order({ title: "What happened here", kick: "The Burnt House", intro: verse("For the days shall come upon thee, that thine enemies shall cast a trench about thee, and compass thee round… and they shall not leave in thee one stone upon another.", "Luke 19:43–44") +
      q("A priestly family’s house, found under two metres of ash in 1970: a spear, a stone table, coins from the year 69, and the arm bone of a young woman by the kitchen step. Put the story in order."),
      items: [["Jesus weeps over the city", "“thine enemies shall compass thee round”, about AD 30"], ["The legions surround Jerusalem", "Titus, spring of AD 70"], ["The Temple burns", "the ninth of Av, AD 70"], ["The Upper City falls and this house burns", "a month later"], ["The stones are thrown down into the street", "“not one stone upon another”"]],
      no: "Not yet. What had to happen before that?",
      done: () => { K.card('<div class="kick">The Burnt House</div><h2>Forty years</h2><p>Jesus spoke; forty years later it was done, to the letter. The Temple he wept over is gone. But the stones that held up its platform are still here, under the streets, and someone has left a page on the stone table.</p><button class="cta" data-act="x">Take the page</button>', { x: () => pzDone("burnt", () => finish("jewish")) }); } }) },
    courses: { label: "Look down the shaft", run: () => count({ title: "Follow the stones down", kick: "Under Wilson’s Arch", intro: q("You hold your lamp over the glass. Below the floor the Wall goes on down, course after course of Herod’s great stones, into black water at the bottom. A small plaque: “17 courses of Herodian masonry lie beneath the present floor.”") + q("Count the courses. The Watchman said you would need the number again."),
      q: "How many courses lie below the floor?", unit: "courses", start: 10, max: 30, target: 17, btn: "That many",
      low: "The plaque says more than that. Read it again.", high: "Fewer. Read the plaque again.",
      done: (v) => { W().flags.courses = v; save(); K.card('<div class="kick">Under Wilson’s Arch</div><h2>Seventeen courses</h2><p>Seventeen courses of stone below your feet, each as tall as a man. The Wall you see is the top of something far deeper. An attendant sees your lamp and smiles: “You want to see them? The tunnel tour begins through that door.” On the door frame, a page.</p><button class="cta" data-act="x">Take the page</button>', { x: () => pzDone("courses", () => finish("wilson")) }); } }) },
    measure: { label: "Measure the great stone", run: () => ask({ title: "The Master Course", kick: "The Western Wall tunnels", intro: q("The guide’s board gives the Western Stone as 13.6 metres long and 3.3 metres high. A cubit, the board says, is about 52 centimetres."),
      qs: [
        { q: "About how many cubits long is the great stone?", a: [["About 6 cubits", 0, "Longer. Thirteen and a half metres, at half a metre to the cubit."], ["About 26 cubits", 1, "Twenty-six cubits: longer than the Holy of Holies, which was twenty cubits square (1 Kings 6:20)."], ["About 60 cubits", 0, "Too long: that is the length of Solomon’s whole house (1 Kings 6:2)."]] },
        { q: "Herod’s stones have a smooth flat border round a raised middle. What is that border called?", a: [["A keystone", 0, "A keystone holds up an arch."], ["A drafted margin", 1], ["A cornice", 0, "A cornice runs along a roof."]] },
      ],
      done: () => { pzDone("measure", () => walk(V("warren"))); } }) },
    firstanswer: { label: "Read the sign", run: () => ask({ title: "The first answer", kick: "Warren’s Gate", intro: q("The plaque reads: “The site opposite the Holy of Holies.” Tradition puts the Holy of Holies just beyond this wall, on the rock beneath the Dome of the Rock, and people pray here for that reason. Tucked behind the plaque’s edge: a page. “This is the first answer. Don’t believe it yet.”"),
      qs: [{ q: "The sign says the Holy of Holies stood under the Dome of the Rock. What would you need to check before you believe it?", a: [["Whether the ground there is a flat threshing floor", 0, "Yes, that is one thing. But it is not the only thing."], ["Whether the line from the Eastern Gate reaches it", 0, "That too. But not that alone."], ["Whether the cubits from the gate end there", 0, "That too. And more."], ["All of those, and what Solomon said about the middle of the court", 1, "All of it. One clue can mislead. Five clues that agree cannot."]] }],
      done: () => { K.card('<div class="kick">The tunnels</div><h2>The first answer</h2><p>Thirteen centuries of tradition put the Holy of Holies under the golden dome. Traditions are not always wrong. But the Watchman says: don’t believe it yet. You will test it on the Mount itself, with five clues.</p><p>Back at the entrance, the attendant says the rain has stopped. The wall is open again.</p><button class="cta" data-act="x">Back up to the wall</button>', { x: () => pzDone("firstanswer", () => finish("tunnels", () => go(byId.wallagain))) }); } }) },
    stone: { label: "Roll the stone", run: () => slide({ title: "The stone is rolled away", kick: "The Garden Tomb", intro: verse("And when they looked, they saw that the stone was rolled away: for it was very great… he is risen; he is not here: behold the place where they laid him.", "Mark 16:4–6"),
      q: "A groove runs across the front of the tomb, cut for a rolling stone. Roll the stone along it, to the right, and look in.", knob: "⬤", hint: "Drag the stone along the groove.",
      done: () => { K.card('<div class="kick">The Garden Tomb</div><h2>He is not here</h2><p>The stone rolls, and the doorway is open. Inside: a weeping chamber, and a bench cut in the rock. Empty. On the bench, weighed down with a pebble, a page.</p><button class="cta" data-act="x">Take the page</button>', { x: () => pzDone("stone", () => finish("gtomb")) }); } }) },
    halfshekel: { label: "Pay the trader", run: () => weigh({ title: "Half a shekel", kick: "The bazaar", intro: verse("This they shall give… half a shekel after the shekel of the sanctuary: (a shekel is twenty gerahs:) an half shekel shall be the offering of the LORD.", "Exodus 30:13") +
      '<div class="fq">The trader holds up an old map of the City of David. “For you? Half a shekel. The Temple tax. Pay me the old way, in weights, and it is yours.”</div>' + q("Make exactly half a shekel on the pan. The bekah from the spice seller is in your pocket."),
      left: "Half a shekel", target: 10, unit: "gerahs", btn: "Pay",
      weights: [["The bekah from the market", 10], ["A gerah", 1], ["Two gerahs", 2], ["Five gerahs", 5], ["A full shekel", 20]],
      light: "“Not enough, my friend. Half a shekel: ten gerahs.”", heavy: "“Too much! I am an honest man. Ten gerahs, no more.”",
      done: () => { K.card('<div class="kick">The trader</div><h2>“Sold”</h2><p>“The bekah. Half a shekel, the price of a man before God: the same for rich and poor” (Exodus 30:15). He hands you a map of David’s cities. “First Hebron, where David was king seven years. Then Zion, and the ridge where Jerusalem began.”</p><button class="cta" data-act="x">To Hebron</button>', { x: () => pzDone("halfshekel", () => finish("bazaar")) }); } }) },
    bought: { label: "Bought, not taken", run: () => ask({ title: "Bought, not taken", kick: "The Cave of Machpelah", intro: verse("And Abraham weighed to Ephron the silver, which he had named in the audience of the sons of Heth, four hundred shekels of silver, current money with the merchant.", "Genesis 23:16") +
      q("An old teaching (Genesis Rabbah 79:7) names three places in the land that no one can say were stolen, because each was bought and paid for. Name the prices."),
      qs: [
        { q: "What did Abraham pay for this cave?", a: [["Nothing: it was a gift", 0, "Ephron offered it as a gift. Abraham insisted on paying (Genesis 23:11–13)."], ["Four hundred shekels of silver", 1, "Weighed out in front of everyone at the gate (Genesis 23:16)."], ["Seven ewe lambs", 0, "That was the well at Beersheba (Genesis 21:30)."]] },
        { q: "What did Jacob pay for the field at Shechem, where Joseph was later buried?", a: [["An hundred pieces of money", 1, "“He bought a parcel of a field… for an hundred pieces of money” (Genesis 33:19; Joshua 24:32)."], ["Seven years of work", 0, "That was for Rachel (Genesis 29:20)."], ["A mess of pottage", 0, "That was Esau’s birthright (Genesis 25:34)."]] },
        { q: "And the third place: what did David pay Ornan the Jebusite for his threshing floor?", a: [["Six hundred shekels of gold", 1, "“So David gave to Ornan for the place six hundred shekels of gold by weight” (1 Chronicles 21:25)."], ["Nothing: Ornan gave it", 0, "Ornan offered it freely. David said: I will not offer that which costs me nothing (1 Chronicles 21:24)."], ["Thirty pieces of silver", 0, "That is another price, and another story (Matthew 26:15)."]] },
      ],
      done: () => { W().flags.bought = 1; save(); K.card('<div class="kick">The Cave of Machpelah</div><h2>Three places, bought</h2><p>The cave of Abraham, the field of Joseph, and the threshing floor of Ornan: bought and paid for, in front of witnesses. The third is the place of the Temple: “in mount Moriah… in the threshingfloor of Ornan the Jebusite” (2 Chronicles 3:1).</p><p><b>So the Temple stood on a threshing floor that David bought.</b> When you stand on the Mount, look for a threshing floor. It goes in your journal.</p><button class="cta" data-act="x">Back to Jerusalem: Mount Zion</button>', { x: () => pzDone("bought", () => finish("hebron", () => go(byId.zion))) }); } }) },
    north: { label: "The psalm on the wall", run: () => fill({ title: "The sides of the north", kick: "David’s Tomb", intro: q("Embroidered on the velvet cover over the cenotaph, a line from a psalm, with words worn away."),
      text: ["Beautiful for situation, the joy of the whole earth, is mount Zion, on the sides of the ", "NORTH", ", the city of the great ", "KING", "."], ref: "Psalm 48:2", chips: ["NORTH", "SOUTH", "KING", "PRIEST", "EAST", "JUDGE"],
      bad: { SOUTH: "The psalm says the opposite side. Hold on to that: it will matter on the Mount.", EAST: "Not east. Which side of the mountain does the psalm name?" },
      done: () => { K.card('<div class="kick">Psalm 48</div><h2>On the sides of the north</h2><p>Zion, the city of the great King, “on the sides of the north.” Remember which side. Under the edge of the cover, a page.</p><button class="cta" data-act="x">Take the page</button>', { x: () => pzDone("north", () => finish("zion")) }); } }) },
    arksign: { label: "Read the sign", run: () => { W().flags.arksign = 1; save(); K.card('<div class="kick">The City of David</div><h2>“Raiders of the Lost Ark”</h2><p>The sign tells of Montague Parker, an Englishman who dug in the City of David from 1909 to 1911, looking for the treasures of the Temple. He found the ancient water system, but no treasure. So he bribed the guards of the Temple Mount and began to dig beneath it. When he was discovered, he fled Jerusalem, and newspapers around the world asked: <b>“Have Englishmen found the Ark of the Covenant?”</b></p><p>They had not. But the old tradition says the Ark was hidden before the Babylonians came, in a chamber under the Mount: near the gate Charles Warren found in the Western Wall. You have stood at that gate. The sign goes into your journal.</p><button class="cta" data-act="x">Noted</button>', { x: () => pzDone("arksign", () => walk(view)) }); } },
    zionq: { label: "Where was Zion?", run: () => fill({ title: "The strong hold of Zion", kick: "The City of David", intro: q("The trader’s map marks the ridge you are standing on. The verse beside it has gaps."),
      text: ["Nevertheless David took the strong hold of ", "ZION", ": the same is the city of ", "DAVID", "."], ref: "2 Samuel 5:7", chips: ["ZION", "DAVID", "MORIAH", "SAUL", "HEBRON", "JEBUS"],
      bad: { MORIAH: "Moriah is the Temple hill, just north. David took the city first.", JEBUS: "The Jebusites held it; Zion is what David took." },
      done: () => { K.card('<div class="kick">The City of David</div><h2>Where it began</h2><p>This ridge is Zion, David’s city. The Temple Mount is the higher hill just north of it, which David bought from Ornan the Jebusite. The city grew up the hill toward the house of God. Follow the steps down to the spring.</p><button class="cta" data-act="x">Down to the spring</button>', { x: () => pzDone("zionq", () => finish("cod", () => walk(V("descent")))) }); } }) },
    lampstone: { label: "Look along the rock", run: () => find({ title: "The anointing of Solomon", kick: "The Gihon Spring", intro: verse("And Zadok the priest took an horn of oil out of the tabernacle, and anointed Solomon. And they blew the trumpet; and all the people said, God save king Solomon.", "1 Kings 1:39"),
      q: "Five stones at the water’s edge. One carries the Watchman’s lamp. Tap the stones.", counter: "Found", last: "Light the lamp",
      spots: [{ label: "A wet stone", at: [8, 70], w: 16, h: 14, decoy: true, text: "Wet, green, nothing on it." }, { label: "A flat stone", at: [30, 74], w: 16, h: 14, decoy: true, text: "Flat and dry. Nothing." }, { label: "A cracked stone", at: [52, 70], w: 16, h: 14, decoy: true, text: "Cracked through. Nothing." }, { label: "A stone with a mark", at: [74, 76], w: 16, h: 14, text: "Scratched into the stone, small, a lamp. Beside it a splash of something dark that smells of olives: oil. Enough to fill your lamp for the tunnel." }, { label: "A rounded stone", at: [40, 50], w: 14, h: 12, decoy: true, text: "Round and smooth. Nothing." }],
      done: () => { W().flags.lit = 1; save(); K.card('<div class="kick">The Gihon Spring</div><h2>Oil for the dark</h2><p>You fill the lamp. Solomon was anointed with oil at this water, and built the house. You will need the light: the tunnel ahead is 533 metres of darkness.</p><button class="cta" data-act="x">To the tunnel mouth</button>', { x: () => pzDone("lampstone", () => finish("gihon", () => walk(V("mouth")))) }); } }) },
    darktunnel: { label: "Go in", run: () => find({ title: "Hezekiah’s Tunnel", kick: "In the dark", dark: true, img: "hezekiah-tunnel", scene: "Cold water, rough rock, the sound of your own breathing", intro: verse("This same Hezekiah also stopped the upper watercourse of Gihon, and brought it straight down to the west side of the city of David.", "2 Chronicles 32:30"),
      q: "Drag your finger to carry the lamp through the tunnel. Find the three things the Watchman marked.", counter: "Found", last: "Out into the light",
      spots: [
        { label: "The chisel marks", at: [22, 30], text: "Pick marks in the rock, slanting one way, then, further on, slanting the other. Two teams of diggers, starting from each end, cutting toward each other in the dark." },
        { label: "The meeting point", at: [60, 55], text: "Here the two tunnels met: the ceiling jumps, the walls do not quite line up. The Siloam Inscription was cut into the wall here in 701 BC: “…the quarrymen struck, each toward his fellow, pick against pick, and the water flowed from the spring to the pool.” The stone itself is in Istanbul." },
        { label: "A lamp on the wall", at: [40, 80], text: "Scratched into the rock at shoulder height, a small lamp, and under it a word: WEST. The tunnel bends, but it is heading west, under the city, as the Chronicler said." },
      ],
      done: () => { K.card('<div class="kick">Hezekiah’s Tunnel</div><h2>Through the hill</h2><p>Half a kilometre of rock, cut from both ends by men with picks and lamps, meeting in the middle. The water still runs. Ahead, a grey light grows: the pool.</p><button class="cta" data-act="x">Out to the pool</button>', { x: () => pzDone("darktunnel", () => finish("hezekiah", () => go(byId.siloam))) }); } }) },
    siloamq: { label: "The pool", run: () => fill({ title: "Sent", kick: "The Pool of Siloam", intro: q("On the top step, scratched in the stone in the same hand as the journal, the verse, with three words left out."),
      text: ["And said unto him, Go, wash in the pool of ", "SILOAM", ", (which is by interpretation, ", "SENT", ".) He went his way therefore, and washed, and came ", "SEEING", "."], ref: "John 9:7", chips: ["SILOAM", "SENT", "SEEING", "BETHESDA", "BLIND", "WASHED"],
      bad: { BETHESDA: "Bethesda is the other pool, north of the Temple. This one is Siloam.", BLIND: "He was blind when he went. What was he when he came back?" },
      done: () => { K.card('<div class="kick">The Pool of Siloam</div><h2>Came seeing</h2><p>Sent, and came back seeing. You came through the dark and out into the light. On the step, a page.</p><button class="cta" data-act="x">Take the page</button>', { x: () => pzDone("siloamq", () => finish("siloam")) }); } }) },
    ascents: { label: "Climb the steps", run: () => fill({ title: "The Songs of Ascents", kick: "The Southern Steps", intro: q("Fifteen psalms, 120 to 134, each headed “A Song of degrees”: sung, the Mishnah says, one on each of the fifteen steps. The first words of the third song are cut into the bottom step."),
      text: ["I was ", "GLAD", " when they said unto me, Let us go into the ", "HOUSE", " of the LORD. Our ", "FEET", " shall stand within thy ", "GATES", ", O Jerusalem."], ref: "Psalm 122:1–2", chips: ["GLAD", "HOUSE", "FEET", "GATES", "AFRAID", "WALLS"],
      bad: { AFRAID: "Not afraid. How did the pilgrims feel, going up?", WALLS: "Not the walls. What did they stand within?" },
      done: () => { K.card('<div class="kick">The Southern Steps</div><h2>Within thy gates</h2><p>Up the steps the pilgrims went, singing, to the Huldah Gates and the tunnels that brought them up into the Court of the Women. The gates are walled now. Round the corner, the stones.</p><button class="cta" data-act="x">Round the corner</button>', { x: () => pzDone("ascents", () => walk(V("robinson"))) }); } }) },
    robinson: { label: "The stones", run: () => F.robinson() },
    moses: { label: "The gate across the path", run: () => talk({ title: "Moses", kick: "The Dung Gate", who: "Moses", intro: verse("And I went out by night by the gate of the valley… and to the dung port, and viewed the walls of Jerusalem.", "Nehemiah 2:13"), run: (T) => {
      T.line('<div class="fq">The path down into the Kidron is barred by an iron gate across the road. As you put your hand on it, a man steps out of the shade of the wall. Older, in a worn jacket, with a kind, tired face.</div>');
      T.him("“No, no. Not this way, my friend. Down there you will be robbed. Nobody will see.”");
      T.choices([["Thank you. Which way, then?", 1], ["I’ll be fine. Open the gate.", 0]], (ok) => {
        if (!ok) { st.misses++; T.him("“I will not. I have lived here sixty years. Listen to me.”"); }
        T.him("“Go up. Those stairs, there, by the wall. Walk along the top, past the graves, and come round from above. You will see your tombs from the hill, and nobody will trouble you.”");
        T.choices([["What is your name?", 1]], () => {
          T.him("“Moses.” He smiles at your face. “Yes. Go up, and come round from above.”");
          T.end('<div class="fq">A man called Moses, at the edge of the valley, pointing you up the mountain. You go up.</div>', "Up the steps", () => pzDone("moses", () => finish("dung")));
        });
      });
    } }) },
    police: { label: "Go up to the gate", run: () => talk({ title: "“Did you touch the gate?”", kick: "The Eastern Gate", who: "The police officer", intro: q("You climb the last few steps and stand under the sealed arches. Stone, filled with stone. Behind you, down the slope, a car door. Two police officers, walking up fast."), run: (T) => {
      T.him("“Were you up at the gate?”");
      T.choices([["Yes. I went up to see it.", 1], ["What gate?", 0]], (ok) => {
        if (!ok) { st.misses++; T.him("“The gate behind you. We watched you walk up to it.”"); }
        T.him("“Did you touch the gate?”");
        T.choices([["No. I only looked.", 1], ["I put my hand on it.", 0]], (ok2) => {
          if (!ok2) { st.misses++; T.him("“Show me your hands.” He looks. No paint. “Hm.”"); }
          T.him("“Okay. We have had people spray-painting the gate. We wanted to make sure you were not causing trouble. You are free to go.” He looks up at the arches himself for a moment, then back down the hill.");
          T.line('<div class="fverse">“This gate shall be shut, it shall not be opened, and no man shall enter in by it; because the LORD, the God of Israel, hath entered in by it.”<small>Ezekiel 44:2</small></div>');
          T.end('<div class="fq">Even now, the gate is watched. No one goes through it. Down in the valley below you, the two tombs; and up the hill behind them, the Mount of Olives.</div>', "Down to the tombs", () => pzDone("police", () => finish("egate")));
        });
      });
    } }) },
    whose: { label: "Whose tomb?", run: () => ask({ title: "Who lies here?", kick: "The Kidron Valley", intro: verse("Now Absalom in his lifetime had taken and reared up for himself a pillar, which is in the king’s dale… and it is called unto this day, Absalom’s place.", "2 Samuel 18:18"),
      qs: [
        { q: "The tall monument with the cone roof is called Absalom’s Pillar. Its style is Greek and Roman, a thousand years after Absalom. What does that tell you?", a: [["It is a fake", 0, "Not a fake: a real tomb, of someone, from the first century."], ["It remembers Absalom; it does not hold him", 1, "A memorial name on a later tomb. Jerusalem is full of those."], ["Absalom lived in Roman times", 0, "Absalom was David’s son, about 1000 BC."]] },
        { q: "The block with the pyramid on top has no door and no room inside. What is it, then?", a: [["A sealed grave", 0, "Look at the sign beside it: it was never used for burial."], ["A nefesh: a monument to the name of the dead", 1, "A nefesh, cut from the living rock, to keep a name. Tradition gave it Zechariah’s."], ["A watchtower over the valley", 0, "No stairs, no room, no way up."]] },
      ],
      done: () => { K.card('<div class="kick">The Kidron Valley</div><h2>Between the temple and the altar</h2><p>Zechariah the priest was stoned “in the court of the house of the LORD” (2 Chronicles 24:21), and the monument that carries his name faces the place. Up the hill behind it, a side path leads to a cave: the Tombs of the Prophets. The main path goes on up to the top of the Mount of Olives.</p><button class="cta" data-act="x">Up the hill</button>', { x: () => pzDone("whose", () => finish("kidron")) }); } }) },
    lastpage: { label: "Look in the hollow", run: () => { K.card('<div class="kick">Gethsemane</div><h2>At the foot of the oldest tree</h2><p>Through the mesh, wedged in a crack at the foot of the great trunk, where no gardener would see it: a fold of paper, blue at the edges. The last torn page.</p><button class="cta" data-act="x">Unfold it</button>', { x: () => pzDone("lastpage", () => finish("gethsemane")) }); } },
    greytop: { label: "The man by the arcade", run: () => talk({ title: "At the top of the bridge", kick: "The Temple Mount", who: "The man in the grey coat", run: (T) => {
      T.line('<div class="fq">He is leaning on a pillar of the arcade, as if he has been there a while. Grey coat, grey hair, a face you have seen on three platforms and in two crowds. He straightens up as you come through the gate.</div>');
      T.him("“You took your time. Twelve pages, was it? I had three, and a guess. Well. We are both here now.”");
      T.choices([["Who are you?", 1], ["Who is the Watchman?", 1]], (k, x) => {
        T.him(x[0].startsWith("Who are") ? "“Someone who is paid to know where things are. And someone who needs to know this one before his employers sit down at a table.”" : "“Your friend with the blue ink? I don’t know. I would very much like to. He is always a page ahead of me, and apparently a page behind you.”");
        T.him("“Go on, then. Do your five clues. I will be watching. If you are right, I will know it, and so will they.” He nods at the platform. “Where was the Temple?”");
        T.end("", "Onto the platform", () => pzDone("greytop", () => finish("mughrabi", () => go(byId.mount))));
      });
    } }) },
  };
  const ACTS_FN = {
    gabrielTalk: () => { K.card('<div class="kick">Gabriel</div><h2>“Shalom. Come in, come in.”</h2><p>Gabriel is behind the counter, a small man with a big voice, and within a minute you are talking about the end of days. “Everybody who comes in here wants to know when,” he says. “Nobody asks where. You ask where. Good.” He taps the counter. “Everyone takes a souvenir home. Choose.”</p><button class="cta" data-act="x">Look at the counter</button>', { x: () => {} }); },
    warrenGate: () => { const w = W(); K.card('<div class="kick">Warren’s Gate</div><h2>“Entrance gate to the Temple Mount”</h2><p>The sign says: one of four gates in the Western Wall from the Second Temple period, found by Charles Warren in 1867. From 638 to 1099 the passage inside it was the main synagogue of the Jews in Jerusalem, called “the Cave”, placed here because it was close to the Holy of Holies. Today it is a cistern.</p>' + (w.flags.arksign ? "<p>Parker, in the City of David, dug for the Ark and fled. The old tradition says it lies in a chamber beyond this gate, under the Mount. In 1981 the rabbis of the Wall broke through here and began to dig; the passage was sealed again by order. Whatever is behind this stone, no one has seen it since.</p>" : "<p>Behind the stone, the tunnel is said to run on under the Mount. There is a story about this gate. You will hear it in the City of David.</p>") + '<button class="cta" data-act="x">Back</button>', { x: () => {} }); },
  };

  /* hints for the walking scenes (the hint button in the top bar) */
  function hint() {
    st.hints++;
    const v = view;
    if (!scene || scene.kept) return K.say("Every clue is in the Scripture or the history it quotes.", "", 3600);
    if (v && v.puzzle && !W().done[scene.id + ":" + v.puzzle]) return K.say(({ scales: "Twenty gerahs: 12 and 8, or 12, 5 and 3.", souvenir: "The page said: the one that remembers the house.", modelq: "East. The Court of the Women. The altar.", landmarks: "The citadel is behind you; the Mount of Olives is beyond the whole city.", burnt: "Prophecy first, then the siege, the Temple, the house, the stones.", courses: "Read the small plaque by the shaft.", firstanswer: "No single clue is enough.", halfshekel: "The bekah alone is half a shekel.", north: "North, and King.", zionq: "Zion, and David.", lampstone: "The marked stone is on the right, low.", darktunnel: "Carry the lamp slowly along the whole wall, low and high.", siloamq: "Siloam, Sent, Seeing.", ascents: "Glad, house, feet, gates.", whose: "A memorial, not a grave; the priest, not the prophet.", bought: "400 shekels of silver; 100 pieces of money; 600 shekels of gold.", board: "Jerusalem.", wayup: "The small door." })[v.puzzle] || "Look at everything in the picture first.", "", 4600);
    const pz = scene.views.find((x) => x.puzzle && !W().done[scene.id + ":" + x.puzzle]);
    if (pz) return K.say("Something to do at “" + pz.cap.split(":")[0] + "”. Use the arrows to walk there.", "", 4200);
    K.say("This scene is done. Tap “Walk on” or the Map.", "", 3200);
  }

  /* tester tools: finish the current scene at once */
  function devSkip() {
    const nx = nextScene(); if (!nx) return false;
    if (nx.kept) return false;   // fsy.js handles its own
    W().done[nx.id] = 1; if (nx.page) W().pages[nx.page] = 1; save();
    map(); return true;
  }

  Lamp.fsyWalk = { map, go: (id, v) => go(byId[id], v), finish, journal, page, hint, devSkip, route: R, acts: ACTS, pages: PAGES, W, isDone, next: nextScene,
    /* what the kept puzzles call when they are done */
    keptDone(id) { finish(id, () => { const nx = R[byId[id].n]; if (nx) go(nx); else map(); }); },
    stats: () => st };
})();
