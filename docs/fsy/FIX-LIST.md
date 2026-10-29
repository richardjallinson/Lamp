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

## Next batch (for v4f)

| # | Fix | Status |
|---|---|---|
| 1 | Map numbers hard to read: the places not reached yet were faded to 45%. Now solid dark circles with clear white numbers (a dashed rim for not yet reached), a little bigger. Also the place name no longer sits on top of the map's own heading | Done in code, waiting for the build |
