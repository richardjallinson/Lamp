# Episode 1 fix list (batched; build the next v3 zip when 4–5 are ready)

Last build sent: v3z (fixes 1–12 below; 11 still to do). App Store name: Lamp - The Final Seven Years; subtitle: A Jerusalem mystery adventure.

| # | Fix | State |
| --- | --- | --- |
| 1 | Clear "✓ Done here" card when a place is finished: chime, places left, button to the next place | In v3w |
| 2 | Remove "Photo: Richard J. Allinson" from every picture; say once at the start that all pictures are Richard's | In v3w |
| 3 | Real painted map: Richard's two paintings (Jerusalem, and the Old City), every place pinned where it really is; next place glows, done places ticked, airport and Hebron as signposts; "All places" list kept behind a button | In v3w |
| 4 | New opening, Riven-style: the Lamplighter at his desk hands over the Watchman's journal (his words on screen until Richard films it; set INTRO_FILM in fsy.js), the full page 1, then the airport: read the journal, follow the train signs, buy a ticket at the machine; boarding verse Psalm 24:3 at the departures board; at Navon the journal points to the market | In v3w. Needs: Richard's film; photos of the airport train signs and the ticket machine (placeholders now) |
| 5 | Backpack button beside Journal and Map: the journal, train ticket, bekah, Gabriel's souvenir, postcard, line of flax, filled lamp, measuring reed, as you get them | In v3w |

## Next batch (for v3x)

| # | Fix | State |
| --- | --- | --- |
| 6 | Professional puzzle machines from Richard's drawings: the brass balance (spice seller, bazaar trader), the brass combination lock on the Institute case, the lamp in the dark on his painted walls (Gihon Spring, Hezekiah's Tunnel) | In v3x |
| 7 | Act 1 as an adventure (Claude Doc "Episode 1, Act 1: The Adventure Design"): 11 people to talk to, money (start 100), Gabriel's shop, items that carry forward, the travel card and its four rides, doors that need the key (card, number 26, museum ticket, map + kippah), Dudu's side quest, the Daniel 9 reader in the journal, the man in grey's NOT NORTH card. New file js/fsy-act1.js. Portraits show as lettered medallions until Richard's drawings arrive | In v3x. Needs: 12 people, 14 objects, 5 scenes drawn (list in the doc) |
| 8 | Act 1 puzzles: the ticket machine is now Richard's painted route map (five real stations, sea to summit, go up); the museum guide's questions are now naming the parts of his model photo and placing the sunrise; the departures-board puzzle is dropped (a quiet train ride); double-tap guard on Weigh and Try the lock | In v3y |
| 9 | Portraits for all 13 people, the man in grey painting, Ben Yehuda Street and Gabriel's counter paintings (171/171 views) | In v3y |
| 10 | Short clips of the people: a clip slot on the cards (video/fsy/<id>.mp4 + poster), plays on its own or on a tap. First test: Yosef's "Honest hands", on the scale card (to be replaced by a version with his eyes in frame) | In v3z |
| 11 | The Watchman's lamp mark scratched beside Yitzhak Navon on the route map (Gerry) | To do: one small drawing |
| 12 | The app is now "The Final Seven Years" alone (release.js GAME_ONLY): title screen "The Final Seven Years · Episode 1 · The Jerusalem Mystery", home with Episode 1 lit (Begin / Continue, pages found, progress) and Episodes 2–8 locked "Coming soon"; tabs Episodes and Settings; settings trimmed to music, narration, vibration; tester tools trimmed (plus "Play Act 1 as if done"). The word game, books and Genesis adventure are switched off, not deleted | In v3z |

**Packaging (always):** the zip holds the whole project: Lamp-vXX/ with Lamp.xcodeproj, Lamp/, README.md and www/ (tools, sounds and design removed). Richard opens Lamp.xcodeproj and runs; he does not swap folders.

## Next batch (from Richard playing v3z on his phone): built as v4a

