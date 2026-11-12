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

## v4i (built)

| # | Fix | Status |
|---|---|---|
| 1 | Stuck at "Choose a souvenir" in Gabriel's: the "buy the model first" message was a toast that vanished in three seconds. It is now a proper card with a "Buy the model (30 shekels)" button that goes straight on to choosing | Done in code, waiting for the build |
| 2 | Holy Bagel: tap the counter to buy a bagel (12, or 14 with cream cheese); tap again to eat it on the red chair, and your lamp gains a drop of oil (hints cost one) | Done in code, waiting for the build |
| 3 | Holy Bagel photo unblurred (Richard's wife said it is fine; she is side-on in the queue) | Done in code, waiting for the build |
| 4 | The Holy Bagel girl: Richard's portrait and her "Next!" clip on the counter card (take 1, cap slightly clipped at the top; a retake with the wide picture would be cleaner) | Done in code, waiting for the build |
| 5 | Hebron, the Noam Arnon sign: "Read the sign" now tells the whole story in a scrolling reading panel, retold in brief with a short quote (the sign is Arnon's copyrighted text; the full wording stays readable in Richard's photo behind the card; restore it word for word only with permission). The same panel is available for any other long sign (hotspot: long, title, sub) | Done in code, waiting for the build |
| 6 | The 160 to Hebron (Act 3) is now a Rav-Kav ride from the Central Bus Station, with its lit sign: no credit, no ride, top up at the machine | Done in code, waiting for the build |
| 7 | A cash machine beside the hotel door (Richard, Oct 30): Hebrew only until you find שפה (language) and choose English; the Lamplighter's blue bank card turns up in the envelope with a scrap in the Watchman's hand, "Psalm 48:2", so the PIN is 4802; three wrong tries and the machine keeps the card (the clerk gets it back: "Try the Psalms"); ₪50–₪200 once a day, ₪6 fee. Picture of the machine to come from Richard | Done in code, waiting for the build |
| 8 | Richard's cash machine picture in place; Pizza HaOr (פיצה האור, "Pizza of the Light", name written on Richard's blank sign) across the lane from the hotel: a slice (10) or a whole pizza (38, half to the paratroopers), eaten on the stool for a drop of oil | Done in code, waiting for the build |
| 9 | Victor Haller: Richard's portrait and his clip ("I am not your enemy…") on his first line in the lobby; the bagel girl's portrait switched on | Done in code, waiting for the build |

## v4j (built)

| # | Fix | Status |
|---|---|---|
| 1 | The journal as a Torah scroll: wooden rollers top and bottom, one sewn parchment sheet you scroll through, each page a column with its Hebrew letter-number (א, ב, ג…) in the margin in red, a large red first letter, and the margin notes at the end. Hoefler Text / Baskerville, Apple's built-in old-style faces, for the scribe's hand | Done in code, waiting for the build |
| 2 | Music and background sound now dip whenever a person's clip plays (and under the officer at passport control), not only under the Lamplighter; the dip is deeper (music to 18%, street sound to 40%) and comes back when the clip ends or the card closes | Done in code, waiting for the build |

## Added to v4j (rebuilt)

| # | Fix | Status |
|---|---|---|
| 1 | The Watchman's writing in a gentle italic (journal scroll and the single pages you find): a touch larger, more open spacing, so it reads like a hand without being hard to read; the red first letter and the verse references stay upright | Done in code, waiting for the build |

## v4k (built)

| # | Fix | Status |
|---|---|---|
| 1 | The map on one fixed screen, nothing scrolls: the heading at the top, the map filling the middle at its proper shape (it shrinks on small phones), and the Jerusalem / Old City tabs, the key and Journal · Backpack · All places in one row at the bottom. Checked on a large and a small iPhone screen | Done in code, waiting for the build |
| 2 | The guide's questions at the Temple model: tapping a name did nothing (it selected and unselected in the same tap). Now tap a name then a ?, or a ? then a name, or drag; the line underneath says what to do next; a wrong pairing names the label; the picture is sized to fit the screen; the sanctuary label sits above its pin so the two labels don't overlap | Done in code, waiting for the build |
| 3 | The start screen: LAMP · The Seven Candles, with "Based on The Final Seven Years by Richard J. Allinson" beneath | In v4k |
| 4 | A title screen before each act, like a film chapter: Episode 1 · The Jerusalem Mystery, the act number and name, its verse. Act 1 Go Up (the Eastern Gate), Act 2 Watchmen on the Walls (Richard's Damascus Gate at dusk, Isaiah 62:6), Act 3 Down to the Water (John 9:7), Act 4 The Feast of Dedication (John 10:22–23), Act 5 Measure the Temple (Revelation 11:1). Acts 3–5 use existing photos until Richard paints their dusk pictures | In v4k |

## v4l (built)

| # | Fix | Status |
|---|---|---|
| 1 | Act 3 title screen: "Where the City Began", Richard's City of David painting at dusk (the stepped wall, the lamp-bearer at the top), 2 Samuel 5:7 | Done in code, waiting for the build |
| 2 | The Seven Lamps begin: Richard's menorah at the top of the journal, its seven flames lit one by one ("2 of 7 lit", with the verse references). Lamp 1, Genesis 22:2: after her three questions, the guide at the model points to the summit, "It had a name before it had a temple." Lamp 2, Revelation 11:1–2: the nightstand drawer in Room 412 (Richard's painting), the old Bible open with a pressed olive leaf and the Watchman's drawn lamp | Done in code, waiting for the build |
| 3 | Richard's film of the first lamp catching fire plays on the "A lamp is lit" card (lamps without a film yet show the painted menorah) | Done in code, waiting for the build |
| 4 | Films for lamps 2 to 7, made from Richard's first lamp film (Gemini refused the others): the earlier lamps burn, the new one catches. All seven lamps now have their film | Done in code, waiting for the build |

