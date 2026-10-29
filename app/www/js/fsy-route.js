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
  /* hooks for the adventure layer (js/fsy-act1.js): people, money, items, rides, gates. Each is optional. */
  const H = {};
  const IMG = "img/fsy/w/";

  /* ------------------------------------------------------------ the journal: the Watchman's twelve pages ------------------------------------------------------------ */
  const PAGES = {
    1: { at: "airport", text: "If you are reading this, he gave you the book. Then he trusts you, and so must I. Do not believe what you are told about the Mount. Believe what you can see and measure: the stones lie to the careless, not to the patient. Begin where every pilgrim began: go up. Take the train from the airport to Jerusalem. When you come up out of the earth into the light, go to the market, where everything is weighed. Trust the man with the angel’s name, at the number of the verse where Messiah is cut off. Be wary of the man in grey.", ref: "" },
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
  S({ id: "airport", act: 1, title: "Ben Gurion Airport", kick: "Welcome to Israel", music: "m9", amb: "airport",
    views: [
      { id: "control", img: "passport-control", cap: "Passport control: a row of glass booths, and the queue moving slowly", go: { fwd: "hall" }, puzzle: "passport", who: ["officer"],
        hank: "Ben Gurion. Before anything else, the booth. Tell them the truth: you are going up." },
      { id: "hall", img: "airport-1", cap: "The arrivals hall at Ben Gurion, the journal in your bag", go: { back: "control", fwd: "signs" },
        hank: "Read the first page again before you go: it tells you the way.",
        hots: [{ box: [30, 70, 40, 25], label: "The Watchman’s journal", act: "readjournal" }] },
      { id: "signs", img: "airport-signs", cap: "Signs with a train on them, pointing down the escalator to the airport station", go: { back: "hall", fwd: "machine" },
        hank: "Trains, down the escalator. Down first, so you can go up." },
      { id: "machine", img: "airport-machine", cap: "The ticket machines at the airport station, and the ticket window beside them", go: { back: "signs" }, puzzle: "ticket", who: ["clerk"] },
    ] });
  S({ id: "train", act: 1, title: "The train to Jerusalem", kick: "Navon station", music: "m9", amb: "train",
    views: [
      { id: "board", img: "train-board", cap: "The platform at the airport station: flags down the hall, and the departures board on the pillar", hank: "Every pilgrim came up to Jerusalem. The word is always up, never down: the city sits on the mountains. Find your train.",
        go: { fwd: "platform" }, who: ["soldier"] },
      { id: "platform", img: "train-platform", cap: "The platform: the fast train to Jerusalem, its sign lit on the front", go: { back: "board", fwd: "navon" },
        hots: [{ box: [55, 20, 35, 40], label: "A man in a grey coat on the far platform", text: "On the far platform a man in a grey coat is reading something small, folded, blue at the edges. He looks up, straight at you, and then the train comes between you." }] },
      { id: "navon", img: "train-navon", cap: "Yitzhak Navon station, Jerusalem: the deep escalators up to the light", hank: "Eighty metres under the city. The escalators climb a long way, and at the top is Jerusalem.", go: { back: "platform" },
        hots: [{ box: [30, 15, 40, 30], label: "The light at the top", act: "navonLight" }] },
    ] });
  S({ id: "rail", act: 1, title: "The light rail", kick: "Jaffa Road", music: "m9", amb: "tram",
    views: [
      { id: "stop", img: "rail-1", cap: "The light rail on Jaffa Road: the way you will move through the city", hank: "The red line runs along Jaffa Road, from the station to the Old City. Every stop you earn, lights up on the map. Tap the map whenever you want to move.",
        go: { fwd: "inside" }, who: ["cardseller", "grandma"], hots: [{ box: [0, 60, 100, 25], label: "The tracks", text: "The tracks run straight down Jaffa Road to Jaffa Gate. The first stop is the market." }] },
      { id: "inside", img: "rail-2", cap: "On the tram, Jaffa Road: the city going past", go: { back: "stop", fwd: "machne" } },
      { id: "machne", img: "rail-3", cap: "The Mahane Yehuda stop: two trams, and the crowd heading for the market", go: { back: "inside" },
        hots: [{ box: [55, 30, 40, 45], label: "The crowd at the stop", text: "Everyone is getting off here. The market is just across the road, behind the shops." }] },
    ] });
  S({ id: "market", act: 1, title: "Machne Yehuda market", kick: "The shuk", music: "m10", amb: "market", page: 2,
    views: [
      { id: "street", img: "market-street", cap: "The main lane of the market, under its glass roof: sweets, spices, coffee, noise", hank: "Machne Yehuda. Everything in Jerusalem is weighed and argued over, and has been for three thousand years. Find the spice seller.",
        go: { fwd: "deeper", left: "bread", right: "juice" }, who: ["dudu", "grandma2"], hots: [{ box: [60, 10, 38, 50], label: "A grey coat in the crowd", text: "For a moment, between the stalls, a grey coat. Then only shoppers." }] },
      { id: "bread", img: "market-bread", cap: "Down another lane: round loaves stacked under a blue awning, trays of pastries opposite", go: { right: "street" }, who: ["baker"] },
      { id: "juice", img: "market-stall", cap: "A sweet stall: ice cream, fruit and toppings in rows of little tubs", go: { left: "street" }, hots: [{ box: [50, 50, 45, 22], label: "The fruit", text: "Mango, figs, pomegranate seeds, grapes: the fruits of the land. “A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey” (Deuteronomy 8:8)." }] },
      { id: "deeper", img: "market-deeper", cap: "Deeper in: baklava and halva on one side, oranges and pomegranates on the other", go: { back: "street", fwd: "spice", left: "coffee", right: "kaldron" }, who: ["halva"],
        hots: [{ box: [15, 30, 15, 10], label: "Rimon", text: "The sign says Rimon: Hebrew for pomegranate. “Upon the hem of it thou shalt make pomegranates of blue, and of purple, and of scarlet” (Exodus 28:33): the High Priest’s robe was hung with them." }] },
      { id: "coffee", img: "market-coffee", cap: "Tins of coffee beans, each with its handwritten card, and a scoop in every one", go: { right: "deeper" }, who: ["coffeeman"] },
      { id: "kaldron", img: "market-kaldron", cap: "Another lane: a bakery sign, dried fruit and nuts, shoppers with their trolleys", go: { left: "deeper", fwd: "fish" } },
      { id: "fish", img: "market-fish", cap: "A fish counter: smoked fish, herring and salads under the glass", go: { back: "kaldron" }, who: ["fishman"],
        hots: [{ box: [10, 30, 25, 50], label: "The fish", text: "“Cast the net on the right side of the ship, and ye shall find” (John 21:6). Galilee fishermen sold their catch in Jerusalem’s markets: one of the city’s gates was called the fish gate (Nehemiah 3:3)." }] },
      { id: "spice", img: "market-spice", cap: "The spice seller’s stall: bowls heaped with paprika, turmeric and herbs, and a balance on the counter", go: { back: "deeper" }, puzzle: "scales", who: ["yosef"],
        hots: [{ box: [10, 45, 80, 20], label: "The bowls of spice", text: "Paprika, turmeric, cumin, zaatar, hyssop. “Purge me with hyssop, and I shall be clean” (Psalm 51:7)." }] },
    ] });
  S({ id: "benyehuda", act: 1, title: "Ben Yehuda Street", kick: "Downtown", music: "m10", amb: "street",
    views: [
      { id: "street", img: "benyehuda-street", cap: "Ben Yehuda Street: cafe tables, strings of lights, and an old man playing the violin by the corner", hank: "Downtown, where the city shops. Somewhere near here is the man with the angel’s name. The page gave you the street and the number, if you can read it.",
        go: { fwd: "corner" }, who: ["violinist"] },
      { id: "corner", img: "grey-away", cap: "The corner of King George Street: a man in a grey coat comes out of a doorway twenty metres ahead and walks away without looking back", go: { back: "street" },
        hots: [{ box: [50, 20, 45, 60], label: "The doorway he came out of", act: "greyDoor" }] },
    ] });
  S({ id: "gabriel", act: 1, title: "Gabriel’s shop", kick: "King George Street", music: "m10", amb: "indoor", page: 3,
    views: [
      { id: "street", img: "gabriel-street", go: { fwd: "inside", right: "synagogue" }, cap: "Number 26, King George Street, by Ben Yehuda: GABRIEL in gold on the window, and menorahs behind the glass", hank: "Number twenty-six. A small souvenir shop, with a name in gold on the window. The owner is called Gabriel: the name of the angel who brought Daniel the seventy weeks." },
      { id: "inside", img: "gabriel-counter", cap: "Inside: the glass counter, shelves of menorahs and silver cups behind it, and the window onto the street", go: { back: "street", left: "shelf", right: "window" }, puzzle: "souvenir", who: ["gabriel"],
        hots: [{ box: [0, 50, 100, 40], label: "The counter", act: "shop" },
          { box: [45, 2, 40, 14], label: "The menorahs on the top shelf", text: "Brass menorahs, seven branches and nine, in every size. “Thou shalt make a candlestick of pure gold… six branches shall come out of the sides of it” (Exodus 25:31–32)." }] },
      { id: "window", img: "gabriel-inside", cap: "The window from inside: GABRIEL in gold on the glass, books and silver on the sill, a golden Ark on the top shelf", go: { left: "inside" },
        hots: [{ box: [40, 24, 20, 8], label: "The golden Ark", text: "A little golden model of the Ark of the Covenant, the cherubim facing each other on its lid, up on the top shelf. Remember it: you will see the real-size one at the Temple Institute." }] },
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
      { id: "temple", img: "model-temple", cap: "Close up from the east: the gate in the eastern wall, the Court of the Women behind it, and the sanctuary, white and gold", go: { back: "wide" }, puzzle: "modelq", who: ["guide"],
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
      { id: "burnt", img: "jewish-burnt", cap: "Down a stepped lane, a white doorway under a hanging sign: the Burnt House, Beit Katros, the house of a priestly family burned in the year 70", go: { right: "cardo" }, puzzle: "burnt",
        hots: [{ box: [60, 13, 20, 13], label: "The sign", text: "Beit Katros: the house of Kathros, a priestly family named in the Talmud, and found written on a stone weight in the ash here. The house lies below today’s street, under two metres of burnt debris." }] },
      { id: "wallsteps", img: "jewish-wallsteps", cap: "The wide steps down from the Jewish Quarter: the Western Wall plaza below, the Wall golden in the evening light", go: { back: "hurva" }, hank: "Down the steps, and there it is." },
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
      { id: "clear", img: "wallagain-clear", cap: "The same stretch of wall near Damascus Gate: the clouds breaking, sun on the wet stone, the way ahead open", hank: "The storm has passed. The way that was closed is open. Down to Damascus Gate.",
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
      { id: "steps", img: "bazaar-steps", cap: "Through the great gate: the street drops in wide steps into the bazaar, stalls on both sides", hank: "From Damascus Gate one street runs straight down the old valley, along the western side of the Mount, to the Wall. The Street of the Valley: HaGai, El Wad. It has been a market since the Romans.",
        go: { fwd: "stalls" } },
      { id: "stalls", img: "bazaar-stalls", cap: "The bazaar under its stone vaults: spices, sweets, scarves, lamps, the smell of coffee and cardamom", go: { back: "steps", fwd: "trader" },
        hots: [{ box: [0, 0, 50, 60], label: "The lamps", text: "Brass lamps, glass lamps, clay lamps like yours. “Thy word is a lamp unto my feet.”" }] },
      { id: "trader", img: "bazaar-trader", cap: "A trader’s stall: olive-wood carvings, a brass balance, a dish of old coins and weights, and a rolled map", go: { back: "stalls", fwd: "end" }, puzzle: "halfshekel" },
      { id: "end", img: "bazaar-end", cap: "The end of the street: the checkpoint, and the Western Wall plaza beyond. From here, the bus south to Hebron", go: { back: "trader" } },
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
      { id: "courtyard", img: "zion-courtyard", cap: "From the roof at sunset: the arched courtyard of the old building on Mount Zion, David’s Tomb below and the Upper Room above it", go: { back: "gatesign", fwd: "passage" },
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
      { id: "road", img: "siloam-road", cap: "The Pilgrim Road, dug out under the hill: the ancient stepped street climbing from the pool toward the Temple Mount, lamps along the steel supports", go: { back: "pool" },
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

  /* ------------------------------------------------------------ the map: Richard's two painted maps ------------------------------------------------------------ */
  /* where each place sits on the paintings, in % of the picture (x, y). "city" = the wide map, "old" = the Old City. */
  const PIN = {
    airport: ["city", 30, 9, "← Ben Gurion Airport, 45 km west"], train: ["city", 13, 24], model: ["city", 19, 41], market: ["city", 42, 34],
    rail: ["city", 49, 45], benyehuda: ["city", 42, 48], gabriel: ["city", 37, 50],
    jaffa: ["old", 13, 31], ramparts: ["old", 19, 21], wallagain: ["old", 47, 15], gtomb: ["old", 54, 7], bazaar: ["old", 49, 26],
    jewish: ["old", 31, 37], institute: ["old", 33, 45], wall: ["old", 44, 42], wilson: ["old", 49, 37], tunnels: ["old", 53, 29],
    hebron: ["old", 50, 96, "↓ Hebron, 30 km south"], zion: ["old", 15, 52], cod: ["old", 61, 57], gihon: ["old", 70, 63],
    hezekiah: ["old", 63, 72], siloam: ["old", 63, 81], steps: ["old", 62, 48], dung: ["old", 45, 48],
    egate: ["old", 80, 32], kidron: ["old", 83, 54], prophets: ["old", 90, 45], olives: ["old", 92, 12], gethsemane: ["old", 94, 28],
    mughrabi: ["old", 55, 43], mount: ["old", 64, 34], gate: ["old", 76, 38]
  };
  let sheet = null;
  function map(which) {
    F.cur("walk"); F.M("theme");
    const w = W(), nx = nextScene(), pages = Object.keys(w.pages).length;
    const at = byId[w.at] || nx || R[0];
    sheet = typeof which === "string" ? which : (PIN[(nx || at).id] || ["old"])[0];
    const pins = R.filter((s) => PIN[s.id] && PIN[s.id][0] === sheet).map((s) => {
      const [, x, y, far] = PIN[s.id], d = isDone(s.id), open = canOpen(s), here = nx && nx.id === s.id, you = at.id === s.id;
      return '<button class="fpin' + (d ? " done" : "") + (here ? " here" : "") + (you ? " you" : "") + (!open && !d ? " locked" : "") + (far ? " far" : "") +
        '" data-s="' + s.id + '" style="left:' + x + "%;top:" + y + '%" aria-label="' + esc(s.title) + '">' +
        (far ? "<em>" + esc(far) + "</em>" : "<i>" + (d ? "✓" : s.n) + "</i>") + (here ? "<span>Next: " + esc(s.title) + "</span>" : "") + "</button>";
    }).join("");
    let h = '<div class="fkick">The Final Seven Years · Episode 1</div><h1>The Jerusalem Mystery</h1>' +
      '<div class="fsub">' + (nx ? "Next: " + esc(nx.title) + " · scene " + nx.n + " of " + R.length : "Episode 1 solved") + "</div>" +
      '<div class="fmaptabs"><button data-sheet="city"' + (sheet === "city" ? ' class="on"' : "") + '>Jerusalem</button><button data-sheet="old"' + (sheet === "old" ? ' class="on"' : "") + ">The Old City</button></div>" +
      '<div class="fmap"><img src="' + IMG + "map-" + sheet + '.jpg" alt="Painted map of ' + (sheet === "old" ? "the Old City of Jerusalem" : "Jerusalem") + '" draggable="false">' + pins +
      (sheet === "city" ? '<button class="fpin far" data-sheet="old" style="left:72%;top:62%"><em>The Old City ›</em></button>' : "") + "</div>" +
      '<div class="fmapkey"><span><i class="k here"></i>Next</span><span><i class="k done">✓</i>Done</span><span><i class="k locked"></i>Not yet</span></div>' +
      '<div class="fwtools"><button class="fwtool" data-j="1">' + journalIcon() + " Journal · " + pages + "/12</button><button class=\"fwtool\" data-b=\"1\">" + bagIcon() + " Backpack</button><button class=\"fwtool\" data-list=\"1\">All places</button></div>" +
      (nx ? "" : '<button class="fbtn" id="fend">What comes next</button>');
    const el = F.stage(h, "temple-painting.jpg");
    { const t = document.getElementById("adv-ttl"); if (t) { t.textContent = ""; t.onclick = null; } }   /* the map has its own heading: no place name on top of it */
    el.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => {
      const s = byId[b.dataset.s]; K.sfx("click");
      if (!canOpen(s) && !isDone(s.id)) { K.say(s.title + ": first finish “" + nx.title + "”.", "", 2800); return; }
      go(s);
    }));
    el.querySelectorAll("[data-sheet]").forEach((b) => (b.onclick = () => { K.sfx("click"); map(b.dataset.sheet); }));
    el.querySelector("[data-j]").onclick = () => journal();
    el.querySelector("[data-b]").onclick = () => { K.sfx("click"); backpack(); };
    el.querySelector("[data-list]").onclick = () => { K.sfx("click"); list(); };
    const en = $("fend"); if (en) en.onclick = F.ending;
  }
  /* the plain list of all 32 places, by act */
  function list() {
    const nx = nextScene();
    let h = '<div class="kick">Episode 1</div><h2>All places</h2><div class="fline">';
    ACTS.forEach((a) => {
      h += '<div class="fact"><b>Act ' + a.n + " · " + esc(a.title) + "</b><small>" + esc(a.sub) + "</small></div>";
      R.filter((s) => s.act === a.n).forEach((s) => {
        const d = isDone(s.id), open = canOpen(s), here = nx && nx.id === s.id;
        h += '<button class="fstop' + (d ? " done" : "") + (here ? " here" : "") + (!open && !d ? " locked" : "") + (s.optional ? " opt" : "") + '" data-act="' + s.id + '"><i>' + (d ? "✓" : s.n) + "</i><span><b>" + esc(s.title) + "</b><small>" + esc(s.kick) + (s.optional ? " · optional" : "") + "</small></span></button>";
      });
    });
    const acts = { x: () => {} };
    R.forEach((s) => (acts[s.id] = () => { if (!canOpen(s) && !isDone(s.id)) { K.say(s.title + ": first finish “" + nx.title + "”.", "", 2800); return; } go(s); }));
    K.card(h + '</div><button class="cta alt" data-act="x">Back to the map</button>', acts);
  }
  function bagIcon() { return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 8h12l-1 13H7L6 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'; }
  /* ------------------------------------------------------------ the backpack: everything you are carrying ------------------------------------------------------------ */
  function backpack() {
    const w = W(), p = F.P(), pages = Object.keys(w.pages).length; let relics = {};
    try { relics = (K.A && K.A().relics) || {}; } catch (e) { relics = {}; }
    const items = (H.items ? H.items() : []).concat([
      [pages > 0, "The Watchman’s journal", pages + " of 12 pages. Tap Journal to read them."],
      [w.flags.ticket, "A train ticket", "Ben Gurion Airport → Jerusalem – Yitzhak Navon."],
      [w.flags.bekah, "A bekah", "A small stone weight from the spice seller: half a shekel of the sanctuary."],
      [w.done["gabriel:souvenir"], "A model of the Third Temple", "From Gabriel’s shop. A small lamp drawn in blue ink on its base."],
      [p.ti && p.ti.postcard, "A postcard", "From the Temple Institute."],
      [p.flax, "A line of flax", "From the Tombs of the Prophets, knotted at every cubit."],
      [w.flags.lit, "Your oil lamp", "Filled with oil at the Gihon Spring."],
      [relics.reed, "A measuring reed", "Six long cubits, for measuring on the Mount."],
    ]).filter((x) => x[0]);
    K.card('<div class="kick">Your backpack</div><h2>' + items.length + " thing" + (items.length === 1 ? "" : "s") + "</h2>" + (H.money ? H.money() : "") +
      '<div class="fbag">' + items.map((x) => "<div><b>" + esc(x[1]) + "</b><small>" + esc(x[2]) + "</small></div>").join("") + "</div>" +
      '<button class="cta alt" data-act="j">Open the journal</button><button class="cta" data-act="x">Close</button>', { j: journal, x: () => {} });
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
      (H.journal ? H.journal() : "") +
      '<button class="cta" data-act="x">Close the journal</button>', Object.assign({ x: () => {} }, H.journalActs ? H.journalActs() : {}));
  }

  /* ------------------------------------------------------------ walking a scene ------------------------------------------------------------ */
  let scene = null, view = null;
  const V = (id) => scene.views.find((x) => x.id === id) || scene.views[0];
  function go(s, vid) {
    if (H.gate && H.gate(s, scene) === false) return;
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
  /* What you are looking for in each place: shown above the picture until the place is done, so you are never walking blind */
  const TASK = {
    airport: "Passport control first. Then read the first page of the journal. Then follow the train signs and buy a ticket to Jerusalem.",
    train: "Board the train, and come up out of the station into Jerusalem. The soldier on the platform is going home.", rail: "Take the light rail to Machne Yehuda market.",
    market: "Find the spice seller and weigh. Then find out what the Watchman left here.", benyehuda: "Find number 26 King George Street. The violinist knows, if you know the number.", gabriel: "Show Gabriel the journal. Buy what you will need for the Old City, and choose a souvenir.",
    model: "Walk round the model. Answer the guide’s questions, and ask her about the Watchman.", jaffa: "Go in through the gate and find the way up onto the wall.",
    ramparts: "Walk the wall. Count the towers, and watch the sky.", jewish: "Walk through the Quarter to the Burnt House.",
    wall: "Go down to the Wall. Look at every side of the plaza.", wilson: "Go into the prayer hall. Find the shaft and look down it.",
    tunnels: "Follow the Wall underground. Measure the great stone, and read the sign.", wallagain: "Back on the wall. Follow it down to Damascus Gate.",
    gtomb: "Find the skull, then the tomb. Roll the stone.", bazaar: "Down the bazaar street. Find the trader and pay him.",
    hebron: "Go inside. Find Abraham, and what he paid.", zion: "Caiaphas’s pit, then David’s Tomb. Find the psalm on the wall.",
    cod: "Find the sign about the Ark, and work out where Zion was.", gihon: "Go down to the spring. Look along the rock.",
    hezekiah: "Light your lamp and go in.", siloam: "Come out of the tunnel at the pool and look at it.",
    steps: "Climb the steps, then round the corner to the fallen stones.", dung: "Go out by the gate and down the road. Find the man.",
    egate: "Up the steps between the graves. Go up to the gate.", kidron: "Down in the valley. Whose tomb is it?",
    gethsemane: "Walk among the trees. Find the oldest one and look in the hollow.", mughrabi: "Up the ramp. Find the man by the arcade."
  };
  function walk(v) {
    if (H.before && H.before(scene, v, view) === false) return;
    view = v; F.cur("walk"); F.M(scene.music, scene.amb);
    const w = W(), done = isDone(scene.id), pz = v.puzzle && PUZZLES[v.puzzle], pzDone = pz && w.done[scene.id + ":" + v.puzzle];
    const nx = R[scene.n] || null, prev = R[scene.n - 2] || null;
    const pic = v.img ? '<img class="fwimg" draggable="false" src="' + IMG + v.img + '.jpg" alt="' + esc(v.cap) + '">' : placeholder(v);
    const hots = (v.hots || []).map((h, i) => '<button class="fhit fwhot" data-h="' + i + '" aria-label="' + esc(h.label) + '" style="left:' + h.box[0] + "%;top:" + h.box[1] + "%;width:" + h.box[2] + "%;height:" + h.box[3] + '%"><span></span></button>').join("");
    const g = v.go || {};
    const task = done ? (nx ? "Done here. Walk on to " + nx.title + "." : "Done here.") + ((H.side && H.side(scene)) || "") : ((H.task && H.task(scene)) || TASK[scene.id] || "Look at everything here.");
    /* Riven-style: one fixed screen. The picture fills the space between the task line and the bar; nothing scrolls. */
    const el = F.stage('<div class="fwalk">' +
      '<div class="fwbg" style="background-image:url(' + (v.img ? IMG + v.img + ".jpg" : "img/fsy/temple-painting.jpg") + ')"></div>' +
      '<button class="fwtask' + (done ? " done" : "") + '" id="fwtask"><span>' + (done ? "✓ " : "") + esc(task) + "</span></button>" +
      '<div class="fwarea" id="fwarea"><div class="fwview" id="fwv">' + pic + hots + arrow("fwd", g.fwd) + arrow("left", g.left) + arrow("right", g.right) + arrow("back", g.back) +
        (pz && !pzDone ? '<button class="fwpz" id="fwpz">' + esc(pz.label) + "</button>" : "") +
        (H.people ? H.people(scene, v) : "") +
        (v.hank ? '<button class="fwlamp" id="fwlamp" aria-label="What the Lamplighter said">' + lampIcon() + "</button>" : "") +
        '<div class="fwsub" id="fwsub" aria-live="polite"></div>' +
      "</div></div>" +
      '<nav class="fwbar"><button class="fwtool" data-j="1">' + journalIcon() + '<span>Journal</span></button><button class="fwtool" data-b="1">' + bagIcon() + '<span>Backpack</span></button><button class="fwtool" data-m="1">' + mapIcon() + "<span>Map</span></button>" +
        (done && nx ? '<button class="fwtool go" data-n="1">' + walkIcon() + "<span>Walk on</span></button>" : "") +
        (!done && scene.optional && nx ? '<button class="fwtool" data-n="1">' + walkIcon() + "<span>Skip it</span></button>" : "") + "</nav>" +
      "</div>", null);
    el.classList.add("walking");
    const ttl = document.getElementById("adv-ttl"); if (ttl) { ttl.textContent = scene.title; ttl.onclick = () => K.say(v.cap || scene.title, "", 4000); }
    fitView(el);
    $("fwtask").onclick = () => { K.sfx("click"); $("fwtask").classList.toggle("open"); };
    const firstTime = v.hank && !w.flags["said:" + scene.id + ":" + v.id];
    if (v.hank) { $("fwlamp").onclick = () => { K.sfx("click"); subtitles(v.hank); }; if (firstTime) setTimeout(() => subtitles(v.hank), 450); }
    if (v.hank && !w.flags["said:" + scene.id + ":" + v.id]) { w.flags["said:" + scene.id + ":" + v.id] = 1; save(); F.V("w-" + scene.id + "-" + v.id); }
    /* a scene with nothing to solve is finished once every viewpoint has been seen */
    w.flags["seen:" + scene.id + ":" + v.id] = 1; save();
    if (!done && !scene.views.some((x) => x.puzzle) && scene.views.every((x) => w.flags["seen:" + scene.id + ":" + x.id])) { setTimeout(() => K.root() && finish(scene.id), 600); return; }
    el.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { F.S("step", "click", 0.5); walk(scene.views.find((x) => x.id === b.dataset.go)); }));
    el.querySelectorAll("[data-h]").forEach((b) => (b.onclick = () => { const h = v.hots[+b.dataset.h]; K.sfx("click"); if (h.act) ACTS_FN[h.act](h); else K.card('<div class="kick">' + esc(scene.title) + "</div><h2>" + esc(h.label) + "</h2><p>" + esc(h.text) + '</p><button class="cta" data-act="x">Back</button>', { x: () => {} }); }));
    el.querySelector("[data-j]").onclick = journal;
    el.querySelector("[data-b]").onclick = () => { K.sfx("click"); backpack(); };
    el.querySelector("[data-m]").onclick = () => { K.sfx("click"); map(); };
    const n = el.querySelector("[data-n]"); if (n) n.onclick = () => { K.sfx("click"); go(nx); };
    const pb = $("fwpz"); if (pb) pb.onclick = () => { K.sfx("click"); pz.run(); };
    fullscreen(el.querySelector(".fwimg"));
    if (H.wire) H.wire(el, scene, v);
    if (v.note && !w.flags["note:" + scene.id + ":" + v.id]) { w.flags["note:" + scene.id + ":" + v.id] = 1; save(); v.note(); }
  }
  /* size the picture box to the picture, as large as the space allows, so hotspots stay on their marks */
  function fitView(el) {
    const area = el.querySelector("#fwarea"), box = el.querySelector("#fwv"), img = box && box.querySelector(".fwimg");
    let pan = null;
    const fit = () => {
      if (!K.root() || !area.isConnected) return;
      const cs = getComputedStyle(area), aw = area.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), ah = area.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const r = img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : 3 / 4;
      if (r > (aw / ah) * 1.2) {
        /* a wide picture: fill the height and drag left and right to look around (the hotspots move with it) */
        area.classList.add("pan");
        const ah2 = area.clientHeight, aw2 = area.clientWidth, w = Math.round(ah2 * r);
        box.style.width = w + "px"; box.style.height = ah2 + "px";
        el.querySelectorAll("#fwv > .farrow, #fwv > .fwlamp, #fwv > .fwho, #fwv > .fwsub, #fwv > .fwpz").forEach((x) => area.appendChild(x));
        const max = Math.max(0, w - aw2);
        if (!pan) { pan = { x: -max / 2, max }; startPan(); hintPan(); } else pan.max = max;
        pan.x = Math.max(-pan.max, Math.min(0, pan.x)); box.style.transform = "translateX(" + pan.x + "px)";
      } else {
        let w = aw, h = aw / r; if (h > ah) { h = ah; w = ah * r; }
        box.style.width = Math.round(w) + "px"; box.style.height = Math.round(h) + "px";
      }
    };
    function startPan() {
      let x0 = null, start = 0, moved = 0;
      box.addEventListener("pointerdown", (e) => { x0 = e.clientX; start = pan.x; moved = 0; });
      box.addEventListener("pointermove", (e) => {
        if (x0 === null) return; const dx = e.clientX - x0; moved = Math.max(moved, Math.abs(dx));
        if (moved > 6) { pan.x = Math.max(-pan.max, Math.min(0, start + dx)); box.style.transform = "translateX(" + pan.x + "px)"; }
      });
      const end = () => { x0 = null; };
      box.addEventListener("pointerup", end); box.addEventListener("pointercancel", end);
      box.addEventListener("click", (e) => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
    }
    function hintPan() {
      const t = document.createElement("div"); t.className = "fpanhint"; t.textContent = "‹  drag to look around  ›"; area.appendChild(t);
      setTimeout(() => t.classList.add("off"), 2600); setTimeout(() => t.remove(), 3400);
    }
    /* decide only once the picture's real shape is known, or a tall picture can be mistaken for a wide one */
    if (img && !(img.complete && img.naturalWidth)) img.addEventListener("load", fit, { once: true }); else fit();
    window.addEventListener("resize", fit, { once: true });
  }
  /* the Lamplighter's words as film subtitles: two short lines at a time; tap for the next; they fade when done */
  let subT = null;
  function subtitles(text) {
    const box = $("fwsub"); if (!box) return;
    const parts = []; let cur = "";
    text.split(/(?<=[.!?:;])\s+/).forEach((sent) => { if ((cur + " " + sent).trim().length > 110 && cur) { parts.push(cur.trim()); cur = sent; } else cur = (cur + " " + sent).trim(); });
    if (cur) parts.push(cur);
    let i = 0;
    const show = () => {
      clearTimeout(subT);
      if (i >= parts.length || !box.isConnected) { box.classList.remove("on"); return; }
      box.innerHTML = "<span>" + esc(parts[i]) + "</span>" + (parts.length > 1 ? "<small>" + (i + 1) + "/" + parts.length + (i < parts.length - 1 ? " ›" : "") + "</small>" : "");
      box.classList.add("on");
      subT = setTimeout(() => { i++; show(); }, Math.max(3800, parts[i].length * 62));
    };
    box.onclick = (e) => { e.stopPropagation(); i++; show(); };
    show();
  }
  const lampIcon = () => '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 14c0-2 3-3 7-3h6c2 0 3 1 4 2l-3 1c-2 2-5 3-8 3-3 0-6-1-6-3z" fill="currentColor"/><path d="M19 13c1-3 0-6-1-8 2 2 3 5 1 8z" fill="#FFD27A"/></svg>';
  const mapIcon = () => '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14 M15 6v14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  const walkIcon = () => '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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
    const nx = R[s.n] || null;
    /* every place ends with a clear "done" card, so there is never any doubt that the task is finished */
    const doneCard = () => {
      if (!first) return after();
      F.S("harp", null, 0.7); K.buzz("success");
      const left = R.filter((x) => !w.done[x.id] && !x.optional).length;
      K.card('<div class="kick">Act ' + s.act + " · " + esc(s.title) + '</div><h2>✓ Done here</h2>' +
        "<p>" + esc(s.title) + " is finished. " + (left ? left + " place" + (left === 1 ? "" : "s") + " left in Episode 1." : "That was the last place.") + "</p>" +
        (nx ? '<button class="cta" data-act="n">Walk on › ' + esc(nx.title) + "</button>" : "") +
        '<button class="cta alt" data-act="x">Look around here first</button>', { n: () => go(nx), x: after });
    };
    if (s.page && first) page(s.page, doneCard); else doneCard();
  }
  function pzDone(key, then) { const w = W(); w.done[scene.id + ":" + key] = 1; save(); then(); }

  /* ------------------------------------------------------------ small puzzle makers ------------------------------------------------------------ */
  function screen(title, kick, html, bg) {
    F.M("puzzle", scene.amb);
    const k = kick || scene.title, el = F.stage((k === scene.title ? "" : '<div class="fkick">' + esc(k) + "</div>") + "<h1>" + esc(title) + "</h1>" + html + F.back("Back to " + scene.title), bg ? "w/" + bg + ".jpg" : "temple-painting.jpg");
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
  /* a real brass balance (Richard's drawings): drag the stone weights onto the right pan; the beam tips by weight */
  const PZ = "img/fsy/pz/";
  function weigh(o) {
    const on = new Set(); const ws = o.weights;
    const el = screen(o.title, o.kick, (o.intro || "") + (o.q ? q(o.q) : "") +
      '<div class="fscale" id="fscale" style="--tilt:0deg">' + (o.bg ? '<img class="fscalebg" src="' + PZ + o.bg + '.jpg" alt="">' : "") +
        '<img class="fsc-stand" src="' + PZ + 'bal-stand.png" alt="">' +
        '<div class="fsc-beam"><img src="' + PZ + 'bal-beam.png" alt="">' +
          '<div class="fsc-hang l"><img class="fsc-pan" src="' + PZ + 'bal-pan.png" alt=""><div class="fsc-load" id="fload-l"><span class="fsc-stone"><img src="img/fsy/pz/weight-2.png" alt=""><b>' + esc(o.left) + '</b></span></div></div>' +
          '<div class="fsc-hang r"><img class="fsc-pan" src="' + PZ + 'bal-pan.png" alt=""><div class="fsc-load" id="fload-r"></div></div></div>' +
        '<div class="fsc-read" id="fread">' + o.target + " " + esc(o.unit) + ' · <span id="fsum">0</span> ' + esc(o.unit) + "</div></div>" +
      '<div class="fsc-tray" id="ftray">' + ws.map((w, i) => '<button class="fsc-w" data-i="' + i + '" aria-label="' + esc(w[0]) + ", " + w[1] + " " + esc(o.unit) + '"><img src="' + PZ + (w[2] || "weight-" + Math.min(5, i + 1)) + '.png" alt=""><small>' + w[1] + "</small></button>").join("") + "</div>" +
      '<button class="fbtn" id="fweigh">' + esc(o.btn || "Weigh") + "</button>", null);
    const sum = () => [...on].reduce((a, i) => a + ws[i][1], 0);
    const draw = () => {
      const d = sum() - o.target; $("fsum").textContent = sum();
      $("fscale").style.setProperty("--tilt", (Math.max(-9, Math.min(9, d * 0.9))) + "deg");
      $("fload-r").innerHTML = [...on].map((i) => '<button class="fsc-on" data-off="' + i + '"><img src="' + PZ + (ws[i][2] || "weight-" + Math.min(5, i + 1)) + '.png" alt=""></button>').join("");
      el.querySelectorAll("[data-i]").forEach((b) => b.classList.toggle("used", on.has(+b.dataset.i)));
      el.querySelectorAll("[data-off]").forEach((b) => (b.onclick = () => { on.delete(+b.dataset.off); F.S("dial", "click", 0.4); draw(); }));
    };
    el.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => { const i = +b.dataset.i; if (on.has(i)) on.delete(i); else on.add(i); F.S("step", "click", 0.5); K.buzz && K.buzz("tap"); draw(); }));
    let solved = false;
    $("fweigh").onclick = () => { if (solved) return; if (sum() !== o.target) { wrong(sum() < o.target ? o.light || "Too light. Add more." : o.heavy || "Too heavy. Take some off."); return; } solved = true; F.S("lock", null, 0.6); K.buzz("success"); $("fscale").classList.add("level"); setTimeout(() => K.root() && o.done(), 700); };
    draw();
  }
  /* a brass combination lock (Richard's case and wheel): roll each wheel with your thumb.
     faces: what shows on the wheels (numbers 0..max, or words); v: the current positions; onTurn(i) after a turn */
  function lockUI(o) {
    const faces = o.faces, n = faces.length, v = o.v;
    const html = '<div class="flock"><img class="flock-case" src="' + PZ + 'lock-case.jpg" alt="A wooden case with a brass lock of three wheels">' +
      '<div class="flock-wheels">' + v.map((_, i) => '<div class="flock-win" data-w="' + i + '" role="slider" aria-label="Wheel ' + (i + 1) + '"><div class="flock-roll" id="froll' + i + '"></div><img class="flock-wheel" src="' + PZ + 'lock-wheel.png" alt=""></div>').join("") + "</div></div>" + (o.words ? '<div class="flock-read">' + v.map((_, i) => '<span id="fword' + i + '"></span>').join("") + "</div>" : "");
    const face = (x) => o.words ? String(faces[x]).slice(0, 1) : String(faces[x]);
    const wire = (el) => {
      const draw = (i) => { const r = $("froll" + i); if (r) r.innerHTML = [-1, 0, 1].map((d) => "<b" + (d ? ' class="dim"' : "") + ">" + esc(face((v[i] + d + n) % n)) + "</b>").join(""); const w = $("fword" + i); if (w) w.textContent = faces[v[i]]; };
      el.querySelectorAll("[data-w]").forEach((w) => {
        const i = +w.dataset.w; let y0 = null, acc = 0, moved = 0;
        const step = (d) => { v[i] = (v[i] + d + n) % n; F.S("dial", "click", 0.45); draw(i); o.onTurn && o.onTurn(i); };
        w.addEventListener("pointerdown", (e) => { y0 = e.clientY; acc = 0; moved = 0; w.setPointerCapture(e.pointerId); e.preventDefault(); });
        w.addEventListener("pointermove", (e) => { if (y0 === null) return; acc += e.clientY - y0; moved += Math.abs(e.clientY - y0); y0 = e.clientY; while (acc > 16) { step(-1); acc -= 16; } while (acc < -16) { step(1); acc += 16; } });
        w.addEventListener("pointerup", (e) => { if (y0 !== null && moved < 5) step(e.offsetY < w.clientHeight / 2 ? 1 : -1); y0 = null; });
        w.addEventListener("pointercancel", () => (y0 = null));
        draw(i);
      });
    };
    return { html, wire };
  }
  function dials(o) {
    const v = o.answer.map(() => 0), L = lockUI({ faces: o.faces || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], v });
    const el = screen(o.title, o.kick, (o.intro || "") + (o.q ? q(o.q) : "") + L.html + '<button class="fbtn" id="ftry">' + esc(o.btn || "Try the lock") + "</button>", null);
    L.wire(el);
    let solved = false;
    $("ftry").onclick = () => { if (solved) return; if (v.join() !== o.answer.join()) { wrong(o.no || "The lock does not turn."); return; } solved = true; F.S("lock", null, 0.7); K.buzz("success"); setTimeout(() => K.root() && o.done(), 600); };
  }
  /* name the parts of a photograph: tap (or drag) a label, then tap where it goes. Optional last step: put the sunrise where it belongs. */
  function labels(o) {
    const placed = {}, all = o.spots.concat(o.sun ? [Object.assign({ id: "sun" }, o.sun)] : []);
    let pick = null;
    const el = screen(o.title, o.kick, (o.intro || "") +
      '<div class="flab" id="flab"><img draggable="false" src="' + IMG + o.img + '.jpg" alt="">' +
        all.map((x) => '<button class="flab-pin' + (x.id === "sun" ? " sun" : "") + '" data-p="' + x.id + '" style="left:' + x.at[0] + "%;top:" + x.at[1] + '%" aria-label="A place on the model"><i>?</i></button>').join("") + "</div>" +
      '<div class="flab-chips" id="flabc">' + F.shuffle(all.slice()).map((x) => '<button data-l="' + x.id + '">' + (x.id === "sun" ? "☀ " : "") + esc(x.label) + "</button>").join("") + "</div>" +
      '<div class="fsmall" id="flabn">Tap a name, then tap the ? where it belongs.</div>', null);
    const chips = () => el.querySelectorAll("[data-l]"), pins = () => el.querySelectorAll("[data-p]");
    const sel = (id) => { pick = id; chips().forEach((c) => c.classList.toggle("on", c.dataset.l === id)); };
    const left = () => all.filter((x) => !placed[x.id]).length;
    const put = (pid) => {
      if (!pick || placed[pid]) return;
      const spot = all.find((x) => x.id === pid), lab = all.find((x) => x.id === pick);
      if (pid !== pick) { wrong((o.wrongs && o.wrongs[pick]) || (pick === "sun" ? "Where did the house face?" : "Not there. Look again.")); return; }
      placed[pid] = 1; F.S("parchment", "click"); K.buzz && K.buzz("success");
      const pin = el.querySelector('[data-p="' + pid + '"]'); pin.classList.add("ok"); pin.innerHTML = "<i>✓</i><span>" + esc(lab.label) + "</span>";
      el.querySelector('[data-l="' + pick + '"]').remove(); sel(null);
      K.say(spot.why, "", 4200);
      $("flabn").textContent = left() ? left() + " left." : "";
      if (!left()) setTimeout(() => K.root() && o.done(), 1400);
    };
    chips().forEach((c) => {
      c.onclick = () => { K.sfx("click"); sel(pick === c.dataset.l ? null : c.dataset.l); };
      c.addEventListener("pointerdown", () => sel(c.dataset.l));
    });
    pins().forEach((p) => (p.onclick = () => put(p.dataset.p)));
    /* dragging a chip onto a pin works too */
    el.addEventListener("pointerup", (e) => { if (!pick) return; const t = document.elementFromPoint(e.clientX, e.clientY); const p = t && t.closest && t.closest("[data-p]"); if (p && el.contains(p)) put(p.dataset.p); });
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
    const pic = o.img ? '<img draggable="false" src="' + (o.img.startsWith("pz:") ? PZ + o.img.slice(3) : IMG + o.img) + '.jpg" alt="">' : '<div class="fph ' + (o.dark ? "dark" : "grid") + '" style="--h:' + ((scene.n * 37) % 360) + '"><b>' + esc(o.title) + "</b><span>" + esc(o.scene || "") + "</span></div>";
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
    passport: { label: "Step up to the booth", run: () => {
      /* her clip stops after each question, at the pauses in her speech, and plays on when you answer */
      const SEG = [[0, 4.4], [4.4, 8.0], [8.0, 14.0], [14.0, 999]];   /* her lines: passport please / where are you going / open the backpack / the book */
      const ASK = [
        { q: "She holds out her hand", a: [["Hand over your passport", 1]] },
        { q: "Your answer", a: [["Up, to Jerusalem", 1], ["Down to Tel Aviv, by the sea", 0, "She waits, unimpressed. The first page in your bag says otherwise: go up."], ["I don’t know yet", 0, "“You don’t know where you are going?” She waits. Page 1 knows."]] },
        { q: "She points at your backpack", a: [["Open the backpack", 1]] },
      ];
      const el = screen("Passport control", "Ben Gurion Airport", '<div class="fclipbig"><video id="foff" src="video/fsy/officer.mp4" poster="video/fsy/officer.jpg" playsinline preload="auto"></video><button class="fplay" id="fplay" aria-label="Play">▶</button></div><div id="fans" class="fans"></div>', null);
      void el;
      const v = $("foff"); let k = 0, stopAt = 0;
      const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => ($("fplay").style.display = "grid")); };
      $("fplay").onclick = () => { $("fplay").style.display = "none"; tryPlay(); };
      v.addEventListener("timeupdate", () => { if (stopAt && v.currentTime >= stopAt) { stopAt = 0; v.pause(); answer(); } });
      v.addEventListener("ended", () => { if (stopAt) { stopAt = 0; answer(); } });
      const play = () => { $("fans").innerHTML = '<div class="fsmall">…</div>'; const [a, b] = SEG[k]; stopAt = b >= 999 && v.duration ? v.duration - 0.2 : b; if (Math.abs(v.currentTime - a) > 0.3) v.currentTime = a; tryPlay(); };
      function answer() {
        const A = ASK[k]; if (!A) return bag();   /* after the fourth line */
        $("fans").innerHTML = '<div class="fq">' + esc(A.q) + '</div><div class="fchoices">' + A.a.map((x, i) => '<button data-a="' + i + '">' + esc(x[0]) + "</button>").join("") + "</div>";
        $("fans").querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => {
          const x = A.a[+b.dataset.a];
          if (!x[1]) { wrong(x[2]); return; }
          K.sfx("click"); k++;
          if (k < SEG.length) play(); else bag();   /* the last segment, her question about the book, ends in bag() */
        }));
      }
      function bag() {
        $("fans").innerHTML = "";
        K.card('<div class="kick">Passport control</div><h2>“Where did you get this book?”</h2><p>She lifts the journal out of your backpack, turns it over, and stops. On the cover, small, in blue ink: a drawn lamp.</p>' +
          '<div class="fsay"><button data-act="a">“A man gave it to me this morning.”</button><button data-act="a">“It’s mine.”</button><button data-act="a">“I found it.”</button></div>',
          { a: () => K.card('<div class="kick">Passport control</div><h2>The lamp on the cover</h2><div class="fhim">She is quiet for a moment. “A man in a grey coat came through this morning. He asked whether anyone had come in carrying a book with a lamp on it.” She slides the journal back into your bag. “I told him nothing.”</div>' +
            '<button class="cta" data-act="x">“Thank you.”</button>', { x: stamp }) });
      }
      function stamp() {
        F.S("stamp", null, 0.9);
        K.card('<div class="kick">Passport control</div><h2>✓ Through</h2>' + (H.clip ? H.clip("officer-stamp") : "") +
          "<p>She stamps a small blue entry slip and slides it under the glass with your passport. Israel no longer stamps the passport itself: the slip is your way out of the hall. It goes into your backpack.</p>" +
          '<button class="cta" data-act="x">Into the arrivals hall</button>',
          { x: () => { W().flags.passport = 1; save(); if (H.give) H.give("slip", true); pzDone("passport", () => walk(V("hall"))); } });
      }
      play();
    } },
    ticket: { label: "Buy a ticket", run: () => {
      /* three steps: the machine speaks only Hebrew; the wall map shows which station is "up"; pay exactly 17 in coins */
      /* the station-wall poster (Richard's painting, Oct 29): the line seen from above, and its height profile below */
      const ST = [
        { he: "תל אביב - סבידור מרכז", en: "Tel Aviv – Savidor", at: [20.0, 21.2], pf: [13.9, 93.8], h: "≈ 10 m", side: "right", no: "By the sea, at the very bottom of the profile. The page says up." },
        { he: "פאתי מודיעין", en: "Pa’atei Modi’in", at: [47.8, 34.7], pf: [47.6, 92.7], h: "≈ 150 m", side: "right", no: "Only the foot of the hills. Look at the profile under the map: the line keeps climbing." },
        { he: "מודיעין מרכז", en: "Modi’in Central", at: [64.8, 43.3], pf: [68.7, 86.5], h: "≈ 250 m", side: "left", no: "Halfway up, not the top. The profile shows one station higher than this." },
        { he: "נמל התעופה בן גוריון", en: "Ben Gurion Airport", at: [31.4, 26.1], pf: [28.9, 93.8], h: "≈ 40 m", side: "right", no: "That is where you are standing." },
        { he: "ירושלים - יצחק נבון", en: "Jerusalem – Yitzhak Navon", at: [86.8, 52.0], pf: [87.7, 81.2], h: "≈ 800 m", side: "left" },
      ];
      const order = [3, 0, 4, 2, 1];   /* the machine lists them in its own order, not the map's */
      const COINS = [10, 5, 5, 2, 1, 0.5, 0.5];
      const fmt = (v) => (v % 1 ? (v === 0.5 ? "½" : Math.floor(v) + "½") : String(v));
      let step = 1, inslot = [];
      const el = screen("The ticket machine", "The airport station", '<div id="fticket"></div>', null);
      const box = $("fticket");
      const mapHTML = () => '<div class="froute small"><img draggable="false" src="' + PZ + 'route-map.jpg" alt="The railway poster on the station wall: the line from the coast up into the hills, and its height profile">' +
        ST.map((st, i) => '<span class="froute-sign' + (i === 3 ? " here" : "") + (st.side === "right" ? " right" : "") + '" style="left:' + st.at[0] + "%;top:" + st.at[1] + '%"><i></i><b dir="rtl">' + st.he + "</b>" + (i === 3 ? "<em>You are here</em>" : "") + "</span>").join("") +
        ST.map((st) => '<span class="froute-alt" style="left:' + st.pf[0] + "%;top:" + st.pf[1] + '%">' + st.h + "</span>").join("") + "</div>";
      function draw() {
        if (step === 1) {
          box.innerHTML = q("The page said: go up. The machine only speaks Hebrew today.") +
            '<div class="fmachine"><div class="fm-top"><span>בחר יעד</span><button class="fm-lang" id="fmlang">English<i>out of order</i></button></div>' +
            order.map((i) => '<button class="fm-dest" data-st="' + i + '" dir="rtl">' + ST[i].he + "</button>").join("") + "</div>" +
            '<button class="fbtn alt" id="fmmap">Look at the map on the wall</button>';
          $("fmlang").onclick = () => { F.S("knock", null, 0.4); K.say("Someone has taped over the button. In biro: “out of order”.", "", 2800); };
          $("fmmap").onclick = () => { K.sfx("click"); K.card('<div class="kick">On the station wall</div><h2>The line, from the sea up into the hills</h2>' + mapHTML() + "<p>Every station has its name beside it, in Hebrew. Under the map, the same line from the side: how high each station stands.</p>" + '<button class="cta" data-act="x">Back to the machine</button>', { x: () => {} }); };
          box.querySelectorAll("[data-st]").forEach((b) => (b.onclick = () => {
            const i = +b.dataset.st;
            if (i !== 4) { wrong(ST[i].no); return; }
            F.S("dial", "click", 0.5); step = 2; draw();
          }));
        } else {
          const sum = inslot.reduce((a, i) => a + COINS[i], 0);
          box.innerHTML = q("Jerusalem, at the top of the line. The screen shows the fare, and under it two words you can read: coins only.") +
            '<div class="fpay"><img draggable="false" src="' + PZ + 'coin-slot.jpg" alt="The coin slot and tray"><div class="fpay-screen"><b>17.00 ₪</b><small dir="rtl">מטבעות בלבד · coins only</small><span id="fpaid">' + fmt(sum) + " ₪ in</span></div>" +
            '<div class="fpay-slot" id="fslot" aria-label="The coin slot"></div></div>' +
            '<div class="fcoins">' + COINS.map((v, i) => '<button class="fcoin c' + String(v).replace(".", "") + (inslot.includes(i) ? " used" : "") + '" data-c="' + i + '" aria-label="' + fmt(v) + ' shekel coin">' + fmt(v) + "<small>₪</small></button>").join("") + "</div>" +
            '<div class="fsmall">The change from the Lamplighter’s envelope. Tap a coin to drop it in the slot.</div>';
          box.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => {
            const i = +b.dataset.c; if (inslot.includes(i)) return;
            inslot.push(i); F.S("coin", "click", 0.8); K.buzz && K.buzz("tap");
            const t = inslot.reduce((a, j) => a + COINS[j], 0);
            if (t > 17) { setTimeout(() => { inslot = []; F.S("knock", null, 0.5); wrong("Clatter: every coin drops back into the tray. The screen flashes: exact fare only."); draw(); }, 350); draw(); return; }
            if (t === 17) {
              draw(); if (H.pay && !H.pay(17, "the train ticket", true)) return;
              W().flags.ticket = 1; save(); setTimeout(() => F.S("ticket", null, 0.8), 250); K.buzz("success");
              setTimeout(() => K.root() && K.card('<div class="kick">The airport station</div><h2>✓ Ticket bought</h2><p>The machine whirs and prints a small card: <b>Ben Gurion Airport → Jerusalem – Yitzhak Navon</b>. Up, all the way to the top of the line. It goes into your backpack.</p><button class="cta" data-act="x">To the trains</button>', { x: () => pzDone("ticket", () => finish("airport", () => go(byId.train))) }), 600);
              return;
            }
            draw();
          }));
        }
      }
      draw();
    } },
    board: { label: "Read the board", run: () => fill({ title: "The departures board", kick: "The airport station", intro: q("The board shows your train: Jerusalem, Yitzhak Navon. Under it, someone has written on a scrap of paper and tucked it into the frame. A line of a psalm, with words missing, and a small drawn lamp."),
      text: ["Who shall ", "ASCEND", " into the hill of the LORD? or who shall stand in his ", "HOLY", " place?"], ref: "Psalm 24:3", chips: ["ASCEND", "HOLY", "DESCEND", "HIGH", "COME", "GREAT"],
      bad: { DESCEND: "The other way. Every pilgrim went up.", HIGH: "Close, but the psalm names the place by what it is: set apart." },
      done: () => pzDone("board", () => finish("train", () => walk(V("platform")))) }) },
    scales: { label: "The spice seller’s scales", run: () => weigh({ title: "A just weight", kick: "The spice seller", intro: verse("Just balances, just weights, a just ephah, and a just hin, shall ye have: I am the LORD your God.", "Leviticus 19:36") +
      '<div class="fq">“You want to buy? First you must weigh,” says the spice seller, and sets a worn stone on the left pan. “One shekel. Make the other side match, in gerahs.”</div>' + q("A shekel is twenty gerahs (Exodus 30:13). Tap the weights for the right pan."),
      left: "One shekel", target: 20, unit: "gerahs", bg: "spice-stall", weights: [["A large weight", 12], ["A medium weight", 8], ["A small weight", 5], ["A smaller weight", 3], ["The smallest", 2]],
      light: "The pans do not level. Twenty gerahs to the shekel.", heavy: "Too heavy: the stone rises. A shekel is twenty gerahs, no more.",
      done: () => { K.card('<div class="kick">The spice seller</div><h2>“A just weight”</h2>' + (H.clip ? H.clip("yosef") : "") + '<p>The pans level. The seller nods, and tips a spoon of zaatar into a paper twist for you. “A just weight is his delight. You will need one of these.” He drops a small bronze weight into the twist: <b>one bekah, half a shekel</b>. “And twenty shekels for weighing my morning orders.”</p><button class="cta" data-act="x">Thank him</button>',
        { x: () => { W().flags.bekah = 1; save(); H.earn && H.earn(20, "Yosef, for weighing his morning orders"); pzDone("scales", () => walk(view)); } }); } }) },
    souvenir: { label: "Choose a souvenir", run: () => { if (H.souvenirGate && H.souvenirGate() === false) return; find({ title: "Everyone takes a souvenir home", kick: "Gabriel’s shop", q: "Six things on the counter. The Watchman’s page said: take the one that remembers the house. Tap each one to look closely.", counter: "Looked at", last: "This is the one",
      spots: [
        { label: "The kippah", at: [4, 10], w: 28, h: 30, decoy: true, text: "A knitted kippah, blue and white. Nothing on it but the stitches." },
        { label: "The prayer shawl", at: [36, 10], w: 28, h: 30, decoy: true, text: "A tallit with blue stripes and knotted fringes: “that ye may look upon it, and remember all the commandments of the LORD” (Numbers 15:39). No mark." },
        { label: "The menorah", at: [68, 10], w: 28, h: 30, decoy: true, text: "A small brass menorah, seven branches. Handsome. No lamp drawn on it: it is a lamp." },
        { label: "The shofar", at: [4, 55], w: 28, h: 30, decoy: true, text: "A ram’s horn, polished. Gabriel says, “Blow it on the Feast of Trumpets.” No mark." },
        { label: "The Jerusalem wall hanging", at: [68, 55], w: 28, h: 30, decoy: true, text: "A carved wooden picture of the city, filled with coloured stone chips, with the Home Blessing in the middle. The stones catch the light. No lamp." },
        { label: "The model of the Third Temple", at: [36, 55], w: 28, h: 30, text: "A little model of the Temple as it will be built: the courts, the altar, the sanctuary. Turn it over. On the base, in blue ink, a small drawn lamp, and a folded page tucked into the hollow." },
      ],
      done: () => { K.card('<div class="kick">Gabriel</div><h2>“That one. Yes.”</h2><p>Gabriel does not look surprised. “Someone left that for you this morning. He said you would know it. And a man in a grey coat asked for the same one an hour ago, and I told him it was sold.” He wraps the model in paper. “The house remembers where it stood. Go and see.”</p><button class="cta" data-act="x">Unfold the page</button>',
        { x: () => pzDone("souvenir", () => finish("gabriel")) }); } }); } },
    modelq: { label: "Study the Temple", run: () => labels({ title: "The guide’s three questions", kick: "The Second Temple model", img: "model-temple",
      intro: verse("And the glory of the LORD came into the house by the way of the gate whose prospect is toward the east.", "Ezekiel 43:4") +
        '<div class="fq">The guide lifts her pointer. “You are standing on the east side, looking west, the way a pilgrim came in. Put the names where they belong.”</div>',
      spots: [
        { id: "gate", at: [50, 57], label: "The Eastern Gate", why: "The gate in the eastern wall, with its stair: the way in from the Mount of Olives." },
        { id: "women", at: [52, 32], label: "The Court of the Women", why: "Just inside the gate: the largest court, open to all Israel, 135 cubits square." },
        { id: "house", at: [49, 21], label: "The sanctuary", why: "The house itself, its doors open to the east. The Holy of Holies is at the far, western end, behind the veil." },
      ],
      sun: { at: [50, 92], label: "The sunrise", why: "The house faced east. The rising sun shone straight through the Eastern Gate onto its doors." },
      wrongs: { gate: "That is a wall. The gate has a stair in front of it.", women: "Think of a pilgrim walking in: the first court is just inside the gate.", house: "The tallest building, white and gold: the house itself." },
      done: () => { K.card('<div class="kick">The guide</div><h2>“Good. You looked.”</h2><p>Eastern Gate, Court of the Women, Court of Israel, the altar, the sanctuary, and at the back the Holy of Holies: a straight line from east to west, the doors facing the sunrise. <b>Remember the line.</b> On the Mount you will need it.</p><button class="cta" data-act="x">Thank her</button>',
        { x: () => { W().flags.modelq = 1; save(); pzDone("modelq", () => walk(view)); } }); } }) },
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
      weights: [["The bekah from the market", 10, "weight-3"], ["A gerah", 1, "weight-5"], ["Two gerahs", 2, "weight-5"], ["Five gerahs", 5, "weight-4"], ["A full shekel", 20, "weight-1"]],
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
    lampstone: { label: "Look along the rock", run: () => find({ title: "The anointing of Solomon", kick: "The Gihon Spring", dark: true, img: "pz:gihon-wall", scene: "The rock wall by the spring", intro: verse("And Zadok the priest took an horn of oil out of the tabernacle, and anointed Solomon. And they blew the trumpet; and all the people said, God save king Solomon.", "1 Kings 1:39"),
      q: "It is dark by the water. Drag your finger to carry the light along the wall. One stone carries the Watchman’s lamp.", counter: "Found", last: "Light the lamp",
      spots: [{ label: "A wet stone", at: [8, 70], w: 16, h: 14, decoy: true, text: "Wet, green, nothing on it." }, { label: "A flat stone", at: [30, 74], w: 16, h: 14, decoy: true, text: "Flat and dry. Nothing." }, { label: "A cracked stone", at: [52, 70], w: 16, h: 14, decoy: true, text: "Cracked through. Nothing." }, { label: "A stone with a mark", at: [80, 56], w: 16, h: 14, text: "Scratched into the stone, small, a lamp. Beside it a splash of something dark that smells of olives: oil. Enough to fill your lamp for the tunnel." }, { label: "A rounded stone", at: [40, 50], w: 14, h: 12, decoy: true, text: "Round and smooth. Nothing." }],
      done: () => { W().flags.lit = 1; save(); K.card('<div class="kick">The Gihon Spring</div><h2>Oil for the dark</h2><p>You fill the lamp. Solomon was anointed with oil at this water, and built the house. You will need the light: the tunnel ahead is 533 metres of darkness.</p><button class="cta" data-act="x">To the tunnel mouth</button>', { x: () => pzDone("lampstone", () => finish("gihon", () => walk(V("mouth")))) }); } }) },
    darktunnel: { label: "Go in", run: () => find({ title: "Hezekiah’s Tunnel", kick: "In the dark", dark: true, img: "pz:tunnel-meet", scene: "Cold water, rough rock, the sound of your own breathing", intro: verse("This same Hezekiah also stopped the upper watercourse of Gihon, and brought it straight down to the west side of the city of David.", "2 Chronicles 32:30"),
      q: "Drag your finger to carry the lamp through the tunnel. Find the three things the Watchman marked.", counter: "Found", last: "Out into the light",
      spots: [
        { label: "The chisel marks", at: [20, 40], text: "Pick marks in the rock, slanting one way, then, further on, slanting the other. Two teams of diggers, starting from each end, cutting toward each other in the dark." },
        { label: "The meeting point", at: [72, 37], text: "Here the two tunnels met: the ceiling jumps, the walls do not quite line up. The Siloam Inscription was cut into the wall here in 701 BC: “…the quarrymen struck, each toward his fellow, pick against pick, and the water flowed from the spring to the pool.” The stone itself is in Istanbul." },
        { label: "A lamp on the wall", at: [12, 72], text: "Scratched into the rock at shoulder height, a small lamp, and under it a word: WEST. The tunnel bends, but it is heading west, under the city, as the Chronicler said." },
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
    readjournal: () => journal(),
    navonLight: () => { K.card('<div class="kick">Yitzhak Navon station</div><h2>Up into the light</h2><p>Halfway up the escalator the journal feels warm in your bag. You take it out. One line of the first page seems darker than the rest:</p>' + F.wnote("“When you come up out of the earth into the light, go to the market, where everything is weighed.”") + '<p>At the top, Jaffa Road, and the light rail. The market is three stops away.</p><button class="cta" data-act="x">Out into the city</button>', { x: () => {} }); },
    gabrielTalk: () => { K.card('<div class="kick">Gabriel</div><h2>“Shalom. Come in, come in.”</h2><p>Gabriel is behind the counter, a small man with a big voice, and within a minute you are talking about the end of days. “Everybody who comes in here wants to know when,” he says. “Nobody asks where. You ask where. Good.” He taps the counter. “Everyone takes a souvenir home. Choose.”</p><button class="cta" data-act="x">Look at the counter</button>', { x: () => {} }); },
    warrenGate: () => { const w = W(); K.card('<div class="kick">Warren’s Gate</div><h2>“Entrance gate to the Temple Mount”</h2><p>The sign says: one of four gates in the Western Wall from the Second Temple period, found by Charles Warren in 1867. From 638 to 1099 the passage inside it was the main synagogue of the Jews in Jerusalem, called “the Cave”, placed here because it was close to the Holy of Holies. Today it is a cistern.</p>' + (w.flags.arksign ? "<p>Parker, in the City of David, dug for the Ark and fled. The old tradition says it lies in a chamber beyond this gate, under the Mount. In 1981 the rabbis of the Wall broke through here and began to dig; the passage was sealed again by order. Whatever is behind this stone, no one has seen it since.</p>" : "<p>Behind the stone, the tunnel is said to run on under the Mount. There is a story about this gate. You will hear it in the City of David.</p>") + '<button class="cta" data-act="x">Back</button>', { x: () => {} }); },
  };

  /* hints for the walking scenes (the hint button in the top bar) */
  function hint() {
    st.hints++;
    const v = view;
    if (H.hint) { const h = H.hint(scene, v, st.hints); if (h) return K.say(h, "", 4600); }
    if (!scene || scene.kept) return K.say("Every clue is in the Scripture or the history it quotes.", "", 3600);
    if (v && v.puzzle && !W().done[scene.id + ":" + v.puzzle]) return K.say(({ scales: "Twenty gerahs: 12 and 8, or 12, 5 and 3.", souvenir: "The page said: the one that remembers the house.", modelq: "You stand on the east. The gate has the stair; the court is just inside; the house is the tall white building; the sun rises behind you.", landmarks: "The citadel is behind you; the Mount of Olives is beyond the whole city.", burnt: "Prophecy first, then the siege, the Temple, the house, the stones.", courses: "Read the small plaque by the shaft.", firstanswer: "No single clue is enough.", halfshekel: "The bekah alone is half a shekel.", north: "North, and King.", zionq: "Zion, and David.", lampstone: "The marked stone is on the right, low.", darktunnel: "Carry the lamp slowly along the whole wall, low and high.", siloamq: "Siloam, Sent, Seeing.", ascents: "Glad, house, feet, gates.", whose: "A memorial, not a grave; the priest, not the prophet.", bought: "400 shekels of silver; 100 pieces of money; 600 shekels of gold.", board: "Ascend, and holy.", passport: "Page 1 tells you where you are going: up, to Jerusalem.", ticket: "Look at the poster on the wall: the profile under the map shows which station is highest. That is Jerusalem. Find the same Hebrew name on the machine. Then exactly 17 in coins, for example 10, 5 and 2.", wayup: "The small door." })[v.puzzle] || "Look at everything in the picture first.", "", 4600);
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
    backpack, lockUI, keptDone(id) { finish(id, () => { const nx = R[byId[id].n]; if (nx) go(nx); else map(); }); },
    stats: () => st, H, core: { byId, V, walk: (v) => walk(v), finish, pzDone, page, save, isDone, nextScene, PUZZLES, ACTS_FN, TASK, PIN, wrong, earn: null } };
})();