| # | Fix | State |
| --- | --- | --- |
| 1 | The journal's script font is hard to read: change it to a clear, readable face, and put every note and journal page on what looks like an old parchment Torah scroll (rolled ends, aged parchment, ink) | In v4a |
| 2 | Found while checking #1: the page 1 card in the opening still ends "Trust the man with the angel's name." It must say "…at the number of the verse where Messiah is cut off" (the Gabriel 26 clue), as the journal itself does | In v4a |
| 3 | The start screen: the big title back to LAMP (as it was), with "The Final Seven Years" as the subtitle under it | In v4a |
| 4 | The ticket machine becomes a real puzzle: (1) screen in Hebrew only, English button taped "out of order"; (2) match the Hebrew name of the top station on the wall route map (small Hebrew signs added at each dot) to the machine button, clerk hints with the yod; (3) pay exactly 17 shekels in coins from the envelope (10, 5, 2, 1, ½), "Exact fare only" | In v4a |
| 5 | The fish counter picture is a blurry blown-up crop: replace it with a painting (prompt given), nobody behind the counter | In v4a |
| 6 | The walking screen fits one phone screen, Riven-style: the picture fills the screen; title and a one-line task over its top (tap the task to read all); the Lamplighter as film subtitles over the bottom of the picture, two lines at a time, "1/2 ›", fades when done, a lamp button to bring it back; people as round faces on the picture, tapping one slides a dialogue panel up over the bottom half (only that panel may scroll); arrows just above a fixed bottom bar of Journal, Backpack, Map; the caption under the picture goes (tap the title to see it); the screen never scrolls | In v4a |

## Next batch: built as v4b. Officer's stops are set at her pauses (about 7.0 s and 13.6 s); Richard to confirm her lines

| # | Fix | State |
| --- | --- | --- |
| 1 | Passport control before the arrivals hall: a border officer asks purpose, where you are going (answer from page 1: up, to Jerusalem), and what is in the bag; she sees the lamp on the journal and says a man in a grey coat asked this morning about a book with a lamp on it. You get the blue entry slip (Israel no longer stamps passports), needed at the exit gates | In v4b |
| 2 | Wide (landscape) pictures sit small with empty space: fill the height and drag left and right to look around (hotspots stay on their marks) | In v4b |
| 3 | Clips that pause for your answer: a clip is split at the gaps in the speech; it plays one question, stops on her face, shows your choices, plays on when you answer. The officer: officer-2.mp4 (portrait, 18 s, four lines at about 2, 5, 12, 15 s) is the questions; officer-1.mp4 (landscape, she stamps the passport) ends the scene before the gates open | In v4b |
| 4 | The ticket clerk's clip ("Grey coat, no luggage…") on her answer about the man in grey | In v4b |
| 5 | The soldier: new bearded still, and his clip ("Nobody looks. You look.") on "Do you know the Temple Mount?" | In v4b |
| 6 | The card seller's clip on "I need to take the light rail" | In v4b |

## Next batch (for v4c)

| # | Fix | State |
| --- | --- | --- |
| 1 | The station-wall map is now Richard's poster: the line from the coast past the airport into the rounded Judean hills, with a height profile underneath. Real stations on the dots (Tel Aviv Savidor, Ben Gurion Airport, Pa'atei Modi'in, Modi'in Central, Jerusalem Yitzhak Navon) and their heights (≈ 10, 40, 150, 250, 800 m); "go up" is read from the profile | Done in code, waiting for the build |
| 2 | Act 1 clips: Dudu, the bread seller, the halva seller, Shmuel, Gabriel, the museum guide, the grandmother, each at their key moment. Every Act 1 person now has a clip | Done in code, waiting for the build |
| 3 | Passport control: the clip now stops after each of her four lines (passport please / where are you going / open the backpack / where did you get this book) with the right answers each time; answers no longer squashed under the back button; the heading no longer shown twice | Done in code, waiting for the build |

## v4d (built)