## TestFlight 1 (tf1, Xcode build 4)

Act 1 only (PART1_ONLY on: Acts 2–5 "coming soon", the map won't open them, the End of Part 1 offers only "Back to the episodes"); tester tools off (no Skip); FRESH_EACH_BUILD off (testers keep their progress between updates); CURRENT_PROJECT_VERSION 4. For further tester builds for Richard, switch TESTER and FRESH_EACH_BUILD back on, and PART1_ONLY off.

## Passport control, harder (Moti) — after tf1
- Two wrong answers at the booth (Tel Aviv / don't know, or "It's mine" / "I found it" about the book) → "Please step aside. Someone will speak with you."
- The side room: Moti, the senior officer. Three questions — where are you going (up, to Jerusalem), who gave you this book (an old man, this morning), how much money (₪100; "Look in the backpack first" button). Wrong → moti-wrong clip, "Think. Then answer.", try again. No game over.
- Pass → moti-pass clip; he stamps the slip himself; hint about the man in the grey coat ("His was better rehearsed"). flags.moti set.
- Clips: moti-book, moti-wrong, moti-pass. Portrait img/fsy/people/moti.jpg. Opening clip moti-sit plays on his first question.
- Change (Richard, Oct 30): everyone goes through Moti. After the bag check ("Thank you"), she does not stamp: "Please step aside… Then come back to me." → grey door → Moti's three questions. Two wrong answers at the booth also send you there. Moti no longer stamps; he signs a form and sends you back to the booth, where she stamps the slip (officer-stamp clip).

## The flight map (Oct 30)
- After page 1 of the journal, "Board the flight" opens a map: Toronto Pearson → Athens (about 10 hours) → Ben Gurion (about 2 hours). A plane flies each leg along the great-circle route; Skip button; "Land at Ben Gurion" goes to passport control.
- js/fsy-flight.js (map baked in). Land outlines from Natural Earth (public domain). To change the departure city, edit YYZ in tools/flightmap/gen.py and the LEGS names.
- Oct 31: "Where are you flying from?" — the phone's time zone makes the first guess (16 cities); the choice is saved in W.from. Europe flies straight to Tel Aviv; everywhere else via Athens. Map redrawn as old paper with a red line (Indiana Jones), framed to each route. Takeoff film video/fsy/takeoff.mp4 (Richard, Oct 31) plays between the city question and the map; Skip button; music ducks.

## v4m (built, Oct 31)
- Tester build: TESTER on, FRESH on, PART1_ONLY off. Contains Moti's interview (everyone), passport stamped on return to the booth, the flight (city question, takeoff film, paper map).

## The departures board and the song (Oct 31)
- After the city question: Richard's departures board (img/fsy/w/departures.jpg; "TEL AVIV via ATHENS · 32 · BOARDING"), titled "<port> · Departures". Six things to tick in order: Passport, Boarding pass, Luggage checked in, Gate 32, Seat 23A, Doors closed.
- The last tick starts "City On the Hill" (Richard, ElevenLabs Music; audio/music/fsy-song.mp3 → app/www/audio/music/fsy-song.js, loudnorm -16, 112k). It plays once, at 0.8 (louder than the score), under the takeoff film (film audio at 0.35) and the map, and crossfades to the airport music at passport control. No ducking on the film any more.
- Song preloads when the city question opens.
- Oct 31: the map flight is paced to the song — when the song is playing, the legs are slowed so the plane lands as the song ends (about 1:50 after the last tick). Captions change along the way (night over the ocean / a coastline / the descent). Skip stays. With music off, the flight runs at its short length as before.

## v4n (built, Oct 31)
- v4m plus the departures board, the boarding checklist, "City On the Hill" under the flight, and the flight paced to the song.
- Note (Richard): if the music works, songs may follow at Golgotha and the Garden Tomb, Gethsemane, and a couple of other places.
- Oct 31 (Richard reached the museum with 14 shekels): a cash machine on King George Street, two doors from Gabriel's (hotspot on the street view; same ATM as the hotel's, so the bank card is found there if it hasn't been yet). The ticket desk card says where it is when you're short.

## Everyone is required (Richard, Oct 31)
- Every person with a speaking part must be met before a place can finish. The journal page still comes at once; then a "Not quite done" card lists who is left (with where), and the place finishes by itself the moment the list is complete (fsy-route finish() gate + 0.9s watcher).
- Gates placed before you could leave someone behind: the train won't go to Navon until you've talked to Eitan; the tram won't board until you've offered to carry the grandmother's bags; the hotel room won't open until you've asked the night clerk all three questions.
- Now required: the airport ticket clerk ("Which train", q.clerkWhich), Eitan, the grandmother at the stop, Dudu's whole errand (bread, coffee, fish, his grandmother), showing the guide the frankincense, the night clerk's "see first" and "anyone asked for me", hearing Haller out.
- Checklist rows no longer depend on the scene's own done flag (train: seen navon; market: incense puzzle; benyehuda: found26; gabriel: souvenir puzzle; model: q.guideMan).
- The task line falls back to "Still to do: …" (H.left).

## v4o (built, Oct 31)
- v4n plus: cash machine on King George Street, museum ticket hint, everyone required before a place finishes (train/tram/hotel-room gates).

## Victor Haller: one conversation, two ways out (Richard, Oct 31)
- The hotel meeting is now one continuous sit-down (hallerTalk): his clip, then choices at each step, no "Ask something else" menu. Side question about the flight folds back in.
- He offers ₪200 on a napkin, then ₪500. Keep it → "look south from the walls", "mind the weather", Act 1 as before. Sell it (₪500) → a.q.sold, W.flags.journalSold, +500; the Journal still opens ("as you remember them"), backpack says "(sold)", end card has a different Lamplighter line and "Next: get the journal back".
- Act 2 plan for the sold path (one scene, then the paths are one): the morning clerk hands over a parcel — the journal back, one page torn out, Haller's note "Keep it. I have what I needed." — and Gabriel gives the page back with a lecture. Thereafter a.q.sold only colours the odd line (Haller in Act 3, the Lamplighter at the end, act end cards).

## v4p (built, Nov 1)
- v4o plus Haller as one continuous conversation with the sell-the-journal path (₪500), and the Act 2 portraits, objects, scenes and the first 10 Act 2 clips in the bundle (not yet wired: Act 2 build is next).

## Act 2 built (Nov 3) — js/fsy-act2.js, scenes in fsy-route.js
- Nine places rewired with the new pictures (Avi's booth, the tile shop, the lamp stall, the footprints, the forgery stone, the bench, the Kotel hanukkiah, the wall projection at the end). Eleven people: Avi (booth and north door), Hagop, Mr Kasparian, Talia, Dudu's grandmother at the Wall, Rav Eliezer, Noa, Mr Hollis, Haller on the bench, the trader, Abu Sami. Clips in: haller-bench, haller-flight, avi, talia, grandma-wall, eliezer-riddle, noa-rod, noa-forgery, hagop, hollis.
- The ten puzzles, Myst standard: telescope (match the page-4 sketch; the doves' arch), storm (flash/thunder, 3 s = 1 km, choose the stair), doves' arch (lee side), Burnt House (scratch the ash, then order by depth), courses (lower the lamp, count only drafted stones, 17 opens the grille), great stone (lay the rod 26 times, count), look up (prayer in the empty crack, lamp reveals the chalk lamp and page 7), rubbing (scratch the charcoal; copy the scratched line → lamp 4; the chalk line → a false note, retry), tomb stone (sloped groove: pull the downhill wedge; uphill first jams it, lever back), false weight (test the trader's three against the bekah).
- Lamps 3 (Rav Eliezer's covenant line, Daniel 9:27) and 4 (the rubbing, 2 Chr 3:1). Pages 5–8.
- Sold path: Scene 0 at Jaffa Gate (Avi's parcel, Haller's note, page 3 gone; Gabriel gives it back, journalSold cleared). Haller on the bench: one continuous conversation ending on "Who do you think told me your flight?"
- Money: ticket 20, key +40, kite +15 (tile), tunnels 30 or free with the rod, lamp 30 (skipped if Gabriel's lamp was bought), map for the bekah. Fallback: the trader buys the model for 20.
- Gates: Ramparts needs the ticket; the tunnels need Noa (pay or rod); the north wall needs Avi's key; the bench needs the tomb done. "Everyone required" lists for all nine places. Hints for the telescope, storm, doves, riddle, courses, forgery, tomb, false weight.
- End of Act 2: the hanukkiah painting with two candles and the servant lit (FW.hanukkiahHTML(n) lights n from the right), the Lamplighter's line (kept / sold).
- Lamp-spout audit: hotel-drawer.jpg mirrored so the Watchman's lamp points right; WLAMP, the telescope sketch and the chalk lamp all point right; Richard's forgery stone has top right, bottom left.
- Tester menu: "Play Acts 1 and 2 as if done" (devAct2).
- Narration ids for Shlomi (auto from scene/view): w-jaffa-outside, w-ramparts-stairs, w-ramparts-golgotha, w-ramparts-storm (puzzle), w-jewish-cardo, w-jewish-wallsteps, w-wall-plaza, w-wilson-hall, w-tunnels-entry, w-tunnels-sign (look up), w-tunnels-warren (forgery), w-wallagain-arch2, w-wallagain-clear, w-gtomb-garden, w-gtomb-bench, w-bazaar-steps, w-bazaar-lamps, w-jaffa-parcel (sold path).
- Still to come: clips eliezer-covenant, abusami, kasparian, lampstall, forgerystone, bench, footprints (ids registered); Shlomi's lines; music m12–m16.

## v4q (built, Nov 3)
- Act 2 playable end to end (Jaffa Gate to the second candle). Tester menu has "Play Acts 1 and 2 as if done".

## Gerry's notes, first pass (Nov 3) → v4r
- The journal in three parts: Scripture (the lamps, with the verses), Evidence (measured + found facts), The Watchman (his pages). Tab remembered (flags.jtab).
- The footprints on the north wall are an investigation: a ticket stub (he had a ticket without buying one), a chalk smear (the same chalk as Warren's Gate), a wet parcel thread (matches Haller's parcel on the sold path).
- The forgery compared on Gabriel's map before choosing: the scratched lamp's spout points to the northern summit, the chalk one to the spring (compareOnMap).
- Parked for Acts 3–5: the Ark as a rotatable object (needs a 3D asset), the instrument case by ear, the Tombs by fragments, the Temple Mount survey table; the tile/model compartment pay-off at the Institute; Watchman Mode (v2).
- Nov 3: the Lamplighter's opening in Shlomi's voice (w-intro-desk, 1:54; paragraph gaps 1.2 s, inner pauses 0.55 s, loudnorm -18). Plays at the desk; "Take the journal" stops it.

## v4s (built, Nov 3)
- v4r plus the Lamplighter's opening in Shlomi's voice.

## Merged from Richard's ChatGPT pass (Nov 3)
- Six Act 3–4 quiz puzzles replaced by interactive ones, taken from the zip Richard sent (built on v4r): bought (place the three payments on the deed stones), north (set the compass), zionq (pin ancient Zion on the trader's 1910 map), siloamq (open spring → tunnel → pool), ascents (climb the fifteen steps), whose (inspect the Kidron monuments). Plus a "board" puzzle (trace the railway ascent) that nothing uses yet.
- The journal's Evidence tab gains a "Connections" block (H.connections): rod, bekah, lamp, blue ink and chalk, public purchase.
- Everything else from that zip was already ours or older (it predates the intro narration), so only these pieces were merged.

## App Store look (Nov 3) → v4t
- App icon: Richard's clay lamp before the Temple (mirrored, spout right). Original in images/originals/app/icon-lamp.png.
- Start screen: the same picture, extended to 1080×1920 (img/start/title.jpg; the old Eastern Gate painting kept as title-gate.jpg). The picture is on screen dark from the first moment; the tap lights it from the wick (WICK in intro.js), the glow travels to the Temple (GATE), then the title. The separate clay-lamp overlay is retired (display:none).
- Home-screen name: LAMP (CFBundleDisplayName).
- Nov 3 (Richard): the Eastern Gate flight is back. The opening is now: the lamp picture dark → tap lights it from the wick (glow, embers) with the verse → the night Jerusalem painting comes up behind and the lamp, cut out of the picture (img/start/lamp-cut.png, GrabCut from the original), lifts off the rock, turns so the flame leads, and goes in through the gate → the gate opens (title-gate-open.jpg) → the title. v4u.
- v4v: the flight is a plane's: the lamp moves off forward (shrinks at once), drifts right and up, banks into the turn (perspective + rotateY) so the flame leads and the handle trails, and goes in through the gate. Sounds: harp at the lighting, wings/wingsflap on the flight, door + shofar when the gate opens (Lamp.score.sfx). Better effects (a whoosh, a gate) can replace wings/door when Richard makes them.
- v4w: the start-screen flight is now Richard's Gemini film (video/start/gate.mp4, 8 s, 720×1280) with a drum roll (3.6–5.0 s) and a ta-da chord + cymbal as the doors open (5.0 s), mixed over the film's own sound. Full intro: verse, film at 5.4 s, title when the gate is wide (6.9 s into the film) and the film ends. Quick replay: the last 3.5 s of the film. If the film cannot play, the old CSS flight runs instead. The old intro music is off (the film carries the sound).
- v4w (second cut): the film's sound is its own effects plus wings (0.4 s), two flaps (2.3, 3.6 s) and the door (4.95 s), baked in. The start screen's original "full" cue plays under it, started 3.65 s before the film so its hit (8.6 s) lands on the door, and it carries on under the title. Quick replay: film from 4.5 s, cue from 8.15 s. My synthesized drum roll / choir takes were dropped.
- v4w (third cut): the film had no explicit width/height, so WebKit drew it at 720×1280 pixels (a zoomed-in corner on the phone); now width/height 100%, object-fit cover.
- v4w (fourth cut): the replay now shows the whole film too (verse first time only); the cue joins at 3.65 s so its hit still lands on the door.
- v4x: the tester Skip stranded Richard at Jaffa Gate (scene marked done, no Ramparts ticket, so the wall's gate stayed locked). Skip now plays the scene "as if": H.devDone(id) in fsy-act1/act2 gives the items, answers and puzzles each scene would have given (ticket, map, kippah, museum ticket, the clerk's answers, Avi's key, the lamp...). Verified scene by scene through both acts.
- v4y — Gerry's second set of Act 2 notes:
  1. Tunnels "Hold up the lamp" (the clay lamp is not bought until the bazaar) → "Borrow Noa's torch"; the chalk lamp and page 7 are found in her beam.
  2. One objective: H.task opens with a WHY line per scene on arrival; side errands marked optional in the checklist (kite news to Kasparian, Talia's "anyone else asked", Noa's "why holy", Abu Sami's oil).
  3. Dialogue trimmed ~15% on Avi, Avi at the door, Eliezer, Noa, Hollis, Haller on the bench.
  4. Second Haller sighting: Talia, mid-conversation, sees him at the top of the Burnt House steps (the wall near Golgotha was the first).
  5. Page 8 now explains the scattered pages: a man followed the Watchman for a year, wanted the book whole, so the pages were hidden one per place.
  6. Scene order: ... wallagain → bazaar → gtomb (Damascus Gate, down the souk, then out to the Nablus Road). wallagain ends at the gate (toBazaar); bazaar ends at the Garden Tomb sign (toGarden); the act ends after the bench at the "dusk" view (second candle).
  7. Cliffhanger: after the Lamplighter's second-candle card, "The night": Haller had a photograph of page 1 before the plane landed, and page 1 was in a sealed envelope.
- v4z (Gerry's third pass): evidence id "dudu" was used by Act 1 (the grandmother) and Act 2 (Haller at the tram stop), so the Act 2 fact never recorded → renamed "hallergrandma". The night card now keeps the mystery: "Either the Lamplighter showed it to him, or someone opened the envelope before it reached you" (the plot: the Lamplighter never gave Haller a page).

## v5a — Act 3: Down to the Water (built 5 Nov from the fourth-draft script)
- New js/fsy-act3.js (loaded after fsy-act2.js): people Ori, Reb Shimon, Yitzhak, Dr Adler, Mahmoud, Haller on the pool steps (hallerpool, portrait hallerfront), Rabbi Avner and the boys; items envelope2, codticket, oil, forgery, brasstube; RIDE.zion (the 160 back, then the 1).
- The morning: entering Hebron the first time runs morning(): the clerk, the envelope (+200, read aloud w-hotel-envelope), "Ask the clerk to ring the number" (it rings; nobody), then the 160.
- Hebron: bought puzzle re-done with "Ornan's place" (600 gold) and the 50-silver note; the Lamplighter's three-prices card (w-hebron-prices). Reb Shimon has the Watchman-measured-the-wall line.
- Zion: north puzzle led in by the unpicked stitching; page 9 given by the puzzle; the pit's book shows 88:18; the Lamplighter speaks at the hole (w-zion-up, auto id); q.pit required.
- City of David: 30-shekel ticket at the gate; Dr Adler names Yoel (flags.watchmanName); after the Zion pin she writes the authorisation herself (q.tunnelOk).
- Gihon: Mahmoud sells oil (12); the find needs oil; the marked stone lights Lamp 5; Mahmoud lights the lamp (clip mahmoud-lamp), phones the pool.
- Hezekiah: darktunnel re-done as "the water knows the way": three forks (listen / lower the lamp [clip flame-leans] / drop a scrap [clip scrap-drifts]); wrong = dead end, flame dims (flags.tunnelDim, never out); the meeting point (inscription card); the recess; the charcoal card, silent; "He is alive."; Lamp 6; flags.watchmanAlive.
- Siloam: two pools. siloamq at the Byzantine pool (place of page 10, not the page); first sight of Haller from above (hallerfront card); hallerPool() four screens incl. "That sounds like a threat" / "A threat promises what will happen…"; the forged page (lamp LEFT); the proof (two pictures, "Which is his?"); dry shoes; tubeDown hotspot → brass tube → page 10 → finish.
- Southern Steps: ascents is a no-fail coda with the first words of Psalms 120–134; Robinson's stones have no puzzle tonight (Act 4); candle3 view (hanukkah-jaffa) → endAct3: third candle (w-act3-end) → the night card → finish.
- Tester: H.devDone for all seven scenes; FW.devAct3.
- Narration: Shlomi's 23 lines (18 Act 2 + 5 Act 3) levelled and registered in HAVE.
- v5a (second cut): OPEN_ACTS in release.js (on for testing, !! off for the App Store): a locked place on the map or in "All places" offers "Jump to …", which marks everything before it as played (devAct1/2/3 + devDone for earlier scenes of the act) and goes there.
- v5b (Gerry's Act 3 build notes): tester panel gets "Play Acts 1 to 3 as if done" (devAct3); the third-candle line is now "…which is why, when money and fear failed, he gave you a page" (Shlomi's w-act3-end needs re-recording to match); "701 BC" → "in Hezekiah's time, in the late eighth century BC"; the first tunnel fork has its own picture (tunnel-fork-left2, the right-hand fork mirrored) so the scrap-drift fork keeps the picture its clip was made from; the script's money section now describes the Rav-Kav rides the build uses.

## App Store checklist (before any store or TestFlight build)
- release.js: FRESH_EACH_BUILD false (players keep progress); OPEN_ACTS false (acts lock again); PART1_ONLY as decided; BUILD "tfN"; raise CURRENT_PROJECT_VERSION in project.pbxproj.
- dev.js: TESTER false (no Skip, no tester panel).
- Shlomi's lines all recorded (Act 3: w-act3-end re-recorded with the new wording).
- Portraits: Ori a touch younger if it matters (Gerry).
- v5c: Act 2's last seven clips are in (Richard, 5 Nov): eliezer-covenant, abusami, kasparian (play in their replies); lampstall, forgerystone, bench, footprints play once as a card the first time the player reaches that view (SCENECLIP in fsy-act2.js H.before). Ori's younger portrait; w-act3-end re-recorded.
- v5d: Act 2 music (Richard, ElevenLabs Music, 5 Nov), levelled to -20 LUFS, 96k, fades: m12 "Wall at Midday" (Jaffa Gate, Ramparts, north wall), m13 "Ashes Remembered" (Jewish Quarter, Western Wall), m14 "Understone Drift" (Wilson's Arch, tunnels), m15 "Evening in the Market" (bazaar). m16 (Garden Tomb) still to come; falls back to "olives".
- v5e: the Garden Tomb song "He Is Risen" (Richard's original lyrics written with Claude, ElevenLabs Music, 6 Nov; 2:00): fsy-risen-song, plays once at song level from the moment the stone rolls ("He is not here"), through the tomb and the garden; the bench is quiet (music off, birds only); dusk returns to m16 (still falling back to "olives").

## v5f — Gerry's Act 3 notes (restraint)
- Hebron: the Lamplighter's "Three purchases. Three prices…" speech cut to "Remember the witnesses."
- End of Act 3: the third-candle card shortened to Gerry's text.
- Tunnel: a small note on the first fork says the forks are adapted from the abandoned cuttings, not a map of the real tunnel.
- w-hebron-prices and w-act3-end taken out of HAVE (silent) until Shlomi re-records them with the new words.

## v5g — Act 3 end line without ElevenLabs
- w-act3-end cut down from the old take (kept: "Three candles. Six lamps, and the seventh is his." / "You have a question for me." / "Hold it until the garden… anywhere else." / "Tomorrow: everything is ready but one thing."). The long take is in images/originals/fsy/audio/shlomi.
- Card text matched to the cut. Hebron "Remember the witnesses." stays text only.

## v5h — Act 4 built (script: third draft, approved by Gerry 6 Nov)
- New fsy-act4.js. Scenes: dawn (Robinson's stones, moved from Act 3), institute (plates from the exhibits; frame; page 11; Shira at the desk; 35 shekels in), dung (Moses' new line), egate (Sergeant Ben-Ami, the sealed package, the date lock, the annex and the seal), kidron (unchanged), olives (kept; then Noor and Haller's call on the way down), gethsemane (Brother Matteo; the gap at the back; page 12 front and back; the letter; the fourth candle).
- Act 4 title: "Everything But the Place" (Daniel 9:27). Pages 11 and 12 text per the script. The postcard at the Institute is no longer page 11.
- Tester: "Play Acts 1 to 4 as if done" in Settings.
- Act 4 test: scratchpad act4.js plays it through (money 122 → 87).

### Act 4 assets still to come (Richard, 7 Nov)
Portraits (480×480, img/fsy/people/<id>.jpg; the ids are already registered, so just drop the files in):
- shira, benami, noor (with her son), matteo, hallerphone (from behind, on the telephone among the graves), moses (optional; the old man at the Dung Gate)
Objects (img/fsy/pz/<id>.jpg, 400×600 or square):
- photo1 (page 1 through glass at the bag check), accords (the map with gold tabs and the Phase 2 sheet), annex (the blank page, the paperclip mark, the gold seal: a crown over a broken ring)
Clips (video/fsy/<id>.mp4 + .jpg; then add the id to CLIPS in fsy-act4.js):
- plate-drops, benami-package, noor-photo, haller-phone, matteo-gap
Shlomi (audio/narration/fsy-<id>.mp3; then add the id to HAVE in fsy.js):
- w-dawn-stones ("A trumpet once sounded from the top of that corner…"), w-institute-plates ("You cannot stop a sacrifice that never started…"), w-egate-package ("The covenant Daniel saw is not one treaty…"), w-gethsemane-letter (the letter, read quietly), w-act4-end ("Four candles…"), w-hebron-prices ("Remember the witnesses.")
Music: m20–m23 (Dung Gate, Eastern Gate, Kidron, Gethsemane) and m24 (the stones at dawn) still fall back.

## v5i — Act 5 built (script: third draft, approved by Gerry 6 Nov)
- New fsy-act5.js. Haller at the barrier before opening (the forgery as his test; ninety minutes as a story limit); Officer Tal on the board; a sighting after each witness; "He is there" before the verdict opens; the verdict is now drag-and-lock (the four fixed layers light as the court comes into register; locks at the gate line over the northern summit; no "convince me"); the journal's "My five lines of evidence converge here" and the Lamplighter's four sentences; the reveal; the brass plate under the grate (drag the rod's end, tilt) and lamp 7; the shutter and Haller's last lines; the Waqf official's Friday line; the gate as a journal reconstruction from the platform; the official's minute; the paving joints and page 13; the fifth candle and the night; Yoel at the gate before sunrise (new route scene "yoelgate", blue-cast views); the sun; the last page; the ending card.
- Witness 3 is Middot 2:4 (the line of sight), with the gate-axis caveat in its note; witness 4 builds the 187-cubit court section by section (no longer paced from the gate). The journal map now draws the layers: floor wash, summit ring, line, the open middle, the loose court.
- Act 5 title "The Seventh Lamp". Tester: "Play Acts 1 to 5 as if done". Test: scratchpad act5.js plays it through.

### Act 5 assets still to come
Portraits: yoel (seventy-eight, flat cap, wool coat, rod and cane, very straight, quick eyes), tal (police escort, twenty-five, pale blue shirt, earpiece).
Objects (img/fsy/pz/): brassplate (the flat brass plate on the rod's end under the grate: soot, the lamp spout right, a date, six reversed words).
Clips (then add to CLIPS in fsy-act5.js): haller-barrier, rod-grate, haller-shutter, yoel-measure, gate-sun.
Shlomi (then add to HAVE in fsy.js): w-mughrabi-goup, w-mount-three, w-verdict-five, w-seven, w-act5-end, w-final-when.
Yoel's voice (a second ElevenLabs voice, older and drier; ids yoel-1 … yoel-6, then add to HAVE): the six answers at the gate.
Views if wanted: the Kidron path and the gate outside at dawn (the Act 4 pictures serve with a blue cast).

## v5j — Gerry's three (6 Nov): the airport note, the People page, the recap
- Airport: in the arrivals hall after passport control, a slip under the journal's cord, "He knows you have it." Neat old hand, author unstated (it is the Lamplighter's; the hand matches his envelopes; Gethsemane gives it meaning). Item "airnote", an Evidence fact. It is not listed under the Lamplighter on the People page.
- Journal: a People tab. Everyone the player has spoken to (plus the Lamplighter, Haller, Ben-Ami, Noor, Tal, Yoel, Moti from their card scenes), with portrait, place, one line, and notes that appear only when the matching fact, item or flag is in the player's hands. No verdicts.
- "Previously…": after 20 hours away (W().flags.seen is stamped on every scene change), reopening the episode shows the last three milestones and where the player is, with Go on. Also a "Previously…" button in the journal.
- New file fsy-extras.js, loaded last.

## v5k — every Act 4 and Act 5 asset in
- Portraits: shira, benami, noor, matteo, hallerphone, moses, yoel, tal. Objects: photo1, accords, annex, brassplate.
- Clips: plate-drops, benami-package, noor-photo, haller-phone, matteo-gap, haller-barrier, rod-grate, haller-shutter, yoel-measure, gate-sun (all cropped 720→480 square; gate-sun trimmed 2.8 s at the start).
- Shlomi: the five Act 4 lines and the six Act 5 lines. Yoel: six lines in the ElevenLabs library voice "Ergun Kalbak" (originals in images/originals/fsy/audio/yoel). Processing script for Yoel: scratchpad yoel.py (same as shlomi3.py, no w- prefix).
- Still silent: w-hebron-prices ("Remember the witnesses."), until credits reset on 24 Nov.

## v5l — the last line: w-hebron-prices ("Remember the witnesses."). Every line in Episode 1 is now voiced.

## v5m — Gerry's puzzle notes, first pass (discovery over instruction)
- Hezekiah's Tunnel: at each fork the player chooses what to try (listen, the lamp low, a scrap of paper); one tells the truth there, the others say nothing useful; the clue is shown (ripple, flame leaning, the scrap drifting), heard and written. Dead ends dim the lamp to a bead and never put it out. After the meeting point, the charcoal is found by sweeping the lamp along the wall with a finger; then silence, the lines one at a time, "He is alive." Hints: three levels.
- The verdict (Act 5): a readout under the plan says in words which of the four fixed layers fit as the court moves.
- The telescope (Act 2): no explanation. "Page 4 of the journal" shows the margin sketch; the view is blurred until "Focus the glass"; off-target focus names what is there and nothing more. Hints: Avi's doves → the margin → the arches.
- The false weight (Act 2): the trader weighs the price; it balances at twelve coins where Yosef's half shekel balanced ten. The player can pay anyway (map, no "caught" fact) or take the bekah from the pack, set it on the pan, and weigh his three against it.

## v5n — Gerry's puzzle notes, fourth item: the storm (Act 2)
- The thunder is seen as well as heard: the sky flashes THUNDER, the wall shakes, the Thunder button lights.
- A second count runs on the sky (1 · 2 · 3 …) from the flash, so the player can see the gap, not only feel it.
- "Watch it again" replays the round in hand (flash, count, thunder, and the distance in words); a missed round offers it. The choice card has "Watch the three flashes again".
- The choice card shows the three gaps in a table, says the storm is in the west and closing, and says where each way down is: ahead is west, into it; behind is east, away from it, 400 m and a covered street; the tower is open to the west. The consequence (page 4 wet) is unchanged; the reason for it is now on the card.

## v5o — Gerry's review of v5m (score 7.5 → 8)
- Hezekiah's Tunnel, the sweep: a timer now decides the hold, not the next move event, so a finger held perfectly still on the charcoal reveals it after 0.65 s. Lifting the finger or moving off cancels it. Tested with a single press and no further movement.
- The trader's false weight: it is now HEAVY throughout. The first weighing needs twelve coins where Yosef's took ten; in the comparison his false weight sinks his side ("His side sinks. Heavy: twelve, not ten."). Relabelled "Half shekel, old" (a worn weight would read as light). Fact, the "Caught" card and hint 3 all say heavy.

## v5p — Richard's first iPhone playtest: the cash machine
- The bank card and the "Psalm 48:2" scrap now come at the airport, with the note under the journal's cord, in the Watchman's hand: "For the cash machines, when the shekels run out. Four digits." In the Backpack from then on. Older saves past the airport get the card quietly.
- The Hebrew screen: a line says there is always a language button; after one wrong button it says which (bottom right) and the key shows 🌐 שפה.
- The PIN screen shows the scrap, "Psalm 48:2", with "The machine wants four digits." After two wrong PINs: "The Watchman writes everything as a verse: chapter, then verse."
- The map key: "Done · tap to go back".

## v5q — iPad
- The app is now iPhone and iPad (TARGETED_DEVICE_FAMILY 1,2). iPhone stays portrait-only; iPad allows all four orientations, as Apple expects of iPad apps.
- On iPad the whole page is enlarged with WKWebView.pageZoom (ZoomingWebView in LampWebView.swift): laid out about 430 × 900 points, then scaled to fit, in 5% steps, between 1× and 1.8×. Text stays crisp; taps and drags line up exactly as on the phone.
- Landscape on iPad: the game stays a tall column; the current scene fills the sides, blurred and dark, instead of flat navy.
- Tested at iPad sizes: Acts 1–5 portrait, Acts 3 and 5 landscape (tunnel wall, grate, verdict plan), all pass.
- Not yet done: re-exporting scene pictures larger (175 of 348 have a larger original here; the crops need aligning first so tap spots don't move). App Store iPad screenshots (13-inch) to make before submission.

## v5r — iPad fix (Richard's first iPad run: page offset right, bottom cut off, could not start)
- v5q's WKWebView.pageZoom enlarged the page without re-fitting the layout, so it overflowed right and bottom. Removed.
- Now: the web view always asks for the mobile page (preferredContentMode .mobile; iPad otherwise picks the desktop-class page), and a small script at the top of index.html sets the viewport tag on an iPad window: width = window ÷ zoom, initial/min/max scale = zoom, zoom = fit of 430 × 900 in 5% steps, 1×–1.8×. Phones and narrow iPad windows keep width=device-width. Re-fits on rotation.
- Tested in a mobile browser at iPad 11", 13", mini (portrait) and 11" landscape: the title page with Enter, scenes, Acts 1, 2, 3 and 5 play through. iPhone unchanged.

## v5s — Episode 2, Act 1 prototype (The Ninth of Av)
- New file app/www/js/fsy-ep2.js, built from the approved Act 1 script (Gerry 8.5/10, "ready to prototype"). Tester builds only: a button on the Episodes screen ("Episode 2 · The Appointed Time") when TESTER is on in dev.js. Its own save (Lamp.state.ep2); Episode 1 progress is not touched. The tester Skip button works scene by scene.
- Prologue and seven scenes, playable start to finish: the rod handle; the Lamplighter's desk and calendar; Haller at the airport; train, taxi and the walk down; the Wall on 9 Av (no puzzle); the Street of the Chain (three shops, two lamp marks, the 9:27 clock, the watchmaker's rod test), Yoel's room and the optional seventy weeks; the first frame (three invented documents, Yoel's D1 ruling marked provisional, the torn page grey); the ring of Av and the sunset marker (no timing test), the car door.
- Stand-ins: every picture is an Episode 1 photo, labelled "Stand-in picture" in tester builds. Yoel's seven lines (e2-*) show as cards and subtitles; when recorded, add their ids to HAVE in fsy-ep2.js and put the files in audio/narration as fsy-e2-*.mp3.
- Open: the coffee cup shows "your name" because the game has no player name; new pictures and portraits per the script's asset list.
- Tested by script at iPhone size: full playthrough without Skip, no errors.
- (after v5s) Episode 2 portraits placed: watchmaker, clockseller, souvenir, taxidriver (img/fsy/people, originals in images/originals/fsy/people). Shown in the shop, watchmaker, clock and taxi cards.
