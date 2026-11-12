# LAMP: the torn scroll, a side quest across two episodes (12 Nov 2026)

Richard's idea (12 Nov 2026): two notes planted in Episode 1 fit together as a broken scroll. They open a side quest about one question: when will Jesus return? The street preacher in Episode 2 asks it aloud, and the clock he leaves at the watchmaker's answers it from 2 Thessalonians 2:3, as in Richard's book.

All of it is in the game from build v6i.

## Richard's rulings (12 Nov 2026)

1. The street preacher wrote the scroll. Who he was (Elijah, Moses) is never told.
2. The player finds 2 Thessalonians 2:3 at the watchmaker's shop, in a clock the preacher left. It shows how little time is left, because the covenant with many is about to be signed by the President. The order: apostasy first; then the man of sin revealed; then that day, our gathering unto Christ.
3. The scroll has its own journal page.

## The pieces

| Piece | Where | Text (KJV) | Status |
| --- | --- | --- | --- |
| Top half of the scroll | Episode 1, Act 2: the Tombs of the Prophets, folded inside the note in Malachi's niche | Malachi 3:1–2 | Built |
| Bottom half of the scroll | Episode 1, Act 2: the last view, in a crevice of the wall by Jaffa Gate where the middle candle of the nine falls (Richard's own Hanukkah photograph) | John 10:22–23 | Built |
| The line across the tear | Readable only when the halves are joined | "His first coming, his second, or both?" | Built |
| The question said aloud | Episode 2, Act 2, Scene 1: the street preacher outside Jaffa Gate. If the player holds a half, the pencil in his Bible's margins looks like the hand on the scroll | Luke 21:28 | Built |
| The answer | Episode 2, Act 2, Scene 2: the watch-repair shop. "Ask about the clock on the shelf that is not running." Optional; the act does not wait for it | 2 Thessalonians 2:1 and 2:3 | Built |

## The clock

A brass mantel clock with one hand and no hours. Three marks before twelve, numbered 1, 2, 3. It has no movement; the back holds a folded paper in pencil with 2 Thessalonians 2:1 and 2:3 and three lines: 1. A falling away first. 2. That man of sin revealed. 3. That day: our gathering together unto him. The hand has passed the first mark and stands a hair short of the second.

The watchmaker: the man left it on Friday before the Sabbath, paid, and said not to mend it, because it shows the right time. "I asked his name. He said it did not matter. My wife says Elijah. My neighbour says Moses. I say a man who pays in advance." And: "I asked him how long. He said: ask who is about to sign."

The game does not say who the man of sin is.

## The journal

- Episode 1: a fifth tab, "The scroll", appears once the player holds a half. It shows the halves held, the joined scroll once fitted, and the clock once found.
- Episode 2: a button "The torn scroll" in the journal opens the same page; the second book also gets a page "The preacher's clock".
- It works for a player who holds one half, both, or neither, and who did or did not find the clock.

## Still open

- The middle candle as the symbol of completion (Richard) is not yet said in the game.
- Whether the clock's hand moves later (for example to the second mark at the midpoint in Episode 3).
- Whether the preacher appears again.

## Code

- js/fsy.js: malNote() inside tombs(); flag P().noteMal.
- js/fsy-act2.js: C.ACTS_FN.johnNote and C.ACTS_FN.fitScroll; flags A().f.noteJohn and A().f.scrollFit.
- js/fsy-route.js: scrollState() and scrollHTML() (the shared page), the "scroll" tab in journal(); scene gtomb, view "dusk", tap spot at the middle candle.
- js/fsy-ep2.js: ACT.bpreacher, ACT.bclock, clockSVG(), scrollPage(); flags b:preacher, b:clock, book:clock.
