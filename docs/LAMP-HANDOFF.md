# LAMP — Bible Word Puzzle · Project Handoff

**Prepared:** October 24, 2026 · **Owner:** Richard J. Allinson
**Status:** Concept agreed; playable web demo built and tested. No app code, App Store record or image set exists yet.
**Moved from:** the "Meal planner" (Weekly Table) project. Start the new project with this file.

---

## 1. What Lamp is

A relaxing word puzzle game in which **you rebuild Bible verses**.

- A verse is shown with words missing. A wheel of letters at the bottom gives the letters for those words.
- You tap the letters in order and press ✓ (or slide a finger across them). The word drops into the verse.
- Each level in a story hides **more** of the same verse. The last level is **"from memory"**: you tap all the words of the verse back into order.
- A painting fills the screen behind each story. It starts dark and **lights up level by level**, and finishing the story adds it to your collection.
- Every verse ends with its reference and a short **"Why it matters"** note.

**One line:** *The word game that helps you learn scripture by heart.*

**Name:** **Lamp: Bible Word Puzzle**, from Psalm 119:105, *"Thy word is a lamp unto my feet, and a light unto my path."* Richard checked on Oct 24 that it is not taken on the App Store. **Not reserved yet** (see §9).

---

## 2. How we got here (decision history)

Richard asked what other Bible-related app suits his building style. Ideas considered:

