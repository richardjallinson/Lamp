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