| # | Fix | Status |
|---|---|---|
| 1 | Clip for the woman at the stop (Dudu's grandmother on Jaffa Road), when you offer to carry her bags | Done in code, waiting for the build |
| 2 | Clips for the coffee man ("Twelve.") and the fish man ("Fifteen. Wrapped."). Every Act 1 person now has a clip | Done in code, waiting for the build |
| 3 | Music for Act 1: M9 "Road to the Old City" (airport, train, tram), M10 "Market Morning" (market, Ben Yehuda, Gabriel), M11 "Miniature Temple Wonder" (the model), levelled to match the other tracks | Done in code, waiting for the build |
| 4 | Background sounds for Act 1: the airport hall, the train, the market, and the tram stops on Jaffa Road, each looping under its place and levelled with the others | Done in code, waiting for the build |
| 5 | Sound effects for Act 1: the passport stamp, each coin into the ticket machine, the ticket printing, paying at a stall, the tram bell on each tram ride, and the shop bell going into Gabriel's | Done in code, waiting for the build |
| 6 | The Lamplighter's voice is now Shlomi (an older man, gentle Hebrew accent): his 10 Act 1 lines, short pauses lengthened, levelled with the old narration | Done in code, waiting for the build |

## v4e (built)

| # | Fix | Status |
|---|---|---|
| 1 | Music, narration and sounds start switched on in every tester build, even if they were off before | In v4e |

## Ideas for later

| Idea | Notes |
|---|---|
| Shlomi's food truck | A white food truck with "תחנת רענון" (Refreshment Station) on the side and soldiers queuing; a kind volunteer hands you a coffee: "friends to one another" (רעים זה לזה). From Richard's day at Re'im. A painting, not the T-shirt photo (it shows real soldiers' faces). No credit line. Place to decide: Act 5 by the Mughrabi Gate, or Act 2 near the Western Wall |

## v4f (built)