| Idea | Outcome |
|---|---|
| Bible Atlas & Timeline | Dropped. Richard's App Store search showed no interest. |
| Prayer journal | Dropped. Hallow dominates; little else does well. |
| Bible trivia / quiz | Dropped as main app. Crowded and hard to get established. Might become a "question of the day" mode. |
| Scripture memory | Folded into Lamp as the core mechanic. |
| Prophecy Chronology Explorer | Better as a new **section inside Hebrew Calendar Explorer** (Daniel's 70 weeks, kings of Israel and Judah, feast cycle). This is still a good idea for HCE. |
| **Bible word puzzle** | **Chosen.** It is a proven format, and Richard noticed puzzle games doing well. |

### Richard's app style (from Weekly Table and Hebrew Calendar Explorer)
- Built for a specific audience (HCE's subtitle: "For pastors and Bible teachers").
- Accuracy you can prove: cited sources and double-checked data.
- A teaching tool, not just a reference.
- Navy, cream and gold palette, serif headings, white cards.
- Uses the iPhone fully: widgets, Watch, reminders, location.
- No account, no ads, data stays on the device, works offline.

---

## 3. Market research (Oct 24, 2026)

| App | What it does | Size | Money | Main complaints |
|---|---|---|---|---|
| Bible Word Puzzle (Oakever Games) | Letter wheel; levels unlock Bible-story pictures; 900+ levels; **verses are only a reward** | ~1.1M reviews, 4.7★ | Free + heavy ads, coins | Too many ads; some secular content |
| Bible Coloring Paint by Number (Oakever) | Colouring + daily verse | 172K ratings, 4.8★ | Ads; $1.99/wk, $4.99/mo, $39.99/yr, $4.99 lifetime | Long, sometimes mature ads; Santa pictures; one device |
| **Bible Word Games: Puzzles App (Touchzing)** | **Same mechanic: fill a verse's gaps from letters** | ~1.5K ratings, 4.8★; **160 verses** | Subscriptions up to $49.99 | — |
| Word Cross Bible | Swipe letters; unlocks 1,000+ verses | ~2K ratings | Pop-up ads; $0.99 to remove | Ads |
| Bible Game – Verses (Android) | Find missing words; 3 wrong guesses | ~10K downloads | Ads after every level | Ads |
| Bible Word Connect Game | Spell words; unlock verses and picture pieces | 162 ratings | Coins up to $49.99 | — |
| Biblegram | Daily verse code-breaker + devotional | New, tiny | Free | — |
| Verses – Bible Memory | Memory **study tool** (6 drills) | ~3.9K ratings | $4.99–9.99/yr | Speech recognition, strict capitals |
| Bible Memory App, Remember Me, Versify, VerseLocker, Fighter Verses | Flashcard and typing memory tools | Various | Free to $49.99/yr | Study tools, not games |
| Bible App for Kids (YouVersion/OneHope) | Kids' stories | 100M downloads | Free | **Don't compete** |

Wider market: puzzle is the #2 mobile genre, about $7.6bn in H1 2026 and up 20%. The top is match-3 and merge (Royal Match, Candy Crush), which is studio-scale and not realistic for one person.

**Honest conclusion:** the verse-filling idea is **not new**, but the competition in this exact format is weak. The best has about 1,500 ratings, 160 verses, a $49.99 subscription and no art. Expect a **well-made niche game with a loyal following**, grown through Richard's Facebook page (*The Final Seven Years*), Hebrew Calendar Explorer users, churches and homeschool families. Do not expect a million downloads.

### Where Lamp is clearly better
1. **Real memorisation:** the same verse is hidden more each level until it's recited. Nobody else does this.
2. **Size:** 1,000+ verses, Genesis to Revelation in order (against 160 by topic).
3. **One painting per story**, which lights up and is collected.
4. **No ads, no subscription:** a one-time unlock.
5. **Accuracy and teaching:** reference and context note on every verse.
6. **Daily shareable puzzle** plus a gentle streak.

Sources: pocketgamer.biz H1 2026 genre analysis · marlvel.ai (Oakever review summary) · apps.apple.com listings id1441949789, id1510478945, id1514093015, id6444801575, id1545381889, id939461663 · justuseapp.com Bible Trivia reviews · doc.remem.me/best-bible-memory-apps · churchleaders.com (Bible App for Kids 100M) · catholicapps.com (Touchzing) · Google Play listings (Bible Game – Verses; Bible Word Puzzle by Bible Studios).

---

## 4. Version 1.0 scope

### The journey (main mode)
- Stories in Bible order, grouped by book (Genesis → Revelation).
- About **1,000–1,200 levels** from the best-known, most teachable verses (not every verse).
- Difficulty grows: 4-letter wheels early, 7 later; more hidden words; longer verses.
- A map screen showing progress through the 66 books.

### A level
- The verse with blanks above; the letter wheel below.
- Target words come from the verse; extra real words are **bonus words** and earn lamp oil.
- Finishing shows the full verse with your words highlighted.
- Final level of each story: **from memory** (word tiles in order).

### Lamp oil (hints)
- A hint reveals a letter and costs 1 oil.
- Oil is earned by playing (bonus words, levels, the daily puzzle). **It can never be bought.**

### Engagement (built into the demo)
1. **The painting lights up** level by level. Brightness = 0.3 + 0.7 × (levels done ÷ levels in story); saturation rises too; 1.4 s fade.
2. **Daily verse:** one puzzle a day, the same for everyone. Result card shows 🪔🪔🪔 (no hints), 🪔🪔 (1 hint) or 🪔 (more), plus time and streak, with a copy-to-share button.
3. **"Keep the lamp lit" streak:** lit by finishing one level a day. **One rest day per week (Sunday–Saturday) never breaks it.** It's a Sabbath idea, with no guilt messages.

### Also in 1.0
- "Verses gathered" collection (scroll, search, favourite, share).
- Settings: text size, sound and vibration, colour-blind-friendly colours.
- Saved on the device; optional iCloud sync (the same system as Weekly Table).
- No account, no ads, offline, no tracking. Age rating 4+.

### Later versions
- **1.1:** widget with the daily verse; one daily reminder at a chosen time.
- **1.2:** three flames per level (no hints + all bonus words); **verses come back for review** (spaced repetition, about 20-second checks); verse scramble; trivia question of the day with the answer and verse always shown.
- **1.3:** more levels; themed packs (Psalms, parables, prophecy).
- Possibly: collections and badges ("The 12 Disciples", "Torah complete"); golden-verse levels worth double oil; a hidden bonus word of the day; soft sounds and haptics; family and church challenges via Game Center; Hebrew or Greek word of the day.

### Deliberately left out
Ads, energy timers, buying oil or coins, accounts, chat, "You lost your streak!" messages, non-Bible content, match-3 effects, a separate kids' mode.

---

## 5. Open decisions

| Decision | Options | Recommendation |
|---|---|---|
| Bible text | **KJV** (familiar to the audience; free in Canada and the US; under Crown copyright in the UK) or **World English Bible** (public domain everywhere, modern English) | KJV, possibly with WEB as an option later |
| Pricing | A: free download, Genesis–Deuteronomy free, one-time unlock about **$4.99**. B: paid upfront about $2.99 | **A** |
| Picture tool | Midjourney / ChatGPT / Firefly / Ideogram (commercial-use terms needed; Firefly is safest on copyright) | Whichever Richard used for the test pictures; keep Picture A as the style reference |
| Depicting Jesus or God | Show people from behind, in silhouette, or as landscapes and objects | Avoid faces of Jesus and God |
| App name | Lamp: Bible Word Puzzle (fallbacks: Lamp: Bible Word Game / Lamp: Bible Puzzles) | Reserve soon |

---

## 6. Design

**Look:** a full-screen oil painting per story, with dark glass panels over it. Navy, cream and gold, matching Weekly Table and HCE.

Tokens used in the demo:
```
--night #0B1328   --navy #141A33   --glass rgba(12,18,40,.62)
--gold #C9A24A    --gold-soft #F3E9CE   --cream #FBF8F0   --ink #141A33
Display/verse: "Cormorant Garamond" (Google Fonts), Georgia fallback
UI: "Figtree" (Google Fonts), system sans fallback
```
- The verse sits in a glass card near the top. Blanks are small rounded squares; filled letters are cream tiles.
- A dark gradient is laid over the painting at the top and bottom so text stays readable over bright pictures.
- Pop-up cards are cream, sliding up from the bottom.

### Pictures
- **One picture per story, not per level:** about **120–150 pictures** in total, about 200 KB each once compressed, roughly 30 MB.
- **Format:** tall 9:16 (for example 1080×1920). Keep the bottom third calm and dark for the wheel. **No text** anywhere in the picture.
- **Style reference: Picture A** (`images/lamp-001-creation-pictureA.png`), Richard's choice. Upload it with every prompt and ask for "match the style of this image".
- **Picture B** (`images/lamp-002-psalm119-pictureB.jpg`) is the darker, more painterly alternative. The demo uses it for Psalm 119 and the daily verse.
- **Free alternative:** Gustave Doré's Bible engravings (1866, public domain, about 240 plates covering the whole Bible) could be tinted navy and gold.

**Prompt used for Picture 1 (Creation)** — reuse the style and composition paragraphs for every picture:
```
A dramatic, reverent painting of the first day of creation, "Let there be light." A vast dark ocean under a deep navy sky; a single brilliant golden light breaks through swirling clouds in the upper middle of the frame, sending soft rays down across the rippling water. No people, no figures, no faces, no hands. Majestic, peaceful, awe-inspiring.

Style: classical oil painting with visible brushwork, in the tradition of 19th-century biblical landscape art; warm lamplight glow; limited palette of deep navy, midnight blue, warm gold and soft cream; gentle film grain; rich but not cluttered.

Composition: tall vertical 9:16 phone format. Main light and detail in the upper two-thirds. The bottom third is calm, dark, simple water with low detail, so text and buttons can sit on top of it.

Do not include: any text, letters, words, numbers, signatures, watermarks, borders, frames, people, angels, modern objects.
```
(Midjourney: add `--ar 9:16 --style raw`.) Save each one as `lamp-NNN-story.png`.

**Next picture test suggested:** Noah's Ark resting on the mountain with a rainbow. It checks that objects (not just landscapes) keep the same style.

---

## 7. The demo (files in this handoff)

| File | What it is |
|---|---|
| `lamp-demo.html` | **Open this.** A standalone playable demo (pictures embedded). Works in Safari or Chrome on phone or computer. Fonts load from Google Fonts when online. |
| `lamp-demo-source.html` | The same code without pictures, with placeholders `__IMGA__` and `__IMGB__` for the two images. This is the easiest copy to edit. |
| `images/lamp-001-creation-pictureA.png` | Picture A, full size (chosen style) |
| `images/lamp-002-psalm119-pictureB.jpg` | Picture B, full size |
| `images/a720.jpg`, `images/b720.jpg` | The 720-px compressed versions embedded in the demo |
| `images/picture-A-vs-B-mockup.png` | Both pictures behind a mock puzzle screen |
| `BIBLE-GAME-RESEARCH.md`, `LAMP-TEST-NOTES.md` | Earlier notes from the Weekly Table project |

Online copy of the demo: the private claude.ai artifact **"Lamp"** (version 4), https://claude.ai/artifact/PEDbgYZTKyHNz72YRv7KLg

### What the demo contains
- **Story chooser** with the streak card and week row. A test-only link, "pretend I played the last 6 days", shows a week including a rest day.
- **Creation:** Genesis 1:3, Picture A, 4 levels:
  1. LIGHT (wheel L-I-G-H-T)
  2. SAID + AND (S-A-I-D-N)
  3. THERE + BE (T-H-E-R-E-B)
  4. from memory
- **A Lamp unto My Feet:** Psalm 119:105, Picture B, 5 levels:
  1. LAMP
  2. WORD
  3. FEET (two E's on the wheel)
  4. PATH + LIGHT from the 7-letter wheel P-A-T-H-L-I-G
  5. from memory
- **Today's verse:** 1 John 4:8 (KJV), GOD + LOVE from wheel L-O-V-E-G-D; the result card has a copy button.
- **Controls:** tap letters then ✓, or slide; ✕ clears; tap the last letter again to remove it; a one-time demo on the first level ("Watch: tap L, I, G, H, T…"); Hint (1 oil), Shuffle, Bonus list. Oil starts at 3.

### Story data format (how levels are written)
```js
{ id:"lamp", title:"A Lamp unto My Feet", book:"Psalms", ref:"Psalm 119:105", img:"<image>",
  verse:["Thy","word","is","a","lamp","unto","my","feet,","and","a","light","unto","my","path."],
  levels:[
    {wheel:"LAMP", hide:["LAMP"], bonus:["PALM","MAP","LAP","PAL","AMP"], tip:"..."},
    {wheel:"PATHLIG", hide:["PATH","LIGHT"], bonus:[...], tip:"..."},
    {recall:true}            // final "from memory" level
  ],
  note:"Why it matters ...", next:"Next story title" }
```
- `wheel` = the letters on the wheel. Every `hide` and `bonus` word must be spellable from them (a letter is used once per word unless it appears twice).
- `hide` = the words removed from the verse. Matching ignores punctuation and case; one word fills **every** place it appears in the verse.
- `bonus` = accepted extra words, which earn +1 oil each. The real app should use a **family-safe English word list** instead of hand lists.
- A daily puzzle is a story with `daily:true` and one wheel level.

### Streak rule (exact)
- Days are stored as `YYYY-MM-DD` on the device.
- Count backward from today, or from yesterday if today isn't played yet.
- A missed day counts as a **rest day** only if the day before it was played and that Sunday-to-Saturday week hasn't used its rest day.
- A second gap ends the streak.

### Lessons from testing
- **Dragging confused Richard at first.** Tap-then-✓ plus a short demo fixed it, so keep both input methods and the first-level demo.
- An apostrophe inside a single-quoted JavaScript string broke the whole page once ("This story's"). Use ’ in text, or escape it.
- A CSS rule (`#app>*{position:relative}`) overrode the pop-up card positioning. Overlays must stay `position:absolute`.

---

## 8. Building the real app (plan)

- **Same method as Weekly Table:** a web app (HTML, CSS and JavaScript) inside a small Swift iPhone shell (WKWebView). The demo code is the starting point.
- **Two-zip delivery**, as with Weekly Table: `lamp-apple-vXX.zip` (the whole Xcode project) and `lamp-git-vXX.zip` (the www folder).
- **Level generation:** a script reads the Bible text (KJV), picks the verses for each story, chooses the hidden words, builds the smallest wheel that spells them, finds the bonus words from the word list, and **checks every level automatically**:
  - every word is spellable
  - the verse text and reference match the source
  - no blank is impossible
- **Swift parts** (like Weekly Table's bridges): the rating prompt (SKStoreReviewController), the daily reminder (local notification), the widget (1.1), iCloud sync of progress, haptics.
- **Privacy:** nothing collected; progress stays on the device or the user's own iCloud.

---

## 9. Next steps (in order)

1. **Reserve the name.**
   - developer.apple.com → Identifiers → + → App IDs → App; Description "Lamp"; Bundle ID **com.richardallinson.Lamp**.
   - App Store Connect → Apps → + → New App: iOS; Name **Lamp: Bible Word Puzzle**; Primary language English (Canada); that Bundle ID; SKU **LAMP001**.
   - Apple has rules on how long a name can be held without a build, so don't leave it empty indefinitely.
2. **Decide:** KJV or WEB; pricing A or B.
3. **Second picture test:** Noah's Ark with a rainbow, using Picture A as the style reference.
4. **Picture list:** Claude writes one prompt line per story from Genesis to Revelation (file name, story, verse, what to draw). Richard makes them in batches; Claude checks and compresses them.
5. **Level list:** Claude drafts the story-and-verse list for 1.0 (about 120–150 stories, 1,000–1,200 levels) and the generator with its checks.
6. **Build 1.0:** journey map, level screen, from-memory level, daily verse, streak, collection, settings; then the Xcode shell.
7. **Store listing:** subtitle (for example *Learn scripture by heart*), keywords, screenshots (the painting light-up is the showpiece), privacy answers ("Data not collected").

---

## 10. Starting prompt for the new project

> I'm building **Lamp: Bible Word Puzzle**, an iPhone word game where you rebuild Bible verses from a letter wheel, verse by verse, and learn them by heart. The handoff file **LAMP-HANDOFF.md** and the demo **lamp-demo.html** are in this project. Read the handoff first. Build it the same way as my Weekly Table app (web app inside a Swift WKWebView shell, two-zip delivery). Next step: [pick one from §9].