| # | Fix | Status |
|---|---|---|
| 1 | Map numbers hard to read: the places not reached yet were faded to 45%. Now solid dark circles with clear white numbers (a dashed rim for not yet reached), a little bigger. Also the place name no longer sits on top of the map's own heading | Done in code, waiting for the build |
| 2 | The ✕ at the top left looked like a back button. It now says **Quit**, and asks first: "Leave the game? Your progress is saved." with Keep playing / Leave the game | Done in code, waiting for the build |
| 3 | Lost in the market after shopping: the task line now always shows Dudu's list (what is still to buy, and that coffee is from the coffee man, not Yosef), even after the market is done, and then where to take it. "The man with the sacks" renamed "the coffee man" so he is not confused with Yosef's sack; the main task now says "Go back to Yosef the spice seller and ask about the old sack in his corner" | Done in code, waiting for the build |
| 4 | The shopping vanished from the backpack without a word: Dudu's grandmother's scene now says "You hand her the bread, the coffee and the fish: they leave your backpack." | Done in code, waiting for the build |
| 5 | A checklist for every Act 1 place: the task line shows a count (2/3) and opens "Your list here": ticks for what is done, empty boxes with a hint for what is still to find, and the extras (Dudu's shopping, the frankincense) in their own section | Done in code, waiting for the build |

## v4g (built)

| # | Fix | Status |
|---|---|---|
| 1 | A finale for the market, Richard's spice bowls and sack: the Watchman's sack is tied, its tag reads Exodus 30:34. Pick the four Temple incense spices (stacte, onycha, galbanum, frankincense) from Yosef's nine bowls, labelled in English and Hebrew; wrong picks get a line ("That is for soup"). Then "of each a like weight": spoon each onto the brass scales until it balances the bekah (10 gerahs). Yosef cuts the cord; inside, page 2 torn into five strips: swap them until the words read and the Watchman's ink stroke runs unbroken. The frankincense is now needed (bought at the bowl if not before) | Done in code, waiting for the build |
| 2 | The night at the Jerusalem Hotel, the last stop of Act 1: the sign (made on Richard's own stone-wall photo, "Jerusalem Hotel / מלון ירושלים", no brand), the front desk with the desk clerk (check in: three nights already paid in cash by an older gentleman; the way to Jaffa Gate; "do the walls in the morning, a storm is coming"; a man telephoned asking about a guest with an old book), and Richard's room photo (the journal on the nightstand, the window, Go to sleep). In the morning a note under the door: "Welcome to Jerusalem. Rest well. The north is cold at this time of year." Front desk picture and the clerk to come from Richard | Done in code, waiting for the build |
| 3 | Richard's spice-table photo (the bowls only, no people) behind Yosef's scales and the incense weighing | Done in code, waiting for the build |
| 4 | The Dung Gate sign (Richard's photo) as a view beside the gate: tap it for Nehemiah 3:14 | Done in code, waiting for the build |
| 5 | Richard's front desk painting and the desk clerk's face in the hotel | Done in code, waiting for the build |
| 6 | Two hotel clerks: the night clerk (Richard's young woman) checks you in; after you sleep, the morning clerk (the young man) hands you the note left at the desk overnight ("a gentleman in a grey coat, very polite"), and the hotel is done. Also fixed: text in italics inside a reply was nearly invisible (the grandmother's hand-over line) | Done in code, waiting for the build |
| 7 | Clips for the night clerk (checking in) and the morning clerk (the envelope) | Done in code, waiting for the build |
| 8 | Buses and the Rav-Kav (Richard's bus pictures, card and tap clip): the travel card is now a Rav-Kav. The number 18 bus from the museum to the hotel, and the bus from the hotel to Jaffa Gate in the morning: board, tap the card (the clip, a green tick). The card's four rides run out on the way to the hotel, so in the morning the reader beeps red, "Insufficient balance", the driver takes no cash, and you top up at the Rav-Kav machine at the stop (language, card on the reader, load ₪5/₪10/₪20). An empty card on the tram also sends you to the machine now. Act 1 now ends with 22 shekels (10 loaded on the card) instead of 32 | Done in code, waiting for the build |
| 9 | Every ride is on the Rav-Kav: the trams and the buses all need a tap (the clip, a green tick); no card, no ride; no credit, no ride (red, "Insufficient balance") and the Rav-Kav machine at the stop. Richard's bus front with its LED sign lit for each route: 66 Israel Museum, 18 City Centre, 38 Jaffa Gate. The machine is Richard's picture, its screen showing each step, the round reader pulsing to tap | Done in code, waiting for the build |
| 10 | The end of Part 1 at Jaffa Gate: the bus arrives, the Lamplighter speaks, "End of Part 1 · Arrival", your pages, shekels and people met, and what comes next. PART1_ONLY switch in release.js: off for testers (a "Go up: on to Part 2" button), on for the App Store (Part 2 "Coming soon") | Done in code, waiting for the build |

## v4h (built)

| # | Fix | Status |
|---|---|---|
| 1 | The man in grey becomes a person: Victor Haller, waiting in the hotel lobby the morning after with two coffees. Polite, reasonable, half right: he knew the Watchman, says the Temple stood on the rock as thirteen centuries have said, the people he serves are close to an agreement that needs everyone looking at the same rock, offers to buy the journal, and when refused asks you to look south from the walls and judge honestly. "How did you know my flight?" "Someone told me. Someone who wanted me to know." The hotel finishes when he leaves. Face and clip to come from Richard | Done in code, waiting for the build |
| 2 | Shlomi's three new lines: arriving at the hotel, the room, the end of Part 1 | In v4h |

## Next batch (for v4i)

| # | Fix | Status |
|---|---|---|
| 1 | Stuck at "Choose a souvenir" in Gabriel's: the "buy the model first" message was a toast that vanished in three seconds. It is now a proper card with a "Buy the model (30 shekels)" button that goes straight on to choosing | Done in code, waiting for the build |
| 2 | Holy Bagel: tap the counter to buy a bagel (12, or 14 with cream cheese); tap again to eat it on the red chair, and your lamp gains a drop of oil (hints cost one) | Done in code, waiting for the build |
| 3 | Holy Bagel photo unblurred (Richard's wife said it is fine; she is side-on in the queue) | Done in code, waiting for the build |
| 4 | The Holy Bagel girl: Richard's portrait and her "Next!" clip on the counter card (take 1, cap slightly clipped at the top; a retake with the wide picture would be cleaner) | Done in code, waiting for the build |
| 5 | Hebron, the Noam Arnon sign: "Read the sign" now shows the complete text, all nine paragraphs, word for word, in a scrolling reading panel. The same panel is available for any other long sign (hotspot: long, title, sub) | Done in code, waiting for the build |
| 6 | The 160 to Hebron (Act 3) is now a Rav-Kav ride from the Central Bus Station, with its lit sign: no credit, no ride, top up at the machine | Done in code, waiting for the build |
